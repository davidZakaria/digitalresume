import { useCallback, useState } from 'react'
import { Navbar } from '../components/Navbar'
import { PageLoader } from '../components/PageLoader'
import { CustomCursor } from '../components/CustomCursor'
import { SmoothScroll } from '../components/SmoothScroll'
import { SkipLink } from '../components/SkipLink'
import { BackToTop } from '../components/BackToTop'
import { SeoJsonLd } from '../components/SeoJsonLd'
import { Hero } from '../components/Hero'
import { AboutSection } from '../components/AboutSection'
import { ExperienceSection } from '../components/ExperienceSection'
import { SkillsSection } from '../components/SkillsSection'
import { WorkSection } from '../components/WorkSection'
import { ProjectsSection } from '../components/ProjectsSection'
import { EducationSection } from '../components/EducationSection'
import { ContactSection } from '../components/ContactSection'
import { Footer } from '../components/Footer'

function loaderAlreadySeen(): boolean {
  try {
    return sessionStorage.getItem('resume-loader-seen') === '1'
  } catch {
    return false
  }
}

export function ResumePage() {
  const [ready, setReady] = useState(loaderAlreadySeen)
  const onLoaderComplete = useCallback(() => setReady(true), [])

  return (
    <>
      {!ready ? <PageLoader onComplete={onLoaderComplete} /> : null}
      <SmoothScroll>
        <SeoJsonLd />
        <CustomCursor />
        <div className="resume-root relative min-h-screen overflow-x-hidden bg-canvas print:bg-white">
          <SkipLink />
          <Navbar />
          <main id="main-content" tabIndex={-1} className="pt-[57px]">
            <Hero />
            <AboutSection />
            <ExperienceSection />
            <SkillsSection />
            <WorkSection />
            <ProjectsSection />
            <EducationSection />
            <ContactSection />
          </main>
          <Footer />
          <BackToTop />
        </div>
      </SmoothScroll>
    </>
  )
}
