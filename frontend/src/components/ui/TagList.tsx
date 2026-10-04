interface TagListProps {
  tags: readonly string[]
  label: string
}

export function TagList({ tags, label }: TagListProps) {
  if (tags.length === 0) return null
  return (
    <ul className="pf-tags" aria-label={label}>
      {tags.map((tag) => (
        <li key={tag} className="pf-tag">
          {tag}
        </li>
      ))}
    </ul>
  )
}