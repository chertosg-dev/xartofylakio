const CACHE_NAME = "xartofylakio-v11-open-fix";
const APP_ASSETS = [
  "./index.html?v=11",
  "./manifest.webmanifest?v=11",
  "./apple-touch-icon.png?v=11",
  "./icon-192.png?v=11",
  "./icon-512.png?v=11"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request, { cache: "no-store" })
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(
            cache => cache.put("./index.html?v=11", copy)
          );
          return response;
        })
        .catch(() => caches.match("./index.html?v=11"))
    );
    return;
  }

  event.respondWith(
    fetch(event.request, { cache: "no-cache" })
      .then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(
          cache => cache.put(event.request, copy)
        );
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
