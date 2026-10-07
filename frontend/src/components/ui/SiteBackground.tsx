import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { useActiveSection } from '../../hooks/useActiveSection'
import { NAV_ITEMS } from '../../i18n/nav'
import './SiteBackground.css'

// Module-level, so the array identity is stable for the observer hook.
const SECTION_IDS = NAV_ITEMS.map((item) => item.id)
const TILE = 24 // px, must match background-size in the CSS

export function SiteBackground() {
  const { pathname } = useLocation()
  const reduced = useReducedMotion() === true
  const active = useActiveSection(SECTION_IDS, pathname === '/')
  const { scrollY } = useScroll()

  // Moves slower than the page and wraps by exactly one tile, so the loop is seamless.
  const gridY = useTransform(scrollY, (value) => -(value * 0.08) % TILE)

  return (
    <div className="site-bg" data-section={active ?? 'intro'} aria-hidden="true">
      <div className="site-bg__grid">
        <motion.div className="site-bg__dots" style={reduced ? undefined : { y: gridY }} />
      </div>
      <div className="site-bg__glow site-bg__glow--primary" />
      <div className="site-bg__glow site-bg__glow--secondary" />
      <div className="site-bg__glow site-bg__glow--tertiary" />
    </div>
  )
}