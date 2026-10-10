import { Hero } from '../components/hero/Hero'
import { BlogSection } from '../components/sections/BlogSection'
import { CertificationsSection } from '../components/sections/CertificationsSection'
import { ExperienceSection } from '../components/sections/ExperienceSection'
import { FeaturedProjects } from '../components/sections/FeaturedProjects'
import { SkillsSection } from '../components/sections/SkillsSection'
import { Reveal } from '../components/ui/Reveal'
import { StatsStrip } from '../components/sections/StatsStrip'
import { Seo } from '../components/Seo'
import { About } from './About'
import { Contact } from './Contact'

export function Home() {
  return (
    <>
      <Seo
           title="Full-Stack Developer"
           description="Explore Ahmed Jhor's portfolio, software development projects, and experience building web applications with React, TypeScript, Node.js, and Laravel."
       />

      <Hero />
      <StatsStrip />
      <Reveal>
        <About />
      </Reveal>
      <Reveal>
        <SkillsSection />
      </Reveal>
      <Reveal>
        <FeaturedProjects />
      </Reveal>
      <Reveal>
        <ExperienceSection />
      </Reveal>
      <Reveal>
        <CertificationsSection />
      </Reveal>
      <Reveal>
        <BlogSection />
      </Reveal>
      <Reveal>
        <Contact />
      </Reveal>
    </>
  )
}
