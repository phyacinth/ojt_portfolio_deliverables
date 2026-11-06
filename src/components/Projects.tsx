import type { ReactNode } from 'react'
import { assets, externalProps, links } from '../lib/assets'
import { ButtonLink, SectionTitle } from './ui'

type Project = {
  title: string
  role: string
  description: string
  tags: string[]
  liveDemo: string
  sourceCode: string
}

const projects: Project[] = [
  {
    title: 'BulSU Website Redesign',
    role: 'UI/UX Designer',
    description:
      'A redesign of the university website focused on clearer navigation and a modern, mobile-friendly layout.',
    tags: ['Figma', 'UI/UX', 'Web Design'],
    ...links.projects.bulsu,
  },
  {
    title: 'Computer Inventory System (Collab)',
    role: 'UI Designer',
    description:
      'A lab inventory system prototype for tracking CIT computer equipment, designed as a group project.',
    tags: ['Figma', 'Prototyping', 'Collaboration'],
    ...links.projects.inventory,
  },
  {
    title: 'Thesis',
    role: '[Your Role]',
    description: '[2–3 sentences about the thesis]',
    tags: ['[Tech]'],
    ...links.projects.thesis,
  },
]

const certificates = [
  { title: 'C++ Certificate', href: links.certificates.cpp },
  { title: 'SQL Basics Course', href: links.certificates.sql },
]

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group flex flex-col gap-4 rounded-[12px] border border-tangerine bg-white/[0.01] p-[18px] transition-[background-color,border-color] duration-300 ease-out hover:border-white hover:bg-butter">
      <div
        role="img"
        aria-label={`${project.title} screenshot placeholder`}
        className="flex aspect-video items-center justify-center rounded-[8px] bg-cream font-babel text-[16px] tracking-[3.2px] text-navy/50"
      >
        Screenshot
      </div>

      <div className="flex items-center gap-[9px] transition-[padding,gap] duration-300 ease-out group-hover:gap-[15px] group-hover:pl-[33px]">
        <span aria-hidden className="flex size-6 shrink-0 items-center justify-center group-hover:hidden">
          <img alt="" src={assets.arrowOrange} width={15.5} height={8.5} className="block max-w-none -rotate-90" />
        </span>
        <h3 className="font-babel text-[20px] leading-[1.6] tracking-[3.6px] text-tangerine group-hover:text-white group-hover:[text-shadow:0px_2px_4px_rgba(0,0,0,0.25)] lg:text-[22px] lg:tracking-[4.4px]">
          {project.title}
        </h3>
        <span aria-hidden className="hidden size-6 shrink-0 items-center justify-center group-hover:flex">
          <img alt="" src={assets.arrowWhite} width={15.5} height={8.5} className="block max-w-none rotate-90" />
        </span>
      </div>

      <p className="font-babel text-[16px] leading-[1.45] tracking-[2.4px] text-cream group-hover:text-navy">
        <span className="text-tangerine group-hover:text-navy">Role:</span> {project.role}
      </p>
      <p className="font-babel text-[16px] leading-[1.8] tracking-[1.6px] text-cream/80 group-hover:text-navy">{project.description}</p>

      <ul aria-label="Technologies" className="flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <li
            key={tag}
            className="rounded-full border border-tangerine px-3 py-[2px] font-babel text-[14px] leading-[1.45] tracking-[1.4px] text-tangerine group-hover:border-navy group-hover:text-navy"
          >
            {tag}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-wrap gap-x-3 gap-y-2 pt-2">
        <ButtonLink href={project.liveDemo}>View Project</ButtonLink>
        <ButtonLink href={project.sourceCode} variant="outline">
          Source / Docs
        </ButtonLink>
      </div>
    </article>
  )
}

function CardShell({ href, className, children }: { href?: string; className: string; children: ReactNode }) {
  if (href) {
    return (
      <a href={href} {...externalProps(href)} className={`${className} cursor-pointer`}>
        {children}
      </a>
    )
  }
  return <div className={className}>{children}</div>
}

function CertificateCard({ title, href }: { title: string; href?: string }) {
  return (
    <CardShell
      href={href}
      className="group flex min-h-[74px] items-center gap-[12px] rounded-[12px] border border-tangerine bg-white/[0.01] py-2 pr-4 pl-[37px] transition-[background-color,padding] duration-300 ease-out hover:bg-tangerine hover:pl-[71px]"
    >
      <img alt="" aria-hidden src={assets.verifiedOrange} className="size-6 shrink-0 group-hover:hidden" />
      <span className="font-babel text-[22px] leading-[1.6] tracking-[4.4px] text-tangerine group-hover:text-white">{title}</span>
      <img alt="" aria-hidden src={assets.verifiedEmpty} className="size-6 shrink-0 group-hover:hidden" />
      <img alt="" aria-hidden src={assets.verifiedWhite} className="hidden size-6 shrink-0 group-hover:block" />
    </CardShell>
  )
}

export function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-title" className="relative px-[10px] pt-[95px] pb-[96px] md:px-10 lg:pt-[96px]">
      <div className="mx-auto max-w-[1261px]">
        <SectionTitle id="projects-title" accent="Projects" className="pl-[30px] md:pl-0" />
        <div className="mt-4 grid gap-[28px] lg:mt-[41px] lg:grid-cols-2 lg:gap-[40px]">
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>

        <SectionTitle id="certificates-title" accent="Certificates" className="mt-[39px] pl-[30px] md:pl-0 lg:mt-[72px]" />
        <div className="mx-auto mt-[39px] grid max-w-[1260px] gap-[25px] px-[3px] md:grid-cols-2 md:gap-x-6 md:px-0 lg:mt-[55px] lg:gap-x-[72px]">
          {certificates.map((item) => (
            <CertificateCard key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  )
}
