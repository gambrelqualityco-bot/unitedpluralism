import { useState } from "react";
import { Reveal, MaskedLine } from "../components/Reveal";
import { Moon, Sunrise, Users } from "lucide-react";

const PILLARS = [
  {
    num: "I",
    title: "Personal & Inherited Traditions",
    text: "Members bring the days that shaped them — family customs, inherited holidays, and personally sacred dates. These are honored, shared, and taught within the community, never erased.",
  },
  {
    num: "II",
    title: "Honored Observances",
    text: "We recognize and respect meaningful observances from the diverse cultures and traditions our members carry, learning about them together during Gatherings.",
  },
  {
    num: "III",
    title: "Shared Community Traditions",
    text: "United Pluralism creates its own shared observances around common human experiences and values — seasons that belong to everyone because they honor what we all live.",
  },
];

const SEVEN_LIGHTS = [
  "A light for those we have lost",
  "A light for those who grieve",
  "A light for honest memory",
  "A light for truth, even when it is difficult",
  "A light for the lonely and the forgotten",
  "A light for hope in the darkening year",
  "A light for the future we will not see",
];

const EVENTS = [
  { name: "Shalaria: The Season of Dusk", date: "Oct 1 – Nov 2", pillar: "Shared Traditions", desc: "Reflection, memory, and hope as the year darkens — closing with Remembrance Night on November 2." },
  { name: "Charisel: The Season of Giving and Goodwill", date: "Dec 1 – Jan 1", pillar: "Shared Traditions", desc: "Generosity, hospitality, care for the lonely, and community service through the turning of the year." },
  { name: "First Light Gathering", date: "Jan 1", pillar: "Seasonal Gatherings", desc: "A shared beginning: intention-setting, readings, and a communal meal to open the year." },
  { name: "Spring Equinox Gathering", date: "Mar 20", pillar: "Seasonal Gatherings", desc: "Balance and renewal — reflection on growth, and service projects begun together." },
  { name: "Summer Solstice Gathering", date: "Jun 21", pillar: "Seasonal Gatherings", desc: "Celebrating abundance, joy, and the flourishing of life at the height of light." },
  { name: "Autumn Equinox Gathering", date: "Sep 22", pillar: "Seasonal Gatherings", desc: "Gratitude and preparation — gathering in before the reflective seasons." },
  { name: "Winter Solstice Gathering", date: "Dec 21", pillar: "Seasonal Gatherings", desc: "The longest night, held within Charisel — candles, music, and shared warmth." },
  { name: "Lunar New Year", date: "Jan / Feb (dates vary)", pillar: "Honored Observances", desc: "Honored with members who celebrate it — renewal, family, and good fortune." },
  { name: "Nowruz", date: "Mar 20", pillar: "Honored Observances", desc: "The Persian New Year, honored as a celebration of spring and new beginnings." },
  { name: "Holi", date: "Mar (dates vary)", pillar: "Honored Observances", desc: "The festival of colors, honored for its joy and its triumph of good." },
  { name: "Ramadan & Eid al-Fitr", date: "Dates vary", pillar: "Honored Observances", desc: "Honored alongside Muslim members — reflection, fasting, and the joy of Eid." },
  { name: "Passover", date: "Spring (dates vary)", pillar: "Honored Observances", desc: "Honored with Jewish members — memory, liberation, and hope." },
  { name: "Vesak", date: "May (dates vary)", pillar: "Honored Observances", desc: "Honored with Buddhist members — compassion, wisdom, and peace." },
  { name: "Indigenous Peoples' Day", date: "Second Monday of Oct", pillar: "Honored Observances", desc: "Honoring the histories, resilience, and living cultures of Indigenous peoples." },
  { name: "Diwali", date: "Oct / Nov (dates vary)", pillar: "Honored Observances", desc: "The festival of lights, honored within the season of Shalaria." },
  { name: "Hanukkah", date: "Dec (dates vary)", pillar: "Honored Observances", desc: "Honored with Jewish members — light sustained through darkness." },
  { name: "Christmas", date: "Dec 25", pillar: "Honored Observances", desc: "Honored with Christian members — generosity, peace, and goodwill." },
  { name: "Kwanzaa", date: "Dec 26 – Jan 1", pillar: "Honored Observances", desc: "Honored with members who celebrate it — unity, purpose, and community." },
];

const FILTERS = ["All", "Shared Traditions", "Seasonal Gatherings", "Honored Observances"];

