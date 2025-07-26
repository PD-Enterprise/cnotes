/// <reference types="@sveltejs/kit" />
/// <reference lib="webworker" />

declare let self: ServiceWorkerGlobalScope;

import { build, files, version } from "$service-worker";

// console.log({ build, files, version });

const CACHE = `cache-${version}`;
const ASSETS = [...build, ...files];

// Install
self.addEventListener("install", event => {
    async function addFilesToCache() {
        const cache = await caches.open(CACHE)
        await cache.addAll(ASSETS)
    }

    event.waitUntil(addFilesToCache())
});

// Activate
self.addEventListener("activate", event => {
    async function deleteOldCaches() {
        for (const key of await caches.keys()) {
            if (key !== CACHE) {
                await caches.delete(key)
            }
        }
    }

    event.waitUntil(deleteOldCaches())
})

// Listen
self.addEventListener("fetch", event => {
    if (event.request.method !== "GET" && event.request.method !== "POST") return;

    const url = new URL(event.request.url);

    // Check if this is a notes API request
    if (url.pathname.endsWith("/notes/notes")) {
        event.respondWith(
            (async () => {
                const cache = await caches.open(CACHE);
                try {
                    const response = await fetch(event.request.clone());
                    if (response.status === 200) {
                        cache.put(event.request, response.clone());
                    }
                    return response;
                } catch {
                    // If offline, try to serve from cache
                    const cachedResponse = await cache.match(event.request);
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    return new Response("Not Found", { status: 404 });
                }
            })()
        );
        return;
    }

    // Handle navigation requests (HTML pages)
    if (event.request.mode === "navigate") {
        event.respondWith(
            (async () => {
                const cache = await caches.open(CACHE);
                try {
                    // Try network first
                    const response = await fetch(event.request);
                    if (response.status === 200) {
                        cache.put(event.request, response.clone());
                    }
                    return response;
                } catch {
                    // If offline, serve cached /home as fallback shell
                    const cachedShell = await cache.match("/home");
                    if (cachedShell) {
                        return cachedShell;
                    }
                    // Or fallback to index.html or root
                    const cachedRoot = await cache.match("/");
                    if (cachedRoot) {
                        return cachedRoot;
                    }
                    return new Response("Offline", { status: 503 });
                }
            })()
        );
        return;
    }

    async function respond() {
        const cache = await caches.open(CACHE)

        // serve build files from the cache
        if (ASSETS.includes(url.pathname)) {
            const cachedResponse = await cache.match(url.pathname)
            if (cachedResponse) {
                return cachedResponse
            }
        }

        return new Response("Not Found", { status: 404 })
    }

    event.respondWith(respond())
})