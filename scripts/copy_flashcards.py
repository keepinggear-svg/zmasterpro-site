#!/usr/bin/env python3
from pathlib import Path
import shutil


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "src" / "word-flashcards"
DIST = ROOT / "dist"
TARGET = DIST / "word-flashcards"
ROOT_ICON_DIR = DIST / "icons"
PACKED = SOURCE / ".packed"

ROOT_MANIFEST = """{
  "id": "/word-flashcards/",
  "name": "单词 Flashcards",
  "short_name": "单词卡片",
  "description": "可翻转、默写、收藏和离线使用的单词记忆卡片。",
  "start_url": "/word-flashcards/index.html",
  "scope": "/word-flashcards/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#f5f7f8",
  "theme_color": "#0d6b68",
  "categories": ["education", "productivity"],
  "lang": "zh-CN",
  "icons": [
    {
      "src": "/word-flashcards/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/word-flashcards/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/word-flashcards/icons/maskable-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
}
"""

ROOT_SW = """const CACHE_NAME = "word-flashcards-pwa-root-v2";
const APP_SHELL = [
  "/word-flashcards/index.html",
  "/word-flashcards/manifest.webmanifest",
  "/word-flashcards/icons/icon-192.png",
  "/word-flashcards/icons/icon-512.png",
  "/word-flashcards/icons/maskable-512.png",
  "/word-flashcards/icons/apple-touch-icon.png"
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
          .filter((key) => key.startsWith("word-flashcards-pwa") && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith("/word-flashcards")) {
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put("/word-flashcards/index.html", copy));
          return response;
        })
        .catch(() => caches.match("/word-flashcards/index.html"))
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
"""

if SOURCE.exists():
    if TARGET.exists():
        shutil.rmtree(TARGET)
    shutil.copytree(SOURCE, TARGET)

    if PACKED.exists():
        for packed_dir in sorted(path for path in PACKED.rglob("*") if path.is_dir()):
            parts = sorted(packed_dir.glob("*.part"))
            if not parts:
                continue
            output = TARGET / packed_dir.relative_to(PACKED)
            output.parent.mkdir(parents=True, exist_ok=True)
            with output.open("wb") as destination:
                for part in parts:
                    with part.open("rb") as source:
                        shutil.copyfileobj(source, destination)
        shutil.rmtree(TARGET / ".packed")

    (DIST / "manifest.webmanifest").write_text(ROOT_MANIFEST, encoding="utf-8")
    (DIST / "sw.js").write_text(ROOT_SW, encoding="utf-8")

    if ROOT_ICON_DIR.exists():
        shutil.rmtree(ROOT_ICON_DIR)
    shutil.copytree(SOURCE / "icons", ROOT_ICON_DIR)
