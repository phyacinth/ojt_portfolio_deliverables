import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react'
import { assets, externalProps, links } from '../lib/assets'
import { useDragEnabled, useDraggable } from '../lib/useDraggable'
import { WindowCard } from './ui'

type DragDesk = {
  enabled: boolean
  sectionRef: RefObject<HTMLElement | null>
  zIndexOf: (id: string) => number | undefined
  bringToFront: (id: string) => void
  setMoved: (id: string, moved: boolean) => void
  resetToken: number
}

const DeskContext = createContext<DragDesk | null>(null)

/** A WindowCard that can be dragged around the About section by its title bar (desktop only). */
function DeskWindow({ title, variant, flush, className, children }: { title: string; variant?: 'default' | 'accent'; flush?: boolean; className: string; children: ReactNode }) {
  const desk = useContext(DeskContext)!
  const activate = useCallback(() => desk.bringToFront(title), [desk, title])
  const d = useDraggable({
    enabled: desk.enabled,
    label: title,
    boundsRef: desk.sectionRef,
    onActivate: activate,
    onMovedChange: (moved) => desk.setMoved(title, moved),
    resetToken: desk.resetToken,
  })
  return (
    <WindowCard
      title={title}
      variant={variant}
      flush={flush}
      className={className}
      drag={desk.enabled ? { handleProps: d.handleProps, style: d.style, isDragging: d.isDragging, zIndex: desk.zIndexOf(title), cardRef: d.cardRef, onActivate: activate } : undefined}
    >
      {children}
    </WindowCard>
  )
}

const bodyText = 'font-babel text-[17px] leading-[1.6] tracking-[0.3px] text-navy'
const cardHeading = 'font-gentle text-[22px] leading-[1.3] tracking-[0.5px] text-tangerine'

const competencies = ['UI/UX Design', 'Responsive Web Design', 'Rapid Prototyping', 'Technical Documentation']

const socials = [
  { label: 'GitHub', href: links.github, src: assets.github },
  { label: 'LinkedIn', href: links.linkedin, src: assets.linkedin },
  { label: 'Instagram', href: links.instagram, src: assets.instagram },
]

function AboutMeCard({ className }: { className: string }) {
  return (
    <DeskWindow title="about-me.txt" className={className}>
      <p className="font-babel text-[16px] leading-[1.45] tracking-[0.5px] text-navy">Hi, I’m</p>
      <h1 className="mt-1 font-gentle text-[28px] leading-[1.25] tracking-[1px] text-tangerine lg:text-[36px]">Andrei Acosta</h1>
      <p className={`mt-4 max-w-[60ch] ${bodyText}`}>
        I'm a UI/UX and web design student who enjoys learning by creating. I like exploring new ideas, improving my skills with every project, and finding simple solutions to
        design problems. My style is modern with a playful touch, creating experiences that are clean, intuitive, and enjoyable to use.
      </p>
    </DeskWindow>
  )
}

function PhotoCard({ className }: { className: string }) {
  return (
    <DeskWindow title="photo.jpg" flush className={className}>
      <img alt="Portrait of Andrei Acosta" src={assets.portrait} className="block aspect-[4/5] w-full bg-black object-cover" />
      <p className="border-t-2 border-tangerine px-5 py-3 font-neutral text-[16px] leading-[1.45] tracking-[2px] text-tangerine sm:px-7">Open for internships!</p>
    </DeskWindow>
  )
}

function ContactsCard({ className }: { className: string }) {
  const row = 'flex items-center gap-[10px] transition-colors hover:text-tangerine'
  return (
    <DeskWindow title="contacts" variant="accent" className={className}>
      <div className="flex flex-col gap-3">
        <a href={links.phone} className={`${row} ${bodyText}`}>
          <img alt="" aria-hidden src={assets.call} className="size-6 shrink-0" />
          <span className="whitespace-nowrap">(+63) 928 898 6970</span>
        </a>
        <a href={links.email} className={`${row} ${bodyText}`}>
          <img alt="" aria-hidden src={assets.email} className="size-6 shrink-0" />
          <span className="whitespace-nowrap">atsocaandrei185@gmail.com</span>
        </a>
      </div>
      <div className="mt-5 flex items-center gap-3">
        {socials.map((item) => (
          <a
            key={item.label}
            href={item.href}
            {...externalProps(item.href)}
            aria-label={`${item.label} profile`}
            className="flex size-10 items-center justify-center rounded-[10px] border-2 border-tangerine bg-cream transition-[background-color,translate] duration-200 hover:-translate-y-0.5 hover:bg-butter motion-reduce:hover:translate-y-0"
          >
            <img alt="" aria-hidden src={item.src} className="size-6 object-cover" />
          </a>
        ))}
      </div>
    </DeskWindow>
  )
}

