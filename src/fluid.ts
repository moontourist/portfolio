// A small fluid simulation for the clouds, so the cursor can stir the sky.
//
// Stable Fluids (Jos Stam, 1999) on the same coarse grid as the ASCII sky: velocity is advected and made
// incompressible each step, so a push from the pointer turns into swirls and eddies; cloud thickness rides
// along on that velocity. A light breeze carries everything sideways, and the clouds relax back toward the
// live weather pattern over a few seconds, so you can play with the sky but it never stops being true.
//
// Cells are 7.2 x 20 px (one character), so vertical motion is scaled by that aspect to keep swirls round.

const ASPECT = 7.2 / 20 // cell width / cell height
const PRESSURE_ITERATIONS = 20
const DAMPING = 0.985 // velocity kept per step; lower calms the air faster
const RELAX_SECONDS = 4 // how long the clouds take to settle back to the live pattern

export class CloudSim {
  readonly cols: number
  readonly rows: number
  private u: Float32Array // horizontal velocity, cells per second
  private v: Float32Array // vertical velocity, cells per second
  private uNext: Float32Array
  private vNext: Float32Array
  private pressure: Float32Array
  private divergence: Float32Array
  density: Float32Array
  private densityNext: Float32Array
  private target: Float32Array // the live weather pattern
  private windOffset = 0 // how far the breeze has carried the target pattern, in cells
  private wind: number // the breeze, in cells per second

  constructor(cols: number, rows: number, target: Float32Array, wind = 0.45) {
    this.wind = wind
    this.cols = cols
    this.rows = rows
    const n = cols * rows
    this.u = new Float32Array(n)
    this.v = new Float32Array(n)
    this.uNext = new Float32Array(n)
    this.vNext = new Float32Array(n)
    this.pressure = new Float32Array(n)
    this.divergence = new Float32Array(n)
    this.target = target
    this.density = Float32Array.from(target)
    this.densityNext = new Float32Array(n)
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

  /** Push the air: a pointer at cell (x, y) moving (dx, dy) cells, felt within `radius` cells. */
  stir(x: number, y: number, dx: number, dy: number, radius = 5) {
    const r = Math.ceil(radius)
    for (let j = -Math.ceil(r * ASPECT); j <= Math.ceil(r * ASPECT); j++) {
      for (let i = -r; i <= r; i++) {
        const dist2 = i * i + (j / ASPECT) ** 2
        const falloff = Math.exp(-dist2 / (radius * radius * 0.5))
        if (falloff < 0.02) continue
        const k = this.at(Math.round(x) + i, Math.round(y) + j)
        this.u[k] += dx * falloff * 12
        this.v[k] += dy * falloff * 12
      }
    }
  }

  step(dt: number) {
    const { cols, rows } = this
    // 1. Carry velocity along itself (semi-Lagrangian advection), with a little damping
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const k = y * cols + x
        const px = x - this.u[k] * dt
        const py = y - this.v[k] * dt * ASPECT
        this.uNext[k] = this.sample(this.u, px, py) * DAMPING
        this.vNext[k] = this.sample(this.v, px, py) * DAMPING
      }
    }
    ;[this.u, this.uNext] = [this.uNext, this.u]
    ;[this.v, this.vNext] = [this.vNext, this.v]

    // 2. Make the flow incompressible, which is what turns pushes into swirls
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const k = y * cols + x
        const dvdy = y === 0 || y === rows - 1 ? 0 : this.v[this.at(x, y + 1)] - this.v[this.at(x, y - 1)]
        this.divergence[k] = -0.5 * (this.u[this.at(x + 1, y)] - this.u[this.at(x - 1, y)] + dvdy)
        this.pressure[k] = 0
      }
    }
    for (let it = 0; it < PRESSURE_ITERATIONS; it++) {
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const k = y * cols + x
          this.pressure[k] =
            (this.divergence[k] +
              this.pressure[this.at(x - 1, y)] + this.pressure[this.at(x + 1, y)] +
              this.pressure[this.at(x, y - 1)] + this.pressure[this.at(x, y + 1)]) / 4
        }
      }
    }
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const k = y * cols + x
        this.u[k] -= 0.5 * (this.pressure[this.at(x + 1, y)] - this.pressure[this.at(x - 1, y)])
        this.v[k] -= 0.5 * (this.pressure[this.at(x, y + 1)] - this.pressure[this.at(x, y - 1)])
        if (y === 0 || y === rows - 1) this.v[k] = 0 // no flow through the top or the ground
      }
    }

    // 3. Carry the clouds on the air plus the breeze, then ease them back toward the live pattern
    this.windOffset = (this.windOffset + this.wind * dt) % cols
    const relax = 1 - Math.exp(-dt / RELAX_SECONDS)
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const k = y * cols + x
        const carried = this.sample(this.density, x - (this.u[k] + this.wind) * dt, y - this.v[k] * dt * ASPECT)
        const live = this.sample(this.target, x - this.windOffset, y)
        this.densityNext[k] = carried + (live - carried) * relax
      }
    }
    ;[this.density, this.densityNext] = [this.densityNext, this.density]
  }
}
