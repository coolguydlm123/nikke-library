"""
Small top-down thumbnails of the field maps, for the Maps landing page.

    python tools/map-thumbs.py [--size N]

For every <mapsDir>/<field>/<field>.glb (nikke-downloader/maps.py) writes
public/img/maps/<field>.webp: an orthographic view from above, framed on the field's markers,
the way the viewer's "Top" button shows it (x to the right, -z up): base colour texture times
lightmap, the highest surface per pixel. Backdrop nodes are left out. Hard/Story maps reuse the
Normal art, so they use its thumbnail. Needs numpy and Pillow.
"""
import io
import json
import os
import struct
import sys

import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "img", "maps")
CTYPE = {5126: np.float32, 5125: np.uint32, 5123: np.uint16, 5121: np.uint8}
NCOMP = {"SCALAR": 1, "VEC2": 2, "VEC3": 3, "VEC4": 4}


def read_glb(path):
    data = open(path, "rb").read()
    jlen = struct.unpack_from("<I", data, 12)[0]
    j = json.loads(data[20:20 + jlen])
    return j, data[28 + jlen:]


class Glb:
    def __init__(self, path):
        self.j, self.bin = read_glb(path)
        self._img = {}

    def view(self, i):
        v = self.j["bufferViews"][i]
        return self.bin[v.get("byteOffset", 0):v.get("byteOffset", 0) + v["byteLength"]]

    def accessor(self, i):
        a = self.j["accessors"][i]
        arr = np.frombuffer(self.view(a["bufferView"]), dtype=CTYPE[a["componentType"]],
                            count=a["count"] * NCOMP[a["type"]], offset=a.get("byteOffset", 0))
        return arr.reshape(a["count"], NCOMP[a["type"]])

    def texture(self, i):
        """RGB float array (h, w, 3) of texture i, shrunk to at most 128 px (centre samples only)."""
        if i not in self._img:
            img = self.j["images"][self.j["textures"][i]["source"]]
            im = Image.open(io.BytesIO(self.view(img["bufferView"]))).convert("RGB")
            im.thumbnail((128, 128))
            self._img[i] = np.asarray(im, dtype=np.float32) / 255
        return self._img[i]


def sample(tex, uv):
    h, w, _ = tex.shape
    x = (np.mod(uv[:, 0], 1) * (w - 1)).astype(int)
    y = (np.mod(uv[:, 1], 1) * (h - 1)).astype(int)
    return tex[y, x]


