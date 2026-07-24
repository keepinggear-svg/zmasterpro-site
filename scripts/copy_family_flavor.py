#!/usr/bin/env python3

from pathlib import Path
import base64
import json
import shutil


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "src" / "family-flavor"
DATA = ROOT / "content" / "family-flavor-menu.json"
TARGET = ROOT / "dist" / "family-flavor"
IMAGE_DATA = SOURCE / "image-data"


def build() -> None:
    if TARGET.exists():
        shutil.rmtree(TARGET)
    shutil.copytree(
        SOURCE,
        TARGET,
        ignore=shutil.ignore_patterns("image-data"),
    )
    dishes = TARGET / "dishes"
    dishes.mkdir(parents=True, exist_ok=True)
    manifest = json.loads((IMAGE_DATA / "manifest.json").read_text(encoding="utf-8"))
    for chunk_name in manifest["chunks"]:
        chunk = json.loads((IMAGE_DATA / chunk_name).read_text(encoding="utf-8"))
        for filename, encoded in chunk.items():
            (dishes / filename).write_bytes(base64.b64decode(encoded))
    assets = json.loads((IMAGE_DATA / "assets.json").read_text(encoding="utf-8"))
    for relative_path, encoded in assets.items():
        asset_path = TARGET / relative_path
        asset_path.parent.mkdir(parents=True, exist_ok=True)
        asset_path.write_bytes(base64.b64decode(encoded))
    shutil.copy2(DATA, TARGET / "menu-data.json")
    print(f"Copied FAMILY FLAVOR to {TARGET}")


if __name__ == "__main__":
    build()
