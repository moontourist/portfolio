// All site content lives here. Edit this file to change what the page says.

import type { IconName } from './art'

export type Craft = {
  name: string
  icon: IconName // pixel icon drawn in src/art.ts
  detail: string
  link?: { label: string; url: string }
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
  bio: "By day I keep the infrastructure running at Halo, living in AWS, Kubernetes and Datadog. On the side I'm learning C#, one small program at a time, working toward building a game of my own. Before all that I trained as an audio engineer, and when I'm away from the keyboard I'm usually behind a camera.",
}

// Readouts for the status panel. The status light, this visit's peak and local time are added in main.ts.
export const status = [
  { label: 'Region', value: 'Washington, US' },
  { label: 'Current build', value: 'C# via Advent of Code' },
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
    detail: 'Learning C# one small program at a time, mostly Advent of Code and tools that save me clicks at work. Written in Neovim, run in Ghostty.',
  },
  {
    name: 'Audio',
    icon: 'wave',
    detail: 'Trained as an audio engineer. Pro Tools and Ableton are still where I spend studio time.',
  },
  {
    name: 'Photography',
    icon: 'camera',
    detail: "When I'm away from the keyboard I'm usually behind a camera, chasing the right light.",
    link: { label: 'See photos on Instagram', url: 'https://instagram.com/moon.tourist' },
  },
  {
    name: 'Games',
    icon: 'gamepad',
    detail: 'Where all of this is heading. cardatro, a terminal card game in C#, is the first step.',
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
