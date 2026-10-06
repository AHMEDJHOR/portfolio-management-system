import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useProfile } from '../../hooks/usePortfolio'
import { NAV_ITEMS } from '../../i18n/nav'
import { useI18n } from '../../i18n/useI18n'
import { safeHref } from '../../lib/format'
import { ScrambleText } from '../ui/ScrambleText'
import './PublicFooter.css'

const clock = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Africa/Addis_Ababa',
})

function LocalTime() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 15_000)
    return () => window.clearInterval(id)
  }, [])

  return <time dateTime={now.toISOString()}>{clock.format(now)} EAT</time>
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

function ArrowUpIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 19V5M6 11l6-6 6 6" />
    </svg>
  )
}

export function PublicFooter() {
  const { data: profile } = useProfile()
  const { t } = useI18n()
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
    { label: t('footer.resume'), href: safeHref(profile?.resumeUrl) },
  ].flatMap((link) => (link.href ? [{ label: link.label, href: link.href }] : []))

  const phoneHref = profile?.phone ? `tel:${profile.phone.replace(/[^\d+]/g, '')}` : null
  const name = profile?.fullName ?? 'Ahmed Jhor'

  return (
    <footer className="site-footer">
      <div className="site-footer__bg" aria-hidden="true" />

      <div className="site-footer__inner">
        <div className="site-footer__cta">
          <h2 className="site-footer__headline">{t('footer.headline')}</h2>
          <Link to="/#contact" className="site-footer__button" onClick={scrollIfSame('contact')}>
            <ScrambleText>{t('footer.talk')}</ScrambleText>
            <ArrowIcon />
          </Link>
        </div>

        <nav className="site-footer__column" aria-labelledby="footer-nav-title">
          <h3 id="footer-nav-title" className="site-footer__heading">{t('footer.navigation')}</h3>
          <ul className="site-footer__list">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <Link to={`/#${item.id}`} className="site-footer__link" onClick={scrollIfSame(item.id)}>
                  <ScrambleText>{t(item.labelKey)}</ScrambleText>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {socials.length > 0 && (
          <div className="site-footer__column">
            <h3 className="site-footer__heading">{t('footer.socials')}</h3>
            <ul className="site-footer__list">
              {socials.map((link) => (
                <li key={link.label}>
                  <a className="site-footer__link" href={link.href} target="_blank" rel="noopener noreferrer">
                    <ScrambleText>{link.label}</ScrambleText>
                    <span className="sr-only"> {t('footer.opensNew')}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="site-footer__column">
          <h3 className="site-footer__heading">{t('footer.contact')}</h3>
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
        <p className="site-footer__status">
          <span className="site-footer__dot" aria-hidden="true" />
          <span>{t('hero.status')}</span>
          <span className="site-footer__sep" aria-hidden="true">/</span>
          <span>{profile?.location ?? 'Addis Ababa'}</span>
          <span className="site-footer__sep" aria-hidden="true">·</span>
          <LocalTime />
        </p>

        <p className="site-footer__copy">
          © {new Date().getFullYear()} {name}. {t('footer.rights')}
        </p>

        <button type="button" className="site-footer__top" onClick={() => window.scrollTo({ top: 0 })} aria-label={t('footer.top')}>
          <ArrowUpIcon />
        </button>
      </div>
    </footer>
  )
}