def render(glb_path, markers, size):
    """Top-down image: each triangle is splatted as random points (as many as its pixel area
    needs), textures are sampled per point, and the highest point wins each pixel."""
    g = Glb(glb_path)
    rng = np.random.default_rng(0)
    pts = np.array([m["pos"] for m in markers if not m.get("inactive") and m["type"] != "CameraPoint" and any(m["pos"])])
    lo, hi = pts[:, [0, 2]].min(0), pts[:, [0, 2]].max(0)
    span = max(float((hi - lo).max()), 20.0) * 1.15  # square frame with a margin, like the viewer
    centre = (lo + hi) / 2
    lightmaps = g.j["scenes"][0].get("extras", {}).get("lightmaps", [])
    lin = lambda c: c ** 2.2  # noqa: E731  textures are sRGB; light them in linear space
    out_pix, out_y, out_col = [], [], []
    for node in g.j["nodes"]:
        ex = node.get("extras", {})
        if ex.get("backdrop") or "mesh" not in node:
            continue
        m = np.array(node["matrix"]).reshape(4, 4).T
        for prim in g.j["meshes"][node["mesh"]]["primitives"]:
            mat = g.j["materials"][prim["material"]]
            if mat.get("alphaMode") == "BLEND":
                continue
            at = prim["attributes"]
            v = g.accessor(at["POSITION"]).astype(np.float64) @ m[:3, :3].T + m[:3, 3]
            idx = g.accessor(prim["indices"]).reshape(-1, 3).astype(np.int64)
            scr = (v[:, [0, 2]] - centre) / span * size + size / 2  # x right, z down = -z up
            t = scr[idx]
            inside = (t.max((1, 2)) >= 0) & (t.min((1, 2)) < size)
            if not inside.any():
                continue
            idx, t = idx[inside], t[inside]
            area = np.abs((t[:, 1, 0] - t[:, 0, 0]) * (t[:, 2, 1] - t[:, 0, 1]) - (t[:, 2, 0] - t[:, 0, 0]) * (t[:, 1, 1] - t[:, 0, 1])) / 2
            k = np.clip(np.ceil(area * 6), 1, 50000).astype(np.int64)
            tri = np.repeat(np.arange(len(idx)), k)
            a, b = rng.random(len(tri)), rng.random(len(tri))
            flip = a + b > 1
            a[flip], b[flip] = 1 - a[flip], 1 - b[flip]
            w = np.stack([1 - a - b, a, b], 1)  # barycentric weights
            corners = idx[tri]
            lerp = lambda arr: (arr[corners] * w[:, :, None]).sum(1)  # noqa: E731
            xy = lerp(scr)
            pbr = mat.get("pbrMetallicRoughness", {})
            col = np.tile(lin(np.array(pbr.get("baseColorFactor", [1, 1, 1, 1])[:3])), (len(tri), 1))
            if "baseColorTexture" in pbr and "TEXCOORD_0" in at:
                col = col * lin(sample(g.texture(pbr["baseColorTexture"]["index"]), lerp(g.accessor(at["TEXCOORD_0"]))))
            if "lm" in ex and ex["lm"] < len(lightmaps):
                sx, sy, ox, oy = ex["lmST"]
                uvl = lerp(g.accessor(at["TEXCOORD_1" if "TEXCOORD_1" in at else "TEXCOORD_0"]))
                col = col * lin(sample(g.texture(lightmaps[ex["lm"]]), uvl * [sx, sy] + [ox, oy])) * 2.2
            else:
                col = col * 0.9
            ix, iy = xy[:, 0].astype(np.int64), xy[:, 1].astype(np.int64)
            ok = (ix >= 0) & (ix < size) & (iy >= 0) & (iy < size)
            out_pix.append((iy * size + ix)[ok])
            out_y.append(lerp(v[:, 1:2])[ok, 0])
            out_col.append(col[ok])
    pix, y, col = np.concatenate(out_pix), np.concatenate(out_y), np.concatenate(out_col)
    order = np.lexsort((y, pix))  # by pixel, then height: the last of each pixel is the top
    last = np.r_[pix[order][1:] != pix[order][:-1], True]
    top = order[last]
    img = np.zeros((size * size, 3))
    hit = np.zeros(size * size, bool)
    img[pix[top]] = np.clip(col[top], 0, 1) ** (1 / 2.2)
    hit[pix[top]] = True
    img, hit = img.reshape(size, size, 3), hit.reshape(size, size)
    for _ in range(2):  # pixels no point landed on take the average of their hit neighbours
        acc, n = np.zeros_like(img), np.zeros((size, size))
        for dy, dx in ((0, 1), (0, -1), (1, 0), (-1, 0)):
            acc += np.roll(img * hit[..., None], (dy, dx), (0, 1))
            n += np.roll(hit, (dy, dx), (0, 1))
        fill = ~hit & (n >= 2)
        img[fill] = acc[fill] / n[fill, None]
        hit = hit | fill
    img[~hit] = np.array([26, 30, 39]) / 255
    return Image.fromarray((img * 255).astype(np.uint8))


def main():
    size = int(sys.argv[sys.argv.index("--size") + 1]) if "--size" in sys.argv else 256
    with open(os.path.join(ROOT, "config.json"), encoding="utf-8") as f:
        src_root = json.load(f).get("mapsDir")
    os.makedirs(OUT, exist_ok=True)
    made = skipped = 0
    for field in sorted(os.listdir(src_root)):
        glb = os.path.join(src_root, field, field + ".glb")
        mk = os.path.join(src_root, field, "markers.json")
        if not (os.path.exists(glb) and os.path.exists(mk)):
            continue
        dst = os.path.join(OUT, field + ".webp")
        if os.path.exists(dst) and os.path.getmtime(dst) >= max(os.path.getmtime(glb), os.path.getmtime(mk)):
            skipped += 1
            continue
        render(glb, json.load(open(mk, encoding="utf-8")), size).save(dst, "WEBP", quality=80)
        made += 1
        print(f"  {field}: {os.path.getsize(dst) // 1024} KB")
    print(f"{made} thumbnail(s) written, {skipped} up to date -> {OUT}")


if __name__ == "__main__":
    main()
