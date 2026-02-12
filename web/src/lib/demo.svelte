<script>
    let visibleLines = $state([]); 

    let isPlaying = $state(false); 

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
    playDemo(); 
   });
</script>

<div class="demo-container">
    <header class="demo-header">
        <span class="window-buttons" aria-hidden="true"></span>
        <span class="btn-red"></span>
        <span class="btn-yellow"></span>
        <span class="btn-green"></span>
    </header>

    <span class="title">Terminal</span>

    <button
        class="replay-btn"
        onclick={playDemo}
        disabled={isPlaying}
        type="button"
    >
        {isPlaying ? "Playing..." : "↻ Replay"}
    </button>

    <!-- terminal content -->
     <div class="demo-content" role="log" aria-live="polite">
        {#each visibleLines as line}
        <div class="line {line.type}">{line.text}</div>
        {/each}

        {#if !isPlaying}
        <span class="cursor" aria-hidden="true"></span>
        {/if}
     </div>
</div>