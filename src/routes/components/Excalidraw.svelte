<script lang="ts">
	import { createElement } from 'react';
	import { createRoot } from 'react-dom/client';
	import type { ExcalidrawProps } from '@excalidraw/excalidraw/types/types';

	let props: ExcalidrawProps = $props();
	let rootEl: HTMLElement;

	//@ts-ignore
	$effect(async () => {
		const { Excalidraw, WelcomeScreen, MainMenu } = await import('@excalidraw/excalidraw');

		let root = createRoot(rootEl);
		root.render(
			createElement(Excalidraw, { ...props }, [
				createElement(WelcomeScreen, { key: 'WelcomeScreen' }),
				createElement(MainMenu, { key: 'MainMenu' }, [
					createElement(MainMenu.DefaultItems.LoadScene, { key: 'Export' }),
					createElement(MainMenu.DefaultItems.Export, { key: 'Export' }),
					createElement(MainMenu.DefaultItems.SaveAsImage, {
						key: 'SaveAsImage'
					}),
					createElement(MainMenu.Separator, { key: 'Separator' }),
					createElement(MainMenu.DefaultItems.ChangeCanvasBackground, {
						key: 'ChangeCanvasBackground'
					})
				])
			])
		);

		return () => {
			root.unmount();
		};
	});
</script>

<div bind:this={rootEl} class="root"></div>

<style>
	.root {
		height: 100vh;
	}
</style>
