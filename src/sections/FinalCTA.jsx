import { Suspense, useRef } from 'react'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { useInView } from '../hooks/useInView'
import { ArrowRight } from 'lucide-react'
import * as THREE from 'three'

function ParticleUniverse() {
  const ref = useRef()
  const count = 110
  const [pos, col] = (() => {
    const p = new Float32Array(count*3), c = new Float32Array(count*3)
    const pal = [[0.23,0.51,0.96],[0.13,0.83,0.93],[0.51,0.55,0.97]]
    for (let i=0;i<count;i++){
      p[i*3]=(Math.random()-.5)*14;p[i*3+1]=(Math.random()-.5)*14;p[i*3+2]=(Math.random()-.5)*14
      const cl=pal[Math.floor(Math.random()*pal.length)]
      c[i*3]=cl[0];c[i*3+1]=cl[1];c[i*3+2]=cl[2]
    }
    return [p,c]
  })()
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime()*0.035
      ref.current.rotation.x = Math.sin(clock.getElapsedTime()*0.018)*0.18
    }
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos,3]}/>
        <bufferAttribute attach="attributes-color"    args={[col,3]}/>
      </bufferGeometry>
      <pointsMaterial size={0.045} vertexColors transparent opacity={0.65}/>
    </points>
  )
}

export default function FinalCTA() {
  const [ref, inView] = useInView()
  return (
    <section style={{position:'relative',padding:'160px 0 180px',overflow:'hidden'}}>
      {/* Particle canvas */}
      <div style={{position:'absolute',inset:0,zIndex:0}}>
        <Canvas camera={{position:[0,0,9],fov:55}} style={{background:'transparent'}} dpr={[1,1.5]}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.4}/>
            <ParticleUniverse/>
          </Suspense>
        </Canvas>
      </div>

      {/* Aurora overlays */}
      <div style={{position:'absolute',inset:0,pointerEvents:'none',zIndex:1}}>
        <div className="aurora" style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:800,height:800,borderRadius:'50%',background:'radial-gradient(circle,rgba(59,130,246,0.13),rgba(34,211,238,0.07),transparent 65%)',filter:'blur(60px)'}}/>
        <div className="aurora" style={{position:'absolute',top:'20%',left:'15%',width:450,height:450,borderRadius:'50%',background:'radial-gradient(circle,rgba(129,140,248,0.08),transparent 70%)',filter:'blur(50px)',animationDelay:'-12s'}}/>
        <div className="aurora" style={{position:'absolute',bottom:'10%',right:'10%',width:350,height:350,borderRadius:'50%',background:'radial-gradient(circle,rgba(236,72,153,0.06),transparent 70%)',filter:'blur(40px)',animationDelay:'-6s'}}/>
      </div>

      <div className="container" style={{position:'relative',zIndex:2,textAlign:'center'}}>
        <motion.div ref={ref}
          initial={{opacity:0,y:52}} animate={inView?{opacity:1,y:0}:{}}
          transition={{duration:1.05,ease:[0.23,1,0.32,1]}}
        >
          <motion.div
            className="section-tag"
            animate={{boxShadow:['0 0 0 rgba(34,211,238,0)','0 0 28px rgba(34,211,238,0.3)','0 0 0 rgba(34,211,238,0)']}}
            transition={{duration:3,repeat:Infinity}}
            style={{display:'inline-flex',alignItems:'center',gap:8,marginBottom:40}}
          >
            <span style={{width:7,height:7,borderRadius:'50%',background:'#22D3EE',display:'inline-block'}} className="pulse-ring"/>
            Now Accepting Founding Applications
          </motion.div>

          <h2 style={{
            fontSize:'clamp(2.8rem,8vw,7rem)',fontWeight:700,lineHeight:1.02,
            letterSpacing:'-0.04em',marginBottom:28,fontFamily:'Space Grotesk',
          }}>
            Your Next Post<br/>
            <span className="gradient-text glow-text">Deserves More</span><br/>
            Than Luck.
          </h2>

          <p style={{fontSize:18,color:'#64748B',maxWidth:540,margin:'0 auto 56px',lineHeight:1.72}}>
            Join the founding creators who refuse to leave their growth to chance. The community is forming. The network is being built. Your place is here.
          </p>

          <div style={{display:'flex',flexWrap:'wrap',gap:16,justifyContent:'center'}}>
            <motion.a href="#community" className="btn-primary"
              style={{fontSize:16,padding:'18px 38px',borderRadius:16}}
              whileHover={{scale:1.05,boxShadow:'0 0 70px rgba(59,130,246,0.65),0 0 140px rgba(34,211,238,0.25)'}}
              whileTap={{scale:0.97}}
              animate={{boxShadow:['0 0 20px rgba(59,130,246,0.3)','0 0 55px rgba(59,130,246,0.6)','0 0 20px rgba(59,130,246,0.3)']}}
              transition={{duration:3,repeat:Infinity}}
            >
              Join the Founding Community <ArrowRight size={18}/>
            </motion.a>
            <a href="#brands" className="btn-ghost" style={{fontSize:16,padding:'18px 36px',borderRadius:16}}>
              Partner as a Brand
            </a>
          </div>

          <p style={{fontSize:12,color:'#2D3748',marginTop:24}}>
            Free to apply · Invite-first · Founding access
          </p>
        </motion.div>
      </div>
    </section>
  )
}
