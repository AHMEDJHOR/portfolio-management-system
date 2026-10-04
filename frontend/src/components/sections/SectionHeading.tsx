interface SectionHeadingProps {
  id: string
  label: string
  title: string
  lead?: string
  level?: 'h1' | 'h2'
}

export function SectionHeading({ id, label, title, lead, level = 'h2' }: SectionHeadingProps) {
  const Heading = level
  return (
    <header className="pf-heading">
      <p className="pf-label">{label}</p>
      <Heading id={id} className="pf-title">
        {title}
      </Heading>
      {lead && <p className="pf-lead">{lead}</p>}
    </header>
  )
}