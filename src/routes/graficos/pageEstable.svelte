<script>
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    import Superficies3D from "$lib/componentes/graficos/Superficies3DPlot.svelte";
    import '../../styles/graphs.css';

    // Variables para Superficies 3D
    let zData = [];
    let resolution = 50;
    let scale = 0.2;
    let formula = "sombrero";
    let isGenerating = false;
    let showCustomEditor = false;
    let customFormula = "Math.sin(Math.sqrt(x*x + y*y))";

    // Parámetros personalizables para cada fórmula
    let parameters = {
        sombrero: { amplitude: 1, frequency: 1 },
        coseno: { amplitude: 1, frequency: 1 },
        ondas: { amplitude: 0.5, frequency: 3, separation: 1 },
        gaussiana: { amplitude: 1, spread: 2 },
        paraboloide: { curvature: 1, offset: 0 },
        silla: { curvatureX: 1, curvatureY: 1 },
        custom: {},
    };

    // Formulas disponibles con parámetros
    const formulas = {
        sombrero: (x, y) => {
            const { amplitude, frequency } = parameters.sombrero;
            const r = Math.sqrt(x * x + y * y) * frequency;
            return r === 0 ? amplitude : (amplitude * Math.sin(r)) / r;
        },
        coseno: (x, y) => {
            const { amplitude, frequency } = parameters.coseno;
            return amplitude * Math.cos(x * y * frequency);
        },
        ondas: (x, y) => {
            const { amplitude, frequency, separation } = parameters.ondas;
            const r1 = Math.sqrt((x - separation) ** 2 + y ** 2);
            const r2 = Math.sqrt((x + separation) ** 2 + y ** 2);
            return (
                amplitude * Math.sin(r1 * frequency) +
                amplitude * Math.sin(r2 * frequency)
            );
        },
        gaussiana: (x, y) => {
            const { amplitude, spread } = parameters.gaussiana;
            return amplitude * Math.exp(-(x ** 2 + y ** 2) / spread);
        },
        paraboloide: (x, y) => {
            const { curvature, offset } = parameters.paraboloide;
            return curvature * (x ** 2 + y ** 2) + offset;
        },
        silla: (x, y) => {
            const { curvatureX, curvatureY } = parameters.silla;
            return curvatureX * x ** 2 - curvatureY * y ** 2;
        },
        custom: (x, y) => {
            try {
                // Evaluar la fórmula personalizada
                return eval(
                    customFormula
                        .replace(/x/g, `(${x})`)
                        .replace(/y/g, `(${y})`),
                );
            } catch (error) {
                console.error("Error en fórmula personalizada:", error);
                return 0;
            }
        },
    };

    // Descripciones de las fórmulas
    const formulaDescriptions = {
        sombrero: "z = A × sin(f×r)/r donde r = √(x² + y²)",
        coseno: "z = A × cos(f × x × y)",
        ondas: "z = A × [sin(f×r₁) + sin(f×r₂)]",
        gaussiana: "z = A × e^(-(x² + y²)/s)",
        paraboloide: "z = c × (x² + y²) + offset",
        silla: "z = cₓ × x² - cᵧ × y²",
        custom: "Fórmula personalizada",
    };

    // Generar datos de superficie usando la fórmula seleccionada
    function generateSurfaceData() {
        if (!browser) return [];

        const data = [];
        const formulaFn = formulas[formula];

        for (let j = 0; j < resolution; j++) {
            const row = [];
            for (let i = 0; i < resolution; i++) {
                const x = (i - resolution / 2) * scale;
                const y = (j - resolution / 2) * scale;
                try {
                    const z = formulaFn(x, y);
                    row.push(isNaN(z) || !isFinite(z) ? 0 : z);
                } catch (error) {
                    row.push(0);
                }
            }
            data.push(row);
        }

        return data;
    }

    // Actualizar superficie
    async function updateSurface() {
        isGenerating = true;
        // Pequeño delay para mostrar el loading
        await new Promise((resolve) => setTimeout(resolve, 50));
        zData = generateSurfaceData();
        isGenerating = false;
    }

    // Manejar cambios de parámetros desde el componente
    function handleParametersChange(event) {
        const {
            resolution: newResolution,
            scale: newScale,
            formula: newFormula,
        } = event.detail;
        if (newResolution !== undefined) resolution = newResolution;
        if (newScale !== undefined) scale = newScale;
        if (newFormula !== undefined) formula = newFormula;
        updateSurface();
    }

    // Resetear parámetros a valores por defecto
    function resetParameters() {
        parameters = {
            sombrero: { amplitude: 1, frequency: 1 },
            coseno: { amplitude: 1, frequency: 1 },
            ondas: { amplitude: 0.5, frequency: 3, separation: 1 },
            gaussiana: { amplitude: 1, spread: 2 },
            paraboloide: { curvature: 1, offset: 0 },
            silla: { curvatureX: 1, curvatureY: 1 },
            custom: {},
        };
        updateSurface();
    }

    // Ejemplos de fórmulas personalizadas
    const customExamples = [
        "Math.sin(Math.sqrt(x*x + y*y))",
        "Math.sin(x) * Math.cos(y)",
        "x*x - y*y",
        "Math.exp(-(x*x + y*y)/4) * Math.cos(5*Math.sqrt(x*x + y*y))",
        "Math.sin(x*3) + Math.cos(y*3)",
        "(x*x + y*y) * Math.sin(x*y)",
    ];

    // Reactividad
    $: if (browser && (resolution || scale || formula)) {
        updateSurface();
    }

    // Actualizar cuando cambien los parámetros
    $: if (browser && parameters) {
        updateSurface();
    }

    onMount(() => {
        updateSurface();
    });
