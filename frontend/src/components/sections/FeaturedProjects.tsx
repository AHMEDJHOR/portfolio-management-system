import { Link } from 'react-router-dom'
import { useProjects } from '../../hooks/usePortfolio'
import { DataState } from '../ui/DataState'
import { ProjectCard } from './ProjectCard'
import { SectionHeading } from './SectionHeading'
import { ScrambleText } from '../ui/ScrambleText'
import { useI18n } from '../../i18n/useI18n'

const FEATURED_LIMIT = 3

export function FeaturedProjects() {
  const { t } = useI18n()
  const query = useProjects()
  const featured = (query.data ?? []).filter((project) => project.featured).slice(0, FEATURED_LIMIT)

  return (
    <section id="projects" className="pf-section" aria-labelledby="featured-title">
      <div className="pf-container">
        <SectionHeading
          id="featured-title"
          label={t('projects.label')}
          title={t('projects.title')}
          lead={t('projects.lead')}
        />
        <DataState
          isPending={query.isPending}
          error={query.error}
          isEmpty={featured.length === 0}
          emptyMessage={t('projects.empty')}
          onRetry={() => void query.refetch()}
        >
          <ul className="pf-grid">
            {featured.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </ul>
          <p className="pf-more">
            <Link className="pf-link" to="/projects">
              <ScrambleText>{t('projects.all')}</ScrambleText>
            </Link>
          </p>
        </DataState>
      </div>
    </section>
  )
}