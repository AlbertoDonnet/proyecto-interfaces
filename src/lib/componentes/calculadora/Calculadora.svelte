<script>
  import { evaluate, parse } from 'mathjs';
  import Algebrite from 'algebrite';
  import InputPanel from './InputPanel.svelte';
  import OutputPanel from './OutputPanel.svelte';
  
  let expresion = '';
  let calculationResult = null;
  
  // Función que calcula todo de una vez
  function calculateExpression(expr) {
    if (!expr || expr.trim() === '') {
      return null;
    }
    
    try {
      const trimmed = expr.trim();
      let preview = '';
      let result = '';
      let type = '';
      
      if (trimmed.startsWith('intd ')) {
        type = 'definite-integral';
        const args = trimmed.slice(5).split(',').map(s => s.trim());
        if (args.length === 3) {
          const [f, a, b] = args;
          preview = `\\int_{${a}}^{${b}} ${Algebrite.run(`printlatex(${f})`)}\\,dx`;
          result = Algebrite.run(`printlatex(defint(${f}, x, ${a}, ${b}))`);
        } else {
          throw new Error("Formato intd: intd función, límite_inferior, límite_superior");
        }
      } else if (trimmed.startsWith('int ')) {
        type = 'indefinite-integral';
        const inner = trimmed.slice(4);
        preview = `\\int ${Algebrite.run(`printlatex(${inner})`)}\\,dx`;
        const integralResult = Algebrite.run(`printlatex(integral(${inner}))`);
        result = integralResult + ' + C';
      } else if (trimmed.startsWith('derp ')) {
        type = 'partial-derivative';
        const args = trimmed.slice(5).split(',').map(s => s.trim());
        if (args.length === 2) {
          const [f, v] = args;
          preview = `\\frac{\\partial}{\\partial ${v}} ${Algebrite.run(`printlatex(${f})`)}`;
          result = Algebrite.run(`printlatex(derivative(${f}, ${v}))`);
        } else {
          throw new Error("Formato derp: derp función, variable");
        }
      } else if (trimmed.startsWith('der ') || trimmed.startsWith('diff ')) {
        type = 'derivative';
        const inner = trimmed.replace(/^(der|diff)\s+/, '');
        preview = `\\frac{d}{dx} ${Algebrite.run(`printlatex(${inner})`)}`;
        result = Algebrite.run(`printlatex(derivative(${inner}))`);
      } else {
        type = 'evaluation';
        const node = parse(expr);
        preview = node.toTex();
        const evaluated = evaluate(expr);
        result = '\\mathrm{' + evaluated.toString() + '}';
      }
      
      return {
        preview,
        result,
        type,
        error: null
      };
      
    } catch (e) {
      return {
        preview: '',
        result: '',
        type: 'error',
        error: e.message
      };
    }
  }
  
  // Solo una reactive declaration
  $: calculationResult = calculateExpression(expresion);

  function getOperationIcon(type) {
    if (!type) return '🧮';
    switch(type) {
      case 'indefinite-integral': return '∫';
      case 'definite-integral': return '∫ᵇₐ';
      case 'derivative': return 'd/dx';
      case 'partial-derivative': return '∂/∂x';
      case 'evaluation': return '=';
      case 'error': return '⚠️';
      default: return '🧮';
    }
  }

  function getOperationName(type) {
    if (!type) return 'Calculadora Simbólica';
    switch(type) {
      case 'indefinite-integral': return 'Integral Indefinida';
      case 'definite-integral': return 'Integral Definida';
      case 'derivative': return 'Derivada';
      case 'partial-derivative': return 'Derivada Parcial';
      case 'evaluation': return 'Evaluación';
      case 'error': return 'Error';
      default: return 'Calculadora Simbólica';
    }
  }
</script>

<div class="calculator-component">
  <!-- Header -->
  <div class="calculator-header">
    <div class="header-icon">
      {getOperationIcon(calculationResult?.type)}
    </div>
    <h2 class="header-title">
      {getOperationName(calculationResult?.type)}
    </h2>
  </div>

  <!-- Input Section -->
  <div class="input-section">
    <div class="section-header">
      <span class="section-icon">✏️</span>
      <h3 class="section-title">Expresión</h3>
    </div>
    <InputPanel bind:expresion />
  </div>

  <!-- Results Section -->
  {#if calculationResult}
    {#if calculationResult.error}
      <!-- Error State -->
      <div class="result-section error">
        <div class="section-header">
          <span class="section-icon">⚠️</span>
          <h3 class="section-title">Error</h3>
        </div>
        <div class="error-container">
          <div class="error-icon">⚠️</div>
          <div class="error-content">
            <p class="error-title">Error de sintaxis</p>
            <p class="error-message">{calculationResult.error}</p>
          </div>
        </div>
      </div>
    {:else}
      <!-- Preview Section -->
      <div class="preview-section">
        <div class="section-header">
          <span class="section-icon">👁️</span>
          <h3 class="section-title">Previsualización</h3>
        </div>
        <div class="output-container preview">
          <OutputPanel latex={calculationResult.preview} />
        </div>
      </div>

      <!-- Result Section -->
      <div class="result-section success">
        <div class="section-header">
          <span class="section-icon">✨</span>
          <h3 class="section-title">Resultado</h3>
        </div>
        <div class="output-container result">
          <OutputPanel latex={calculationResult.result} />
        </div>
      </div>
    {/if}
  {:else}
    <!-- Empty State -->
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

  .result-section.success {
    background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
    border-color: #a7f3d0;
  }

  .result-section.error {
    background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
    border-color: #fca5a5;
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