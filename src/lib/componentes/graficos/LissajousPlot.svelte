<script>
  import { onMount, afterUpdate } from 'svelte';
  import { browser } from '$app/environment';
  
  // Props del componente
  export let A = 1;           // Amplitud en X
  export let B = 2;           // Amplitud en Y  
  export let delta = Math.PI / 2;  // Diferencia de fase
  export let formula = 'seno'; // Tipo de función: 'seno' o 'coseno'
  export let duration = 10;   // Duración de la animación
  export let points = 1000;   // Número de puntos
  export let width = 600;     // Ancho del canvas
  export let height = 400;    // Alto del canvas
  
  let canvas;
  let animationId;
  let isAnimating = false;
  let currentTime = 0;
  
  // Función para generar puntos de la curva de Lissajous
  function generateLissajousPoints(numPoints, timeOffset = 0) {
    const points = [];
    const maxT = 2 * Math.PI + timeOffset;
    
    for (let i = 0; i < numPoints; i++) {
      const t = (i / numPoints) * maxT;
      
      let x, y;
      if (formula === 'coseno') {
        x = Math.cos(A * t + delta);
        y = Math.cos(B * t);
      } else {
        // Por defecto, usar seno
        x = Math.sin(A * t + delta);
        y = Math.sin(B * t);
      }
      
      points.push({ x, y });
    }
    
    return points;
  }
  
  // Función para dibujar la curva en el canvas
  function drawLissajous(timeOffset = 0) {
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Limpiar canvas
    ctx.clearRect(0, 0, width, height);
    
    // Configurar estilos
    ctx.strokeStyle = '#8B5CF6'; // Color púrpura
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Generar puntos
    const lissajousPoints = generateLissajousPoints(points, timeOffset);
    
    // Escalar y centrar los puntos
    const scaleX = (width - 40) / 2;
    const scaleY = (height - 40) / 2;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Dibujar la curva
    ctx.beginPath();
    for (let i = 0; i < lissajousPoints.length; i++) {
      const point = lissajousPoints[i];
      const x = centerX + point.x * scaleX;
      const y = centerY + point.y * scaleY;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
    
    // Dibujar punto actual (efecto de trazado)
    if (isAnimating && lissajousPoints.length > 0) {
      const currentIndex = Math.floor((timeOffset / (2 * Math.PI)) * lissajousPoints.length) % lissajousPoints.length;
      const currentPoint = lissajousPoints[currentIndex];
      const x = centerX + currentPoint.x * scaleX;
      const y = centerY + currentPoint.y * scaleY;
      
      ctx.fillStyle = '#EF4444'; // Color rojo para el punto actual
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    }
    
    // Dibujar ejes de referencia
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    
    // Eje X
    ctx.beginPath();
    ctx.moveTo(20, centerY);
    ctx.lineTo(width - 20, centerY);
    ctx.stroke();
    
    // Eje Y
    ctx.beginPath();
    ctx.moveTo(centerX, 20);
    ctx.lineTo(centerX, height - 20);
    ctx.stroke();
    
    ctx.setLineDash([]);
  }
  
  // Función de animación
  function animate() {
    if (!isAnimating) return;
    
    currentTime += 0.05; // Velocidad de animación
    drawLissajous(currentTime);
    
    animationId = requestAnimationFrame(animate);
    
    // Reiniciar la animación después de la duración especificada
    if (currentTime >= duration) {
      currentTime = 0;
    }
  }
  
  // Iniciar animación
  function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    currentTime = 0;
    animate();
  }
  
  // Detener animación
  function stopAnimation() {
    isAnimating = false;
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    // Dibujar versión estática
    drawLissajous(0);
  }
  
  // Función para actualizar el gráfico
  function updatePlot() {
    if (!canvas) return;
    
    if (isAnimating) {
      // Si está animando, continuar con la animación
      drawLissajous(currentTime);
    } else {
      // Si no está animando, dibujar versión estática
      drawLissajous(0);
    }
  }
  
  // Hook de montaje
  onMount(() => {
    if (browser && canvas) {
      drawLissajous(0);
    }
  });
  
  // Reactividad - actualizar cuando cambien las props
  $: if (browser && canvas) {
    updatePlot();
  }
  
  // Limpiar animación al desmontar el componente
  import { onDestroy } from 'svelte';
  onDestroy(() => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  });
</script>

<div class="lissajous-container">
  <!-- Información de la curva -->
  <div class="info-panel">
    <h4>Curva de Lissajous</h4>
    <p>
      x = {formula}({A}t + {(delta / Math.PI).toFixed(2)}π) &middot; 
      y = {formula}({B}t)
    </p>
    <p class="ratio">Razón de frecuencias: {A}:{B}</p>
  </div>
  
  <!-- Controles de animación -->
  <div class="animation-controls">
    <button on:click={startAnimation} disabled={isAnimating}>
      ▶️ Animar
    </button>
    <button on:click={stopAnimation} disabled={!isAnimating}>
      ⏸️ Pausar
    </button>
    <button on:click={() => { stopAnimation(); currentTime = 0; updatePlot(); }}>
      ⏹️ Reiniciar
    </button>
  </div>
  
  <!-- Canvas para dibujar -->
  <canvas
    bind:this={canvas}
    {width}
    {height}
    class="lissajous-canvas"
  />
  
  <!-- Información adicional -->
  <div class="details">
    <small>
      Puntos: {points} | 
      Fase: {(delta * 180 / Math.PI).toFixed(1)}° | 
      {isAnimating ? 'Animando...' : 'Estático'}
    </small>
  </div>
</div>

<style>
  .lissajous-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border: 2px solid #8B5CF6;
    border-radius: 12px;
    background: linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  
  .info-panel {
    text-align: center;
    background: white;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    border: 1px solid #E5E7EB;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    min-width: 300px;
  }
  
  .info-panel h4 {
    margin: 0 0 0.5rem 0;
    color: #8B5CF6;
    font-size: 1.1em;
  }
  
  .info-panel p {
    margin: 0.25rem 0;
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
    color: #374151;
  }
  
  .ratio {
    font-weight: bold;
    color: #8B5CF6 !important;
  }
  
  .animation-controls {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }
  
  .animation-controls button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 6px;
    background: #8B5CF6;
    color: white;
    cursor: pointer;
    font-size: 0.9em;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(139, 92, 246, 0.3);
  }
  
  .animation-controls button:hover:not(:disabled) {
    background: #7C3AED;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(139, 92, 246, 0.4);
  }
  
  .animation-controls button:disabled {
    background: #9CA3AF;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    opacity: 0.6;
  }
  
  .lissajous-canvas {
    border: 2px solid #D1D5DB;
    border-radius: 8px;
    background: white;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
  }
  
  .details {
    text-align: center;
    color: #6B7280;
    font-size: 0.8em;
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 6px;
    border: 1px solid #E5E7EB;
    min-width: 250px;
  }
  
  @media (max-width: 768px) {
    .lissajous-container {
      padding: 0.5rem;
    }
    
    .info-panel {
      min-width: auto;
      width: 100%;
    }
    
    .animation-controls {
      flex-wrap: wrap;
      justify-content: center;
    }
    
    .animation-controls button {
      flex: 1;
      min-width: 80px;
    }
    
    .details {
      min-width: auto;
      width: 100%;
    }
  }
</style>