import { useState } from 'react'
import '../sections/Skills.css'

function iconUrl(name: string, icon: string | null): string {
  const slug = (icon || name).toLowerCase().replace(/[^a-z0-9]/g, '')
  return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${slug}/${slug}-original.svg`
}

export function SkillIcon({ name, icon }: { name: string; icon: string | null }) {
  const [failed, setFailed] = useState(false)

  return (
    <span className="skills-card__icon">
      {failed ? (
        <span className="skills-card__letter" aria-hidden="true">
          {name.charAt(0).toUpperCase()}
        </span>
      ) : (
        <img src={iconUrl(name, icon)} alt="" width={32} height={32} loading="lazy" onError={() => setFailed(true)} />
      )}
    </span>
  )
}