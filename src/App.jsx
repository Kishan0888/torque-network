import { useEffect } from 'react'
import Cursor from './components/Cursor'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import StarField from './components/StarField'

import Hero             from './sections/Hero'
import Metrics          from './sections/Metrics'
// import Problem          from './sections/Problem'
import WhatChanges      from './sections/WhatChanges'
import WhatIsTorque     from './sections/WhatIsTorque'
import MemberBenefits   from './sections/MemberBenefits'
import RealBenefits from "./sections/RealBenefits";
import GrowthJourney    from './sections/GrowthJourney'
import DifferentCreators from "./sections/DifferentCreators";
import CreatorTimeline  from './sections/CreatorTimeline'
import HowItWorks       from './sections/HowItWorks'
import IndiaMap         from './sections/IndiaMap'
import FoundingAdvantage from './sections/FoundingAdvantage'
import Pricing          from './sections/Pricing'
import Obligations      from './sections/Obligations'
import CreatorWall      from './sections/CreatorWall'
import ForBrands        from './sections/ForBrands'
import Community        from './sections/Community'
import FAQ              from './sections/FAQ'
import FinalCTA         from './sections/FinalCTA'

function D() {
  return (
    <div style={{ padding:'0 28px' }}>
      <div style={{ height:1, maxWidth:1200, margin:'0 auto',
        background:'linear-gradient(to right,transparent,rgba(59,130,246,0.14),transparent)' }}/>
    </div>
  )
}

export default function App() {
  useEffect(() => {
    const h = (e) => {
      const a = e.target.closest('a[href^="#"]')
      if (!a) return
      const el = document.getElementById(a.getAttribute('href').slice(1))
      if (el) { e.preventDefault(); el.scrollIntoView({ behavior:'smooth', block:'start' }) }
    }
    document.addEventListener('click', h)
    return () => document.removeEventListener('click', h)
  }, [])

  return (
    <div style={{ background:'#050816', minHeight:'100vh' }}>
      <StarField />
      <Cursor />
      <Navbar />
      <main>
        {/* 1 */}
        <Hero />
        <WhatChanges />
        <D/>
        {/* 5 — What Is Torque */}
        <WhatIsTorque />
        <D/>
        <section id="how-it-works"><HowItWorks /></section>
        <D/>
        <RealBenefits />
        {/* 2 — Metrics */}
        <Metrics />
        <D/>
        {/* 3 — Problem */}
        {/* <section id="creators"><Problem /></section>
        <D/> */}
        {/* 4 — What Changes */}
        
        
        {/* 9 — How It Works */}
        
        
        {/* 7 — Growth Journey */}
        <GrowthJourney />
        <D/>
        {/* 6 — Member Benefits */}
        {/* <MemberBenefits />
        <D/> */}
        
        <DifferentCreators />
        
        
        {/* 8 — Creator Timeline */}
        <CreatorTimeline />
        <D/>
        
        {/* 10 — India Map + Roadmap */}
        {/* <IndiaMap />
        <D/> */}
        {/* 11 — Founding Advantage */}
        {/* <FoundingAdvantage />
        <D/> */}
        {/* 12 — Pricing */}
        <section id="pricing"><Pricing /></section>
        <D/>
        {/* 13 — Obligations */}
        <Obligations />
        <D/>
        {/* 14 — Creator Wall */}
        {/* <CreatorWall />
        <D/> */}
        {/* 15 — For Brands */}
        {/* <section id="brands"><ForBrands /></section>
        <D/> */}
        {/* 16 — Community Application */}
        <section id="community"><Community /></section>
        <D/>
        {/* 17 — FAQ */}
        <section id="faq"><FAQ /></section>
        {/* 18 — Final CTA */}
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
