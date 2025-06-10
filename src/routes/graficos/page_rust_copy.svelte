<script>
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import Superficies3D from '$lib/componentes/graficos/Superficies3DPlot.svelte';
    
    let wasm = null; // Esta variable contendrá la instancia WASM *inicializada*
    let zData = [];
    let resolution = 50;
    let scale = 0.2;
    let formula = 'sombrero';
    let formulas = ['sombrero', 'coseno', 'ondas', 'gaussiana'];
    let isGenerating = false;
    let error = null;

    async function generarDatos() {
        if (!wasm || isGenerating) {
            console.log('WASM no disponible o ya generando');
            return;
        }

        isGenerating = true;
        error = null;
        
        try {
            console.log('Generando datos con parámetros:', { resolution, scale, formula });
            
            const surfaceResult = wasm.superficie_custom(resolution, resolution, scale, formula);
            const flatData = surfaceResult.getData(); 
            surfaceResult.free(); 
            
            console.log('Datos recibidos del WASM (planos):', {
                tipo: typeof flatData,
                longitud: flatData?.length,
                esArray: Array.isArray(flatData),
                primeros5: flatData?.slice(0, 5)
            });
            
            if (!flatData || flatData.length === 0) {
                throw new Error('No se recibieron datos del módulo WASM');
            }
            
            if (flatData.length !== resolution * resolution) {
                throw new Error(`Longitud de datos incorrecta: esperado ${resolution * resolution}, recibido ${flatData.length}`);
            }
            
            zData = [];
            for (let j = 0; j < resolution; j++) {
                const row = [];
                for (let i = 0; i < resolution; i++) {
                    row.push(flatData[j * resolution + i]);
                }
                zData.push(row);
            }
            
            console.log('Datos convertidos exitosamente (2D):', {
                filas: zData.length,
                columnas: zData[0]?.length,
                muestraDatos: zData.slice(0, 2).map(row => row.slice(0, 5))
            });
            
        } catch (err) {
            console.error('Error generando datos:', err);
            error = err.message;
        } finally {
            isGenerating = false;
        }
    }

onMount(async () => {
    if (browser) {
        try {
            console.log('Cargando módulo WASM...');
            const wasmLoader = await import('/wasm/superficies3d/pkg');
            console.log('Objeto cargador WASM:', wasmLoader);
            wasm = await wasmLoader.default(); 
            console.log('Módulo WASM inicializado y listo:', wasm); 
            console.log('Funciones disponibles en instancia WASM:', Object.keys(wasm));

            // Asegúrate de que la fórmula tenga un valor por defecto antes de la primera llamada
            if (!formula) { // Si por alguna razón está vacía, forzarla
                formula = 'sombrero';
                console.log('Fórmula forzada a:', formula);
            }

            // Generar datos iniciales
            await generarDatos();

        } catch (err) {
            console.error('Error cargando WASM:', err);
            error = `Error cargando WASM: ${err.message}`;
        }
    }
});


	function handleParameterChange() {
		if (wasm && !isGenerating) {
			generarDatos();
		}
	}

	function debugWasm() {
		if (!wasm) {
			console.log("WASM no cargado");
			return;
		}

		try {
			console.log("=== DEBUG WASM ===");
			console.log("Funciones disponibles:", Object.keys(wasm));

			// Probar función con estructura
			console.log("Probando superficie_custom...");
			const testResult = wasm.superficie_custom(10, 10, 0.1, "sombrero");
			console.log("Función con estructura - tipo:", typeof testResult);
			console.log("Función con estructura - objeto:", testResult);

			// Ver métodos disponibles
			const prototype = Object.getPrototypeOf(testResult);
			const methods = Object.getOwnPropertyNames(prototype);
			console.log("Métodos de estructura:", methods);

			// Probar métodos específicos
			console.log("testResult.width (getter):", testResult.width);
			console.log("testResult.height (getter):", testResult.height);
			console.log("testResult.length (getter):", testResult.length);

			// Probar getData
			if (testResult.getData) {
				console.log("getData disponible, probando...");
				const data = testResult.getData();
				console.log("getData - tipo:", typeof data);
				console.log("getData - longitud:", data?.length);
				console.log("getData - primeros 5:", data?.slice(0, 5));
			} else {
				console.log("getData NO disponible");
			}

			// ¡IMPORTANTE! Liberar la memoria de la instancia de Rust después de usarla
			testResult.free();
			console.log("Instancia de SurfaceResult liberada.");
		} catch (err) {
			console.error("Error en debug:", err);
			console.error("Stack:", err.stack);
		}
	}
