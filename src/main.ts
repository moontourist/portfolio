import './style.css'
import { profile, status, crafts, projects, links } from './data'
import { logo, landscape, depthLayers, crosshair, icon, sun } from './art'
import { peaks } from './peaks'
import { skyAbove, project } from './sky'
import { sunPosition, palette, lightName } from './daylight'
import { cloudsAt, cloudDensity, cloudText } from './weather'
import { CloudSim } from './fluid'
import { breezeAcross, Precipitation, Meteors, activeShower, auroraStrength, auroraFrame, latestKp } from './effects'

// Filled in at build time by vite.config.ts
declare const __COMMIT__: string
declare const __BUILT__: string

// A different Washington peak on every visit; "Next peak" moves through the rest.
// ?peak=Mt.%20Rainier picks one (for sharing a link to a particular mountain).
const peakParam = new URLSearchParams(location.search).get('peak')
let peakIndex = Math.max(0, peaks.findIndex(p => p.name === peakParam))
if (!peakParam || peaks[peakIndex].name !== peakParam) peakIndex = Math.floor(Math.random() * peaks.length)
const peak = peaks[peakIndex]
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches

// The moment the sky shows: now, or any time given as ?at=2026-10-05T18:45-07:00 (handy for previewing sunsets)
const atParam = new URLSearchParams(location.search).get('at')
const now = () => (atParam ? new Date(atParam) : new Date())

// First-load timeline (ms). The rain builds the sky, the mountain draws in, then the rest of the page fades in.
// The matching mountain delays live in style.css (--intro). Slow everything down by raising these together.
const FADE_IN_AT = 3300
const INTRO_DONE_AT = 4600

// The starfield is the real sky above the current peak, right now, facing south (see sky.ts).
// On first load each star falls in as a raindrop and lands in place (after the `rain` effect in
// terminaltexteffects, which Omarchy's screensaver uses). It's Washington: rain first, then a clear night.
// About 40% of the stars then twinkle, each on its own slow rhythm so the sky never pulses in sync.
const CELL = { width: 7.2, height: 20 } // one JetBrains Mono character at 12px with 20px line height
const star = (char: string, row: number, rain: boolean) => {
  const cls = ['star']
  let style = rain ? `--row:${row};--fd:${Math.round(Math.random() * 800)}ms;` : ''
  if (!rain) cls.push('landed')
  if (Math.random() < 0.4) {
    cls.push('twinkle')
    style += `--t:${(2 + Math.random() * 3).toFixed(2)}s;--d:${(-Math.random() * 5).toFixed(2)}s` // 2-5s, start mid-twinkle
  }
  return `<span class="${cls.join(' ')}" style="${style}">${char}</span>`
}

function drawSky(p: (typeof peaks)[number], rain: boolean) {
  const sky = document.querySelector<HTMLElement>('#sky')!
  const box = sky.getBoundingClientRect()
  const grid = { rows: Math.ceil(box.height / CELL.height), cols: Math.ceil(box.width / CELL.width), cellWidth: CELL.width, cellHeight: CELL.height }
  const lines: string[][] = Array.from({ length: grid.rows }, () => Array(grid.cols).fill(' '))
  for (const s of skyAbove(p.lat, p.lon, now(), grid, p.look)) lines[s.row][s.col] = star(s.char, s.row, rain)
  sky.innerHTML = lines.map(l => l.join('')).join('\n')
}

// Jump finished-length animations under `root` to their end. Used as a safety net when animation
// frames are paused (background tab, screenshot tools); looping ones like the twinkle are left alone.
const finishAll = (root: Element) =>
  root.getAnimations({ subtree: true })
    .filter(a => a.effect?.getComputedTiming().endTime !== Infinity)
    .forEach(a => a.finish())

// Crosshairs pinned to each corner of a block. On phones the bottom pair would sit on the mountain, so they wait for 768px.
const corners = ['top-3 left-3', 'top-3 right-3', 'hidden md:block bottom-3 left-3', 'hidden md:block bottom-3 right-3']
  .map(pos => `<span aria-hidden="true" class="absolute ${pos}">${crosshair}</span>`)
  .join('')

