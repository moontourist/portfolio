// All site content lives here. Edit this file to change what the page says.

export type Skill = { name: string; level: number } // level: 0-100
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
  { label: 'Region', value: 'us-west // Washington' },
  { label: 'Current build', value: 'C# via Advent of Code' },
  { label: 'Next deploy', value: 'First game' },
]

export const skills: Skill[] = [
  { name: 'AWS', level: 80 },
  { name: 'Kubernetes', level: 70 },
  { name: 'Datadog', level: 75 },
  { name: 'C#', level: 35 },
]

export const tools: string[] = ['Neovim', 'Ghostty', 'Pro Tools', 'Ableton', 'Camera']

export const projects: Project[] = [
  {
    name: 'sharpmas',
    status: 'active',
    description: 'Advent of Code tooling in C#: downloads puzzle inputs, runs solutions, checks answers and submits them for stars.',
    url: 'https://github.com/moontourist/sharpmas',
  },
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

export const links = [
  { name: 'GitHub', url: 'https://github.com/moontourist' },
  { name: 'Instagram', url: 'https://instagram.com/moon.tourist' },
]
