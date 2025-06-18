<script>
  import Calculadora from '$lib/componentes/calculadora/Calculadora.svelte';
</script>

<div class="calculator-page">
  <div class="app-container">
    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <h1 class="app-title">
          <span class="title-icon">🧮</span>
          Calculadora Simbólica
        </h1>
        <a href="/proyecto-interfaces/graficos" class="nav-link">
          <span class="nav-icon">📊</span>
          Ir a Gráficos
        </a>
      </div>
    </header>

    <!-- Panel de instrucciones -->
    <section class="instructions-container">
      <div class="instructions-content">
        <h3>Cómo usar la calculadora</h3>
        <div class="instructions-grid">
          <div class="instruction-card">
            <div class="instruction-header">
              <span class="instruction-icon">∫</span>
              <h4>Integrales Indefinidas</h4>
            </div>
            <div class="instruction-syntax">
              <code>int f</code>
            </div>
            <p class="instruction-example">
              Ejemplo: <code>int x^2</code>
            </p>
          </div>

          <div class="instruction-card">
            <div class="instruction-header">
              <span class="instruction-icon">∫ᵇₐ</span>
              <h4>Integrales Definidas</h4>
            </div>
            <div class="instruction-syntax">
              <code>intd f, a, b</code>
            </div>
            <p class="instruction-example">
              Ejemplo: <code>intd x^2, 0, 2</code>
            </p>
            <p class="instruction-note">
              donde <em>a</em> es el límite inferior y <em>b</em> es el superior
            </p>
          </div>

          <div class="instruction-card">
            <div class="instruction-header">
              <span class="instruction-icon">d/dx</span>
              <h4>Derivadas</h4>
            </div>
            <div class="instruction-syntax">
              <code>der f</code>
            </div>
            <p class="instruction-example">
              Ejemplo: <code>der x^3 + 2*x</code>
            </p>
          </div>

          <div class="instruction-card">
            <div class="instruction-header">
              <span class="instruction-icon">∂/∂x</span>
              <h4>Derivadas Parciales</h4>
            </div>
            <div class="instruction-syntax">
              <code>derp f, var</code>
            </div>
            <p class="instruction-example">
              Ejemplo: <code>derp x^2*y, y</code>
            </p>
            <p class="instruction-note">
              donde <em>var</em> es la variable de derivación
            </p>
          </div>
        </div>

        <div class="tips-section">
          <h4>💡 Consejos útiles</h4>
          <ul class="tips-list">
            <li>Usa <code>*</code> para multiplicación: <code>2*x</code> en lugar de <code>2x</code></li>
            <li>Para potencias usa <code>^</code>: <code>x^2</code>, <code>x^(1/2)</code></li>
            <li>Funciones disponibles: <code>sin</code>, <code>cos</code>, <code>tan</code>, <code>log</code>, <code>ln</code>, <code>sqrt</code></li>
            <li>Usa paréntesis para agrupar: <code>(x+1)^2</code></li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Calculadora -->
    <main class="main-content">
      <div class="calculator-container">
        <Calculadora />
      </div>
    </main>
  </div>
</div>

<style>
  .calculator-page {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #333;
    margin: 0;
    padding: 0;
  }

  .calculator-page .app-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
  }

  /* Header */
  .calculator-page .header {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    padding: 1rem 0;
  }

  .calculator-page .header-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
  }

  .calculator-page .app-title {
    font-size: 1.75rem;
    font-weight: 700;
    margin: 0;
    color: white;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .calculator-page .title-icon {
    font-size: 1.5rem;
  }

  .calculator-page .nav-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    text-decoration: none;
    border-radius: 12px;
    font-weight: 500;
    transition: all 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .calculator-page .nav-link:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }

  .calculator-page .nav-icon {
    font-size: 1.1rem;
  }

  /* Panel de instrucciones */
  .calculator-page .instructions-container {
    background: rgba(255, 255, 255, 0.08);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding: 2rem 0;
  }

  .calculator-page .instructions-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .calculator-page .instructions-content h3 {
    color: rgba(255, 255, 255, 0.95);
    margin: 0 0 2rem 0;
    font-size: 1.5rem;
    font-weight: 600;
    text-align: center;
  }

  .calculator-page .instructions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .calculator-page .instruction-card {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    padding: 1.5rem;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
  }

  .calculator-page .instruction-card:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }

  .calculator-page .instruction-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .calculator-page .instruction-icon {
    font-size: 1.5rem;
    color: rgba(255, 255, 255, 0.9);
    font-weight: bold;
  }

  .calculator-page .instruction-header h4 {
    color: rgba(255, 255, 255, 0.95);
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
  }

  .calculator-page .instruction-syntax {
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    padding: 0.75rem;
    margin-bottom: 1rem;
  }

  .calculator-page .instruction-syntax code {
    color: #4ade80;
    font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
    font-size: 0.95rem;
    font-weight: 600;
  }

  .calculator-page .instruction-example {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.875rem;
    margin: 0.5rem 0;
  }

  .calculator-page .instruction-example code {
    background: rgba(255, 255, 255, 0.2);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    color: #ffffff;
    font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
    font-weight: 600;
  }

  .calculator-page .instruction-note {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.8rem;
    font-style: italic;
    margin: 0;
  }

  /* Tips section */
  .calculator-page .tips-section {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 16px;
    padding: 1.5rem;
    margin-top: 1rem;
  }

  .calculator-page .tips-section h4 {
    color: rgba(255, 255, 255, 0.95);
    margin: 0 0 1rem 0;
    font-size: 1.1rem;
    font-weight: 600;
  }

  .calculator-page .tips-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 0.75rem;
  }

  .calculator-page .tips-list li {
    color: rgba(255, 255, 255, 0.85);
    font-size: 0.875rem;
    padding: 0.5rem 0;
    border-left: 3px solid rgba(255, 255, 255, 0.3);
    padding-left: 1rem;
  }

  .calculator-page .tips-list code {
    background: rgba(255, 255, 255, 0.15);
    color: #fbbf24;
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
    font-size: 0.8rem;
  }

  /* Main content */
  .calculator-page .main-content {
    flex: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    width: 100%;
    box-sizing: border-box;
  }

  .calculator-page .calculator-container {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 24px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(20px);
    min-height: 500px;
    padding: 2rem;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .calculator-page .header-content {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }

    .calculator-page .instructions-grid {
      grid-template-columns: 1fr;
    }

    .calculator-page .tips-list {
      grid-template-columns: 1fr;
    }

    .calculator-page .main-content {
      padding: 1rem;
    }

    .calculator-page .calculator-container {
      padding: 1rem;
    }
  }
</style>