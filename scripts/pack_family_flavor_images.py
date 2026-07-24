#!/usr/bin/env python3

import base64
import json
from pathlib import Path
import shutil


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "src" / "family-flavor" / "dishes"
APP = ROOT / "src" / "family-flavor"
TARGET = ROOT / "src" / "family-flavor" / "image-data"
MAX_CHARS = 720_000


def build() -> None:
    if not SOURCE.exists():
        raise SystemExit(f"Missing source images: {SOURCE}")
    if TARGET.exists():
        shutil.rmtree(TARGET)
    TARGET.mkdir(parents=True)

    chunks: list[dict[str, str]] = []
    current: dict[str, str] = {}
    current_size = 0

    for image_path in sorted(SOURCE.glob("*.jpg")):
        encoded = base64.b64encode(image_path.read_bytes()).decode("ascii")
        if current and current_size + len(encoded) > MAX_CHARS:
            chunks.append(current)
            current = {}
            current_size = 0
        current[image_path.name] = encoded
        current_size += len(encoded)

    if current:
        chunks.append(current)

    manifest = []
    for index, chunk in enumerate(chunks, start=1):
        filename = f"chunk-{index:02d}.json"
        (TARGET / filename).write_text(
            json.dumps(chunk, separators=(",", ":")),
            encoding="utf-8",
        )
        manifest.append(filename)

    (TARGET / "manifest.json").write_text(
        json.dumps({"chunks": manifest}, separators=(",", ":")),
        encoding="utf-8",
    )
    assets = {}
    for relative in [
        "icons/apple-touch-icon.png",
        "icons/icon-192.png",
        "icons/icon-512.png",
        "icons/maskable-512.png",
        "og-family-flavor.jpg",
    ]:
        asset_path = APP / relative
        if asset_path.exists():
            assets[relative] = base64.b64encode(asset_path.read_bytes()).decode("ascii")
    (TARGET / "assets.json").write_text(
        json.dumps(assets, separators=(",", ":")),
        encoding="utf-8",
    )
    print(f"Packed {sum(len(chunk) for chunk in chunks)} images into {len(chunks)} text chunks")


if __name__ == "__main__":
    build()
