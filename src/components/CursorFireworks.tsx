import { useEffect, useRef } from 'react'

/** Every particle snaps to this grid so the effect reads as chunky retro pixels. */
const PIXEL = 4
/** Particles per click burst. */
const BURST_COUNT = 28
/** Mouse travel (px) between trail sparks. */
const TRAIL_EVERY_PX = 22
/** Hard cap so fast clicking can't pile up work. */
const MAX_PARTICLES = 400
/** Downward pull, px per frame². */
const GRAVITY = 0.09

const COLORS = ['#ff7700', '#f4d35e', '#faf0ca', '#ffffff']

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  /** Frames left to live, and the total it started with. */
  life: number
  maxLife: number
  color: string
  size: number
}

const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)]
const snap = (n: number) => Math.round(n / PIXEL) * PIXEL

/**
 * Page-wide pixel fireworks: each click bursts into tangerine/butter/cream squares that fall and
 * blink out, and the mouse leaves a faint spark trail. Draws on one fixed canvas that ignores
 * pointer events, and switches off entirely for people who prefer reduced motion.
 */
export function CursorFireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let particles: Particle[] = []
    let frame = 0
    let lastTrail: { x: number; y: number } | null = null

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.round(window.innerWidth * dpr)
      canvas.height = Math.round(window.innerHeight * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const tick = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      particles = particles.filter((p) => p.life > 0)
      for (const p of particles) {
        p.vy += GRAVITY
        p.vx *= 0.98
        p.vy *= 0.98
        p.x += p.vx
        p.y += p.vy
        p.life -= 1
        // Retro flicker: in the last third of its life a particle blinks on and off.
        const fading = p.life < p.maxLife / 3
        if (fading && p.life % 4 < 2) continue
        ctx.fillStyle = p.color
        ctx.fillRect(snap(p.x), snap(p.y), p.size, p.size)
      }
      frame = particles.length ? requestAnimationFrame(tick) : 0
    }

    const add = (batch: Particle[]) => {
      particles = [...particles, ...batch].slice(-MAX_PARTICLES)
      if (!frame) frame = requestAnimationFrame(tick)
    }

    const burst = (x: number, y: number) => {
      const batch: Particle[] = []
      for (let i = 0; i < BURST_COUNT; i++) {
        // Evenly spaced angles with a little jitter give a round shell rather than a blob.
        const angle = (i / BURST_COUNT) * Math.PI * 2 + Math.random() * 0.3
        const speed = 2.2 + Math.random() * 2.6
        const life = 40 + Math.floor(Math.random() * 25)
        batch.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1,
          life,
          maxLife: life,
          color: pick(COLORS),
          size: Math.random() < 0.3 ? PIXEL * 2 : PIXEL,
        })
      }
      add(batch)
    }

    const onPointerDown = (e: PointerEvent) => {
      if (motion.matches || e.button > 0) return
      burst(e.clientX, e.clientY)
    }

    const onPointerMove = (e: PointerEvent) => {
      if (motion.matches || e.pointerType !== 'mouse') return
      const last = lastTrail
      if (last && Math.hypot(e.clientX - last.x, e.clientY - last.y) < TRAIL_EVERY_PX) return
      lastTrail = { x: e.clientX, y: e.clientY }
      const life = 18 + Math.floor(Math.random() * 10)
      add([
        {
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 0.8,
          vy: Math.random() * 0.4,
          life,
          maxLife: life,
          color: pick(COLORS),
          size: PIXEL,
        },
      ])
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className='pointer-events-none fixed inset-0 z-[9999] h-full w-full'
    />
  )
}
