import './style.css'
import { profile, status, crafts, projects, links } from './data'
import { logo, landscape, barcode, crosshair, icon } from './art'
import { peaks } from './peaks'
import { skyAbove } from './sky'

// Filled in at build time by vite.config.ts
declare const __COMMIT__: string
declare const __BUILT__: string

// A different Washington peak on every visit; "Next peak" moves through the rest
let peakIndex = Math.floor(Math.random() * peaks.length)
const peak = peaks[peakIndex]
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches

// First-load timeline (ms). The rain builds the sky, the mountain draws in, then the rest of the page fades in.
// The matching mountain/barcode delays live in style.css (--intro). Slow everything down by raising these together.
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
  for (const s of skyAbove(p.lat, p.lon, new Date(), grid, p.look)) lines[s.row][s.col] = star(s.char, s.row, rain)
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
// The first section skips its top rule, since the navy strip already closes the poster.
const section = (title: string, body: string) => `
  <section class="border-t border-base-300 py-14 first:border-t-0">
    <h2 class="display mb-8 border-l-4 border-secondary pl-4 text-4xl sm:text-5xl">${title}</h2>
    ${body}
  </section>`

// A shell prompt line for the terminal panel (decorative, so hidden from screen readers)
const prompt = (command: string) => `
  <p aria-hidden="true" class="font-mono text-sm">
    <span class="text-primary">matt@baker</span><span class="opacity-75">:~$</span> ${command}
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
    <div class="draw relative overflow-hidden bg-(--poster-sky) text-(--poster-ink) md:pb-56">
      <pre id="sky" aria-hidden="true" class="pointer-events-none absolute inset-0 overflow-hidden font-mono text-xs leading-5 text-(--poster-star) opacity-60"></pre>
      <div class="intro-fade">${corners}</div>
      <div class="intro-fade relative max-w-4xl px-6 pt-16 md:px-12">
        <p class="readout"><span id="coords" aria-hidden="true"></span><span id="coords-sr" class="sr-only"></span></p>
        <p id="sky-note" class="readout mt-1"></p>
        <h1 class="display mt-6 text-7xl text-(--poster-name) sm:text-9xl">${profile.name.replace(' ', '<br>')}</h1>
        <p class="mt-8 max-w-md text-lg">${profile.role} at ${profile.company}, based in ${profile.location}.</p>
      </div>
      <!-- Phones: the peak follows the text, edge to edge. From 768px it stands at the poster's bottom right, on the strip. -->
      <div id="peak-art" aria-hidden="true" class="relative mt-8 w-full cursor-pointer text-(--poster-ground) md:absolute md:right-0 md:bottom-0 md:mt-0 md:w-[min(44rem,55%)]"></div>
    </div>
    <div class="draw flex items-center justify-between gap-6 bg-(--poster-ground) px-6 py-3 text-white md:px-12">
      <div class="intro-fade flex flex-wrap items-center gap-x-5 gap-y-1">
        <p id="peak-name" aria-live="polite" class="readout opacity-100"></p>
        <button id="next-peak" type="button" class="readout inline-flex items-center underline underline-offset-4 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current pointer-coarse:min-h-11">Next peak</button>
      </div>
      <span id="barcode" aria-hidden="true" class="intro-fade barcode hidden h-5 w-40 shrink-0 sm:block"></span>
    </div>
  </header>

  <main id="main" tabindex="-1" class="intro-fade max-w-4xl px-6 outline-none md:px-12">

    ${section('About', `<p class="max-w-2xl text-lg leading-relaxed">${profile.bio}</p>`)}

    ${section('Projects', `
      <ul class="max-w-2xl">
        ${projects.map(p => `
          <li class="border-b border-base-300 py-5 first:pt-0 last:border-b-0 last:pb-0">
            <div class="flex items-baseline justify-between gap-4">
              <h3 class="font-mono text-lg font-medium">${p.name}</h3>
              ${mixedStatus && p.status === 'active' ? '<span class="badge badge-secondary badge-sm">In progress</span>' : ''}
            </div>
            <p class="mt-1 opacity-80">${p.description}</p>
            ${p.url ? `<a class="link link-primary mt-2 inline-block text-sm" href="${p.url}">View source on GitHub</a>` : ''}
            ${p.note ? `<p class="readout mt-2">${p.note}</p>` : ''}
          </li>`).join('')}
      </ul>`)}

    ${section('Crafts', `
      <ul class="grid max-w-2xl gap-8">
        ${crafts.map(c => `
          <li class="grid grid-cols-[2.5rem_1fr] gap-x-5">
            <span aria-hidden="true" class="mt-1 size-10">${icon(c.icon)}</span>
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

    ${section('Status', `
      <div class="notch border border-base-300 bg-base-200">
        <div class="border-b border-base-300 px-5 py-3">${prompt('status --all')}</div>
        <div class="grid grid-cols-2 gap-px bg-base-300 sm:grid-cols-3">
          ${[
            { label: 'System', value: '<span class="status status-success"></span> Nominal' },
            ...status,
            { label: 'Last deploy', value: __BUILT__ },
            { label: 'Commit', value: __COMMIT__ },
            { label: 'Local time', value: '<span id="clock"></span>' },
          ].map(s => `
            <div class="flex flex-col items-center gap-2 bg-base-200 p-6 text-center">
              <p class="readout">${s.label}</p>
              <p class="flex items-center gap-2 font-mono">${s.value}</p>
            </div>`).join('')}
        </div>
        <div class="border-t border-base-300 px-5 py-3">${prompt('<span class="cursor"></span>')}</div>
      </div>`)}
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
  document.querySelector('#sky-note')!.textContent = `The real sky behind it right now, looking ${p.look}`
  document.querySelector('#peak-art')!.innerHTML = landscape(p.grid)
  document.querySelector('#peak-name')!.textContent = `${p.name}  ${p.metres} m / ${p.feet} ft`
  document.querySelector('#barcode')!.innerHTML = barcode(p.name)
  // Same safety net for the draw-in: once it should be over, jump the poster's animations to their end
  setTimeout(() => document.querySelectorAll('header .draw').forEach(finishAll), first ? INTRO_DONE_AT : 2200)
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
  resizeTimer = setTimeout(() => drawSky(peaks[peakIndex], false), 200)
})

// Stop the twinkling while the poster is scrolled out of view
const poster = document.querySelector('header .draw')!
new IntersectionObserver(([entry]) => poster.classList.toggle('paused', !entry.isIntersecting)).observe(poster)
document.querySelector('#next-peak')!.addEventListener('click', nextPeak)
document.querySelector('#peak-art')!.addEventListener('click', nextPeak)

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
