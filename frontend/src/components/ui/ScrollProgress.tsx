import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import './ScrollProgress.css'

export function ScrollProgress() {
  const reduced = useReducedMotion() === true
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 })

  if (reduced) return null
  return <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />
}