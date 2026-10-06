import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ScrambleText } from '../components/ui/ScrambleText'
import { TypeText } from '../components/ui/TypeText'
import { useProfile } from '../hooks/usePortfolio'
import type { MessageKey } from '../i18n/messages'
import { useI18n } from '../i18n/useI18n'
import './About.css'

const HIGHLIGHTS: readonly { label: MessageKey; value: MessageKey; text: MessageKey }[] = [
  { label: 'about.h1.label', value: 'about.h1.value', text: 'about.h1.text' },
  { label: 'about.h2.label', value: 'about.h2.value', text: 'about.h2.text' },
  { label: 'about.h3.label', value: 'about.h3.value', text: 'about.h3.text' },
  { label: 'about.h4.label', value: 'about.h4.value', text: 'about.h4.text' },
]

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

export function About() {
  const { t, language } = useI18n()
  const { data: profile } = useProfile()
  const headerRef = useRef<HTMLElement>(null)
  const started = useInView(headerRef, { once: true, margin: '0px 0px -15% 0px' })

  const label = t('about.label')
  const headline = t('about.headline')
  const titleDelay = label.length * 34 + 120
  const introDelay = titleDelay + headline.length * 24 + 120

  const body = [
    language === 'en' && profile?.bio ? profile.bio : t('about.body1'),
    t('about.body2'),
  ]

  return (
    <section id="about" className="about-page" aria-labelledby="about-title">
      <div className="about-page__inner">
        <header ref={headerRef} className="about-page__header">
          <p className="about-page__label">
            <TypeText start={started} speed={34}>{label}</TypeText>
          </p>
          <h2 id="about-title" className="about-page__title">
            <TypeText start={started} delay={titleDelay} speed={24}>{headline}</TypeText>
          </h2>
          <p className="about-page__intro">
            <TypeText start={started} delay={introDelay} speed={9}>{t('about.intro')}</TypeText>
          </p>
        </header>

        <div className="about-page__content">
          <div className="about-page__body">
            {body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="about-page__highlights">
            <h3 className="about-page__subtitle">{t('about.glance')}</h3>
            <ul className="pf-grid">
              {HIGHLIGHTS.map((item) => (
                <li key={item.label} className="pf-card">
                  <span className="about-page__card-label">{t(item.label)}</span>
                  <p className="about-page__card-value">{t(item.value)}</p>
                  <p className="about-page__card-text">{t(item.text)}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="about-page__actions">
            <Link to="/#projects" className="about-page__button about-page__button--primary">
              <ScrambleText>{t('hero.viewProjects')}</ScrambleText>
              <ArrowIcon />
            </Link>
            <Link to="/#contact" className="about-page__button about-page__button--ghost">
              <ScrambleText>{t('hero.contactMe')}</ScrambleText>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}