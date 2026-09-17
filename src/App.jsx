import { useEffect } from 'react'
import Cursor from './components/Cursor'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import StarField from './components/StarField'

// Sections
import Hero          from './sections/Hero'
import Metrics       from './sections/Metrics'
import CreatorUniverse from './sections/CreatorUniverse'
import TrustPillars  from './sections/TrustPillars'
import Problem       from './sections/Problem'
import HowItWorks    from './sections/HowItWorks'
import WhyTorque     from './sections/WhyTorque'
import GrowthJourney from './sections/GrowthJourney'
import CreatorTimeline from './sections/CreatorTimeline'
import IndiaMap      from './sections/IndiaMap'
import CreatorWall   from './sections/CreatorWall'
import ForBrands     from './sections/ForBrands'
import Community     from './sections/Community'
import FAQ           from './sections/FAQ'
import FinalCTA      from './sections/FinalCTA'

function Divider() {
  return (
    <div style={{ padding: '0 28px' }}>
      <div style={{
        height: 1, maxWidth: 1200, margin: '0 auto',
        background: 'linear-gradient(to right, transparent, rgba(59,130,246,0.15), transparent)',
      }} />
    </div>
  )
}

export default function App() {
  useEffect(() => {
    // Smooth anchor scroll
    const handler = (e) => {
      const a = e.target.closest('a[href^="#"]')
      if (!a) return
      const id = a.getAttribute('href').slice(1)
      const el = document.getElementById(id)
      if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }) }
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  return (
    <div style={{ background: '#050816', minHeight: '100vh', position: 'relative' }}>
      {/* Persistent animated background */}
      <StarField />

      {/* UI chrome */}
      <Cursor />
      <Navbar />

      <main>
        {/* ── HERO ────────────────────────────── */}
        <Hero />

        {/* ── METRICS BAR ─────────────────────── */}
        <Metrics />
        <Divider />

        {/* ── CREATOR UNIVERSE (signature 3D) ─── */}
        <CreatorUniverse />
        <Divider />

        {/* ── TRUST PILLARS ───────────────────── */}
        <TrustPillars />
        <Divider />

        {/* ── THE PROBLEM ─────────────────────── */}
        <section id="creators"><Problem /></section>
        <Divider />

        {/* ── HOW IT WORKS ────────────────────── */}
        <section id="how-it-works"><HowItWorks /></section>
        <Divider />

        {/* ── INFRASTRUCTURE / WHY TORQUE ─────── */}
        <WhyTorque />
        <Divider />

        {/* ── GROWTH JOURNEY ──────────────────── */}
        <GrowthJourney />
        <Divider />

        {/* ── CREATOR TIMELINE (Year 1/2/3+) ─── */}
        <CreatorTimeline />
        <Divider />

        {/* ── INDIA MAP ───────────────────────── */}
        <IndiaMap />
        <Divider />

        {/* ── FOUNDING CREATOR WALL ───────────── */}
        <CreatorWall />
        <Divider />

        {/* ── FOR BRANDS ──────────────────────── */}
        <section id="brands"><ForBrands /></section>
        <Divider />

        {/* ── COMMUNITY APPLICATION ───────────── */}
        <section id="community"><Community /></section>
        <Divider />

        {/* ── FAQ ─────────────────────────────── */}
        <section id="faq"><FAQ /></section>

        {/* ── FINAL CTA ───────────────────────── */}
        <FinalCTA />
      </main>

      <Footer />
    </div>
  )
}
