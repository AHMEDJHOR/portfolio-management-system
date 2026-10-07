import { useEffect, useRef, useState } from 'react'
import { animate, useInView, useReducedMotion } from 'framer-motion'
import { YEARS_OF_EXPERIENCE } from '../../config/site'
import { useProjects, useSkills } from '../../hooks/usePortfolio'
import { useI18n } from '../../i18n/useI18n'
import './Stats.css'

function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const reduced = useReducedMotion() === true
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView || reduced) return
    const controls = animate(0, to, {
      duration: 1.4,
      ease: 'easeOut',
      onUpdate: (latest) => setValue(Math.round(latest)),
    })
    return () => controls.stop()
  }, [inView, reduced, to])

  return (
    <span ref={ref}>
      {reduced ? to : value}
      {suffix}
    </span>
  )
}

export function StatsStrip() {
  const { t } = useI18n()
  const projects = useProjects()
  const skills = useSkills()

  const stats = [
    { value: YEARS_OF_EXPERIENCE, suffix: '+', label: t('stats.years') },
    { value: projects.data?.length ?? 0, suffix: '', label: t('stats.projects') },
    { value: skills.data?.length ?? 0, suffix: '', label: t('stats.skills') },
  ]

  return (
    <section className="stats" aria-label={t('stats.aria')}>
      <dl className="stats__grid">
        {stats.map((stat) => (
          <div key={stat.label} className="stats__item">
            <dd className="stats__value">
              <CountUp to={stat.value} suffix={stat.suffix} />
            </dd>
            <dt className="stats__label">{stat.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  )
}