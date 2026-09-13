import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  BookOpen,
  Leaf,
  Flame,
  ChevronDown,
} from "lucide-react";
import { Reveal, MaskedLine } from "../components/Reveal";
import Marquee from "../components/Marquee";

const HERO_IMG =
  "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=2000&auto=format&fit=crop";

const PRINCIPLES = [
  {
    icon: ShieldCheck,
    title: "Inherent Human Dignity",
    text: "Every human being possesses inherent worth. Dignity is not granted by any authority, and it never has to be earned.",
  },
  {
    icon: HeartHandshake,
    title: "Bodily Autonomy",
    text: "Every person is the primary steward of their own body, their own choices, and their own conscience.",
  },
  {
    icon: BookOpen,
    title: "Living Understanding",
    text: "Human understanding is unfinished. We let greater knowledge and compassion change us — that is growth, not betrayal.",
  },
  {
    icon: Leaf,
    title: "Environmental Stewardship",
    text: "We hold moral responsibility for the living world we share and for the generations who will inherit it.",
  },
  {
    icon: Flame,
    title: "Freedom of Conscience",
    text: "The freedom to seek meaning — through any faith, many faiths, or none at all — belongs to every person.",
  },
];

const COMMUNITY = [
  {
    num: "01",
    title: "Gatherings",
    text: "Local community groups organize and schedule their own Gatherings — the shape and content are entirely in each community's hands, from readings and music to dialogue and service, as long as they honor the values of United Pluralism. Connect in the member community to find others near you and put together one-time or regular Gatherings.",
    img: "https://images.unsplash.com/photo-1543807535-eceef0bc6599?q=80&w=1200&auto=format&fit=crop",
    alt: "Friends laughing together at a community gathering",
  },
  {
    num: "02",
    title: "Shared Seasons",
    text: "A calendar that honors the traditions members bring with them, and creates new shared observances around common human experience.",
    img: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=1200&auto=format&fit=crop",
    alt: "Warm sunset over an open field at dusk",
  },
  {
    num: "03",
    title: "Community Action",
    text: "Service, generosity, and care for the lonely — our values practiced in the world, not only spoken within it.",
    img: "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1200&auto=format&fit=crop",
    alt: "Volunteers packing and sharing food donations together",
  },
];

