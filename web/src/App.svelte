<script>
  import CodeBlock from "./lib/codeBlock.svelte";
  import Demo from "./lib/demo.svelte";

  // these strings will be passed as CodeBlock components

  const installCommand = "npm install ghostbusters --save-dev"; 

  const packageJsonScript = `scripts: {
  "ghostbusters": "ghostbusters scan --frontend ./src/client --backend ./src/server"
  }`; 

   const usageCommand = `# Basic scan
npx ghostbusters scan

# Specify directories
npx ghostbusters scan --frontend ./src/client --backend ./src/server

# Output as JSON
npx ghostbusters scan --format json`;

  const configFile = `// ghostbusters.config.js
export default {
  frontend: ["./src/client", "./src/components"],
  backend: ["./src/server", "./src/api"],
  ignore: ["node_modules", "dist", "*.test.js"]
};`;

const steps = [
  {
    number: 1, 
    title: "parse frontend", 
    description: "scans youre react files for fetch and axios calls. Extracts the URL and HTTP method"
  }, 
   {
      number: 2,
      title: "Parse Backend",
      description: "Scans your Express server files for route definitions like app.get(), router.post(), etc."
    },
    {
      number: 3,
      title: "Compare Routes",
      description: "Matches frontend calls to backend routes. Any frontend call without a matching backend route is a ghost route."
    },
    {
      number: 4,
      title: "Report",
      description: "Outputs a clear report showing which routes are missing, including the file and line number."
    }
]
</script>