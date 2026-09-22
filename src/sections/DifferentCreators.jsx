import { motion } from "framer-motion";
import { Users, Infinity, TrendingUp, Plane, Utensils, Dumbbell, Music, Heart, Laptop } from "lucide-react";

const CREATORS = [
  {
    title: "TRAVEL",
    subtitle: "New places.\nNew people.",
    image: "/travel.jpg",
    icon: Plane,
    note: "Explore\nShare\nInspire",
  },
  {
    title: "FOOD",
    subtitle: "Share flavours.\nBuild connections.",
    image: "/food.jpg",
    icon: Utensils,
    note: "Good Food\nHappier People",
  },
  {
    title: "FITNESS",
    subtitle: "Inspire healthier\nlives.",
    image: "/fitness.jpg",
    icon: Dumbbell,
    note: "Stronger\nCreators",
  },
  {
    title: "MUSIC",
    subtitle: "Create.\nShare.\nBe Heard.",
    image: "/music.jpg",
    icon: Music,
    note: "Music\nConnects Us",
  },
  {
    title: "LIFESTYLE",
    subtitle: "Real Stories.\nReal Impact.",
    image: "/lifestyle.jpg",
    icon: Heart,
    note: "Style Stories\nSelf Love",
  },
  {
    title: "TECH",
    subtitle: "Ideas that\ninspire.",
    image: "/tech.jpg",
    icon: Laptop,
    note: "Tech Tips\nCreate Repeat",
  },
];

const STATS = [
  { icon: Users, value: "10,000+", label: "Creators in the Network" },
  { icon: Infinity, value: "Real", label: "Opportunities" },
  { icon: TrendingUp, value: "A Brighter", label: "Tomorrow" },
];

export default function DifferentCreators() {
  return (
    <section
      className="section-py"
      style={{
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(180deg,#041126 0%,#071933 100%)",
      }}
    >
      {/* Background */}

      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/creator-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(18px)",
          transform: "scale(1.1)",
          opacity: 0.35,
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom,rgba(4,17,38,.25),rgba(4,17,38,.85))",
        }}
      />

      <div
        className="container"
        style={{ position: "relative", zIndex: 2 }}
      >
        {/* Header */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: 52 }}
        >
          <div
            style={{
              letterSpacing: "0.45em",
              fontSize: 12,
              color: "#CBD5E1",
              marginBottom: 16,
            }}
          >
            CREATE • SUPPORT • GROW
          </div>

          <h2
            style={{
              fontSize: "clamp(2.3rem,5vw,4.5rem)",
              lineHeight: 1.05,
              fontWeight: 800,
              marginBottom: 12,
            }}
          >
            Different Creators.
            <br />
            <span style={{ color: "#FACC15" }}>
              Bigger Opportunities.
            </span>
          </h2>

          <p
            style={{
              color: "#CBD5E1",
              fontSize: 18,
            }}
          >
            A community for every passion.
          </p>
        </motion.div>

        {/* Creator Cards */}

        <div
          className="creator-scroll"
          style={{
            display: "flex",
            gap: 18,
            overflowX: "auto",
            paddingBottom: 16,
            scrollSnapType: "x mandatory",
          }}
        >
          {CREATORS.map((creator, index) => {
            const Icon = creator.icon;

            return (
              <motion.div
                key={creator.title}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -10, scale: 1.03 }}
                style={{
                  minWidth: 200,
                  width: 200,
                  height: 470,
                  borderRadius: 24,
                  overflow: "hidden",
                  position: "relative",
                  flexShrink: 0,
                  scrollSnapAlign: "start",
                  cursor: "pointer",
                  boxShadow: "0 20px 50px rgba(0,0,0,.35)",
                }}
              >
                <img
                  src={creator.image}
                  alt={creator.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top,rgba(0,0,0,.85),rgba(0,0,0,.05))",
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    top: 22,
                    left: 18,
                    whiteSpace: "pre-line",
                    color: "#fff",
                    fontSize: 16,
                    lineHeight: 1.2,
                    fontWeight: 500,
                    transform: "rotate(-5deg)",
                  }}
                >
                  {creator.note}
                </div>

                <div
                  style={{
                    position: "absolute",
                    bottom: 24,
                    left: 20,
                    right: 20,
                    textAlign: "center",
                  }}
                >
                  <Icon
                    size={34}
                    color="#fff"
                    style={{ marginBottom: 12 }}
                  />

                  <h3
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      marginBottom: 8,
                    }}
                  >
                    {creator.title}
                  </h3>

                  <p
                    style={{
                      color: "#E2E8F0",
                      fontSize: 15,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {creator.subtitle}
                  </p>
                </div>
              </motion.div>
            );
          })}

          {/* More Card */}

          <motion.div
            whileHover={{ scale: 1.03 }}
            style={{
              minWidth: 170,
              height: 470,
              borderRadius: 24,
              background:
                "linear-gradient(180deg,#2E4057,#1B2735)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 26,
              fontWeight: 700,
              textAlign: "center",
              padding: 20,
            }}
          >
            ...and
            <br />
            many more
          </motion.div>
        </div>

        {/* Bottom */}

        <div
          className="bottom-row"
          style={{
            marginTop: 48,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          <div
            className="stats-row"
            style={{
              display: "flex",
              gap: 34,
              flexWrap: "wrap",
            }}
          >
            {STATS.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                  }}
                >
                  <Icon size={34} color="#fff" />

                  <div>
                    <div
                      style={{
                        fontWeight: 800,
                        fontSize: 22,
                      }}
                    >
                      {stat.value}
                    </div>

                    <div
                      style={{
                        color: "#CBD5E1",
                        fontSize: 13,
                        textTransform: "uppercase",
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.98 }}
  onClick={() => {
    document.getElementById("community")?.scrollIntoView({
      behavior: "smooth",
    });
  }}
  style={{
    background: "#FACC15",
    color: "#111827",
    border: "none",
    borderRadius: "999px",
    padding: "18px 34px",
    fontWeight: 800,
    fontSize: 18,
    cursor: "pointer",
    boxShadow: "0 14px 40px rgba(250,204,21,.35)",
  }}
>
  Join the Founding 500 →
</motion.button>
        </div>
      </div>

      <style>{`
        .creator-scroll::-webkit-scrollbar{
          display:none;
        }

        .creator-scroll{
          scrollbar-width:none;
        }

        @media(max-width:768px){

          .creator-scroll{
            gap:14px;
          }

          .creator-scroll > div{
            min-width:170px !important;
            width:170px !important;
            height:390px !important;
          }

          .bottom-row{
            flex-direction:column;
            align-items:flex-start !important;
          }

          .stats-row{
            gap:22px !important;
          }
        }
      `}</style>
    </section>
  );
}