import { Link } from 'react-router-dom'
import { safeHref, truncate } from '../../lib/format'
import type { Project } from '../../types'
import { TagList } from '../ui/TagList'
import { mediaUrl } from '../../lib/media'
import { ScrambleText } from '../ui/ScrambleText'
import { useI18n } from '../../i18n/useI18n'

export function ProjectLinks({ project }: { project: Project }) {
  const { t } = useI18n()
  const github = safeHref(project.githubUrl)
  const live = safeHref(project.liveUrl)
  if (!github && !live) return null

  return (
    <div className="pf-links">
      {github && (
        <a
          className="pf-link"
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${project.title} on ${t('project.github')} (opens in new tab)`}
        >
          <ScrambleText>{t('project.github')}</ScrambleText>
        </a>
      )}
      {live && (
        <a
          className="pf-link"
          href={live}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${project.title} ${t('project.live')} (opens in new tab)`}
        >
          <ScrambleText>{t('project.live')}</ScrambleText>
        </a>
      )}
    </div>
  )
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <li className="pf-card">
      {project.thumbnail && (
        <img
          className="pf-card__image"
          src={mediaUrl(project.thumbnail.url)}
          alt={project.thumbnail.altText ?? ''}
          loading="lazy"
        />
      )}

      <h3 className="pf-card__title">
        <Link to={`/projects/${project.slug}`}>{project.title}</Link>
      </h3>
      <p className="pf-card__text">{truncate(project.description, 160)}</p>
      <TagList
        tags={project.technologies}
        label={`${project.title} technologies`}
        limit={3}
        moreHref={`/projects/${project.slug}#technologies`}
      />
      <ProjectLinks project={project} />
    </li>
  )
}