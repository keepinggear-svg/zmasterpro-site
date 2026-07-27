#!/usr/bin/env python3
from pathlib import Path
import shutil


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "src" / "shifu"
TARGET = ROOT / "dist" / "shifu"


if not SOURCE.exists():
    raise SystemExit(f"Missing source directory: {SOURCE}")

if TARGET.exists():
    shutil.rmtree(TARGET)

shutil.copytree(SOURCE, TARGET)
print(f"Copied shifu experience to {TARGET}")
