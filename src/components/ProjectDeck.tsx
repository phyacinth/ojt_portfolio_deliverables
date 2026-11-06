import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { ButtonLink, WindowCard } from './ui'

export type Project = {
  /** Retro "file name" shown in the window title bar. */
  file: string
  title: string
  role: string
  description: string
  tags: string[]
  /** Cover image (16:9 slot; cropped to fill). */
  image?: { src: string; alt: string }
  /** Extra images shown in the detail window. */
  gallery?: { src: string; alt: string }[]
  /** Buttons in the detail window; the first is filled, the rest outlined. */
  links: { label: string; href: string }[]
  /** Short line under the buttons, e.g. "Link coming soon!". */
  note?: string
}

/**
 * Layout: each step away from the centre card adds this much shrink. Tilt and drop are CSS
 * variables on the stage (--tilt, --drop) so phones can fan the cards more steeply: there's no
 * room to space three cards out side by side.
 */
const SHRINK = 0.03
// Card size: phones 300px max (fanned), tablets 360px (overlapping), and from lg the cards grow
// with the window (clamp 280-380px) so all three fit side by side without being clipped.

/**
 * Scroll distance (in % of the viewport height) per dealt card. The section stays pinned while
 * the cards come out, plus one extra step of rest once they're all out.
 */
const DEAL_STEP_VH = 28

/** Pop-out timing. The easing overshoots slightly so the window "pops". */
const POP_MS = 480
const POP_EASING = 'cubic-bezier(0.2, 0.9, 0.25, 1.08)'
const RETURN_MS = 380
const RETURN_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)'

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

type Origin = { cx: number; cy: number; width: number; rotate: number }

/**
 * Scroll-driven project picker. When the section reaches the top it pins, and each scroll step
 * brings one card up from the bottom of the screen into its slot. Once all are out the page scrolls on, and any card
 * can be clicked to pop out into a detail window. Scrolling back up returns the cards.
 */
