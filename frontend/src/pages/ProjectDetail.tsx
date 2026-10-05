import { Link, useParams } from 'react-router-dom'
import { ProjectLinks } from '../components/sections/ProjectCard'
import { DataState } from '../components/ui/DataState'
import { TagList } from '../components/ui/TagList'
import { useProject } from '../hooks/usePortfolio'
import { toParagraphs, truncate } from '../lib/format'
import { mediaUrl } from '../lib/media'
import { Seo } from '../components/Seo'

export function ProjectDetail() {
  const { slug = '' } = useParams()
  const query = useProject(slug)
  const project = query.data

  return (
    <article className="pf-page">
      <div className="pf-container pf-narrow">
        <Link className="pf-link" to="/#projects">
          ← Back to projects
        </Link>
        <DataState
          isPending={query.isPending}
          error={query.error}
          isEmpty={!project}
          emptyMessage="Project not found."
        >
          {project && (
            <>
              <Seo
                title={project.title}
                description={truncate(project.description, 155)}
              />

              <header className="pf-heading pf-heading--article">
                <p className="pf-label">Project</p>
                <h1 className="pf-title">{project.title}</h1>
                {project.thumbnail && (
                  <img
                    className="pf-detail-image"
                    src={mediaUrl(project.thumbnail.url)}
                    alt={project.thumbnail.altText ?? ''}
                  />
                )}
                <TagList
                  tags={project.technologies}
                  label="Technologies"
                />
                <ProjectLinks project={project} />
              </header>

              <div className="pf-prose">
                {toParagraphs(project.description ?? '').map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </>
          )}
        </DataState>
      </div>
    </article>
  )
}