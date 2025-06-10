<script>
  import { evaluate, parse } from 'mathjs';
  import Algebrite from 'algebrite';
  import InputPanel from './InputPanel.svelte';
  import OutputPanel from './OutputPanel.svelte';
  
  let expresion = '';
  let latexPreview = '';
  let latexResult = '';
  let error = '';
  let operationType = '';
  
  $: if (expresion.trim() === '') {
    latexPreview = '';
    latexResult = '';
    error = '';
    operationType = '';
  } else {
    try {
      error = '';
      // Detectar si es integral, derivada o nuevas abreviaturas
      const trimmed = expresion.trim();
      if (trimmed.startsWith('intd ')) {
        operationType = 'definite-integral';
        // integral definida: intd f, a, b
        // separo la función y los límites
        const args = trimmed.slice(5).split(',').map(s => s.trim());
        if (args.length === 3) {
          const [f, a, b] = args;
          latexPreview = `\\int_{${a}}^{${b}} ${Algebrite.run(`printlatex(${f})`)}\\,dx`;
          latexResult = Algebrite.run(`printlatex(defint(${f}, x, ${a}, ${b}))`);
        } else {
          throw new Error("Formato intd: intd función, límite_inferior, límite_superior");
        }
      } else if (trimmed.startsWith('int ')) {
        operationType = 'indefinite-integral';
        const inner = trimmed.slice(4);
        latexPreview = `\\int ${Algebrite.run(`printlatex(${inner})`)}\\,dx`;
        // Agregar + C a las integrales indefinidas
        const integralResult = Algebrite.run(`printlatex(integral(${inner}))`);
        latexResult = integralResult + ' + C';
      } else if (trimmed.startsWith('derp ')) {
        operationType = 'partial-derivative';
        // derivada parcial: derp f, var
        const args = trimmed.slice(5).split(',').map(s => s.trim());
        if (args.length === 2) {
          const [f, v] = args;
          latexPreview = `\\frac{\\partial}{\\partial ${v}} ${Algebrite.run(`printlatex(${f})`)}`;
          latexResult = Algebrite.run(`printlatex(derivative(${f}, ${v}))`);
        } else {
          throw new Error("Formato derp: derp función, variable");
        }
      } else if (trimmed.startsWith('der ') || trimmed.startsWith('diff ')) {
        operationType = 'derivative';
        const inner = trimmed.replace(/^(der|diff)\s+/, '');
        latexPreview = `\\frac{d}{dx} ${Algebrite.run(`printlatex(${inner})`)}`;
        latexResult = Algebrite.run(`printlatex(derivative(${inner}))`);
      } else {
        operationType = 'evaluation';
        // Evaluación normal
        const node = parse(expresion);
        latexPreview = node.toTex(); // Notación matemática original
        const evaluated = evaluate(expresion);
        latexResult = '\\mathrm{' + evaluated.toString() + '}';
      }
    } catch (e) {
      latexPreview = '';
      latexResult = '';
      error = e.message;
      operationType = '';
    }
  }

  function getOperationIcon(type) {
    switch(type) {
      case 'indefinite-integral': return '∫';
      case 'definite-integral': return '∫ᵇₐ';
      case 'derivative': return 'd/dx';
      case 'partial-derivative': return '∂/∂x';
      case 'evaluation': return '=';
      default: return '🧮';
    }
  }

  function getOperationName(type) {
    switch(type) {
      case 'indefinite-integral': return 'Integral Indefinida';
      case 'definite-integral': return 'Integral Definida';
      case 'derivative': return 'Derivada';
      case 'partial-derivative': return 'Derivada Parcial';
      case 'evaluation': return 'Evaluación';
      default: return 'Calculadora Simbólica';
    }
  }
</script>

