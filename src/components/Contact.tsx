import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { assets, links } from '../lib/assets'
import { Stars, VLine } from './Decor'
import { SectionStars } from './ShootingStars'
import { ButtonLink } from './ui'

/** Shown as text in the "Contact me?" answer (links.email is the mailto: link). */
const EMAIL = links.email.replace('mailto:', '')

/**
 * Questions shown between the open doors; each one flips into its answer when clicked.
 * `at` is where it sits from tablet width up: [x, y] of its centre, in % of the opening's width
 * and the section's height (placed from Andrei's mock-up). Phones stack them instead.
 */
const faqs: { question: string; answer: ReactNode; at: [number, number] }[] = [
  { question: 'When can I start?', at: [27, 21], answer: 'Available 2nd Semester, A.Y. 2026–2027.' },
  { question: 'Where can I work?', at: [77, 37], answer: 'On-site, hybrid or remote. Bulacan, Manila, Pampanga' },
  { question: 'How many hours do I need?', at: [30, 59], answer: '400 to 600 hours.' },
  {
    question: 'Contact me?',
    at: [49, 84],
    answer: (
      <span className="flex flex-col items-center gap-3 pt-1">
        {/* The address itself, so it can be read or copied even without a mail app set up. */}
        <a
          href={links.email}
          className="font-babel text-[17px] tracking-[0.5px] break-all text-cream decoration-tangerine decoration-2 underline-offset-4 hover:underline sm:text-[19px]"
        >
          {EMAIL}
        </a>
        <ButtonLink href={links.cvFile} download="Andrei-Acosta-CV.pdf" widthClass="w-[200px]">
          Download CV
        </ButtonLink>
        <ButtonLink href={links.linkedin} variant="outline" widthClass="w-[200px]">
          View LinkedIn
        </ButtonLink>
      </span>
    ),
  },
]

const QUESTION = 'Interested in bringing me onto your team for OJT?'
const CTA = 'Let’s connect.'
/** Shown on the doors once they're open: one half on each door, reading across the gap. */
const PROMISE = ['I won’t', 'let you down.'] as const

/** Door motion: each half slides sideways by --door (a % of the section's width). */
const doorMotion = 'transition-[translate] duration-[800ms] ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none'

// Shared layout so the doors and the real (invisible) layer line up exactly.
const faceLayout = 'absolute inset-0 flex flex-col items-center justify-center px-5 sm:px-[100px]'
const questionClass =
  'max-w-[1040px] text-center font-gentle text-[clamp(28px,min(5vw,7.5svh),64px)] leading-[1.15] tracking-[-0.01em] [text-wrap:balance]'
const ctaClass = 'relative mt-6 font-gentle text-[clamp(26px,3.4vw,44px)] leading-[1.3]'

/**
 * Visual copy of the closed block, used by each door (clipped to its half). When open, the question
 * fades out and this door's half of the promise fades in, inside the strip of door still on screen
 * (between --door and the seam), hugging the gap. On phones the strip is narrow, so it runs vertically.
 */
function DoorFace({ side, open }: { side: 'left' | 'right'; open: boolean }) {
  const left = side === 'left'
  return (
    <div aria-hidden className={`${faceLayout} bg-cream`}>
      {/* Charcoal shooting stars on the cream, under the text. */}
      <SectionStars z="z-0" />
      <div className="lg:hidden">
        <Stars smallTop={28} className="top-[72px] left-[-5px]" />
        <VLine src={assets.skillsLineMobileLong} length={193} className="top-[150px] left-[32px]" />
        <VLine src={assets.skillsLineMobileShort} length={145} className="top-[168px] left-[49px]" />
      </div>
      <div className="hidden lg:block">
        <Stars smallTop={27} className="top-[96px] left-[37px]" />
        <VLine src={assets.skillsLineLong} length={137} className="top-[174px] left-[74px]" />
        <VLine src={assets.skillsLineShort} length={92} className="top-[185px] left-[91px]" />
      </div>
      <div
        className={`relative z-[1] flex flex-col items-center motion-reduce:transition-none ${open ? 'opacity-0 transition-opacity duration-200' : 'opacity-100 transition-opacity delay-500 duration-300'}`}
      >
        <p className={`${questionClass} text-black`}>{QUESTION}</p>
        <p className={`${ctaClass} text-tangerine`}>{CTA}</p>
      </div>

      {/* The strip of this door that stays on screen when open. The first line sits on the vertical
          centre so "I won't" lines up with "let you" even when the right half wraps. */}
      <div className={`absolute inset-y-0 ${left ? 'right-1/2 left-(--door)' : 'right-(--door) left-1/2'}`}>
        <p
          className={`absolute top-1/2 -translate-y-1/2 font-gentle text-[26px] leading-[1.1] tracking-[-0.01em] [text-orientation:sideways] [writing-mode:vertical-rl] sm:-translate-y-[0.55lh] sm:text-[clamp(28px,4vw,56px)] sm:[writing-mode:horizontal-tb] motion-reduce:transition-none ${
            left ? 'right-4 text-black sm:right-6 sm:text-right' : 'left-4 text-tangerine sm:left-6 sm:text-left'
          } ${open ? 'opacity-100 transition-opacity delay-500 duration-500' : 'opacity-0 transition-opacity duration-150'}`}
        >
          {left ? PROMISE[0] : PROMISE[1]}
        </p>
      </div>
    </div>
  )
}

