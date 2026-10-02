import './style.css'
import { character, stats, equipment, quests, links } from './data'
import { logo } from './logo'

document.querySelector<HTMLLinkElement>('link[rel=icon]')!.href =
  'data:image/svg+xml,' + encodeURIComponent(logo())

// A faint ASCII starfield behind the hero
const starfield = Array.from({ length: 14 }, () =>
  Array.from({ length: 90 }, () => (Math.random() < 0.03 ? '.+*'[Math.floor(Math.random() * 3)] : ' ')).join(''),
).join('\n')

const section = (num: string, title: string, body: string) => `
  <section class="border-t border-base-300 py-12">
    <p class="label mb-6">${num} // ${title}</p>
    ${body}
  </section>`

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <nav class="navbar border-b border-base-300 px-4">
    <a href="/" class="flex flex-1 items-center gap-3">
      <span class="w-10">${logo()}</span>
      <span class="font-mono text-sm tracking-widest">MOONTOURIST</span>
    </a>
    ${links.map(l => `<a class="btn btn-ghost btn-sm font-mono" href="${l.url}">${l.name}</a>`).join('')}
  </nav>

  <main class="mx-auto max-w-4xl px-4">
    <header class="relative grid items-center gap-10 py-20 md:grid-cols-[1fr_auto]">
      <pre aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10 overflow-hidden font-mono text-xs leading-5 opacity-30">${starfield}</pre>
      <div>
        <p class="label mb-4">01 // Character</p>
        <h1 class="display text-5xl sm:text-7xl">${character.name.replace(' ', '<br>')}</h1>
        <dl class="mt-8 grid grid-cols-[max-content_1fr] gap-x-8 gap-y-2">
          <dt class="label self-center">Class</dt><dd class="font-semibold">${character.class}</dd>
          <dt class="label self-center">Guild</dt><dd class="font-semibold">${character.guild}</dd>
          <dt class="label self-center">Location</dt><dd class="font-semibold">${character.location}</dd>
        </dl>
      </div>
      <div class="hidden w-56 md:block">${logo()}</div>
    </header>

    ${section('02', 'About', `<p class="max-w-2xl text-lg leading-relaxed">${character.bio}</p>`)}

    ${section('03', 'Stats', `
      <div class="grid gap-x-12 gap-y-5 sm:grid-cols-2">
        ${stats.map(s => `
          <div>
            <div class="mb-1 flex justify-between font-mono text-sm"><span>${s.name}</span><span class="opacity-60">${s.level}</span></div>
            <progress class="progress progress-primary h-2" value="${s.level}" max="100"></progress>
          </div>`).join('')}
      </div>
      <p class="label mt-10 mb-3">Equipment</p>
      <div class="flex flex-wrap gap-2">
        ${equipment.map(e => `<span class="badge badge-outline font-mono">${e}</span>`).join('')}
      </div>`)}

    ${section('04', 'Quest log', `
      <div class="grid gap-4 sm:grid-cols-2">
        ${quests.map(q => `
          <article class="card border border-base-300 bg-base-100">
            <div class="card-body">
              <div class="flex items-center justify-between gap-2">
                <h2 class="card-title font-mono">${q.name}</h2>
                <span class="badge ${q.status === 'complete' ? 'badge-success' : 'badge-secondary'} font-mono text-xs uppercase">${q.status}</span>
              </div>
              <p class="opacity-80">${q.description}</p>
              ${q.url ? `<div class="card-actions mt-2"><a class="link link-primary font-mono text-sm" href="${q.url}">[ source ]</a></div>` : ''}
            </div>
          </article>`).join('')}
      </div>`)}
  </main>

  <footer class="footer footer-center border-t border-base-300 p-8 font-mono text-xs opacity-60">
    <p>-- matt-erickson.io // made in washington --</p>
  </footer>
`
