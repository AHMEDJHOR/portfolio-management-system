interface SeoProps {
  title?: string
  description?: string
}

const SITE = 'Ahmed Jhor'
const DEFAULT_DESCRIPTION =
  'Portfolio of Ahmed Jhor, a full-stack developer building reliable web applications.'

export function Seo({ title, description = DEFAULT_DESCRIPTION }: SeoProps) {
  const fullTitle = title ? `${title} | ${SITE}` : `${SITE} | Full-Stack Developer`

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
    </>
  )
}