/**
 * One question that flips into its answer. Both sit in the same grid cell (so the slot never
 * jumps in size) and cross-fade with a slight lift and blur. Clicking the answer flips it back.
 */
function Faq({
  question,
  answer,
  at,
  index,
  shown,
  delay,
  boxRef,
  onToggle,
}: {
  question: string
  answer: ReactNode
  at: [number, number]
  index: number
  shown: boolean
  /** ms to wait before flipping, so answers appear as the string reaches them. */
  delay: number
  boxRef: (el: HTMLDivElement | null) => void
  onToggle: (viaKeyboard: boolean) => void
}) {
  const answerRef = useRef<HTMLDivElement>(null)
  // Phones: stacked, alternating left and right. Tablet and up: centred on its `at` point.
  const right = index % 2 === 1
  const swap = 'col-start-1 row-start-1 transition-[opacity,translate,filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none'

  return (
    <div
      ref={boxRef}
      style={{ gridRow: index + 1, '--x': `${at[0]}%`, '--y': `${at[1]}%` } as CSSProperties}
      className={`grid max-w-[340px] sm:absolute sm:top-(--y) sm:left-(--x) sm:w-[min(340px,46%)] sm:max-w-none sm:-translate-x-1/2 sm:-translate-y-1/2 sm:text-center ${
        right ? 'justify-self-end text-right' : 'justify-self-start text-left'
      }`}
    >
      <button
        type="button"
        data-question
        style={{ transitionDelay: `${delay}ms` }}
        aria-expanded={shown}
        tabIndex={shown ? -1 : 0}
        onClick={(e) => {
          onToggle(e.detail === 0)
          if (e.detail === 0) requestAnimationFrame(() => answerRef.current?.focus({ preventScroll: true }))
        }}
        className={`${swap} cursor-pointer font-gentle text-[clamp(22px,2.6vw,36px)] leading-[1.2] text-cream decoration-tangerine decoration-2 underline-offset-[6px] hover:underline ${
          right ? 'justify-self-end text-right' : 'justify-self-start text-left'
        } sm:justify-self-center sm:text-center ${shown ? 'pointer-events-none -translate-y-2 opacity-0 blur-sm' : 'translate-y-0 opacity-100 blur-0'}`}
      >
        {question}
      </button>
      {/* data-keep-open: clicks here flip the answer back instead of closing the doors. */}
      <div
        ref={answerRef}
        data-keep-open
        style={{ transitionDelay: `${shown ? delay + 100 : delay}ms` }}
        tabIndex={-1}
        inert={!shown}
        onClick={(e) => {
          if (!(e.target as Element).closest('a')) onToggle(false)
        }}
        className={`${swap} flex cursor-pointer flex-col font-babel text-[17px] leading-[1.5] tracking-[0.5px] text-butter outline-none sm:text-[19px] ${
          right ? 'items-end justify-self-end' : 'items-start justify-self-start'
        } sm:items-center sm:justify-self-center sm:text-center ${shown ? 'translate-y-0 opacity-100 blur-0' : 'pointer-events-none translate-y-2 opacity-0 blur-sm'}`}
      >
        {answer}
      </div>
    </div>
  )
}

type Point = { x: number; y: number }

/** Pause between one stretch of string and the next when several draw in a row. */
const STRING_STEP_MS = 380

/**
 * The string: drops from the top edge to the first question, then threads from the bottom of each
 * question to the top of the next. Stretch k is drawn once question k is reached; several draw one
 * after another, and they wind back in reverse.
 */
