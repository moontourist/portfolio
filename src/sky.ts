// The real night sky above a peak, right now, drawn as ASCII.
// Standard positional astronomy: sidereal time -> each star's altitude and azimuth for the observer.

import { STARS } from './stars'

export type SkyStar = { row: number; col: number; char: string }
export type SkyGrid = { rows: number; cols: number; cellWidth: number; cellHeight: number }

const rad = Math.PI / 180

// Greenwich mean sidereal time in degrees for a moment in time
function siderealDegrees(date: Date): number {
  const daysSinceJ2000 = date.getTime() / 86_400_000 + 2_440_587.5 - 2_451_545
  return (((280.46061837 + 360.98564736629 * daysSinceJ2000) % 360) + 360) % 360
}

// Altitude and azimuth (degrees; azimuth from north, clockwise) of one star for an observer
function horizon(raDeg: number, decDeg: number, latDeg: number, localSiderealDeg: number) {
  const hourAngle = (localSiderealDeg - raDeg) * rad
  const lat = latDeg * rad
  const dec = decDeg * rad
  const alt = Math.asin(Math.sin(lat) * Math.sin(dec) + Math.cos(lat) * Math.cos(dec) * Math.cos(hourAngle))
  const az = Math.atan2(
    -Math.cos(dec) * Math.sin(hourAngle),
    Math.sin(dec) * Math.cos(lat) - Math.cos(dec) * Math.sin(lat) * Math.cos(hourAngle),
  )
  return { alt: alt / rad, az: ((az / rad) % 360 + 360) % 360 }
}

/**
 * Where a point in the sky lands on the poster, as fractions across (x) and down (y), or null if it's
 * out of view. The bottom of the poster is the horizon and the top is `topAltitude` degrees up; the width
 * covers the same number of degrees per pixel, so the sky isn't stretched (capped at 180° wide).
 */
export function project(alt: number, az: number, look: 'north' | 'south', grid: SkyGrid, topAltitude = 60) {
  const degPerPx = topAltitude / (grid.rows * grid.cellHeight)
  const halfWidth = Math.min(90, (grid.cols * grid.cellWidth * degPerPx) / 2)
  if (alt <= 0 || alt >= topAltitude) return null
  // Degrees to the viewer's right of straight ahead. Facing south, east is on the left;
  // facing north, west is on the left.
  const ahead = look === 'north' ? 0 : 180
  const offset = ((az - ahead + 540) % 360) - 180
  if (Math.abs(offset) >= halfWidth) return null
  return { x: (offset + halfWidth) / (2 * halfWidth), y: 1 - alt / topAltitude }
}

/** Stars visible from (lat, lonWest) at `date`, facing `look`, laid onto a character grid. */
export function skyAbove(lat: number, lonWest: number, date: Date, grid: SkyGrid, look: 'north' | 'south' = 'south'): SkyStar[] {
  const localSidereal = siderealDegrees(date) - lonWest
  const cells = new Map<string, SkyStar>()
  for (const [ra, dec, mag] of STARS) {
    const { alt, az } = horizon(ra, dec, lat, localSidereal)
    const at = project(alt, az, look, grid)
    if (!at) continue
    const col = Math.floor(at.x * grid.cols)
    const row = Math.floor(at.y * grid.rows)
    const key = `${row},${col}`
    if (cells.has(key)) continue // brightest first, so the brighter star keeps the cell
    cells.set(key, { row, col, char: mag < 1.5 ? '*' : mag < 3 ? '+' : '.' })
  }
  return [...cells.values()]
}
