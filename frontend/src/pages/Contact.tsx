import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import { SectionHeading } from '../components/sections/SectionHeading'
import { ScrambleText } from '../components/ui/ScrambleText'
import { useProfile } from '../hooks/usePortfolio'
import { getErrorMessage } from '../lib/errors'
import { safeHref } from '../lib/format'
import { useI18n } from '../i18n/useI18n'
import { sendContactMessage } from '../services/portfolio'
import type { ContactInput } from '../types'
import type { MessageKey } from '../i18n/messages'

type Errors = Partial<Record<keyof ContactInput, string>>

const EMPTY: ContactInput = { name: '', email: '', subject: '', message: '' }
const FIELD_ORDER: readonly (keyof ContactInput)[] = ['name', 'email', 'subject', 'message']
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(values: ContactInput, t: (key: MessageKey) => string): Errors {
  const errors: Errors = {}
  if (values.name.trim().length < 2) errors.name = t('contact.err.name')
  if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = t('contact.err.email')
  if (values.subject.trim().length < 3) errors.subject = t('contact.err.subject')
  if (values.message.trim().length < 10) errors.message = t('contact.err.message')
  return errors
}

interface TextFieldProps {
  name: keyof ContactInput
  label: string
  value: string
  error?: string
  onChange: (value: string) => void
  type?: 'text' | 'email'
  autoComplete?: string
  multiline?: boolean
}

function TextField({ name, label, value, error, onChange, type = 'text', autoComplete, multiline }: TextFieldProps) {
  const id = `contact-${name}`
  const errorId = `${id}-error`
  const shared = {
    id,
    name,
    className: 'pf-input',
    value,
    'aria-required': true as const,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errorId : undefined,
  }

  return (
    <div className="pf-field">
      <label htmlFor={id} className="pf-field__label">
        {label}
      </label>
      {multiline ? (
        <textarea {...shared} rows={6} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input {...shared} type={type} autoComplete={autoComplete} onChange={(event) => onChange(event.target.value)} />
      )}
      {error && (
        <p id={errorId} className="pf-error">
          {error}
        </p>
      )}
    </div>
  )
}

function ContactDetails() {
  const { data: profile } = useProfile()
  const { t } = useI18n()
  if (!profile) return null

  const phoneHref = profile.phone ? `tel:${profile.phone.replace(/[^\d+]/g, '')}` : null
  const socials = [
    { label: 'GitHub', href: safeHref(profile.githubUrl) },
    { label: 'LinkedIn', href: safeHref(profile.linkedinUrl) },
    { label: 'Telegram', href: safeHref(profile.telegramUrl) },
  ].flatMap((link) => (link.href ? [{ label: link.label, href: link.href }] : []))

  return (
    <dl className="contact-details">
      <div>
        <dt>{t('contact.email')}</dt>
        <dd>
          <a className="pf-link" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
        </dd>
      </div>
      {profile.phone && phoneHref && (
        <div>
          <dt>{t('contact.phone')}</dt>
          <dd>
            <a className="pf-link" href={phoneHref}>
              {profile.phone}
            </a>
          </dd>
        </div>
      )}
      {profile.location && (
        <div>
          <dt>{t('contact.location')}</dt>
          <dd>{profile.location}</dd>
        </div>
      )}
      {socials.length > 0 && (
        <div>
          <dt>{t('contact.elsewhere')}</dt>
          <dd className="contact-details__links">
            {socials.map((link) => (
              <a key={link.label} className="pf-link" href={link.href} target="_blank" rel="noopener noreferrer">
                {link.label}
                <span className="sr-only"> (opens in new tab)</span>
              </a>
            ))}
          </dd>
        </div>
      )}
    </dl>
  )
}

export function Contact() {
  const { t } = useI18n()
  const [values, setValues] = useState<ContactInput>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [trap, setTrap] = useState('') // honeypot: real visitors never see or fill this
  const [sent, setSent] = useState(false)
  const confirmationRef = useRef<HTMLDivElement>(null)

  const mutation = useMutation({
    mutationFn: sendContactMessage,
    onSuccess: () => {
      setValues(EMPTY)
      setSent(true)
    },
  })

  // Move focus to the confirmation so screen-reader and keyboard users notice it.
  useEffect(() => {
    if (sent) confirmationRef.current?.focus()
  }, [sent])

  const update = (field: keyof ContactInput) => (value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // A bot filled the hidden field: pretend it worked and send nothing.
    if (trap !== '') {
      setSent(true)
      return
    }

    const found = validate(values, t)
    setErrors(found)
    const firstInvalid = FIELD_ORDER.find((field) => found[field])
    if (firstInvalid) {
      document.getElementById(`contact-${firstInvalid}`)?.focus()
      return
    }

    mutation.mutate({
      name: values.name.trim(),
      email: values.email.trim(),
      subject: values.subject.trim(),
      message: values.message.trim(),
    })
  }

  const sendAnother = () => {
    mutation.reset()
    setTrap('')
    setSent(false)
  }

  return (
    <section id="contact" className="pf-section" aria-labelledby="contact-title">
      <div className="pf-container pf-split">
        <div>
          <SectionHeading
            id="contact-title"
            label={t('contact.label')}
            title={t('contact.title')}
            lead={t('contact.lead')}
          />
          <ContactDetails />
        </div>

        {sent ? (
          <div ref={confirmationRef} className="contact-done" role="status" tabIndex={-1}>
            <h3 className="pf-card__title">{t('contact.doneTitle')}</h3>
            <p className="pf-card__text">{t('contact.doneText')}</p>
            <button type="button" className="pf-button pf-button--ghost" onClick={sendAnother}>
              {t('contact.another')}
            </button>
          </div>
        ) : (
          <form className="pf-form" onSubmit={handleSubmit} noValidate>
            <div className="pf-form__row">
              <TextField name="name" label={t('contact.name')} autoComplete="name" value={values.name} error={errors.name} onChange={update('name')} />
              <TextField name="email" label={t('contact.email')} type="email" autoComplete="email" value={values.email} error={errors.email} onChange={update('email')} />
            </div>
            <TextField name="subject" label={t('contact.subject')} value={values.subject} error={errors.subject} onChange={update('subject')} />
            <TextField name="message" label={t('contact.message')} multiline value={values.message} error={errors.message} onChange={update('message')} />

            {/* Honeypot: hidden from people and assistive tech, tempting to bots. */}
            <div className="contact-trap" aria-hidden="true">
             <label htmlFor="contact-website">Leave this field empty</label>
              <input
                id="contact-website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={trap}
                onChange={(event) => setTrap(event.target.value)}
              />
            </div>

            {mutation.isError && (
              <p className="pf-error" role="alert">
                {getErrorMessage(mutation.error)}
              </p>
            )}

            <button type="submit" className="pf-button pf-button--primary" disabled={mutation.isPending}>
              {mutation.isPending ? t('contact.sending') : <ScrambleText>{t('contact.send')}</ScrambleText>}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}