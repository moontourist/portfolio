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
}

export const profile = {
  name: 'Matt Erickson',
  role: 'Infrastructure Engineer',
  company: 'Halo',
  location: 'Washington state',
  // Draft by Claude from what Matt has said; rewrite in your own words. Facts live in crafts below, so this is the why.
  bio: "I started out as an audio engineer, ended up running infrastructure, and now I'm learning to write the software myself. A game is where all of that meets: sound, systems, code and an eye for a frame. That's what I'm building toward, one small program at a time.",
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
    detail: 'C#, mostly Advent of Code and small tools that save me clicks at work. Written in Neovim, run in Ghostty.',
  },
  {
    name: 'Audio',
    icon: 'wave',
    detail: 'Pro Tools and Ableton are still where I spend studio time.',
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
    detail: 'cardatro is the first one. This is what it prints so far:',
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
    name: 'tascii',
    status: 'active',
    description: 'A reminder script that speaks in ASCII art.',
    url: 'https://github.com/moontourist/tascii',
  },
  {
    name: 'cardatro',
    status: 'active',
    description: 'A terminal card game in C#, inspired by Balatro.',
    note: 'Private for now',
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
