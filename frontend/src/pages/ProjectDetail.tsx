import { useEffect } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { Seo } from '../components/Seo'
import { ProjectLinks } from '../components/sections/ProjectCard'
import { DataState } from '../components/ui/DataState'
import { SkillIcon } from '../components/ui/SkillIcon'
import { useI18n } from '../i18n/useI18n'
import { useProject } from '../hooks/usePortfolio'
import { toParagraphs, truncate } from '../lib/format'
import { mediaUrl } from '../lib/media'

export function ProjectDetail() {
  const { slug = '' } = useParams()
  const { hash } = useLocation()
  const { t } = useI18n()
  const query = useProject(slug)
  const project = query.data

  // The "+N" chip links here, but the page data loads after navigation, so scroll once it exists.
  useEffect(() => {
    if (project && hash === '#technologies') {
      document.getElementById('technologies')?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [project, hash])

  return (
    <article className="pf-page">
      <div className="pf-container pf-narrow">
        <Link className="pf-link" to="/#projects">
          ← {t('project.back')}
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
                <ProjectLinks project={project} />
              </header>

              <div className="pf-prose">
                {toParagraphs(project.description ?? '').map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              {project.skills.length > 0 && (
                <section id="technologies" className="pf-tech" aria-labelledby="tech-title">
                  <h2 id="tech-title" className="pf-subtitle">
                    {t('project.techTitle')}
                  </h2>
                  <ul className="pf-grid">
                    {project.skills.map((skill) => (
                      <li key={skill.name} className="pf-card pf-tech-card">
                        <SkillIcon name={skill.name} icon={skill.icon} />
                        <span className="skills-card__text">
                          <span className="skills-card__name">{skill.name}</span>
                          <span className="skills-card__category">{skill.category}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </>
          )}
        </DataState>
      </div>
    </article>
  )
}