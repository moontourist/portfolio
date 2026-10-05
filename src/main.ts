import './style.css'
import { profile, status, crafts, projects, links } from './data'
import { logo, landscape, barcode, crosshair, icon } from './art'
import { peaks } from './peaks'

// Filled in at build time by vite.config.ts
declare const __COMMIT__: string
declare const __BUILT__: string

// A different Washington peak on every visit; "Next peak" moves through the rest
let peakIndex = Math.floor(Math.random() * peaks.length)
const peak = peaks[peakIndex]
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches

// A faint ASCII starfield across the poster, wide enough for any screen
const starfield = Array.from({ length: 40 }, () =>
  Array.from({ length: Math.ceil(screen.width / 7) + 20 }, () =>
    Math.random() < 0.025 ? '.+*'[Math.floor(Math.random() * 3)] : ' ',
  ).join(''),
).join('\n')

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

  <nav class="navbar gap-1 border-b border-base-300 px-6 md:px-12">
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
    <div class="draw relative overflow-hidden bg-(--poster-sky) text-(--poster-ink) md:pb-44">
      <pre aria-hidden="true" class="pointer-events-none absolute inset-0 overflow-hidden font-mono text-xs leading-5 text-(--poster-star) opacity-40">${starfield}</pre>
      ${corners}
      <div class="relative max-w-4xl px-6 pt-16 md:px-12">
        <p class="readout"><span id="coords" aria-hidden="true"></span><span id="coords-sr" class="sr-only"></span></p>
        <h1 class="display mt-6 text-7xl text-(--poster-name) sm:text-9xl">${profile.name.replace(' ', '<br>')}</h1>
        <p class="mt-8 max-w-md text-lg">${profile.role} at ${profile.company}, based in ${profile.location}.</p>
      </div>
      <!-- Phones: the peak follows the text, edge to edge. From 768px it stands at the poster's bottom right, on the strip. -->
      <div id="peak-art" aria-hidden="true" class="relative mt-8 w-full cursor-pointer text-(--poster-ground) md:absolute md:right-0 md:bottom-0 md:mt-0 md:w-[min(44rem,55%)]"></div>
    </div>
    <div class="draw flex items-center justify-between gap-6 bg-(--poster-ground) px-6 py-3 text-white md:px-12">
      <div class="flex flex-wrap items-center gap-x-5 gap-y-1">
        <p id="peak-name" aria-live="polite" class="readout opacity-100"></p>
        <button id="next-peak" type="button" class="readout inline-flex items-center underline underline-offset-4 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current pointer-coarse:min-h-11">Next peak</button>
      </div>
      <span id="barcode" aria-hidden="true" class="barcode hidden h-5 w-40 shrink-0 sm:block"></span>
    </div>
  </header>

  <main id="main" tabindex="-1" class="max-w-4xl px-6 outline-none md:px-12">

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

  <footer class="flex flex-wrap items-center justify-between gap-4 border-t border-base-300 px-6 py-8 text-sm md:px-12">
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
    const progress = Math.min(1, (performance.now() - start) / 700)
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
  }, 900)
}

// Put a peak into the poster. New elements replay the draw-in animation from style.css.
function showPeak(p: (typeof peaks)[number]) {
  const coords = `${p.lat.toFixed(4)}° N  ${p.lon.toFixed(4)}° W`
  scramble(document.querySelector<HTMLElement>('#coords')!, coords)
  document.querySelector('#coords-sr')!.textContent = coords
  document.querySelector('#peak-art')!.innerHTML = landscape(p.grid)
  document.querySelector('#peak-name')!.textContent = `${p.name}  ${p.metres} m / ${p.feet} ft`
  document.querySelector('#barcode')!.innerHTML = barcode(p.name)
  // Same safety net for the draw-in: once it should be over, jump any unfinished animation to its end
  setTimeout(() => document.querySelectorAll('.draw').forEach(el => el.getAnimations({ subtree: true }).forEach(a => a.finish())), 1500)
}

function nextPeak() {
  peakIndex = (peakIndex + 1) % peaks.length
  showPeak(peaks[peakIndex])
}

showPeak(peak)
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