// Section heading: squashed serif with a yellow bar. Kept smaller than the hero name.
// Sections are separated by space, not rules: generous between groups, tight from heading to content.
const section = (title: string, body: string) => `
  <section class="mt-16 first:mt-0 lg:mt-24 lg:first:mt-0">
    <h2 class="mb-6 border-l-4 border-secondary pl-4 text-4xl sm:text-5xl"><span class="display inline-block">${title}</span></h2>
    ${body}
  </section>`

// A shell prompt line for the terminal panel (decorative, so hidden from screen readers)
const prompt = (command: string, id = '') => `
  <p aria-hidden="true" class="font-mono text-sm">
    <span class="text-primary">matt@baker</span><span class="opacity-75">:~$</span> <span ${id ? `id="${id}"` : ''}>${command}</span>
  </p>`

// Only tag projects "In progress" when some are finished, otherwise the tag says nothing
const mixedStatus = new Set(projects.map(p => p.status)).size > 1

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <a href="#main" class="btn btn-secondary btn-sm sr-only fixed top-3 left-3 z-10 focus:not-sr-only">Skip to content</a>

  <nav class="intro-fade navbar gap-1 border-b border-base-300 px-6 md:px-12">
    <a href="/" class="flex flex-1 items-center gap-3">
      <span class="w-10">${logo()}</span>
      <span class="sr-only font-semibold sm:not-sr-only">moontourist</span>
    </a>
    ${links.filter(l => l.nav).map(l => `<a class="btn btn-ghost btn-sm pointer-coarse:h-11 ${'phone' in l ? '' : 'hidden sm:inline-flex'}" href="${l.url}">${l.name}</a>`).join('')}
    <button id="theme-toggle" type="button" aria-pressed="false" class="btn btn-ghost btn-sm gap-2 pointer-coarse:h-11">
      <span aria-hidden="true" class="size-2.5 border border-current"></span>Dark
    </button>
  </nav>

  <header>
    <!-- Poster colours come from the --poster-* variables in style.css -->
    <div class="draw poster-sky relative overflow-hidden text-(--poster-ink) md:pb-[clamp(16rem,18.2vw,26rem)]">
      <pre id="sky" aria-hidden="true" class="sky-stars pointer-events-none absolute inset-0 overflow-hidden font-mono text-xs leading-5 text-(--poster-star)"></pre>
      <pre id="aurora" aria-hidden="true" class="pointer-events-none absolute inset-0 overflow-hidden font-mono text-xs leading-5 opacity-55"></pre>
      <pre id="meteors" aria-hidden="true" class="pointer-events-none absolute inset-0 overflow-hidden font-mono text-xs leading-5 text-(--poster-star)"></pre>
      <div id="sun" aria-hidden="true" class="pointer-events-none absolute hidden size-7 -translate-1/2">${sun}</div>
      <div aria-hidden="true" class="intro-fade pointer-events-none absolute inset-0 overflow-hidden">
        <pre id="clouds" class="font-mono text-xs leading-5 text-(--poster-cloud) opacity-40"></pre>
      </div>
      <div class="intro-fade">${corners}</div>
      <!-- Name first in the code so screen readers hear it before the readouts; the readouts still show above it -->
      <div class="intro-fade halo relative flex max-w-4xl flex-col px-6 pt-16 md:px-12">
        <h1 class="display mt-6 text-7xl text-(--poster-name) sm:text-9xl">${profile.name.replace(' ', ' <br>')}</h1>
        <p class="mt-8 max-w-md text-lg">${profile.role} at ${profile.company}, based in ${profile.location}.</p>
        <div class="order-first">
          <p class="readout"><span id="coords" aria-hidden="true"></span><span id="coords-sr" class="sr-only"></span></p>
          <p id="sky-note" class="readout mt-1"></p>
          <p id="weather" class="readout mt-1"></p>
        </div>
      </div>
      <!-- The scene spans the poster's full width. Phones: below the text. From 768px: along the bottom, on the strip.
           Its height follows the scene's own proportions (40 rows : 220 columns, about 18.2% of the width), so wide screens never crop the summit; phones crop the sides, keeping the peak in view. -->
      <div id="peak-art" aria-hidden="true" class="relative mt-8 h-[clamp(9rem,18.2vw,26rem)] w-full cursor-pointer text-(--poster-ground) md:absolute md:inset-x-0 md:bottom-0 md:mt-0"></div>
      <pre id="precip" aria-hidden="true" class="pointer-events-none absolute inset-0 overflow-hidden font-mono text-xs leading-5 text-(--poster-cloud) opacity-50"></pre>
    </div>
    <div class="draw flex items-center justify-between gap-6 bg-(--poster-strip) px-6 py-3 text-white md:px-12">
      <div class="intro-fade flex flex-wrap items-center gap-x-5 gap-y-1">
        <p id="peak-name" aria-live="polite" class="readout opacity-100"></p>
        <button id="next-peak" type="button" class="readout inline-flex items-center underline underline-offset-4 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current pointer-coarse:min-h-11">Next peak</button>
      </div>
      <p id="peak-count" class="intro-fade readout shrink-0 opacity-100"></p>
    </div>
  </header>

  <!-- Below the poster, the station's desk: the log (who Matt is) on the left, the console (what's running)
       in a rail on the right under the peak counter. One column on phones, in the same order. -->
  <main id="main" tabindex="-1" class="intro-fade px-6 pt-16 pb-24 outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-secondary md:px-12 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(22rem,26rem)] lg:gap-x-16 xl:gap-x-24">
    <div>
    ${section('About', `<p class="max-w-2xl text-lg leading-relaxed">${profile.bio}</p>`)}

    ${section('Crafts', `
      <ul class="grid max-w-2xl gap-y-10 2xl:max-w-none 2xl:grid-cols-2 2xl:gap-x-16">
        ${crafts.map(c => `
          <li class="craft grid grid-cols-[2.5rem_1fr] gap-x-5">
            <span aria-hidden="true" class="craft-icon mt-1 size-10">${icon(c.icon)}</span>
            <div>
              <h3 class="font-semibold">${c.name}</h3>
              <p class="mt-1 opacity-80">${c.detail}</p>
              ${c.link ? `<a class="link link-primary mt-2 inline-block text-sm" href="${c.link.url}">${c.link.label}</a>` : ''}
              ${c.sample ? `
                <figure class="mt-4 border border-base-300 bg-base-200">
                  <pre class="overflow-x-auto px-5 py-4 font-mono text-sm leading-relaxed">${c.sample.join('\n')}<span aria-hidden="true" class="ml-2 inline-block h-[1.1em] w-[0.6em] bg-secondary align-text-bottom"></span></pre>
                  <figcaption class="readout border-t border-base-300 px-5 py-2">Excerpt of real output</figcaption>
                </figure>` : ''}
            </div>
          </li>`).join('')}
      </ul>`)}
    </div>
    <div class="mt-16 border-t border-base-300 pt-16 lg:mt-0 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
    ${section('Projects', `
      <ul>
        ${projects.map(p => `
          <li class="border-b border-base-300 py-4 first:pt-0 last:border-b-0 last:pb-0">
            <div class="flex items-baseline justify-between gap-4">
              <h3 class="font-mono text-lg font-medium">${p.name}</h3>
              ${mixedStatus && p.status === 'active' ? '<span class="badge badge-secondary badge-sm">In progress</span>' : ''}
            </div>
            <p class="mt-1 max-w-2xl opacity-80">${p.description}</p>
            ${p.url ? `<a class="link link-primary mt-2 inline-block text-sm" href="${p.url}">View source on GitHub</a>` : ''}
            ${p.note ? `<p class="readout mt-2">${p.note}</p>` : ''}
          </li>`).join('')}
      </ul>`)}

    ${section('Status', `
      <div class="notch border border-base-300 bg-base-200">
        <div class="border-b border-base-300 px-5 py-3">${prompt('status --all', 'status-cmd')}</div>
        <dl class="grid gap-px bg-base-300">
          ${[
            { label: 'System', value: '<span class="status status-success"></span> Nominal' },
            ...status,
            { label: 'Last deploy', value: __BUILT__ },
            { label: 'Commit', value: __COMMIT__ },
            { label: 'Local time', value: '<span id="clock"></span>' },
          ].map(s => `
            <div class="flex items-center justify-between gap-4 bg-base-200 px-5 py-3">
              <dt class="readout">${s.label}</dt>
              <dd class="flex items-center gap-2 text-right font-mono">${s.value}</dd>
            </div>`).join('')}
        </dl>
        <div id="status-end" class="border-t border-base-300 px-5 py-3">${prompt('<span class="cursor"></span>')}</div>
      </div>`)}
    </div>
  </main>

  <footer class="intro-fade flex flex-wrap items-center justify-between gap-4 border-t border-base-300 px-6 py-8 text-sm md:px-12">
    <p class="opacity-70">Made in Washington.</p>
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      ${links.map(l => `<a class="link link-hover inline-flex items-center pointer-coarse:min-h-11" href="${l.url}">${l.footer ?? l.name}</a>`).join('')}
    </div>
  </footer>
