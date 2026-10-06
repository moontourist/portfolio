# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

A mixed, low-pressure audience, all confirmed:

- Coworkers and peers: engineers who know Matt or meet him and want to see what he builds.
- The game dev community: people he will meet as he moves into making games (jams, devlogs, collaborators).
- Recruiters and hiring managers: someone looking him up, not someone he is actively pitching to.
- Friends, and Matt himself: it is also his personal corner of the internet.

None of them arrive with a task to complete. They are getting a sense of who he is.

## Product Purpose

The personal site of Matt Erickson (matt-erickson.io): an infrastructure engineer at Halo, based in Washington state, who is learning C# and building toward making his own game. It is a long-term presence that grows with his projects, not a job-hunt landing page. He is not looking for work. Success is a visitor leaving with a clear, memorable sense of him and an easy way to reach him.

## Positioning

A creative technologist: one person across several crafts. By day he runs infrastructure (AWS, Kubernetes, Datadog). On the side he writes software in C# and is heading toward game dev. He trained as an audio engineer (Pro Tools, Ableton) and shoots photography. The site should read as all of these at once, not as an infra résumé with hobbies attached.

## Operating Context

- Matt edits the site himself. He reads C# well, which is why the code is TypeScript. All copy lives in `src/data.ts` so he can change content without touching layout.
- Every push to `main` deploys to Cloudflare Pages.
- Projects arrive slowly: Advent of Code, small tools for work, and eventually a game.

## Capabilities and Constraints

- Single page: profile, about, projects, crafts (infrastructure, code, audio, photography, games), a status panel, and contact links (email, LinkedIn, GitHub, Instagram). The email address is shown in the footer as text.
- Link previews use `public/og.png`, a screenshot of the poster. A plain fallback shows when JavaScript is off.
- The header shows a randomly chosen Washington peak on each visit, drawn from real elevation data, under its real current sky: light from the sun's position, the real stars, live cloud cover and wind from Open-Meteo (rain and snow in the readout), shooting stars on real meteor-shower nights, and the northern lights when NOAA's geomagnetic index says they're visible. `?peak=` picks a mountain, `?at=` previews any moment.
- Light and dark themes with a toggle.
- Undecided: whether photography gets its own section (no photos are on the site yet).

## Brand Commitments

- Name and handle: Matt Erickson / moontourist (GitHub `moontourist`, Instagram `moon.tourist`).
- Voice: plain, first-person, sentence case. Tasteful, not jokey.
- Binding references Matt chose: Swedish blue and yellow (he is Swedish American), Marathon (Bungie) UI art style, a touch of ASCII and pixel art, terminal touches, Times New Roman italic display type, JetBrains Mono (his terminal font).
- Rejected, do not reintroduce: gamer or RPG wording (guild, quest, character, stats, equipment), Japanese text or subtitles, NES.css, a moon beside the mountain.

## Evidence on Hand

- Projects: `tascii` (public, github.com/moontourist/tascii) and `cardatro` (private terminal card game in C#). The Games craft shows an excerpt of cardatro's real console output (a dealt hand with chip values, then "Select Cards 0-7:"); keep it matching what the program actually prints.
- Contact: matthewgaryerickson@gmail.com, linkedin.com/in/matthewg-erickson.
- Absences, do not fabricate: no testimonials, metrics, employers beyond Halo, or photos yet. The craft lines in `src/data.ts` are drafts from Matt's own words and facts; reword them freely. `sharpmas` was built by a friend (Scotty / scadoshi) and must never be presented as Matt's work.

## Product Principles

1. Real work only. A short, true project list beats a padded one; never invent claims to fill space.
2. Personality is the point. When a pass makes the site cleaner but blander, it has failed; keep the distinct look.
3. Many crafts, one person. Infra, code, audio and photography should all feel at home, with games as the direction of travel.
4. Built to grow. New projects, and later photos or a game, should slot in without a redesign.
5. Matt can edit it. Keep content in data and the code readable to someone who knows C#.
