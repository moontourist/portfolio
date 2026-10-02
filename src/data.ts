// All site content lives here. Edit this file to change what the page says.

export type Skill = { name: string; detail: string }
export type ProjectStatus = 'complete' | 'active'
export type Project = {
  name: string
  status: ProjectStatus
  description: string
  url?: string
}

export const profile = {
  name: 'Matt Erickson',
  role: 'Infrastructure Engineer',
  company: 'Halo',
  location: 'Washington state',
  bio: "By day I keep the infrastructure running at Halo, living in AWS, Kubernetes and Datadog. On the side I'm learning C#, one small program at a time, working toward building a game of my own. Before all that I trained as an audio engineer, and when I'm away from the keyboard I'm usually behind a camera.",
}

// Readouts for the status panel. Local time and the status light are added in main.ts.
export const status = [
  { label: 'Operator', value: 'M. Erickson' },
  { label: 'Region', value: 'Washington, US' },
  { label: 'Current build', value: 'C# via Advent of Code' },
  { label: 'Next deploy', value: 'First game' },
]

export const skills: Skill[] = [
  // Draft wording: rewrite these in your own words
  { name: 'AWS', detail: 'Where most of my day job lives.' },
  { name: 'Kubernetes', detail: 'Deploying, debugging and keeping clusters healthy.' },
  { name: 'Datadog', detail: 'Monitoring and alerting, so I know something broke before anyone else does.' },
  { name: 'C#', detail: 'The language I\'m learning to build software in, through Advent of Code and small tools.' },
]

export const tools: string[] = ['Neovim', 'Ghostty', 'Pro Tools', 'Ableton', 'a camera']

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
  },
]

// nav: true also shows the link in the top bar. Every link shows in the footer.
export const links = [
  { name: 'Email', url: 'mailto:matthewgaryerickson@gmail.com', nav: true },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/matthewg-erickson', nav: true },
  { name: 'GitHub', url: 'https://github.com/moontourist', nav: true },
  { name: 'Instagram', url: 'https://instagram.com/moon.tourist', nav: false },
]
