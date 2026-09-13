import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, UserRound } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About & Values" },
  { to: "/observances", label: "Observances" },
  { to: "/membership", label: "Membership" },
  { to: "/members", label: "Members" },
  { to: "/shop", label: "Shop" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const signOut = async () => {
    await logout();
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-white/85 backdrop-blur-xl border-b border-slate-200/70" data-testid="site-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5 shrink-0" data-testid="nav-logo-link" onClick={() => setMenuOpen(false)}>
          <img src="/assets/logo.png" alt="United Pluralism emblem" className="h-9 w-9 object-contain" />
          <span className="font-serif text-lg font-semibold tracking-tight text-navy">United Pluralism</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              data-testid={`nav-link-${l.label.toLowerCase().replace(/[^a-z]+/g, "-")}`}
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
                  isActive ? "text-gold" : "text-slate-600 hover:text-navy"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                to="/members"
                data-testid="nav-member-chip"
                className="hidden sm:inline-flex items-center gap-2 rounded-full bg-navy px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-navy-800"
              >
                <UserRound className="h-4 w-4 text-gold-light" /> {user.first_name}
              </Link>
              <button
                type="button"
                data-testid="nav-signout-button"
                onClick={signOut}
                className="p-2.5 rounded-full text-navy hover:bg-slate-100 transition-colors duration-200"
                aria-label="Sign out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                data-testid="nav-signin-link"
                className="hidden sm:inline-flex px-3 py-2 text-sm font-medium text-slate-600 hover:text-navy transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/membership"
                data-testid="nav-join-button"
                className="hidden sm:inline-flex items-center rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-amber-700 hover:shadow-md"
              >
                Join the Community
              </Link>
            </>
          )}
          <button
            type="button"
            data-testid="nav-menu-toggle"
            className="lg:hidden p-2.5 rounded-full text-navy hover:bg-slate-100 transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            key={location.pathname + "-menu"}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="lg:hidden overflow-hidden border-t border-slate-200/70 bg-white/95 backdrop-blur-xl"
            aria-label="Mobile"
          >
            <div className="px-4 py-3 flex flex-col">
              {LINKS.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  data-testid={`mobile-nav-link-${l.label.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-3 text-base font-medium rounded-lg ${isActive ? "text-gold" : "text-slate-700"}`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              {user ? (
                <button
                  type="button"
                  data-testid="mobile-nav-signout"
                  onClick={signOut}
                  className="px-3 py-3 text-left text-base font-medium text-slate-700"
                >
                  Sign Out ({user.first_name})
                </button>
              ) : (
                <NavLink
                  to="/login"
                  data-testid="mobile-nav-signin"
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-3 text-base font-medium text-slate-700"
                >
                  Sign In
                </NavLink>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
