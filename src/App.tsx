import { useEffect } from 'react'
import { About } from './components/About'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Projects } from './components/Projects'
import { Skills } from './components/Skills'
import { assets } from './lib/assets'

export default function App() {
  // Placeholder links (href="#") should not jump to the top of the page.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as Element | null)?.closest?.('a')
      if (anchor?.getAttribute('href') === '#') e.preventDefault()
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return (
    <div id="top" className="relative min-h-dvh overflow-x-clip bg-black">
      {/* Diagonal Lines/6px texture */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-size-[6px_6px] bg-top-left opacity-50" style={{ backgroundImage: `url("${assets.pattern}")` }} />
      <Header />
      <main className="relative">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
