import { useEffect } from 'react'
import { About } from './components/About'
import { Contact } from './components/Contact'
import { CursorFireworks } from './components/CursorFireworks'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Projects } from './components/Projects'
import { Skills } from './components/Skills'
import { ShootingStars } from './components/ShootingStars'

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
      <Header />
      <ShootingStars />
      <main className="relative">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <CursorFireworks />
    </div>
  )
}
