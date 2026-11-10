/* LinkedIn version of the problem → solution infographic (/1.png on Instagram). */
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { LiPost, Bubble, Row, Pill, HEAD, LI } from './LiParts'

export default function LiProblemSolution() {
  return (
    <div className="lps">
      {/* Problem */}
      <div className="lps-panel lps-left">
        <div className="lps-inner">
          <div>
            <Pill bg="#F9A8B8" color="#7F1D1D">THE PROBLEM</Pill>
            <h3 style={{ fontFamily: HEAD, fontSize: 'clamp(1.6rem,2.6vw,2.15rem)', lineHeight: 1.08, fontWeight: 700, color: '#fff', margin: '14px 0 20px', letterSpacing: '-0.02em' }}>
              LinkedIn Isn&apos;t Ignoring You.<br /><span style={{ color: '#FACC15' }}>Your Posts Just Start Cold.</span>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
              <Row dark>Posts with no early reactions quietly sink in the feed.</Row>
              <Row dark>Your connections scroll past. The right people never see it.</Row>
              <Row dark>Hours spent on a great post, and it gets three likes.</Row>
              <Row dark>So most professionals simply stop posting.</Row>
            </div>
          </div>
          <div className="lps-visual">
            <Bubble style={{ top: -6, right: 0, width: 168, zIndex: 2 }}>Why is nobody engaging with my posts?</Bubble>
            <motion.div initial={{ y: 10, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              style={{ marginTop: 96, width: '100%', display: 'flex', justifyContent: 'center' }}>
              <LiPost quiet width="min(100%, 230px)" tilt={-3} />
            </motion.div>
          </div>
        </div>
      </div>

      <div className="lps-arrow" aria-hidden="true"><ArrowRight size={20} color={LI} strokeWidth={2.6} /></div>

      {/* Solution */}
      <div className="lps-panel lps-right">
        <div className="lps-inner">
          <div>
            <Pill bg="#BBF7D0" color="#14532D">THE SOLUTION</Pill>
            <h3 style={{ fontFamily: HEAD, fontSize: 'clamp(1.6rem,2.6vw,2.15rem)', lineHeight: 1.08, fontWeight: 700, color: '#0F172A', margin: '14px 0 20px', letterSpacing: '-0.02em' }}>
              A Professional Network<br /><span style={{ color: LI }}>That Backs Your Posts.</span>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
              <Row ok>Peers from your industry react and comment early.</Row>
              <Row ok>Thoughtful comments turn posts into conversations.</Row>
              <Row ok>LinkedIn shows your post to more of the right people.</Row>
              <Row ok>Your profile builds credibility, week after week.</Row>
            </div>
          </div>
          <div className="lps-visual">
            <div style={{ position: 'absolute', top: 0, right: 4, fontFamily: "Caveat,'Segoe Print',cursive", fontSize: 20, lineHeight: 1.1, color: '#334155', transform: 'rotate(-6deg)', textAlign: 'right' }}>
              Same post.<br />Real conversations ♡
            </div>
            <motion.div initial={{ y: 14, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}
              style={{ marginTop: 84, width: '100%', display: 'flex', justifyContent: 'center' }}>
              <LiPost width="min(100%, 240px)" tilt={2} />
            </motion.div>
          </div>
        </div>
      </div>

      <div className="lps-foot">MORE VISIBILITY &nbsp;|&nbsp; MORE CREDIBILITY &nbsp;|&nbsp; MORE OPPORTUNITIES</div>

      <style>{`
        .lps{ position:relative; display:grid; grid-template-columns:1fr 1fr; background:#F7F3EC; }
        .lps-panel{ position:relative; padding:44px 36px 64px; }
        .lps-left{
          background:radial-gradient(circle at 75% 30%, rgba(236,72,153,.12), transparent 55%), linear-gradient(160deg,#1C1F2E,#0E1120);
          clip-path:polygon(0 0,100% 0,calc(100% - 56px) 100%,0 100%); margin-right:-56px; padding-right:84px; z-index:1;
        }
        .lps-right{ padding-left:66px; background:radial-gradient(circle at 80% 20%, rgba(250,204,21,.18), transparent 55%), #F7F3EC; }
        .lps-inner{ display:grid; grid-template-columns:1.2fr .8fr; gap:18px; align-items:start; }
        .lps-visual{ position:relative; min-height:300px; }
        .lps-arrow{ position:absolute; left:50%; top:46%; transform:translate(-50%,-50%); z-index:3; width:46px; height:46px; border-radius:50%; background:#fff; display:flex; align-items:center; justify-content:center; box-shadow:0 8px 24px rgba(0,0,0,.25); }
        .lps-foot{ position:absolute; left:0; right:0; bottom:16px; text-align:center; font-size:11.5px; letter-spacing:.22em; color:#475569; font-weight:600; z-index:2; pointer-events:none; }
        @media(max-width:1100px){ .lps-inner{ grid-template-columns:1fr; } .lps-visual{ min-height:260px; } }
        @media(max-width:768px){
          .lps{ grid-template-columns:1fr; }
          .lps-left{ clip-path:none; margin-right:0; padding:32px 22px 30px; }
          .lps-right{ padding:40px 22px 62px; }
          .lps-arrow{ position:relative; left:auto; top:auto; transform:rotate(90deg); margin:-23px auto; }
          .lps-visual{ min-height:250px; max-width:300px; margin:0 auto; width:100%; }
          .lps-foot{ font-size:10px; letter-spacing:.12em; }
        }
      `}</style>
    </div>
  )
}
