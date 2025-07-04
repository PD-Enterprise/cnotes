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
    if (event.request.method !== "GET") return;

    async function respond() {
        const url = new URL(event.request.url)
        const cache = await caches.open(CACHE)

        // serve build files from the cache
        if (ASSETS.includes(url.pathname)) {
            const cachedResponse = await cache.match(url.pathname)
            if (cachedResponse) {
                return cachedResponse
            }
        }

        try {
            const response = await fetch(event.request)

            const isNotExtention = url.protocol == "http:"
            const ifSuccess = response.status == 200

            if (isNotExtention && ifSuccess) {
                cache.put(event.request, response.clone())
            }

            return response
        } catch {
            const cachedResponse = await cache.match(url.pathname)
            if (cachedResponse) {
                return cachedResponse
            }
        }

        return new Response("Not Found", { status: 404 })
    }

    event.respondWith(respond())
})