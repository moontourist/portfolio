// A small fluid simulation for the clouds, so the cursor moves through the sky like a plane through cloud.
//
// Stable Fluids (Jos Stam, 1999) on the same coarse grid as the ASCII sky. The breeze is part of the airflow,
// and the pointer is a solid obstacle in it: air can't pass through the pointer, so the incompressibility
// step diverts the flow around it. Cloud is pushed out of its path, wraps around its edges and closes up in
// a wake behind it. Clouds relax back toward the live weather pattern over a few seconds, except right
// around the pointer, so the gap holds while the pointer is there and heals after it leaves.
//
// Cells are 7.2 x 20 px (one character), so vertical motion is scaled by that aspect to keep shapes round.

const ASPECT = 7.2 / 20 // cell width / cell height
const PRESSURE_ITERATIONS = 24
const BREEZE_SECONDS = 2 // how quickly disturbed air settles back to the breeze
const RELAX_SECONDS = 4 // how quickly the clouds settle back to the live pattern
const OBSTACLE_RADIUS = 4 // pointer size, in cell widths (about 29 px)
const MAX_PUSH = 12 // fastest the pointer can push the air, cell widths per second; higher tears cloud apart

export class CloudSim {
  readonly cols: number
  readonly rows: number
  private u: Float32Array // horizontal velocity, cell widths per second
  private v: Float32Array // vertical velocity, cell widths per second
  private uNext: Float32Array
  private vNext: Float32Array
  private pressure: Float32Array
  private divergence: Float32Array
  private solid: Uint8Array // 1 where the pointer is
  density: Float32Array
  private densityNext: Float32Array
  private target: Float32Array // the live weather pattern
  private windOffset = 0 // how far the breeze has carried the live pattern, in cells
  private wind: number // the breeze, in cell widths per second
  private obstacle: { x: number; y: number; vx: number; vy: number } | null = null

  constructor(cols: number, rows: number, target: Float32Array, wind = 0.45) {
    this.cols = cols
    this.rows = rows
    this.wind = wind
    const n = cols * rows
    this.u = new Float32Array(n).fill(wind)
    this.v = new Float32Array(n)
    this.uNext = new Float32Array(n)
    this.vNext = new Float32Array(n)
    this.pressure = new Float32Array(n)
    this.divergence = new Float32Array(n)
    this.solid = new Uint8Array(n)
    this.target = target
    this.density = Float32Array.from(target)
    this.densityNext = new Float32Array(n)
  }

  /** The pointer is at cell (x, y), moving (vx, vy) cell widths per second. */
  setObstacle(x: number, y: number, vx: number, vy: number) {
    // A fast flick still moves the pointer, but only pushes the air so hard
    const speed = Math.hypot(vx, vy)
    const scale = speed > MAX_PUSH ? MAX_PUSH / speed : 1
    this.obstacle = { x, y, vx: vx * scale, vy: vy * scale }
  }

  clearObstacle() {
    this.obstacle = null
  }

  // Index with wrap-around across the width and clamping at the top and bottom
  private at(x: number, y: number): number {
    const cx = ((x % this.cols) + this.cols) % this.cols
    const cy = Math.min(this.rows - 1, Math.max(0, y))
    return cy * this.cols + cx
  }

  // Bilinear sample of a field at a fractional cell position
  private sample(field: Float32Array, x: number, y: number): number {
    y = Math.min(this.rows - 1, Math.max(0, y))
    const x0 = Math.floor(x), y0 = Math.floor(y)
    const fx = x - x0, fy = y - y0
    const a = field[this.at(x0, y0)], b = field[this.at(x0 + 1, y0)]
    const c = field[this.at(x0, y0 + 1)], d = field[this.at(x0 + 1, y0 + 1)]
    return (a + (b - a) * fx) * (1 - fy) + (c + (d - c) * fx) * fy
  }

  // Distance from the pointer in cell widths (vertical distance converted by the cell aspect)
  private pointerDistance(x: number, y: number): number {
    const o = this.obstacle
    if (!o) return Infinity
    let dx = Math.abs(x - o.x)
    dx = Math.min(dx, this.cols - dx) // the sky wraps around
    return Math.hypot(dx, (y - o.y) / ASPECT)
  }

  // Mark the pointer's cells as solid and give them the pointer's own velocity
  private applyObstacle() {
    this.solid.fill(0)
    const o = this.obstacle
    if (!o) return
    const rx = Math.ceil(OBSTACLE_RADIUS), ry = Math.ceil(OBSTACLE_RADIUS * ASPECT) + 1
    for (let j = -ry; j <= ry; j++) {
      for (let i = -rx; i <= rx; i++) {
        const x = Math.round(o.x) + i, y = Math.round(o.y) + j
        if (y < 0 || y >= this.rows || this.pointerDistance(x, y) > OBSTACLE_RADIUS) continue
        const k = this.at(x, y)
        this.solid[k] = 1
        this.u[k] = o.vx
        this.v[k] = o.vy
      }
    }
  }

