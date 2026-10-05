// Live cloud cover over a peak, from Open-Meteo (free, no key; weather data by Open-Meteo.com, CC BY 4.0).

export type Clouds = { total: number; low: number; mid: number; high: number } // percent

const cache = new Map<string, Promise<Clouds | null>>()

export function cloudsAt(lat: number, lonWest: number): Promise<Clouds | null> {
  const key = `${lat},${lonWest}`
  if (!cache.has(key)) {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${-lonWest}` +
      '&current=cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high'
    cache.set(
      key,
      fetch(url, { signal: AbortSignal.timeout(5000) })
        .then(r => (r.ok ? r.json() : Promise.reject(r.status)))
        .then(({ current: c }) => ({
          total: c.cloud_cover,
          low: c.cloud_cover_low,
          mid: c.cloud_cover_mid,
          high: c.cloud_cover_high,
        }))
        .catch(() => null), // no weather is fine: the sky just stays clear
    )
  }
  return cache.get(key)!
}

// Smooth value noise that repeats every `period` cells across, so a doubled row drifts seamlessly
function noise(x: number, y: number, period: number, seed: number): number {
  const hash = (ix: number, iy: number) => {
    const h = Math.sin((((ix % period) + period) % period) * 127.1 + iy * 311.7 + seed * 74.7) * 43758.5453
    return h - Math.floor(h)
  }
  const ix = Math.floor(x), iy = Math.floor(y)
  const fx = x - ix, fy = y - iy
  const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy)
  const top = hash(ix, iy) + (hash(ix + 1, iy) - hash(ix, iy)) * sx
  const bottom = hash(ix, iy + 1) + (hash(ix + 1, iy + 1) - hash(ix, iy + 1)) * sx
  return top + (bottom - top) * sy
}

// The three cloud bands, top to bottom: wispy high cloud, mid-level cloud, low cloud by the mountains.
// Each band draws with its own characters, light at the thin edges and heavier in thick cores.
const BANDS = [
  { key: 'high', from: 0.04, to: 0.32, chars: '.-', stretch: 3, seed: 1 },
  { key: 'mid', from: 0.28, to: 0.6, chars: '.-~', stretch: 2.5, seed: 2 },
  { key: 'low', from: 0.55, to: 0.88, chars: '.~=', stretch: 2, seed: 3 },
] as const

/**
 * Cloud thickness for every cell of a sky grid (0 = clear), from the live percentages: how much of each
 * band is cloud follows its cover. Repeats across the width, so it can drift sideways without a seam.
 */
export function cloudDensity(clouds: Clouds, rows: number, cols: number): Float32Array {
  const density = new Float32Array(rows * cols)
  const period = Math.ceil(cols / 12) // noise cells across the width
  for (let r = 0; r < rows; r++) {
    const y = r / rows
    for (const band of BANDS) {
      const cover = clouds[band.key]
      if (y < band.from || y > band.to || cover <= 0) continue
      // Fade the band's edges so layers don't end in straight lines
      const edge = Math.min(y - band.from, band.to - y) / ((band.to - band.from) / 2)
      for (let c = 0; c < cols; c++) {
        const n =
          0.65 * noise((c / cols) * period, r / band.stretch, period, band.seed) +
          0.35 * noise((c / cols) * period * 2, r / (band.stretch / 2), period * 2, band.seed + 9)
        const thickness = n * Math.min(1, edge * 2.5) - (1 - cover / 100)
        if (thickness > density[r * cols + c]) density[r * cols + c] = thickness
      }
    }
  }
  return density
}

/** The ASCII character for a thickness at a height (0-1 down the sky): blank when clear. */
export function cloudChar(thickness: number, y: number): string {
  if (thickness <= 0.004) return ' '
  const band = [...BANDS].reverse().find(b => y >= b.from) ?? BANDS[0] // the lowest band at or above this height
  const chars = band.chars
  return chars[Math.min(chars.length - 1, Math.floor(thickness * chars.length * 2.2))]
}

/** Draw a thickness grid as ASCII rows. */
export function cloudText(density: Float32Array, rows: number, cols: number): string {
  const lines: string[] = []
  for (let r = 0; r < rows; r++) {
    let line = ''
    for (let c = 0; c < cols; c++) line += cloudChar(density[r * cols + c], r / rows)
    lines.push(line)
  }
  return lines.join('\n')
}