function EducationCard({ className }: { className: string }) {
  return (
    <DeskWindow title="education" className={className}>
      <h2 className={cardHeading}>Academic Background</h2>
      <p className={`mt-3 max-w-[60ch] ${bodyText}`}>
        Bachelor of Industrial Technology, Major in Computer Technology — Bulacan State University, College of Industrial Technology. Expected Graduation: [Year]
      </p>
    </DeskWindow>
  )
}

function CompetenciesCard({ className }: { className: string }) {
  return (
    <DeskWindow title="competencies" className={className}>
      <h2 className={cardHeading}>Core Competencies</h2>
      <ul className="mt-4 flex flex-wrap gap-2">
        {competencies.map((item) => (
          <li key={item} className="rounded-full border-[1.5px] border-tangerine px-3 py-1 font-babel text-[15px] leading-[1.4] tracking-[0.3px] text-navy">
            {item}
          </li>
        ))}
      </ul>
    </DeskWindow>
  )
}

/*
 * Layout: the column wrappers are `display: contents` below lg, so on mobile/tablet
 * every card is a direct grid item ordered photo → about → contacts → education →
 * competencies. From lg the wrappers become a left (8/12) and right (4/12) stack.
 */
export function About() {
  const enabled = useDragEnabled()
  const sectionRef = useRef<HTMLElement>(null)
  const zCounter = useRef(1)
  const [zIndex, setZIndex] = useState<Record<string, number>>({})
  const [moved, setMovedMap] = useState<Record<string, boolean>>({})
  const [resetToken, setResetToken] = useState(0)

  const bringToFront = useCallback((id: string) => {
    setZIndex((prev) => (prev[id] === zCounter.current ? prev : { ...prev, [id]: ++zCounter.current }))
  }, [])
  const setMoved = useCallback((id: string, value: boolean) => setMovedMap((prev) => (prev[id] === value ? prev : { ...prev, [id]: value })), [])
  const desk = useMemo<DragDesk>(
    () => ({ enabled, sectionRef, zIndexOf: (id) => zIndex[id], bringToFront, setMoved, resetToken }),
    [enabled, zIndex, bringToFront, setMoved, resetToken],
  )
  const anyMoved = enabled && Object.values(moved).some(Boolean)

  return (
    <DeskContext.Provider value={desk}>
    <section ref={sectionRef} id="about" aria-label="About" className="relative z-10 px-4 py-16 md:px-8 lg:py-24">
      {enabled && <p className="sr-only">Tip: drag the windows by their title bars.</p>}
      {anyMoved && (
        <button
          type="button"
          onClick={() => setResetToken((t) => t + 1)}
          className="absolute top-6 right-4 z-[10000] h-8 lg:right-8 rounded-[8px] border border-tangerine bg-black px-3 font-dot text-[13px] leading-none font-medium tracking-[1px] text-tangerine transition-colors hover:bg-tangerine hover:text-white"
        >
          Reset windows
        </button>
      )}
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-5 md:grid-cols-2 md:items-start md:gap-6 lg:grid-cols-12 lg:gap-x-8">
        <div className="contents lg:col-span-8 lg:flex lg:flex-col lg:gap-10 lg:pt-4">
          <AboutMeCard className="order-2 lg:order-none lg:mr-[6%]" />
          <div className="contents lg:grid lg:grid-cols-9 lg:items-start lg:gap-6">
            <EducationCard className="order-4 lg:order-none lg:col-span-5 lg:mt-2" />
            <CompetenciesCard className="order-5 md:col-span-2 lg:order-none lg:col-span-4 lg:mt-12 lg:[--card-rotate:1deg]" />
          </div>
        </div>
        <div className="contents lg:col-span-4 lg:flex lg:flex-col lg:gap-10 lg:-mt-[120px]">
          <PhotoCard className="order-1 lg:order-none lg:[--card-rotate:1deg]" />
          <ContactsCard className="order-3 lg:order-none lg:-ml-3 lg:[--card-rotate:-1deg]" />
        </div>
      </div>
      {enabled && (
        <p className="mx-auto mt-10 max-w-[1200px] text-right font-babel text-[13px] leading-[1.45] tracking-[0.5px] text-cream/60">psst — you can drag these windows around ↗</p>
      )}
    </section>
    </DeskContext.Provider>
  )
}
