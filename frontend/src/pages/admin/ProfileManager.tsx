import { useState, type FormEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { DataState } from '../../components/ui/DataState'
import { useProfile } from '../../hooks/usePortfolio'
import { getErrorMessage } from '../../lib/errors'
import { updateProfile, type Payload } from '../../services/admin'
import type { Profile } from '../../types'

type Key =
  | 'fullName' | 'title' | 'bio' | 'location' | 'email' | 'phone'
  | 'githubUrl' | 'linkedinUrl' | 'telegramUrl' | 'resumeUrl'
type FormState = Record<Key, string>

interface Field {
  name: Key
  label: string
  type: 'text' | 'email' | 'url' | 'tel' | 'textarea'
  required?: boolean
}

const FIELDS: readonly Field[] = [
  { name: 'fullName', label: 'Full name', type: 'text', required: true },
  { name: 'title', label: 'Title', type: 'text', required: true },
  { name: 'bio', label: 'Bio', type: 'textarea', required: true },
  { name: 'location', label: 'Location', type: 'text' },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'phone', label: 'Phone', type: 'tel' },
  { name: 'githubUrl', label: 'GitHub URL', type: 'url' },
  { name: 'linkedinUrl', label: 'LinkedIn URL', type: 'url' },
  { name: 'telegramUrl', label: 'Telegram URL', type: 'url' },
  { name: 'resumeUrl', label: 'Resume URL', type: 'url' },
]

const toForm = (p: Profile): FormState => ({
  fullName: p.fullName,
  title: p.title,
  bio: p.bio,
  location: p.location ?? '',
  email: p.email,
  phone: p.phone ?? '',
  githubUrl: p.githubUrl ?? '',
  linkedinUrl: p.linkedinUrl ?? '',
  telegramUrl: p.telegramUrl ?? '',
  resumeUrl: p.resumeUrl ?? '',
})

function ProfileForm({ profile }: { profile: Profile }) {
  const queryClient = useQueryClient()
  const [form, setForm] = useState<FormState>(() => toForm(profile))

  const save = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile'] }),
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // The API's optional fields are not nullable, so empty values are omitted.
    const payload: Payload = {}
    for (const field of FIELDS) {
      const text = form[field.name].trim()
      if (text !== '') payload[field.name] = text
    }
    save.mutate(payload)
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      {FIELDS.map((field) => {
        const id = `profile-${field.name}`
        const onChange = (value: string) => {
          save.reset()
          setForm((current) => ({ ...current, [field.name]: value }))
        }
        return (
          <div key={field.name} className="pf-field">
            <label htmlFor={id} className="pf-field__label">
              {field.label}
            </label>
            {field.type === 'textarea' ? (
              <textarea id={id} rows={6} className="pf-input" value={form[field.name]} required={field.required} onChange={(e) => onChange(e.target.value)} />
            ) : (
              <input id={id} type={field.type} className="pf-input" value={form[field.name]} required={field.required} onChange={(e) => onChange(e.target.value)} />
            )}
          </div>
        )
      })}
      <p className="pf-field__help">Optional fields cannot be cleared yet, because the API ignores empty values.</p>
      {save.isError && (
        <p className="pf-error" role="alert">
          {getErrorMessage(save.error)}
        </p>
      )}
      {save.isSuccess && (
        <p className="pf-success" role="status">
          Profile saved.
        </p>
      )}
      <div className="admin-actions">
        <button type="submit" className="pf-button pf-button--primary" disabled={save.isPending}>
          {save.isPending ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  )
}

export function ProfileManager() {
  const query = useProfile()

  return (
    <div>
      <header className="admin-header">
        <h1 className="admin-title">Profile</h1>
      </header>
      <DataState
        isPending={query.isPending}
        error={query.error}
        isEmpty={!query.data}
        emptyMessage="No profile found."
        onRetry={() => void query.refetch()}
      >
        {query.data && <ProfileForm key={query.data.id} profile={query.data} />}
      </DataState>
    </div>
  )
}