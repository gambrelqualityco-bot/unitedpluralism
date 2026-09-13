import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Loader2, CheckCircle2 } from "lucide-react";
import { API, formatApiError } from "../context/AuthContext";
import { Reveal, MaskedLine } from "../components/Reveal";

const ResetPassword = () => {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`${API}/auth/reset-password`, { token, password: form.password });
      setDone(true);
    } catch (err) {
      setError(formatApiError(err.response?.data?.detail));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div data-testid="reset-password-page">
      <section className="relative bg-navy-950 grain overflow-hidden">
        <div className="absolute -top-32 right-1/4 h-96 w-96 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-20 lg:pt-44 lg:pb-24">
          <MaskedLine delay={0.1}>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-light">Member Community</p>
          </MaskedLine>
          <h1 className="mt-5 font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white max-w-3xl leading-[1.05]">
            <MaskedLine delay={0.25}>Choose a new</MaskedLine>
            <MaskedLine delay={0.37}>
              <span className="italic text-gold-light">password.</span>
            </MaskedLine>
          </h1>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            {done ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-8 lg:p-10 shadow-sm text-center" data-testid="reset-success">
                <CheckCircle2 className="mx-auto h-9 w-9 text-gold" />
                <h2 className="mt-4 font-serif text-2xl font-semibold text-navy">Password updated</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Your password has been changed. You can sign in with it now.
                </p>
                <Link
                  to="/login"
                  data-testid="reset-signin-button"
                  className="mt-6 inline-flex items-center rounded-full bg-gold px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-700"
                >
                  Sign In
                </Link>
              </div>
            ) : !token ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-8 lg:p-10 shadow-sm text-center" data-testid="reset-invalid">
                <p className="text-sm leading-relaxed text-slate-600">
                  This reset link is missing its token. Please request a fresh link.
                </p>
                <Link
                  to="/forgot-password"
                  data-testid="reset-request-new"
                  className="mt-6 inline-flex items-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-navy transition-colors hover:border-gold hover:text-gold"
                >
                  Request New Link
                </Link>
              </div>
            ) : (
              <form
                onSubmit={submit}
                className="rounded-3xl border border-slate-200 bg-white p-8 lg:p-10 shadow-sm"
                data-testid="reset-password-form"
              >
                <div>
                  <label htmlFor="reset-password" className="block text-sm font-semibold text-navy">New Password</label>
                  <input
                    id="reset-password"
                    data-testid="reset-password-input"
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/20"
                    placeholder="At least 8 characters"
                  />
                </div>
                <div className="mt-6">
                  <label htmlFor="reset-confirm" className="block text-sm font-semibold text-navy">Confirm New Password</label>
                  <input
                    id="reset-confirm"
                    data-testid="reset-confirm-input"
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={form.confirm}
                    onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
                    className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/20"
                    placeholder="Repeat it"
                  />
                </div>

                {error && (
                  <p className="mt-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700" data-testid="reset-error">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  data-testid="reset-submit-button"
                  disabled={submitting}
                  className="mt-7 w-full inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-gold/20 transition-all duration-300 hover:bg-amber-700 disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Updating&hellip;
                    </>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default ResetPassword;
