<script lang="ts">
	import { createElement } from 'react';
	import { createRoot } from 'react-dom/client';
	import type {
		ExcalidrawProps,
		ExcalidrawInitialDataState
	} from '@excalidraw/excalidraw/types/types';
	import { showToast } from '$lib/utils/svelteToastsUtil';

	let props: ExcalidrawProps = $props();
	let rootEl: HTMLElement;
	// @ts-expect-error
	let content = props.content || '{"elements": [], "files": {}}';

	let initialData: ExcalidrawInitialDataState;
	try {
		const parsedContent = JSON.parse(content);
		if (parsedContent.elements || parsedContent) {
			initialData = parsedContent;
		} else {
			initialData = { elements: [], appState: {} };
		}
	} catch (error) {
		console.error('Failed to parse Excalidraw content JSON: ', error);
		showToast('There was an error...', 'Error parsing editor data.', 3000, 'error');
		initialData = { elements: [], appState: {} };
	}

	$effect(() => {
		const root = createRoot(rootEl);

		const excalidrawProps: ExcalidrawProps = {
			...props,
			initialData
		};

		import('@excalidraw/excalidraw').then(({ Excalidraw, WelcomeScreen, MainMenu }) => {
			const welcome = createElement(WelcomeScreen, { key: 'WelcomeScreen' });
			const menu = createElement(MainMenu, { key: 'MainMenu' }, [
				createElement(MainMenu.DefaultItems.LoadScene, { key: 'LoadScene' }),
				createElement(MainMenu.DefaultItems.SaveAsImage, { key: 'SaveAsImage' }),
				createElement(MainMenu.DefaultItems.Export, { key: 'Export' }),
				createElement(MainMenu.Separator, { key: 'Separator1' }),
				createElement(MainMenu.DefaultItems.ChangeCanvasBackground, {
					key: 'ChangeCanvasBackground'
				})
			]);
			const excalidraw = createElement(Excalidraw, excalidrawProps, [welcome, menu]);
			root.render(excalidraw);
		});

		return () => root.unmount();
	});
</script>

<div bind:this={rootEl} class="root"></div>

<style>
	.root {
		height: 100%;
	}
</style>
