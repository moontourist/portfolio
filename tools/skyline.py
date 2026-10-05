"""Usage: python3 tools/skyline.py [peak name] -> prints the grids and writes tools/grids.json;
copy a grid into src/peaks.ts. Peaks, view direction and snowlines are set in tools/peaks.json.

Build ASCII mountain skylines from real elevation data (AWS Terrain Tiles, terrarium encoding).

For each peak: sample terrain in a box around the summit, and for every column across the view take the
highest point along the line of sight (an orthographic view from far away). Rasterise that skyline into a
text grid: '*' snow above the peak's snowline, '#' rock below.
"""
import math, os, struct, sys, urllib.request, zlib, json

HERE = os.path.dirname(__file__)
Z = 12
TILE = 256


def png_rgb(path):
    data = open(path, 'rb').read()
    assert data[:8] == b'\x89PNG\r\n\x1a\n'
    pos, idat, w, h = 8, b'', 0, 0
    while pos < len(data):
        length, kind = struct.unpack('>I4s', data[pos:pos + 8])
        chunk = data[pos + 8:pos + 8 + length]
        if kind == b'IHDR':
            w, h, depth, ctype = struct.unpack('>IIBB', chunk[:10])
            assert depth == 8 and ctype == 2, 'expected 8-bit RGB'
        elif kind == b'IDAT':
            idat += chunk
        pos += 12 + length
    raw, bpp, stride = zlib.decompress(idat), 3, w * 3
    rows, prev, i = [], bytearray(stride), 0
    for _ in range(h):
        f, line = raw[i], bytearray(raw[i + 1:i + 1 + stride]); i += 1 + stride
        for x in range(stride):
            a = line[x - bpp] if x >= bpp else 0
            b, c = prev[x], (prev[x - bpp] if x >= bpp else 0)
            if f == 1: line[x] = (line[x] + a) & 255
            elif f == 2: line[x] = (line[x] + b) & 255
            elif f == 3: line[x] = (line[x] + (a + b) // 2) & 255
            elif f == 4:
                p = a + b - c; pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
                line[x] = (line[x] + (a if pa <= pb and pa <= pc else b if pb <= pc else c)) & 255
        rows.append(line); prev = line
    return w, h, rows


_tiles = {}
def tile(x, y):
    if (x, y) not in _tiles:
        path = os.path.join(HERE, f'{Z}_{x}_{y}.png')
        if not os.path.exists(path):
            urllib.request.urlretrieve(f'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{Z}/{x}/{y}.png', path)
        _tiles[(x, y)] = png_rgb(path)[2]
    return _tiles[(x, y)]


def elevation(lat, lon):
    n = 2 ** Z
    fx = (lon + 180) / 360 * n
    fy = (1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n
    tx, ty = int(fx), int(fy)
    px, py = int((fx - tx) * TILE), int((fy - ty) * TILE)
    r, g, b = tile(tx, ty)[py][px * 3:px * 3 + 3]
    return r * 256 + g + b / 256 - 32768


def skyline(lat, lon_west, look, width_km, depth_km, cols):
    """Highest terrain along each line of sight. look='north' (viewer south of the peak) or 'south'."""
    lon = -lon_west
    km_lat, km_lon = 1 / 111.32, 1 / (111.32 * math.cos(math.radians(lat)))
    prof = []
    for c in range(cols):
        across = (c / (cols - 1) - 0.5) * width_km  # km to the viewer's right
        east = across if look == 'north' else -across
        best = -1e9
        for d in range(90):
            north = (d / 89 - 0.5) * depth_km
            best = max(best, elevation(lat + north * km_lat, lon + east * km_lon))
        prof.append(best)
    return prof


def rasterise(prof, rows, snowline, taper=0.12):
    cols = len(prof)
    base = min(prof)
    top = max(prof)
    # Ease the far edges down to the base so the skyline doesn't end in a cliff
    eased = []
    for c, e in enumerate(prof):
        t = min(c, cols - 1 - c) / (cols * taper)
        k = 1 if t >= 1 else t * t * (3 - 2 * t)
        eased.append(base + (e - base) * k)
    grid = []
    for r in range(rows):
        level = top - (r + 0.5) * (top - base) / rows  # elevation at the middle of this row
        line = ''.join(('*' if level >= snowline else '#') if e >= level else '.' for e in eased)
        grid.append(line.rstrip('.'))
    grid[-1] = '#' * cols  # solid ground row so the mountain always sits on the strip
    return grid


def render(lat, lon_west, look, width_km, depth_km, cols, rows, snowline, steep=40, samples=140):
    """Orthographic view of the terrain face: for each column, walk from the viewer into the terrain and
    record which ground is visible at each height. Visible ground above the snowline is snow ('*') unless
    it's steeper than `steep` degrees (snow slides off rock faces); everything else is rock/forest ('#')."""
    lon = -lon_west
    km_lat, km_lon = 1 / 111.32, 1 / (111.32 * math.cos(math.radians(lat)))
    step = 0.15  # km between points used for slope (wider = smoother, the raw data is noisy)
    columns = []
    for c in range(cols):
        across = (c / (cols - 1) - 0.5) * width_km
        east = across if look == 'north' else -across
        hits = []  # (elevation, is_snow) for each newly visible band, near to far
        highest = -1e9
        for d in range(samples):
            frac = d / (samples - 1) - 0.5
            north = frac * depth_km if look == 'north' else -frac * depth_km  # near side first
            la, lo = lat + north * km_lat, lon + east * km_lon
            e = elevation(la, lo)
            if e <= highest:
                continue
            dx = (elevation(la, lo + step * km_lon) - elevation(la, lo - step * km_lon)) / (2 * step * 1000)
            dy = (elevation(la + step * km_lat, lo) - elevation(la - step * km_lat, lo)) / (2 * step * 1000)
            slope = math.degrees(math.atan(math.hypot(dx, dy)))
            # Real snowlines are ragged: let it wander ~±150 m across the mountain (deterministic, so it's stable)
            ragged = snowline + 110 * math.sin(c * 0.53) + 60 * math.sin(c * 1.37 + 1) + 40 * math.sin(d * 0.9)
            hits.append((highest, e, e >= ragged and slope < steep))
            highest = e
        columns.append((highest, hits))
    skyline = [h for h, _ in columns]
    top = max(skyline)
    base = sorted(skyline)[len(skyline) // 6]  # crop the low foreground so the peak fills the frame
    # Ease the far edges down to the base so the skyline doesn't end in a cliff
    taper = cols * 0.12
    for c in range(cols):
        t = min(c, cols - 1 - c) / taper
        if t < 1:
            k = t * t * (3 - 2 * t)
            columns[c] = (base + (columns[c][0] - base) * k, columns[c][1])
    grid = []
    for r in range(rows):
        level = top - (r + 0.5) * (top - base) / rows
        line = []
        for highest, hits in columns:
            ch = '.'
            if level <= highest:
                ch = '#'
                for lo_e, hi_e, snow in hits:
                    if lo_e < level <= hi_e:
                        ch = '*' if snow else '#'
                        break
            line.append(ch)
        grid.append(''.join(line).rstrip('.'))
    # Clean-up: a cell takes the majority of its filled neighbours, so the noisy data doesn't speckle
    for _ in range(2):
        padded = [g.ljust(cols, '.') for g in grid]
        nxt = []
        for r in range(rows):
            line = []
            for c in range(cols):
                ch = padded[r][c]
                if ch != '.':
                    near = [padded[rr][cc] for rr in range(max(0, r - 1), min(rows, r + 2))
                            for cc in range(max(0, c - 1), min(cols, c + 2)) if padded[rr][cc] != '.']
                    snow = near.count('*')
                    ch = '*' if snow * 2 > len(near) else '#' if snow * 2 < len(near) else ch
                line.append(ch)
            nxt.append(''.join(line).rstrip('.'))
        grid = nxt
    grid[-1] = '#' * cols  # solid ground row so the mountain always sits on the strip
    return grid


if __name__ == '__main__':
    if sys.argv[1:] == ['check']:
        print('Rainier summit', round(elevation(46.8529, -121.7604)), 'm (expect ~4392)')
        sys.exit()
    peaks = json.load(open(os.path.join(HERE, 'peaks.json')))
    only = sys.argv[1] if len(sys.argv) > 1 else None
    out = {}
    for p in peaks:
        if only and only not in p['name']:
            continue
        out[p['name']] = render(p['lat'], p['lon'], p['look'], p['width'], p['depth'], p['cols'], p['rows'], p['snowline'])
        print(p['name'], file=sys.stderr)
        print('\n'.join(out[p['name']]), file=sys.stderr)
    json.dump(out, open(os.path.join(HERE, 'grids.json'), 'w'))
