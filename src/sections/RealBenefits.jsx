import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { BarChart3, Globe2, UserPlus } from "lucide-react";
import { useInView } from "../hooks/useInView";

const BENEFITS = [
  {
    icon: BarChart3,
    title: "Higher Engagement",
    desc: "Stronger engagement",
    color: "#F59EB0",
  },
  {
    icon: Globe2,
    title: "Wider Reach",
    desc: "Beyond your followers",
    color: "#7DD3FC",
  },
  {
    icon: UserPlus,
    title: "A Growing Network",
    desc: "More opportunities",
    color: "#86EFAC",
  },
];

export default function RealBenefits() {
  const sectionRef = useRef(null);
  const [ref, inView] = useInView();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <section
      ref={sectionRef}
      className="section-py"
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: "100vh",
      }}
    >
      {/* Background Image */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          scale,
          y,
          backgroundImage: "url('/benefits-banner.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 0,
        }}
      />

      {/* Dark Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(3,7,18,.88) 0%, rgba(3,7,18,.55) 45%, rgba(3,7,18,.35) 100%)",
          zIndex: 1,
        }}
      />

      {/* Glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 30% 30%, rgba(245,158,11,.12), transparent 45%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      <div
        className="container"
        style={{ position: "relative", zIndex: 2 }}
      >
        <motion.div
          ref={ref}
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{ maxWidth: 560 }}
        >
          <span className="section-tag" style={{ color: "#FACC15" }}>
            Real Benefits
          </span>

          <h2
            style={{
              fontSize: "clamp(2.5rem,5vw,5rem)",
              lineHeight: 1,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              margin: "18px 0",
            }}
          >
            Real Benefits
            <br />
            for{" "}
            <span
              style={{
                background: "linear-gradient(90deg,#FACC15,#F59E0B)",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Real Creators.
            </span>
          </h2>

          <p
            style={{
              color: "#CBD5E1",
              fontSize: 17,
              lineHeight: 1.7,
              maxWidth: 470,
            }}
          >
            Bigger reach, stronger engagement, and a creator community that
            grows with every post you publish.
          </p>
        </motion.div>

        {/* Cards */}
        <div
          className="benefits-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 22,
            marginTop: 55,
            maxWidth: 760,
          }}
        >
          {BENEFITS.map((item, i) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 45 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: i * 0.15,
                }}
                whileHover={{
                  y: -12,
                  scale: 1.04,
                  boxShadow: `0 25px 60px ${item.color}55`,
                }}
                style={{
                  background: "rgba(255,255,255,.82)",
                  backdropFilter: "blur(18px)",
                  borderRadius: 26,
                  padding: "34px 26px",
                  border: "1px solid rgba(255,255,255,.35)",
                }}
              >
                <motion.div
                  whileHover={{ rotate: -8, scale: 1.15 }}
                  transition={{ type: "spring", stiffness: 260 }}
                  style={{
                    width: 62,
                    height: 62,
                    borderRadius: 18,
                    background: item.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 22,
                  }}
                >
                  <Icon size={32} color="#0F172A" />
                </motion.div>

                <h3
                  style={{
                    color: "#0F172A",
                    fontWeight: 800,
                    fontSize: 24,
                    lineHeight: 1.15,
                    marginBottom: 10,
                  }}
                >
                  {item.title}
                </h3>

                <p
                  style={{
                    color: "#334155",
                    fontSize: 16,
                    lineHeight: 1.6,
                  }}
                >
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
          style={{
            display: "flex",
            gap: 24,
            flexWrap: "wrap",
            marginTop: 55,
            color: "#F8FAFC",
            fontWeight: 600,
            letterSpacing: ".18em",
            fontSize: 13,
          }}
        >
          <span>MORE CREATORS</span>
          <span>|</span>
          <span>MORE REACH</span>
          <span>|</span>
          <span>A BRIGHTER TOMORROW</span>
        </motion.div>
      </div>

      <style>{`
        @media (max-width:900px){
          .benefits-grid{
            grid-template-columns:1fr !important;
            max-width:100% !important;
          }
        }
      `}</style>
    </section>
  );
}