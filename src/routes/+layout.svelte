<script>
  import { onMount } from "svelte";
  import { afterNavigate } from "$app/navigation";
  import "../app.css";
  import { base } from "$app/paths";

  //REGISTRO DEL SERVICE WORKER
  onMount(() => {
    if ('serviceWorker' in navigator) {
      const swUrl = `${base}/sw.js`;
      
      navigator.serviceWorker.register(swUrl)
        .then(reg => {
          console.log('Service Worker registrado:', reg);
          reg.update(); // Fuerza actualización
        })
        .catch(err => {
          console.error('Error al registrar SW:', err);
        });
    }
  });

  // volver arriba tras navegación
  onMount(() => {
    afterNavigate(() => window.scrollTo(0, 0));
  });
</script>

<svelte:head>
  <title>Proyecto de Interfaces</title>
  <link rel="manifest" href="/manifest.webmanifest" />
</svelte:head>

<div class="app-layout">
  <header class="app-header">
    <nav class="header-nav">
      <div class="logo-container">
        <div class="logo-icon">
          <span class="math-symbol">∑</span>
          <span class="code-symbol">&lt;/&gt;</span>
        </div>
        <h1 class="app-title">MathCode Studio</h1>
        <div class="subtitle">Calculadora & Graficador</div>
      </div>
    </nav>
  </header>

  <main class="main-content">
    <slot />
  </main>

  <footer class="app-footer">
    <div class="footer-content">
      <div class="footer-left">
        <div class="footer-icons">
          <span class="footer-icon">π</span>
          <span class="footer-icon binary">01</span>
          <span class="footer-icon">∫</span>
        </div>
        <div class="footer-text">
          © {new Date().getFullYear()} - Interfaces · UNO
        </div>
      </div>
      <div class="footer-right">
        <div class="tech-badge">
          <span class="tech-icon">⚡</span>
          <span>Grupo 14</span>
        </div>
      </div>
    </div>
  </footer>
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
  }

  .app-layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      sans-serif;
  }

  /* Header */
  .app-header {
    background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    border-bottom: 2px solid rgba(255, 215, 0, 0.3);
    position: sticky;
    top: 0;
    z-index: 50;
    backdrop-filter: blur(10px);
  }

  .header-nav {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem 2rem;
  }

  .logo-container {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .logo-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
    border-radius: 16px;
    position: relative;
    box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
  }

  .math-symbol {
    font-size: 1.5rem;
    font-weight: bold;
    color: #1a202c;
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
  }

  .code-symbol {
    font-size: 0.875rem;
    font-weight: bold;
    color: #1a202c;
    position: absolute;
    bottom: 8px;
    left: 50%;
    transform: translateX(-50%);
  }

  .app-title {
    font-size: 1.75rem;
    font-weight: 800;
    margin: 0;
    color: #ffffff;
    background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .subtitle {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.7);
    font-weight: 500;
    margin-left: 0.5rem;
  }

  /* Main content */
  .main-content {
    flex: 1;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    box-sizing: border-box;
  }

  /* Footer */
  .app-footer {
    background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
    border-top: 2px solid rgba(255, 215, 0, 0.3);
    margin-top: auto;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.2);
  }

  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1.5rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .footer-left {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .footer-icons {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .footer-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: rgba(255, 215, 0, 0.1);
    border: 1px solid rgba(255, 215, 0, 0.3);
    border-radius: 8px;
    color: #ffd700;
    font-weight: bold;
    font-size: 1rem;
  }

  .footer-icon.binary {
    font-family: "Monaco", "Menlo", "Consolas", monospace;
    font-size: 0.75rem;
  }

  .footer-text {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.875rem;
    font-weight: 500;
  }

  .footer-right {
    display: flex;
    align-items: center;
  }

  .tech-badge {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(255, 215, 0, 0.1);
    border: 1px solid rgba(255, 215, 0, 0.2);
    border-radius: 20px;
    padding: 0.5rem 1rem;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.75rem;
    font-weight: 500;
  }

  .tech-icon {
    color: #ffd700;
    font-size: 0.875rem;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .header-nav {
      padding: 1rem;
    }

    .logo-container {
      flex-direction: column;
      text-align: center;
      gap: 0.5rem;
    }

    .app-title {
      font-size: 1.5rem;
    }

    .subtitle {
      margin-left: 0;
    }

    .footer-content {
      flex-direction: column;
      text-align: center;
      gap: 1rem;
    }

    .footer-left {
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .tech-badge {
      font-size: 0.7rem;
      padding: 0.4rem 0.8rem;
    }
  }

  @media (max-width: 480px) {
    .logo-icon {
      width: 50px;
      height: 50px;
    }

    .math-symbol {
      font-size: 1.25rem;
      top: 6px;
    }

    .code-symbol {
      font-size: 0.75rem;
      bottom: 6px;
    }

    .app-title {
      font-size: 1.25rem;
    }

    .subtitle {
      font-size: 0.8rem;
    }
  }
</style>
