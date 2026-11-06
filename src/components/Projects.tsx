import { assets, links } from '../lib/assets'
import { ProjectDeck, type Project } from './ProjectDeck'
import { SectionTitle } from './ui'

const projects: Project[] = [
  {
    file: 'citracker.apk',
    title: 'CiTracker App',
    role: 'UI Designer, Android Developer',
    description:
      'An Android app, part of our thesis, that lets students join classes, take attendance through QR or NFC, submit concerns and view their grade breakdown.',
    tags: ['Android', 'UI Design', 'QR & NFC', 'Thesis'],
    image: { src: assets.projectCitracker, alt: 'CiTracker app screens: the sign-in page and the student home dashboard' },
    links: [],
    note: 'Link coming soon!',
  },
  {
    file: 'shallow-sleep.png',
    title: 'Shallow Sleep Game',
    role: 'Sprite Designer',
    description: 'A game where I was tasked with designing and drawing pixelated assets.',
    tags: ['Pixel Art', 'Sprites', 'Game Art'],
    image: { src: assets.projectShallowSleepRoom, alt: 'Shallow Sleep background: a hospital room with a bed, monitor and curtained window' },
    gallery: [
      { src: assets.projectShallowSleepLobby, alt: 'Hospital lobby background with a reception desk, vending machine and elevator' },
      { src: assets.projectShallowSleepDoctor, alt: 'Character sprite: a many-eyed doctor creature in a bloodied lab coat' },
      { src: assets.projectShallowSleepDoll, alt: 'Character sprite: a doll-like girl with button eyes and a stitched mouth' },
    ],
    links: [{ label: 'View Assets', href: links.projects.shallowSleepAssets }],
  },
  {
    file: 'portfolio.html',
    title: 'OJT Portfolio Website',
    role: 'UI/UX Designer, Front-End Developer',
    description:
      'The site you’re on: a retro-desktop portfolio I sketched, designed and built myself with React, TypeScript, Vite and Tailwind CSS.',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'UI/UX'],
    image: { src: assets.projectPortfolio, alt: 'This portfolio’s opening screen: the “AA, open for internships!” card on the retro desktop' },
    links: [{ label: 'Source on GitHub', href: links.projects.portfolioSource }],
    note: 'You’re looking at it!',
  },
]

export function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-title" className="relative px-[10px] md:px-10">
      <div className="mx-auto max-w-[1261px]">
        {/* The heading is drawn inside the deck, centred behind the cards, which cover it as they come in. */}
        <ProjectDeck projects={projects} heading={<SectionTitle id="projects-title" accent="Projects" size="display" />} />
      </div>
    </section>
  )
}
