import { useEducation, useExperience } from '../../hooks/usePortfolio'
import { formatRange } from '../../lib/format'
import { useI18n } from '../../i18n/useI18n'
import { DataState } from '../ui/DataState'
import { SectionHeading } from './SectionHeading'

interface TimelineEntry {
  id: string
  title: string
  subtitle: string
  period: string
  description?: string | null
}

const newestFirst = <T extends { startDate: string }>(items: readonly T[]): T[] =>
  [...items].sort((a, b) => b.startDate.localeCompare(a.startDate))

function Timeline({ entries }: { entries: readonly TimelineEntry[] }) {
  return (
    <ol className="pf-timeline">
      {entries.map((entry) => (
        <li key={entry.id} className="pf-timeline__item">
          <p className="pf-timeline__period">{entry.period}</p>
          <h4 className="pf-card__title">{entry.title}</h4>
          <p className="pf-timeline__subtitle">{entry.subtitle}</p>
          {entry.description && <p className="pf-card__text">{entry.description}</p>}
        </li>
      ))}
    </ol>
  )
}

export function ExperienceSection() {
  const { t } = useI18n()
  const experience = useExperience()
  const education = useEducation()

  const work: TimelineEntry[] = newestFirst(experience.data ?? []).map((item) => ({
    id: item.id,
    title: item.position,
    subtitle: item.company,
    period: formatRange(item.startDate, item.isCurrent ? null : item.endDate, t('exp.present')),
    description: item.description,
  }))

  const study: TimelineEntry[] = newestFirst(education.data ?? []).map((item) => ({
    id: item.id,
    title: item.degree,
    subtitle: `${item.institution} · ${item.fieldOfStudy}`,
    period: formatRange(item.startDate, item.endDate, t('exp.present')),
    description: item.description,
  }))

  return (
    <section id="experience" className="pf-section" aria-labelledby="experience-title">
      <div className="pf-container">
        <SectionHeading
          id="experience-title"
          label={t('exp.label')}
          title={t('exp.title')}
        />
        <div className="pf-timelines">
          <div>
            <h3 className="pf-subtitle">{t('exp.work')}</h3>
            <DataState
              isPending={experience.isPending}
              error={experience.error}
              isEmpty={work.length === 0}
              emptyMessage={t('exp.emptyWork')}
              onRetry={() => void experience.refetch()}
            >
              <Timeline entries={work} />
            </DataState>
          </div>
          <div>
            <h3 className="pf-subtitle">{t('exp.study')}</h3>
            <DataState
              isPending={education.isPending}
              error={education.error}
              isEmpty={study.length === 0}
              emptyMessage={t('exp.emptyStudy')}
              onRetry={() => void education.refetch()}
            >
              <Timeline entries={study} />
            </DataState>
          </div>
        </div>
      </div>
    </section>
  )
}