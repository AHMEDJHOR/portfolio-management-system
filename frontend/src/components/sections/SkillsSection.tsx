import { useSkills } from '../../hooks/usePortfolio'
import type { Skill } from '../../types'
import { DataState } from '../ui/DataState'
import { SectionHeading } from './SectionHeading'
import { SkillIcon } from '../ui/SkillIcon'
import { useI18n } from '../../i18n/useI18n'
import './Skills.css'

const MIN_PER_SET = 8 // each looping set is repeated up to this many cards so it fills wide screens
const SECONDS_PER_CARD = 5

function SkillCard({ skill, hidden }: { skill: Skill; hidden: boolean }) {
  return (
    <li className="skills-card" aria-hidden={hidden ? true : undefined}>
      <SkillIcon name={skill.name} icon={skill.icon} />
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
  const { t } = useI18n()
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
  label={t('skills.label')}
  title={t('skills.title')}
  lead={t('skills.lead')}
/>
      </div>

      <DataState
        isPending={query.isPending}
        error={query.error}
        isEmpty={skills.length === 0}
        emptyMessage={t('skills.empty')}
        onRetry={() => void query.refetch()}
      >
        <div className="skills-marquee">
          <MarqueeRow skills={first} label={t('skills.row1')} />
<MarqueeRow
  skills={second.length > 0 ? second : first}
  reverse
  label={t('skills.row2')}
/>
        </div>
      </DataState>
    </section>
  )
}