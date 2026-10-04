import { Hero } from '../components/hero/Hero'
import { BlogSection } from '../components/sections/BlogSection'
import { CertificationsSection } from '../components/sections/CertificationsSection'
import { ExperienceSection } from '../components/sections/ExperienceSection'
import { FeaturedProjects } from '../components/sections/FeaturedProjects'
import { SkillsSection } from '../components/sections/SkillsSection'
import { About } from './About'
import { Contact } from './Contact'

export function Home() {
  return (
    <>
      <Hero />
      <About />
      <SkillsSection />
      <FeaturedProjects />
      <ExperienceSection />
      <CertificationsSection />
      <BlogSection />
      <Contact />
    </>
  )
}