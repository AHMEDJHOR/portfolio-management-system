import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { useActiveSection } from '../../hooks/useActiveSection'
import { ThemeToggle } from '../theme/ThemeToggle'
import logo from '../../assets/logo.png'
import { ScrambleText } from '../ui/ScrambleText'
import './PublicHeader.css'

interface NavItem {
  id: string
  label: string
}

// Every item is a section of the home page.
const NAV_ITEMS: readonly NavItem[] = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'blog', label: 'Blog' },
  { id: 'contact', label: 'Contact' },
]
const SECTION_IDS = NAV_ITEMS.map((item) => item.id)

const MOBILE_MENU_ID = 'mobile-navigation'
const SCROLL_THRESHOLD = 8
const DESKTOP_QUERY = '(min-width: 48rem)'

interface NavItemLinkProps {
  item: NavItem
  isActive: boolean
  onNavigate?: () => void
}

function NavItemLink({ item, isActive, onNavigate }: NavItemLinkProps) {
  const location = useLocation()

  const handleClick = () => {
    // Same hash on the home page: the URL doesn't change, so scroll by hand.
    if (location.pathname === '/' && location.hash === `#${item.id}`) {
      document.getElementById(item.id)?.scrollIntoView()
    }
    onNavigate?.()
  }

  return (
    <Link
      to={`/#${item.id}`}
      className={isActive ? 'public-header__link is-active' : 'public-header__link'}
      aria-current={isActive ? 'location' : undefined}
      onClick={handleClick}
    >
      <ScrambleText>{item.label}</ScrambleText>
    </Link>
  )
}

function MenuIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      aria-hidden="true"
    >
      {isOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
    </svg>
  )
}

export function PublicHeader() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const [isScrolled, setIsScrolled] = useState(() => window.scrollY > SCROLL_THRESHOLD)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  // On Home, highlight the section being read; on archive/detail pages, highlight their section.
  const sectionInView = useActiveSection(SECTION_IDS, isHome)
  const routeSection = pathname.startsWith('/projects')
    ? 'projects'
    : pathname.startsWith('/blog')
      ? 'blog'
      : null
  const activeId = isHome ? sectionInView : routeSection

  const closeMenu = () => setIsMenuOpen(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > SCROLL_THRESHOLD)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!isMenuOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isMenuOpen])

  // Close the mobile panel if the viewport grows to the desktop layout.
  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY)
    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) setIsMenuOpen(false)
    }
    query.addEventListener('change', handleChange)
    return () => query.removeEventListener('change', handleChange)
  }, [])

  const isSolid = isScrolled || isMenuOpen

  return (
    <header className={isSolid ? 'public-header is-solid' : 'public-header'}>
      <div className="public-header__inner">
       <Link
  to="/"
  className="public-header__brand"
  aria-label="Ahmed Jhor, home"
  onClick={closeMenu}
>
  <img className="public-header__logo" src={logo} alt="" width={28} height={28} />
  <span><ScrambleText>AHMED JHOR</ScrambleText></span>
</Link>

        <div className="public-header__actions">
          <nav className="public-header__nav" aria-label="Primary">
            <ul className="public-header__list">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <NavItemLink item={item} isActive={activeId === item.id} />
                </li>
              ))}
            </ul>
          </nav>

          <div className="public-header__desktop-toggle">
            <ThemeToggle />
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            className="public-header__menu-button"
            aria-label="Menu"
            aria-expanded={isMenuOpen}
            aria-controls={MOBILE_MENU_ID}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <MenuIcon isOpen={isMenuOpen} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id={MOBILE_MENU_ID}
            className="public-header__panel"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <div className="public-header__panel-inner">
              <nav aria-label="Primary mobile">
                <ul className="public-header__panel-list">
                  {NAV_ITEMS.map((item) => (
                    <li key={item.id}>
                      <NavItemLink item={item} isActive={activeId === item.id} onNavigate={closeMenu} />
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="public-header__panel-theme">
                <span>Theme</span>
                <ThemeToggle />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}