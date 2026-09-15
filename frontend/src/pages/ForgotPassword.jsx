import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { Reveal, MaskedLine, PageHero } from "../components/Reveal";

const HERO_IMG =
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2000&auto=format&fit=crop";

const ForgotPassword = () => {
  return (
    <div data-testid="forgot-password-page">
      <PageHero image={HERO_IMG}>
        <MaskedLine delay={0.1}>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-light">
            Member Community
          </p>
        </MaskedLine>

        <h1 className="mt-5 font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white max-w-3xl leading-[1.05]">
          <MaskedLine delay={0.25}>Account</MaskedLine>
          <MaskedLine delay={0.37}>
            <span className="italic text-gold-light">
              assistance.
            </span>
          </MaskedLine>
        </h1>
      </PageHero>

      <section className="py-16 lg:py-24">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div
              className="rounded-3xl border border-slate-200 bg-white p-8 lg:p-10 shadow-sm text-center"
              data-testid="account-assistance"
            >
              <Mail className="mx-auto h-9 w-9 text-gold" />

              <h2 className="mt-4 font-serif text-2xl font-semibold text-navy">
                Need help signing in?
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Email us from the email address associated with your
                United Pluralism membership. A real person will respond
                and help you regain access to your account.
              </p>

              <a
                href="mailto:info@unitedpluralism.org?subject=United%20Pluralism%20Account%20Assistance"
                data-testid="account-assistance-email"
                className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-gold/20 transition-all duration-300 hover:bg-amber-700 hover:-translate-y-0.5"
              >
                <Mail className="h-4 w-4" />
                Email for Account Assistance
              </a>

              <p className="mt-5 text-xs leading-relaxed text-slate-500">
                For your security, never include your password in an
                email. We will never ask you to send us your password.
              </p>

              <p className="mt-7 text-sm text-slate-500">
                Remembered your password?{" "}
                <Link
                  to="/login"
                  data-testid="forgot-signin-link"
                  className="font-semibold text-gold hover:text-amber-700"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default ForgotPassword;
