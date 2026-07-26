const CACHE_NAME = "family-flavor-v3";
const APP_ROOT = "/family-flavor";
const MENU_DATA = `${APP_ROOT}/menu-data.json`;
const SHELL = [
  APP_ROOT,
  `${APP_ROOT}/styles.css?v=3`,
  `${APP_ROOT}/app.js?v=3`,
  `${APP_ROOT}/manifest.webmanifest`,
  `${APP_ROOT}/icons/icon-192.png`,
  `${APP_ROOT}/icons/icon-512.png`,
  `${APP_ROOT}/icons/maskable-512.png`,
  `${APP_ROOT}/icons/apple-touch-icon.png`,
  `${APP_ROOT}/dishes/153.jpg`,
  `${APP_ROOT}/dishes/154.jpg`,
  `${APP_ROOT}/dishes/155.jpg`,
  `${APP_ROOT}/dishes/160.jpg`,
  `${APP_ROOT}/dishes/163.jpg`
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key.startsWith("family-flavor-") && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (
    url.origin !== self.location.origin ||
    (url.pathname !== APP_ROOT && !url.pathname.startsWith(`${APP_ROOT}/`))
  ) return;

  if (url.pathname.endsWith("/menu-data.json")) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(MENU_DATA, copy));
          }
          return response;
        })
        .catch(() => caches.match(MENU_DATA))
    );
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(APP_ROOT, copy));
          return response;
        })
        .catch(() => caches.match(APP_ROOT))
    );
    return;
  }

  if (url.pathname.includes("/dishes/")) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        const network = fetch(event.request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        });
        return cached || network;
      })
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
