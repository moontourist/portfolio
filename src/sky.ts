// The real night sky above a peak, right now, drawn as ASCII.
// Standard positional astronomy: sidereal time -> each star's altitude and azimuth for the observer.

import { STARS } from './stars'

export type SkyStar = { row: number; col: number; char: string }

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
 * Stars visible from (lat, lonWest) at `date`, looking south, laid onto a character grid.
 * The bottom of the grid is the horizon and the top is `topAltitude` degrees up; the grid's width
 * covers the same number of degrees per pixel, so the sky isn't stretched (capped at 180° wide).
 */
export function skyAbove(
  lat: number,
  lonWest: number,
  date: Date,
  grid: { rows: number; cols: number; cellWidth: number; cellHeight: number },
  topAltitude = 60,
): SkyStar[] {
  const localSidereal = siderealDegrees(date) - lonWest
  const degPerPx = topAltitude / (grid.rows * grid.cellHeight)
  const halfWidth = Math.min(90, (grid.cols * grid.cellWidth * degPerPx) / 2)

  const cells = new Map<string, SkyStar>()
  for (const [ra, dec, mag] of STARS) {
    const { alt, az } = horizon(ra, dec, lat, localSidereal)
    if (alt <= 0 || alt >= topAltitude) continue
    const offset = az - 180 // degrees west (+) or east (-) of due south
    if (Math.abs(offset) >= halfWidth) continue
    // Facing south, east is on the left and west on the right
    const col = Math.floor(((offset + halfWidth) / (2 * halfWidth)) * grid.cols)
    const row = Math.floor((1 - alt / topAltitude) * grid.rows)
    const key = `${row},${col}`
    if (cells.has(key)) continue // brightest first, so the brighter star keeps the cell
    cells.set(key, { row, col, char: mag < 1.5 ? '*' : mag < 3 ? '+' : '.' })
  }
  return [...cells.values()]
}
