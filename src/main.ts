import './style.css'
import { profile, status, skills, tools, projects, links } from './data'
import { logo, landscape, barcode, crosshair } from './art'
import { peaks } from './peaks'

document.querySelector<HTMLLinkElement>('link[rel=icon]')!.href =
  'data:image/svg+xml,' + encodeURIComponent(logo())

// A different Washington peak on every visit
const peak = peaks[Math.floor(Math.random() * peaks.length)]

// A faint ASCII starfield across the poster
const starfield = Array.from({ length: 24 }, () =>
  Array.from({ length: 180 }, () => (Math.random() < 0.025 ? '.+*'[Math.floor(Math.random() * 3)] : ' ')).join(''),
).join('\n')

// Crosshairs pinned to each corner of a block
const corners = ['top-3 left-3', 'top-3 right-3', 'bottom-3 left-3', 'bottom-3 right-3']
  .map(pos => `<span aria-hidden="true" class="absolute ${pos}">${crosshair}</span>`)
  .join('')

// Section heading: squashed serif with a yellow bar. Kept smaller than the hero name.
const section = (title: string, body: string) => `
  <section class="border-t border-base-300 py-14">
    <h2 class="display mb-8 border-l-4 border-secondary pl-4 text-4xl sm:text-5xl">${title}</h2>
    ${body}
  </section>`

// A shell prompt line for the terminal panel
const prompt = (command: string) => `
  <p aria-hidden="true" class="font-mono text-sm">
    <span class="text-primary">matt@baker</span><span class="opacity-75">:~$</span> ${command}
  </p>`

// Only tag projects "In progress" when some are finished, otherwise the tag says nothing
const mixedStatus = new Set(projects.map(p => p.status)).size > 1

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
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

  <header class="relative overflow-hidden bg-secondary text-secondary-content">
    <pre aria-hidden="true" class="pointer-events-none absolute inset-0 overflow-hidden font-mono text-xs leading-5 opacity-40">${starfield}</pre>
    ${corners}
    <div class="relative max-w-4xl px-6 pt-16 md:px-12">
      <p class="readout">${peak.lat.toFixed(4)}° N  ${peak.lon.toFixed(4)}° W</p>
      <h1 class="display mt-6 text-7xl sm:text-9xl">${profile.name.replace(' ', '<br>')}</h1>
      <p class="mt-8 max-w-md text-lg">${profile.role} at ${profile.company}, based in ${profile.location}.</p>
      <div aria-hidden="true" class="mt-6 ml-auto w-full max-w-xl text-accent">${landscape(peak.grid)}</div>
    </div>
    <div class="relative flex items-center justify-between gap-6 bg-accent px-6 py-3 text-accent-content md:px-12">
      <p class="readout opacity-100">${peak.name}  ${peak.metres} m / ${peak.feet} ft</p>
      <span aria-hidden="true" class="hidden h-5 w-40 shrink-0 sm:block">${barcode(peak.name)}</span>
    </div>
  </header>

  <main class="max-w-4xl px-6 md:px-12">

    ${section('About', `<p class="max-w-2xl text-lg leading-relaxed">${profile.bio}</p>`)}

    ${section('Projects', `
      <ul class="max-w-2xl">
        ${projects.map(p => `
          <li class="border-b border-base-300 py-5 first:pt-0">
            <div class="flex items-baseline justify-between gap-4">
              <h3 class="font-mono text-lg font-medium">${p.name}</h3>
              ${mixedStatus && p.status === 'active' ? '<span class="badge badge-secondary badge-sm">In progress</span>' : ''}
            </div>
            <p class="mt-1 opacity-80">${p.description}</p>
            ${p.url ? `<a class="link link-primary mt-2 inline-block text-sm" href="${p.url}">View source on GitHub</a>` : ''}
          </li>`).join('')}
      </ul>`)}

    ${section('Skills', `
      <dl class="grid max-w-2xl gap-x-10 gap-y-1 sm:grid-cols-[max-content_1fr] sm:gap-y-5">
        ${skills.map(s => `<dt class="font-semibold">${s.name}</dt><dd class="mb-4 opacity-80 sm:mb-0">${s.detail}</dd>`).join('')}
      </dl>
      <p class="mt-10 max-w-2xl opacity-80">Outside of work I spend my time in ${tools.slice(0, -1).join(', ')} and ${tools.at(-1)}.</p>`)}

    ${section('Status', `
      <div class="notch border border-base-300 bg-base-200">
        <div class="border-b border-base-300 px-5 py-3">${prompt('status --all')}</div>
        <div class="grid grid-cols-2 sm:grid-cols-3">
          ${[
            { label: 'System', value: '<span class="status status-success"></span> Nominal' },
            ...status,
            { label: 'Local time', value: '<span id="clock"></span>' },
          ].map(s => `
            <div class="flex flex-col items-center gap-2 border-r border-b border-base-300 p-6 text-center">
              <p class="readout">${s.label}</p>
              <p class="flex items-center gap-2 font-mono">${s.value}</p>
            </div>`).join('')}
        </div>
        <div class="px-5 py-3">${prompt('<span class="cursor"></span>')}</div>
      </div>`)}
  </main>

  <footer class="flex flex-wrap items-center justify-between gap-4 border-t border-base-300 px-6 py-8 text-sm md:px-12">
    <p class="opacity-70">Made in Washington.</p>
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      ${links.map(l => `<a class="link link-hover inline-flex items-center pointer-coarse:min-h-11" href="${l.url}">${l.name}</a>`).join('')}
    </div>
  </footer>
`

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