export function ProjectDeck({ projects, heading }: { projects: Project[]; heading: ReactNode }) {
  const count = projects.length
  const [dealt, setDealt] = useState(0)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const trackRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const dialogRef = useRef<HTMLDialogElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const originRef = useRef<Origin | null>(null)
  const closingRef = useRef(false)
  const openRef = useRef(openIndex)
  openRef.current = openIndex

  /** Each card's position in the fan, centred on 0 (e.g. -1, 0, 1 for three cards). */
  const slot = (index: number) => index - (count - 1) / 2

  // Count how far the reader has scrolled into the pinned track; card k comes out halfway through step k.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let frame = 0

    const update = () => {
      frame = 0
      const scrolled = -track.getBoundingClientRect().top
      const step = (window.innerHeight * DEAL_STEP_VH) / 100
      setDealt(Math.max(0, Math.min(count, Math.floor(scrolled / step + 0.5))))
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [count])

  /** Where a card currently sits on screen (centre, scaled width, tilt). */
  const measureCard = (index: number): Origin | null => {
    const card = cardRefs.current[index]
    if (!card) return null
    const offset = slot(index)
    const rect = card.getBoundingClientRect()
    return {
      cx: rect.left + rect.width / 2,
      cy: rect.top + rect.height / 2,
      width: card.offsetWidth * (1 - Math.abs(offset) * SHRINK),
      rotate: offset * (parseFloat(getComputedStyle(card).getPropertyValue('--tilt')) || 0),
    }
  }

  const openProject = (index: number) => {
    originRef.current = measureCard(index)
    setOpenIndex(index)
  }

  /** Transform that puts the panel exactly over the card it came from. */
  const transformFrom = (origin: Origin, panel: HTMLElement) => {
    const p = panel.getBoundingClientRect()
    const dx = origin.cx - (p.left + p.width / 2)
    const dy = origin.cy - (p.top + p.height / 2)
    return `translate(${dx}px, ${dy}px) rotate(${origin.rotate}deg) scale(${origin.width / p.width})`
  }

  // Open: show the modal, then fly the panel out of the card.
  useLayoutEffect(() => {
    if (openIndex === null) return
    const dialog = dialogRef.current
    const panel = panelRef.current
    if (!dialog || !panel) return

    closingRef.current = false
    if (!dialog.open) dialog.showModal()
    // showModal focuses the first control (often a link at the bottom of a tall window) and scrolls
    // to it; start at the top with focus on the close button instead.
    dialog.scrollTop = 0
    panel.querySelector<HTMLButtonElement>('button[aria-label="Close"]')?.focus({ preventScroll: true })
    const root = document.documentElement
    const previousOverflow = root.style.overflow
    root.style.overflow = 'hidden'

    const origin = originRef.current
    if (origin && !prefersReducedMotion()) {
      panel.animate(
        [
          { transform: transformFrom(origin, panel), opacity: 0.5 },
          { opacity: 1, offset: 0.35 },
          { transform: 'none', opacity: 1 },
        ],
        { duration: POP_MS, easing: POP_EASING },
      )
      dialog.animate([{ backgroundColor: 'rgba(0, 0, 0, 0)' }, { backgroundColor: 'rgba(0, 0, 0, 0.78)' }], {
        duration: POP_MS,
        easing: 'ease-out',
      })
    }

    return () => {
      root.style.overflow = previousOverflow
    }
  }, [openIndex])

  // Close: fly the panel back into its slot in the fan, then close the modal.
  const closeProject = () => {
    const dialog = dialogRef.current
    const panel = panelRef.current
    if (openIndex === null || !dialog || !panel || closingRef.current) return
    closingRef.current = true

    const finish = () => {
      dialog.close()
      setOpenIndex(null)
    }

    const origin = measureCard(openIndex)
    if (!origin || prefersReducedMotion()) return finish()

    const options = { duration: RETURN_MS, easing: RETURN_EASING, fill: 'forwards' as const }
    const flyBack = panel.animate(
      [
        { transform: 'none', opacity: 1 },
        { opacity: 1, offset: 0.7 },
        { transform: transformFrom(origin, panel), opacity: 0 },
      ],
      options,
    )
    dialog.animate([{ backgroundColor: 'rgba(0, 0, 0, 0.78)' }, { backgroundColor: 'rgba(0, 0, 0, 0)' }], options)
    flyBack.finished.then(() => {
      finish()
      // Drop the held end frames so the next open starts clean.
      panel.getAnimations().forEach((a) => a.cancel())
      dialog.getAnimations().forEach((a) => a.cancel())
    }, finish)
  }

  const opened = openIndex === null ? null : projects[openIndex]

  return (
    // The track is taller than the screen; the frame inside it stays pinned while the cards come out.
    <div ref={trackRef} className="relative" style={{ height: `calc(100svh + ${(count + 0.5) * DEAL_STEP_VH}svh)` }}>
      <div className="sticky top-0 flex h-svh flex-col justify-center pt-[72px]">
        {/* The fan */}
        <div
          role="group"
          aria-label="Projects"
          className="relative isolate h-[400px] overflow-x-clip [--card-h:340px] [--card-w:min(300px,64vw)] [--drop:22px] [--spread:min(calc(var(--card-w)_+_32px),calc((100vw_-_var(--card-w))_/_2_-_16px))] [--tilt:10deg] sm:h-[500px] sm:[--card-h:430px] sm:[--card-w:min(360px,64vw)] sm:[--drop:14px] sm:[--tilt:4deg] lg:[--card-w:clamp(280px,calc((100vw_-_240px)_/_3),380px)] xl:h-[530px] xl:[--card-h:455px]"
        >
          {/* Heading sits in the middle, behind the cards, so they cover it as they come in. It's wider
              than the row of cards, so it fades out as the last card lands to hide the gaps. */}
          <div
            className={`pointer-events-none absolute inset-0 flex items-center justify-center px-2 transition-opacity duration-500 motion-reduce:transition-none ${
              dealt === count ? 'opacity-0' : ''
            }`}
          >
            {heading}
          </div>

          <div className="absolute inset-0">
            {projects.map((project, i) => {
              const offset = slot(i)
              const distance = Math.abs(offset)
              const isOut = i < dealt
              return (
                <div
                  key={project.title}
                  ref={(el) => {
                    cardRefs.current[i] = el
                  }}
                  inert={!isOut}
                  style={
                    {
                      '--z': Math.round(10 - distance * 2),
                      // Out: in its slot. In: below the screen, upright and invisible.
                      transform: isOut
                        ? `translateX(calc(${offset} * var(--spread))) translateY(calc(${distance} * var(--drop))) rotate(calc(${offset} * var(--tilt))) scale(${1 - distance * SHRINK})`
                        : `translateX(calc(${offset} * var(--spread))) translateY(70svh) rotate(calc(${offset * 3} * var(--tilt)))`,
                      opacity: isOut ? 1 : 0,
                      visibility: openIndex === i ? 'hidden' : undefined,
                    } as CSSProperties
                  }
                  className="group absolute bottom-[24px] left-1/2 z-(--z) ml-[calc(var(--card-w)/-2)] h-(--card-h) w-(--card-w) origin-[50%_120%] transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.34,1.2,0.5,1)] hover:z-30 has-focus-visible:z-30 motion-reduce:transition-none"
                >
                  <WindowCard title={project.file} className="h-full group-hover:-translate-y-2 group-hover:shadow-[8px_8px_0px_0px_#ff7700] group-has-focus-visible:-translate-y-2">
                    <CardFace project={project} />
                  </WindowCard>
                  <button
                    type="button"
                    aria-label={`Open ${project.title}`}
                    onClick={() => openProject(i)}
                    className="absolute inset-0 z-10 cursor-pointer rounded-[14px]"
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Pop-out detail window */}
      <dialog
        ref={dialogRef}
        aria-label={opened?.title}
        onCancel={(e) => {
          e.preventDefault()
          closeProject()
        }}
        onClose={() => {
          // The browser can force-close the dialog (e.g. repeated Esc); keep state in sync.
          if (openRef.current !== null) setOpenIndex(null)
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget || (e.target as HTMLElement).dataset.backdrop !== undefined) closeProject()
        }}
        className="m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto bg-black/[0.78] p-4 text-left backdrop:bg-transparent"
      >
        <div data-backdrop className="flex min-h-full items-center justify-center py-6">
          {opened && (
            <div ref={panelRef} className="relative w-[min(720px,100%)]">
              <WindowCard title={opened.file} className="hover:translate-y-0">
                <ProjectDetail project={opened} />
              </WindowCard>
              <button
                type="button"
                onClick={closeProject}
                aria-label="Close"
                className="absolute top-[7px] right-[10px] flex size-[30px] cursor-pointer items-center justify-center rounded-[8px] border-2 border-navy bg-cream text-navy transition-colors hover:bg-tangerine hover:text-white"
              >
                <svg aria-hidden viewBox="0 0 12 12" className="size-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M2 2l8 8M10 2l-8 8" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </dialog>
    </div>
  )
}

function Screenshot({ project }: { project: Project }) {
  if (project.image) {
    return (
      <img
        src={project.image.src}
        alt={project.image.alt}
        loading="lazy"
        className="block aspect-video w-full rounded-[8px] border-2 border-tangerine/60 bg-black object-cover"
      />
    )
  }
  return (
    <div
      role="img"
      aria-label={`${project.title} screenshot placeholder`}
      className="flex aspect-video items-center justify-center rounded-[8px] border-2 border-dashed border-tangerine/50 bg-butter/40 font-babel text-[14px] tracking-[3px] text-navy/50 uppercase"
    >
      Screenshot
    </div>
  )
}

/** Compact face shown in the fan. Cards have a fixed height, so keep this short. */
function CardFace({ project }: { project: Project }) {
  return (
    <div className="flex flex-col gap-3">
      <Screenshot project={project} />
      <h3 className="font-babel text-[18px] leading-[1.45] tracking-[2.7px] text-tangerine sm:text-[21px]">{project.title}</h3>
      <p className="font-babel text-[14px] leading-[1.45] tracking-[2px] text-navy sm:text-[16px]">
        <span className="text-tangerine">Role:</span> {project.role}
      </p>
    </div>
  )
}

function ProjectDetail({ project }: { project: Project }) {
  return (
    <div className="flex flex-col gap-4">
      <Screenshot project={project} />
      <h3 className="font-babel text-[22px] leading-[1.6] tracking-[4px] text-tangerine lg:text-[24px]">{project.title}</h3>
      <p className="font-babel text-[16px] leading-[1.45] tracking-[2.4px] text-navy">
        <span className="text-tangerine">Role:</span> {project.role}
      </p>
      <p className="font-babel text-[16px] leading-[1.8] tracking-[1.6px] text-navy/80">{project.description}</p>
      <ul aria-label="Technologies" className="flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <li key={tag} className="rounded-full border border-navy px-3 py-[2px] font-babel text-[14px] leading-[1.45] tracking-[1.4px] text-navy">
            {tag}
          </li>
        ))}
      </ul>
      {project.gallery && (
        <ul aria-label="More images" className="grid grid-cols-3 gap-3">
          {project.gallery.map((img) => (
            <li key={img.src}>
              <img src={img.src} alt={img.alt} loading="lazy" className="block aspect-[4/3] w-full rounded-[6px] border-2 border-tangerine/60 bg-black object-cover" />
            </li>
          ))}
        </ul>
      )}
      {(project.links.length > 0 || project.note) && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2">
          {project.links.map((link, i) => (
            <ButtonLink key={link.href} href={link.href} variant={i === 0 ? 'butter' : 'outlineLight'}>
              {link.label}
            </ButtonLink>
          ))}
          {project.note && <p className="font-babel text-[15px] tracking-[1px] text-navy/70 italic">{project.note}</p>}
        </div>
      )}
    </div>
  )
}
