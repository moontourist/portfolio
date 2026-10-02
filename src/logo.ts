// The logo: three slanted stripes (after the TRD decal) in Swedish colours,
// with a pixel-art moon drawn on top. Edit MOON to redraw the moon: '#' is a pixel.

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

export function logo(): string {
  const stripes = STRIPES.map((color, i) => {
    const x = i * 46
    return `<polygon points="${x},0 ${x + 40},0 ${x + 100},160 ${x + 60},160" fill="${color}"/>`
  }).join('')

  // 8px pixels, placed over the middle stripe
  const pixels = MOON.flatMap((row, y) =>
    [...row].map((c, x) => (c === '#' ? `<rect x="${70 + x * 8}" y="${32 + y * 8}" width="8" height="8"/>` : '')),
  ).join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 160">${stripes}<g fill="#fff" shape-rendering="crispEdges">${pixels}</g></svg>`
}
