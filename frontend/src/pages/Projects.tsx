import { ProjectCard } from '../components/sections/ProjectCard'
import { SectionHeading } from '../components/sections/SectionHeading'
import { DataState } from '../components/ui/DataState'
import { useProjects } from '../hooks/usePortfolio'
import { Seo } from '../components/Seo'
import { useI18n } from '../i18n/useI18n'

export function Projects() {
  const { t } = useI18n()
  const query = useProjects()
  const projects = query.data ?? []

  return (
    <>
      <Seo title="Projects" />

      <section className="pf-page" aria-labelledby="projects-title">
        <div className="pf-container">
          <SectionHeading
            level="h1"
            id="projects-title"
            label={t('projects.label')}
            title={t('projects.title')}
            lead={t('projects.lead')}
          />
          <DataState
            isPending={query.isPending}
            error={query.error}
            isEmpty={projects.length === 0}
            emptyMessage="Projects will appear here soon."
            onRetry={() => void query.refetch()}
          >
            <ul className="pf-grid">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </ul>
          </DataState>
        </div>
      </section>
    </>
  )
}