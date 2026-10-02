// Pixel art drawn from text grids. Edit a grid to redraw it.
// '#' and '*' are pixels, anything else is empty.

const MOON = [
  '...#####....',
  '.######.....',
  '.####.......',
  '####........',
  '###.........',
  '###.........',
  '###.........',
  '###.........',
  '####........',
  '.####.......',
  '.######.....',
  '...#####....',
]

// Mount Rainier. '*' is snow, '#' is rock.
const RAINIER = [
  '......................****',
  '...................**********',
  '.................*****##*******',
  '...............****####***##****',
  '.............***#####***######***',
  '...........**####################**',
  '.........###########################',
  '.......###############################',
  '.....###################################',
  '...#######################################',
  '.###########################################',
  '###############################################',
]

const STRIPES = ['#fecc02', '#006aa7', '#0a2f4f']

// One <rect> per pixel character in the grid
function pixels(grid: string[], char: string, size: number, x0 = 0, y0 = 0): string {
  return grid
    .flatMap((row, y) =>
      [...row].map((c, x) =>
        c === char ? `<rect x="${x0 + x * size}" y="${y0 + y * size}" width="${size}" height="${size}"/>` : '',
      ),
    )
    .join('')
}

// Three slanted stripes (after the TRD decal) with the pixel moon on top
export function logo(): string {
  const stripes = STRIPES.map((color, i) => {
    const x = i * 46
    return `<polygon points="${x},0 ${x + 40},0 ${x + 100},160 ${x + 60},160" fill="${color}"/>`
  }).join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 160">${stripes}<g fill="#fff" shape-rendering="crispEdges">${pixels(MOON, '#', 8, 70, 32)}</g></svg>`
}

// Drawn in the text colour, so it works in light and dark mode
export function rainier(): string {
  const width = Math.max(...RAINIER.map(r => r.length))
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${RAINIER.length}" shape-rendering="crispEdges" fill="currentColor">
    <g opacity="0.07">${pixels(RAINIER, '#', 1)}</g>
    <g opacity="0.2">${pixels(RAINIER, '*', 1)}</g>
  </svg>`
}
