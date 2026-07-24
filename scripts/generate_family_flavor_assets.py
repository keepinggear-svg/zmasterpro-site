#!/usr/bin/env python3

from pathlib import Path
import base64
import json
from PIL import Image, ImageDraw, ImageFont, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
APP = ROOT / "src" / "family-flavor"
ICONS = APP / "icons"
HERO = APP / "dishes" / "078.jpg"
IMAGE_DATA = APP / "image-data"

GREEN = "#153a32"
GREEN_DEEP = "#0d2b25"
GOLD = "#d6ac5a"
CREAM = "#fbf5e9"
RED = "#ad3d32"

FONT_CN = Path("/System/Library/Fonts/PingFang.ttc")
FONT_SONG = Path("/System/Library/Fonts/Supplemental/Songti.ttc")


def font(path: Path, size: int, index: int = 0) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(path), size=size, index=index)


def rounded_square(draw: ImageDraw.ImageDraw, box, radius, fill):
    draw.rounded_rectangle(box, radius=radius, fill=fill)


def make_icon(size: int, maskable: bool = False) -> Image.Image:
    image = Image.new("RGB", (size, size), GREEN)
    draw = ImageDraw.Draw(image)
    pad = int(size * (.12 if maskable else .065))
    rounded_square(draw, (pad, pad, size - pad, size - pad), int(size * .22), GREEN_DEEP)
    cx, cy = size // 2, int(size * .47)
    plate_r = int(size * .26)
    draw.ellipse((cx - plate_r, cy - plate_r, cx + plate_r, cy + plate_r), fill=GOLD)
    inner = int(plate_r * .68)
    draw.ellipse((cx - inner, cy - inner, cx + inner, cy + inner), fill=CREAM)
    bowl_y = int(size * .5)
    bowl_w = int(size * .36)
    bowl_h = int(size * .15)
    draw.pieslice(
        (cx - bowl_w // 2, bowl_y - bowl_h, cx + bowl_w // 2, bowl_y + bowl_h),
        start=0,
        end=180,
        fill=RED,
    )
    draw.rounded_rectangle(
        (cx - int(size * .17), bowl_y - int(size * .025), cx + int(size * .17), bowl_y + int(size * .012)),
        radius=int(size * .01),
        fill=RED,
    )
    chop_w = max(3, int(size * .012))
    draw.line(
        (cx - int(size * .18), cy - int(size * .2), cx + int(size * .12), cy + int(size * .05)),
        fill=GREEN_DEEP,
        width=chop_w,
    )
    draw.line(
        (cx - int(size * .12), cy - int(size * .23), cx + int(size * .17), cy + int(size * .02)),
        fill=GREEN_DEEP,
        width=chop_w,
    )
    return image


def cover_crop(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    target_w, target_h = size
    ratio = max(target_w / image.width, target_h / image.height)
    scaled = image.resize((round(image.width * ratio), round(image.height * ratio)), Image.Resampling.LANCZOS)
    left = (scaled.width - target_w) // 2
    top = (scaled.height - target_h) // 2
    return scaled.crop((left, top, left + target_w, top + target_h))


def make_social_card() -> Image.Image:
    width, height = 1200, 630
    if HERO.exists():
        source = Image.open(HERO).convert("RGB")
    else:
        manifest = json.loads((IMAGE_DATA / "manifest.json").read_text(encoding="utf-8"))
        encoded = None
        for chunk_name in manifest["chunks"]:
            chunk = json.loads((IMAGE_DATA / chunk_name).read_text(encoding="utf-8"))
            if "078.jpg" in chunk:
                encoded = chunk["078.jpg"]
                break
        if encoded is None:
            raise FileNotFoundError("078.jpg is missing from packed image data")
        from io import BytesIO
        source = Image.open(BytesIO(base64.b64decode(encoded))).convert("RGB")
    image = cover_crop(source, (width, height)).filter(ImageFilter.GaussianBlur(radius=.25))
    overlay = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    for x in range(width):
        opacity = int(230 * (1 - min(1, x / 900)) + 28)
        draw.line((x, 0, x, height), fill=(7, 30, 25, min(235, opacity)))
    draw.rectangle((0, height - 130, width, height), fill=(7, 30, 25, 96))
    image = Image.alpha_composite(image.convert("RGBA"), overlay)
    draw = ImageDraw.Draw(image)
    rounded_square(draw, (70, 58, 128, 116), 14, RED)
    draw.text((99, 87), "家", font=font(FONT_SONG, 33), fill=CREAM, anchor="mm")
    draw.text((148, 69), "FAMILY FLAVOR", font=font(FONT_CN, 27), fill=GOLD)
    draw.text((148, 101), "家味点菜 · BY ZMASTER", font=font(FONT_CN, 16), fill=(255, 255, 255, 205))
    draw.text((70, 210), "今天吃什么，", font=font(FONT_SONG, 66), fill=CREAM)
    draw.text((70, 288), "让家人自己选。", font=font(FONT_SONG, 72), fill=GOLD)
    draw.text((74, 397), "孩子看图点菜 · 家长完成搭配 · 菜单实时同步", font=font(FONT_CN, 24), fill=(255, 255, 255, 205))
    draw.rounded_rectangle((70, 487, 274, 545), radius=29, fill=GOLD)
    draw.text((172, 516), "今晚点 · 明天做", font=font(FONT_CN, 18), fill=GREEN_DEEP, anchor="mm")
    return image.convert("RGB")


def build() -> None:
    ICONS.mkdir(parents=True, exist_ok=True)
    make_icon(192).save(ICONS / "icon-192.png", optimize=True)
    make_icon(512).save(ICONS / "icon-512.png", optimize=True)
    make_icon(512, maskable=True).save(ICONS / "maskable-512.png", optimize=True)
    make_icon(180).save(ICONS / "apple-touch-icon.png", optimize=True)
    make_social_card().save(APP / "og-family-flavor.jpg", quality=90, optimize=True)
    print(f"Generated FAMILY FLAVOR icons and social card in {APP}")


if __name__ == "__main__":
    build()
