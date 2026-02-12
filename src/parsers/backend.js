/* =========================================================================
   TL;DR - HIGH LEVEL OVERVIEW
   =========================================================================
   GOAL: 
   Scan backend files (Express/Node) to find two things:
   1. DEFINED ROUTES: Actual endpoints like app.get('/users')
   2. MOUNT POINTS: Router prefixes like app.use('/api', userRouter)

   OUTPUT:
   An array  of objects. Each object is either a "ROUTE" or a "MOUNT_POINT".
   The Matcher will use this list to see if the Frontend is calling valid URLs.
   ========================================================================= */
import fs from 'fs/promises'; // Use promises for async reading
import parser from '@babel/parser';
import traversePkg from '@babel/traverse';
const traverse = traversePkg.default; // .default is needed for ES6 imports

export async function parseBackend(filepath) {
  // Create an empty array to hold the routes we'll find
  const results = [];

  try {
    // READ THE FILE
    // Open the files and turn it into a giant string of text
    const code = await fs.readFile(filepath, 'utf-8');

    // PARSE THE TEXT
    // Turn string into AST
    // Enable "typescript" plugin (common in backends) even if using JS.
    const tree = parser.parse(code, {
      sourceType: 'module',
      plugins: ['typescript']
    });

    // TRAVERSE THE TREE
    traverse(tree, {
      
      // We are looking for "CallExpressions" (any function call like app.get(), router.post(), app.use())
      CallExpression({ node }) {
        
        // CHECK: IS IT A METHOD CALL? (Dot Notation)
        // We look for "MemberExpression" (e.g., app.get)
        const { callee } = node;

        if (callee.type === 'MemberExpression') {
          
          // Get the name of the property (e.g., "get", "post")
          const propertyName = callee.property.name; 
          
          // DEFINE VALID METHODS
          // We only care about these specific Express route handlers. So it wouldn't matter if we're using app or router
          const expressMethods = ['get', 'post', 'put', 'delete', 'patch'];

          // HANDLES A STANDARD ROUTE (app.get, router.post)
          if (expressMethods.includes(propertyName)) {
            // EXTRACT THE ROUTE
            // Grab the first argument (arguments[0] ... the route path so app.get('/users').. then the arg = '/users')
            const arg = node.arguments[0];

            //use helper function to extract route and make it a clean string
            const path = extractRoutePath(arg);

            //VALIDATOR: is this an actual route? Should filter out something like: myMap.get('key')
            if (path && (path.startsWith("/") || path === "*")) {
              results.push({
                path: path,
                method: propertyName.toUpperCase(),
                file: filepath,
                line: node.loc.start.line,
              });
            }
          }
          // --- MOUNT POINT --- to help with prefix detection
          //searching for: app.use('/api', router)
          else if (propertyName === 'use') {
            const args = node.arguments;

            //Checks if arg[0] is a string (the prefix: '/api') and arg[1] 
            if (
              args.length >= 2 &&
              args[0].type === 'StringLiteral' &&
              args[1].type === 'Identifier'
            ) {
              results.push({
                type: 'MOUNT_POINT',
                path: args[0].value,
                target: args[1].name,
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
  // Return the list of routes and mounts that we have found
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