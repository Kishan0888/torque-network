import { Suspense, useRef } from 'react'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { useInView } from '../hooks/useInView'
import { ArrowRight, Phone, Mail, Globe } from 'lucide-react'

function ParticleUniverse() {
  const ref = useRef()
  const count = 120
  const pos = new Float32Array(count*3), col = new Float32Array(count*3)
  const pal = [[0.23,0.51,0.96],[0.13,0.83,0.93],[0.51,0.55,0.97],[0.85,0.62,0.13]]
  for(let i=0;i<count;i++){
    pos[i*3]=(Math.random()-.5)*16; pos[i*3+1]=(Math.random()-.5)*16; pos[i*3+2]=(Math.random()-.5)*16
    const c=pal[Math.floor(Math.random()*pal.length)]; col[i*3]=c[0]; col[i*3+1]=c[1]; col[i*3+2]=c[2]
  }
  useFrame(({ clock }) => {
    if(ref.current){ ref.current.rotation.y=clock.getElapsedTime()*0.032; ref.current.rotation.x=Math.sin(clock.getElapsedTime()*0.016)*0.16 }
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos,3]}/>
        <bufferAttribute attach="attributes-color" args={[col,3]}/>
      </bufferGeometry>
      <pointsMaterial size={0.045} vertexColors transparent opacity={0.65}/>
    </points>
  )
}

export default function FinalCTA() {
  const [ref, inView] = useInView()
  return (
    <section style={{ position:'relative', padding:'160px 0 180px', overflow:'hidden' }}>
      <div style={{ position:'absolute', inset:0, zIndex:0 }}>
        <Canvas camera={{ position:[0,0,9], fov:55 }} style={{ background:'transparent' }} dpr={[1,1.5]}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.4}/>
            <ParticleUniverse/>
          </Suspense>
        </Canvas>
      </div>
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:1 }}>
        <div className="aurora" style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:800, height:800, borderRadius:'50%', background:'radial-gradient(circle,rgba(59,130,246,0.13),rgba(34,211,238,0.07),transparent 65%)', filter:'blur(60px)' }}/>
        <div className="aurora" style={{ position:'absolute', top:'20%', left:'15%', width:450, height:450, borderRadius:'50%', background:'radial-gradient(circle,rgba(245,158,11,0.06),transparent 70%)', filter:'blur(50px)', animationDelay:'-12s' }}/>
      </div>

      <div className="container" style={{ position:'relative', zIndex:2, textAlign:'center' }}>
        <motion.div ref={ref} initial={{opacity:0,y:52}} animate={inView?{opacity:1,y:0}:{}}
          transition={{duration:1.05,ease:[0.23,1,0.32,1]}}>

          <motion.div className="section-tag"
            animate={{boxShadow:['0 0 0 rgba(245,158,11,0)','0 0 30px rgba(245,158,11,0.35)','0 0 0 rgba(245,158,11,0)']}}
            transition={{duration:3,repeat:Infinity}}
            style={{ display:'inline-flex', alignItems:'center', gap:8, marginBottom:40, borderColor:'rgba(245,158,11,0.3)' }}>
            <span style={{ width:7, height:7, borderRadius:'50%', background:'#F59E0B', display:'inline-block' }} className="pulse-ring"/>
            500 Founding Spots · Free for Life
          </motion.div>

          <h2 style={{ fontSize:'clamp(2.6rem,7vw,6.5rem)', fontWeight:700, lineHeight:1.02, letterSpacing:'-0.04em', marginBottom:20, fontFamily:'Space Grotesk' }}>
            Your next post<br/>
            <span className="gradient-text glow-text">shouldn't start</span><br/>
            from zero.
          </h2>

          <p style={{ fontSize:18, color:'#64748B', maxWidth:560, margin:'0 auto 18px', lineHeight:1.72 }}>
            Join the first 500 creators. Free for life. Between 500 and 2,500 real creators will watch, save and share every post you publish — within 48 hours.
          </p>
          <p style={{ fontSize:14, color:'#F59E0B', maxWidth:460, margin:'0 auto 52px', lineHeight:1.65, fontWeight:600 }}>
            Stay free by engaging regularly with all posts. Once all 500 founding spots are taken, joining costs ₹1,500 per month.
          </p>

          <div style={{ display:'flex', flexWrap:'wrap', gap:16, justifyContent:'center', marginBottom:48 }}>
            <motion.a href="#community"
              style={{ display:'inline-flex', alignItems:'center', gap:8, fontSize:16, padding:'18px 38px', borderRadius:16,
                background:'linear-gradient(135deg,#D97706,#F59E0B)', color:'#fff', fontWeight:700, textDecoration:'none',
                boxShadow:'0 0 30px rgba(245,158,11,0.4)' }}
              whileHover={{ scale:1.05, boxShadow:'0 0 70px rgba(245,158,11,0.65)' }}
              whileTap={{ scale:0.97 }}
              animate={{ boxShadow:['0 0 20px rgba(245,158,11,0.3)','0 0 55px rgba(245,158,11,0.55)','0 0 20px rgba(245,158,11,0.3)'] }}
              transition={{ duration:3, repeat:Infinity }}>
              Claim Your Free Founding Spot <ArrowRight size={18}/>
            </motion.a>
            <a href="#how-it-works" className="btn-ghost" style={{ fontSize:16, padding:'18px 36px', borderRadius:16, textDecoration:'none' }}>
              See How It Works
            </a>
          </div>

          <motion.div initial={{opacity:0,y:16}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:0.6}}
            style={{ display:'flex', flexWrap:'wrap', gap:28, justifyContent:'center', alignItems:'center' }}>
            {[
              { icon:Mail,  text:'hello@torquenetwork.in' },
              { icon:Globe, text:'torquenetwork.in' },
              { icon:Phone, text:'Reply with your email & number' },
            ].map(({ icon:Icon, text })=>(
              <div key={text} style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, color:'#475569' }}>
                <Icon size={14} color="#3B82F6"/><span>{text}</span>
              </div>
            ))}
          </motion.div>

          <p style={{ fontSize:11, color:'#2D3748', marginTop:28 }}>
            Amplification Network for Instagram Creators · Free for life for the first 500 · Engage regularly to keep it free
          </p>
        </motion.div>
      </div>
    </section>
  )
}
