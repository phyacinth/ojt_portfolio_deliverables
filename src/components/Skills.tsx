import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
import { SectionStars } from './ShootingStars'
import { WindowCard } from './ui'

const groups = [
  { label: 'Front-End & Core Web', file: 'front-end.txt', items: ['HTML', 'CSS', 'JavaScript', 'Flutter', 'Dart', 'Responsive Design'] },
  { label: 'Tools & Platforms', file: 'tools.txt', items: ['Figma', 'Visual Studio Code', 'Android Studio', 'Git/GitHub', 'Microsoft Word', 'Microsoft Excel'] },
  { label: 'Design & Media', file: 'design.txt', items: ['Visual Design', 'Web Design', 'UI Animation', 'DaVinci Resolve'] },
  { label: 'Programming & Technical Foundation', file: 'programming.txt', items: ['C++', 'Hardware Servicing', 'Networking'] },
]

type Curve = { x1: number; y1: number; x2: number; y2: number }

/**
 * Full-screen "Skills and Tools" page. Categories on the left; the selected one (hover, click or
 * arrow keys) is joined by a curved line to a window card on the right listing its skills.
 */
export function Skills() {
  const [active, setActive] = useState(0)
  const [curve, setCurve] = useState<Curve | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Line from just right of the selected label to the box's left edge (a third of the way down).
  const measure = useCallback(() => {
    const section = sectionRef.current?.getBoundingClientRect()
    const label = tabRefs.current[active]?.querySelector('[data-label]')?.getBoundingClientRect()
    const box = boxRef.current?.getBoundingClientRect()
    if (!section || !label || !box || box.left <= label.right) return setCurve(null)
    setCurve({
      x1: label.right - section.left + 20,
      y1: label.top + label.height / 2 - section.top,
      x2: box.left - section.left - 6,
      y2: box.top + box.height * 0.33 - section.top,
    })
  }, [active])

  useLayoutEffect(measure, [measure])
  useEffect(() => {
    const ro = new ResizeObserver(measure)
    if (sectionRef.current) ro.observe(sectionRef.current)
    document.fonts?.ready.then(measure)
    return () => ro.disconnect()
  }, [measure])

  const select = (i: number, focus = false) => {
    setActive(i)
    if (focus) tabRefs.current[i]?.focus()
  }

  const onKeyDown = (e: KeyboardEvent) => {
    const last = groups.length - 1
    const next = { ArrowDown: active + 1, ArrowRight: active + 1, ArrowUp: active - 1, ArrowLeft: active - 1, Home: 0, End: last }[e.key]
    if (next === undefined) return
    e.preventDefault()
    select(next < 0 ? last : next > last ? 0 : next, true)
  }

  const group = groups[active]
  const midX = curve ? (curve.x1 + curve.x2) / 2 : 0

  return (
    <section
      ref={sectionRef}
      id="skills"
      aria-labelledby="skills-title"
      className="relative z-10 flex min-h-svh flex-col justify-center bg-cream px-5 pt-28 pb-20 md:px-10 lg:px-16 border-b-[16px] border-tangerine lg:border-b-[20px]"
    >
      <SectionStars />

      {/* Connector: dot beside the selected category, curving into the box. Redraws on each change. */}
      {curve && (
        <svg aria-hidden className="pointer-events-none absolute inset-0 hidden size-full overflow-visible lg:block">
          <path
            key={active}
            d={`M ${curve.x1} ${curve.y1} C ${midX} ${curve.y1}, ${midX} ${curve.y2}, ${curve.x2} ${curve.y2}`}
            pathLength={1}
            fill="none"
            stroke="var(--color-tangerine)"
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray="1"
            className="animate-[draw-line_550ms_cubic-bezier(0.65,0,0.35,1)_both] motion-reduce:animate-none"
          />
          <circle cx={curve.x1} cy={curve.y1} r={6} fill="var(--color-tangerine)" />
        </svg>
      )}

      <div className="mx-auto grid w-full max-w-[1200px] gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-x-24">
        <h2
          id="skills-title"
          className="font-gentle text-[clamp(36px,4.6vw,64px)] leading-[1.1] tracking-[-0.01em] text-black lg:col-start-2 lg:row-start-1 lg:text-right"
        >
          Skills and Tools
        </h2>

        {/* Categories */}
        <div role="tablist" aria-orientation="vertical" aria-label="Skill categories" onKeyDown={onKeyDown} className="flex flex-col gap-4 lg:col-start-1 lg:row-start-2 lg:gap-8 lg:self-center">
          {groups.map((g, i) => {
            const selected = i === active
            return (
              <button
                key={g.label}
                ref={(el) => {
                  tabRefs.current[i] = el
                }}
                type="button"
                role="tab"
                id={`skills-tab-${i}`}
                aria-selected={selected}
                aria-controls="skills-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => select(i)}
                onPointerEnter={(e) => e.pointerType === 'mouse' && select(i)}
                className={`cursor-pointer text-left font-gentle text-[clamp(24px,2.8vw,40px)] leading-[1.15] transition-colors duration-200 motion-reduce:transition-none ${
                  selected ? 'text-black' : 'text-black/35 hover:text-black/70'
                }`}
              >
                <span data-label className="inline-block lg:max-w-[10em]">
                  {g.label}
                </span>
              </button>
            )
          })}
        </div>

        {/* The box */}
        <div ref={boxRef} className="lg:col-start-2 lg:row-start-2 lg:ml-auto lg:w-full lg:max-w-[540px]">
          <div id="skills-panel" role="tabpanel" aria-labelledby={`skills-tab-${active}`}>
            <WindowCard title={group.file} className="hover:translate-y-0">
              <ul key={active} className="flex min-h-[230px] flex-col gap-3 lg:min-h-[340px] lg:gap-4 lg:py-2">
                {group.items.map((skill, i) => (
                  <li
                    key={skill}
                    style={{ animationDelay: `${120 + i * 50}ms` }}
                    className="flex animate-[fade-up_400ms_ease-out_both] items-center gap-3 font-babel text-[20px] leading-[1.45] lg:text-[24px] tracking-[0.3px] text-navy motion-reduce:animate-none"
                  >
                    <span aria-hidden className="size-2 shrink-0 rounded-[2px] bg-tangerine" />
                    {skill}
                  </li>
                ))}
              </ul>
            </WindowCard>
          </div>
        </div>
      </div>
    </section>
  )
}