function QuestionString({ tops, bottoms, reached, previous }: { tops: Point[]; bottoms: Point[]; reached: number; previous: number }) {
  if (tops.length === 0) return null
  const segments = tops.map((end, k) => {
    const start = k === 0 ? { x: end.x, y: 0 } : bottoms[k - 1]
    const dy = end.y - start.y
    return `M ${start.x} ${start.y} C ${start.x} ${start.y + dy * 0.5}, ${end.x} ${end.y - dy * 0.5}, ${end.x} ${end.y}`
  })
  const delayFor = (k: number) => (reached >= previous ? Math.max(0, k - previous) : Math.max(0, previous - 1 - k)) * STRING_STEP_MS
  return (
    <svg aria-hidden className="pointer-events-none absolute inset-0 size-full overflow-visible">
      {segments.map((d, k) => {
        const drawn = k < reached
        return (
          <g key={k}>
            <path
              d={d}
              pathLength={1}
              fill="none"
              stroke="var(--color-tangerine)"
              strokeWidth={2}
              strokeLinecap="round"
              strokeDasharray="1"
              strokeDashoffset={drawn ? 0 : 1}
              style={{ transitionDelay: `${delayFor(k)}ms` }}
              className="transition-[stroke-dashoffset] duration-[450ms] ease-in-out motion-reduce:transition-none"
            />
            <circle
              cx={tops[k].x}
              cy={tops[k].y}
              r={4}
              fill="var(--color-tangerine)"
              style={{ transitionDelay: `${delayFor(k) + (drawn ? 400 : 0)}ms` }}
              className={`transition-opacity duration-200 ${drawn ? 'opacity-100' : 'opacity-0'}`}
            />
          </g>
        )
      })}
    </svg>
  )
}

/**
 * Full-screen cream block with the question in the middle. "Let's connect" splits it down the
 * middle like a pair of doors, revealing a set of questions that flip into answers. A string threads
 * through them as they're answered, by clicking or by scrolling. Clicking any empty space (or
 * pressing Esc) closes the doors again.
 */
