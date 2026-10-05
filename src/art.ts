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

// A mountain scene. Runs of the same character become one wide rect, which keeps big scenes light.
const SCENE_FILLS: Record<string, string> = {
  '#': 'currentColor', // near foothills in shadow, in the poster's ground colour
  'h': 'var(--poster-near-lit)', // near foothills in sunlight
  '%': 'var(--poster-mid)', // the peak's own range in shadow, a step lighter
  'm': 'var(--poster-mid-lit)', // the peak's own range in sunlight
  '=': 'var(--poster-far)', // ranges beyond, lighter again
  '*': 'var(--poster-snow)', // sunlit snow
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
      return rects
    })
    .join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${grid.length}" preserveAspectRatio="xMidYMax slice" shape-rendering="crispEdges" class="h-full w-full">${rows}</svg>`
}

// The scene's skyline as one stepped line, the highest filled cell in each column, in the same frame as
// landscape() so the two line up. The intro traces it like a plotter before the terrain fills in under it.
export function ridgeline(grid: string[]): string {
  const width = Math.max(...grid.map(r => r.length))
  let d = ''
  for (let x = 0; x < width; x++) {
    const top = grid.findIndex(row => (row[x] ?? '.') in SCENE_FILLS)
    d += `${x === 0 ? 'M0 ' : 'V'}${top === -1 ? grid.length : top}H${x + 1}`
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${grid.length}" preserveAspectRatio="xMidYMax slice" class="ridge h-full w-full"><path d="${d}" pathLength="1" fill="none" stroke="var(--poster-snow)" stroke-width="0.35"/></svg>`
}

// Split a scene into three depth layers for parallax: far ranges, the peak's own range (with all snow),
// and near foothills. Each back layer is filled solid down to the ground underneath the layers in front,
// so when the layers drift apart on scroll they only ever reveal sky above the ridges, never holes.
export function depthLayers(grid: string[]): { far: string[]; mid: string[]; near: string[] } {
  const isFar = (c: string) => c === '=' || c === '+'
  const isNear = (c: string) => c === '#' || c === 'h'
  const far = grid.map(row => [...row].map(c => (c === '.' ? '.' : isFar(c) ? c : '=')).join(''))
  const mid = grid.map(row => [...row].map(c => (c === '.' || isFar(c) ? '.' : isNear(c) ? '%' : c)).join(''))
  const near = grid.map(row => [...row].map(c => (isNear(c) ? c : '.')).join(''))
  return { far, mid, near }
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
    <g fill="#fecc02" class="accent">${pixels(grid, '+', 1)}</g>
  </svg>`
}

// The sun: a small pixel disc in the palette's sun colour
const SUN = ['..###..', '.#####.', '#######', '#######', '#######', '.#####.', '..###..']
export const sun = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7 7" shape-rendering="crispEdges" class="size-full" fill="var(--poster-sun)">${pixels(SUN, '#', 1)}</svg>`
