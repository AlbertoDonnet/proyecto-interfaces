<script>
    import { onMount, onDestroy } from "svelte";
    import { browser } from "$app/environment";

    let Plotly;
    let plotDiv;
    
    export let zData = [];
    export let xRange = [-5, 5];
    export let yRange = [-5, 5];
    export let resolution = 50;
    export let title = "Superficie 3D";
    export let height = "600px"; // Altura personalizable
    export let enableControls = true;
    export let autoRotate = false;

    let plotInitialized = false;
    let resizeObserver;

    // Función para crear las coordenadas X e Y
    function generateCoordinates(range, resolution) {
        const coords = [];
        for (let i = 0; i < resolution; i++) {
            coords.push(
                range[0] + ((range[1] - range[0]) * i) / (resolution - 1),
            );
        }
        return coords;
    }

    // Función principal para crear/actualizar el plot
    async function createOrUpdatePlot() {
        if (!browser || !Plotly || !plotDiv || !zData || zData.length === 0) {
            console.log("Condiciones no cumplidas para crear plot:", {
                browser,
                Plotly: !!Plotly,
                plotDiv: !!plotDiv,
                zDataLength: zData?.length,
            });
            return;
        }

        try {
            console.log("Creando plot con datos:", {
                zDataRows: zData.length,
                zDataCols: zData[0]?.length,
                resolution,
            });

            const x = generateCoordinates(xRange, resolution);
            const y = generateCoordinates(yRange, resolution);

            const data = [
                {
                    z: zData,
                    x: x,
                    y: y,
                    type: "surface",
                    colorscale: "Viridis",
                    showscale: true,
                    opacity: 0.9,
                    // Mejorar contornos para mejor visualización
                    contours: {
                        z: {
                            show: true,
                            usecolormap: true,
                            highlightcolor: "#42f462",
                            project: { z: true },
                            width: 2
                        },
                    },
                    // Añadir reflectancia para mejor apariencia
                    lighting: {
                        ambient: 0.4,
                        diffuse: 0.8,
                        fresnel: 0.2,
                        specular: 1.0,
                        roughness: 0.05
                    }
                },
            ];

            const layout = {
                title: {
                    text: title,
                    font: { 
                        size: 18,
                        color: '#2c3e50',
                        family: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
                    },
                    x: 0.5,
                    xanchor: 'center'
                },
                autosize: true,
                margin: { l: 10, r: 10, b: 10, t: 60 },
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)',
                scene: {
                    camera: {
                        eye: { x: 1.5, y: 1.5, z: 1.5 },
                    },
                    bgcolor: 'rgba(248, 249, 250, 1)',
                    xaxis: {
                        title: {
                            text: "X",
                            font: { size: 14, color: '#495057' }
                        },
                        range: xRange,
                        gridcolor: 'rgba(0,0,0,0.1)',
                        zerolinecolor: 'rgba(0,0,0,0.2)',
                        tickfont: { size: 11, color: '#495057' }
                    },
                    yaxis: {
                        title: {
                            text: "Y",
                            font: { size: 14, color: '#495057' }
                        },
                        range: yRange,
                        gridcolor: 'rgba(0,0,0,0.1)',
                        zerolinecolor: 'rgba(0,0,0,0.2)',
                        tickfont: { size: 11, color: '#495057' }
                    },
                    zaxis: {
                        title: {
                            text: "Z",
                            font: { size: 14, color: '#495057' }
                        },
                        gridcolor: 'rgba(0,0,0,0.1)',
                        zerolinecolor: 'rgba(0,0,0,0.2)',
                        tickfont: { size: 11, color: '#495057' }
                    },
                },
            };

            const config = {
                responsive: true,
                displayModeBar: enableControls,
                displaylogo: false,
                modeBarButtonsToRemove: ['lasso2d', 'select2d', 'autoScale2d'],
                toImageButtonOptions: {
                    format: 'png',
                    filename: 'superficie_3d',
                    height: 800,
                    width: 1200,
                    scale: 2
                }
            };

            if (plotInitialized) {
                // Actualizar plot existente
                await Plotly.react(plotDiv, data, layout, config);
            } else {
                // Crear nuevo plot
                await Plotly.newPlot(plotDiv, data, layout, config);
                plotInitialized = true;
                console.log("Plot inicializado correctamente");
            }

            // Auto-rotación si está habilitada
            if (autoRotate && plotInitialized) {
                startAutoRotation();
            }
        } catch (error) {
            console.error("Error creando/actualizando plot:", error);
        }
    }

    // Función para auto-rotación
    function startAutoRotation() {
        if (!autoRotate || !plotInitialized) return;
        
        let angle = 0;
        const rotationInterval = setInterval(() => {
            if (!autoRotate || !plotInitialized) {
                clearInterval(rotationInterval);
                return;
            }
            
            angle += 1;
            const radians = (angle * Math.PI) / 180;
            const camera = {
                eye: {
                    x: 1.5 * Math.cos(radians),
                    y: 1.5 * Math.sin(radians),
                    z: 1.5
                }
            };
            
            Plotly.relayout(plotDiv, { 'scene.camera': camera });
        }, 100);
    }

    onMount(async () => {
        if (browser) {
            try {
                console.log("Cargando Plotly...");
                // Cargar Plotly dinámicamente
                Plotly = (await import("plotly.js-dist-min")).default;
                console.log("Plotly cargado:", !!Plotly);

                // Configurar ResizeObserver para responsividad
                if (plotDiv && window.ResizeObserver) {
                    resizeObserver = new ResizeObserver(() => {
                        if (plotInitialized && Plotly) {
                            Plotly.Plots.resize(plotDiv);
                        }
                    });
                    resizeObserver.observe(plotDiv);
                }

                // Crear plot inicial si hay datos
                if (zData && zData.length > 0) {
                    await createOrUpdatePlot();
                }
            } catch (error) {
                console.error("Error en onMount:", error);
            }
        }
    });

    onDestroy(() => {
        if (resizeObserver) {
            resizeObserver.disconnect();
        }
        if (plotDiv && Plotly) {
            Plotly.purge(plotDiv);
        }
    });

    // Reactive statement para actualizar cuando cambien los datos
    $: if (browser && Plotly && plotDiv && zData && zData.length > 0) {
        console.log("Datos cambiaron, actualizando plot...");
        createOrUpdatePlot();
    }
