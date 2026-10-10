import { useState, type FormEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { DataState } from '../../components/ui/DataState'
import { useMediaList } from '../../hooks/useMedia'
import { useProfile } from '../../hooks/usePortfolio'
import { getErrorMessage } from '../../lib/errors'
import { mediaLabel, mediaUrl } from '../../lib/media'
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
  help?: string
}

const FIELDS: readonly Field[] = [
  { name: 'fullName', label: 'Full name', type: 'text', required: true },
  { name: 'title', label: 'Title', type: 'text', required: true, help: 'Shown in the Hero, e.g. Full-Stack Developer.' },
  { name: 'bio', label: 'Bio', type: 'textarea', required: true, help: 'Shown on the About section. Separate paragraphs with a blank line.' },
  { name: 'location', label: 'Location', type: 'text' },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'phone', label: 'Phone', type: 'tel' },
  { name: 'githubUrl', label: 'GitHub URL', type: 'url' },
  { name: 'linkedinUrl', label: 'LinkedIn URL', type: 'url' },
  { name: 'telegramUrl', label: 'Telegram URL', type: 'url' },
  { name: 'resumeUrl', label: 'Resume URL', type: 'url', help: 'A public link to your CV (PDF on Google Drive, Dropbox or your own site).' },
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

const EMPTY_PROFILE: Profile = {
  id: 'new',
  fullName: '',
  title: '',
  bio: '',
  location: null,
  email: '',
  phone: null,
  githubUrl: null,
  linkedinUrl: null,
  telegramUrl: null,
  resumeUrl: null,
  profileImage: null,
}

function ProfileForm({ profile }: { profile: Profile }) {
  const queryClient = useQueryClient()
  const media = useMediaList()
  const [form, setForm] = useState<FormState>(() => toForm(profile))
  const [imageId, setImageId] = useState(profile.profileImage?.id ?? '')

  const save = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile'] }),
  })

  const currentImage = media.data?.find((item) => item.id === imageId)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const payload: Payload = {}
    for (const field of FIELDS) {
      const text = form[field.name].trim()
      // Required fields are always sent; optional ones send null so they can be cleared.
      payload[field.name] = text === '' && !field.required ? null : text
    }
    payload.profileImageId = imageId === '' ? null : imageId
    save.mutate(payload)
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="pf-field">
        <label htmlFor="profile-image" className="pf-field__label">
          Portrait
        </label>
        <select
          id="profile-image"
          className="pf-input"
          value={imageId}
          onChange={(e) => {
            save.reset()
            setImageId(e.target.value)
          }}
        >
          <option value="">Default image</option>
          {media.data?.map((item) => (
            <option key={item.id} value={item.id}>
              {mediaLabel(item)}
            </option>
          ))}
        </select>
        {currentImage && <img className="admin-thumb" src={mediaUrl(currentImage.url)} alt="" />}
        <p className="pf-field__help">Upload your photo on the Media page first. A tall, portrait-style photo works best.</p>
      </div>

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
              <textarea id={id} rows={8} className="pf-input" value={form[field.name]} required={field.required} onChange={(e) => onChange(e.target.value)} />
            ) : (
              <input id={id} type={field.type} className="pf-input" value={form[field.name]} required={field.required} onChange={(e) => onChange(e.target.value)} />
            )}
            {field.help && <p className="pf-field__help">{field.help}</p>}
          </div>
        )
      })}

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
        isEmpty={false}
        emptyMessage=""
        onRetry={() => void query.refetch()}
      >
        <ProfileForm
          key="profile"
          profile={query.data ?? EMPTY_PROFILE}
        />
      </DataState>
    </div>
  )
}