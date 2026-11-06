import type { CSSProperties, HTMLAttributes, MouseEventHandler, ReactNode, Ref } from 'react'
import { externalProps } from '../lib/assets'

const buttonBase =
  'relative inline-flex h-[48px] shrink-0 items-center justify-center rounded-[8px] border px-4 transition-[translate,box-shadow,background-color,color,border-color] duration-200 ease-out hover:-translate-y-[2px] hover:shadow-[0px_8px_16px_-8px_rgba(0,0,0,0.45)] motion-reduce:hover:translate-y-0'

const buttonText = 'font-dot text-[16px] leading-none font-medium tracking-[1.5px] whitespace-nowrap'

const variants = {
  // Butter at rest (navy text for contrast), tangerine with white text on hover.
  butter: 'border-white/60 bg-butter text-navy hover:border-tangerine hover:bg-tangerine hover:text-white',
  // Tangerine outline for dark backgrounds.
  outline: 'border-tangerine bg-transparent text-tangerine hover:bg-tangerine hover:text-white',
  // Outline for cream backgrounds: navy text keeps it readable, tangerine border keeps the accent.
  outlineLight: 'border-tangerine bg-transparent text-navy hover:bg-tangerine hover:text-white',
}

type ButtonLinkProps = {
  href: string
  children: ReactNode
  variant?: keyof typeof variants
  /** Width utilities; buttons are a fixed 215px by default so pairs match. */
  widthClass?: string
  className?: string
  onClick?: MouseEventHandler<HTMLAnchorElement>
  tabIndex?: number
  download?: string
}

export function ButtonLink({ href, children, variant = 'butter', widthClass = 'w-[215px]', className = '', onClick, tabIndex, download }: ButtonLinkProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      tabIndex={tabIndex}
      download={download}
      {...externalProps(href)}
      className={`${buttonBase} ${variants[variant]} ${widthClass} ${className}`}
    >
      <span className={buttonText}>{children}</span>
    </a>
  )
}

/** Cream box with tangerine border: small uppercase label over a value. */
export function InfoBox({ label, children, className = '' }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={`flex min-h-[84px] min-w-0 flex-col justify-center gap-1 rounded-[12px] border border-tangerine bg-cream px-5 py-4 text-left ${className}`}>
      <span className="font-babel text-[12px] leading-[1.45] tracking-[2px] text-tangerine uppercase">{label}</span>
      {/* Wrap only at spaces; break inside a word only if it would otherwise overflow the box. */}
      <span className="font-babel text-[16px] leading-[1.45] tracking-[0.5px] break-normal [overflow-wrap:break-word] text-navy sm:text-[17px]">{children}</span>
    </div>
  )
}

const titleSizes = {
  default: 'text-[24px] leading-[2.181] tracking-[4.8px]',
  // Large centred heading (e.g. behind the project cards): scales with the viewport.
  display: 'text-center text-[clamp(40px,8.4vw,104px)] leading-[1.1] tracking-[0.18em]',
}

export function SectionTitle({ accent, id, size = 'default', className = '' }: { accent: string; id: string; size?: keyof typeof titleSizes; className?: string }) {
  return (
    <h2 id={id} className={`font-gentle text-white ${titleSizes[size]} ${className}`}>
      My <span className="text-tangerine">{accent}</span>
    </h2>
  )
}

type WindowDragProps = {
  /** Props for the title bar (pointer/keyboard handlers, role, label). */
  handleProps: HTMLAttributes<HTMLDivElement>
  style?: CSSProperties
  isDragging: boolean
  zIndex?: number
  cardRef?: Ref<HTMLElement>
  /** Called on any press inside the card (bring to front). */
  onActivate?: () => void
}

type WindowCardProps = {
  title: string
  children: ReactNode
  /** Navy title bar with cream controls, for one contrasting card. */
  variant?: 'default' | 'accent'
  /** Drop the body padding (e.g. for edge-to-edge images). */
  flush?: boolean
  className?: string
  /** Makes the card draggable by its title bar; omit for a static card. */
  drag?: WindowDragProps
}

/**
 * Retro "desktop window": butter title bar with three hollow controls over a cream body.
 * Tilt a card with the `--card-rotate` custom property (e.g. `lg:[--card-rotate:1deg]`).
 */
export function WindowCard({ title, children, variant = 'default', flush = false, className = '', drag }: WindowCardProps) {
  const accent = variant === 'accent'
  return (
    <article
      ref={drag?.cardRef}
      aria-label={title}
      onPointerDownCapture={drag?.onActivate}
      style={drag ? { ...drag.style, zIndex: drag.zIndex } : undefined}
      className={`overflow-hidden rounded-[14px] border-2 border-tangerine bg-cream shadow-[6px_6px_0px_0px_#ff7700] [rotate:var(--card-rotate,0deg)] transition-[translate,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#ff7700] motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
        drag?.isDragging ? 'cursor-grabbing shadow-[10px_10px_0px_0px_#ff7700]!' : ''
      } ${className}`}
    >
      <div
        {...drag?.handleProps}
        className={`flex h-[44px] items-center gap-3 border-b-2 border-tangerine px-4 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-inset ${
          accent ? 'bg-navy focus-visible:ring-cream' : 'bg-butter focus-visible:ring-navy'
        }`}
      >
        <span aria-hidden className="flex shrink-0 gap-[6px]">
          {[0, 1, 2].map((i) => (
            <span key={i} className={`size-[14px] rounded-full border-2 ${accent ? 'border-cream bg-cream' : 'border-navy bg-cream'}`} />
          ))}
        </span>
        <span className={`truncate font-babel text-[14px] leading-none font-semibold tracking-[2px] uppercase ${accent ? 'text-cream' : 'text-navy'}`}>{title}</span>
      </div>
      <div className={flush ? '' : 'px-5 py-6 sm:px-7'}>{children}</div>
    </article>
  )
}
