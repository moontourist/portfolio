// The light at a peak right now: where the sun is, and the poster colours that go with it.

const rad = Math.PI / 180

/** Sun altitude and azimuth (degrees; azimuth from north, clockwise) for an observer. Low-precision
 *  solar position (Astronomical Almanac), good to a fraction of a degree, which is plenty for colour. */
export function sunPosition(lat: number, lonWest: number, date: Date) {
  const n = date.getTime() / 86_400_000 + 2_440_587.5 - 2_451_545
  const meanLon = (280.46 + 0.9856474 * n) % 360
  const anomaly = ((357.528 + 0.9856003 * n) % 360) * rad
  const eclipticLon = (meanLon + 1.915 * Math.sin(anomaly) + 0.02 * Math.sin(2 * anomaly)) * rad
  const obliquity = (23.439 - 0.0000004 * n) * rad
  const ra = Math.atan2(Math.cos(obliquity) * Math.sin(eclipticLon), Math.cos(eclipticLon)) / rad
  const dec = Math.asin(Math.sin(obliquity) * Math.sin(eclipticLon))
  const sidereal = (((280.46061837 + 360.98564736629 * n) % 360) + 360) % 360
  const hourAngle = (sidereal - lonWest - ra) * rad
  const phi = lat * rad
  const alt = Math.asin(Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.cos(hourAngle))
  const az = Math.atan2(-Math.cos(dec) * Math.sin(hourAngle), Math.sin(dec) * Math.cos(phi) - Math.cos(dec) * Math.sin(phi) * Math.cos(hourAngle))
  return { alt: alt / rad, az: (((az / rad) % 360) + 360) % 360 }
}

// Poster colours at key sun altitudes, blended in between. Each stop is a full set of --poster-* values.
type Stop = { at: number; stars: number; colors: Record<string, string> }
const STOPS: Stop[] = [
  { at: -18, stars: 1, colors: { // night
    'sky-top': '#08182c', 'sky-horizon': '#0c3558', ground: '#061626', 'near-lit': '#0e2a44', mid: '#0a2440',
    'mid-lit': '#16395c', far: '#10304f', snow: '#e3eaf2', 'snow-shade': '#b4c3d2', 'far-snow': '#a9bccd',
    ink: '#e8e4da', name: '#fecc02', star: '#ffffff', cloud: '#c7d3df', strip: '#061626', sun: '#ffd28a', overcast: '#141c28' } },
  { at: -9, stars: 0.75, colors: { // blue hour: indigo sky, lavender snow
    'sky-top': '#0b1a40', 'sky-horizon': '#3a3b7c', ground: '#0b1330', 'near-lit': '#18214c', mid: '#1c2858',
    'mid-lit': '#2a356e', far: '#333d77', snow: '#cfcaf2', 'snow-shade': '#9c9bd0', 'far-snow': '#8f8fc4',
    ink: '#ece8f4', name: '#fecc02', star: '#ffffff', cloud: '#a9a5d8', strip: '#0b1330', sun: '#ffb070', overcast: '#25274a' } },
  { at: -3, stars: 0.25, colors: { // afterglow: purple mountains, pink alpenglow, orange horizon
    'sky-top': '#1f2a62', 'sky-horizon': '#e8875f', ground: '#1a1434', 'near-lit': '#36234d', mid: '#3a2a5c',
    'mid-lit': '#673c73', far: '#7a4e86', snow: '#f7bccb', 'snow-shade': '#b282b4', 'far-snow': '#d69dba',
    ink: '#fdf2ea', name: '#fecc02', star: '#ffffff', cloud: '#f2a7a6', strip: '#1a1434', sun: '#ff9a5c', overcast: '#3b2f4e' } },
  { at: 3, stars: 0, colors: { // golden hour
    'sky-top': '#2b4f8f', 'sky-horizon': '#ffb36b', ground: '#2a2638', 'near-lit': '#63473f', mid: '#47455f',
    'mid-lit': '#9b6852', far: '#8a7c9a', snow: '#ffdcb3', 'snow-shade': '#b9a6c2', 'far-snow': '#e8c9b5',
    ink: '#ffffff', name: '#fecc02', star: '#ffffff', cloud: '#ffd2a8', strip: '#2a2638', sun: '#ffd28a', overcast: '#474757' } },
  { at: 12, stars: 0, colors: { // daylight: blue sky, white snow, green-grey forest
    'sky-top': '#25599e', 'sky-horizon': '#9cc8ec', ground: '#1d3428', 'near-lit': '#2e5240', mid: '#38526b',
    'mid-lit': '#58778f', far: '#7b98b4', snow: '#ffffff', 'snow-shade': '#c4d4e6', 'far-snow': '#dce8f3',
    ink: '#ffffff', name: '#fecc02', star: '#ffffff', cloud: '#ffffff', strip: '#1d3428', sun: '#fff6d8', overcast: '#4d6073' } },
  { at: 50, stars: 0, colors: { // high sun
    'sky-top': '#22579c', 'sky-horizon': '#8ec1ec', ground: '#1b3426', 'near-lit': '#31583f', mid: '#3a566f',
    'mid-lit': '#5f7f97', far: '#80a0bc', snow: '#ffffff', 'snow-shade': '#cad9ea', 'far-snow': '#e0ebf5',
    ink: '#ffffff', name: '#fecc02', star: '#ffffff', cloud: '#ffffff', strip: '#1b3426', sun: '#fffbea', overcast: '#506579' } },
]

const hex = (h: string) => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a: string, b: string, t: number) =>
  '#' + hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * t).toString(16).padStart(2, '0')).join('')

/** Poster colours for a sun altitude, blended between the two stops either side of it.
 *  `cover` (0-1, the live cloud cover) greys the sky toward the stop's overcast colour. */
export function palette(sunAlt: number, cover = 0) {
  const next = STOPS.findIndex(s => s.at > sunAlt)
  const lo = next === -1 ? STOPS.at(-1)! : STOPS[Math.max(0, next - 1)]
  const hi = next === -1 ? lo : STOPS[next]
  const t = hi === lo ? 0 : (sunAlt - lo.at) / (hi.at - lo.at)
  const colors: Record<string, string> = {}
  for (const key of Object.keys(lo.colors)) colors[key] = mix(lo.colors[key], hi.colors[key], t)
  const grey = 0.6 * cover ** 1.5 // light cloud barely changes the sky; full overcast greys it well over half
  colors['sky-top'] = mix(colors['sky-top'], colors.overcast, grey)
  colors['sky-horizon'] = mix(colors['sky-horizon'], colors.overcast, grey)
  return { colors, stars: lo.stars + (hi.stars - lo.stars) * t }
}

/** A plain name for the light, e.g. "Golden hour". `az` tells sunrise from sunset. */
export function lightName(sunAlt: number, sunAz: number): string {
  const morning = sunAz < 180
  if (sunAlt < -12) return 'Night'
  if (sunAlt < -4) return 'Blue hour'
  if (sunAlt < 1) return morning ? 'Sunrise glow' : 'Sunset glow'
  if (sunAlt < 8) return 'Golden hour'
  return 'Daylight'
}
