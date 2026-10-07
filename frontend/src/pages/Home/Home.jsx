import { useEffect } from 'react'
import './Home.css'

import Navbar from './components/Navbar'
import Hero from './components/Hero'
import FeatureStrip from './components/FeatureStrip'
import RoleShowcase from './components/RoleShowcase'
import StatsSection from './components/StatsSection'
import HowItWorks from './components/HowItWorks'
import FeatureShowcase from './components/FeatureShowcase'
import Benefits from './components/Benefits'
import CTA from './components/CTA'
import Footer from './components/Footer'

export default function Home() {
  useEffect(() => {
    // Scroll reveal observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    )

    const elements = document.querySelectorAll('.scroll-reveal')
    elements.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeatureStrip />
        <RoleShowcase />
        <StatsSection />
        <HowItWorks />
        <FeatureShowcase />
        <Benefits />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
