import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { Link } from 'react-router-dom'
import heroImage from '../../assets/hero.png'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { SceneBoundary } from './SceneBoundary'
import type { Detail } from './scene/config'
import { useHeroPointer } from './useHeroPointer'
import { hasWebGL } from './webgl'
import './Hero.css'

// Three.js lives in its own chunk, so text and portrait paint without waiting for it.
const HeroScene = lazy(() => import('./HeroScene').then((m) => ({ default: m.HeroScene })))

const content: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

// CSS-only stand-in with the same story: developer core → data/backend → engineering/production.
// Shown while the 3D chunk loads, if WebGL is missing, or if the scene throws.
function StaticOrbits() {
  return (
    <div className="hero__orbits-static">
      <span className="hero__orbit hero__orbit--core">
        <i />
      </span>
      <span className="hero__orbit hero__orbit--data">
        <i />
      </span>
      <span className="hero__orbit hero__orbit--production">
        <i />
      </span>
      <b className="hero__orbit-core" />
    </div>
  )
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion() === true
  const hasFinePointer = useMediaQuery('(hover: hover) and (pointer: fine)')
  const isTablet = useMediaQuery('(min-width: 48rem)')
  const isDesktop = useMediaQuery('(min-width: 64rem)')
  const [canRenderScene] = useState(hasWebGL)
  const [isInView, setIsInView] = useState(true)

  const pointer = useHeroPointer(sectionRef, hasFinePointer && !prefersReducedMotion)
  const detail: Detail = isDesktop ? 3 : isTablet ? 2 : 1

  // Stop the render loops while the Hero is scrolled out of view.
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) setIsInView(entry.isIntersecting)
    })
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="hero" className="hero" ref={sectionRef} aria-labelledby="hero-title">
      <div className="hero__backdrop" aria-hidden="true" />

      <div className="hero__inner">
        <motion.div className="hero__content" variants={content} initial="hidden" animate="show">
          <motion.p className="hero__status" variants={item}>
            <span className="hero__status-dot" aria-hidden="true" />
            Available for opportunities
          </motion.p>

          <motion.h1 id="hero-title" className="hero__title" variants={item}>
            <span className="hero__name-line">Ahmed</span> <span className="hero__name-line">Jhor</span>{' '}
            <span className="hero__role">Full-Stack Developer</span>
          </motion.h1>

          <motion.p className="hero__description" variants={item}>
            I build reliable digital products and thoughtful interfaces across the full stack.
          </motion.p>

          <motion.div className="hero__actions" variants={item}>
            <Link to="/projects" className="hero__button hero__button--primary">
              View projects
              <ArrowIcon />
            </Link>
            <Link to="/contact" className="hero__button hero__button--ghost">
              Contact me
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero__stage"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
        >
          {/* Layer 1: orbit geometry behind the portrait plane. */}
          <div className="hero__scene" aria-hidden="true">
            {canRenderScene ? (
              <SceneBoundary fallback={<StaticOrbits />}>
                <Suspense fallback={<StaticOrbits />}>
                  <HeroScene
                    layer="back"
                    detail={detail}
                    pointer={pointer}
                    active={isInView}
                    reducedMotion={prefersReducedMotion}
                  />
                </Suspense>
              </SceneBoundary>
            ) : (
              <StaticOrbits />
            )}
          </div>

          {/* Layer 2: the portrait. */}
          <figure className="hero__portrait">
            <img
              className="hero__image"
              src={heroImage}
              alt="Portrait of Ahmed Jhor"
              decoding="async"
              fetchPriority="high"
            />
          </figure>

          {/* Layer 3: the same orbit system, clipped to the part in front of the portrait. */}
          {canRenderScene && (
            <div className="hero__scene hero__scene--front" aria-hidden="true">
              <SceneBoundary fallback={null}>
                <Suspense fallback={null}>
                  <HeroScene
                    layer="front"
                    detail={detail}
                    pointer={pointer}
                    active={isInView}
                    reducedMotion={prefersReducedMotion}
                  />
                </Suspense>
              </SceneBoundary>
            </div>
          )}
        </motion.div>
      </div>

      {/* Anchor only: the #about section doesn't exist yet. */}
      <motion.a
        href="#about"
        className="hero__scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.1 }}
      >
        <span>Scroll to explore</span>
        <span className="hero__scroll-arrow" aria-hidden="true">
          ↓
        </span>
      </motion.a>
    </section>
  )
}