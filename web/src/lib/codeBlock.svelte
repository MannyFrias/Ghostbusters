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