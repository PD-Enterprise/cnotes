/// <reference types="@sveltejs/kit" />
import { build, files, version } from '$service-worker';

const CACHE = `cnotes-${version}`;

const ASSETS = [...build, ...files];

const OFFLINE_HTML = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Offline - Cnotes</title><style>body{font-family:system-ui,sans-serif;display:grid;place-items:center;height:100dvh;margin:0;background:#1d232a;color:#fff;text-align:center;padding:1rem}h1{font-size:1.5rem}p{color:#888}</style></head><body><h1>You're offline</h1><p>Please check your connection and try again.</p></body></html>`;

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches
			.open(CACHE)
			.then((cache) => Promise.all(ASSETS.map((asset) => cache.add(asset).catch(() => {}))))
			.then(() => self.skipWaiting())
	);
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
			.then(() => self.clients.claim())
	);
});

self.addEventListener('fetch', (event) => {
	const { request } = event;
	const url = new URL(request.url);

	if (url.origin !== self.location.origin) return;
	if (request.method !== 'GET') return;

	if (url.pathname.startsWith('/_app/immutable/') || ASSETS.includes(url.pathname)) {
		event.respondWith(cacheFirst(request));
		return;
	}

	if (request.mode === 'navigate') {
		event.respondWith(networkFirst(request));
	}
});

async function cacheFirst(request) {
	const cached = await caches.match(request);
	if (cached) return cached;
	try {
		const response = await fetch(request);
		if (response.ok) {
			const cache = await caches.open(CACHE);
			cache.put(request, response.clone());
		}
		return response;
	} catch {
		return new Response('Offline', { status: 503 });
	}
}

async function networkFirst(request) {
	try {
		const response = await fetch(request);
		if (
			response.ok &&
			response.type === 'basic' &&
			response.headers.get('content-type')?.includes('text/html')
		) {
			const cache = await caches.open(CACHE);
			cache.put(request, response.clone());
		}
		return response;
	} catch {
		const cached = await caches.match(request);
		if (cached) return cached;
		const shell = await caches.match('/');
		if (shell) return shell;
		return new Response(OFFLINE_HTML, {
			status: 200,
			headers: { 'Content-Type': 'text/html; charset=utf-8' }
		});
	}
}
