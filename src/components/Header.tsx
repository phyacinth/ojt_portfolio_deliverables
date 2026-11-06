import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react'

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

const sectionIds = navItems.map((item) => item.href.slice(1))

/** Fraction of the viewport height where a section becomes "active" as its top passes it. */
const SPY_LINE = 0.4
const SCROLLED_AT = 80

/** Tracks which nav section crosses the 40% line. Null while the Hero is in view. */
function useActiveSection() {
  const [active, setActive] = useState<string | null>(null)
  useEffect(() => {
    const sections = sectionIds.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el)
    const visible = new Set<string>()
    const update = () => {
      const hit = sectionIds.find((id) => visible.has(id))
      if (hit) return setActive(hit)
      // Between sections keep the last one, but clear it once we're back above About (the Hero).
      const first = sections[0]
      if (first && first.getBoundingClientRect().top > window.innerHeight * SPY_LINE) setActive(null)
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) e.isIntersecting ? visible.add(e.target.id) : visible.delete(e.target.id)
        update()
      },
      // A thin band at 40% from the top of the viewport.
      { rootMargin: `-${SPY_LINE * 100}% 0px -${100 - SPY_LINE * 100}% 0px` },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])
  return active
}

/** `scrolled` flips past 80px; the progress bar is written straight to the DOM to avoid re-renders. */
function useScrollState(progressRef: RefObject<HTMLSpanElement | null>) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0
        if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`
        setScrolled(window.scrollY > SCROLLED_AT)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [progressRef])
  return scrolled
}

function Logo() {
  const circle = 'size-3 rounded-full border-2 border-navy bg-cream transition-colors duration-150 motion-reduce:transition-none'
  return (
    <a href="#top" aria-label="Andrei Acosta, back to top" className="group/logo flex items-center gap-[10px] rounded-[6px] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-navy">
      <span aria-hidden className="flex gap-[5px]">
        <span className={`${circle} group-hover/logo:bg-tangerine group-focus-visible/logo:bg-tangerine`} />
        <span className={`${circle} delay-[60ms] group-hover/logo:bg-butter group-focus-visible/logo:bg-butter`} />
        <span className={`${circle} delay-[120ms] group-hover/logo:bg-navy group-focus-visible/logo:bg-navy`} />
      </span>
      <span className="font-eternalo text-[18px] leading-none tracking-[3px] text-navy transition-colors group-hover/logo:text-tangerine group-focus-visible/logo:text-tangerine">
        A.A
      </span>
    </a>
  )
}

function StatusPill({ onClick }: { onClick?: () => void }) {
  return (
    <a
      href="#contact"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-tangerine px-3 py-1 font-babel text-[13px] leading-[1.45] tracking-[1px] whitespace-nowrap text-navy transition-colors hover:bg-tangerine/10 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-navy"
    >
      <span aria-hidden className="size-[7px] shrink-0 animate-[status-pulse_2s_ease-in-out_infinite] rounded-full bg-tangerine motion-reduce:animate-none" />
      Open for OJT
    </a>
  )
}

/** Desktop links with a butter pill that slides behind the active one. */
function DesktopNav({ active }: { active: string | null }) {
  const listRef = useRef<HTMLUListElement>(null)
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({})
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null)

  const measure = useCallback(() => {
    const el = active ? linkRefs.current[active] : null
    setPill(el ? { x: el.offsetLeft, w: el.offsetWidth } : null)
  }, [active])

  useLayoutEffect(measure, [measure])
  useEffect(() => {
    const ro = new ResizeObserver(measure)
    if (listRef.current) ro.observe(listRef.current)
    document.fonts?.ready.then(measure)
    return () => ro.disconnect()
  }, [measure])

  return (
    <nav aria-label="Primary" className="hidden sm:block">
      <ul ref={listRef} className="relative flex items-center gap-1">
        <span
          aria-hidden
          className="absolute top-0 left-0 h-8 rounded-full bg-butter transition-[transform,width,opacity] duration-[250ms] ease-out motion-reduce:transition-none"
          style={{ width: pill?.w ?? 0, transform: `translateX(${pill?.x ?? 0}px)`, opacity: pill ? 1 : 0 }}
        />
        {navItems.map((item) => {
          const id = item.href.slice(1)
          const isActive = active === id
          return (
            <li key={item.href} className="relative">
              <a
                ref={(el) => {
                  linkRefs.current[id] = el
                }}
                href={item.href}
                aria-current={isActive ? 'true' : undefined}
                className={`group/link flex h-8 items-center rounded-full px-2 font-babel text-[16px] leading-none tracking-[0.3px] transition-[color,opacity] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-navy ${
                  isActive ? 'font-semibold text-navy' : 'text-navy/80 hover:text-navy focus-visible:text-navy'
                }`}
              >
                <span
                  className={`relative after:absolute after:inset-x-0 after:-bottom-1 after:h-[2px] after:origin-left after:scale-x-0 after:bg-tangerine after:transition-transform after:duration-200 motion-reduce:after:transition-none ${
                    isActive ? '' : 'group-hover/link:after:scale-x-100 group-focus-visible/link:after:scale-x-100'
                  }`}
                >
                  {item.label}
                </span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export function Header() {
  const [open, setOpen] = useState(false)
  const progressRef = useRef<HTMLSpanElement>(null)
  const scrolled = useScrollState(progressRef)
  const active = useActiveSection()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header
      className={`fixed top-3 left-1/2 z-50 w-[min(1200px,calc(100%-24px))] -translate-x-1/2 overflow-hidden rounded-[14px] border-2 border-tangerine transition-[box-shadow,background-color] duration-200 motion-reduce:transition-none ${
        scrolled || open ? 'bg-cream shadow-[3px_3px_0px_0px_#ff7700]' : 'bg-cream/92 shadow-[4px_4px_0px_0px_#ff7700] backdrop-blur-sm'
      }`}
    >
      <div className={`flex items-center justify-between px-4 transition-[height] duration-200 motion-reduce:transition-none sm:px-5 ${scrolled ? 'h-[44px]' : 'h-[52px]'}`}>
        <Logo />

        <div className="hidden items-center gap-3 sm:flex">
          <DesktopNav active={active} />
          <span aria-hidden className="h-5 w-px bg-navy/20" />
          <StatusPill />
        </div>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
          className="-mr-2 flex size-10 flex-col items-center justify-center gap-[5px] rounded-[8px] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-navy sm:hidden"
        >
          <span aria-hidden className={`block h-[2px] w-6 bg-navy transition-transform duration-200 ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
          <span aria-hidden className={`block h-[2px] w-6 bg-navy transition-opacity duration-200 ${open ? 'opacity-0' : ''}`} />
          <span aria-hidden className={`block h-[2px] w-6 bg-navy transition-transform duration-200 ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
        </button>
      </div>

      <nav id="mobile-menu" aria-label="Mobile" hidden={!open} className="border-t-2 border-tangerine/30 px-3 pt-2 pb-4 sm:hidden">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = active === item.href.slice(1)
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive ? 'true' : undefined}
                  className={`block rounded-[10px] px-3 py-2.5 font-babel text-[17px] leading-[1.45] tracking-[0.5px] text-navy focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-navy ${
                    isActive ? 'bg-butter font-semibold' : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  {item.label}
                </a>
              </li>
            )
          })}
        </ul>
        <div className="mt-3 px-3">
          <StatusPill onClick={() => setOpen(false)} />
        </div>
      </nav>

      {/* Scroll progress along the inside bottom edge. */}
      <span aria-hidden className="pointer-events-none absolute inset-x-3 bottom-[2px] h-[2px] motion-reduce:hidden">
        <span ref={progressRef} className="block h-full origin-left scale-x-0 rounded-full bg-tangerine" />
      </span>
    </header>
  )
}
