"""
Web copies of the extracted images for the library.

    python tools/web-images.py

Reads the sprites under config.json's imageDir: one folder per bundle family
(scenariobackground/, icons-event/), sorted into subfolders by name. Writes
public/img/<family>/<lowercased name> flat, so the pages can find an image by the name
the data uses: scene art as JPEG (longest side 1024), everything else (icons,
portraits, transparent UI) as WebP with alpha (longest side 768). Files already up to date are skipped and outputs
whose source is gone are removed. Needs Pillow.
"""
import json
import os

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "img")
JPEG_FAMILIES = {"scenariobackground"}  # opaque scene art
JPEG_SIDE, WEBP_SIDE = 1024, 768


def sources(src_dir):
    """name.png files under src_dir (any depth), as (lowercased stem, path)."""
    for dirpath, _dirs, files in os.walk(src_dir):
        for name in sorted(files):
            if name.lower().endswith(".png"):
                yield os.path.splitext(name)[0].lower(), os.path.join(dirpath, name)


def main():
    with open(os.path.join(ROOT, "config.json"), encoding="utf-8") as f:
        src_root = json.load(f)["imageDir"]
    made = skipped = removed = 0
    for family in sorted(os.listdir(src_root)):
        src_dir = os.path.join(src_root, family)
        if not os.path.isdir(src_dir):
            continue
        out_dir = os.path.join(OUT, family)
        os.makedirs(out_dir, exist_ok=True)
        jpeg = family in JPEG_FAMILIES
        ext = ".jpg" if jpeg else ".webp"
        wanted = set()
        for stem, src in sources(src_dir):
            if stem + ext in wanted:
                print(f"  {family}: {stem} appears twice, keeping the first")
                continue
            wanted.add(stem + ext)
            dst = os.path.join(out_dir, stem + ext)
            if os.path.exists(dst) and os.path.getmtime(dst) >= os.path.getmtime(src):
                skipped += 1
                continue
            im = Image.open(src)
            if jpeg:
                im = im.convert("RGB")
                im.thumbnail((JPEG_SIDE, JPEG_SIDE), Image.LANCZOS)
                im.save(dst, "JPEG", quality=80, optimize=True)
            else:
                im.thumbnail((WEBP_SIDE, WEBP_SIDE), Image.LANCZOS)
                im.save(dst, "WEBP", quality=85, method=4)
            made += 1
        for name in os.listdir(out_dir):
            if name.lower() not in wanted:  # Windows names are case-insensitive
                os.remove(os.path.join(out_dir, name))
                removed += 1
    print(f"{made} image(s) written, {skipped} up to date, {removed} removed -> {OUT}")


if __name__ == "__main__":
    main()
