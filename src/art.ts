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

// A mountain grid: rock in the text colour, snow in white
export function landscape(grid: string[]): string {
  const width = Math.max(...grid.map(r => r.length))
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${grid.length}" shape-rendering="crispEdges">
    <g fill="currentColor">${pixels(grid, '#', 1)}</g>
    <g fill="#fff">${pixels(grid, '*', 1)}</g>
  </svg>`
}

// A barcode made from the bits of a string: a 1 is a wide bar, a 0 a thin one
export function barcode(text: string): string {
  let x = 0
  const bars = [...text]
    .flatMap(c => [...c.charCodeAt(0).toString(2).padStart(8, '0')])
    .map(bit => {
      const w = bit === '1' ? 2 : 1
      const rect = `<rect x="${x}" width="${w}" height="1"/>`
      x += w + 1
      return rect
    })
    .join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${x} 1" preserveAspectRatio="none" shape-rendering="crispEdges" fill="currentColor" class="h-full w-full">${bars}</svg>`
}

// A thin registration crosshair, as printed in a poster's corners
export const crosshair = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="size-4" stroke="currentColor" stroke-width="1"><path d="M8 0v16M0 8h16"/></svg>`

// Craft icons, 12x12, drawn like the peaks: '#' in the text colour, '+' in flag yellow.
const ICONS = {
  rack: [
    '############',
    '#..........#',
    '#.++....##.#',
    '#..........#',
    '############',
    '#..........#',
    '#.++....##.#',
    '#..........#',
    '############',
    '#..........#',
    '#.++....##.#',
    '############',
  ],
  terminal: [
    '############',
    '############',
    '#..........#',
    '#.#........#',
    '#..#.......#',
    '#...#......#',
    '#..#.......#',
    '#.#..++++..#',
    '#..........#',
    '#..........#',
    '#..........#',
    '############',
  ],
  wave: [
    '............',
    '.....#......',
    '.....#...#..',
    '..#..#...#..',
    '..#..##..#..',
    '#.#.###.##.#',
    '#.#.###.##.#',
    '..#..##..#..',
    '..#..#...#..',
    '.....#...#..',
    '.....#......',
    '............',
  ],
  camera: [
    '............',
    '...####.....',
    '############',
    '#.........+#',
    '#...####...#',
    '#..#....#..#',
    '#..#.++.#..#',
    '#..#.++.#..#',
    '#...####...#',
    '#..........#',
    '############',
    '............',
  ],
  gamepad: [
    '............',
    '............',
    '.##########.',
    '#..........#',
    '#.#......+.#',
    '###.....+.+#',
    '#.#......+.#',
    '#..........#',
    '#...####...#',
    '.##......##.',
    '............',
    '............',
  ],
}

export type IconName = keyof typeof ICONS

export function icon(name: IconName): string {
  const grid = ICONS[name]
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" shape-rendering="crispEdges" class="size-full">
    <g fill="currentColor">${pixels(grid, '#', 1)}</g>
    <g fill="#fecc02">${pixels(grid, '+', 1)}</g>
  </svg>`
}
