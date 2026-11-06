import { assets, externalProps, links } from '../lib/assets'
import { ButtonLink } from './ui'

const socials = [
  { label: 'Instagram', href: links.instagram, src: assets.footerInstagram },
  { label: 'LinkedIn', href: links.linkedin, src: assets.footerLinkedin },
  { label: 'Email Andrei', href: links.email, src: assets.email },
]

export function Footer() {
  return (
    <footer className="relative z-10 overflow-clip border-t border-black/15 bg-cream px-[15px] md:px-16">
      <div className="flex min-h-[162px] items-center justify-between gap-6 py-10">
        <p className="min-w-px flex-1 font-babel text-[22px] leading-[1.2] font-semibold tracking-[0.5px] text-tangerine">Let’s Make it Happen</p>
        <nav aria-label="Social links" className="flex shrink-0 items-center gap-6">
          {socials.map((item) => (
            <a key={item.label} href={item.href} {...externalProps(item.href)} aria-label={item.label} className="block size-6 transition-transform hover:-translate-y-0.5">
              <img alt="" aria-hidden src={item.src} className="block size-full" />
            </a>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-6 border-t border-black/10 py-8 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1 font-babel text-[14px] leading-[1.6] tracking-[0.5px] text-navy/70">
          <p>© 2026 Andrei Acosta. All Rights Reserved.</p>
          <p>College of Industrial Technology, Bulacan State University</p>
        </div>
        <ButtonLink href="#top" variant="outlineLight" widthClass="w-full md:w-[215px]">
          ↑ Back to Top
        </ButtonLink>
      </div>
    </footer>
  )
}
