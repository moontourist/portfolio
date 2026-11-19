// All site content lives here. Edit this file to change what the page says.

import type { IconName } from './art'

export type Craft = {
  name: string
  icon: IconName // pixel icon drawn in src/art.ts
  detail: string
  link?: { label: string; url: string }
  sample?: string[] // real program output, shown as a terminal still
}
export type ProjectStatus = 'complete' | 'active'
export type Project = {
  name: string
  status: ProjectStatus
  description: string
  url?: string
  note?: string // shown instead of a source link, e.g. for private repos
  links?: { label: string; url: string }[] // extra links shown after the source link, e.g. a live site
  image?: string // banner in public/, shown as a card at the top of Projects (1920x520 logos, drawn at 960 wide)
}

export const profile = {
  name: 'Matt Erickson',
  role: 'Infrastructure Engineer',
  company: 'Halo',
  location: 'Washington state',
  // Facts live in crafts below, so this is the why.
  bio: "I keep production running at Halo, and write software on the side, lately audio plugins and a window manager in Rust. I came up through audio engineering, and I'm building toward a game: the one project that needs all of it. Sound, systems, code and an eye for a frame.",
}

// Readouts for the status panel. The status light, last deploy date, commit and local time are added in main.ts.
export const status = [
  { label: 'Next deploy', value: 'First game' },
]

// One line per craft, in your own words. Order is the order on the page.
export const crafts: Craft[] = [
  {
    name: 'Infrastructure',
    icon: 'rack',
    detail: "My day job at Halo. AWS, Kubernetes and Datadog: keeping systems up, and knowing first when they aren't.",
  },
  {
    name: 'Code',
    icon: 'terminal',
    detail: 'Rust for audio plugins and a macOS window manager, C# for Advent of Code and small tools that save me clicks at work. Written in Neovim, run in Ghostty.',
  },
  {
    name: 'Audio',
    icon: 'wave',
    detail: 'Pro Tools and Ableton are still where I spend studio time, and now I build plugins for them: thunk for drums, seethe for dungeon synth.',
  },
  {
    name: 'Photography',
    icon: 'camera',
    detail: 'Usually behind a camera when I step away from the keyboard, chasing the right light.',
    link: { label: 'See photos on Instagram', url: 'https://instagram.com/moon.tourist' },
  },
  {
    name: 'Games',
    icon: 'gamepad',
    detail: 'cardatro is the first one, a card game in the terminal. Its output so far is under About.',
    sample: [
      '---------------------',
      'Ace of Spades',
      'chips: 11',
      'Queen of Hearts',
      'chips: 10',
      'Seven of Clubs',
      'chips: 7',
      'Two of Diamonds',
      'chips: 2',
      '---------------------',
      'Select Cards 0-7:',
    ],
  },
]

export const projects: Project[] = [
  {
    name: 'seethe',
    status: 'active',
    image: '/projects/seethe.png',
    description: 'A synth plugin (VST3/CLAP) for old game sounds and dungeon synth, in Rust. Presets rebuilt from Super Mario 64 and Donkey Kong Country, plus crypt choirs and castle organs.',
    // url: 'https://github.com/moontourist/seethe', // add back when the repo goes public
  },
  {
    name: 'thunk',
    status: 'active',
    image: '/projects/thunk.png',
    description: 'A drum bus plugin (VST3/CLAP) for any DAW, in Rust: drive, grit, snap and a low-end thump tuned to your kick.',
    // url: 'https://github.com/moontourist/thunk', // add back when the repo goes public
  },
  {
    name: 'wave',
    status: 'active',
    image: '/projects/wave.png',
    description: 'A tiling window manager for macOS with smooth animations, in Rust. Built on rift.',
    url: 'https://github.com/moontourist/wave',
  },
  {
    name: 'tascii',
    status: 'active',
    description: "A minimalist ASCII to-do list for Chrome's side panel.",
    url: 'https://github.com/moontourist/tascii',
    links: [
      { label: 'Try it at tascii-list.com', url: 'https://tascii-list.com' },
      // { label: 'Get it on the Chrome Web Store', url: '' }, // add once the listing is approved
    ],
  },
  {
    name: 'cardatro',
    status: 'active',
    description: 'A terminal card game in C#, inspired by Balatro.',
    note: 'Private for now',
  },
  {
    name: 'this site',
    status: 'active',
    description: 'TypeScript, Vite, Tailwind and DaisyUI. Real terrain, stars and live weather, all drawn in ASCII.',
    url: 'https://github.com/moontourist/portfolio',
  },
]

// nav: true also shows the link in the top bar; phone: true keeps it there on narrow screens.
// Every link shows in the footer, using footer text when it's set.
export const links = [
  { name: 'Email', url: 'mailto:matthewgaryerickson@gmail.com', nav: true, phone: true, footer: 'matthewgaryerickson@gmail.com' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/matthewg-erickson', nav: true },
  { name: 'GitHub', url: 'https://github.com/moontourist', nav: true },
  { name: 'Instagram', url: 'https://instagram.com/moon.tourist', nav: false },
]
