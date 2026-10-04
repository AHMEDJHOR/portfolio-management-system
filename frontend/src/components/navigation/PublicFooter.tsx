import { Link, useLocation } from 'react-router-dom'
import { useProfile } from '../../hooks/usePortfolio'
import { safeHref } from '../../lib/format'
import { ScrambleText } from '../ui/ScrambleText'
import './PublicFooter.css'

const NAV_ITEMS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'blog', label: 'Blog' },
  { id: 'contact', label: 'Contact' },
] as const

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

function ArrowUpIcon() {
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
      <path d="M12 19V5M6 11l6-6 6 6" />
    </svg>
  )
}

export function PublicFooter() {
  const { data: profile } = useProfile()
  const location = useLocation()

  // Clicking the section you are already on doesn't change the URL, so scroll by hand.
  const scrollIfSame = (id: string) => () => {
    if (location.pathname === '/' && location.hash === `#${id}`) {
      document.getElementById(id)?.scrollIntoView()
    }
  }

  const socials = [
    { label: 'GitHub', href: safeHref(profile?.githubUrl) },
    { label: 'LinkedIn', href: safeHref(profile?.linkedinUrl) },
    { label: 'Telegram', href: safeHref(profile?.telegramUrl) },
    { label: 'Résumé', href: safeHref(profile?.resumeUrl) },
  ].flatMap((link) => (link.href ? [{ label: link.label, href: link.href }] : []))

  const phoneHref = profile?.phone ? `tel:${profile.phone.replace(/[^\d+]/g, '')}` : null
  const name = profile?.fullName ?? 'Ahmed Jhor'

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__cta">
          <h2 className="site-footer__headline">Ready to build your next digital product?</h2>
          <Link to="/#contact" className="site-footer__button" onClick={scrollIfSame('contact')}>
            <ScrambleText>{"Let's talk"}</ScrambleText>
            <ArrowIcon />
          </Link>
        </div>

        <nav className="site-footer__column" aria-labelledby="footer-nav-title">
          <h3 id="footer-nav-title" className="site-footer__heading">
            Navigation
          </h3>
          <ul className="site-footer__list">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <Link
                  to={`/#${item.id}`}
                  className="site-footer__link"
                  onClick={scrollIfSame(item.id)}
                >
                  <ScrambleText>{item.label}</ScrambleText>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {socials.length > 0 && (
          <div className="site-footer__column">
            <h3 className="site-footer__heading">Socials</h3>
            <ul className="site-footer__list">
              {socials.map((link) => (
                <li key={link.label}>
                  <a
                    className="site-footer__link"
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ScrambleText>{link.label}</ScrambleText>
                    <span className="sr-only"> (opens in new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="site-footer__column">
          <h3 className="site-footer__heading">Contact</h3>
          <ul className="site-footer__list">
            {profile?.email && (
              <li>
                <a className="site-footer__link site-footer__link--plain" href={`mailto:${profile.email}`}>
                  <ScrambleText>{profile.email}</ScrambleText>
                </a>
              </li>
            )}
            {profile?.phone && phoneHref && (
              <li>
                <a className="site-footer__link site-footer__link--plain" href={phoneHref}>
                  <ScrambleText>{profile.phone}</ScrambleText>
                </a>
              </li>
            )}
            {profile?.location && <li className="site-footer__text">{profile.location}</li>}
          </ul>
        </div>
      </div>

      <div className="site-footer__bar">
        <p>
          © {new Date().getFullYear()} {name}. All rights reserved.
        </p>
        <p className="site-footer__tagline">Crafted with precision.</p>
        <button
          type="button"
          className="site-footer__top"
          onClick={() => window.scrollTo({ top: 0 })}
          aria-label="Back to top"
        >
          <ArrowUpIcon />
        </button>
      </div>

      <p className="site-footer__mark" aria-hidden="true">
        {name.toUpperCase()}
      </p>
    </footer>
  )
}