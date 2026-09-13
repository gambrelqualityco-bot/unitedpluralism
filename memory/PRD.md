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

## Implemented (2026-09-13, iteration 2)
- Home hero rebuilt as a full-bleed, full-viewport image hero (diverse crowd celebrating under string lights — no alcohol, no religious iconography) with parallax drift, masked line reveal, emblem badge; no large empty color blocks.
- Observances calendar now carries a note that the list is not exhaustive across religious and non-religious traditions, inviting members to share their own.
- Merchandise storefront removed (products, cart, checkout all gone). /shop is now a slim "storefront opens soon" page; Shop links remain in nav/footer for the user to repoint to an external store (e.g. Bonfire).
- Members-only area: email+password auth (JWT httpOnly cookies, bcrypt, 5-attempt/15-min lockout, refresh tokens). Becoming a member now requires a password and a signed math captcha + honeypot + IP rate limit — one step creates the login.
- Discussion board at /members (protected): categories "Local Communities & Gatherings" and "Questions & Discussion"; create posts, view threads, reply. Posts show author name + location to spark local chapters.
- New /login page; navbar is auth-aware (Sign In vs member chip + sign out). Admin account seeded (info@unitedpluralism.org).

## Implemented (2026-09-13, iteration 3)
- Password reset flow: "Forgot password?" on the sign-in page → /forgot-password emails a single-use, one-hour reset link → /reset-password sets the new password and clears any login lockout. Neutral responses prevent account enumeration; reset tokens auto-expire in MongoDB.
- Admin account password set per owner request (info@unitedpluralism.org).

## Implemented (2026-09-13, iteration 4)
- Home "Gatherings" card now explains local groups organize/schedule their own Gatherings, control their content within UP values, and connect via the member community for one-time or regular gatherings.
- Replaced red-painted-hands Community Action image (read as "blood") with volunteers packing food; Charisel image swapped from big-event volunteers to a person offering a hand-wrapped gift, plus new copy that giving needs no grand event.
- Admin account enabled with real powers: role=admin sees an Admin badge and can remove discussions (with replies) and individual replies (DELETE /api/posts/{id}, DELETE /api/replies/{id}, 403 for non-admins). Reply counts stay consistent.

## Backlog
- P0: Point Shop links to the external Bonfire store URL (user to provide).
- P1: Reply notifications by email; member directory opt-in; Gathering RSVPs.
- P2: Member directory opt-in, Gathering RSVPs, email notifications for replies.

## Next Tasks
1. Swap Shop links to the external store URL when ready.
2. Add forgot/reset password.
3. Admin moderation on the board.
