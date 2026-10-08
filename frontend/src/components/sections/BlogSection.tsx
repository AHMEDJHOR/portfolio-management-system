import { Link } from 'react-router-dom'
import { useBlogPosts } from '../../hooks/usePortfolio'
import { formatDate } from '../../lib/format'
import { useI18n } from '../../i18n/useI18n'
import { DataState } from '../ui/DataState'
import { SectionHeading } from './SectionHeading'
import { ScrambleText } from '../ui/ScrambleText'
import { mediaUrl } from '../../lib/media'

const LATEST_LIMIT = 4

export function BlogSection() {
  const { t } = useI18n()
  const query = useBlogPosts()
  const posts = (query.data ?? []).slice(0, LATEST_LIMIT)

  return (
    <section id="blog" className="pf-section" aria-labelledby="blog-section-title">
      <div className="pf-container">
        <SectionHeading
          id="blog-section-title"
          label={t('blog.label')}
          title={t('blog.title')}
          lead={t('blog.lead')}
        />
        <DataState
          isPending={query.isPending}
          error={query.error}
          isEmpty={posts.length === 0}
          emptyMessage={t('blog.empty')}
          onRetry={() => void query.refetch()}
        >
          <ul className="pf-grid">
            {posts.map((post) => (
              <li key={post.id} className="pf-card">
              {post.thumbnail && (
  <img
    className="pf-card__image"
    src={mediaUrl(post.thumbnail.url)}
    alt={post.thumbnail.altText ?? post.title}
    loading="lazy"
  />
)}

                <time className="pf-card__meta" dateTime={post.createdAt}>
                  {formatDate(post.createdAt)}
                </time>
                <h3 className="pf-card__title">
                  <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="pf-card__text">{post.excerpt}</p>
              </li>
            ))}
          </ul>
          <p className="pf-more">
            <Link className="pf-link" to="/blog">
              <ScrambleText>{t('blog.all')}</ScrambleText>
            </Link>
          </p>
        </DataState>
      </div>
    </section>
  )
}