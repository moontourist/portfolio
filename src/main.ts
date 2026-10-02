import 'nes.css/css/nes.min.css'
import './style.css'
import { character, stats, equipment, quests, links } from './data'

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <section class="nes-container is-dark with-title">
    <p class="title">Character</p>
    <h1>${character.name}</h1>
    <dl class="sheet">
      <dt>Class</dt><dd>${character.class}</dd>
      <dt>Guild</dt><dd>${character.guild}</dd>
      <dt>Location</dt><dd>${character.location}</dd>
    </dl>
    <p>${character.bio}</p>
  </section>

  <section class="nes-container is-dark with-title">
    <p class="title">Stats</p>
    ${stats.map(s => `
      <div class="stat">
        <span>${s.name}</span>
        <progress class="nes-progress is-success" value="${s.level}" max="100"></progress>
      </div>`).join('')}
  </section>

  <section class="nes-container is-dark with-title">
    <p class="title">Equipment</p>
    <ul class="nes-list is-disc">
      ${equipment.map(e => `<li>${e}</li>`).join('')}
    </ul>
  </section>

  <section class="nes-container is-dark with-title">
    <p class="title">Quest Log</p>
    ${quests.map(q => `
      <div class="quest">
        <h2>
          ${q.url ? `<a href="${q.url}">${q.name}</a>` : q.name}
          <span class="nes-text ${q.status === 'complete' ? 'is-success' : 'is-warning'}">[${q.status}]</span>
        </h2>
        <p>${q.description}</p>
      </div>`).join('')}
  </section>

  <footer>
    ${links.map(l => `<a class="nes-btn" href="${l.url}">${l.name}</a>`).join('')}
  </footer>
`
