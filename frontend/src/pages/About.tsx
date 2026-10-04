import { Link } from 'react-router-dom'
import { useProfile } from '../hooks/usePortfolio'
import { ScrambleText } from '../components/ui/ScrambleText'
import './About.css'

interface Highlight {
  label: string
  value: string
  description: string
}

interface AboutContent {
  label: string
  headline: string
  intro: string
  body: readonly string[]
  highlightsTitle: string
  highlights: readonly Highlight[]
}

// Static content lives in one object so it can later be swapped for Profile API data
// without touching the markup below.
const ABOUT: AboutContent = {
  label: 'About',
  headline: 'Full-stack developer focused on dependable products.',
  intro:
    'I design and build web applications end to end, from the interface people use to the APIs and data underneath it.',
  body: [
    'My background in Information Systems shapes how I approach software: as a system of people, data and processes, not just screens and endpoints. I care about clear structure, predictable behavior and code that stays easy to change.',
    'I enjoy the whole path from idea to production: modelling the data, defining the API contract, building the interface, and making sure the result is reliable for the people who depend on it.',
  ],
  highlightsTitle: 'At a glance',
  highlights: [
    {
      label: 'Focus',
      value: 'Full-stack development',
      description: 'Interfaces, services and data designed to work together.',
    },
    {
      label: 'Background',
      value: 'Information Systems',
      description: 'A foundation in how software supports real organizations.',
    },
    {
      label: 'Backend',
      value: 'API development',
      description: 'Structured REST APIs with clear contracts.',
    },
    {
      label: 'Core stack',
      value: 'PostgreSQL, React, Node.js',
      description: 'The tools I reach for to ship dependable products.',
    },
  ],
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

export function About() {
  const { data: profile } = useProfile()
  const body = profile?.bio ? [profile.bio, ...ABOUT.body.slice(1)] : ABOUT.body
  return (
    <section id="about" className="about-page" aria-labelledby="about-title">
      <div className="about-page__inner">
        <header className="about-page__header">
          <p className="about-page__label">{ABOUT.label}</p>
          <h2 id="about-title" className="about-page__title">
            {ABOUT.headline}
          </h2>
          <p className="about-page__intro">{ABOUT.intro}</p>
        </header>

        <div className="about-page__content">
          <div className="about-page__body">
            {body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="about-page__highlights">
            <h2 className="about-page__subtitle">{ABOUT.highlightsTitle}</h2>
            <ul className="about-page__grid">
              {ABOUT.highlights.map((highlight) => (
                <li key={highlight.label} className="about-page__card">
                  <span className="about-page__card-label">{highlight.label}</span>
                  <p className="about-page__card-value">{highlight.value}</p>
                  <p className="about-page__card-text">{highlight.description}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="about-page__actions">
            <Link to="/#projects" className="about-page__button about-page__button--primary">
              <ScrambleText>View projects</ScrambleText>
              <ArrowIcon />
            </Link>
            <Link to="/#contact" className="about-page__button about-page__button--ghost">
              <ScrambleText>Contact me</ScrambleText>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}