import { useCertifications } from '../../hooks/usePortfolio'
import { formatMonth, safeHref } from '../../lib/format'
import { DataState } from '../ui/DataState'
import { SectionHeading } from './SectionHeading'

export function CertificationsSection() {
  const query = useCertifications()
  const items = [...(query.data ?? [])].sort((a, b) => b.issueDate.localeCompare(a.issueDate))

  // Optional section: it stays out of the page entirely until there is something to show.
  if (!query.isPending && !query.error && items.length === 0) return null

  return (
    <section id="certifications" className="pf-section" aria-labelledby="certifications-title">
      <div className="pf-container">
        <SectionHeading id="certifications-title" label="Certifications" title="Credentials" />
        <DataState
          isPending={query.isPending}
          error={query.error}
          isEmpty={false}
          emptyMessage=""
          onRetry={() => void query.refetch()}
        >
          <ul className="pf-grid">
            {items.map((item) => {
              const href = safeHref(item.credentialUrl)
              return (
                <li key={item.id} className="pf-card">
                  <time className="pf-card__meta" dateTime={item.issueDate}>
                    {formatMonth(item.issueDate)}
                  </time>
                  <h3 className="pf-card__title">{item.title}</h3>
                  <p className="pf-card__text">{item.issuer}</p>
                  {href && (
                    <a className="pf-link" href={href} target="_blank" rel="noopener noreferrer" aria-label={`${item.title} credential (opens in new tab)`}>
                      View credential
                    </a>
                  )}
                </li>
              )
            })}
          </ul>
        </DataState>
      </div>
    </section>
  )
}