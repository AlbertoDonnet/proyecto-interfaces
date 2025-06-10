<script>
	import { onMount } from 'svelte';
	//import Fractales from '$lib/componentes/graficos/MandelbrotCanvas.svelte';
	//import LissajousPlot from '$lib/componentes/graficos/LissajousPlot.svelte';
	import Superficies3D from '$lib/componentes/graficos/Superficies3DPlot.svelte';

	let selected = 'fractales';

	let wasm = null;
	let zData = [];

	let resolution = 50;
	let xRange = [-5, 5];
	let yRange = [-5, 5];

	function selectTab(tabName) {
		selected = tabName;
	}

	onMount(async () => {

		const wasmModule = await import('/wasm/fractales/pkg'); // Ajustá la ruta si usás otra
		console.log('wasmModule cargado:', wasmModule);
		wasm = wasmModule;

		// Generar zData para Superficies3D
		const ptr = wasm.generate_surface(xRange[0], xRange[1], yRange[0], yRange[1], resolution);
		const flat = new Float32Array(wasm.memory.buffer, ptr, resolution * resolution);

		// Convertir en matriz zData
		zData = [];
		for (let i = 0; i < resolution; i++) {
			zData.push(flat.slice(i * resolution, (i + 1) * resolution));
		}
	});
</script>

<nav style="margin-bottom: 1rem;">
	<a href="/" style="color: #007acc; text-decoration: underline;">← Ir a Calculadora</a>
</nav>

<div role="tablist" aria-label="Selector de gráficos">
	<button
		role="tab"
		aria-selected={selected === 'fractales'}
		aria-controls="tabpanel-fractales"
		id="tab-fractales"
		tabindex={selected === 'fractales' ? 0 : -1}
		on:click={() => selectTab('fractales')}
	>
		Fractales
	</button>

	<button
		role="tab"
		aria-selected={selected === 'lissajous'}
		aria-controls="tabpanel-lissajous"
		id="tab-lissajous"
		tabindex={selected === 'lissajous' ? 0 : -1}
		on:click={() => selectTab('lissajous')}
	>
		Lissajous
	</button>

	<button
		role="tab"
		aria-selected={selected === 'superficies'}
		aria-controls="tabpanel-superficies"
		id="tab-superficies"
		tabindex={selected === 'superficies' ? 0 : -1}
		on:click={() => selectTab('superficies')}
	>
		Superficies 3D
	</button>
</div>

{#if wasm}
	<div
		role="tabpanel"
		id="tabpanel-fractales"
		aria-labelledby="tab-fractales"
		hidden={selected !== 'fractales'}
	>
		<Fractales {wasm} />
	</div>

	<div
		role="tabpanel"
		id="tabpanel-lissajous"
		aria-labelledby="tab-lissajous"
		hidden={selected !== 'lissajous'}
	>
		<LissajousPlot {wasm} />
	</div>

	<div
		role="tabpanel"
		id="tabpanel-superficies"
		aria-labelledby="tab-superficies"
		hidden={selected !== 'superficies'}
	>
		<Superficies3D {zData} {xRange} {yRange} {resolution} />
	</div>
{:else}
	<p>Cargando WebAssembly...</p>
{/if}

<style>
	[role="tablist"] {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	[role="tab"] {
		padding: 0.5rem 1rem;
		cursor: pointer;
		border: none;
		background: #eee;
		border-radius: 4px 4px 0 0;
		font-weight: 600;
	}

	[role="tab"][aria-selected="true"] {
		background: white;
		border-bottom: 2px solid #007acc;
		color: #007acc;
	}

	[role="tabpanel"] {
		border: 1px solid #ccc;
		padding: 1rem;
	}
</style>
