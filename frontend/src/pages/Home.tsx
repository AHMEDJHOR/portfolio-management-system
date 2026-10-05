import { Hero } from '../components/hero/Hero'
import { BlogSection } from '../components/sections/BlogSection'
import { CertificationsSection } from '../components/sections/CertificationsSection'
import { ExperienceSection } from '../components/sections/ExperienceSection'
import { FeaturedProjects } from '../components/sections/FeaturedProjects'
import { SkillsSection } from '../components/sections/SkillsSection'
import { Reveal } from '../components/ui/Reveal'
import { About } from './About'
import { Contact } from './Contact'

export function Home() {
  return (
    <>
      <Hero />
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