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

/**
 * ASCII cloud layers for a sky grid: wispy high cloud near the top, mid-level cloud, and low cloud down
 * by the mountains. How much of each band is cloud follows the live percentages; thin edges use light
 * characters and thick cores heavier ones, so even full overcast has texture. Each row is doubled so the
 * layer can drift sideways forever without a seam.
 */
export function cloudField(clouds: Clouds, rows: number, cols: number): string {
  const layers = [
    { cover: clouds.high, from: 0.04, to: 0.32, chars: '.-', stretch: 3, seed: 1 },
    { cover: clouds.mid, from: 0.28, to: 0.6, chars: '.-~', stretch: 2.5, seed: 2 },
    { cover: clouds.low, from: 0.55, to: 0.88, chars: '.~=', stretch: 2, seed: 3 },
  ]
  const period = Math.ceil(cols / 12) // noise cells across one copy of the row
  const lines: string[] = []
  for (let r = 0; r < rows; r++) {
    const y = r / rows
    let line = ''
    for (let c = 0; c < cols; c++) {
      let ch = ' '
      for (const l of layers) {
        if (y < l.from || y > l.to || l.cover <= 0) continue
        // Fade the band's edges so layers don't end in straight lines
        const edge = Math.min(y - l.from, l.to - y) / ((l.to - l.from) / 2)
        const n =
          0.65 * noise((c / cols) * period, r / l.stretch, period, l.seed) +
          0.35 * noise((c / cols) * period * 2, r / (l.stretch / 2), period * 2, l.seed + 9)
        const thickness = n * Math.min(1, edge * 2.5) - (1 - l.cover / 100) // > 0 means cloud here
        if (thickness > 0) ch = l.chars[Math.min(l.chars.length - 1, Math.floor(thickness * l.chars.length * 2.2))]
      }
      line += ch
    }
    lines.push(line + line)
  }
  return lines.join('\n')
}
