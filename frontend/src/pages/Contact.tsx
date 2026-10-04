import { useState, type FormEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import { SectionHeading } from '../components/sections/SectionHeading'
import { getErrorMessage } from '../lib/errors'
import { sendContactMessage } from '../services/portfolio'
import type { ContactInput } from '../types'
import { ScrambleText } from '../components/ui/ScrambleText'

type Errors = Partial<Record<keyof ContactInput, string>>

const EMPTY: ContactInput = { name: '', email: '', subject: '', message: '' }
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(values: ContactInput): Errors {
  const errors: Errors = {}
  if (values.name.trim().length < 2) errors.name = 'Please enter your name.'
  if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = 'Please enter a valid email address.'
  if (values.subject.trim().length < 3) errors.subject = 'Please add a short subject.'
  if (values.message.trim().length < 10) errors.message = 'Please write at least 10 characters.'
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
  const describedBy = error ? errorId : undefined

  return (
    <div className="pf-field">
      <label htmlFor={id} className="pf-field__label">
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          name={name}
          rows={6}
          className="pf-input"
          value={value}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          className="pf-input"
          value={value}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
      {error && (
        <p id={errorId} className="pf-error">
          {error}
        </p>
      )}
    </div>
  )
}

export function Contact() {
  const [values, setValues] = useState<ContactInput>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})

  const mutation = useMutation({
    mutationFn: sendContactMessage,
    onSuccess: () => setValues(EMPTY),
  })

  const update = (field: keyof ContactInput) => (value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    if (mutation.isSuccess) mutation.reset()
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    mutation.mutate({
      name: values.name.trim(),
      email: values.email.trim(),
      subject: values.subject.trim(),
      message: values.message.trim(),
    })
  }

  return (
    <section id="contact" className="pf-section" aria-labelledby="contact-title">
      <div className="pf-container pf-split">
        <SectionHeading
          id="contact-title"
          label="Contact"
          title="Let's talk about your project."
          lead="Send a message and I will reply by email."
        />

        <form className="pf-form" onSubmit={handleSubmit} noValidate>
          <TextField name="name" label="Name" autoComplete="name" value={values.name} error={errors.name} onChange={update('name')} />
          <TextField name="email" label="Email" type="email" autoComplete="email" value={values.email} error={errors.email} onChange={update('email')} />
          <TextField name="subject" label="Subject" value={values.subject} error={errors.subject} onChange={update('subject')} />
          <TextField name="message" label="Message" multiline value={values.message} error={errors.message} onChange={update('message')} />

          {mutation.isError && (
            <p className="pf-error" role="alert">
              {getErrorMessage(mutation.error)}
            </p>
          )}
          {mutation.isSuccess && (
            <p className="pf-success" role="status">
              Thanks, your message was sent.
            </p>
          )}

          <button type="submit" className="pf-button pf-button--primary" disabled={mutation.isPending}>
            {mutation.isPending ? 'Sending…' : <ScrambleText>Send message</ScrambleText>}
          </button>
        </form>
      </div>
    </section>
  )
}