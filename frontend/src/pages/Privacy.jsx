import { Reveal, MaskedLine } from "../components/Reveal";

const Privacy = () => (
  <div data-testid="privacy-page">
    <section className="relative bg-navy-950 grain overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-16 lg:pt-44 lg:pb-20">
        <MaskedLine delay={0.1}>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-light">Privacy Policy</p>
        </MaskedLine>
        <h1 className="mt-5 font-serif text-4xl sm:text-5xl tracking-tight text-white leading-[1.05]">
          <MaskedLine delay={0.25}>Your information, treated with dignity.</MaskedLine>
        </h1>
      </div>
    </section>

    <section className="py-16 lg:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <Reveal>
          <div>
            <h2 className="font-serif text-2xl font-semibold text-navy">What we collect</h2>
            <p className="mt-3 text-base leading-relaxed text-slate-600">
              When you join United Pluralism or contact us, we collect only what you give us directly: your name,
              email address, and — if you choose to share it — your general location. Shopping carts are stored
              only on your own device.
            </p>
          </div>
        </Reveal>
        <Reveal>
          <div>
            <h2 className="font-serif text-2xl font-semibold text-navy">How we use it</h2>
            <p className="mt-3 text-base leading-relaxed text-slate-600">
              We use your information to welcome you into the community, connect you with Gatherings near you, and
              respond to your inquiries and ceremony requests. We never sell, rent, or share your information with
              third parties for marketing.
            </p>
          </div>
        </Reveal>
        <Reveal>
          <div>
            <h2 className="font-serif text-2xl font-semibold text-navy">Your choices</h2>
            <p className="mt-3 text-base leading-relaxed text-slate-600">
              You may ask at any time to see, correct, or delete the information we hold about you. Write to us at{" "}
              <a href="mailto:info@unitedpluralism.org" className="text-gold font-medium hover:underline">
                info@unitedpluralism.org
              </a>{" "}
              and we will honor your request — your conscience, and your data, belong to you.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  </div>
);

export default Privacy;
