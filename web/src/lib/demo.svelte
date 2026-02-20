<script>
  import { untrack } from "svelte"; 

    let visibleLines = $state([]); 

    let isPlaying = $state(false); 

    let scrollContainer = $state(null);

    const outputLines = [
    { text: "$ npx ghostbusters scan", type: "command" },
    { text: "", type: "blank" },
    { text: "🔍 Scanning frontend files...", type: "info" },
    { text: "   Found 4 fetch/axios calls", type: "info" },
    { text: "", type: "blank" },
    { text: "🔍 Scanning backend routes...", type: "info" },
    { text: "   Found 3 Express routes", type: "info" },
    { text: "", type: "blank" },
    { text: "👻 Ghost Routes Found: 1", type: "warning" },
    { text: "┌─────────┬─────────────────┬─────────────┬──────┐", type: "table" },
    { text: "│ Method  │ Path            │ File        │ Line │", type: "table" },
    { text: "├─────────┼─────────────────┼─────────────┼──────┤", type: "table" },
    { text: "│ GET     │ /api/ghost      │ app.js      │ 12   │", type: "ghost" },
    { text: "└─────────┴─────────────────┴─────────────┴──────┘", type: "table" },
    { text: "", type: "blank" },
    { text: "⚠️  These frontend calls have no matching backend route!", type: "warning" }
    ]; 

    /**
     * Helper function to pause execution 
     * @params {number} ms - milliseconds to wait
     * @return {Promise<void>}
    */

   function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms)); 
   }

   async function playDemo() {
    visibleLines = []; 
    isPlaying = true; 

    for (const line of outputLines) {
        // svelte needs to reassign to trigger reacticity with arrays
        visibleLines = [...visibleLines, line]

        // commands get a longer delay to simulate typing
        const delay = line.type === "command" ? 800 : 150;
        await sleep(delay); 
    }

    isPlaying = false; 
   }

   /**
    * $effect() rune -> works like useEffect in react
    * will run side effect on component re render 
   */

   $effect(() => {
    untrack(() => {
      playDemo(); 
    })
   });


   $effect(() => {
    visibleLines.length; 

    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
   })
</script>

<div class="demo-container">
  <div class="demo-header">
    <span class="window-buttons">
      <span class="btn-red"></span>
      <span class="btn-yellow"></span>
      <span class="btn-green"></span>
    </span>
    <span class="title">Terminal</span>
    <button class="replay-btn" onclick={playDemo}>↻ Replay</button>
  </div>

  <div class="demo-content" bind:this={scrollContainer}>
    {#each visibleLines as line}
      <div class="line {line.type}">
        {#if line.type === "command"}
          <span class="prompt">$</span>
        {/if}
        {line.text}
      </div>
    {/each}
    {#if isPlaying}
      <span class="cursor">▊</span>
    {/if}
  </div>
</div>

<style>
  .demo-container {
    background: #0d1117;
    border: 1px solid #30363d;
    border-radius: 10px;
    overflow: hidden;
    max-width: 680px;
    margin: 0 auto;
    text-align: left;
  }

  .demo-header {
    display: flex;
    align-items: center;
    background: #161b22;
    padding: 0.6rem 1rem;
    border-bottom: 1px solid #21262d;
    position: relative;
  }

  .window-buttons {
    display: flex;
    gap: 6px;
  }

  .btn-red,
  .btn-yellow,
  .btn-green {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    display: inline-block;
  }

  .btn-red {
    background: #ff5f57;
  }

  .btn-yellow {
    background: #febc2e;
  }

  .btn-green {
    background: #28c840;
  }

  .title {
    flex: 1;
    text-align: center;
    font-size: 0.8rem;
    color: #8b949e;
    font-weight: 600;
  }

  .replay-btn {
    background: none;
    border: 1px solid #30363d;
    color: #8b949e;
    border-radius: 4px;
    padding: 0.2rem 0.6rem;
    font-size: 0.75rem;
    cursor: pointer;
    transition: color 0.2s, border-color 0.2s;
  }

  .replay-btn:hover {
    color: #e6edf3;
    border-color: #58a6ff;
  }

  .demo-content {
    padding: 1rem;
    font-family: 'SF Mono', 'Fira Code', 'Courier New', monospace;
    font-size: 0.85rem;
    line-height: 1.6;
    max-height: 350px;
    overflow-y: auto;
  }

  .line {
    white-space: pre-wrap;
    word-break: break-word;
  }

  .line.command {
    color: #79c0ff;
  }

  .line.command .prompt {
    color: #238636;
    margin-right: 0.5em;
    font-weight: 700;
  }

  .line.info {
    color: #8b949e;
  }

  .line.warning {
    color: #d29922;
  }

  .line.ghost {
    color: #f85149;
  }

  .line.table {
    color: #e6edf3;
  }

  .cursor {
    color: #58a6ff;
    animation: blink 1s step-end infinite;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
</style>