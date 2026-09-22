import { motion } from "framer-motion";
import { useInView } from "../hooks/useInView";
import {
  TrendingUp,
  Heart,
  Users,
  Briefcase,
  Crown,
  Infinity,
} from "lucide-react";

export default function GrowthJourney() {
  const [ref, inView] = useInView();

  const stats = [
    {
      icon: Heart,
      title: "Engagement",
      start: "3%",
      end: "12%",
      width: "82%",
      color: "#22D3EE",
    },
    {
      icon: Users,
      title: "Reach",
      start: "1K",
      end: "50K+",
      width: "95%",
      color: "#3B82F6",
    },
    {
      icon: Briefcase,
      title: "Brand Deals",
      start: "0",
      end: "Paid",
      width: "88%",
      color: "#FACC15",
    },
  ];

  const milestones = [
    {
      icon: TrendingUp,
      title: "500–1,000 Interactions",
      text: "Early engagement every post",
      color: "#22D3EE",
    },
    {
      icon: Crown,
      title: "Higher Trust Signals",
      text: "Better profile authority",
      color: "#818CF8",
    },
    {
      icon: Infinity,
      title: "Long-term Network",
      text: "Collaborations that compound",
      color: "#10B981",
    },
  ];

  return (
    <section
      className="section-py"
      style={{
        background: "rgba(5,8,22,.95)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 20%, rgba(34,211,238,.08), transparent 55%)",
          pointerEvents: "none",
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Heading */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: 60 }}
        >
          <span className="section-tag" style={{ color: "#22D3EE" }}>
            The Creator Journey
          </span>

          <h2
            style={{
              fontSize: "clamp(2rem,4vw,3rem)",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
            }}
          >
            What growth{" "}
            <span className="gradient-text">actually looks like.</span>
          </h2>

          <p
            style={{
              fontSize: 16,
              color: "#64748B",
              maxWidth: 560,
              margin: "16px auto 0",
              lineHeight: 1.7,
            }}
          >
            Real creator growth isn't a viral spike — it's consistent momentum
            that compounds over time.
          </p>
        </motion.div>

        {/* Main Dashboard */}
        <div
          className="growth-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.15fr .85fr",
            gap: 30,
          }}
        >
          {/* Left Analytics */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            style={{
              background: "rgba(13,19,38,.72)",
              backdropFilter: "blur(22px)",
              borderRadius: 26,
              padding: 30,
              border: "1px solid rgba(34,211,238,.15)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 28,
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div>
                <div
                  style={{
                    color: "#94A3B8",
                    fontSize: 12,
                    letterSpacing: ".08em",
                  }}
                >
                  GROWTH WINDOW
                </div>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    fontFamily: "Space Grotesk",
                  }}
                >
                  30 Days → 36 Months
                </div>
              </div>

              <div
                style={{
                  background: "rgba(34,211,238,.08)",
                  border: "1px solid rgba(34,211,238,.22)",
                  color: "#22D3EE",
                  padding: "10px 18px",
                  borderRadius: 999,
                  fontWeight: 700,
                }}
              >
                Real Creator Journey
              </div>
            </div>

            {/* Fake Growth Graph */}
            <div
              style={{
                height: 180,
                borderRadius: 18,
                background:
                  "linear-gradient(180deg, rgba(34,211,238,.05), rgba(13,19,38,0))",
                border: "1px solid rgba(255,255,255,.05)",
                position: "relative",
                overflow: "hidden",
                marginBottom: 28,
              }}
            >
              <svg
                viewBox="0 0 600 180"
                width="100%"
                height="100%"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="growthLine" x1="0%" x2="100%">
                    <stop offset="0%" stopColor="#22D3EE" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>

                <motion.path
                  d="M20 150 C100 140,140 120,210 110 C280 95,330 80,400 60 C470 45,520 25,580 18"
                  fill="none"
                  stroke="url(#growthLine)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={inView ? { pathLength: 1 } : {}}
                  transition={{ duration: 1.8 }}
                />

                <motion.circle
                  cx="580"
                  cy="18"
                  r="6"
                  fill="#22D3EE"
                  initial={{ scale: 0 }}
                  animate={inView ? { scale: 1 } : {}}
                  transition={{ delay: 1.6 }}
                />
              </svg>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.3 }}
                style={{
                  position: "absolute",
                  top: 18,
                  right: 18,
                  background: "rgba(13,19,38,.92)",
                  border: "1px solid rgba(34,211,238,.25)",
                  borderRadius: 14,
                  padding: "10px 14px",
                }}
              >
                <div style={{ color: "#94A3B8", fontSize: 12 }}>
                  Momentum
                </div>
                <div
                  style={{
                    color: "#22D3EE",
                    fontWeight: 700,
                    fontSize: 20,
                  }}
                >
                  +486%
                </div>
              </motion.div>
            </div>

            {/* Progress Bars */}
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              {stats.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -18 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: i * 0.18 }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 8,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: 10,
                          alignItems: "center",
                        }}
                      >
                        <Icon size={18} color={item.color} />
                        <span style={{ fontWeight: 700 }}>{item.title}</span>
                      </div>

                      <span style={{ color: "#CBD5E1" }}>
                        {item.start} → {item.end}
                      </span>
                    </div>

                    <div
                      style={{
                        height: 10,
                        background: "rgba(255,255,255,.06)",
                        borderRadius: 999,
                        overflow: "hidden",
                      }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={inView ? { width: item.width } : {}}
                        transition={{
                          duration: 1.4,
                          delay: i * 0.18,
                        }}
                        style={{
                          height: "100%",
                          borderRadius: 999,
                          background: `linear-gradient(90deg, ${item.color}, #ffffff33)`,
                          boxShadow: `0 0 16px ${item.color}`,
                        }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right Milestones */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            {milestones.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: 24 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: i * 0.18 }}
                  whileHover={{
                    y: -5,
                    boxShadow: `0 20px 50px ${item.color}22`,
                  }}
                  style={{
                    background: "rgba(13,19,38,.72)",
                    borderRadius: 22,
                    padding: 26,
                    border: `1px solid ${item.color}22`,
                    backdropFilter: "blur(20px)",
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 16,
                      background: `${item.color}18`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 18,
                    }}
                  >
                    <Icon size={24} color={item.color} />
                  </div>

                  <h3
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      marginBottom: 8,
                      fontFamily: "Space Grotesk",
                    }}
                  >
                    {item.title}
                  </h3>

                  <p
                    style={{
                      color: "#64748B",
                      lineHeight: 1.7,
                    }}
                  >
                    {item.text}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:900px){
          .growth-grid{
            grid-template-columns:1fr !important;
          }
        }
      `}</style>
    </section>
  );
}