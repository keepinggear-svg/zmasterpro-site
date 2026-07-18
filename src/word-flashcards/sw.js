const CACHE_NAME = "word-flashcards-pwa-v24";
const APP_SHELL = [
  "./",
  "./index.html",
  "./kid-game.css?v=24",
  "./word-packs.css?v=24",
  "./word-packs.js?v=24",
  "./kid-game.js?v=24",
  "./pwa-install.js?v=24",
  "./manifest.webmanifest",
  "./assets/travel-map-china-v1.png",
  "./assets/tent-interior-v1.png",
  "./assets/pets-v2/rabbit.png",
  "./assets/pets-v2/dino.png",
  "./assets/pets-v2/kitten.png",
  "./assets/pets-v2/capybara.png",
  "./assets/pets-v2/sadcat.png",
  "./assets/pets-v2/puppy.png",
  "./assets/pets-v2/hamster.png",
  "./assets/pets-v2/parrot.png",
  "./assets/pets-v2/snake.png",
  "./assets/pets-v2/redpanda.png",
  "./assets/pets-v2/penguin.png",
  "./assets/pets-v2/panda.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/maskable-512.png",
  "./icons/apple-touch-icon.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put("./index.html", copy));
          return response;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200) {
          return response;
        }

        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      });
    })
  );
});
