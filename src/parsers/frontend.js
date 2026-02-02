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
   5. It returns a list of all the URLs found in that file.
   ========================================================================= */

import fs from 'fs';
import parser from '@babel/parser';
import traversePkg from '@babel/traverse'; 
const traverse = traversePkg.default;

export function parseFrontend(filepath){
  //create an empyt array to hold the routes we'll find. As we find fetch calls, we will push them into this list. This is what the function returns at the very end
  const results = [];

  try {
    // 1. Read the file content: open 'filePath' and read all the text into a variable called 'code'
    const code = fs.readFileSync(filePath, "utf-8"); //interpret the file as a string of text. If left out, Node returns a Buffer (raw hexadecimal numbers), which Babel cannot read.

    // 2. Parse the code into AST (text -> tree) w/Babel
    // - Tell Babel this is a "module" (allows import/export)
    // - Enable plugins for "jsx" (React) and "typescript" (just in case)
    const tree = parser.parse(code, {
      sourceType: "module",
      plugins: ["jsx", "typescript"], // Enable React & TS  parsing support (left ts in there just in case)
    });

    // 3. Traverse the tree. Babel Traverse will visit every node in the AST
    traverse(tree, {
      CallExpression({ node }) {
        // Check if the function name is 'fetch'. In a function call, the "callee" is the thing being executed.
        if (node.callee.type === "Identifier" && node.callee.name === "fetch") {
          // Get the first argument (the URL)
          const arg = node.arguments[0];

          // We only care if it's a static string (e.g., '/api/users')
          if (arg && arg.type === "StringLiteral") {
            results.push({
              route: arg.value,
              file: filePath,
              line: node.loc.start.line, // Babel automatically attaches line numbers and column numbers to every node in the tree. We save the line number where the fetch call began to print "Error on line 10!" later.
            });
          }
        }
      },
    });
  } catch (error) {
    console.error(`Error parsing frontend file ${filePath}:`, error);
  }

  return results;
}