import { Link } from 'react-router-dom'
import { useI18n } from '../../i18n/useI18n'

interface TagListProps {
  tags: readonly string[]
  label: string
  /** Show only this many tags, then a "+N" chip. */
  limit?: number
  /** Where the "+N" chip leads. */
  moreHref?: string
}

export function TagList({ tags, label, limit, moreHref }: TagListProps) {
  const { t } = useI18n()
  if (tags.length === 0) return null

  const visible = limit === undefined ? tags : tags.slice(0, limit)
  const hidden = tags.length - visible.length

  return (
    <ul className="pf-tags" aria-label={label}>
      {visible.map((tag) => (
        <li key={tag} className="pf-tag">
          {tag}
        </li>
      ))}
      {hidden > 0 && (
        <li className="pf-tag pf-tag--more">
          {moreHref ? (
            <Link to={moreHref} aria-label={t('project.moreTech', { count: hidden })}>
              +{hidden}
            </Link>
          ) : (
            <span>+{hidden}</span>
          )}
        </li>
      )}
    </ul>
  )
}