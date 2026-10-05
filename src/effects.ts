// Small live sky effects, all drawn as ASCII on the sky's character grid and all driven by real data:
//   wind                - the clouds' breeze follows the real wind
//   shooting stars      - at night, rare, and more frequent on real meteor-shower nights
//   northern lights     - only when NOAA's geomagnetic index says they'd be visible from Washington

const ASPECT = 7.2 / 20 // cell width / cell height

/** Sideways breeze across the view, in cell widths per second, from the real wind at the peak.
 *  `fromDeg` is where the wind blows from (meteorological convention). */
export function breezeAcross(kmh: number, fromDeg: number, look: 'north' | 'south'): number {
  const toward = ((fromDeg + 180) * Math.PI) / 180
  const eastward = Math.sin(toward) // +1 blowing east, -1 blowing west
  const rightward = look === 'north' ? eastward : -eastward // facing north, east is on the right
  const speed = Math.min(3, 0.15 + kmh * 0.03) // a light breeze still moves a little; storms cap out
  return rightward * speed
}

// Major annual meteor showers: peak date (month, day) and how many meteors an hour at best (ZHR)
const SHOWERS = [
  { name: 'Quadrantids', month: 1, day: 4, zhr: 110 },
  { name: 'Lyrids', month: 4, day: 22, zhr: 18 },
  { name: 'Eta Aquariids', month: 5, day: 6, zhr: 50 },
  { name: 'Perseids', month: 8, day: 12, zhr: 100 },
  { name: 'Orionids', month: 10, day: 21, zhr: 20 },
  { name: 'Leonids', month: 11, day: 17, zhr: 15 },
  { name: 'Geminids', month: 12, day: 14, zhr: 150 },
]

/** A meteor shower active within two days of `date`, if any. */
export function activeShower(date: Date) {
  for (const s of SHOWERS) {
    const peak = Date.UTC(date.getUTCFullYear(), s.month - 1, s.day)
    if (Math.abs(date.getTime() - peak) <= 2 * 86_400_000) return s
  }
  return null
}

type Meteor = { x: number; y: number; dx: number; dy: number; age: number; life: number }

/** Shooting stars: rare streaks across the night sky, more of them on shower nights. */
export class Meteors {
  private meteors: Meteor[] = []
  private nextIn: number
  private cols: number
  private rows: number
  private perMinute: number
  constructor(cols: number, rows: number, perMinute: number) {
    this.cols = cols
    this.rows = rows
    this.perMinute = perMinute
    this.nextIn = this.wait()
  }

  private wait() {
    return (-Math.log(1 - Math.random()) * 60) / this.perMinute // random gaps, like real meteors
  }

  step(dt: number) {
    this.nextIn -= dt
    if (this.nextIn <= 0) {
      this.nextIn = this.wait()
      const right = Math.random() < 0.5
      const angle = ((15 + Math.random() * 25) * Math.PI) / 180 // shallow, falling
      const speed = 55 + Math.random() * 35 // cell widths per second
      this.meteors.push({
        x: Math.random() * this.cols,
        y: Math.random() * this.rows * 0.5,
        dx: Math.cos(angle) * speed * (right ? 1 : -1),
        dy: Math.sin(angle) * speed * ASPECT, // rows per second
        age: 0,
        life: 0.45 + Math.random() * 0.4,
      })
    }
    for (const m of this.meteors) {
      m.age += dt
      m.x += m.dx * dt
      m.y += m.dy * dt
    }
    this.meteors = this.meteors.filter(m => m.age < m.life)
  }

  draw(grid: string[][]) {
    for (const m of this.meteors) {
      const fading = m.age > m.life * 0.7
      const len = Math.hypot(m.dx, m.dy / ASPECT)
      for (let i = 0; i < 7; i++) {
        // Head, then a tail back along the path, thinning out
        const x = Math.round(m.x - (m.dx / len) * i), y = Math.round(m.y - (m.dy / len) * i * ASPECT * 2.2)
        if (y < 0 || y >= this.rows || x < 0 || x >= this.cols) continue
        grid[y][x] = i === 0 ? (fading ? '+' : '*') : i < 3 ? '-' : '.'
      }
    }
  }
}

