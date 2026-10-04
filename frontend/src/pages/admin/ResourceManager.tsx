import { useState, type FormEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { DataState } from '../../components/ui/DataState'
import { useSkills } from '../../hooks/usePortfolio'
import { useResourceList } from '../../hooks/useResourceList'
import { getErrorMessage } from '../../lib/errors'
import { isRecord } from '../../lib/guards'
import { createResource, deleteResource, updateResource, type Item, type Payload } from '../../services/admin'
import type { FieldConfig, ResourceConfig } from './resources'
import { useMediaList } from '../../hooks/useMedia'
import { mediaLabel, mediaUrl } from '../../lib/media'

type FieldValue = string | boolean | string[]
type FormState = Record<string, FieldValue>

const INPUT_TYPES = { text: 'text', url: 'url', date: 'date', number: 'number', tags: 'text' } as const

function emptyValue(field: FieldConfig): FieldValue {
  if (field.type === 'checkbox') return false
  if (field.type === 'skills') return []
  return ''
}

function emptyForm(fields: readonly FieldConfig[]): FormState {
  return Object.fromEntries(fields.map((field): [string, FieldValue] => [field.name, emptyValue(field)]))
}

// A project's technologies may arrive as join rows ({ skillId, skill: { id } }) or plain skills.
function skillIdOf(entry: unknown): string | null {
  if (!isRecord(entry)) return null
  if (typeof entry.skillId === 'string') return entry.skillId
  if (isRecord(entry.skill) && typeof entry.skill.id === 'string') return entry.skill.id
  return typeof entry.id === 'string' ? entry.id : null
}

function toFormState(item: Item, fields: readonly FieldConfig[]): FormState {
  const state: FormState = {}
  for (const field of fields) {
    const raw = item[field.source ?? field.name]
    if (field.type === 'checkbox') {
      state[field.name] = raw === true
    } else if (field.type === 'skills') {
      state[field.name] = Array.isArray(raw)
        ? raw.flatMap((entry) => {
            const id = skillIdOf(entry)
            return id ? [id] : []
          })
        : []
    } else if (field.type === 'tags') {
      state[field.name] = Array.isArray(raw) ? raw.join(', ') : ''
    } else if (field.type === 'date') {
      state[field.name] = typeof raw === 'string' ? raw.slice(0, 10) : ''
    } else {
      state[field.name] = typeof raw === 'string' || typeof raw === 'number' ? String(raw) : ''
    }
  }
  return state
}

// The API's optional fields are not nullable, so empty values are omitted instead of sent as null.
function toPayload(form: FormState, fields: readonly FieldConfig[]): Payload {
  const payload: Payload = {}
  for (const field of fields) {
    const value = form[field.name]
    const text = typeof value === 'string' ? value.trim() : ''
    switch (field.type) {
      case 'checkbox':
        payload[field.name] = value === true
        break
      case 'skills':
        payload[field.name] = Array.isArray(value) ? value : []
        break
      case 'tags':
        payload[field.name] = text.split(',').map((tag) => tag.trim()).filter(Boolean)
        break
      case 'number':
        if (text !== '') payload[field.name] = Number(text)
        break
      case 'date':
        if (text !== '') payload[field.name] = new Date(text).toISOString()
        break
      default:
        if (text !== '') payload[field.name] = text
    }
  }
  return payload
}

interface FieldInputProps {
  field: FieldConfig
  value: FieldValue | undefined
  onChange: (value: FieldValue) => void
}

function MediaPicker({ field, value, onChange }: FieldInputProps) {
  const media = useMediaList()
  const selected = typeof value === 'string' ? value : ''
  const current = media.data?.find((item) => item.id === selected)
  const id = `field-${field.name}`

  return (
    <div className="pf-field">
      <label htmlFor={id} className="pf-field__label">
        {field.label}
      </label>
      <select id={id} className="pf-input" value={selected} onChange={(e) => onChange(e.target.value)}>
        <option value="">None</option>
        {media.data?.map((item) => (
          <option key={item.id} value={item.id}>
            {mediaLabel(item)}
          </option>
        ))}
      </select>
      {current && <img className="admin-thumb" src={mediaUrl(current.url)} alt="" />}
      <p className="pf-field__help">Upload images on the Media page. The API cannot clear a thumbnail yet.</p>
    </div>
  )
}

function SkillPicker({ field, value, onChange }: FieldInputProps) {
  const skills = useSkills()
  const selected = Array.isArray(value) ? value : []
  const toggle = (id: string) =>
    onChange(selected.includes(id) ? selected.filter((current) => current !== id) : [...selected, id])

  return (
    <fieldset className="admin-fieldset">
      <legend className="pf-field__label">{field.label}</legend>
      {skills.isPending && <p className="pf-field__help">Loading skills…</p>}
      {skills.data?.length === 0 && <p className="pf-field__help">Add some skills first.</p>}
      <div className="admin-checks">
        {skills.data?.map((skill) => (
          <label key={skill.id} className="admin-check">
            <input type="checkbox" checked={selected.includes(skill.id)} onChange={() => toggle(skill.id)} />
            {skill.name}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function FieldInput({ field, value, onChange }: FieldInputProps) {
  const id = `field-${field.name}`

     if (field.type === 'media') {
    return <MediaPicker field={field} value={value} onChange={onChange} />
  }

  if (field.type === 'skills') {
    return <SkillPicker field={field} value={value} onChange={onChange} />
  }
  if (field.type === 'checkbox') {
    return (
      <label className="admin-check">
        <input type="checkbox" checked={value === true} onChange={(e) => onChange(e.target.checked)} />
        {field.label}
      </label>
    )
  }

  const text = typeof value === 'string' ? value : ''
  return (
    <div className="pf-field">
      <label htmlFor={id} className="pf-field__label">
        {field.label}
      </label>
      {field.type === 'textarea' ? (
        <textarea id={id} rows={8} className="pf-input" value={text} required={field.required} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input id={id} type={INPUT_TYPES[field.type]} className="pf-input" value={text} required={field.required} onChange={(e) => onChange(e.target.value)} />
      )}
      {field.help && <p className="pf-field__help">{field.help}</p>}
    </div>
  )
}

export function ResourceManager({ config }: { config: ResourceConfig }) {
  const queryClient = useQueryClient()
  const list = useResourceList(config)
  const [editing, setEditing] = useState<Item | 'new' | null>(null)
  const [form, setForm] = useState<FormState>({})

 const refresh = () =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: ['admin', config.key] }),
    queryClient.invalidateQueries({ queryKey: [config.key] }),
  ])

  const save = useMutation({
    mutationFn: (payload: Payload) =>
      editing !== null && editing !== 'new'
        ? updateResource(config.endpoint, editing.id, payload)
        : createResource(config.endpoint, payload),
    onSuccess: async () => {
      await refresh()
      setEditing(null)
    },
  })

  const remove = useMutation({
    mutationFn: (id: string) => deleteResource(config.endpoint, id),
    onSuccess: refresh,
  })

  const markRead = useMutation({
  mutationFn: (id: string) =>
    updateResource(config.endpoint, id, { isRead: true }),
  onSuccess: refresh,
})

  const open = (target: Item | 'new') => {
    save.reset()
    setForm(target === 'new' ? emptyForm(config.fields) : toFormState(target, config.fields))
    setEditing(target)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    save.mutate(toPayload(form, config.fields))
  }

  const handleDelete = (item: Item) => {
    if (window.confirm(`Delete "${config.primary(item)}"? This cannot be undone.`)) {
      remove.mutate(item.id)
    }
  }

  const items = list.data ?? []

  return (
    <div>
      <header className="admin-header">
        <h1 className="admin-title">{config.title}</h1>
        {!config.readOnly && (
          <button type="button" className="pf-button pf-button--primary" onClick={() => open('new')}>
            New
          </button>
        )}
      </header>

      {editing !== null && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <h2 className="admin-subtitle">{editing === 'new' ? 'New entry' : 'Edit entry'}</h2>
          {config.fields.map((field) => (
            <FieldInput
              key={field.name}
              field={field}
              value={form[field.name]}
              onChange={(value) => setForm((current) => ({ ...current, [field.name]: value }))}
            />
          ))}
          {save.isError && (
            <p className="pf-error" role="alert">
              {getErrorMessage(save.error)}
            </p>
          )}
          <div className="admin-actions">
            <button type="submit" className="pf-button pf-button--primary" disabled={save.isPending}>
              {save.isPending ? 'Saving…' : 'Save'}
            </button>
            <button type="button" className="pf-button pf-button--ghost" onClick={() => setEditing(null)}>
              Cancel
            </button>
          </div>
        </form>
      )}

            {remove.isError && (
        <p className="pf-error" role="alert">
          {getErrorMessage(remove.error)}
        </p>
      )}

      {markRead.isError && (
        <p className="pf-error" role="alert">
          {getErrorMessage(markRead.error)}
        </p>
      )}

      <DataState
        isPending={list.isPending}
        error={list.error}
        isEmpty={items.length === 0}
        emptyMessage="Nothing here yet."
        onRetry={() => void list.refetch()}
      >
        <ul className="admin-list">
          {items.map((item) => (
            <li key={item.id} className="admin-row">
              <div className="admin-row__text">
                <p className="admin-row__primary">{config.primary(item)}</p>
                {config.secondary && <p className="admin-row__secondary">{config.secondary(item)}</p>}
              </div>
                            <div className="admin-actions">
                {!config.readOnly && (
                  <button
                    type="button"
                    className="pf-button pf-button--ghost"
                    onClick={() => open(item)}
                  >
                    Edit
                  </button>
                )}

                {config.canMarkRead && item.isRead !== true && (
                  <button
                    type="button"
                    className="pf-button pf-button--ghost"
                    onClick={() => markRead.mutate(item.id)}
                    disabled={markRead.isPending}
                  >
                    Mark read
                  </button>
                )}

                <button
                  type="button"
                  className="pf-button pf-button--ghost"
                  onClick={() => handleDelete(item)}
                  disabled={remove.isPending}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </DataState>
    </div>
  )
}