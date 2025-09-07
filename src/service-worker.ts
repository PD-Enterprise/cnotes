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