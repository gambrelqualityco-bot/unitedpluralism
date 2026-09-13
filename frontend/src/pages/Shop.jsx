import { Link } from "react-router-dom";
import { ArrowRight, Store } from "lucide-react";
import { Reveal, MaskedLine } from "../components/Reveal";

const Shop = () => (
  <div data-testid="shop-page">
    <section className="relative bg-navy-950 grain overflow-hidden">
      <div className="absolute -top-32 right-1/3 h-96 w-96 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-20 lg:pt-44 lg:pb-24">
        <MaskedLine delay={0.1}>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-light">The Shop</p>
        </MaskedLine>
        <h1 className="mt-5 font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white max-w-3xl leading-[1.05]">
          <MaskedLine delay={0.25}>Merchandise is moving</MaskedLine>
          <MaskedLine delay={0.37}>
            <span className="italic text-gold-light">to a new home.</span>
          </MaskedLine>
        </h1>
      </div>
    </section>

    <section className="py-20 lg:py-28">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Reveal>
          <img src="/assets/logo.png" alt="United Pluralism emblem" className="mx-auto h-20 w-20 object-contain" />
          <Store className="mx-auto mt-6 h-7 w-7 text-gold" />
          <h2 className="mt-4 font-serif text-3xl font-semibold text-navy" data-testid="shop-notice-title">
            Our storefront opens soon
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600" data-testid="shop-notice-text">
            United Pluralism merchandise — apparel, drinkware, and goods for a shared life — will be available
            through our dedicated external store. The link will live here as soon as the storefront opens.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/membership"
              data-testid="shop-join-button"
              className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-700"
            >
              Become a Member <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/contact"
              data-testid="shop-contact-button"
              className="inline-flex items-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-navy transition-colors hover:border-gold hover:text-gold"
            >
              Contact Us
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  </div>
);

export default Shop;
