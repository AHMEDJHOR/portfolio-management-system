import { Link } from 'react-router-dom'
import { useBlogPosts } from '../../hooks/usePortfolio'
import { formatDate } from '../../lib/format'
import { DataState } from '../ui/DataState'
import { SectionHeading } from './SectionHeading'
import { ScrambleText } from '../ui/ScrambleText'

const LATEST_LIMIT = 3

export function BlogSection() {
  const query = useBlogPosts()
  const posts = (query.data ?? []).slice(0, LATEST_LIMIT)

  return (
    <section id="blog" className="pf-section" aria-labelledby="blog-section-title">
      <div className="pf-container">
        <SectionHeading
          id="blog-section-title"
          label="Blog"
          title="Notes on building software"
          lead="Short write-ups on what I learn while shipping."
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
              <ScrambleText>All articles</ScrambleText>
            </Link>
          </p>
        </DataState>
      </div>
    </section>
  )
}