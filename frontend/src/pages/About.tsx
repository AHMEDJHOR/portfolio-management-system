import { Link } from 'react-router-dom'
import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { TypeText } from '../components/ui/TypeText'
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

  headline: 'Full-stack developer building practical, reliable web applications.',

  intro:
    'I build web applications across the frontend and backend, from user interfaces and APIs to databases and the systems that connect them.',

  body: [
    'I am an Information Systems student with hands-on experience in full-stack development. I work with technologies including TypeScript, React, Node.js, Express, Laravel, PHP, PostgreSQL, and MySQL, and I enjoy turning real requirements into clear, working software.',

    'My Information Systems background shapes how I think about software as more than just code. I consider the people, data, processes, and business needs behind a system. Through internships and personal projects, I have gained practical experience with database design, REST APIs, authentication, role-based access control, frontend-backend integration, and version control.',

    'I am continuously improving my skills by building real projects and learning how to take an application from an idea through development and toward production. I am especially interested in opportunities where I can contribute, learn from experienced developers, and grow as a full-stack developer.',
  ],

  highlightsTitle: 'At a glance',

  highlights: [
    {
      label: 'Focus',
      value: 'Full-stack development',
      description:
        'Building connected frontend, backend, API, and database systems.',
    },

    {
      label: 'Background',
      value: 'Information Systems',
      description:
        'Combining technology, data, processes, and real-world problem solving.',
    },

    {
      label: 'Frontend',
      value: 'React & TypeScript',
      description:
        'Building structured, responsive, and maintainable user interfaces.',
    },

    {
      label: 'Backend',
      value: 'Node.js & Laravel',
      description:
        'Developing REST APIs, authentication, and backend application logic.',
    },

    {
      label: 'Databases',
      value: 'PostgreSQL & MySQL',
      description:
        'Designing relational data structures, relationships, and application data.',
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

  const headerRef = useRef<HTMLElement>(null)
  const started = useInView(headerRef, {
    once: true,
    margin: '0px 0px -15% 0px',
  })

  const titleDelay = ABOUT.label.length * 34 + 120
  const introDelay = titleDelay + ABOUT.headline.length * 24 + 120

  const body = profile?.bio ? [profile.bio, ...ABOUT.body.slice(1)] : ABOUT.body

  return (
    <section id="about" className="about-page" aria-labelledby="about-title">
      <div className="about-page__inner">
        <header ref={headerRef} className="about-page__header">
          <p className="about-page__label">
            <TypeText start={started} speed={34}>
              {ABOUT.label}
            </TypeText>
          </p>

          <h2 id="about-title" className="about-page__title">
            <TypeText start={started} delay={titleDelay} speed={24}>
              {ABOUT.headline}
            </TypeText>
          </h2>

          <p className="about-page__intro">
            <TypeText start={started} delay={introDelay} speed={9}>
              {ABOUT.intro}
            </TypeText>
          </p>
        </header>

        <div className="about-page__content">
          <div className="about-page__body">
            {body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="about-page__highlights">
            <h2 className="about-page__subtitle">
              {ABOUT.highlightsTitle}
            </h2>

            <ul className="pf-grid">
              {ABOUT.highlights.map((highlight) => (
                <li key={highlight.label} className="pf-card">
                  <span className="about-page__card-label">
                    {highlight.label}
                  </span>

                  <p className="about-page__card-value">
                    {highlight.value}
                  </p>

                  <p className="about-page__card-text">
                    {highlight.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="about-page__actions">
            <Link
              to="/#projects"
              className="about-page__button about-page__button--primary"
            >
              <ScrambleText>View projects</ScrambleText>
              <ArrowIcon />
            </Link>

            <Link
              to="/#contact"
              className="about-page__button about-page__button--ghost"
            >
              <ScrambleText>Contact me</ScrambleText>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}