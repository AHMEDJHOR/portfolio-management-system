import { useState, type FormEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useComments } from '../../hooks/usePortfolio'
import { useI18n } from '../../i18n/useI18n'
import { getErrorMessage } from '../../lib/errors'
import { formatDate } from '../../lib/format'
import { postComment } from '../../services/portfolio'
import type { CommentInput } from '../../types'
import './Comments.css'

const MAX = 1000
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const EMPTY: CommentInput = { name: '', email: '', content: '' }
const ORDER: readonly (keyof CommentInput)[] = ['name', 'email', 'content']

type Errors = Partial<Record<keyof CommentInput, string>>

export function CommentSection({ blogId }: { blogId: string }) {
  const { t } = useI18n()
  const comments = useComments(blogId)
  const list = comments.data ?? []

  const [values, setValues] = useState<CommentInput>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [trap, setTrap] = useState('') // honeypot
  const [sent, setSent] = useState(false)

  const mutation = useMutation({
    mutationFn: (input: CommentInput) => postComment(blogId, input),
    onSuccess: () => {
      setValues(EMPTY)
      setSent(true)
    },
  })

  const update = (field: keyof CommentInput) => (value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (trap !== '') {
      setSent(true)
      return
    }

    const found: Errors = {}
    if (values.name.trim().length < 2) found.name = t('comments.err.name')
    if (!EMAIL_PATTERN.test(values.email.trim())) found.email = t('comments.err.email')
    if (values.content.trim().length < 3) found.content = t('comments.err.comment')
    setErrors(found)

    const firstInvalid = ORDER.find((field) => found[field])
    if (firstInvalid) {
      document.getElementById(`comment-${firstInvalid}`)?.focus()
      return
    }

    mutation.mutate({
      name: values.name.trim(),
      email: values.email.trim(),
      content: values.content.trim(),
    })
  }

  const field = (name: keyof CommentInput) => ({
    id: `comment-${name}`,
    className: 'pf-input',
    value: values[name],
    'aria-required': true as const,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `comment-${name}-error` : undefined,
  })

  const fieldError = (name: keyof CommentInput) =>
    errors[name] ? (
      <p id={`comment-${name}-error`} className="pf-error">
        {errors[name]}
      </p>
    ) : null

  return (
    <section className="comments" aria-labelledby="comments-title">
      <h2 id="comments-title" className="comments__title">
        {t('comments.title')}
        <span className="comments__count">{list.length}</span>
      </h2>
      <p className="pf-card__text">{t('comments.lead')}</p>

      <div className="comments__layout">
        {sent ? (
          <div className="contact-done" role="status">
            <h3 className="pf-card__title">{t('comments.doneTitle')}</h3>
            <p className="pf-card__text">{t('comments.pending')}</p>
            <button
              type="button"
              className="pf-button pf-button--ghost"
              onClick={() => {
                mutation.reset()
                setTrap('')
                setSent(false)
              }}
            >
              {t('comments.another')}
            </button>
          </div>
        ) : (
          <form className="pf-form comments__form" onSubmit={handleSubmit} noValidate>
            <div className="pf-form__row">
              <div className="pf-field">
                <label htmlFor="comment-name" className="pf-field__label">{t('comments.name')}</label>
                <input {...field('name')} type="text" autoComplete="name" maxLength={80} onChange={(e) => update('name')(e.target.value)} />
                {fieldError('name')}
              </div>
              <div className="pf-field">
                <label htmlFor="comment-email" className="pf-field__label">{t('comments.email')}</label>
                <input {...field('email')} type="email" autoComplete="email" maxLength={120} onChange={(e) => update('email')(e.target.value)} />
                {fieldError('email')}
              </div>
            </div>
            <div className="pf-field">
              <label htmlFor="comment-content" className="pf-field__label">{t('comments.comment')}</label>
              <textarea {...field('content')} rows={5} maxLength={MAX} onChange={(e) => update('content')(e.target.value)} />
              <p className="pf-field__help comments__hint">
                <span>{t('comments.privacy')}</span>
                <span>{values.content.length} / {MAX}</span>
              </p>
              {fieldError('content')}
            </div>

            <div className="contact-trap" aria-hidden="true">
              <label htmlFor="comment-website">Leave this field empty</label>
              <input id="comment-website" type="text" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
            </div>

            {mutation.isError && (
              <p className="pf-error" role="alert">{getErrorMessage(mutation.error)}</p>
            )}
            <button type="submit" className="pf-button pf-button--primary" disabled={mutation.isPending}>
              {mutation.isPending ? t('comments.posting') : t('comments.post')}
            </button>
          </form>
        )}

        <div className="comments__list-wrap">
          {list.length === 0 ? (
            <p className="pf-state">{t('comments.empty')}</p>
          ) : (
            <ul className="comments__list">
              {list.map((comment, index) => (
                <li key={comment.id} className="comment">
                  <span className="comment__avatar" data-tone={index % 3} aria-hidden="true">
                    {comment.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="comment__body">
                    <p className="comment__head">
                      <strong>{comment.name}</strong>
                      <time dateTime={comment.createdAt}>{formatDate(comment.createdAt)}</time>
                    </p>
                    <p className="comment__text">{comment.content}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}