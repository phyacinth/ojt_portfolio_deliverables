import { useRef, useState } from 'react'
import { assets, links } from '../lib/assets'
import { GlassCircle } from './Decor'
import { ButtonLink, InfoBox } from './ui'

const cvDownloadName = links.cvFile === '#' ? undefined : 'Andrei-Acosta-CV.pdf'

function HeroCard() {
  const [flipped, setFlipped] = useState(false)
  // Skip the shuffle animation on first paint; only animate after an interaction.
  const [animate, setAnimate] = useState(false)
  const lastPointer = useRef<string>('mouse')

  const flip = (next: boolean | ((f: boolean) => boolean)) => {
    setAnimate(true)
    setFlipped(next)
  }

  const deck = (isFront: boolean) => (animate ? (isFront ? 'deck-to-front' : 'deck-to-back') : isFront ? 'z-20' : 'z-10')

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label="Andrei Acosta introduction card. Activate to flip."
      onPointerDown={(e) => (lastPointer.current = e.pointerType)}
      onPointerEnter={(e) => e.pointerType === 'mouse' && flip(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && flip(false)}
      onClick={() => lastPointer.current !== 'mouse' && flip((f) => !f)}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          flip((f) => !f)
        }
      }}
      className="relative mr-[11px] ml-[10px] h-[464px] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-butter focus-visible:ring-offset-4 focus-visible:ring-offset-black md:mx-auto md:w-[min(814px,calc(100%-48px))]"
    >
      {/* Cream card (back by default, front when flipped). It exits toward the bottom-left. */}
      <div className={`absolute inset-[3.66%_2.09%_0_0] bg-cream [--deck-x:-58%] [--deck-y:10%] [--deck-r:-5deg] ${deck(flipped)}`}>
        <div className="absolute top-1/2 right-6 left-8 -translate-y-1/2 md:top-[34.7%] md:right-[30.25%] md:left-[30.2%] md:translate-y-0">
          <div inert={!flipped} className="grid gap-y-[10px] text-left">
            <p className="font-babel text-[18px] leading-normal tracking-[2.7px] text-tangerine">Hi, I’m</p>
            <p className="font-gentle text-[min(38px,8.4vw)] leading-normal tracking-[min(5.7px,1.2vw)] whitespace-nowrap text-tangerine">Andrei Acosta</p>
            <p className="font-babel text-[18px] leading-normal tracking-[2.7px] text-navy">An aspiring UI/UX developer</p>
            <ButtonLink
              href={links.cvFile}
              download={cvDownloadName}
              tabIndex={flipped ? 0 : -1}
              onClick={(e) => e.stopPropagation()}
            >
              Download CV
            </ButtonLink>
          </div>
        </div>
      </div>

      {/* Yellow card (front by default). It exits toward the top-right. */}
      <div className={`absolute inset-[0_0_3.66%_2.09%] bg-butter [--deck-x:58%] [--deck-y:-10%] [--deck-r:5deg] ${deck(!flipped)}`}>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          {/* Left padding equal to the letter-spacing re-centres tracked text optically. */}
          <p className="pl-[22px] font-gentle text-[150px] leading-none tracking-[22px] whitespace-nowrap text-tangerine sm:pl-[28.5px] sm:text-[190px] sm:tracking-[28.5px]">
            AA
          </p>
          <p className="mt-4 pl-[min(6.12px,1.1vw)] font-neutral text-[18px] leading-normal tracking-[min(6.12px,1.1vw)] whitespace-nowrap text-tangerine sm:pl-[6.12px] sm:tracking-[6.12px]">
            open for internships!
          </p>
        </div>
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <section aria-label="Introduction" className="relative overflow-hidden pt-[206px] pb-[96px] md:pt-[247px] md:pb-[112px]">
      {/* Two soft glass circles behind the card */}
      <GlassCircle className="top-[-98px] right-[-99px] size-[221px] md:top-[-83px] md:right-[-66px] md:size-[474px]" />
      <GlassCircle className="top-[-12px] left-[-37px] size-[230px] md:top-[-37px] md:left-[41px] md:size-[379px]" />

      <HeroCard />

      <div className="relative mx-auto mt-8 flex max-w-[460px] flex-col gap-5 px-4 min-[492px]:px-0">
        <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2">
          <ButtonLink href={links.cvFile} download={cvDownloadName} widthClass="w-full">
            Download CV
          </ButtonLink>
          <ButtonLink href="#contact" variant="outline" widthClass="w-full">
            Contact Me
          </ButtonLink>
        </div>
        <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2">
          <InfoBox label="Target Hours">486 Hours</InfoBox>
          <InfoBox label="Availability">2nd Sem A.Y. 2026–2027</InfoBox>
        </div>
      </div>

      <div aria-hidden className="absolute inset-x-0 bottom-0 h-px">
        <img alt="" src={assets.heroLineMobile} className="block size-full max-w-none rotate-180 md:hidden" />
        <img alt="" src={assets.heroLine} className="hidden size-full max-w-none rotate-180 md:block" />
      </div>
    </section>
  )
}