const Observances = () => {
  const [filter, setFilter] = useState("All");
  const events = filter === "All" ? EVENTS : EVENTS.filter((e) => e.pillar === filter);

  return (
    <div data-testid="observances-page">
      {/* HERO */}
      <section className="relative bg-navy-950 grain overflow-hidden">
        <div className="absolute -top-32 left-1/3 h-96 w-96 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-20 lg:pt-44 lg:pb-28">
          <MaskedLine delay={0.1}>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-light">Observances &amp; Holidays</p>
          </MaskedLine>
          <h1 className="mt-5 font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white max-w-3xl leading-[1.05]">
            <MaskedLine delay={0.25}>A calendar</MaskedLine>
            <MaskedLine delay={0.37}>
              <span className="italic text-gold-light">of many roots.</span>
            </MaskedLine>
          </h1>
          <Reveal delay={0.55}>
            <p className="mt-7 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-300">
              The United Pluralist year rests on three pillars: the traditions members inherit, the observances we
              honor from the world&rsquo;s many cultures, and the shared seasons we create together.
            </p>
          </Reveal>
        </div>
      </section>

      {/* THREE PILLARS */}
      <section className="py-20 lg:py-28" data-testid="pillars-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-3">
            {PILLARS.map((p, i) => (
              <Reveal key={p.num} delay={i * 0.12}>
                <div data-testid={`pillar-card-${i + 1}`} className="h-full rounded-2xl border border-slate-200 bg-white p-8 lg:p-10 transition-all duration-300 hover:border-gold/50 hover:shadow-lg hover:shadow-gold/5">
                  <span className="font-serif text-5xl text-gold/40">{p.num}</span>
                  <h2 className="mt-4 font-serif text-2xl font-semibold text-navy">{p.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SHALARIA */}
      <section className="relative overflow-hidden bg-navy-950 grain py-20 lg:py-32" data-testid="shalaria-section">
        <div className="absolute inset-0 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2000&auto=format&fit=crop"
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-950/70 to-navy-950" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <Reveal>
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-gold-light">
                <Moon className="h-4 w-4" /> October 1 — November 2
              </p>
              <h2 className="mt-5 font-serif text-4xl sm:text-5xl tracking-tight text-white">
                Shalaria <span className="italic text-gold-light">— the Season of Dusk</span>
              </h2>
              <p className="mt-6 text-base leading-relaxed text-slate-300">
                As the year darkens, Shalaria turns us toward reflection and memory. It is a season for honoring
                those who came before us, sitting honestly with mortality, and keeping hope alight through the
                dimming days — culminating in Remembrance Night on November 2.
              </p>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                Through the season, members kindle the seven commitments of light — one for each week, and one to
                carry forward:
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-6">
            <ol className="space-y-3">
              {SEVEN_LIGHTS.map((light, i) => (
                <Reveal key={light} delay={i * 0.08}>
                  <li
                    data-testid={`shalaria-light-${i + 1}`}
                    className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur px-5 py-4"
                  >
                    <span className="font-serif text-2xl text-gold-light w-8 shrink-0">{i + 1}</span>
                    <span className="text-sm sm:text-base text-slate-200">{light}</span>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* CHARISEL */}
      <section className="py-20 lg:py-32 bg-gold-pale/40" data-testid="charisel-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <Reveal>
              <div className="overflow-hidden rounded-2xl border border-amber-200 shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1400&auto=format&fit=crop"
                  alt="Volunteers working together to pack and share food donations"
                  loading="lazy"
                  className="h-80 lg:h-[440px] w-full object-cover"
                />
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-7 order-1 lg:order-2">
            <Reveal>
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-gold">
                <Sunrise className="h-4 w-4" /> December 1 — January 1
              </p>
              <h2 className="mt-5 font-serif text-4xl sm:text-5xl tracking-tight text-navy">
                Charisel <span className="italic text-gold">— the Season of Giving and Goodwill</span>
              </h2>
              <p className="mt-6 text-base leading-relaxed text-slate-700">
                Charisel opens the winter with open hands. Through December and into the first day of the new year,
                United Pluralists practice generosity and hospitality, seek out and care for the lonely, and serve
                their wider communities — giving when we have abundance, and receiving without shame when we have
                need.
              </p>
              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                {["Generosity practiced daily", "Hospitality to strangers and neighbors", "Care for the lonely", "Community service, together"].map((item, i) => (
                  <div key={item} data-testid={`charisel-value-${i + 1}`} className="flex items-center gap-3 rounded-xl bg-white border border-amber-200 px-5 py-4">
                    <Users className="h-4 w-4 text-gold shrink-0" />
                    <span className="text-sm font-medium text-navy">{item}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CALENDAR */}
      <section className="py-20 lg:py-28" data-testid="calendar-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">The shared year</p>
            <h2 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight text-navy">
              Gatherings &amp; honored days
            </h2>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter observances">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  data-testid={`filter-${f.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={() => setFilter(f)}
                  className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                    filter === f
                      ? "bg-navy text-white shadow"
                      : "bg-white border border-slate-200 text-slate-600 hover:border-gold hover:text-gold"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </Reveal>

          <div className="mt-8 divide-y divide-slate-200 border-y border-slate-200" data-testid="events-list">
            {events.map((e, i) => (
              <Reveal key={e.name} delay={Math.min(i * 0.04, 0.3)}>
                <div
                  data-testid={`event-row-${e.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  className="group grid sm:grid-cols-12 gap-2 sm:gap-6 items-baseline py-5 px-2 transition-colors duration-200 hover:bg-slate-50 rounded-lg"
                >
                  <p className="sm:col-span-3 text-xs font-semibold uppercase tracking-widest text-gold">{e.date}</p>
                  <h3 className="sm:col-span-4 font-serif text-xl font-semibold text-navy">{e.name}</h3>
                  <p className="sm:col-span-3 text-sm leading-relaxed text-slate-600">{e.desc}</p>
                  <p className="sm:col-span-2 sm:text-right">
                    <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500 group-hover:bg-gold-pale group-hover:text-amber-800 transition-colors">
                      {e.pillar}
                    </span>
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <p
              className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-5 text-sm leading-relaxed text-slate-600"
              data-testid="calendar-note"
            >
              This is not a complete list of shared observances. United Pluralists honor days drawn from many
              religious, cultural, and non-religious traditions, and no single calendar could account for them
              all. Members are encouraged to bring, share, and teach their own observances at Gatherings —
              personal and inherited days are as much a part of our shared year as any listed here.
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default Observances;
