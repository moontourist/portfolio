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

// A small seeded random generator, so a peak's clouds stay put through the hour instead of reshuffling
function random(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const CLOUD_CELL = 6 // px per cloud pixel, close to the mountains' pixel size

/**
 * Pixel-art clouds for a sky of `cols` x `rows` cells, drawn as an SVG two skies wide so it can drift
 * forever without a seam (clouds wrap around the edge). Three kinds, by the live data:
 *   low cloud  -> big cumulus with flat bases, down among the ranges
 *   mid cloud  -> smaller puffy patches
 *   high cloud -> long thin streaks of cirrus
 * Each cloud is a cluster of round puffs, shaded like the mountains: lit tops, mid-tone bodies,
 * shadowed undersides, in the --poster-cloud* colours for the current light.
 */
export function cloudScene(clouds: Clouds, cols: number, rows: number, seed: number): string {
  const rand = random(seed)
  const grid: string[][] = Array.from({ length: rows }, () => Array(cols).fill(' '))
  const puff = (cx: number, cy: number, w: number, h: number, flatBase: boolean) => {
    // A cloud: a row of overlapping circles along a base, tallest in the middle
    const puffs = Math.max(2, Math.round(w / Math.max(3, h * 0.9)))
    const circles = Array.from({ length: puffs }, (_, i) => {
      const t = puffs === 1 ? 0.5 : i / (puffs - 1)
      const r = h * (0.45 + 0.55 * Math.sin(Math.PI * t)) * (0.75 + rand() * 0.4)
      return { x: cx - w / 2 + t * w, y: cy + h / 2 - r * 0.9, r }
    })
    const top = cy - h, base = cy + h / 2
    for (let y = Math.floor(top - 2); y <= Math.ceil(base); y++) {
      if (y < 0 || y >= rows) continue
      for (let x = Math.floor(cx - w / 2 - h); x <= Math.ceil(cx + w / 2 + h); x++) {
        if (flatBase && y > base) continue
        const inside = circles.some(c => (x - c.x) ** 2 + ((y - c.y) * 1.15) ** 2 <= c.r * c.r)
        if (!inside) continue
        // Shade by height within the cloud: lit top, body, shadowed underside
        const depth = (y - top) / (base - top)
        const tone = depth < 0.45 ? 'L' : depth < 0.8 ? 'M' : 'S'
        const col = ((x % cols) + cols) % cols // wrap around so the drift loops
        if (grid[y][col] === ' ' || tone < grid[y][col]) grid[y][col] = tone
      }
    }
  }
  const streak = (cx: number, cy: number, w: number) => {
    for (let x = Math.floor(cx - w / 2); x <= cx + w / 2; x++) {
      const y = Math.round(cy + Math.sin(x / 7) * 0.6)
      if (y < 0 || y >= rows || rand() < 0.12) continue
      const col = ((x % cols) + cols) % cols
      if (grid[y][col] === ' ') grid[y][col] = 'M'
    }
  }
  const scale = cols / 200 // a 1280px-wide poster is about 200 cells
  const count = (cover: number, perScreen: number) => Math.round((cover / 100) * perScreen * scale)
  for (let i = 0; i < count(clouds.high, 9); i++) streak(rand() * cols, rows * (0.05 + rand() * 0.18), 18 + rand() * 40)
  for (let i = 0; i < count(clouds.mid, 7); i++) puff(rand() * cols, rows * (0.22 + rand() * 0.22), 8 + rand() * 14, 3 + rand() * 2.5, true)
  for (let i = 0; i < count(clouds.low, 5); i++) puff(rand() * cols, rows * (0.5 + rand() * 0.22), 20 + rand() * 26, 6 + rand() * 4, true)

  const fills: Record<string, string> = { L: 'var(--poster-cloud)', M: 'var(--poster-cloud-mid)', S: 'var(--poster-cloud-shade)' }
  let rects = ''
  for (let y = 0; y < rows; y++) {
    const row = grid[y].join('')
    for (let x = 0; x < cols; ) {
      let n = 1
      while (x + n < cols && row[x + n] === row[x]) n++
      if (row[x] !== ' ') {
        // Draw each run twice: once in each copy of the sky
        rects += `<rect x="${x}" y="${y}" width="${n}" height="1" fill="${fills[row[x]]}"/>`
        rects += `<rect x="${x + cols}" y="${y}" width="${n}" height="1" fill="${fills[row[x]]}"/>`
      }
      x += n
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cols * 2} ${rows}" width="${cols * 2 * CLOUD_CELL}" height="${rows * CLOUD_CELL}" shape-rendering="crispEdges">${rects}</svg>`
}
