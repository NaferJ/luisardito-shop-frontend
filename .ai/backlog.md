# Frontend Redesign Backlog — Luisardito Shop

## Goal

Redesign the frontend to look professional instead of "for kids only."
Switch from Chakra UI to Tailwind CSS (best styling approach for AI).
Copy the Bubble blog design as the base, then apply Luisardito-specific tweaks later.

## Rules

- Do NOT touch old components. Build new ones in `components/v2/`.
- New route: `/landing-v2` (`pages/landing-v2.tsx`). Old `/landing` stays untouched.
- Tailwind CSS coexists with Chakra UI during the transition. Chakra will be
  removed later once every page is migrated.
- Copy the Bubble design literally for now. Luisardito content tweaks come later.
- English only. No emojis in code.
- No dark mode. Only white background. The dark/light toggle
  (ColorModeToggle) is being discontinued. All new v2 components
  are light-only. Dark mode will be removed from old components
  during the Chakra migration.

## Design reference

Bubble blog homepage (HTML provided by user). Key visual tokens:

- `bg-background` — page background (white only, no dark mode)
- `bg-background-secondary` — alternate section background
- `bg-blue-medium` — newsletter section background
- `bg-accent` / `bg-accent-dark` — primary CTA color
- `text-brand-100` .. `text-brand-700` — brand text color scale
- `text-accent` / `text-accent-dark` / `text-accent-light` — accent text
- `border-border` / `border-input` / `border-input-hover` / `border-input-focus`
- `bg-tag` — tag pill background
- `card-shadow` / `card-shadow-hover` — card elevation
- `btn-shadow` — button elevation
- `header-shadow` — header elevation

## Phase 0 — Foundation

- [x] Install Tailwind CSS alongside Chakra (no Chakra removal yet)
- [x] Configure Tailwind theme tokens to match Bubble design colors
- [x] Create `components/v2/` folder for all new components
- [x] Create `pages/landing-v2.tsx` route

## Phase 1 — Landing page sections (in order)

### 1. Header / Menu (current task)

- [ ] Primary nav bar (sticky, `bg-background`, `header-shadow`)
  - [ ] Logo (full + mini variant)
  - [ ] Mega-menu dropdowns: Product, Resources, Community, Examples
    - Each dropdown has section headers + child items with icon, title, sublabel
  - [ ] Top-level links: Pricing, Enterprise
  - [ ] Action buttons: Contact sales, Log in, Get started
  - [ ] Mobile menu toggle (hamburger, `lg:hidden`)
- [ ] Secondary nav bar (`border-t border-border`, `h-14`)
  - Links: Blog Home, Guides, Podcast, Community, Case Studies
  - "More" dropdown: Explore authors, Explore topics
  - Search link, Subscribe link
- [ ] Greyout overlay behind open mega-menus

### 2. Hero / Featured articles

- [ ] Featured article card (large, 2-col grid on `lg`)
  - Left: title, excerpt, author avatar + name, date, read time
  - Right: responsive image (`aspect-video` mobile, full height `lg`)
  - Entire card is clickable (absolute overlay link)
- [ ] 3 secondary article cards in a grid (`sm:grid-cols-2 lg:grid-cols-3`)
  - Last child hidden on `lg` (layout balance)
  - Image on top (`aspect-video`), title, excerpt, author meta

### 3. Newsletter subscribe section

- [ ] `bg-blue-medium` full-bleed section
- [ ] Heading: "Subscribe to our newsletter"
- [ ] Email input (bordered, rounded-lg)
- [ ] Founder / Developer radio toggle (pill-style segmented control)
- [ ] Subscribe button (`bg-accent`)

### 4. Announcements carousel

- [ ] Section heading with uppercase accent link
- [ ] Swiper carousel with article cards
  - Card: image, tag pill, title, author meta
  - Prev/next arrow buttons (floating, `btn-shadow`)
  - Pagination bullets
  - Responsive: 1 slide mobile, 2 at `640px`, 3 at `991px`

### 5. Guides carousel

- [ ] Same structure as Announcements carousel, different tag data

### 6. CTA banner (accent)

- [ ] `bg-accent` full-bleed section
- [ ] White centered heading: "Build the next big thing with Bubble"
- [ ] White button: "Start building for free"

### 7. Latest stories grid

- [ ] Section heading: "LATEST STORIES"
- [ ] Multi-column grid (`sm:grid-cols-2 lg:grid-cols-3`) of article cards
  - Image, tag pill, title, excerpt, author meta
- [ ] Pagination row: Newer posts (left, invisible on page 1) / Older posts (right)

### 8. Final CTA section

- [ ] `bg-background-secondary` full-bleed section
- [ ] Heading + subtext + accent button

### 9. Footer

- [ ] Logo + social links row
- [ ] Link columns (masonry layout): Product, Bubble for, Discover, Learn,
      Resources, Community, Company, Legal
- [ ] Copyright bar at bottom

## Phase 2 — Luisardito content adaptation (later)

- Replace Bubble placeholder text/links with Luisardito routes and content
- Wire up real data (products, promotions, leaderboard) instead of static articles
- Adapt mega-menu categories to Luisardito's actual site structure
- Replace newsletter form with Luisardito's real subscribe endpoint

## Phase 3 — Migration (after all pages redesigned)

- Migrate remaining pages from Chakra to Tailwind
- Remove Chakra UI, Emotion, and Chakra theme dependencies
- Remove `theme/theme.ts` and Chakra provider in `_app.tsx`
- Clean up unused Chakra component files

## Phase 4 — Future improvements (noted, not started)

- [ ] Upgrade Next.js to latest and enable Turbopack for faster dev builds.
      Currently on Next.js 15.5.9 with the default webpack bundler.
      Turbopack would speed up dev compilation significantly but is a
      separate task — do it after the redesign is stable.
