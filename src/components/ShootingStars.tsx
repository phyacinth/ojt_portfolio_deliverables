import { useEffect, useRef, useSyncExternalStore, type CSSProperties } from 'react'

/** Scroll distance (px, either direction) per new star. */
const SPAWN_EVERY_PX = 200
/** Never more than this many in flight. */
const MAX_STARS = 6

type Star = { id: number; x: number; scale: number; duration: number }

// ---- Shared star list -------------------------------------------------------------------------
// One spawner, several layers: the page-wide white layer plus a charcoal copy inside each cream
// area. Every layer renders the same stars at the same viewport positions.

let stars: Star[] = []
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())
const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => listeners.delete(l)
}
const getStars = () => stars

function addStar(star: Star) {
  stars = [...stars.slice(-(MAX_STARS - 1)), star]
  emit()
  // Remove once its flight is over (each layer animates it independently).
  setTimeout(() => {
    stars = stars.filter((s) => s.id !== star.id)
    emit()
  }, star.duration + 100)
}

// ---- Drawing ----------------------------------------------------------------------------------

/** Four-point sparkle, drawn in a 2×2 box centred on 0,0. */
const SPARKLE = 'M0 -1 C0.12 -0.12 0.12 -0.12 1 0 C0.12 0.12 0.12 0.12 0 1 C-0.12 0.12 -0.12 0.12 -1 0 C-0.12 -0.12 -0.12 -0.12 0 -1 Z'

const TONES = { light: '#fff', dark: '#111' }

/** The site's star-and-trail motif: big sparkle, small sparkle, two trailing lines. */
function StarMark({ tone }: { tone: keyof typeof TONES }) {
  const color = TONES[tone]
  const gradient = `star-trail-${tone}`
  return (
    <svg aria-hidden width="70" height="230" viewBox="0 0 70 230" overflow="visible">
      <defs>
        <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="23" y="44" width="1.5" height="180" fill={`url(#${gradient})`} />
      <rect x="40" y="56" width="1" height="120" fill={`url(#${gradient})`} />
      <path d={SPARKLE} transform="translate(24 24) scale(24)" fill={color} />
      <path d={SPARKLE} transform="translate(41 42) scale(17)" fill={color} />
    </svg>
  )
}

/** The current stars, fixed to the viewport, in one colour. */
function StarLayer({ tone, className = '' }: { tone: keyof typeof TONES; className?: string }) {
  const list = useSyncExternalStore(subscribe, getStars, getStars)
  return (
    <div aria-hidden className={`pointer-events-none fixed inset-0 overflow-hidden ${className}`}>
      {list.map((s) => (
        <div
          key={s.id}
          className="absolute top-full animate-[shoot-up_var(--dur)_cubic-bezier(0.2,0.7,0.3,1)_both]"
          style={{ left: `${s.x}%`, '--dur': `${s.duration}ms`, scale: s.scale } as CSSProperties}
        >
          <StarMark tone={tone} />
        </div>
      ))}
    </div>
  )
}

/**
 * A copy of the stars confined to one area: charcoal for cream areas, or white for a black area
 * that hides the page-wide layer. Place it as the first child of that element (which must be
 * positioned and form a stacking context). `clip-path` confines the fixed layer to the element, so
 * the stars change colour exactly where the area begins; `z` keeps it under the content.
 */
export function SectionStars({ tone = 'dark', z = '-z-10' }: { tone?: keyof typeof TONES; z?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 ${z} [clip-path:inset(0)]`}>
      <StarLayer tone={tone} />
    </div>
  )
}

/**
 * Shooting stars that rise from the bottom of the screen as the visitor scrolls. This white layer
 * sits behind all page content (z-0, before <main>), so it shows through the black areas; cream
 * areas render their own charcoal copy with <SectionStars />. Purely decorative.
 */
export function ShootingStars() {
  const nextId = useRef(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let lastY = window.scrollY
    let travelled = 0
    let leftSide = Math.random() < 0.5

    const onScroll = () => {
      const y = window.scrollY
      travelled += Math.abs(y - lastY)
      lastY = y
      if (travelled < SPAWN_EVERY_PX) return
      travelled = 0

      // Alternate halves so they spread out; content in front hides any that land behind it.
      leftSide = !leftSide
      const x = leftSide ? 3 + Math.random() * 44 : 53 + Math.random() * 44
      addStar({ id: nextId.current++, x, scale: 0.55 + Math.random() * 0.45, duration: 1400 + Math.random() * 700 })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return <StarLayer tone="light" className="z-0" />
}
