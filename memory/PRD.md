# United Pluralism — PRD

## Original Problem Statement
Build a modern, clean, accessible multi-page website for "United Pluralism", an inclusive religious community founded on shared human values, mutual care, and ethical responsibility rather than a single required theology. Palette derived from the official logo (deep navy, warm slate gray, crisp white, amber/gold accents). No deity figures, altars, or denomination-specific imagery — only human-centered and nature-inspired photos. Pages: Home, About & Values, Observances & Holidays, Free Membership Registration (exact intro/covenant/confirmation copy), Shop (4 placeholder products + functional cart), Contact & Gatherings, Footer with privacy policy. Registrations and contact enquiries must be emailed to info@unitedpluralism.org. User provided official logo (Google Drive) and founding document (Google Doc). Design bar: award-worthy — kinetic hero with masked line reveal, editorial marquee, numbered manifesto chapters, parallax hero image, framer-motion scroll reveals, lenis smooth scrolling.

## Architecture
- Frontend: React 19 + react-router-dom v7, Tailwind (Cormorant Garamond serif + Plus Jakarta Sans), framer-motion, lenis, sonner toasts, shadcn/ui primitives. Cart: React context + localStorage with slide-in drawer.
- Backend: FastAPI, MongoDB (motor) via MONGO_URL/DB_NAME. Routes (all /api): GET /api/health, POST /api/membership, POST /api/contact.
- Email: Emergent managed Resend proxy (EMERGENT_EMAIL_KEY, EMAIL_FROM_NAME="United Pluralism", OWNER_EMAIL=info@unitedpluralism.org, EMAIL_REPLY_TO same, SITE_URL). Guardrail gate (_assert_safe_email) on every send.
- Assets: official logo at /app/frontend/public/assets/logo.png.

## User Personas
- Seeker: spiritual/humanist/agnostic/nonreligious visitor exploring belonging without creed.
- Member of another faith: wants layered affiliation without abandoning their tradition.
- Community organizer: looking for Gatherings, observances, and ceremony requests.

## Core Requirements (static)
Exact covenant text + affirmation checkbox; exact membership intro and confirmation copy; Shalaria (Oct 1–Nov 2, seven commitments of light) and Charisel (Dec 1–Jan 1) spotlights; three calendar pillars; four named placeholder products with set prices; cart that persists; all sign-ups and enquiries to info@unitedpluralism.org.

## Implemented (2026-09-13)
- All 7 pages: Home (kinetic masked hero, parallax photo, marquee, principles, community, CTA), About (numbered manifesto chapters 01–04, ethical commitments grid, vision band), Observances (pillars, Shalaria + Charisel spotlights, filterable 18-event calendar), Membership (exact copy, covenant scroll panel, confirmation state), Shop (4 products, category filter, working cart drawer, launching-soon note), Contact (gatherings info, ceremony requests, form), Privacy.
- Backend: membership + contact endpoints saving to MongoDB and emailing owner (info@unitedpluralism.org); welcome email to new members. Verified: owner_notified + welcome_sent true; covenant guard returns 400.
- Cart verified: add, increase, subtotal math, localStorage persistence.
- Imagery audited: removed dinner-with-drinks hero and chapel-interior Charisel photo; all imagery now human-centered/nature, no alcohol, no religious iconography.

## Backlog
- P0: Real storefront checkout (user will replace placeholder products with real ones — Stripe when ready).
- P1: Admin view/export of members and enquiries (currently MongoDB-only; no auth built).
- P1: Gathering RSVP / events sign-up.
- P2: Newsletter opt-in, chapter map, ceremony request scheduling.

## Next Tasks
1. Wire real products into Shop (replace PRODUCTS array, same shape).
2. Add Stripe checkout when fulfillment launches.
3. Optional: protected admin dashboard for member/enquiry lists.
