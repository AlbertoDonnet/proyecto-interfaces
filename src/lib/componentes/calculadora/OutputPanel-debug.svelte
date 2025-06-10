<script>
  export let latex = '';
  
  // Contador para debug
  let renderCount = 0;
  $: if (latex) renderCount++;
</script>

<div class="bg-gray-100 p-4 rounded shadow">
  {#if latex}
    <div class="math-output">
      <div style="background: yellow; padding: 4px; margin-bottom: 8px; font-size: 12px;">
        Debug: Render #{renderCount}
      </div>
      <code style="background: white; padding: 8px; border-radius: 4px;">
        {latex}
      </code>
    </div>
  {:else}
    <p class="text-gray-500">Introduce una expresión para verla en LaTeX.</p>
  {/if}
</div>

<style>
  .math-output {
    text-align: center;
    min-height: 2rem;
  }
</style>