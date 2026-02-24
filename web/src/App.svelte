<script>
  import CodeBlock from "./lib/codeBlock.svelte";
  import Demo from "./lib/Demo.svelte";

  // these strings will be passed as CodeBlock components

  const installCommand = "npm install @ghostbusters/cli --save-dev"; 

  const packageJsonScript = `scripts: {
  "ghostbusters": "ghostbusters scan --frontend ./src/client --backend ./src/server"
  }`; 

   const usageCommand = `# Basic scan
  npx ghostbusters

# options:
  Run without console output
  -s or --silent

# Output results as a JSON object for custom tooling
  -j, --json`;

  const configFile = `// ghostbusters.config.js
export default {
  frontend: ["./src/client", "./src/components"],
  backend: ["./src/server", "./src/api"],
  ignore: ["node_modules", "dist", "*.test.js"]
};`;

const steps = [
  {
    number: 1, 
    title: "Parse Frontend", 
    description: "Scans youre react files for fetch and axios calls."
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

<main>
  <section class="hero">
    <h1>👻 Ghostbusters</h1>
    <p class="tagline">Find dead routes haunting your codebase. Scan your frontend API calls and backend routes to find mismatches instantly.</p>
    <Demo />
  </section>

  <section class="steps">
    <h2>How It Works</h2>
    <div class="steps-grid">
      {#each steps as step}
        <div class="step-card">
          <span class="step-number">{step.number}</span>
          <h3>{step.title}</h3>
          <p>{step.description}</p>
        </div>
      {/each}
    </div>
  </section>

  <section class="install">
    <h2>Installation</h2>
    <CodeBlock code={installCommand} language="bash" />
  </section>

  <section class="config">
    <h2>Configuration</h2>
    <p class="section-description">Create a <code>ghostbusters.config.js</code> in your project root to customize scan directories and ignore patterns.</p>
    <CodeBlock code={configFile} language="javascript" />
  </section>

  <section class="package-json">
    <h2>Package.json Setup</h2>
    <p class="section-description">Add a script to your <code>package.json</code> for easy scanning.</p>
    <CodeBlock code={packageJsonScript} language="json" />
  </section>

  <section class="usage">
    <h2>Usage</h2>
    <CodeBlock code={usageCommand} language="bash" />
  </section>

  <footer>
    <p>Built with 👻 by the <a href="https://github.com/Ghostbusters" target="_blank" rel="noopener">Ghostbusters</a> team</p>
  </footer>
</main>

<style>
  :global(body) {
    margin: 0;
    background-color: #0d1117;
    color: #e6edf3;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
  }

  main {
    max-width: 860px;
    margin: 0 auto;
    padding: 2rem 1.5rem;
  }

  .hero {
    text-align: center;
    padding: 3rem 0;
  }

  .hero h1 {
    font-size: 3rem;
    margin-bottom: 0.5rem;
  }

  .tagline {
    font-size: 1.15rem;
    color: #8b949e;
    max-width: 600px;
    margin: 0 auto 2.5rem;
    line-height: 1.6;
  }

  h2 {
    font-size: 1.6rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid #21262d;
    padding-bottom: 0.5rem;
  }

  section {
    margin-bottom: 3rem;
  }

  .section-description {
    color: #8b949e;
    margin-bottom: 1rem;
    line-height: 1.5;
  }

  .section-description code {
    background: #161b22;
    padding: 0.15em 0.4em;
    border-radius: 4px;
    font-size: 0.9em;
    color: #79c0ff;
  }

  /* Steps Grid */
  .steps-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.25rem;
    margin-top: 1.5rem;
  }

  .step-card {
    background: #161b22;
    border: 1px solid #21262d;
    border-radius: 8px;
    padding: 1.25rem;
    position: relative;
  }

  .step-card h3 {
    margin: 0.5rem 0;
    font-size: 1.05rem;
  }

  .step-card p {
    color: #8b949e;
    font-size: 0.9rem;
    line-height: 1.5;
    margin: 0;
  }

  .step-number {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background: #238636;
    color: #fff;
    border-radius: 50%;
    font-size: 0.85rem;
    font-weight: 700;
  }

  /* Footer */
  footer {
    text-align: center;
    padding: 2rem 0;
    border-top: 1px solid #21262d;
    color: #8b949e;
    font-size: 0.9rem;
  }

  footer a {
    color: #58a6ff;
    text-decoration: none;
  }

  footer a:hover {
    text-decoration: underline;
  }
</style>