import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { Reveal, MaskedLine } from "../components/Reveal";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const COVENANT =
  "I affirm the inherent dignity of every person. I respect the bodily autonomy and conscience of others as I ask them to respect mine. I will seek truth honestly and remain willing to learn. I will allow greater knowledge and compassion to change my understanding. I will strive to choose compassion over cruelty and justice over indifference. I will respect human diversity and reject hierarchies of human worth. I will give when I have abundance and receive without shame when I have need. I will care for the living world we share. I will remember those who came before me. I will consider those who will come after me. I will defend the freedom of others to seek meaning differently from me, including the freedom to live without religion. I will work toward a world in which more people are free to flourish. I will remain mindful that I may be wrong and willing to grow when greater understanding requires it. I join others not because our beliefs are identical, but because our humanity is shared.";

const Membership = () => {
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", location: "" });
  const [affirmed, setAffirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [joined, setJoined] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!affirmed) {
      toast.error("Please affirm the United Pluralist Covenant to join.");
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`${API}/membership`, { ...form, covenant_affirmed: affirmed });
      setJoined(true);
      toast.success("Welcome to United Pluralism.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      toast.error(err.response?.data?.detail || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div data-testid="membership-page">
      <section className="relative bg-navy-950 grain overflow-hidden">
        <div className="absolute -top-32 right-1/4 h-96 w-96 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-20 lg:pt-44 lg:pb-24">
          <MaskedLine delay={0.1}>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-light">Free Membership</p>
          </MaskedLine>
          <h1 className="mt-5 font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white max-w-3xl leading-[1.05]">
            <MaskedLine delay={0.25}>Join the United Pluralist</MaskedLine>
            <MaskedLine delay={0.37}>
              <span className="italic text-gold-light">Community</span>
            </MaskedLine>
          </h1>
          <Reveal delay={0.55}>
            <p className="mt-7 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-300" data-testid="membership-intro">
              Membership in United Pluralism is free and open to all. It does not require belief in God, gods,
              spirits, an afterlife, or any supernatural claim, nor does it require the rejection of such beliefs.
              You may retain other religious or philosophical affiliations. Belonging is based on sincere
              participation in our shared values, not on passing a doctrinal test.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {joined ? (
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-3xl border border-gold/30 bg-gold-pale/50 p-10 lg:p-14 text-center"
                data-testid="membership-confirmation"
              >
                <img src="/assets/logo.png" alt="United Pluralism emblem" className="mx-auto h-20 w-20 object-contain" />
                <CheckCircle2 className="mx-auto mt-6 h-8 w-8 text-gold" />
                <h2 className="mt-4 font-serif text-3xl font-semibold text-navy">Welcome to United Pluralism</h2>
                <p className="mt-5 text-base leading-relaxed text-slate-700 max-w-xl mx-auto">
                  Welcome to United Pluralism. Your conscience belongs to you, and we are honored to share this
                  community with you. We join together not because our beliefs are identical, but because our
                  humanity is shared. We will be in touch soon with information about upcoming Gatherings and ways
                  to connect.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <Link
                    to="/observances"
                    data-testid="confirmation-observances-button"
                    className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-700"
                  >
                    Explore Observances <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/contact"
                    data-testid="confirmation-contact-button"
                    className="inline-flex items-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-navy transition-colors hover:border-gold hover:text-gold"
                  >
                    Find a Gathering
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={submit}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-3xl border border-slate-200 bg-white p-8 lg:p-12 shadow-sm"
                data-testid="membership-form"
              >
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="first-name" className="block text-sm font-semibold text-navy">First Name</label>
                    <input
                      id="first-name"
                      data-testid="first-name-input"
                      type="text"
                      required
                      value={form.first_name}
                      onChange={set("first_name")}
                      className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/20"
                      placeholder="Your first name"
                    />
                  </div>
                  <div>
                    <label htmlFor="last-name" className="block text-sm font-semibold text-navy">Last Name</label>
                    <input
                      id="last-name"
                      data-testid="last-name-input"
                      type="text"
                      required
                      value={form.last_name}
                      onChange={set("last_name")}
                      className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/20"
                      placeholder="Your last name"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label htmlFor="email" className="block text-sm font-semibold text-navy">Email Address</label>
                  <input
                    id="email"
                    data-testid="email-input"
                    type="email"
                    required
                    value={form.email}
                    onChange={set("email")}
                    className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/20"
                    placeholder="you@example.org"
                  />
                </div>

                <div className="mt-6">
                  <label htmlFor="location" className="block text-sm font-semibold text-navy">
                    Location <span className="font-normal text-slate-400">(optional)</span>
                  </label>
                  <input
                    id="location"
                    data-testid="location-input"
                    type="text"
                    value={form.location}
                    onChange={set("location")}
                    className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/20"
                    placeholder="City, region, or chapter"
                  />
                </div>

                <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <label className="flex items-start gap-3 cursor-pointer" data-testid="covenant-checkbox-label">
                    <input
                      type="checkbox"
                      data-testid="covenant-checkbox"
                      checked={affirmed}
                      onChange={(e) => setAffirmed(e.target.checked)}
                      className="mt-1 h-5 w-5 rounded border-slate-300 accent-amber-600 cursor-pointer"
                    />
                    <span className="text-sm font-semibold text-navy">
                      By joining, I affirm the United Pluralist Covenant:
                    </span>
                  </label>
                  <div
                    className="mt-4 max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white p-5"
                    data-testid="covenant-text"
                  >
                    <p className="font-serif text-base leading-relaxed text-slate-700 italic">{COVENANT}</p>
                  </div>
                </div>

                <button
                  type="submit"
                  data-testid="become-member-button"
                  disabled={submitting}
                  className="mt-8 w-full inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-gold/20 transition-all duration-300 hover:bg-amber-700 hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Joining&hellip;
                    </>
                  ) : (
                    "Become a Member"
                  )}
                </button>
                <p className="mt-4 text-center text-xs text-slate-400">
                  Membership is free. We will only write to you about community life and upcoming Gatherings.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default Membership;
