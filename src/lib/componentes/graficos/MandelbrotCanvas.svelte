<script>
  import { onMount, beforeUpdate } from 'svelte';
  
  // Props que recibe el componente
  export let zoom = 1.0;
  export let maxIterations = 100;
  export let centerX = -0.5;
  export let centerY = 0.0;
  export let width = 600;
  export let height = 400;
  
  let canvas;
  let isGenerating = false;
  
  // Función para calcular el conjunto de Mandelbrot
  function mandelbrotSet(cx, cy, maxIter) {
    let x = 0, y = 0;
    let iteration = 0;
    
    while (x * x + y * y <= 4 && iteration < maxIter) {
      const xtemp = x * x - y * y + cx;
      y = 2 * x * y + cy;
      x = xtemp;
      iteration++;
    }
    
    return iteration;
  }
  
  // Función para obtener color basado en iteraciones
  function getColor(iterations, maxIter) {
    if (iterations === maxIter) {
      return [0, 0, 0, 255]; // Negro para puntos en el conjunto
    }
    
    // Gradiente de colores más vistoso
    const t = iterations / maxIter;
    const angle = t * 6.28318; // 2 * PI
    
    const r = Math.floor(128 + 127 * Math.cos(angle));
    const g = Math.floor(128 + 127 * Math.cos(angle + 2.094)); // +2π/3
    const b = Math.floor(128 + 127 * Math.cos(angle + 4.188)); // +4π/3
    
    return [r, g, b, 255];
  }
  
  // Función principal para dibujar el fractal
  function drawMandelbrot() {
    if (!canvas || isGenerating) return;
    
    isGenerating = true;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      isGenerating = false;
      return;
    }
    
    console.log("Dibujando Mandelbrot: zoom=${zoom.toFixed(2)}, center=(${centerX.toFixed(3)}, ${centerY.toFixed(3)), iter=${maxIterations}");
    
    // Crear ImageData para manipulación directa de píxeles
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    
    // Calcular el rango de coordenadas complejas
    const scale = 4.0 / zoom; // Rango base ajustado por zoom
    const xMin = centerX - scale / 2;
    const xMax = centerX + scale / 2;
    const yMin = centerY - (scale * height / width) / 2;
    const yMax = centerY + (scale * height / width) / 2;
    
    // Generar fractal píxel por píxel
    for (let py = 0; py < height; py++) {
      for (let px = 0; px < width; px++) {
        // Mapear coordenadas de píxel a plano complejo
        const x = xMin + (px / width) * (xMax - xMin);
        const y = yMin + (py / height) * (yMax - yMin);
        
        // Calcular iteraciones para este punto
        const iterations = mandelbrotSet(x, y, maxIterations);
        
        // Obtener color y asignarlo al píxel
        const color = getColor(iterations, maxIterations);
        const pixelIndex = (py * width + px) * 4;
        
        data[pixelIndex] = color[0];     // R
        data[pixelIndex + 1] = color[1]; // G
        data[pixelIndex + 2] = color[2]; // B
        data[pixelIndex + 3] = color[3]; // A
      }
    }
    
    // Dibujar en el canvas
    ctx.putImageData(imageData, 0, 0);
    isGenerating = false;
  }
  
  // Ejecutar cuando el componente se monta
  onMount(() => {
    if (canvas) {
      drawMandelbrot();
    }
  });
  
  // Reaccionar a cambios en las props
  $: if (canvas && !isGenerating) {
    // Pequeño delay para evitar demasiadas actualizaciones
    setTimeout(drawMandelbrot, 100);
  }
</script>

<div class="mandelbrot-container">
  {#if isGenerating}
    <div class="loading-overlay">
      <div class="spinner"></div>
      <p>Generando fractal...</p>
    </div>
  {/if}
  
  <canvas
    bind:this={canvas}
    {width}
    {height}
    class="mandelbrot-canvas"
    style="max-width: 100%; height: auto;"
  />
</div>

<style>
  .mandelbrot-container {
    position: relative;
    display: inline-block;
    border: 2px solid #007acc;
    border-radius: 8px;
    overflow: hidden;
    background: #000;
  }
  
  .mandelbrot-canvas {
    display: block;
    max-width: 100%;
    height: auto;
  }
  
  .loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    z-index: 10;
  }
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #333;
    border-top: 4px solid #007acc;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 10px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .loading-overlay p {
    margin: 0;
    font-size: 14px;
    opacity: 0.9;
  }
</style>