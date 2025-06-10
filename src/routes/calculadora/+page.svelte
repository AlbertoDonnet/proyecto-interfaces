<script>
  export const ssr = false; // MathLive no funciona bien con SSR

  import { onMount } from 'svelte';
  import MathLive from 'mathlive';
  import * as math from 'mathjs';

  let mathfieldEl;
  let latex = '';
  let mathjsExpr = '';
  let derivedLatex = '';
  let simplifiedLatex = '';
  let error = '';

  // Inicializar mathfield cuando el componente monte
  onMount(() => {
    const mf = MathLive.makeMathField(mathfieldEl, {
      virtualKeyboardMode: 'onfocus',
      onContentDidChange: () => {
        latex = mf.getValue();
        // Convertir LaTeX a expresión para mathjs
        try {
          mathjsExpr = MathLive.convertLatexToAsciiMath(latex)
            .replaceAll('^', '**')
            .replaceAll('\\cdot', '*');
          error = '';
          calcular(mathjsExpr);
        } catch (e) {
          error = 'Error al convertir LaTeX: ' + e.message;
          derivedLatex = '';
          simplifiedLatex = '';
        }
      }
    });

    mf.setValue('');
  });

  function calcular(expr) {
    try {
      const node = math.parse(expr);
      const derivative = math.derivative(node, 'x');
      const simplified = math.simplify(node);

      derivedLatex = derivative.toTex();
      simplifiedLatex = simplified.toTex();
      error = '';
    } catch (e) {
      error = 'Error en cálculo: ' + e.message;
      derivedLatex = '';
      simplifiedLatex = '';
    }
  }
</script>

<style>
  .mathlive-input {
    min-height: 3rem;
    font-size: 1.25rem;
    border: 1px solid #ccc;
    padding: 0.5rem;
    border-radius: 0.25rem;
    background: white;
  }
  .output {
    background: #f9fafb;
    padding: 1rem;
    border-radius: 0.25rem;
    margin-top: 1rem;
    font-family: monospace;
  }
</style>

<section>
  <h1>Calculadora Simbólica Simplificada</h1>
  <div bind:this={mathfieldEl} class="mathlive-input"></div>

  {#if error}
    <p style="color:red;">{error}</p>
  {:else if latex}
    <div class="output">
      <p><strong>LaTeX:</strong> {latex}</p>
      <p><strong>Expresión para math.js:</strong> {mathjsExpr}</p>
      <p><strong>Derivada:</strong> \( {derivedLatex} \)</p>
      <p><strong>Simplificada:</strong> \( {simplifiedLatex} \)</p>
    </div>
  {/if}
</section>
