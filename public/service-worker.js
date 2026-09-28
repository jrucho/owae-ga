// Retire the former Console Booth worker without touching other applications' caches.
self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames
        .filter((name) => /^console-booth(?:-|$)/.test(name))
        .map((name) => caches.delete(name)),
    );

    const controlledClients = await self.clients.matchAll({ type: "window" });
    await self.registration.unregister();
    await Promise.all(controlledClients.map((client) => client.navigate(client.url)));
  })());
});
