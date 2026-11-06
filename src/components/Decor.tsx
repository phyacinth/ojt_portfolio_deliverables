import { assets } from '../lib/assets'

/** Vertical rule drawn from a horizontal 1px line asset, rotated like in the design. */
export function VLine({ src, length, className = '' }: { src: string; length: number; className?: string }) {
  return (
    <div aria-hidden className={`absolute flex w-0 items-center justify-center ${className}`} style={{ height: length }}>
      <div className="flex-none -rotate-90">
        <img alt="" src={src} width={length} height={1} className="block max-w-none" />
      </div>
    </div>
  )
}

export function HLine({ src, length, className = '' }: { src: string; length: number; className?: string }) {
  return (
    <div aria-hidden className={`absolute h-0 ${className}`} style={{ width: length }}>
      <img alt="" src={src} width={length} height={1} className="absolute -top-px left-0 block max-w-none" />
    </div>
  )
}

/** Pair of sparkle stars; the smaller star sits offset down-right of the large one. */
export function Stars({ smallTop, className = '' }: { smallTop: number; className?: string }) {
  return (
    <div aria-hidden className={`absolute h-[74px] w-[136px] ${className}`}>
      <img alt="" src={assets.star} className="absolute left-0 top-0 size-[74px] object-cover" />
      <img alt="" src={assets.star} className="absolute left-[23px] size-[62px] object-cover" style={{ top: smallTop }} />
    </div>
  )
}

/** Soft circle: faint white fill and edge. No backdrop blur, since blurring the stripe texture reads as a grey smudge. */
export function GlassCircle({ className }: { className: string }) {
  return <div aria-hidden className={`absolute rounded-full border border-white/10 bg-white/[0.04] ${className}`} />
}
