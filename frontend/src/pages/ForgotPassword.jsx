import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Loader2, MailCheck } from "lucide-react";
import { API } from "../context/AuthContext";
import { Reveal, MaskedLine, PageHero } from "../components/Reveal";

const HERO_IMG =
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2000&auto=format&fit=crop";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${API}/auth/forgot-password`, { email });
    } catch {
      /* neutral response either way */
    } finally {
      setSubmitting(false);
      setSent(true);
    }
  };

  return (
    <div data-testid="forgot-password-page">
      <PageHero image={HERO_IMG}>
        <MaskedLine delay={0.1}>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-light">Member Community</p>
        </MaskedLine>
        <h1 className="mt-5 font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white max-w-3xl leading-[1.05]">
          <MaskedLine delay={0.25}>Reset your</MaskedLine>
          <MaskedLine delay={0.37}>
            <span className="italic text-gold-light">password.</span>
          </MaskedLine>
        </h1>
      </PageHero>

      <section className="py-16 lg:py-24">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            {sent ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-8 lg:p-10 shadow-sm text-center" data-testid="forgot-sent">
                <MailCheck className="mx-auto h-9 w-9 text-gold" />
                <h2 className="mt-4 font-serif text-2xl font-semibold text-navy">Check your inbox</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  If an account exists for that address, we have sent a link to choose a new password. The link
                  expires in one hour.
                </p>
                <Link
                  to="/login"
                  data-testid="forgot-back-login"
                  className="mt-6 inline-flex items-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-navy transition-colors hover:border-gold hover:text-gold"
                >
                  Back to Sign In
                </Link>
              </div>
            ) : (
              <form
                onSubmit={submit}
                className="rounded-3xl border border-slate-200 bg-white p-8 lg:p-10 shadow-sm"
                data-testid="forgot-password-form"
              >
                <p className="text-sm leading-relaxed text-slate-600">
                  Enter the email address you joined with and we will send you a link to choose a new password.
                </p>
                <div className="mt-6">
                  <label htmlFor="forgot-email" className="block text-sm font-semibold text-navy">Email Address</label>
                  <input
                    id="forgot-email"
                    data-testid="forgot-email-input"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/20"
                    placeholder="you@example.org"
                  />
                </div>
                <button
                  type="submit"
                  data-testid="forgot-submit-button"
                  disabled={submitting}
                  className="mt-7 w-full inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-gold/20 transition-all duration-300 hover:bg-amber-700 disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Sending&hellip;
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
                <p className="mt-6 text-center text-sm text-slate-500">
                  Remembered it?{" "}
                  <Link to="/login" data-testid="forgot-signin-link" className="font-semibold text-gold hover:text-amber-700">
                    Sign in
                  </Link>
                </p>
              </form>
            )}
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default ForgotPassword;