</script>

<main>
	<h1>Visualizador de Superficies 3D</h1>

	{#if error}
		<div class="error">
			❌ Error: {error}
		</div>
	{/if}

	<form on:submit|preventDefault={generarDatos}>
		<div class="controls">
			<label>
				Resolución: {resolution}x{resolution}
				<input
					type="range"
					bind:value={resolution}
					min="10"
					max="100"
					step="5"
					on:change={handleParameterChange}
				/>
			</label>

			<label>
				Escala: {scale}
				<input
					type="range"
					step="0.01"
					bind:value={scale}
					min="0.05"
					max="0.5"
					on:change={handleParameterChange}
				/>
			</label>

			<label>
				Fórmula:
				<select bind:value={formula} on:change={handleParameterChange}>
					{#each formulas as f}
						<option value={f}>{f}</option>
					{/each}
				</select>
			</label>
		</div>

		<button type="submit" disabled={isGenerating || !wasm}>
			{isGenerating ? "🔄 Generando..." : "🔄 Actualizar"}
		</button>

		<button type="button" on:click={debugWasm} disabled={!wasm}>
			🔍 Debug WASM
		</button>
	</form>

	{#if zData && zData.length > 0}
		<Superficies3D
			{zData}
			{resolution}
			title="Superficie 3D: {formula.toUpperCase()}"
		/>
	{:else if wasm && !isGenerating}
		<div class="placeholder">
			📊 Esperando datos... Haz clic en "Actualizar"
		</div>
	{:else if !wasm}
		<div class="placeholder">⏳ Cargando módulo WebAssembly...</div>
	{/if}

	<div class="debug-info">
		<h3>Debug Info:</h3>
		<ul>
			<li>WASM cargado: {wasm ? "✅" : "❌"}</li>
			<li>Datos disponibles: {zData?.length > 0 ? "✅" : "❌"}</li>
			<li>Filas de datos: {zData?.length || 0}</li>
			<li>Columnas de datos: {zData?.[0]?.length || 0}</li>
			<li>Generando: {isGenerating ? "🔄" : "⏹️"}</li>
			<li>Fórmula actual: {formula}</li>
			<li>Resolución actual: {resolution}</li>
			<li>Escala actual: {scale}</li>
		</ul>
	</div>
</main>

<style>
	main {
		max-width: 1200px;

		margin: 0 auto;

		padding: 20px;

		font-family: Arial, sans-serif;
	}

	.controls {
		display: grid;

		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));

		gap: 20px;

		margin: 20px 0;

		padding: 20px;

		background: #f5f5f5;

		border-radius: 8px;
	}

	.controls label {
		display: flex;

		flex-direction: column;

		gap: 8px;
	}

	.controls input,
	.controls select {
		padding: 8px;

		border: 1px solid #ddd;

		border-radius: 4px;
	}

	button {
		padding: 12px 24px;

		background: #007cba;

		color: white;

		border: none;

		border-radius: 4px;

		cursor: pointer;

		font-size: 16px;

		margin: 10px 5px 10px 0;
	}

	button:disabled {
		background: #ccc;

		cursor: not-allowed;
	}

	.error {
		background: #ffe6e6;

		color: #d63031;

		padding: 12px;

		border-radius: 4px;

		margin: 10px 0;

		border: 1px solid #d63031;
	}

	.placeholder {
		text-align: center;

		padding: 40px;

		background: #f8f9fa;

		border-radius: 8px;

		color: #666;

		font-size: 18px;
	}

	.debug-info {
		margin-top: 20px;

		padding: 15px;

		background: #f0f0f0;

		border-radius: 4px;

		font-size: 14px;
	}

	.debug-info ul {
		list-style: none;

		padding: 0;
	}

	.debug-info li {
		margin: 5px 0;
	}
</style>