export function Contact() {
  const [open, setOpen] = useState(false)
  // How many questions the string has reached; those show their answers. Clicking a question
  // reaches it (and everything before it); clicking an answer winds the string back to it.
  const [reached, setReached] = useState(0)
  const reachedRef = useRef(reached)
  const previousRef = useRef(0)
  const previous = previousRef.current
  useEffect(() => {
    previousRef.current = reached
    reachedRef.current = reached
  }, [reached])
  const toggleAnswer = (i: number) => setReached((r) => (i < r ? i : i + 1))
  /** Delay before item i flips, so answers appear one by one as the string arrives. */
  const flipDelay = (i: number) => (reached >= previous ? Math.max(0, i - previous) * STRING_STEP_MS + 300 : Math.max(0, previous - 1 - i) * STRING_STEP_MS)

  // String anchors, measured in the question list's own (unscaled) coordinates.
  const boxRefs = useRef<(HTMLDivElement | null)[]>([])
  const [anchors, setAnchors] = useState<{ tops: Point[]; bottoms: Point[] }>({ tops: [], bottoms: [] })
  const sectionRef = useRef<HTMLElement>(null)
  const panelId = useId()
  const ctaRef = useRef<HTMLButtonElement>(null)
  const firstActionRef = useRef<HTMLDivElement>(null)

  // Links that point at #contact (e.g. the header's "Contact") open the doors as well.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as Element | null)?.closest?.('a')
      if (anchor?.getAttribute('href') === '#contact') setOpen(true)
    }
    document.addEventListener('click', onClick)
    if (window.location.hash === '#contact') setOpen(true)
    return () => document.removeEventListener('click', onClick)
  }, [])

  // Keyboard users get focus moved to the controls that are now visible (the layer that held it
  // becomes inert). Mouse users don't, so no focus outline appears after a click.
  const openDoors = (viaKeyboard: boolean) => {
    setOpen(true)
    if (viaKeyboard) requestAnimationFrame(() => firstActionRef.current?.querySelector('button')?.focus({ preventScroll: true }))
  }
  const closeDoors = (viaKeyboard: boolean) => {
    setOpen(false)
    // Back to questions once the doors have shut.
    setTimeout(() => setReached(0), 800)
    if (viaKeyboard) requestAnimationFrame(() => ctaRef.current?.focus({ preventScroll: true }))
  }

  // While open, Esc closes the doors (the keyboard counterpart to clicking empty space).
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeDoors(true)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  // Measure where the string attaches: just above and below each question's slot, centred on the
  // question text. The list scales in when the doors open, so divide that scale back out.
  useLayoutEffect(() => {
    const list = firstActionRef.current
    if (!list) return
    const measure = () => {
      const c = list.getBoundingClientRect()
      const scale = c.width / (list.offsetWidth || 1)
      const tops: Point[] = []
      const bottoms: Point[] = []
      for (const box of boxRefs.current) {
        const q = box?.querySelector('[data-question]')
        if (!box || !q) return
        const b = box.getBoundingClientRect()
        const t = q.getBoundingClientRect()
        const x = (t.left + t.width / 2 - c.left) / scale
        tops.push({ x, y: (b.top - c.top) / scale - 12 })
        bottoms.push({ x, y: (b.bottom - c.top) / scale + 12 })
      }
      setAnchors({ tops, bottoms })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(list)
    document.fonts?.ready.then(measure)
    return () => ro.disconnect()
  }, [])

  // While the doors are open and the section fills the screen, scrolling moves the string: down
  // reaches the next question, up winds it back. Past either end the page scrolls as usual.
  useEffect(() => {
    const section = sectionRef.current
    if (!open || !section) return
    let lastEvent = 0
    let lastStep = 0
    let locked = false
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(section.getBoundingClientRect().top) > 60) return
      const now = performance.now()
      if (now - lastEvent > 180) locked = false
      lastEvent = now
      const dir = Math.sign(e.deltaY)
      if (!dir) return
      // One step per gesture: swallow the rest of a gesture that already moved the string.
      if (locked && now - lastStep < 500) return e.preventDefault()
      const next = reachedRef.current + dir
      if (next < 0 || next > faqs.length) return
      e.preventDefault()
      locked = true
      lastStep = now
      reachedRef.current = next
      setReached(next)
    }
    section.addEventListener('wheel', onWheel, { passive: false })
    return () => section.removeEventListener('wheel', onWheel)
  }, [open])

  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-labelledby="contact-title"
      // Clicking anywhere that isn't a link, button or open answer closes the doors.
      onClick={(e) => {
        if (open && !(e.target as Element).closest('a, button, [data-keep-open]')) closeDoors(false)
      }}
      className={`relative z-10 h-svh min-h-[600px] overflow-hidden border-b-[16px] border-tangerine bg-black [--door:30%] sm:[--door:32%] lg:border-b-[20px] ${open ? 'cursor-pointer' : ''}`}
    >
      {/* White shooting stars on the black behind the doors (this section hides the page-wide layer). */}
      <SectionStars tone="light" />

      {/* Inside: revealed between the doors. Phones stack the questions (and scroll if needed);
          from tablet up the list fills the opening and each question is placed by its `at`. */}
      <div id={panelId} inert={!open} className="absolute inset-0 flex items-center justify-center overflow-y-auto px-[21%] py-20">
        <div
          ref={firstActionRef}
          className={`relative grid w-full max-w-[760px] grid-cols-1 gap-y-[max(28px,6svh)] transition-[opacity,scale] duration-500 ease-out motion-reduce:transition-none sm:absolute sm:inset-y-0 sm:right-[calc(50%-var(--door))] sm:left-[calc(50%-var(--door))] sm:block sm:w-auto sm:max-w-none ${
            open ? 'scale-100 opacity-100 delay-300' : 'scale-95 opacity-0'
          }`}
        >
          <p className="sr-only">{PROMISE.join(' ')}</p>
          <QuestionString tops={anchors.tops} bottoms={anchors.bottoms} reached={reached} previous={previous} />
          {faqs.map((faq, i) => (
            <Faq
              key={faq.question}
              {...faq}
              index={i}
              shown={i < reached}
              delay={flipDelay(i)}
              boxRef={(el) => {
                boxRefs.current[i] = el
              }}
              onToggle={() => toggleAnswer(i)}
            />
          ))}
        </div>
      </div>

      {/* Left door: the whole face, clipped to its left half. The doors overlap by 1px (identical
          content) so no hairline shows at the seam on odd-width screens. */}
      <div aria-hidden className={`absolute inset-0 [clip-path:inset(0_calc(50%-1px)_0_0)] ${doorMotion} ${open ? 'translate-x-[calc(var(--door)*-1)]' : ''}`}>
        <DoorFace side="left" open={open} />
        <span className={`absolute inset-y-0 left-[calc(50%-3px)] w-[3px] bg-tangerine transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`} />
      </div>

      {/* Right door: the same face, clipped to its right half. */}
      <div aria-hidden className={`absolute inset-0 [clip-path:inset(0_0_0_calc(50%-1px))] ${doorMotion} ${open ? 'translate-x-(--door)' : ''}`}>
        <DoorFace side="right" open={open} />
        <span className={`absolute inset-y-0 left-1/2 w-[3px] bg-tangerine transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`} />
      </div>

      {/* The real heading and button, laid out exactly over the doors with transparent text, so
          screen readers and keyboard users get one heading and one control. */}
      <div inert={open} className={`${faceLayout} pointer-events-none`}>
        <h2 id="contact-title" className={`${questionClass} text-transparent`}>
          {QUESTION}
        </h2>
        <button
          ref={ctaRef}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={(e) => openDoors(e.detail === 0)}
          className={`${ctaClass} group pointer-events-auto cursor-pointer text-transparent ${open ? 'invisible' : ''}`}
        >
          {CTA}
          <span
            aria-hidden
            className="absolute inset-x-0 -bottom-1 h-[3px] origin-left scale-x-0 rounded-full bg-tangerine transition-transform duration-200 group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
          />
        </button>
      </div>
    </section>
  )
}
