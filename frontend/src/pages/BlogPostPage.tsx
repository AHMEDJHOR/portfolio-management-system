import { Link, useParams } from 'react-router-dom'
import { DataState } from '../components/ui/DataState'
import { useBlogPost } from '../hooks/usePortfolio'
import { formatDate, toParagraphs } from '../lib/format'
import { Seo } from '../components/Seo'
import { useI18n } from '../i18n/useI18n'
import { CommentSection } from '../components/blog/CommentSection'

export function BlogPostPage() {
  const { t } = useI18n()
  const { slug = '' } = useParams()
  const query = useBlogPost(slug)
  const post = query.data?.published ? query.data : undefined

  return (
    <article className="pf-page">
      <div className="pf-container pf-narrow">
        <Link className="pf-link" to="/#blog">
          ← {t('blog.back')}
        </Link>

        <DataState
          isPending={query.isPending}
          error={query.error}
          isEmpty={!post}
          emptyMessage="Article not found."
        >
          {post && (
            <>
              <Seo
                title={post.title}
                description={post.excerpt}
              />

              <header className="pf-heading pf-heading--article">
                <time className="pf-label" dateTime={post.createdAt}>
                  {formatDate(post.createdAt)}
                </time>
                <h1 className="pf-title">{post.title}</h1>
                <p className="pf-lead">{post.excerpt}</p>
              </header>

              <div className="pf-prose">
                {toParagraphs(post.content).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <CommentSection blogId={post.id} />
            </>
          )}
        </DataState>
      </div>
    </article>
  )
}