</script>

<!-- Contenedor principal con mejor estética -->
<div class="plot-wrapper">
    <div 
        bind:this={plotDiv}
        style="width: 100%; height: {height};"
        class="plot-container"
    >
        {#if !plotInitialized}
            <div class="loading-container">
                <div class="loading-content">
                    <div class="loading-spinner">
                        <div class="spinner-ring"></div>
                        <div class="spinner-icon">🏔️</div>
                    </div>
                    <div class="loading-text">
                        <h3>Cargando visualización 3D...</h3>
                        <p>Preparando {zData?.length || 0} filas de datos</p>
                    </div>
                </div>
            </div>
        {/if}
    </div>
</div>

<style>
    .plot-wrapper {
        width: 100%;
        max-width: 100%;
        margin: 0 auto;
        padding: 0;
        box-sizing: border-box;
    }

    .plot-container {
        border-radius: 12px;
        overflow: hidden;
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        box-shadow: 
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(222, 226, 230, 0.8);
        position: relative;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .plot-container:hover {
        box-shadow: 
            0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        transform: translateY(-1px);
    }

    .loading-container {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 100%;
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        position: relative;
    }

    .loading-content {
        text-align: center;
        color: #495057;
    }

    .loading-spinner {
        position: relative;
        margin: 0 auto 20px;
        width: 60px;
        height: 60px;
    }

    .spinner-ring {
        position: absolute;
        top: 0;
        left: 0;
        width: 60px;
        height: 60px;
        border: 3px solid transparent;
        border-top: 3px solid #007bff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    .spinner-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 24px;
        animation: pulse 2s ease-in-out infinite;
    }

    .loading-text h3 {
        margin: 0 0 8px 0;
        font-size: 18px;
        font-weight: 600;
        color: #2c3e50;
    }

    .loading-text p {
        margin: 0;
        font-size: 14px;
        color: #6c757d;
        opacity: 0.8;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    @keyframes pulse {
        0%, 100% { 
            opacity: 1; 
            transform: translate(-50%, -50%) scale(1);
        }
        50% { 
            opacity: 0.7; 
            transform: translate(-50%, -50%) scale(1.1);
        }
    }

    /* Responsividad */
    @media (max-width: 768px) {
        .plot-container {
            border-radius: 8px;
            margin: 0;
        }
        
        .loading-text h3 {
            font-size: 16px;
        }
        
        .loading-text p {
            font-size: 13px;
        }
    }

    /* Mejoras para el tema oscuro */
    @media (prefers-color-scheme: dark) {
        .plot-container {
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
            border-color: rgba(108, 117, 125, 0.3);
            box-shadow: 
                0 4px 6px -1px rgba(0, 0, 0, 0.3),
                0 2px 4px -1px rgba(0, 0, 0, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        .loading-container {
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
        }

        .loading-text h3 {
            color: #ecf0f1;
        }

        .loading-text p {
            color: #bdc3c7;
        }

        .spinner-ring {
            border-top-color: #3498db;
        }
    }
</style>