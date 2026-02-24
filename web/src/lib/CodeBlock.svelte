<script>
    // this is sveltes way of receiving props from parent components
    // we can destructure the prop object and assign default values
    let {code = "", language = "bash" } = $props(); 

    // the state rune is sveltes way of creating reactive state, like react when the component changes the UI rerenders

    let copied = $state(false); 

    // creating a block that will be able to be copied to clipboard using clipboard api 

    async function copyToClipboard () {
        try {
            // clipboard api 
            await navigator.clipboard.writeText(code); 

            // update state to show the feedback
            copied = true; 

            // reset copied after 2 seconds 
            setTimeout(() => {
                copied = false; 
            }, 2000); 
        } catch (err) {
            console.error("Failed to copy:", err)
        }
    }
</script>

<div>
    <!-- language label -->
     <span class="language-label">{language}</span>

     <button 
        class="copy-btn"
        onclick={copyToClipboard}
        type="button"
        aria-label={copied ? "copied to clipboard" : "copy code to clipboard"}
    >
        {copied ? "✓ Copied!" : "📋 Copy"}
    </button>

    <!-- code display -->
    <pre><code>{code}</code></pre>
</div>

<style>
  div {
    position: relative;
    background: #161b22;
    border: 1px solid #21262d;
    border-radius: 8px;
    margin: 1rem 0;
    overflow: hidden;
  }

  .language-label {
    position: absolute;
    top: 0.5rem;
    left: 0.75rem;
    font-size: 0.7rem;
    color: #484f58;
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.05em;
    user-select: none;
  }

  .copy-btn {
    position: absolute;
    top: 0.5rem;
    right: 0.75rem;
    background: none;
    border: 1px solid #30363d;
    color: #8b949e;
    border-radius: 4px;
    padding: 0.2rem 0.6rem;
    font-size: 0.75rem;
    cursor: pointer;
    transition: color 0.2s, border-color 0.2s;
  }

  .copy-btn:hover {
    color: #e6edf3;
    border-color: #58a6ff;
  }

  pre {
    margin: 0;
    padding: 2rem 1rem 1rem;
    overflow-x: auto;
  }

  code {
    font-family: 'SF Mono', 'Fira Code', 'Courier New', monospace;
    font-size: 0.85rem;
    line-height: 1.6;
    color: #e6edf3;
  }

</style>