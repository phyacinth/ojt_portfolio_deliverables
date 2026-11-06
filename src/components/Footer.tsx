import { assets, externalProps, links } from '../lib/assets'
import { SectionStars } from './ShootingStars'

const socials = [
  { label: 'GitHub', href: links.github, src: assets.footerGithub },
  { label: 'LinkedIn', href: links.linkedin, src: assets.footerLinkedin },
  { label: 'Figma', href: links.figma, src: assets.footerFigma },
  { label: 'Email Andrei', href: links.email, src: assets.email },
]

/** Compact one-band footer: sign-off and credits on the left, socials and back-to-top on the right. */
export function Footer() {
  return (
    <footer className="relative z-10 overflow-clip bg-cream px-[15px] md:px-16">
      <SectionStars />
      <div className="flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <p className="font-babel text-[18px] leading-[1.2] font-semibold tracking-[0.5px] text-tangerine">Let’s Make it Happen</p>
          <p className="font-babel text-[12px] leading-[1.5] tracking-[0.5px] text-navy/70">
            © 2026 Andrei Acosta · College of Industrial Technology, Bulacan State University
          </p>
        </div>

        <div className="flex items-center gap-5">
          <nav aria-label="Social links" className="flex items-center gap-4">
            {socials.map((item) => (
              <a key={item.label} href={item.href} {...externalProps(item.href)} aria-label={item.label} className="block size-5 transition-transform hover:-translate-y-0.5">
                <img alt="" aria-hidden src={item.src} className="block size-full" />
              </a>
            ))}
          </nav>
          <span aria-hidden className="h-4 w-px bg-navy/20" />
          <a
            href="#top"
            className="font-babel text-[14px] leading-none tracking-[1px] text-navy decoration-tangerine decoration-2 underline-offset-4 transition-colors hover:text-tangerine hover:underline"
          >
            ↑ Back to top
          </a>
        </div>
      </div>
    </footer>
  )
}