</script>

<svelte:head>
    <title>Superficies 3D - Visualizador Matemático</title>
    <meta
        name="description"
        content="Visualizador interactivo de superficies matemáticas en 3D"
    />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<div class="graphs-page">
    <div class="app-container">
        <!-- Header -->
        <header class="header">
            <div class="header-content">
                <h1 class="app-title">
                    <span class="title-icon">🏔️</span>
                    Superficies 3D
                </h1>
                <nav class="header-nav">
                    <a href="/" class="nav-link">
                        <span class="nav-icon">🧮</span>
                        Calculadora
                    </a>
                </nav>
            </div>
        </header>

        <!-- Controles principales -->
        <div class="controls-container">
            <div class="controls-content">
                <div class="control-group">
                    <label for="formula-select">Fórmula:</label>
                    <select
                        id="formula-select"
                        bind:value={formula}
                        disabled={isGenerating}
                    >
                        <option value="sombrero">Sombrero (sinc)</option>
                        <option value="coseno">Coseno</option>
                        <option value="ondas">Ondas</option>
                        <option value="gaussiana">Gaussiana</option>
                        <option value="paraboloide">Paraboloide</option>
                        <option value="silla">Silla de montar</option>
                        <option value="custom">Personalizada</option>
                    </select>
                </div>

                <div class="control-group">
                    <label for="resolution-range"
                        >Resolución: {resolution}</label
                    >
                    <input
                        id="resolution-range"
                        type="range"
                        bind:value={resolution}
                        min="20"
                        max="100"
                        step="5"
                        disabled={isGenerating}
                    />
                </div>

                <div class="control-group">
                    <label for="scale-range">Escala: {scale.toFixed(2)}</label>
                    <input
                        id="scale-range"
                        type="range"
                        bind:value={scale}
                        min="0.1"
                        max="0.5"
                        step="0.05"
                        disabled={isGenerating}
                    />
                </div>

                <button
                    class="reset-btn"
                    on:click={resetParameters}
                    disabled={isGenerating}
                >
                    🔄 Resetear
                </button>
            </div>
        </div>

        <!-- Panel de parámetros específicos -->
        <div class="parameters-container">
            <div class="parameters-content">
                <div class="formula-info">
                    <h3>📊 {formulaDescriptions[formula]}</h3>
                </div>

                {#if formula === "custom"}
                    <div class="custom-formula-section">
                        <div class="custom-input-group">
                            <label for="custom-formula"
                                >Fórmula personalizada (usar x, y):</label
                            >
                            <input
                                id="custom-formula"
                                type="text"
                                bind:value={customFormula}
                                placeholder="Math.sin(x) * Math.cos(y)"
                                disabled={isGenerating}
                            />
                        </div>

                        <div class="examples-section">
                            <label>Ejemplos:</label>
                            <div class="examples-grid">
                                {#each customExamples as example}
                                    <button
                                        class="example-btn"
                                        on:click={() =>
                                            (customFormula = example)}
                                        disabled={isGenerating}
                                    >
                                        {example}
                                    </button>
                                {/each}
                            </div>
                        </div>
                    </div>
                {:else}
                    <div class="parameters-grid">
                        {#if formula === "sombrero"}
                            <div class="param-group">
                                <label
                                    >Amplitud: {parameters.sombrero.amplitude.toFixed(
                                        2,
                                    )}</label
                                >
                                <input
                                    type="range"
                                    bind:value={parameters.sombrero.amplitude}
                                    min="0.1"
                                    max="3"
                                    step="0.1"
                                    disabled={isGenerating}
                                />
                            </div>
                            <div class="param-group">
                                <label
                                    >Frecuencia: {parameters.sombrero.frequency.toFixed(
                                        2,
                                    )}</label
                                >
                                <input
                                    type="range"
                                    bind:value={parameters.sombrero.frequency}
                                    min="0.1"
                                    max="3"
                                    step="0.1"
                                    disabled={isGenerating}
                                />
                            </div>
                        {/if}

                        {#if formula === "coseno"}
                            <div class="param-group">
                                <label
                                    >Amplitud: {parameters.coseno.amplitude.toFixed(
                                        2,
                                    )}</label
                                >
                                <input
                                    type="range"
                                    bind:value={parameters.coseno.amplitude}
                                    min="0.1"
                                    max="3"
                                    step="0.1"
                                    disabled={isGenerating}
                                />
                            </div>
                            <div class="param-group">
                                <label
                                    >Frecuencia: {parameters.coseno.frequency.toFixed(
                                        2,
                                    )}</label
                                >
                                <input
                                    type="range"
                                    bind:value={parameters.coseno.frequency}
                                    min="0.1"
                                    max="3"
                                    step="0.1"
                                    disabled={isGenerating}
                                />
                            </div>
                        {/if}

                        {#if formula === "ondas"}
                            <div class="param-group">
                                <label
                                    >Amplitud: {parameters.ondas.amplitude.toFixed(
                                        2,
                                    )}</label
                                >
                                <input
                                    type="range"
                                    bind:value={parameters.ondas.amplitude}
                                    min="0.1"
                                    max="2"
                                    step="0.1"
                                    disabled={isGenerating}
                                />
                            </div>
                            <div class="param-group">
                                <label
                                    >Frecuencia: {parameters.ondas.frequency.toFixed(
                                        1,
                                    )}</label
                                >
                                <input
                                    type="range"
                                    bind:value={parameters.ondas.frequency}
                                    min="1"
                                    max="8"
                                    step="0.5"
                                    disabled={isGenerating}
                                />
                            </div>
                            <div class="param-group">
                                <label
                                    >Separación: {parameters.ondas.separation.toFixed(
                                        2,
                                    )}</label
                                >
                                <input
                                    type="range"
                                    bind:value={parameters.ondas.separation}
                                    min="0.5"
                                    max="3"
                                    step="0.1"
                                    disabled={isGenerating}
                                />
                            </div>
                        {/if}

                        {#if formula === "gaussiana"}
                            <div class="param-group">
                                <label
                                    >Amplitud: {parameters.gaussiana.amplitude.toFixed(
                                        2,
                                    )}</label
                                >
                                <input
                                    type="range"
                                    bind:value={parameters.gaussiana.amplitude}
                                    min="0.1"
                                    max="3"
                                    step="0.1"
                                    disabled={isGenerating}
                                />
                            </div>
                            <div class="param-group">
                                <label
                                    >Dispersión: {parameters.gaussiana.spread.toFixed(
                                        1,
                                    )}</label
                                >
                                <input
                                    type="range"
                                    bind:value={parameters.gaussiana.spread}
                                    min="0.5"
                                    max="5"
                                    step="0.1"
                                    disabled={isGenerating}
                                />
                            </div>
                        {/if}

                        {#if formula === "paraboloide"}
                            <div class="param-group">
                                <label
                                    >Curvatura: {parameters.paraboloide.curvature.toFixed(
                                        2,
                                    )}</label
                                >
                                <input
                                    type="range"
                                    bind:value={
                                        parameters.paraboloide.curvature
                                    }
                                    min="0.1"
                                    max="3"
                                    step="0.1"
                                    disabled={isGenerating}
                                />
                            </div>
                            <div class="param-group">
                                <label
                                    >Offset: {parameters.paraboloide.offset.toFixed(
                                        2,
                                    )}</label
                                >
                                <input
                                    type="range"
                                    bind:value={parameters.paraboloide.offset}
                                    min="-2"
                                    max="2"
                                    step="0.1"
                                    disabled={isGenerating}
                                />
                            </div>
                        {/if}

                        {#if formula === "silla"}
                            <div class="param-group">
                                <label
                                    >Curvatura X: {parameters.silla.curvatureX.toFixed(
                                        2,
                                    )}</label
                                >
                                <input
                                    type="range"
                                    bind:value={parameters.silla.curvatureX}
                                    min="0.1"
                                    max="3"
                                    step="0.1"
                                    disabled={isGenerating}
                                />
                            </div>
                            <div class="param-group">
                                <label
                                    >Curvatura Y: {parameters.silla.curvatureY.toFixed(
                                        2,
                                    )}</label
                                >
                                <input
                                    type="range"
                                    bind:value={parameters.silla.curvatureY}
                                    min="0.1"
                                    max="3"
                                    step="0.1"
                                    disabled={isGenerating}
                                />
                            </div>
                        {/if}
                    </div>
                {/if}
            </div>
        </div>

        <!-- Contenido principal -->
        <main class="main-content">
            {#if isGenerating}
                <div class="loading-overlay">
                    <div class="loading-spinner"></div>
                    <p class="loading-text">Generando superficie...</p>
                </div>
            {/if}

            <div class="graph-container">
                <Superficies3D
                    {zData}
                    xRange={[-5, 5]}
                    yRange={[-5, 5]}
                    {resolution}
                    enableControls={true}
                    autoRotate={false}
                    on:parametersChange={handleParametersChange}
                />
            </div>
        </main>
    </div>
</div>
