import { useRef, useMemo, Suspense, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

function Node({ position, scale = 1, color = '#3B82F6', delay = 0 }) {
  const mesh = useRef(); const glow = useRef()
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + delay
    if (mesh.current) { mesh.current.position.y = position[1] + Math.sin(t * 0.7) * 0.14 }
    if (glow.current)  { glow.current.material.opacity = 0.25 + Math.sin(t * 1.6) * 0.15 }
  })
  return (
    <group position={position}>
      <mesh ref={glow}>
        <sphereGeometry args={[0.2 * scale, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.25} />
      </mesh>
      <mesh ref={mesh}>
        <sphereGeometry args={[0.09 * scale, 24, 24]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.5} roughness={0} metalness={0.8} />
      </mesh>
    </group>
  )
}

function ConnectionLine({ start, end, color = '#22D3EE', delay = 0 }) {
  const ref = useRef()
  const geometry = useMemo(() => {
    const s = new THREE.Vector3(...start), e = new THREE.Vector3(...end)
    const mid = s.clone().lerp(e, 0.5); mid.y += 0.25
    return new THREE.BufferGeometry().setFromPoints(
      new THREE.QuadraticBezierCurve3(s, mid, e).getPoints(24)
    )
  }, [])
  useFrame(({ clock }) => {
    if (ref.current) ref.current.material.opacity = 0.15 + Math.sin(clock.getElapsedTime() * 1.8 + delay) * 0.2
  })
  return (
    <line ref={ref} geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={0.3} />
    </line>
  )
}

function OrbitalRing({ radius, speed, tilt, color }) {
  const ref = useRef()
  useFrame(({ clock }) => { if (ref.current) ref.current.rotation.z = clock.getElapsedTime() * speed })
  return (
    <group rotation={[tilt, 0, 0]}>
      <mesh ref={ref}>
        <torusGeometry args={[radius, 0.007, 8, 90]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.8} transparent opacity={0.55} />
      </mesh>
    </group>
  )
}

function CentralOrb() {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) { ref.current.rotation.y = clock.getElapsedTime() * 0.18; ref.current.rotation.x = clock.getElapsedTime() * 0.08 }
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.38, 64, 64]} />
      <MeshDistortMaterial color="#3B82F6" emissive="#22D3EE" emissiveIntensity={0.9} distort={0.28} speed={2.2} roughness={0} metalness={1} />
    </mesh>
  )
}

function Particles() {
  const ref = useRef()
  const [pos, col] = useMemo(() => {
    const count = 90
    const p = new Float32Array(count * 3), c = new Float32Array(count * 3)
    const palette = [[0.23,0.51,0.96],[0.13,0.83,0.93],[0.51,0.55,0.97]]
    for (let i = 0; i < count; i++) {
      p[i*3]=(Math.random()-.5)*9; p[i*3+1]=(Math.random()-.5)*9; p[i*3+2]=(Math.random()-.5)*9
      const col_= palette[Math.floor(Math.random()*palette.length)]
      c[i*3]=col_[0]; c[i*3+1]=col_[1]; c[i*3+2]=col_[2]
    }
    return [p, c]
  }, [])
  useFrame(({ clock }) => { if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.025 })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
        <bufferAttribute attach="attributes-color"    args={[col, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.025} vertexColors transparent opacity={0.7} />
    </points>
  )
}

function CameraRig() {
  const { camera } = useThree()
  const mouse = useRef([0,0])
  useEffect(() => {
    const h = (e) => { mouse.current = [(e.clientX/window.innerWidth-.5)*2, -(e.clientY/window.innerHeight-.5)*2] }
    window.addEventListener('mousemove', h, { passive: true })
    return () => window.removeEventListener('mousemove', h)
  }, [])
  useFrame(() => {
    camera.position.x += (mouse.current[0] * 0.55 - camera.position.x) * 0.04
    camera.position.y += (mouse.current[1] * 0.35 - camera.position.y) * 0.04
    camera.lookAt(0, 0, 0)
  })
  return null
}

const NODES = [
  { pos:[1.6,0.9,0],  color:'#3B82F6', scale:1.3, delay:0   },
  { pos:[-1.6,0.7,0.3],color:'#22D3EE',scale:1.1, delay:1   },
  { pos:[0.9,-1.3,0.5],color:'#818CF8',scale:1.0, delay:2   },
  { pos:[-0.9,-1.1,-0.3],color:'#3B82F6',scale:1.2,delay:0.5},
  { pos:[2.1,-0.4,-0.5],color:'#22D3EE',scale:0.85,delay:1.5},
  { pos:[-2.1,0.3,0.2],color:'#818CF8',scale:0.9, delay:0.8 },
  { pos:[0.3,2.0,-0.4],color:'#3B82F6',scale:0.8, delay:2.5 },
  { pos:[-0.4,-2.0,0.6],color:'#22D3EE',scale:0.8,delay:1.2 },
]
const CONNS = [
  [[0,0,0],[1.6,0.9,0],'#3B82F6',0],[[0,0,0],[-1.6,0.7,0.3],'#22D3EE',1],
  [[0,0,0],[0.9,-1.3,0.5],'#818CF8',2],[[0,0,0],[-0.9,-1.1,-0.3],'#3B82F6',3],
  [[1.6,0.9,0],[0.3,2.0,-0.4],'#22D3EE',4],[[-1.6,0.7,0.3],[-2.1,0.3,0.2],'#818CF8',5],
  [[2.1,-0.4,-0.5],[0.9,-1.3,0.5],'#3B82F6',6],[[-0.9,-1.1,-0.3],[-0.4,-2.0,0.6],'#22D3EE',7],
]

export default function NetworkScene() {
  return (
    <Canvas camera={{ position:[0,0,5], fov:52 }} style={{ background:'transparent' }} dpr={[1,1.5]}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.35} />
        <pointLight position={[4,4,4]}   intensity={2.2} color="#3B82F6" />
        <pointLight position={[-4,-4,4]} intensity={1.6} color="#22D3EE" />
        <pointLight position={[0,0,6]}   intensity={0.6} color="#818CF8" />
        <CameraRig />
        <Particles />
        <CentralOrb />
        {NODES.map((n,i) => <Node key={i} position={n.pos} color={n.color} scale={n.scale} delay={n.delay} />)}
        {CONNS.map(([s,e,c,d],i) => <ConnectionLine key={i} start={s} end={e} color={c} delay={d} />)}
        <OrbitalRing radius={1.9} speed={0.28}  tilt={Math.PI/6}  color="#3B82F6" />
        <OrbitalRing radius={2.5} speed={-0.18} tilt={Math.PI/3}  color="#22D3EE" />
        <OrbitalRing radius={1.3} speed={0.45}  tilt={Math.PI/2}  color="#818CF8" />
        <Stars radius={16} depth={6} count={280} factor={2} saturation={0} fade speed={0.4} />
      </Suspense>
    </Canvas>
  )
}
