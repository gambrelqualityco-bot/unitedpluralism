import { Reveal, MaskedLine, PageHero } from "../components/Reveal";
import { Scale, HeartHandshake, Search, FlaskConical, Globe2, Hourglass } from "lucide-react";

const HERO_IMG =
  "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2000&auto=format&fit=crop";

const COMMITMENTS = [
  { icon: Scale, title: "Equity", text: "Equal dignity and rights for every person, along with the correction of barriers that keep people from both." },
  { icon: HeartHandshake, title: "Compassion", text: "Choosing compassion over cruelty, and generosity over indifference, in every context of life." },
  { icon: Search, title: "Truth", text: "The honest pursuit of truth is a sacred responsibility. Changing a belief on better evidence is growth, not betrayal." },
  { icon: FlaskConical, title: "Science", text: "Credible evidence, reason, and lived experience are honored tools for understanding the world." },
  { icon: Globe2, title: "The Living Earth", text: "We hold real moral responsibility for the living world and practice stewardship as a shared duty." },
  { icon: Hourglass, title: "Future Generations", text: "Those who will come after us matter now. Our decisions are made with their world in mind." },
];

const CHAPTERS = [
  {
    num: "01",
    title: "Common ground without a common creed",
    body: [
      "United Pluralism is not founded upon any prior religious or philosophical tradition, and it does not seek to blend those traditions into a single theology. It is built instead on the United Pluralist Covenant, a shared commitment to how we live with one another.",
      "United Pluralists may disagree about the source of morality, the existence or nature of the divine, and many other ultimate questions. What joins us is the conviction that dignity, compassion, truth, justice, generosity, stewardship, and freedom matter, and that people can practice them together.",
    ],
  },
  {
    num: "02",
    title: "Layered belonging",
    body: [
      "Members may hold layered affiliations. A United Pluralist may also be spiritual, theist, humanist, agnostic, atheist, or nonreligious, and may remain part of another religious or philosophical community. Nothing here asks you to abandon what gives your life meaning.",
      "Belonging is based on sincere participation in the Covenant, not on passing a doctrinal test. Membership does not require belief in God, gods, spirits, an afterlife, or any supernatural claim, nor does it require the rejection of such beliefs.",
    ],
  },
  {
    num: "04",
    title: "Freedom of conscience",
    body: [
      "We affirm freedom of religion as a fundamental human right, including freedom from religion. Every person has the right to choose a religion, to change religions, or to live without being compelled to participate in religious practices or profess religious beliefs.",
      "We defend the freedom of others to seek meaning differently from us, including the freedom to live without religion. We remain mindful that we may be wrong, and willing to grow when greater understanding requires it.",
    ],
  },
];

const About = () => (
  <div data-testid="about-page">
    <PageHero image={HERO_IMG}>
      <MaskedLine delay={0.1}>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-light">About &amp; Values</p>
      </MaskedLine>
      <h1 className="mt-5 font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white max-w-3xl leading-[1.05]">
        <MaskedLine delay={0.25}>Common ground,</MaskedLine>
        <MaskedLine delay={0.37}>
          <span className="italic text-gold-light">without a common creed.</span>
        </MaskedLine>
      </h1>
      <Reveal delay={0.55}>
        <p className="mt-7 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-100">
          United Pluralism creates a place where people from many traditions, philosophies, and nonreligious
          worldviews come together around shared values and responsibilities: community, ethical guidance,
          ceremony, reflection, service, celebration, learning, and mutual care.
        </p>
      </Reveal>
    </PageHero>

    {/* CHAPTERS */}
    <section className="py-20 lg:py-32" data-testid="covenant-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 lg:space-y-28">
        {CHAPTERS.slice(0, 2).map((ch) => (
          <Reveal key={ch.num}>
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-14 items-start">
              <div className="lg:col-span-4">
                <span className="font-serif text-7xl lg:text-8xl text-gold/25 leading-none">{ch.num}</span>
                <h2 className="mt-2 font-serif text-3xl lg:text-4xl tracking-tight text-navy">{ch.title}</h2>
              </div>
              <div className="lg:col-span-8 lg:border-l lg:border-slate-200 lg:pl-14 space-y-5">
                {ch.body.map((p, j) => (
                  <p key={j} className="text-base leading-relaxed text-slate-600">{p}</p>
                ))}
              </div>
            </div>
          </Reveal>
        ))}

        {/* CHAPTER 03: ETHICAL COMMITMENTS */}
        <Reveal>
          <div data-testid="commitments-section">
            <span className="font-serif text-7xl lg:text-8xl text-gold/25 leading-none">03</span>
            <h2 className="mt-2 font-serif text-3xl lg:text-4xl tracking-tight text-navy">Ethical commitments</h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600">
              Our ethics are not a sidebar to community life; they are its center. Six commitments anchor how
              United Pluralists seek to live.
            </p>
            <div className="mt-10 grid gap-px bg-slate-200 border border-slate-200 rounded-2xl overflow-hidden sm:grid-cols-2 lg:grid-cols-3">
              {COMMITMENTS.map((c, i) => (
                <Reveal key={c.title} delay={i * 0.07} className="bg-white">
                  <div
                    data-testid={`commitment-card-${c.title.toLowerCase().replace(/\s+/g, "-")}`}
                    className="h-full p-8 transition-colors duration-300 hover:bg-gold-pale/60"
                  >
                    <c.icon className="h-6 w-6 text-gold" />
                    <h3 className="mt-4 font-serif text-xl font-semibold text-navy">{c.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{c.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>

        {CHAPTERS.slice(2).map((ch) => (
          <Reveal key={ch.num}>
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-14 items-start">
              <div className="lg:col-span-4">
                <span className="font-serif text-7xl lg:text-8xl text-gold/25 leading-none">{ch.num}</span>
                <h2 className="mt-2 font-serif text-3xl lg:text-4xl tracking-tight text-navy">{ch.title}</h2>
              </div>
              <div className="lg:col-span-8 lg:border-l lg:border-slate-200 lg:pl-14 space-y-5">
                {ch.body.map((p, j) => (
                  <p key={j} className="text-base leading-relaxed text-slate-600">{p}</p>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>

    {/* IMAGE BAND + VISION */}
    <section className="relative overflow-hidden" data-testid="vision-section">
      <img
        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop"
        alt="A calm open ocean under a wide sky"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-navy-950/80" />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-light">Our vision</p>
          <h2 className="mt-5 font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white leading-snug">
            A future where human difference is never treated as hierarchy, and where knowledge and compassion
            guide our decisions.
          </h2>
          <p className="mt-7 max-w-2xl text-base leading-relaxed text-slate-200">
            United Pluralism does not claim that all religions are the same, and it does not ask anyone to abandon
            their faith. It rejects the idea that humanity&rsquo;s greatest age lies in the past. We believe in the
            possibility of progress, and we work toward a world in which more people are free to flourish.
          </p>
        </Reveal>
      </div>
    </section>
  </div>
);

export default About;
