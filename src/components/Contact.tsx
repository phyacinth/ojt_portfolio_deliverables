import { assets, links } from '../lib/assets'
import { Stars, VLine } from './Decor'
import { ButtonLink } from './ui'

const details = ['Open to on-site, hybrid or remote', 'Malolos, Bulacan', 'Available 2nd Sem A.Y. 2026–2027']

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative z-10 mb-[56px] bg-cream shadow-[0px_16px_0px_0px_#f70] lg:shadow-[0px_20px_0px_0px_#f70]"
    >
      <div className="relative mx-auto max-w-[1440px] pt-12 pb-12 lg:pt-14 lg:pb-14">
        <div className="lg:hidden">
          <Stars smallTop={28} className="top-[12px] left-[-5px]" />
          <VLine src={assets.skillsLineMobileLong} length={193} className="top-[90px] left-[32px]" />
          <VLine src={assets.skillsLineMobileShort} length={145} className="top-[108px] left-[49px]" />
        </div>
        <div className="hidden lg:block">
          <Stars smallTop={27} className="top-[24px] left-[37px]" />
          <VLine src={assets.skillsLineLong} length={137} className="top-[102px] left-[74px]" />
          <VLine src={assets.skillsLineShort} length={92} className="top-[113px] left-[91px]" />
        </div>

        {/* Heading sits clear of the stars/lines on every width. */}
        <div className="flex flex-col items-center pr-5 pl-[88px] md:px-[100px] lg:px-[160px]">
          <h2
            id="contact-title"
            className="max-w-[820px] text-center font-gentle text-[26px] leading-[1.45] tracking-[-0.13px] [text-wrap:balance] text-black md:text-[32px] md:tracking-[-0.16px]"
          >
            Interested in bringing me onto your team for OJT? <span className="block text-tangerine">Let’s connect.</span>
          </h2>

          <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row">
            <ButtonLink href={links.email}>Email Me</ButtonLink>
            <ButtonLink href={links.linkedin} variant="outlineLight">
              View LinkedIn
            </ButtonLink>
          </div>

          {/* Each part stays on one line; wrapping happens only at the separators. */}
          <p className="mt-5 max-w-[820px] text-center font-babel text-[15px] leading-[1.6] tracking-[0.5px] text-navy/75">
            {details.map((part, i) => (
              <span key={part}>
                {i > 0 && ' · '}
                <span className="whitespace-nowrap">{part}</span>
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  )
}
