<script>
  import katex from 'katex';
  export let latex = '';
</script>

<div class="bg-gray-100 p-4 rounded shadow">
  {#if latex}
    <div>{@html katex.renderToString(latex)}</div>
  {:else}
    <p class="text-gray-500">Introduce una expresión para verla en LaTeX.</p>
  {/if}
</div>
