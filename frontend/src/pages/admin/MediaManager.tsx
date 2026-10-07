import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { DataState } from '../../components/ui/DataState'
import { useMediaList } from '../../hooks/useMedia'
import { getErrorMessage } from '../../lib/errors'
import { mediaLabel, mediaUrl } from '../../lib/media'
import { deleteMedia, uploadMedia, type UploadInput } from '../../services/media'
import { useConfirm } from '../../components/ui/useConfirm'

const MAX_BYTES = 5 * 1024 * 1024

export function MediaManager() {
  const queryClient = useQueryClient()
  const list = useMediaList()
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [altText, setAltText] = useState('')
  const [provider, setProvider] = useState<UploadInput['provider']>('local')
  const [fileError, setFileError] = useState<string | null>(null)
  const confirm = useConfirm()

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['media'] })

  const upload = useMutation({
    mutationFn: uploadMedia,
    onSuccess: async () => {
      await refresh()
      setFile(null)
      setAltText('')
      if (inputRef.current) inputRef.current.value = ''
    },
  })

  const remove = useMutation({ mutationFn: deleteMedia, onSuccess: refresh })

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const chosen = event.target.files?.[0] ?? null
    upload.reset()
    if (chosen && !chosen.type.startsWith('image/')) {
      setFileError('Only image files are allowed.')
      setFile(null)
    } else if (chosen && chosen.size > MAX_BYTES) {
      setFileError('The image must be 5 MB or smaller.')
      setFile(null)
    } else {
      setFileError(null)
      setFile(chosen)
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (file) upload.mutate({ file, altText, provider })
  }

  const handleDelete = async (id: string, label: string) => {
    const ok = await confirm({
      title: `Delete "${label}"?`,
      message: 'This image will be removed from the site.',
      confirmLabel: 'Delete',
      tone: 'danger',
    })

    if (ok) remove.mutate(id)
  }

  const items = list.data ?? []

  return (
    <div>
      <header className="admin-header">
        <h1 className="admin-title">Media</h1>
      </header>

      <form className="admin-form" onSubmit={handleSubmit}>
        <h2 className="admin-subtitle">Upload an image</h2>
        <div className="pf-field">
          <label htmlFor="media-file" className="pf-field__label">
            Image
          </label>
          <input
            id="media-file"
            ref={inputRef}
            type="file"
            accept="image/*"
            className="pf-input"
            onChange={handleFile}
          />
          <p className="pf-field__help">Images only, up to 5 MB.</p>
        </div>
        <div className="pf-field">
          <label htmlFor="media-alt" className="pf-field__label">
            Alt text
          </label>
          <input
            id="media-alt"
            type="text"
            className="pf-input"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
          />
          <p className="pf-field__help">Describe the image for screen readers.</p>
        </div>
        <div className="pf-field">
          <label htmlFor="media-provider" className="pf-field__label">
            Storage
          </label>
          <select
            id="media-provider"
            className="pf-input"
            value={provider}
            onChange={(e) => setProvider(e.target.value === 'cloudinary' ? 'cloudinary' : 'local')}
          >
            <option value="local">Local server</option>
            <option value="cloudinary">Cloudinary</option>
          </select>
        </div>
        {(fileError ?? upload.isError) && (
          <p className="pf-error" role="alert">
            {fileError ?? getErrorMessage(upload.error)}
          </p>
        )}
        <div className="admin-actions">
          <button type="submit" className="pf-button pf-button--primary" disabled={!file || upload.isPending}>
            {upload.isPending ? 'Uploading…' : 'Upload'}
          </button>
        </div>
      </form>

      {remove.isError && (
        <p className="pf-error" role="alert">
          {getErrorMessage(remove.error)}
        </p>
      )}

      <DataState
        isPending={list.isPending}
        error={list.error}
        isEmpty={items.length === 0}
        emptyMessage="No images yet."
        onRetry={() => void list.refetch()}
      >
        <ul className="admin-media">
          {items.map((item) => (
            <li key={item.id} className="admin-media__item">
              <img
                className="admin-media__img"
                src={mediaUrl(item.url)}
                alt={item.altText ?? ''}
                loading="lazy"
              />
              <p className="admin-row__primary">{mediaLabel(item)}</p>
              <p className="admin-row__secondary">
                {item.provider === 'LOCAL' ? 'Local' : 'Cloudinary'} · {Math.round(item.size / 1024)} KB
              </p>
              <button
                type="button"
                className="pf-button pf-button--ghost"
                disabled={remove.isPending}
                onClick={() => void handleDelete(item.id, mediaLabel(item))}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </DataState>
    </div>
  )
}
