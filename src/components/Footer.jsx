import { motion } from 'framer-motion'
import { Globe, Share2, Link2, Play } from 'lucide-react'
import logo from "../assets/logo.png";
const columns = [
  { title:'Creators', links:['How It Works','Creator Universe','Community','Apply Now','FAQ'] },
  { title:'Brands',   links:['Brand Partnerships','Campaign Packages','Get a Demo','Case Studies'] },
  { title:'Resources',links:['Creator Blog','Algorithm Guide','Content Playbook','Community Guidelines'] },
  { title:'Contact',  links:['hello@torquenetwork.in','Partner With Us','Press & Media','Careers'] },
]
const socials = [
  { icon:Globe, label:'Instagram' },
  { icon:Share2, label:'X / Twitter' },
  { icon:Link2, label:'LinkedIn' },
  { icon:Play, label:'YouTube' },
]

export default function Footer() {
  return (
    <footer style={{borderTop:'1px solid rgba(255,255,255,0.05)',paddingTop:72,paddingBottom:40,position:'relative'}}>
      <div style={{position:'absolute',inset:0,pointerEvents:'none',background:'linear-gradient(to bottom,rgba(13,19,38,0.2),rgba(5,8,22,0.7))'}}/>
      <div className="container" style={{position:'relative',zIndex:1}}>
        <div style={{display:'grid',gridTemplateColumns:'240px repeat(4,1fr)',gap:40,marginBottom:56,alignItems:'start'}} className="footer-grid">
          <div>
            <motion.a
  href="#"
  whileHover={{ scale: 1.04 }}
  transition={{ duration: 0.25 }}
  style={{
    display: "inline-flex",
    alignItems: "center",
    marginBottom: 16,
    textDecoration: "none"
  }}
>
  <div
    style={{
      background: "rgba(255,255,255,0.95)",
      borderRadius: 14,
      padding: "8px 12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "1px solid rgba(255,255,255,0.2)",
      boxShadow:
        "0 0 24px rgba(59,130,246,0.35), 0 8px 24px rgba(0,0,0,0.25)"
    }}
  >
    <img
      src={logo}
      alt="Torque Network"
      className="footer-logo"
      style={{
        height: 34,
        width: "auto",
        objectFit: "contain"
      }}
    />
  </div>
</motion.a>
            <p style={{fontSize:13,color:'#475569',lineHeight:1.68,marginBottom:8,maxWidth:210}}>
              India's invite-first creator community.
            </p>
            <p style={{fontSize:11,color:'#334155',lineHeight:1.6,marginBottom:24,maxWidth:210,fontStyle:'italic'}}>
              Content Creates Potential.<br/>Torque Creates Momentum.
            </p>
            <div style={{display:'flex',gap:10}}>
              {socials.map(({ icon:Icon, label })=>(
                <motion.a key={label} href="#" aria-label={label}
                  whileHover={{scale:1.1,boxShadow:'0 0 14px rgba(59,130,246,0.3)',y:-2}}
                  style={{width:34,height:34,borderRadius:10,background:'rgba(13,19,38,0.65)',border:'1px solid rgba(255,255,255,0.07)',display:'flex',alignItems:'center',justifyContent:'center',color:'#475569',textDecoration:'none',transition:'color 0.2s'}}
                  onMouseEnter={e=>e.currentTarget.style.color='#94A3B8'}
                  onMouseLeave={e=>e.currentTarget.style.color='#475569'}
                >
                  <Icon size={14}/>
                </motion.a>
              ))}
            </div>
          </div>
          {columns.map(col=>(
            <div key={col.title}>
              <h4 style={{fontSize:11,fontWeight:700,color:'#64748B',marginBottom:16,letterSpacing:'0.07em',textTransform:'uppercase'}}>{col.title}</h4>
              <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:11}}>
                {col.links.map(link=>(
                  <li key={link}>
                    <a href="#" style={{fontSize:13,color:'#475569',textDecoration:'none',transition:'color 0.2s'}}
                      onMouseEnter={e=>e.target.style.color='#94A3B8'}
                      onMouseLeave={e=>e.target.style.color='#475569'}>{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{height:1,background:'rgba(255,255,255,0.05)',marginBottom:28}}/>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:16}}>
          <p style={{fontSize:12,color:'#2D3748'}}>© 2024 Torque Network. All rights reserved.</p>
          <div style={{display:'flex',gap:24,flexWrap:'wrap'}}>
            {['Privacy Policy','Terms of Service','Creator Agreement'].map(l=>(
              <a key={l} href="#" style={{fontSize:12,color:'#2D3748',textDecoration:'none',transition:'color 0.2s'}}
                onMouseEnter={e=>e.target.style.color='#64748B'}
                onMouseLeave={e=>e.target.style.color='#2D3748'}>{l}</a>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @media(max-width:1024px){.footer-grid{grid-template-columns:repeat(3,1fr) !important;}}
        @media(max-width:640px) {.footer-grid{grid-template-columns:repeat(2,1fr) !important;gap:28px 20px !important;}}
      .footer-logo{
  height:34px;
  width:auto;
}

@media(max-width:640px){
  .footer-logo{
    height:28px !important;
  }
}`}
      
      </style>
    </footer>
  )
}
