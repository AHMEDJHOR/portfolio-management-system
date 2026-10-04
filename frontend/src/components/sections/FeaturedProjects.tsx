import { Link } from 'react-router-dom'
import { useProjects } from '../../hooks/usePortfolio'
import { DataState } from '../ui/DataState'
import { ProjectCard } from './ProjectCard'
import { SectionHeading } from './SectionHeading'
import { ScrambleText } from '../ui/ScrambleText'

const FEATURED_LIMIT = 3

export function FeaturedProjects() {
  const query = useProjects()
  const featured = (query.data ?? []).filter((project) => project.featured).slice(0, FEATURED_LIMIT)

  return (
    <section id="projects" className="pf-section" aria-labelledby="featured-title">
      <div className="pf-container">
        <SectionHeading
          id="featured-title"
          label="Projects"
          title="Selected work"
          lead="A few projects that show how I build, from data model to interface."
        />
        <DataState
          isPending={query.isPending}
          error={query.error}
          isEmpty={featured.length === 0}
          emptyMessage="Featured projects will appear here soon."
          onRetry={() => void query.refetch()}
        >
          <ul className="pf-grid">
            {featured.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </ul>
          <p className="pf-more">
            <Link className="pf-link" to="/projects">
              <ScrambleText>All projects</ScrambleText>
            </Link>
          </p>
        </DataState>
      </div>
    </section>
  )
}