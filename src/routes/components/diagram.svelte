<script lang="ts">
	import type { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types';
	import Excalidraw from './Excalidraw.svelte';
	import type { note } from '../types';

	// Variables
	// @ts-expect-error
	let newNote: note[] = [{}];
	let excalidrawAPI: ExcalidrawImperativeAPI = $state()!;

	// Functions
	async function addNewDiagram() {
		excalidrawAPI?.onChange(console.log);
	}
</script>

<div class="main p-1">
	<form>
		<div class="header-box">
			<h2 class="mb-6 text-3xl">Add a Diagram</h2>
			<div class="new-note-data">
				<Excalidraw theme="dark" excalidrawAPI={(api) => (excalidrawAPI = api)} />
			</div>
			<!-- <button class="btn btn-accent btn-outline" onclick={addNewDiagram}>Add Note</button> -->
		</div>
	</form>
</div>

<style>
	.main {
		padding: 20px;
		animation: fadeInDown 0.8s ease-in-out;
	}
	.header-box {
		text-align: center;
		animation: fadeInDown 0.6s ease-in-out;
	}

	.header-box h2 {
		font-size: 2.5rem;
		font-weight: bold;
		animation: fadeInDown 0.8s ease-in-out;
	}

	/* Form container */
	.new-note-data {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 20px;
		/* Space between fields */
		animation: fadeInDown 1s ease-in-out;
	}

	/* Label styling */
	.form-control {
		width: 100%;
		/* Full width for inputs */
		display: flex;
		flex-direction: column;
	}

	.form-control .label-text {
		font-weight: 600;
		margin-bottom: 5px;
		transition: color 0.3s ease-in-out;
	}

	/* Input styling */
	.form-control input {
		padding: 10px;
		border: 2px solid #333333;
		border-radius: 8px;
		font-size: 1rem;
		transition: all 0.3s ease-in-out;
	}

	.form-control input:focus {
		outline: none;
		box-shadow: 0 0 8px rgba(107, 190, 110, 0.4);
	}

	/* Button styling */
	.btn {
		padding: 10px 20px;
		font-size: 1rem;
		font-weight: 600;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.3s ease-in-out;
		align-self: center;
		/* Center align the button */
	}

	.btn:active {
		transform: translateY(0);
		box-shadow: none;
	}

	/* Animations */
	@keyframes fadeInDown {
		from {
			opacity: 0;
			transform: translateY(-50px);
		}

		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Ensure responsiveness for both desktop and mobile */
	@media (max-width: 768px) {
		.main {
			padding: 10px;
		}

		.new-note-data {
			gap: 15px;
		}

		.header-box h2 {
			font-size: 2rem;
		}

		.btn {
			width: 100%;
			/* Full-width button on smaller screens */
		}
	}
</style>
