"""
Web copies of the exported field maps for the library's map viewer.

    python tools/web-maps.py [--side N] [--force] [--no-compress] [--alpha]

Also copies each <field>/walkable.json to public/img/maps/<field>.walk.json for the flat map view.
Each copy is then meshopt-compressed with gltfpack (npx gltfpack@1.3.0; --no-compress skips it; skipped
with a warning if npx is missing): about 40-80% smaller, and public/maps.js loads it with three.js's
MeshoptDecoder. The flags keep what the viewer needs: -kn -ke -km (nodes, extras = lightmap data, materials),
-kv (the second UV set, which glTF materials never reference, is the lightmap UV), -vpf -vtf (float positions
and UVs: they compress almost as well as quantised ones and avoid precision loss). Textures are not touched.
Materials the export left opaque although their texture is mostly transparent are made MASK / BLEND
(alpha_fix; --alpha rebuilds only the models that needs, e.g. after changing the rule).
Reads <mapsDir>/<field>/<field>.glb (config.json's mapsDir, written by nikke-downloader/maps.py)
and writes public/img/maps/<field>.glb with every texture shrunk to N px on the longest side
(default 512; 256 for event maps, which are bigger and would not fit the site otherwise): JPEG, or PNG for textures with alpha. Geometry is copied as-is. Files already up
to date are skipped and copies whose source is gone are removed. Needs Pillow.
"""
import io
import json
import os
import shutil
import struct
import subprocess
import sys

import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "img", "maps")


def read_glb(path):
    data = open(path, "rb").read()
    jlen = struct.unpack_from("<I", data, 12)[0]
    j = json.loads(data[20:20 + jlen])
    blen = struct.unpack_from("<I", data, 20 + jlen)[0]
    return j, data[28 + jlen:28 + jlen + blen]


def alpha_fix(j, bin_, apply=True):
    """Make materials transparent when their texture is. The export marks a material transparent only
    from its shader settings, and misses some (glow quads, cloud sprites, grass cards), which then show
    black where the texture is clear. A base-colour PNG (the export only keeps PNG for textures with real
    transparency) with >= 15% clear pixels gets alphaMode MASK (hard edges, like grass) or BLEND (soft
    edges, like glows). Returns how many materials it changed (or would change when apply is False)."""
    changed = 0
    cache = {}
    for m in j["materials"]:
        t = m["pbrMetallicRoughness"].get("baseColorTexture")
        if m.get("alphaMode", "OPAQUE") != "OPAQUE" or not t:
            continue
        src = j["textures"][t["index"]]["source"]
        img = j["images"][src]
        if img["mimeType"] != "image/png":
            continue
        if src not in cache:
            v = j["bufferViews"][img["bufferView"]]
            a = np.asarray(Image.open(io.BytesIO(bin_[v.get("byteOffset", 0):v.get("byteOffset", 0) + v["byteLength"]])).convert("RGBA").getchannel("A"))
            cache[src] = (float((a < 128).mean()), float(((a > 20) & (a < 235)).mean()))
        clear, soft = cache[src]
        if clear < 0.15:
            continue
        changed += 1
        if apply:
            m["alphaMode"] = "MASK" if soft < 0.15 else "BLEND"
            if m["alphaMode"] == "MASK":
                m["alphaCutoff"] = 0.5
            m["doubleSided"] = True  # cards and quads are seen from either side
    return changed


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
    alpha_fix(j, bin_)
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


GLTFPACK = ["gltfpack@1.3.0", "-cc", "-kn", "-ke", "-km", "-kv", "-vpf", "-vtf"]


def compress(path):
    """Meshopt-compress a GLB in place with gltfpack; False (file untouched) if that is not possible."""
    npx = shutil.which("npx")
    if not npx:
        return False
    tmp = path + ".tmp.glb"
    run = subprocess.run([npx, "--yes", GLTFPACK[0], "-i", path, "-o", tmp] + GLTFPACK[1:], capture_output=True, text=True)
    if run.returncode or not os.path.exists(tmp):
        print(f"  gltfpack failed for {os.path.basename(path)}: {run.stderr.strip()[-200:]}")
        return False
    os.replace(tmp, path)
    return True


def main():
    force = "--force" in sys.argv  # rebuild copies that are newer than their source too
    only_alpha = "--alpha" in sys.argv  # only the models alpha_fix() changes: rebuild just those
    side = int(sys.argv[sys.argv.index("--side") + 1]) if "--side" in sys.argv else None  # None: 512 px, event maps 256 px
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
        if only_alpha:
            j0, b0 = read_glb(src)
            if not alpha_fix(j0, b0, apply=False):
                continue
        elif not force and os.path.exists(dst) and os.path.getmtime(dst) >= os.path.getmtime(src):
            skipped += 1
            continue
        repack(src, dst, side or (256 if field.startswith("febg_") else 512))
        packed = compress(dst) if "--no-compress" not in sys.argv else False
        print(f"  {field}: {os.path.getsize(src) / 2**20:.1f} MB -> {os.path.getsize(dst) / 2**20:.1f} MB{'' if packed else ' (not compressed)'}")
        made += 1
    for field in sorted(os.listdir(src_root)):  # walkable area (the navmesh), as is: ~15 KB each
        src = os.path.join(src_root, field, "walkable.json")
        if os.path.exists(src):
            wanted.add(field + ".walk.json")
            dst = os.path.join(OUT, field + ".walk.json")
            if not os.path.exists(dst) or os.path.getmtime(dst) < os.path.getmtime(src):
                shutil.copyfile(src, dst)
    for name in os.listdir(OUT):
        if name.endswith((".glb", ".walk.json")) and name not in wanted:  # leave the thumbnails (tools/map-thumbs.py)
            os.remove(os.path.join(OUT, name))
            removed += 1
    print(f"{made} map(s) written, {skipped} up to date, {removed} removed -> {OUT}")


if __name__ == "__main__":
    main()
