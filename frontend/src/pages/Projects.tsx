import { ProjectCard } from '../components/sections/ProjectCard'
import { SectionHeading } from '../components/sections/SectionHeading'
import { DataState } from '../components/ui/DataState'
import { useProjects } from '../hooks/usePortfolio'

export function Projects() {
  const query = useProjects()
  const projects = query.data ?? []

  return (
    <section className="pf-page" aria-labelledby="projects-title">
      <div className="pf-container">
        <SectionHeading
          level="h1"
          id="projects-title"
          label="Projects"
          title="Things I have built"
          lead="Case studies, source code and live demos where available."
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
  )
}