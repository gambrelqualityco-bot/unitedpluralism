import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, ArrowRight, RefreshCw } from "lucide-react";
import { Reveal, MaskedLine, PageHero } from "../components/Reveal";
import { API, useAuth, formatApiError } from "../context/AuthContext";

const HERO_IMG =
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2000&auto=format&fit=crop";

const COVENANT =
  "I affirm the inherent dignity of every person. I respect the bodily autonomy and conscience of others as I ask them to respect mine. I will seek truth honestly and remain willing to learn. I will allow greater knowledge and compassion to change my understanding. I will strive to choose compassion over cruelty and justice over indifference. I will respect human diversity and reject hierarchies of human worth. I will give when I have abundance and receive without shame when I have need. I will care for the living world we share. I will remember those who came before me. I will consider those who will come after me. I will defend the freedom of others to seek meaning differently from me, including the freedom to live without religion. I will work toward a world in which more people are free to flourish. I will remain mindful that I may be wrong and willing to grow when greater understanding requires it. I join others not because our beliefs are identical, but because our humanity is shared.";

const Membership = () => {
  const { setUser } = useAuth();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    location: "",
    password: "",
    captcha_answer: "",
    website: "",
  });
  const [captcha, setCaptcha] = useState(null);
  const [affirmed, setAffirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [joined, setJoined] = useState(false);

  const loadCaptcha = async () => {
    try {
      const { data } = await axios.get(`${API}/captcha`);
      setCaptcha(data);
      setForm((f) => ({ ...f, captcha_answer: "" }));
    } catch {
      toast.error("Could not load the spam check. Please refresh the page.");
    }
  };

  useEffect(() => {
    loadCaptcha();
  }, []);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!affirmed) {
      toast.error("Please affirm the United Pluralist Covenant to join.");
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await axios.post(
        `${API}/membership`,
        {
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          location: form.location,
          password: form.password,
          covenant_affirmed: affirmed,
          captcha_id: captcha?.captcha_id || "",
          captcha_answer: form.captcha_answer,
          website: form.website,
        },
        { withCredentials: true }
      );
      if (data.user) setUser(data.user);
      setJoined(true);
      toast.success("Welcome to United Pluralism.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail));
      loadCaptcha();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div data-testid="membership-page">
      <PageHero image={HERO_IMG}>
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
          <p className="mt-7 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-100" data-testid="membership-intro">
            Membership in United Pluralism is free and open to all. It does not require belief in God, gods,
            spirits, an afterlife, or any supernatural claim, nor does it require the rejection of such beliefs.
            You may retain other religious or philosophical affiliations. Belonging is based on sincere
            participation in our shared values, not on passing a doctrinal test.
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-200">
            Joining creates your sign-in for the member community, where members form local groups, plan
            celebrations, and talk together. Already joined?{" "}
            <Link to="/login" data-testid="membership-signin-link" className="font-semibold text-gold-light hover:text-gold">
              Sign in here.
            </Link>
          </p>
        </Reveal>
      </PageHero>

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
                    to="/members"
                    data-testid="confirmation-members-button"
                    className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-700"
                  >
                    Enter the Member Community <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/observances"
                    data-testid="confirmation-observances-button"
                    className="inline-flex items-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-navy transition-colors hover:border-gold hover:text-gold"
                  >
                    Explore Observances
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
                    autoComplete="email"
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
                  <p className="mt-1.5 text-xs text-slate-400">
                    Sharing your area helps members near you form local communities and Gatherings.
                  </p>
                </div>

                <div className="mt-6">
                  <label htmlFor="password" className="block text-sm font-semibold text-navy">Create a Password</label>
                  <input
                    id="password"
                    data-testid="password-input"
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={form.password}
                    onChange={set("password")}
                    className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/20"
                    placeholder="At least 8 characters"
                  />
                  <p className="mt-1.5 text-xs text-slate-400">This becomes your sign-in for the member community.</p>
                </div>

                <input
                  type="text"
                  name="website"
                  value={form.website}
                  onChange={set("website")}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                <div className="mt-6">
                  <label htmlFor="captcha-answer" className="block text-sm font-semibold text-navy">
                    Quick spam check: {captcha ? captcha.question : "loading…"}
                  </label>
                  <div className="mt-2 flex items-center gap-3">
                    <input
                      id="captcha-answer"
                      data-testid="captcha-input"
                      type="text"
                      required
                      inputMode="numeric"
                      value={form.captcha_answer}
                      onChange={set("captcha_answer")}
                      className="w-32 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/20"
                      placeholder="Answer"
                    />
                    <button
                      type="button"
                      data-testid="captcha-refresh-button"
                      onClick={loadCaptcha}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-gold transition-colors"
                    >
                      <RefreshCw className="h-3.5 w-3.5" /> New question
                    </button>
                  </div>
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
