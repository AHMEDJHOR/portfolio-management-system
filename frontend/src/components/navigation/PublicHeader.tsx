import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ThemeToggle } from '../theme/ThemeToggle'
import './PublicHeader.css'

interface NavItem {
  label: string
  to: string
}

const NAV_ITEMS: readonly NavItem[] = [
  { label: 'About', to: '/about' },
  { label: 'Skills', to: '/#skills' },
  { label: 'Projects', to: '/projects' },
  { label: 'Experience', to: '/#experience' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
]

const MOBILE_MENU_ID = 'mobile-navigation'
const SCROLL_THRESHOLD = 8
const DESKTOP_QUERY = '(min-width: 48rem)'

interface NavItemLinkProps {
  item: NavItem
  onNavigate?: () => void
}

function NavItemLink({ item, onNavigate }: NavItemLinkProps) {
  const location = useLocation()

  // NavLink only compares pathnames, so "/#skills" and "/#experience" would
  // both look active on "/". Hash links compare the full path + hash instead.
  if (item.to.includes('#')) {
    const isActive = `${location.pathname}${location.hash}` === item.to
    return (
      <Link
        to={item.to}
        className={isActive ? 'public-header__link is-active' : 'public-header__link'}
        aria-current={isActive ? 'location' : undefined}
        onClick={onNavigate}
      >
        {item.label}
      </Link>
    )
  }

  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        isActive ? 'public-header__link is-active' : 'public-header__link'
      }
      onClick={onNavigate}
    >
      {item.label}
    </NavLink>
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
  const [isScrolled, setIsScrolled] = useState(() => window.scrollY > SCROLL_THRESHOLD)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

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
          AHMED JHOR
        </Link>

        <div className="public-header__actions">
          <nav className="public-header__nav" aria-label="Primary">
            <ul className="public-header__list">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <NavItemLink item={item} />
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
                    <li key={item.to}>
                      <NavItemLink item={item} onNavigate={closeMenu} />
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