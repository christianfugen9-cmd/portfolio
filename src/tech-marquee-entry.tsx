import { createRoot } from 'react-dom/client'
import { Moon, Sun } from 'lucide-react'
import { TechMarquee } from './TechMarquee'

const mount = document.getElementById('tech-marquee-root')
if (mount) createRoot(mount).render(<TechMarquee />)

const themeToggle = document.getElementById('theme-toggle')
if (themeToggle) {
  createRoot(themeToggle).render(
    <>
      <Sun className="theme-icon-sun" size={18} aria-hidden="true" />
      <Moon className="theme-icon-moon" size={18} aria-hidden="true" />
    </>,
  )
}