const Home = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const yBg = useTransform(scrollYProgress, [0, 1], [0, 140]);

  return (
    <div data-testid="home-page">
      {/* HERO */}
      <section ref={heroRef} className="relative min-h-[94vh] flex items-end overflow-hidden bg-navy-950 grain">
        <motion.div style={{ y: yBg }} className="absolute inset-0" aria-hidden="true">
          <img
            src={HERO_IMG}
            alt=""
            className="h-[115%] w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/45 to-navy-950/20" />
        </motion.div>

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-44 pb-24 lg:pb-28">
          <motion.div
            initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-white p-2 shadow-xl ring-1 ring-white/40"
          >
            <img src="/assets/logo.png" alt="United Pluralism emblem" className="h-full w-full object-contain" />
          </motion.div>

          <div className="mt-7">
            <MaskedLine delay={0.35}>
              <span
                data-testid="hero-motto"
                className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-navy-950/40 backdrop-blur px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-gold-light"
              >
                Coniuncti ad futurum — United toward the future
              </span>
            </MaskedLine>
          </div>

          <h1
            className="mt-6 font-serif text-white text-5xl sm:text-6xl lg:text-7xl leading-[1.02] tracking-tight max-w-4xl"
            style={{ textShadow: "0 2px 30px rgba(5,12,26,0.55)" }}
          >
            <MaskedLine delay={0.5}>Many beliefs.</MaskedLine>
            <MaskedLine delay={0.62}>
              <span className="italic text-gold-light">One shared humanity.</span>
            </MaskedLine>
          </h1>

          <motion.p
            data-testid="hero-statement"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 max-w-xl text-base sm:text-lg leading-relaxed text-slate-100"
            style={{ textShadow: "0 1px 16px rgba(5,12,26,0.6)" }}
          >
            Human beings do not need to share one theology, one religion, or any religion at all in
            order to share profound responsibilities toward one another and the world.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Link
              to="/membership"
              data-testid="hero-join-button"
              className="group inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-gold/25 transition-all duration-300 hover:bg-amber-600 hover:shadow-gold/40 hover:-translate-y-0.5"
            >
              Join the Community
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/about"
              data-testid="hero-explore-button"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 backdrop-blur px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-gold-light hover:text-gold-light"
            >
              Explore Our Values
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="absolute bottom-6 right-6 sm:right-10 hidden sm:block"
        >
          <ChevronDown className="h-5 w-5 text-white/70 animate-bounce" />
        </motion.div>
      </section>

      <Marquee />

      {/* CORE PRINCIPLES */}
      <section className="py-20 lg:py-32" data-testid="principles-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">What we hold in common</p>
            <h2 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight text-navy max-w-2xl">
              Core principles, practiced together
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-px bg-slate-200 border border-slate-200 rounded-2xl overflow-hidden sm:grid-cols-2 lg:grid-cols-3">
            {PRINCIPLES.map((p, i) => (
              <Reveal
                key={p.title}
                delay={i * 0.08}
                className={`bg-white ${i === 0 ? "sm:col-span-2 lg:col-span-1" : ""}`}
              >
                <div
                  data-testid={`principle-card-${p.title.toLowerCase().replace(/\s+/g, "-")}`}
                  className="group h-full p-8 lg:p-10 transition-colors duration-300 hover:bg-navy-950"
                >
                  <p.icon className="h-7 w-7 text-gold transition-transform duration-300 group-hover:-translate-y-1" />
                  <h3 className="mt-5 font-serif text-2xl font-semibold text-navy transition-colors duration-300 group-hover:text-white">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 transition-colors duration-300 group-hover:text-slate-300">
                    {p.text}
                  </p>
                </div>
              </Reveal>
            ))}
            <Reveal delay={0.4} className="bg-gold-pale">
              <div className="h-full p-8 lg:p-10 flex flex-col justify-center">
                <p className="font-serif italic text-xl text-amber-900 leading-relaxed">
                  &ldquo;Belonging is based on sincere participation in our shared values, not on passing a
                  doctrinal test.&rdquo;
                </p>
                <Link
                  to="/membership"
                  data-testid="principles-join-link"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold hover:text-amber-700 transition-colors"
                >
                  Membership is free and open to all <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* COMMUNITY OVERVIEW */}
      <section className="py-20 lg:py-32 bg-slate-50 border-y border-slate-200" data-testid="community-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Life in the community</p>
            <h2 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight text-navy max-w-2xl">
              How United Pluralists gather
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-10 lg:grid-cols-3">
            {COMMUNITY.map((c, i) => (
              <Reveal key={c.num} delay={i * 0.12}>
                <article data-testid={`community-card-${c.num}`} className="group">
                  <div className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
                    <img
                      src={c.img}
                      alt={c.alt}
                      loading="lazy"
                      className="h-64 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <span className="absolute top-4 left-4 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-xs font-semibold tracking-widest text-gold">
                      {c.num}
                    </span>
                  </div>
                  <h3 className="mt-6 font-serif text-2xl font-semibold text-navy">{c.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{c.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* MANIFESTO QUOTE */}
      <section className="relative py-24 lg:py-36 bg-navy-950 grain overflow-hidden" data-testid="manifesto-section">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[30rem] w-[30rem] rounded-full bg-gold/5 blur-3xl pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <img src="/assets/logo.png" alt="" aria-hidden="true" className="mx-auto h-16 w-16 object-contain opacity-90" />
            <blockquote className="mt-8 font-serif text-3xl sm:text-4xl lg:text-5xl leading-snug text-white tracking-tight">
              &ldquo;We join together not because our beliefs are identical, but because our{" "}
              <span className="italic text-gold-light">humanity is shared</span>.&rdquo;
            </blockquote>
            <Link
              to="/about"
              data-testid="manifesto-about-link"
              className="mt-9 inline-flex items-center gap-2 text-sm font-semibold text-gold-light hover:text-gold transition-colors"
            >
              Read the United Pluralist Covenant <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-20 lg:py-28" data-testid="cta-banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-navy px-8 py-14 lg:px-16 lg:py-20 grain">
              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold/15 blur-3xl pointer-events-none" />
              <div className="relative lg:flex items-center justify-between gap-10">
                <div className="max-w-xl">
                  <h2 className="font-serif text-3xl sm:text-4xl text-white tracking-tight">
                    Walk with us into the future
                  </h2>
                  <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
                    Join officially as a member — free, open, and without any test of belief — or explore the
                    seasons and observances that shape our shared year.
                  </p>
                </div>
                <div className="mt-8 lg:mt-0 flex flex-wrap gap-4 shrink-0">
                  <Link
                    to="/membership"
                    data-testid="cta-join-button"
                    className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-amber-600 hover:-translate-y-0.5"
                  >
                    Become a Member <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/observances"
                    data-testid="cta-observances-button"
                    className="inline-flex items-center rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition-colors duration-300 hover:border-gold-light hover:text-gold-light"
                  >
                    Upcoming Observances
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default Home;
