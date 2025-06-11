<!-- Versión temporal de OutputPanel.svelte para debug -->
<script>
  import katex from 'katex';
  import { browser } from '$app/environment';
 
  export let latex = '';
 
  let renderedHtml = '';
 
  // Solo ejecutar en el navegador
  $: if (browser) {
    updateRender();
  }
  
  function updateRender() {
    if (latex && latex.trim()) {
      try {
        renderedHtml = katex.renderToString(latex, {
          displayMode: true,
          throwOnError: false,
          errorColor: '#cc0000',
          strict: false
        });
      } catch (error) {
        renderedHtml = `<span style="color: #cc0000;">Error: ${error.message}</span>`;
      }
    } else {
      renderedHtml = '';
    }
  }
</script>

<!-- Solo renderizar en el cliente -->
{#if browser}
  <div class="bg-gray-100 p-4 rounded shadow">
    <!-- DEBUG: Mostrar LaTeX crudo -->
    <div class="debug-latex" style="background: #f0f0f0; padding: 8px; margin-bottom: 8px; font-family: monospace; font-size: 12px; border-radius: 4px;">
      <strong>LaTeX crudo:</strong> {latex}
    </div>
    
    {#if renderedHtml}
      <div class="math-output">{@html renderedHtml}</div>
    {:else}
      <div class="math-output">
        <p class="text-gray-500">Introduce una expresión para verla en LaTeX.</p>
      </div>
    {/if}
  </div>
{/if}

<style>
  .math-output {
    text-align: center;
    min-height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
 
  :global(.math-output .katex-display) {
    margin: 0 !important;
  }
 
  :global(.math-output .katex) {
    font-size: 1.2em;
  }
</style>