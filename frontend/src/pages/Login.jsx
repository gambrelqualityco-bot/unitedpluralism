import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Loader2, ArrowRight } from "lucide-react";
import { useAuth, formatApiError } from "../context/AuthContext";
import { MaskedLine, PageHero } from "../components/Reveal";

const HERO_IMG =
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2000&auto=format&fit=crop";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      navigate(location.state?.from || "/members");
    } catch (err) {
      setError(formatApiError(err.response?.data?.detail));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div data-testid="login-page">
      <PageHero image={HERO_IMG}>
        <MaskedLine delay={0.1}>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-light">Member Community</p>
        </MaskedLine>
        <h1 className="mt-5 font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white max-w-3xl leading-[1.05]">
          <MaskedLine delay={0.25}>Welcome</MaskedLine>
          <MaskedLine delay={0.37}>
            <span className="italic text-gold-light">back.</span>
          </MaskedLine>
        </h1>
      </PageHero>

      <section className="py-16 lg:py-24">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <form
            onSubmit={submit}
            className="rounded-3xl border border-slate-200 bg-white p-8 lg:p-10 shadow-sm"
            data-testid="login-form"
          >
            <div>
              <label htmlFor="login-email" className="block text-sm font-semibold text-navy">Email Address</label>
              <input
                id="login-email"
                data-testid="login-email-input"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/20"
                placeholder="you@example.org"
              />
            </div>
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <label htmlFor="login-password" className="block text-sm font-semibold text-navy">Password</label>
                <Link
                  to="/forgot-password"
                  data-testid="forgot-password-link"
                  className="text-xs font-medium text-gold hover:text-amber-700 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="login-password"
                data-testid="login-password-input"
                type="password"
                required
                autoComplete="current-password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/20"
                placeholder="Your password"
              />
            </div>

            {error && (
              <p className="mt-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700" data-testid="login-error">
                {error}
              </p>
            )}

            <button
              type="submit"
              data-testid="login-submit-button"
              disabled={submitting}
              className="mt-7 w-full inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-gold/20 transition-all duration-300 hover:bg-amber-700 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Signing in&hellip;
                </>
              ) : (
                "Sign In"
              )}
            </button>

            <p className="mt-6 text-center text-sm text-slate-500">
              Not a member yet?{" "}
              <Link to="/membership" data-testid="login-join-link" className="font-semibold text-gold hover:text-amber-700">
                Become a Member; it&rsquo;s free <ArrowRight className="inline h-3.5 w-3.5" />
              </Link>
            </p>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Login;