/** Is the aurora visible from this latitude at this geomagnetic activity (planetary Kp index)?
 *  Roughly: northern Washington sees it on the northern horizon from Kp 5, the south of the state from Kp 6. */
export function auroraStrength(kp: number, lat: number): number {
  const threshold = lat >= 48 ? 5 : 6
  return kp < threshold ? 0 : Math.min(1, 0.35 + (kp - threshold) * 0.25)
}

// Smooth, non-repeating wobble from a few sine waves at unrelated frequencies
const wobble = (x: number, t: number, seed: number) =>
  0.5 + 0.25 * Math.sin(x * 0.13 + t * 0.2 + seed) + 0.15 * Math.sin(x * 0.37 - t * 0.13 + seed * 2.1) +
  0.1 * Math.sin(x * 0.71 + t * 0.31 + seed * 3.7)

/** Northern-lights curtains, low in the northern sky, drawn as HTML (coloured spans) for one frame.
 *  Each curtain has a wavy, bright lower edge with rays of uneven length rising from it, thinning and
 *  shifting from green at the base through teal to violet at the tips. Curtains come and go along the
 *  horizon, with dark gaps between them, and everything drifts slowly. */
export function auroraFrame(cols: number, rows: number, strength: number, t: number): string {
  const top = Math.floor(rows * 0.28), bottom = Math.floor(rows * 0.84)
  const span = bottom - top
  const lines: string[] = []
  for (let r = 0; r < rows; r++) {
    let html = '', run = '', runColor = ''
    for (let c = 0; c < cols; c++) {
      let ch = ' ', color = ''
      // The curtains reshape slowly, about as fast as clouds change
      const slow = t * 0.06
      const present = wobble(c * 0.6, slow * 0.5, 1) // is there a curtain over this stretch of horizon?
      if (r >= top && r <= bottom && present > 0.5) {
        const base = bottom - wobble(c, slow, 2) * span * 0.35 // the curtain's wavy lower edge
        const length = (0.25 + 0.75 * wobble(c * 1.7, slow * 1.3, 3)) * span * 0.75 * strength // this ray's height
        const up = (base - r) / length // 0 at the lower edge, 1 at the ray's tip
        if (up >= 0 && up <= 1) {
          // Each cell has a fixed place in the pattern, and twinkles in and out slowly like a star:
          // its own 3-7 second rhythm, so the curtain shimmers gently instead of flickering
          const hash = (n: number) => { const v = Math.sin(n) * 43758.5453; return v - Math.floor(v) }
          const seed = hash(c * 12.9898 + r * 78.233)
          const pulse = 0.8 + 0.2 * Math.sin((t * 2 * Math.PI) / (3 + hash(seed * 91.7) * 4) + seed * 6.283)
          if (seed < (1 - up * 0.75) * (present - 0.35) * 1.6 * pulse) {
            ch = up < 0.15 ? '|' : up < 0.45 ? '!' : up < 0.75 ? ':' : '.'
            color = up < 0.35 ? 'g' : up < 0.65 ? 't' : 'v'
          }
        }
      }
      if (color !== runColor) {
        html += runColor ? `<span class="aurora-${runColor}">${run}</span>` : run
        run = ''
        runColor = color
      }
      run += ch
    }
    html += runColor ? `<span class="aurora-${runColor}">${run}</span>` : run
    lines.push(html)
  }
  return lines.join('\n')
}

/** Latest planetary Kp index from NOAA's Space Weather Prediction Center, or null. */
let kpRequest: Promise<number | null> | null = null
export function latestKp(): Promise<number | null> {
  kpRequest ??= fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json', { signal: AbortSignal.timeout(5000) })
    .then(r => (r.ok ? r.json() : Promise.reject(r.status)))
    .then((rows: { Kp: number }[]) => rows.at(-1)?.Kp ?? null)
    .catch(() => null)
  return kpRequest
}
