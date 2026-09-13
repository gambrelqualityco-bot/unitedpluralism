import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, Video, MapPin, Music, BookOpen, MessagesSquare, HandHeart, Mail } from "lucide-react";
import { Reveal, MaskedLine, PageHero } from "../components/Reveal";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const HERO_IMG =
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2000&auto=format&fit=crop";

const GATHERING_ELEMENTS = [
  { icon: BookOpen, label: "Readings" },
  { icon: Music, label: "Music" },
  { icon: MessagesSquare, label: "Dialogue" },
  { icon: HandHeart, label: "Service" },
];

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", topic: "General inquiry", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${API}/contact`, form);
      toast.success("Your message has been sent. We will be in touch soon.");
      setForm({ name: "", email: "", topic: "General inquiry", message: "" });
    } catch (err) {
      toast.error(err.response?.data?.detail || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div data-testid="contact-page">
      <PageHero image={HERO_IMG}>
        <MaskedLine delay={0.1}>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-light">Contact &amp; Gatherings</p>
        </MaskedLine>
        <h1 className="mt-5 font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white max-w-3xl leading-[1.05]">
          <MaskedLine delay={0.25}>Come as you are.</MaskedLine>
          <MaskedLine delay={0.37}>
            <span className="italic text-gold-light">Gather with us.</span>
          </MaskedLine>
        </h1>
      </PageHero>

      {/* GATHERINGS */}
      <section className="py-20 lg:py-28" data-testid="gatherings-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7">
              <Reveal>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Gatherings</p>
                <h2 className="mt-4 font-serif text-3xl sm:text-4xl tracking-tight text-navy">
                  Readings, reflection, music, dialogue, and service
                </h2>
                <p className="mt-5 text-base leading-relaxed text-slate-600">
                  Gatherings are the heartbeat of United Pluralism: regular meetings, both virtual and local, where
                  members reflect, celebrate, learn, and serve together. Wisdom is drawn from many sources:
                  religious texts, philosophy, science, poetry, and lived experience. No Gathering requires a
                  profession of belief.
                </p>
                <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {GATHERING_ELEMENTS.map((g) => (
                    <div key={g.label} className="rounded-xl border border-slate-200 bg-white p-5 text-center">
                      <g.icon className="mx-auto h-5 w-5 text-gold" />
                      <p className="mt-2 text-sm font-medium text-navy">{g.label}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-5 space-y-5">
              <Reveal delay={0.1}>
                <div className="rounded-2xl border border-slate-200 bg-white p-7" data-testid="virtual-gatherings-card">
                  <Video className="h-6 w-6 text-gold" />
                  <h3 className="mt-4 font-serif text-xl font-semibold text-navy">Virtual Gatherings</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    Weekly online Gatherings open to members everywhere, with readings, guided reflection, and open
                    dialogue across time zones.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="rounded-2xl border border-slate-200 bg-white p-7" data-testid="local-gatherings-card">
                  <MapPin className="h-6 w-6 text-gold" />
                  <h3 className="mt-4 font-serif text-xl font-semibold text-navy">Local Gatherings</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    Chapters meet in homes and community spaces for shared meals, seasonal observances, and service
                    projects. Tell us your location when you join and we will help you connect.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.3}>
                <div className="rounded-2xl border border-amber-200 bg-gold-pale/60 p-7" data-testid="ceremonies-card">
                  <h3 className="font-serif text-xl font-semibold text-navy">Ceremonies &amp; milestones</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">
                    United Pluralism marks meaningful human transitions with personalized ceremonies: welcomings,
                    life milestones, and memorials that respect the beliefs of those they honor. Use the form below
                    and choose &ldquo;Ceremony request.&rdquo;
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section className="py-20 lg:py-28 bg-slate-50 border-t border-slate-200" data-testid="contact-form-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Reach out</p>
              <h2 className="mt-4 font-serif text-3xl sm:text-4xl tracking-tight text-navy">We would love to hear from you</h2>
              <p className="mt-5 text-base leading-relaxed text-slate-600">
                Questions about the community, requests for support, or ceremony inquiries: every message reaches
                a real person.
              </p>
              <a
                href="mailto:info@unitedpluralism.org"
                data-testid="contact-email-link"
                className="mt-7 inline-flex items-center gap-3 rounded-full border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-navy transition-colors hover:border-gold hover:text-gold"
              >
                <Mail className="h-4 w-4" /> info@unitedpluralism.org
              </a>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={0.15}>
              <form
                onSubmit={submit}
                className="rounded-3xl border border-slate-200 bg-white p-8 lg:p-10 shadow-sm"
                data-testid="contact-form"
              >
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-semibold text-navy">Name</label>
                    <input
                      id="contact-name"
                      data-testid="contact-name-input"
                      type="text"
                      required
                      value={form.name}
                      onChange={set("name")}
                      className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/20"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-semibold text-navy">Email Address</label>
                    <input
                      id="contact-email"
                      data-testid="contact-email-input"
                      type="email"
                      required
                      value={form.email}
                      onChange={set("email")}
                      className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/20"
                      placeholder="you@example.org"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label htmlFor="contact-topic" className="block text-sm font-semibold text-navy">Topic</label>
                  <select
                    id="contact-topic"
                    data-testid="contact-topic-select"
                    value={form.topic}
                    onChange={set("topic")}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/20"
                  >
                    <option>General inquiry</option>
                    <option>Community support</option>
                    <option>Ceremony request</option>
                    <option>Gatherings &amp; chapters</option>
                  </select>
                </div>

                <div className="mt-6">
                  <label htmlFor="contact-message" className="block text-sm font-semibold text-navy">Message</label>
                  <textarea
                    id="contact-message"
                    data-testid="contact-message-input"
                    required
                    rows={5}
                    value={form.message}
                    onChange={set("message")}
                    className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/20 resize-y"
                    placeholder="How can we help?"
                  />
                </div>

                <button
                  type="submit"
                  data-testid="contact-submit-button"
                  disabled={submitting}
                  className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-gold px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-gold/20 transition-all duration-300 hover:bg-amber-700 hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Sending&hellip;
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
