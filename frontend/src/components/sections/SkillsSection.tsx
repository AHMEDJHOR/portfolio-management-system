import { useState } from 'react'
import { useSkills } from '../../hooks/usePortfolio'
import type { Skill } from '../../types'
import { DataState } from '../ui/DataState'
import { SectionHeading } from './SectionHeading'
import './Skills.css'

const MIN_PER_SET = 8 // each looping set is repeated up to this many cards so it fills wide screens
const SECONDS_PER_CARD = 5

// Icons come from the open-source Devicon set (jsDelivr). Names are normalised, so
// "Node.js" becomes "nodejs". Anything that fails to load falls back to a letter tile.
function iconUrl(skill: Skill): string {
  const slug = (skill.icon || skill.name).toLowerCase().replace(/[^a-z0-9]/g, '')
  return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${slug}/${slug}-original.svg`
}

function SkillIcon({ skill }: { skill: Skill }) {
  const [failed, setFailed] = useState(false)

  return (
    <span className="skills-card__icon">
      {failed ? (
        <span className="skills-card__letter" aria-hidden="true">
          {skill.name.charAt(0).toUpperCase()}
        </span>
      ) : (
        <img
          src={iconUrl(skill)}
          alt=""
          width={32}
          height={32}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      )}
    </span>
  )
}

function SkillCard({ skill, hidden }: { skill: Skill; hidden: boolean }) {
  return (
    <li className="skills-card" aria-hidden={hidden ? true : undefined}>
      <SkillIcon skill={skill} />
      <span className="skills-card__text">
        <span className="skills-card__name">{skill.name}</span>
        <span className="skills-card__category">{skill.category}</span>
      </span>
    </li>
  )
}

function fillTo(skills: readonly Skill[], min: number): Skill[] {
  const out: Skill[] = []
  while (out.length < min) out.push(...skills)
  return out
}

interface MarqueeRowProps {
  skills: readonly Skill[]
  reverse?: boolean
  label: string
}

function MarqueeRow({ skills, reverse = false, label }: MarqueeRowProps) {
  const items = fillTo(skills, MIN_PER_SET)
  const seconds = Math.max(items.length * SECONDS_PER_CARD, 30)

  return (
    <div className="skills-row">
      <div
        className={reverse ? 'skills-track skills-track--reverse' : 'skills-track'}
        style={{ animationDuration: `${seconds}s` }}
      >
        <ul className="skills-set" aria-label={label}>
          {items.map((skill, index) => (
            <SkillCard key={`${skill.id}-${index}`} skill={skill} hidden={index >= skills.length} />
          ))}
        </ul>
        {/* Identical copy that makes the loop seamless; invisible to assistive tech. */}
        <ul className="skills-set skills-set--clone" aria-hidden="true">
          {items.map((skill, index) => (
            <SkillCard key={`${skill.id}-${index}`} skill={skill} hidden />
          ))}
        </ul>
      </div>
    </div>
  )
}

export function SkillsSection() {
  const query = useSkills()
  const skills = query.data ?? []

  // Alternate skills between the rows. With a single skill, both rows share it.
  const first = skills.filter((_, index) => index % 2 === 0)
  const second = skills.filter((_, index) => index % 2 === 1)

  return (
    <section id="skills" className="pf-section" aria-labelledby="skills-title">
      <div className="pf-container">
        <SectionHeading
          id="skills-title"
          label="Skills"
          title="Tools I work with"
          lead="The languages, frameworks and tools I use to design, build and ship software."
        />
      </div>

      <DataState
        isPending={query.isPending}
        error={query.error}
        isEmpty={skills.length === 0}
        emptyMessage="Skills will appear here soon."
        onRetry={() => void query.refetch()}
      >
        <div className="skills-marquee">
          <MarqueeRow skills={first} label="Skills, first row" />
          <MarqueeRow skills={second.length > 0 ? second : first} reverse label="Skills, second row" />
        </div>
      </DataState>
    </section>
  )
}