import {
  Video,
  MapPin,
  Music,
  BookOpen,
  MessagesSquare,
  HandHeart,
  Mail,
} from "lucide-react";
import { Reveal, MaskedLine, PageHero } from "../components/Reveal";

const HERO_IMG =
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2000&auto=format&fit=crop";

const GATHERING_ELEMENTS = [
  { icon: BookOpen, label: "Readings" },
  { icon: Music, label: "Music" },
  { icon: MessagesSquare, label: "Dialogue" },
  { icon: HandHeart, label: "Service" },
];

const Contact = () => {
  return (
    <div data-testid="contact-page">
      <PageHero image={HERO_IMG}>
        <MaskedLine delay={0.1}>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-light">
            Contact &amp; Gatherings
          </p>
        </MaskedLine>

        <h1 className="mt-5 font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white max-w-3xl leading-[1.05]">
          <MaskedLine delay={0.25}>Come as you are.</MaskedLine>
          <MaskedLine delay={0.37}>
            <span className="italic text-gold-light">
              Gather with us.
            </span>
          </MaskedLine>
        </h1>
      </PageHero>

      {/* GATHERINGS */}
      <section
        className="py-20 lg:py-28"
        data-testid="gatherings-section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7">
              <Reveal>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
                  Gatherings
                </p>

                <h2 className="mt-4 font-serif text-3xl sm:text-4xl tracking-tight text-navy">
                  Readings, reflection, music, dialogue, and service
                </h2>

                <p className="mt-5 text-base leading-relaxed text-slate-600">
                  Gatherings are the heartbeat of United Pluralism:
                  regular meetings, both virtual and local, where members
                  reflect, celebrate, learn, and serve together. Wisdom is
                  drawn from many sources: religious texts, philosophy,
                  science, poetry, and lived experience. No Gathering
                  requires a profession of belief.
                </p>

                <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {GATHERING_ELEMENTS.map((g) => (
                    <div
                      key={g.label}
                      className="rounded-xl border border-slate-200 bg-white p-5 text-center"
                    >
                      <g.icon className="mx-auto h-5 w-5 text-gold" />
                      <p className="mt-2 text-sm font-medium text-navy">
                        {g.label}
                      </p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-5 space-y-5">
              <Reveal delay={0.1}>
                <div
                  className="rounded-2xl border border-slate-200 bg-white p-7"
                  data-testid="virtual-gatherings-card"
                >
                  <Video className="h-6 w-6 text-gold" />
                  <h3 className="mt-4 font-serif text-xl font-semibold text-navy">
                    Virtual Gatherings
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    Weekly online Gatherings open to members everywhere,
                    with readings, guided reflection, and open dialogue
                    across time zones.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.2}>
                <div
                  className="rounded-2xl border border-slate-200 bg-white p-7"
                  data-testid="local-gatherings-card"
                >
                  <MapPin className="h-6 w-6 text-gold" />
                  <h3 className="mt-4 font-serif text-xl font-semibold text-navy">
                    Local Gatherings
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    Chapters meet in homes and community spaces for shared
                    meals, seasonal observances, and service projects.
                    Tell us your location when you join and we will help
                    you connect.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.3}>
                <div
                  className="rounded-2xl border border-amber-200 bg-gold-pale/60 p-7"
                  data-testid="ceremonies-card"
                >
                  <h3 className="font-serif text-xl font-semibold text-navy">
                    Ceremonies &amp; milestones
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">
                    United Pluralism marks meaningful human transitions
                    with personalized ceremonies: welcomings, life
                    milestones, and memorials that respect the beliefs of
                    those they honor. Email us at
                    info@unitedpluralism.org to begin a conversation about
                    a ceremony.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section
        className="py-20 lg:py-28 bg-slate-50 border-t border-slate-200"
        data-testid="contact-section"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-pale">
                <Mail className="h-6 w-6 text-gold" />
              </div>

              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-gold">
                Reach out
              </p>

              <h2 className="mt-4 font-serif text-3xl sm:text-4xl tracking-tight text-navy">
                We would love to hear from you
              </h2>

              <p className="mt-5 mx-auto max-w-2xl text-base leading-relaxed text-slate-600">
                Questions about United Pluralism, Gatherings, membership,
                ceremonies, or community support? Email us and a real
                person will respond as soon as possible.
              </p>

              <a
                href="mailto:info@unitedpluralism.org?subject=United%20Pluralism%20Inquiry"
                data-testid="contact-email-link"
                className="mt-8 inline-flex items-center justify-center gap-3 rounded-full bg-gold px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-gold/20 transition-all duration-300 hover:bg-amber-700 hover:-translate-y-0.5"
              >
                <Mail className="h-4 w-4" />
                Email United Pluralism
              </a>

              <p className="mt-5 text-sm text-slate-500">
                info@unitedpluralism.org
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default Contact;