<div class="calculator-component">
  <div class="calculator-header">
    <div class="header-icon">
      {getOperationIcon(operationType)}
    </div>
    <h2 class="header-title">
      {getOperationName(operationType)}
    </h2>
  </div>

  <div class="input-section">
    <div class="section-header">
      <span class="section-icon">✏️</span>
      <h3 class="section-title">Expresión</h3>
    </div>
    <InputPanel bind:expresion />
  </div>

  {#if expresion.trim() !== ''}
    <div class="preview-section">
      <div class="section-header">
        <span class="section-icon">👁️</span>
        <h3 class="section-title">Previsualización</h3>
      </div>
      <div class="output-container preview">
        <OutputPanel latex={latexPreview} />
      </div>
    </div>

    <div class="result-section">
      <div class="section-header">
        <span class="section-icon">✨</span>
        <h3 class="section-title">Resultado</h3>
      </div>
      
      {#if error}
        <div class="error-container">
          <div class="error-icon">⚠️</div>
          <div class="error-content">
            <p class="error-title">Error de sintaxis</p>
            <p class="error-message">{error}</p>
          </div>
        </div>
      {:else}
        <div class="output-container result">
          <OutputPanel latex={latexResult} />
        </div>
      {/if}
    </div>
  {:else}
    <div class="empty-state">
      <div class="empty-icon">📝</div>
      <p class="empty-title">Ingresa una expresión matemática</p>
      <p class="empty-subtitle">Usa los comandos del panel de instrucciones arriba</p>
    </div>
  {/if}
</div>

<style>
  .calculator-component {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    max-width: 100%;
  }

  /* Header */
  .calculator-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px;
    color: white;
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
  }

  .header-icon {
    font-size: 2rem;
    font-weight: bold;
    opacity: 0.9;
  }

  .header-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
  }

  /* Sections */
  .input-section,
  .preview-section,
  .result-section {
    background: #f8fafc;
    border: 2px solid #e2e8f0;
    border-radius: 16px;
    padding: 1.5rem;
    transition: all 0.3s ease;
  }

  .input-section:focus-within {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  .preview-section {
    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
    border-color: #cbd5e1;
  }

  .result-section {
    background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
    border-color: #a7f3d0;
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .section-icon {
    font-size: 1.2rem;
  }

  .section-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0;
    color: #374151;
  }

/*   .constant-note {
    background: #fef3c7;
    color: #92400e;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 600;
    border: 1px solid #fcd34d;
  } */

  /* Output containers */
  .output-container {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 1.5rem;
    min-height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .output-container.preview {
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    border-color: #d1d5db;
  }

  .output-container.result {
    background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%);
    border-color: #bbf7d0;
    box-shadow: 0 4px 15px rgba(34, 197, 94, 0.1);
  }

  /* Error state */
  .error-container {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
    border: 1px solid #fca5a5;
    border-radius: 12px;
    padding: 1.5rem;
  }

  .error-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .error-content {
    flex: 1;
  }

  .error-title {
    font-weight: 600;
    color: #dc2626;
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
  }

  .error-message {
    color: #7f1d1d;
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.4;
  }

  /* Empty state */
  .empty-state {
    text-align: center;
    padding: 3rem 2rem;
    background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
    border: 2px dashed #d1d5db;
    border-radius: 16px;
    color: #6b7280;
  }

  .empty-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.7;
  }

  .empty-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    color: #374151;
  }

  .empty-subtitle {
    margin: 0;
    font-size: 0.875rem;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .calculator-component {
      gap: 1.5rem;
    }

    .calculator-header {
      padding: 1rem;
      flex-direction: column;
      text-align: center;
    }

    .header-title {
      font-size: 1.25rem;
    }

    .input-section,
    .preview-section,
    .result-section {
      padding: 1rem;
    }

    .section-header {
      flex-wrap: wrap;
      justify-content: center;
      text-align: center;
    }

    .output-container {
      padding: 1rem;
    }

    .empty-state {
      padding: 2rem 1rem;
    }
  }
</style>