/* =========================================================================
   TL;DR - HIGH LEVEL OVERVIEW
   =========================================================================
   WHAT THIS DOES:
   This file acts as the "Backend Reader." Its job is to open Express/Node
   files, scan the code, and hunt for route definitions like `app.get()`
   or `router.post()`.

   HOW IT WORKS:
   1. It takes a file path as input.
   2. It turns the code into a Tree (AST).
   3. It looks for "Member Expressions" (calls with a dot, like `obj.method()`).
   4. It checks if the method is an HTTP verb (get, post, put, delete).
   5. It grabs the path string (e.g., '/api/users') and saves it.
   ========================================================================= */

import fs from 'fs/promises'; // Use promises for async reading
import parser from '@babel/parser';
import traversePkg from '@babel/traverse';
const traverse = traversePkg.default; // .default is needed for ES6 imports

export async function parseBackend(filepath) {
  // Create an empty array to hold the routes we'll find
  const results = [];

  try {
    // STEP 1: READ THE FILE
    // Open 'filePath' and read text into 'code'
    const code = await fs.readFile(filepath, 'utf-8');

    // STEP 2: PARSE THE CODE
    // Turn 'code' into an AST
    // Enable "typescript" plugin (common in backends) even if using JS.
    const tree = parser.parse(code, {
      sourceType: 'module',
      plugins: ['typescript']
    });

    // STEP 3: TRAVERSE THE TREE
    traverse(tree, {
      
      // We are looking for "CallExpressions" (any function call)
      CallExpression({ node }) {
        
        // CHECK 1: IS IT A METHOD CALL? (Dot Notation)
        // We look for "MemberExpression" (e.g., app.get)
        const { callee } = node;

        if (callee.type === 'MemberExpression') {
          
          // Get the name of the property (e.g., "get", "post")
          const propertyName = callee.property.name; 
          
          // DEFINE VALID METHODS
          // We only care about these specific Express route handlers. So it wouldn't matter if we're using app or router
          const expressMethods = ['get', 'post', 'put', 'delete', 'patch'];

          // IS IT AN EXPRESS ROUTE?
          if (expressMethods.includes(propertyName)) {
             
             // EXTRACT THE ROUTE
             // Grab the first argument (arguments[0])
             const arg = node.arguments[0];

             //use helper function to extra
             const path = extractRoutePath(arg);

             if (route) {
                results.push({
                    path: route,
                    method: propertyName.toUpperCase(),
                    file: filepath,
                    line: node.loc.start.line
                });
             }
          }
        }
      }
    });

  } catch (error) {
    // Print "Error parsing backend file" without crashing the app
    console.error(`Error parsing backend file ${filepath}:`, error);
  }
  // Return the list of findings
  return results;
}


//----Adding helper function to manage strings & template literals----
function extractRoutePath (arg) {
    //if ar argument does'nt exist 'fetch()' an empty call, then exit
    if(!arg) return null;

    //checks for simple quotes ex ('/api/users')
    if (arg.type === 'StringLiteral') {
        return arg.value;
    }
    
    //if arg wasn't a string literal then babel uses "TemplateLiteral" to check if the arg has a template literal
    if(arg.type === 'TemplateLiteral') {
        //Quasis is a compiler term refering to the static text parts of a template string 
        //using .map and .join to turn '/api/items/${id}/detail' into '/api/items/*/details'
        return arg.quasis.map((q) => q.value.raw).join('*');
    }
    
    return null;
}