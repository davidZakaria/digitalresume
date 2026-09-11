import { Navbar } from '../components/Navbar'
import { SmoothScroll } from '../components/SmoothScroll'
import { SkipLink } from '../components/SkipLink'
import { BackToTop } from '../components/BackToTop'
import { SeoJsonLd } from '../components/SeoJsonLd'
import { Hero } from '../components/Hero'
import { AboutSection } from '../components/AboutSection'
import { ExperienceSection } from '../components/ExperienceSection'
import { SkillsSection } from '../components/SkillsSection'
import { ProjectsSection } from '../components/ProjectsSection'
import { EducationSection } from '../components/EducationSection'
import { ContactSection } from '../components/ContactSection'
import { Footer } from '../components/Footer'

export function ResumePage() {
  return (
    <SmoothScroll>
      <SeoJsonLd />
      <div className="resume-root relative min-h-screen overflow-x-hidden bg-surface print:bg-white">
        <SkipLink />
        <Navbar />
        <main id="main-content" tabIndex={-1}>
          <Hero />
          <AboutSection />
          <ExperienceSection />
          <SkillsSection />
          <ProjectsSection />
          <EducationSection />
          <ContactSection />
        </main>
        <Footer />
        <BackToTop />
      </div>
    </SmoothScroll>
  )
}
