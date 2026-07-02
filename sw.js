const LEGACY_CACHE_PREFIXES = ["judgment-archive", "chongsheng", "thought-archive"];

async function clearLegacyCaches() {
  if (!self.caches) return;
  const keys = await caches.keys();
  await Promise.all(
    keys
      .filter((key) => LEGACY_CACHE_PREFIXES.some((prefix) => key.startsWith(prefix)))
      .map((key) => caches.delete(key))
  );
}

self.addEventListener("install", (event) => {
  event.waitUntil(clearLegacyCaches().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    clearLegacyCaches()
      .then(() => self.registration.unregister())
      .then(() => self.clients.matchAll({ type: "window" }))
      .then((clients) => clients.forEach((client) => client.navigate(client.url)))
      .catch(() => undefined)
  );
});

// Intentionally no fetch handler:
// - HTML pages must never use cache-first.
// - JS/CSS/chunk failures must never fall back to /zh.
