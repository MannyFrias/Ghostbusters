/* =========================================================================
                               - TL;DR - 
   =========================================================================
   This file acts as the "Frontend Reader." Its job is to open a specific
   React file, scan the code, and hunt for any time
   the developer used the `fetch()` command.

   HOW IT WORKS:
   1. It takes a file path as input.
   2. It turns the code into a Tree (AST) so we can walk through it.
   3. It stops at every function call it sees.
   4. If the function is named "fetch", it grabs the URL inside it.
   5. It returns an array of objects of all the URLs found in that file.
   ========================================================================= */

import fs from 'fs/promises';
import parser from '@babel/parser';
import traversePkg from '@babel/traverse'; 
const traverse = traversePkg.default;

export async function parseFrontend(filepath){
  //create an empyt array to hold the routes we'll find. As we find fetch calls, we will push them into this list. This is what the function returns at the very end
  const results = [];

  //setting up an array to track variable names that are actually axios instances 
  const axiosAliases = new Set(['axios']);

  try {
    // 1. Read the file content: open 'filePath' and read all the text into a variable called 'code'
    const code = await fs.readFile(filepath, "utf-8"); //interpret the file as a string of text. If left out, Node returns a Buffer (raw hexadecimal numbers), which Babel cannot read.

    // 2. Parse the code into AST (text -> tree) w/Babel
    // - Tells Babel this is a "module" (allows import/export)
    // - Enable plugins for "jsx" (React) and "typescript" (just in case)
    const tree = parser.parse(code, {
      sourceType: "module",
      plugins: ["jsx", "typescript"], // Enable React & TS  parsing support (left ts in there just in case)
    });

    // 3. Traverse the tree. Babel Traverse will visit every node in the AST
    traverse(tree, {

      //Search for axios aliases first
      VariableDeclarator({ node }) {
        //search for const api = axios.creator()
        if (node.init && node.init.type === 'CallExpression') {
          const { callee } = node.init;
          if (
            callee.type === 'MemberExpression' &&
            callee.object.name === 'axios' &&
            callee.property.name === 'create'
          ) {
            //when an axios instance is found then add the variable to our allowed list
            axiosAliases.add(node.id.name)
          }
        }
      },

      CallExpression({ node }) {
        
        const { callee, arguments:args } = node;
        
        //FETCH first
        // Check if the function name is 'fetch'. In a function call, the "callee" is the thing being executed.
        if (callee.type === "Identifier" && callee.name === "fetch") {
          //we're going to assume "GET" is the default method
          let method = "GET";

          //check for the options object - for example fetch('/url', { method: 'POST })
          const options = args[1];

          if (options && options.type === "ObjectExpression") {
            
            //then look for the property named "method" inside the object
            const methodProp = options.properties.find(
              (prop) =>
                prop.key.type === "Identifier" && prop.key.name === "method",
            );

            //if method: POST, then grab the value
            if (methodProp && methodProp.value.type === "StringLiteral") {
              method = methodProp.value.value.toUpperCase();
            }
          }
          extractRoute(args[0], method, results, filepath, node.loc.start.line);
        }
        //MANAGE AXIOS CALL & any aliases
        // Looks for axios.post(), axios.delete(), etc.
        else if (
          callee.type === "MemberExpression" &&
          callee.object.type === "Identifier" &&
          //checking in axios aliases so is it axios or does it have a known alias like api
          axiosAliases.has(callee.object.name)
        ) {
          // property.name is 'get', 'post', 'delete', etc.
          const method = callee.property.name.toUpperCase();
          extractRoute(args[0], method, results, filepath, node.loc.start.line);
        }
      },
    });
  } catch (error) {
    console.error(`Error parsing frontend file ${filepath}:`, error);
  }

  return results;
}

//----Adding helper function to manage strings & template literals----
function extractRoute (arg, method, results, file, line){
    //if ar argument does'nt exist 'fetch()' an empty call, then exit
    if(!arg) return;

    //start with an empty variable 
    let route = null;

    //checks the type of AST node to see if it is a normal string
    if (arg.type === 'StringLiteral'){
        //if normal string then grab the actual text and save it to route
        route = arg.value;
    }
    //if arg wasn't a string literal then babel uses "TemplateLiteral" to check if the arg has a template literal
    else if(arg.type === 'TemplateLiteral'){
        //Quasis is a compiler term refering to the static text parts of a template string 
        //using .map and .join to turn '/api/items/${id}/detail' into '/api/items/*/details'
        route = arg.quasis.map((q) => q.value.raw).join('*');
    }
    if(route) {
        results.push({route, method, file, line})
    }
}

