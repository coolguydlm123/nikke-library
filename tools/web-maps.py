"""
Web copies of the exported field maps for the library's map viewer.

    python tools/web-maps.py [--side N]

Reads <mapsDir>/<field>/<field>.glb (config.json's mapsDir, written by nikke-downloader/maps.py)
and writes public/img/maps/<field>.glb with every texture shrunk to N px on the longest side
(default 512): JPEG, or PNG for textures with alpha. Geometry is copied as-is. Files already up
to date are skipped and copies whose source is gone are removed. Needs Pillow.
"""
import io
import json
import os
import struct
import sys

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "img", "maps")


def read_glb(path):
    data = open(path, "rb").read()
    jlen = struct.unpack_from("<I", data, 12)[0]
    j = json.loads(data[20:20 + jlen])
    blen = struct.unpack_from("<I", data, 20 + jlen)[0]
    return j, data[28 + jlen:28 + jlen + blen]


def shrink(blob, mime, side):
    im = Image.open(io.BytesIO(blob))
    if max(im.size) <= side:
        return blob, mime
    im.thumbnail((side, side), Image.LANCZOS)
    buf = io.BytesIO()
    if mime == "image/png":
        im.save(buf, "PNG", optimize=True)
    else:
        im.convert("RGB").save(buf, "JPEG", quality=80, optimize=True)
    return buf.getvalue(), mime


def repack(src, dst, side):
    j, bin_ = read_glb(src)
    image_views = {img["bufferView"]: img for img in j.get("images", [])}
    out = bytearray()
    for i, v in enumerate(j["bufferViews"]):
        chunk = bin_[v.get("byteOffset", 0):v.get("byteOffset", 0) + v["byteLength"]]
        if i in image_views:
            chunk, image_views[i]["mimeType"] = shrink(chunk, image_views[i]["mimeType"], side)
        out += b"\0" * (-len(out) % 4)
        v["byteOffset"], v["byteLength"] = len(out), len(chunk)
        out += chunk
    out += b"\0" * (-len(out) % 4)
    j["buffers"] = [{"byteLength": len(out)}]
    js = json.dumps(j, separators=(",", ":")).encode()
    js += b" " * (-len(js) % 4)
    with open(dst, "wb") as f:
        f.write(struct.pack("<III", 0x46546C67, 2, 28 + len(js) + len(out)))
        f.write(struct.pack("<II", len(js), 0x4E4F534A) + js)
        f.write(struct.pack("<II", len(out), 0x004E4942) + bytes(out))


def main():
    side = int(sys.argv[sys.argv.index("--side") + 1]) if "--side" in sys.argv else 512
    with open(os.path.join(ROOT, "config.json"), encoding="utf-8") as f:
        src_root = json.load(f).get("mapsDir")
    if not src_root or not os.path.isdir(src_root):
        raise SystemExit("config.json has no mapsDir")
    os.makedirs(OUT, exist_ok=True)
    made = skipped = removed = 0
    wanted = set()
    for field in sorted(os.listdir(src_root)):
        src = os.path.join(src_root, field, field + ".glb")
        if not os.path.exists(src):
            continue
        wanted.add(field + ".glb")
        dst = os.path.join(OUT, field + ".glb")
        if os.path.exists(dst) and os.path.getmtime(dst) >= os.path.getmtime(src):
            skipped += 1
            continue
        repack(src, dst, side)
        print(f"  {field}: {os.path.getsize(src) / 2**20:.1f} MB -> {os.path.getsize(dst) / 2**20:.1f} MB")
        made += 1
    for name in os.listdir(OUT):
        if name not in wanted:
            os.remove(os.path.join(OUT, name))
            removed += 1
    print(f"{made} map(s) written, {skipped} up to date, {removed} removed -> {OUT}")


if __name__ == "__main__":
    main()
