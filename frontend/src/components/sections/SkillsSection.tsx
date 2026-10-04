import { useMemo } from 'react'
import { useSkills } from '../../hooks/usePortfolio'
import type { Skill } from '../../types'
import { DataState } from '../ui/DataState'
import { TagList } from '../ui/TagList'
import { SectionHeading } from './SectionHeading'

function groupByCategory(skills: readonly Skill[]): [string, string[]][] {
  const groups = new Map<string, string[]>()
  for (const skill of skills) {
    const names = groups.get(skill.category)
    if (names) names.push(skill.name)
    else groups.set(skill.category, [skill.name])
  }
  return [...groups]
}

export function SkillsSection() {
  const query = useSkills()
  const groups = useMemo(() => groupByCategory(query.data ?? []), [query.data])

  return (
    <section id="skills" className="pf-section" aria-labelledby="skills-title">
      <div className="pf-container">
        <SectionHeading
          id="skills-title"
          label="Skills"
          title="Tools I work with"
          lead="Grouped by area, without scores or percentages. The projects show how I use them."
        />
        <DataState
          isPending={query.isPending}
          error={query.error}
          isEmpty={groups.length === 0}
          emptyMessage="Skills will appear here soon."
          onRetry={() => void query.refetch()}
        >
          <ul className="pf-grid">
            {groups.map(([category, names]) => (
              <li key={category} className="pf-card">
                <span className="pf-card__meta">{names.length} {names.length === 1 ? 'skill' : 'skills'}</span>
                <h3 className="pf-card__title">{category}</h3>
                <TagList tags={names} label={`${category} skills`} />
              </li>
            ))}
          </ul>
        </DataState>
      </div>
    </section>
  )
}