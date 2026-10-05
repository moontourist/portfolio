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

// A mountain scene. Each row is its own group with --r = rows from the bottom, so CSS can draw it in
// from the ground up. Runs of the same character become one wide rect, which keeps big scenes light.
const SCENE_FILLS: Record<string, string> = {
  '#': 'currentColor', // near foothills in shadow, in the poster's ground colour
  'h': 'var(--poster-near-lit)', // near foothills in sunlight
  '%': 'var(--poster-mid)', // the peak's own range in shadow, a step lighter
  'm': 'var(--poster-mid-lit)', // the peak's own range in sunlight
  '=': 'var(--poster-far)', // ranges beyond, lighter again
  '*': '#fff', // sunlit snow
  's': 'var(--poster-snow-shade)', // snow in shadow
  '+': 'var(--poster-far-snow)', // distant snow
}
export function landscape(grid: string[]): string {
  const width = Math.max(...grid.map(r => r.length))
  const rows = grid
    .map((row, y) => {
      let rects = ''
      for (let x = 0; x < row.length; ) {
        let n = 1
        while (row[x + n] === row[x]) n++
        const fill = SCENE_FILLS[row[x]]
        if (fill) rects += `<rect x="${x}" y="${y}" width="${n}" height="1" fill="${fill}"/>`
        x += n
      }
      return `<g class="row" style="--r:${grid.length - 1 - y}">${rects}</g>`
    })
    .join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${grid.length}" preserveAspectRatio="xMidYMax slice" shape-rendering="crispEdges" class="h-full w-full" style="--steps:${grid.length}">${rows}</svg>`
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
