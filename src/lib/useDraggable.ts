import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type RefObject } from 'react'

export type Offset = { x: number; y: number }
type Range = { minX: number; maxX: number; minY: number; maxY: number }

const RESET_MS = 300
const DRAG_THRESHOLD = 3
const DRAG_SCALE = 1.02
const KEY_STEP = 20
const KEY_STEP_LARGE = 60

const DRAG_QUERY = '(min-width: 1024px) and (pointer: fine)'

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

/** True on desktop-sized screens with a precise pointer, where window dragging is enabled. */
export function useDragEnabled() {
  const [enabled, setEnabled] = useState(() => typeof window !== 'undefined' && window.matchMedia(DRAG_QUERY).matches)
  useEffect(() => {
    const mql = window.matchMedia(DRAG_QUERY)
    const onChange = () => setEnabled(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])
  return enabled
}

type Options = {
  enabled: boolean
  /** Window title, used in the handle's accessible label. */
  label: string
  /** Element whose box the card may not leave. */
  boundsRef: RefObject<HTMLElement | null>
  /** Called when the card is pressed or moved, e.g. to bring it to the front. */
  onActivate?: () => void
  onMovedChange?: (moved: boolean) => void
  /** Incrementing this sends the card home (animated). */
  resetToken?: number
}

/**
 * Drag a card by its title bar. The card keeps its layout position as "home";
 * the offset is applied as `transform: translate()` before the card's rotation.
 */
export function useDraggable({ enabled, label, boundsRef, onActivate, onMovedChange, resetToken = 0 }: Options) {
  const cardRef = useRef<HTMLElement | null>(null)
  const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [animating, setAnimating] = useState(false)
  const drag = useRef<{ id: number; startX: number; startY: number; origin: Offset; range: Range; moved: boolean } | null>(null)
  const timer = useRef<number | undefined>(undefined)
  const callbacks = useRef({ onActivate, onMovedChange })
  callbacks.current = { onActivate, onMovedChange }

  /**
   * Extra movement allowed from the card's current on-screen box. Each side may
   * shrink by `inflate` (fraction of size) to leave room for the drag scale-up.
   * Zero is always allowed, so a card that starts slightly outside isn't pushed.
   */
  const getRange = (inflate = 0): Range | null => {
    const card = cardRef.current
    const bounds = boundsRef.current
    if (!card || !bounds) return null
    const r = card.getBoundingClientRect()
    const b = bounds.getBoundingClientRect()
    const ix = r.width * inflate
    const iy = r.height * inflate
    return {
      minX: Math.min(0, b.left - r.left + ix),
      maxX: Math.max(0, b.right - r.right - ix),
      minY: Math.min(0, b.top - r.top + iy),
      maxY: Math.max(0, b.bottom - r.bottom - iy),
    }
  }

  const goHome = useCallback((animate: boolean) => {
    drag.current = null
    setIsDragging(false)
    window.clearTimeout(timer.current)
    if (animate && !prefersReducedMotion()) {
      setAnimating(true)
      timer.current = window.setTimeout(() => setAnimating(false), RESET_MS)
    } else {
      setAnimating(false)
    }
    setOffset({ x: 0, y: 0 })
  }, [])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  // Dragging turned off (e.g. the window got narrow): snap home.
  useEffect(() => {
    if (!enabled) goHome(false)
  }, [enabled, goHome])

  useEffect(() => {
    if (resetToken > 0) goHome(true)
  }, [resetToken, goHome])

  const moved = offset.x !== 0 || offset.y !== 0
  useEffect(() => {
    callbacks.current.onMovedChange?.(moved)
  }, [moved])

  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
    if (e.button !== 0) return
    callbacks.current.onActivate?.()
    const range = getRange((DRAG_SCALE - 1) / 2)
    if (!range) return
    // Stop the press from starting a text selection.
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { id: e.pointerId, startX: e.clientX, startY: e.clientY, origin: offset, range, moved: false }
  }

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    const d = drag.current
    if (!d || e.pointerId !== d.id) return
    const dx = e.clientX - d.startX
    const dy = e.clientY - d.startY
    if (!d.moved) {
      if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return
      d.moved = true
      setIsDragging(true)
    }
    setOffset({ x: d.origin.x + clamp(dx, d.range.minX, d.range.maxX), y: d.origin.y + clamp(dy, d.range.minY, d.range.maxY) })
  }

  const endDrag = (e: PointerEvent<HTMLElement>) => {
    if (!drag.current || e.pointerId !== drag.current.id) return
    drag.current = null
    setIsDragging(false)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      goHome(true)
      return
    }
    const step = e.shiftKey ? KEY_STEP_LARGE : KEY_STEP
    const delta = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key]
    if (!delta) return
    e.preventDefault()
    callbacks.current.onActivate?.()
    const range = getRange()
    if (!range) return
    setOffset((prev) => ({ x: prev.x + clamp(delta[0], range.minX, range.maxX), y: prev.y + clamp(delta[1], range.minY, range.maxY) }))
  }

  const handleProps = enabled
    ? {
        role: 'button' as const,
        tabIndex: 0,
        'aria-label': `Move ${label} window. Use arrow keys to move, Escape to reset.`,
        onPointerDown,
        onPointerMove,
        onPointerUp: endDrag,
        onPointerCancel: endDrag,
        onLostPointerCapture: endDrag,
        onKeyDown,
        onDoubleClick: () => goHome(true),
        style: {
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: isDragging ? 'none' : undefined,
          userSelect: isDragging ? 'none' : undefined,
        } satisfies CSSProperties,
      }
    : {}

  const style: CSSProperties | undefined = enabled
    ? {
        transform: `translate(${offset.x}px, ${offset.y}px) rotate(var(--card-rotate, 0deg))${isDragging ? ` scale(${DRAG_SCALE})` : ''}`,
        // Rotation now lives in `transform` (after the translate), so drop the standalone property.
        rotate: 'none',
        transition: animating ? `transform ${RESET_MS}ms ease-out` : isDragging ? 'none' : undefined,
      }
    : undefined

  return { cardRef, offset, isDragging, isMoved: moved, handleProps, style, reset: () => goHome(true) }
}
