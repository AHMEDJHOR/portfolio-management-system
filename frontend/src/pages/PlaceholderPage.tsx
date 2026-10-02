import { useParams } from 'react-router-dom'

interface PlaceholderPageProps {
  title: string
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  const params = useParams()
  const entries = Object.entries(params)

  return (
    <section className="container placeholder-page">
      <p className="text-label-sm">Placeholder</p>
      <h1 className="text-headline-lg">{title}</h1>
      {entries.map(([key, value]) => (
        <p key={key} className="text-body-sm">
          <span className="code-inline">{key}</span> = {value}
        </p>
      ))}
    </section>
  )
}