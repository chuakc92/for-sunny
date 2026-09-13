/* Self-destroying service worker.
   The browser automatically re-fetches this file (byte-compares it) while any
   SW is registered at this scope. When it sees this version, it installs, then
   deletes every cache, unregisters itself, and force-reloads all open pages so
   the live (uncached) site loads. No manual clearing needed. */
self.addEventListener('install', function () {
    self.skipWaiting();
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys()
            .then(function (keys) {
                return Promise.all(keys.map(function (k) { return caches.delete(k); }));
            })
            .then(function () { return self.registration.unregister(); })
            .then(function () { return self.clients.matchAll(); })
            .then(function (clients) {
                clients.forEach(function (client) {
                    // Force every controlled tab to reload from the network.
                    client.navigate(client.url);
                });
            })
    );
});

// Never serve from cache , always hit the network.
self.addEventListener('fetch', function (event) {
    event.respondWith(fetch(event.request));
});
