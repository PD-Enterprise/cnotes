import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
	plugins: [
		sveltekit(),
		tailwindcss()
	],
	define: {
		'process.env.IS_PREACT': JSON.stringify('true')
	}
});