`

// Coordinates decode into place, Marathon-style: digits flicker, then settle left to right
let scrambleRun = 0
let settledRun = 0
function scramble(el: HTMLElement, text: string) {
  const run = ++scrambleRun
  if (reduceMotion) return void (el.textContent = text)
  const start = performance.now()
  const frame = () => {
    if (run !== scrambleRun || run === settledRun) return // a newer peak took over, or the safety net already landed it
    const progress = Math.min(1, (performance.now() - start) / 1000)
    const settled = Math.floor(progress * text.length)
    el.textContent = [...text]
      .map((c, i) => (i < settled || !/\d/.test(c) ? c : String(Math.floor(Math.random() * 10))))
      .join('')
    if (progress < 1) requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)
  // Safety net: if animation frames are paused (background tab, screenshot tools), land on the real value anyway
  setTimeout(() => {
    if (run !== scrambleRun) return
    settledRun = run
    el.textContent = text
  }, 1200)
}

// Put a peak into the poster: its sky, mountain, name and coordinates.
// New elements replay the draw-in animation from style.css. `first` is the page-load intro.
function showPeak(p: (typeof peaks)[number], first = false) {
  const coords = `${p.lat.toFixed(4)}° N  ${p.lon.toFixed(4)}° W`
  document.querySelector('#coords-sr')!.textContent = coords
  // On first load the coordinates decode as they fade in; after that, straight away
  setTimeout(() => scramble(document.querySelector<HTMLElement>('#coords')!, coords), first && !reduceMotion ? FADE_IN_AT : 0)
  drawSky(p, first && !reduceMotion)
  showLight(p)
  // Three depth layers, back to front; scrolling drifts the back ones (see the parallax below)
  const layers = depthLayers(p.grid)
  document.querySelector('#peak-art')!.innerHTML = (['far', 'mid', 'near'] as const)
    .map(depth => `<div class="depth absolute inset-0" data-depth="${depth}">${landscape(layers[depth])}</div>`)
    .join('')
  document.querySelector('#peak-name')!.textContent = `${p.name}  ${p.metres} m / ${p.feet} ft`
  document.querySelector('#peak-count')!.textContent = `Peak ${peaks.indexOf(p) + 1} / ${peaks.length}`
  showClouds(p)
  // Same safety net for the draw-in: once it should be over, jump the poster's animations to their end
  setTimeout(() => document.querySelectorAll('header .draw').forEach(finishAll), first ? INTRO_DONE_AT : 2200)
}

let cloudCover = 0 // latest cloud cover for the current peak, in percent; greys the sky when overcast
// The real light at the peak right now: sky colours, how many stars show, and the sun if it's in view
const peakTime = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles', hour: '2-digit', minute: '2-digit', hour12: false })
function showLight(p: (typeof peaks)[number]) {
  const moment = now()
  const { alt, az } = sunPosition(p.lat, p.lon, moment)
  const { colors, stars } = palette(alt, cloudCover / 100)
  dark = stars > 0.5
  shower = dark ? activeShower(moment) : null
  aurora = dark && p.look === 'north' ? auroraStrength(kp, p.lat) : 0 // the aurora is in the northern sky
  document.querySelector('#sky-note')!.textContent =
    `Real sky  ${lightName(alt, az)} ${peakTime.format(moment)} PT  looking ${p.look}` +
    (shower ? `  ${shower.name} tonight` : '') + (aurora ? `  aurora  Kp ${kp.toFixed(1)}` : '')
  setupNightEffects()
  const root = document.documentElement.style
  for (const [key, value] of Object.entries(colors)) root.setProperty(`--poster-${key}`, value)
  root.setProperty('--stars', stars.toFixed(2))
  const sky = document.querySelector('#sky')!.getBoundingClientRect()
  const at = project(alt, az, p.look, { rows: sky.height / CELL.height, cols: sky.width / CELL.width, cellWidth: CELL.width, cellHeight: CELL.height })
  const disc = document.querySelector<HTMLElement>('#sun')!
  disc.classList.toggle('hidden', !at)
  if (at) Object.assign(disc.style, { left: `${at.x * 100}%`, top: `${at.y * sky.height}px` })
}
// The light changes slowly; check it every minute
setInterval(() => showLight(peaks[peakIndex]), 60_000)

// Night effects: shooting stars (more on real meteor-shower nights) and the northern lights when NOAA's
// geomagnetic index says they're visible from here. ?kp=7 previews an aurora night; ?meteors=1 a shower.
const params = new URLSearchParams(location.search)
let dark = false
let shower: ReturnType<typeof activeShower> = null
let kp = Number(params.get('kp') ?? 0)
let aurora = 0
let meteors: Meteors | null = null
function setupNightEffects() {
  const sky = document.querySelector('#sky')!.getBoundingClientRect()
  const rows = Math.ceil(sky.height / CELL.height), cols = Math.ceil(sky.width / CELL.width)
  const perMinute = !dark ? 0 : params.has('meteors') ? 12 : shower ? 1.5 + shower.zhr / 15 : 1.2
  meteors = perMinute && !reduceMotion ? new Meteors(cols, rows, perMinute) : null
  if (!meteors) document.querySelector('#meteors')!.textContent = ''
  if (!aurora) document.querySelector('#aurora')!.textContent = ''
  drawEffects(performance.now() / 1000) // a first frame now; for reduced motion it's the only one
}
if (!params.has('kp')) latestKp().then(value => {
  if (value == null) return
  kp = value
  showLight(peaks[peakIndex])
})
let precipitation: Precipitation | null = null
let drawEffects = (_t: number) => {} // set below with the animation loop; also used to draw a first frame

// The clouds as a fluid: a breeze carries them and they flow around the pointer (see fluid.ts).
// The sim steps every frame while the poster is on screen and the tab is visible, and redraws at ~30fps.
let sim: CloudSim | null = null
{
  const poster = document.querySelector<HTMLElement>('header .draw')!
  const layer = document.querySelector<HTMLElement>('#clouds')!
  let last = performance.now(), lastDraw = 0
  const frame = (now: number) => {
    requestAnimationFrame(frame)
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    if (document.hidden || poster.classList.contains('paused')) return
    sim?.step(dt)
    precipitation?.step(dt, now / 1000)
    meteors?.step(dt)
    if (now - lastDraw > 33) {
      lastDraw = now
      if (sim) layer.textContent = cloudText(sim.density, sim.rows, sim.cols)
      drawEffects(now / 1000)
    }
  }
  if (!reduceMotion) requestAnimationFrame(frame)

  // Rain/snow and meteors share one grid size with the sky; the aurora draws its own coloured rows
  const blank = (rows: number, cols: number) => Array.from({ length: rows }, () => Array<string>(cols).fill(' '))
  drawEffects = (t: number) => {
    const sky = document.querySelector('#sky')!.getBoundingClientRect()
    const rows = Math.ceil(sky.height / CELL.height), cols = Math.ceil(sky.width / CELL.width)
    if (precipitation) {
      const grid = blank(rows, cols)
      precipitation.draw(grid)
      document.querySelector('#precip')!.textContent = grid.map(r => r.join('')).join('\n')
    }
    if (meteors) {
      const grid = blank(rows, cols)
      meteors.draw(grid)
      document.querySelector('#meteors')!.textContent = grid.map(r => r.join('')).join('\n')
    }
    if (aurora) document.querySelector('#aurora')!.innerHTML = auroraFrame(cols, rows, aurora, t)
  }

  // The pointer is a solid body in the air: clouds part around it and close up behind it, like a plane
  // through cloud. Touch drags work too, until the page starts scrolling.
  let prev: { x: number; y: number; t: number } | null = null
  poster.addEventListener('pointermove', e => {
    if (!sim) return
    const box = document.querySelector('#sky')!.getBoundingClientRect()
    const x = (e.clientX - box.left) / CELL.width
    const y = (e.clientY - box.top) / CELL.height
    // Velocity in cell widths per second, both directions, so vertical and horizontal motion match
    const dt = prev ? Math.max(0.008, (e.timeStamp - prev.t) / 1000) : 1
    const vx = prev ? (e.clientX - prev.x) / CELL.width / dt : 0
    const vy = prev ? (e.clientY - prev.y) / CELL.width / dt : 0
    sim.setObstacle(x, y, vx, vy)
    prev = { x: e.clientX, y: e.clientY, t: e.timeStamp }
  })
  poster.addEventListener('pointerleave', () => {
    prev = null
    sim?.clearObstacle()
  })
}

// Live clouds over the peak. Ignores answers that arrive after the visitor has moved to another peak.
function showClouds(p: (typeof peaks)[number]) {
  const layer = document.querySelector<HTMLElement>('#clouds')!
  const note = document.querySelector<HTMLElement>('#weather')!
  layer.textContent = ''
  note.textContent = ''
  cloudCover = 0
  sim = null
  // Previews: ?clouds=low,mid,high (percent), ?rain=2 (mm), ?snow=1 (cm), ?wind=40,270 (km/h, from degrees)
  const q = new URLSearchParams(location.search)
  const cloudPreview = q.get('clouds')?.split(',').map(Number)
  const windPreview = q.get('wind')?.split(',').map(Number)
  const live = cloudsAt(p.lat, p.lon).then(real => {
    const base = real ?? { total: 0, low: 0, mid: 0, high: 0, rain: 0, snow: 0, windKmh: 10, windFrom: 270 }
    if (!real && !q.size) return null
    return {
      ...base,
      ...(cloudPreview?.length === 3 && { low: cloudPreview[0], mid: cloudPreview[1], high: cloudPreview[2], total: Math.max(...cloudPreview) }),
      ...(q.has('rain') && { rain: Number(q.get('rain')) }),
      ...(q.has('snow') && { snow: Number(q.get('snow')) }),
      ...(windPreview?.length === 2 && { windKmh: windPreview[0], windFrom: windPreview[1] }),
    }
  })
  precipitation = null
  document.querySelector('#precip')!.textContent = ''
  live.then(clouds => {
    if (!clouds || peaks[peakIndex] !== p) return
    const box = document.querySelector('#sky')!.getBoundingClientRect()
    cloudCover = clouds.total
    showLight(p)
    const rows = Math.ceil(box.height / CELL.height), cols = Math.ceil(box.width / CELL.width)
    const density = cloudDensity(clouds, rows, cols)
    // Reduced motion: the live pattern, still. Otherwise the clouds go into the fluid sim below.
    layer.textContent = cloudText(density, rows, cols) // drawn right away; the sim takes over from the next frame
    const breeze = breezeAcross(clouds.windKmh, clouds.windFrom, p.look) // the real wind, across the view
    if (!reduceMotion) sim = new CloudSim(cols, rows, density, breeze)
    // Rain or snow when it's really coming down (snow wins if both)
    const kind = clouds.snow > 0.05 ? 'snow' : clouds.rain > 0.05 ? 'rain' : null
    // It falls from the clouds: the lowest cloud cell in each column, as the clouds are right now
    const cloudBase = (c: number) => {
      const field = sim?.density ?? density
      for (let r = rows - 1; r >= 0; r--) if (field[r * cols + c] > 0.03) return r
      return null
    }
    if (kind) precipitation = new Precipitation(cols, rows, kind, kind === 'snow' ? clouds.snow : clouds.rain, breeze, cloudBase)
    drawEffects(performance.now() / 1000) // drawn right away; still, for reduced motion
    const compass = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round(clouds.windFrom / 45) % 8]
    note.innerHTML =
      `Cloud ${clouds.total}%  wind ${Math.round(clouds.windKmh)} km/h ${compass}` +
      (kind === 'snow' ? `  snow ${clouds.snow.toFixed(1)} cm` : kind === 'rain' ? `  rain ${clouds.rain.toFixed(1)} mm` : '') +
      `  via <a class="underline underline-offset-2" href="https://open-meteo.com/">Open-Meteo</a>`
  })
}

function nextPeak() {
  peakIndex = (peakIndex + 1) % peaks.length
  showPeak(peaks[peakIndex])
}

showPeak(peak, true)
// After the sky and mountain are built, fade the rest of the page in (index.html hid it before the first paint)
setTimeout(() => document.documentElement.classList.remove('intro'), reduceMotion ? 0 : FADE_IN_AT)
// The rain only plays once; after it, swapping peaks draws the mountain straight away
setTimeout(() => document.documentElement.style.setProperty('--intro', '0ms'), INTRO_DONE_AT)

// Redraw the sky when the poster changes size (rotating a phone, resizing a window)
let resizeTimer = 0
addEventListener('resize', () => {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => {
    drawSky(peaks[peakIndex], false)
    showLight(peaks[peakIndex])
    showClouds(peaks[peakIndex])
  }, 200)
})

// Stop the twinkling while the poster is scrolled out of view
const poster = document.querySelector('header .draw')!
new IntersectionObserver(([entry]) => poster.classList.toggle('paused', !entry.isIntersecting)).observe(poster)
document.querySelector('#next-peak')!.addEventListener('click', nextPeak)
document.querySelector('#peak-art')!.addEventListener('click', nextPeak)

// Depth parallax: as the poster scrolls away, the stars and far ranges drift slowest, the peak's range a bit
// faster, and the foothills move with the page. Pixels per full poster height of scroll; tune here.
const DRIFT = { stars: 90, clouds: 70, far: 55, mid: 25, near: 0 }
if (!reduceMotion) {
  const posterEl = document.querySelector<HTMLElement>('header .draw')!
  let queued = false
  const drift = () => {
    queued = false
    const progress = Math.min(1, Math.max(0, -posterEl.getBoundingClientRect().top / posterEl.offsetHeight))
    const move = (sel: string, px: number) =>
      document.querySelectorAll<HTMLElement>(sel).forEach(el => (el.style.translate = `0 ${(progress * px).toFixed(1)}px`))
    move('#sky, #aurora, #meteors', DRIFT.stars)
    move('#clouds', DRIFT.clouds)
    move('#peak-art [data-depth="far"]', DRIFT.far)
    move('#peak-art [data-depth="mid"]', DRIFT.mid)
  }
  addEventListener('scroll', () => queued || (queued = requestAnimationFrame(drift) > 0), { passive: true })
}

// The status panel runs its command the first time it scrolls into view: `status --all` types out, then
// each readout prints on its own beat. The text is in the page from the start (screen readers get it all);
// only its appearance is staged. Skipped for reduced motion.
if (!reduceMotion) {
  const cmd = document.querySelector<HTMLElement>('#status-cmd')!
  const lines = [...document.querySelectorAll<HTMLElement>('main dl > div'), document.querySelector<HTMLElement>('#status-end')!]
  const text = cmd.textContent!
  cmd.textContent = ''
  lines.forEach(l => l.classList.add('pending'))
  const show = () => {
    cmd.textContent = text
    lines.forEach(l => l.classList.remove('pending'))
  }
  new IntersectionObserver((entries, watcher) => {
    if (!entries[0].isIntersecting) return
    watcher.disconnect()
    let i = 0
    const type = setInterval(() => {
      cmd.textContent = text.slice(0, ++i)
      if (i < text.length) return
      clearInterval(type)
      lines.forEach((line, n) => setTimeout(() => line.classList.remove('pending'), 250 + n * 140))
    }, 55)
    setTimeout(show, 4000) // safety net: everything shows even if timers are throttled
  }, { threshold: 0.4 }).observe(document.querySelector('main dl')!)
}

// Live Pacific time for the status panel
const clock = document.querySelector<HTMLElement>('#clock')!
const time = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/Los_Angeles',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
})
const tick = () => (clock.textContent = `${time.format(new Date())} PT`)
tick()
setInterval(tick, 1000)

// Dark mode toggle: an on/off switch labelled "Dark", with a square that fills when it's on.
// The starting theme is set in index.html before the page draws.
const toggle = document.querySelector<HTMLButtonElement>('#theme-toggle')!
const box = toggle.querySelector('span')!
const html = document.documentElement
const show = () => {
  const dark = html.dataset.theme === 'sverige-dark'
  toggle.setAttribute('aria-pressed', String(dark))
  box.classList.toggle('bg-current', dark)
}
show()
toggle.addEventListener('click', () => {
  html.dataset.theme = html.dataset.theme === 'sverige-dark' ? 'sverige' : 'sverige-dark'
  try { localStorage.setItem('theme', html.dataset.theme) } catch {}
  show()
})