  step(dt: number) {
    const { cols, rows } = this
    if (this.obstacle) {
      // The pointer's velocity fades if it stops moving, so a resting pointer is just a still obstacle
      const fade = Math.exp(-dt / 0.15)
      this.obstacle.vx *= fade
      this.obstacle.vy *= fade
    }

    // 1. Disturbed air settles back toward the breeze
    const settle = 1 - Math.exp(-dt / BREEZE_SECONDS)
    for (let k = 0; k < this.u.length; k++) {
      this.u[k] += (this.wind - this.u[k]) * settle
      this.v[k] -= this.v[k] * settle
    }
    this.applyObstacle()

    // 2. Carry velocity along itself (semi-Lagrangian advection)
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const k = y * cols + x
        const px = x - this.u[k] * dt
        const py = y - this.v[k] * dt * ASPECT
        this.uNext[k] = this.sample(this.u, px, py)
        this.vNext[k] = this.sample(this.v, px, py)
      }
    }
    ;[this.u, this.uNext] = [this.uNext, this.u]
    ;[this.v, this.vNext] = [this.vNext, this.v]
    this.applyObstacle()

    // 3. Make the flow incompressible. Solid cells act as walls (their pressure mirrors the neighbour's),
    //    which is what sends the air, and the cloud riding on it, around the pointer.
    const p = this.pressure, solid = this.solid
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const k = y * cols + x
        const dvdy = y === 0 || y === rows - 1 ? 0 : this.v[this.at(x, y + 1)] - this.v[this.at(x, y - 1)]
        this.divergence[k] = -0.5 * (this.u[this.at(x + 1, y)] - this.u[this.at(x - 1, y)] + dvdy)
        p[k] = 0
      }
    }
    for (let it = 0; it < PRESSURE_ITERATIONS; it++) {
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const k = y * cols + x
          if (solid[k]) continue
          const l = this.at(x - 1, y), r = this.at(x + 1, y), t = this.at(x, y - 1), b = this.at(x, y + 1)
          p[k] = (this.divergence[k] + (solid[l] ? p[k] : p[l]) + (solid[r] ? p[k] : p[r]) +
            (solid[t] ? p[k] : p[t]) + (solid[b] ? p[k] : p[b])) / 4
        }
      }
    }
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const k = y * cols + x
        if (solid[k]) continue
        const l = this.at(x - 1, y), r = this.at(x + 1, y), t = this.at(x, y - 1), b = this.at(x, y + 1)
        this.u[k] -= 0.5 * ((solid[r] ? p[k] : p[r]) - (solid[l] ? p[k] : p[l]))
        this.v[k] -= 0.5 * ((solid[b] ? p[k] : p[b]) - (solid[t] ? p[k] : p[t]))
        if (y === 0 || y === rows - 1) this.v[k] = 0 // no flow through the top or the ground
      }
    }

    // 4. Carry the clouds on the air. The pointer pushes cloud out of its own space; away from it,
    //    the clouds ease back toward the live pattern, which drifts with the breeze.
    //    Transport is MacCormack: a plain step back along the flow, a step forward again to measure the
    //    blur that introduced, and a correction for it, clamped to the cells it came from. Plain
    //    resampling smears thin cloud across clear sky; this keeps cloud edges where they are.
    this.windOffset = (this.windOffset + this.wind * dt) % cols
    const relax = 1 - Math.exp(-dt / RELAX_SECONDS)
    const back = this.densityNext // reuse as scratch: the plain backward step
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const k = y * cols + x
        back[k] = this.sample(this.density, x - this.u[k] * dt, y - this.v[k] * dt * ASPECT)
      }
    }
    const corrected = this.pressure // reuse as scratch: pressure isn't needed again this step
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const k = y * cols + x
        const sx = x - this.u[k] * dt, sy = Math.min(rows - 1, Math.max(0, y - this.v[k] * dt * ASPECT))
        const forward = this.sample(back, x + this.u[k] * dt, y + this.v[k] * dt * ASPECT)
        let value = back[k] + 0.5 * (this.density[k] - forward)
        // Never brighter or dimmer than the four cells it was carried from
        const x0 = Math.floor(sx), y0 = Math.floor(sy)
        const a = this.density[this.at(x0, y0)], b = this.density[this.at(x0 + 1, y0)]
        const c = this.density[this.at(x0, y0 + 1)], d = this.density[this.at(x0 + 1, y0 + 1)]
        value = Math.min(Math.max(a, b, c, d), Math.max(Math.min(a, b, c, d), value))
        corrected[k] = value
      }
    }
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const k = y * cols + x
        if (solid[k]) {
          this.densityNext[k] = 0
          continue
        }
        const carried = corrected[k]
        const live = this.sample(this.target, x - this.windOffset, y)
        // No healing right around the pointer, so its gap holds while it's there
        const near = Math.min(1, Math.max(0, (this.pointerDistance(x, y) - OBSTACLE_RADIUS) / (OBSTACLE_RADIUS * 1.5)))
        this.densityNext[k] = carried + (live - carried) * relax * near
      }
    }
    ;[this.density, this.densityNext] = [this.densityNext, this.density]
  }
}
