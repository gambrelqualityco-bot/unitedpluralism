import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-navy-950 text-slate-300 grain relative" data-testid="site-footer">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
      <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <img src="/assets/logo.png" alt="United Pluralism emblem" className="h-11 w-11 object-contain" />
            <span className="font-serif text-xl font-semibold text-white">United Pluralism</span>
          </div>
          <p className="mt-4 font-serif italic text-lg text-gold-light">Coniuncti ad futurum</p>
          <p className="mt-1 text-sm text-slate-400">United toward the future.</p>
        </div>

        <nav aria-label="Explore">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Explore</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link data-testid="footer-link-home" className="hover:text-gold-light transition-colors" to="/">Home</Link></li>
            <li><Link data-testid="footer-link-about" className="hover:text-gold-light transition-colors" to="/about">About &amp; Values</Link></li>
            <li><Link data-testid="footer-link-observances" className="hover:text-gold-light transition-colors" to="/observances">Observances &amp; Holidays</Link></li>
          </ul>
        </nav>

        <nav aria-label="Community">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Community</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link data-testid="footer-link-membership" className="hover:text-gold-light transition-colors" to="/membership">Become a Member</Link></li>
            <li><Link data-testid="footer-link-shop" className="hover:text-gold-light transition-colors" to="/shop">Shop</Link></li>
            <li><Link data-testid="footer-link-contact" className="hover:text-gold-light transition-colors" to="/contact">Contact &amp; Gatherings</Link></li>
          </ul>
        </nav>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Reach Us</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <a data-testid="footer-email-link" className="hover:text-gold-light transition-colors" href="mailto:info@unitedpluralism.org">
                info@unitedpluralism.org
              </a>
            </li>
            <li><Link data-testid="footer-link-privacy" className="hover:text-gold-light transition-colors" to="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>

      <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500">
        <p data-testid="footer-copyright">&copy; {new Date().getFullYear()} United Pluralism. All rights reserved.</p>
        <p className="font-serif italic text-slate-400">We join together not because our beliefs are identical, but because our humanity is shared.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
