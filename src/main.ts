import './style.css'
import { profile, status, skills, tools, projects, links } from './data'
import { logo, landscape } from './art'

document.querySelector<HTMLLinkElement>('link[rel=icon]')!.href =
  'data:image/svg+xml,' + encodeURIComponent(logo())

// A faint ASCII starfield behind the hero
const starfield = Array.from({ length: 14 }, () =>
  Array.from({ length: 90 }, () => (Math.random() < 0.03 ? '.+*'[Math.floor(Math.random() * 3)] : ' ')).join(''),
).join('\n')

// Each section opens with an Evangelion-style title card
const section = (num: string, title: string, body: string) => `
  <section class="border-t border-base-300 py-12">
    <div class="mb-8 border-l-4 border-secondary pl-4">
      <p class="label">${num} //</p>
      <h2 class="display text-5xl sm:text-6xl">${title}</h2>
    </div>
    ${body}
  </section>`

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <nav class="navbar border-b border-base-300 px-6 md:px-12">
    <a href="/" class="flex flex-1 items-center gap-3">
      <span class="w-10">${logo()}</span>
      <span class="font-mono text-sm tracking-widest">MOONTOURIST</span>
    </a>
    ${links.map(l => `<a class="btn btn-ghost btn-sm font-mono" href="${l.url}">${l.name}</a>`).join('')}
    <button id="theme-toggle" class="btn btn-ghost btn-sm font-mono"></button>
  </nav>

  <main class="max-w-4xl px-6 md:px-12">
    <header class="relative grid items-center gap-10 pt-20 md:grid-cols-[1fr_auto]">
      <pre aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10 overflow-hidden font-mono text-xs leading-5 opacity-30">${starfield}</pre>
      <div>
        <p class="label mb-4">01 // Profile</p>
        <h1 class="display text-7xl sm:text-9xl">${profile.name.replace(' ', '<br>')}</h1>
        <dl class="mt-8 grid grid-cols-[max-content_1fr] gap-x-8 gap-y-2">
          <dt class="label self-center">Role</dt><dd class="font-semibold">${profile.role}</dd>
          <dt class="label self-center">Company</dt><dd class="font-semibold">${profile.company}</dd>
          <dt class="label self-center">Location</dt><dd class="font-semibold">${profile.location}</dd>
        </dl>
      </div>
      <div class="hidden w-56 md:block">${logo()}</div>
      <div aria-hidden="true" class="ml-auto w-full max-w-xl md:col-span-2">${landscape()}</div>
    </header>

    ${section('02', 'Status', `
      <div class="grid grid-cols-2 border-t border-l border-base-300 sm:grid-cols-3">
        ${[
          { label: 'System', value: '<span class="status status-success animate-pulse"></span> Nominal' },
          ...status,
          { label: 'Local time', value: '<span id="clock"></span>' },
        ].map(s => `
          <div class="flex flex-col items-center gap-2 border-r border-b border-base-300 p-6 text-center">
            <p class="label">${s.label}</p>
            <p class="flex items-center gap-2 font-mono">${s.value}</p>
          </div>`).join('')}
      </div>`)}

    ${section('03', 'About', `<p class="max-w-2xl text-lg leading-relaxed">${profile.bio}</p>`)}

    ${section('04', 'Skills', `
      <div class="grid gap-x-12 gap-y-5 sm:grid-cols-2">
        ${skills.map(s => `
          <div>
            <div class="mb-1 flex justify-between font-mono text-sm"><span>${s.name}</span><span class="opacity-60">${s.level}</span></div>
            <progress class="progress progress-primary h-2" value="${s.level}" max="100"></progress>
          </div>`).join('')}
      </div>
      <p class="label mt-10 mb-3">Tools</p>
      <div class="flex flex-wrap gap-2">
        ${tools.map(e => `<span class="badge badge-outline font-mono">${e}</span>`).join('')}
      </div>`)}

    ${section('05', 'Projects', `
      <div class="grid gap-4 sm:grid-cols-2">
        ${projects.map(q => `
          <article class="card border border-base-300 bg-base-100">
            <div class="card-body">
              <div class="flex items-center justify-between gap-2">
                <h3 class="card-title font-mono">${q.name}</h3>
                <span class="badge ${q.status === 'complete' ? 'badge-success' : 'badge-secondary'} font-mono text-xs uppercase">${q.status}</span>
              </div>
              <p class="opacity-80">${q.description}</p>
              ${q.url ? `<div class="card-actions mt-2"><a class="link link-primary font-mono text-sm" href="${q.url}">[ source ]</a></div>` : ''}
            </div>
          </article>`).join('')}
      </div>`)}
  </main>

  <footer class="footer border-t border-base-300 px-6 py-8 font-mono text-xs opacity-60 md:px-12">
    <p>-- matt-erickson.io // made in washington --</p>
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

// Dark mode toggle. The starting theme is set in index.html before the page draws.
const toggle = document.querySelector<HTMLButtonElement>('#theme-toggle')!
const html = document.documentElement
const label = () => (toggle.textContent = html.dataset.theme === 'sverige-dark' ? '[ LIGHT ]' : '[ DARK ]')
label()
toggle.addEventListener('click', () => {
  html.dataset.theme = html.dataset.theme === 'sverige-dark' ? 'sverige' : 'sverige-dark'
  try { localStorage.setItem('theme', html.dataset.theme) } catch {}
  label()
})
