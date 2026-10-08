import { Link } from 'react-router-dom'
import { SectionHeading } from '../components/sections/SectionHeading'
import { DataState } from '../components/ui/DataState'
import { useBlogPosts } from '../hooks/usePortfolio'
import { formatDate } from '../lib/format'
import { Seo } from '../components/Seo'
import { useI18n } from '../i18n/useI18n'
import { mediaUrl } from '../lib/media'

export function Blog() {
  const { t } = useI18n()
  const query = useBlogPosts()
  const posts = query.data ?? []

  return (
    <>
      <Seo title="Blog" />

      <section className="pf-page" aria-labelledby="blog-title">
        <div className="pf-container">
          <SectionHeading
            level="h1"
            id="blog-title"
            label={t('blog.label')}
            title={t('blog.title')}
            lead={t('blog.lead')}
          />
          <DataState
            isPending={query.isPending}
            error={query.error}
            isEmpty={posts.length === 0}
            emptyMessage="No articles yet. Check back soon."
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
                  <h2 className="pf-card__title">
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p className="pf-card__text">{post.excerpt}</p>
                </li>
              ))}
            </ul>
          </DataState>
        </div>
      </section>
    </>
  )
}