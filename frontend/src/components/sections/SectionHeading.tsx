import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { TypeText } from '../ui/TypeText'

interface SectionHeadingProps {
  id: string
  label: string
  title: string
  lead?: string
  level?: 'h1' | 'h2'
}

// Milliseconds per character, and the pause between the three lines.
const LABEL_MS = 34
const TITLE_MS = 24
const LEAD_MS = 9
const PAUSE_MS = 120

export function SectionHeading({ id, label, title, lead, level = 'h2' }: SectionHeadingProps) {
  const ref = useRef<HTMLElement>(null)
  const started = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  const Heading = level

  // Each line starts when the previous one has finished.
  const titleDelay = label.length * LABEL_MS + PAUSE_MS
  const leadDelay = titleDelay + title.length * TITLE_MS + PAUSE_MS

  return (
    <header ref={ref} className="pf-heading">
      <p className="pf-label">
        <TypeText start={started} speed={LABEL_MS}>
          {label}
        </TypeText>
      </p>
      <Heading id={id} className="pf-title">
        <TypeText start={started} delay={titleDelay} speed={TITLE_MS}>
          {title}
        </TypeText>
      </Heading>
      {lead && (
        <p className="pf-lead">
          <TypeText start={started} delay={leadDelay} speed={LEAD_MS}>
            {lead}
          </TypeText>
        </p>
      )}
    </header>
  )
}