import { useState } from 'react'
import Link from 'next/link'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface MegaMenuItem {
  icon?: string
  title: string
  sublabel: string
  href: string
  isNew?: boolean
}

interface MegaMenuSection {
  header: string
  items: MegaMenuItem[]
}

interface MegaMenuConfig {
  label: string
  sections: MegaMenuSection[]
}

/* ------------------------------------------------------------------ */
/*  Menu data (copied literally from Bubble blog)                      */
/* ------------------------------------------------------------------ */

const MEGA_MENUS: MegaMenuConfig[] = [
  {
    label: 'Product',
    sections: [
      {
        header: 'Meet Bubble',
        items: [
          { icon: 'stack', title: 'How Bubble works', sublabel: 'Platform overview and key features.', href: 'https://bubble.io/features' },
          { icon: 'device-mobile-speaker', title: 'Native mobile', sublabel: 'Build native iOS and Android apps, without code.', href: 'https://bubble.io/mobile', isNew: true },
          { icon: 'magic-wand', title: 'Get started with AI prompts', sublabel: 'Use AI to build a full-stack product in minutes.', href: 'https://bubble.io/ai-features', isNew: true },
        ],
      },
      {
        header: 'Bubble for',
        items: [
          { icon: 'lightbulb', title: 'Founders', sublabel: 'Go from idea to launch, fast.', href: 'https://bubble.io/for-founders' },
          { icon: 'laptop', title: 'Developers', sublabel: 'Build professionally for clients.', href: 'https://bubble.io/for-developers' },
          { icon: 'buildings', title: 'Enterprise', sublabel: 'Create powerful, custom apps that scale.', href: 'https://bubble.io/for-enterprise' },
        ],
      },
    ],
  },
  {
    label: 'Resources',
    sections: [
      {
        header: 'Build',
        items: [
          { icon: 'sparkle', title: 'Connect to AI', sublabel: 'Build, test, and scale with your favorite AI models.', href: 'https://bubble.io/ai-integrations', isNew: true },
          { icon: 'layout', title: 'Templates', sublabel: 'Start faster with pre-built templates.', href: 'https://bubble.io/templates' },
          { icon: 'plug', title: 'Plugins', sublabel: 'Add more features with plugins.', href: 'https://bubble.io/plugins' },
          { icon: 'users', title: 'Get help building', sublabel: 'Find Bubble experts to help with your project.', href: 'https://bubble.io/hire-a-developer' },
          { icon: 'storefront', title: 'Marketplace', sublabel: 'Discover more tools on our marketplace.', href: 'https://bubble.io/marketplace' },
        ],
      },
      {
        header: 'Learn',
        items: [
          { icon: 'book-open-text', title: 'Academy', sublabel: 'Learn to build on Bubble with step-by-step guides.', href: 'https://bubble.io/academy' },
          { icon: 'book', title: 'Technical guides', sublabel: 'Detailed documentation for builders.', href: 'https://manual.bubble.io/' },
          { icon: 'article', title: 'Bubble blog', sublabel: 'Learn from our team with tips and tutorials.', href: 'https://bubble.io/blog/' },
        ],
      },
    ],
  },
  {
    label: 'Community',
    sections: [
      {
        header: 'Get Involved',
        items: [
          { icon: 'users-three', title: 'Bubble community', sublabel: 'Join thousands of builders worldwide.', href: 'https://bubble.io/community' },
          { icon: 'chat-text', title: 'Forum', sublabel: 'Ask questions, share ideas, and discuss all things Bubble.', href: 'https://forum.bubble.io/' },
          { icon: 'cursor-click', title: 'Early access', sublabel: "Test new features and shape what's next for Bubble.", href: 'https://bubble.io/beta-testing' },
        ],
      },
    ],
  },
  {
    label: 'Examples',
    sections: [
      {
        header: 'Built on Bubble',
        items: [
          { icon: 'confetti', title: 'Success stories', sublabel: 'Read how Bubble builders are redefining what is possible.', href: 'https://bubble.io/showcase' },
          { icon: 'squares-four', title: 'App gallery', sublabel: 'Get inspired by real-life Bubble apps', href: 'https://bubble.io/app-gallery', isNew: true },
          { icon: 'list-checks', title: 'Use cases', sublabel: 'Explore the wide range of what is possible on Bubble.', href: 'https://bubble.io/solutions-overview', isNew: true },
        ],
      },
    ],
  },
]

const SECONDARY_NAV = [
  { label: 'Blog Home', href: 'https://bubble.io/blog/' },
  { label: 'Guides', href: 'https://bubble.io/blog/tag/guides/' },
  { label: 'Podcast', href: 'https://bubble.io/blog/tag/the-new-build-podcast/' },
  { label: 'Community', href: 'https://bubble.io/blog/tag/community/' },
  { label: 'Case Studies', href: 'https://bubble.io/blog/tag/case-studies/' },
]

const SECONDARY_NAV_MORE = [
  { label: 'Explore authors', href: 'https://bubble.io/blog/authors/' },
  { label: 'Explore topics', href: 'https://bubble.io/blog/topics/' },
]

/* ------------------------------------------------------------------ */
/*  Chevron icon                                                       */
/* ------------------------------------------------------------------ */

function ChevronDown() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="inline-block w-4 h-4">
      <rect width="256" height="256" fill="none" />
      <polyline points="208 96 128 176 48 96" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Mega menu item icon (placeholder SVG path per icon name)           */
/* ------------------------------------------------------------------ */

function MegaIcon({ name }: { name: string }) {
  // Simple placeholder icon - a rounded square with the first letter.
  // Real icons will be added later when adapting to Luisardito content.
  return (
    <span className="flex items-center justify-center w-6 h-6 rounded bg-brand-100 text-brand-600 text-xs font-bold shrink-0">
      {name.charAt(0).toUpperCase()}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  Primary nav mega-menu item                                         */
/* ------------------------------------------------------------------ */

function MegaMenuItemComponent({ item }: { item: MegaMenuItem }) {
  return (
    <li className="sublevel child subitem">
      <a href={item.href} className="flex items-start gap-3 py-2 px-3 rounded-lg hover:bg-brand-50 transition-colors">
        <MegaIcon name={item.icon || ''} />
        <span className="flex flex-col">
          <span className="menu-title font-semibold text-sm text-brand-700">
            {item.title}
            {item.isNew && <span className="new ml-1 text-xs font-bold text-accent">new</span>}
          </span>
          <span className="sublabel text-xs text-brand-400">{item.sublabel}</span>
        </span>
      </a>
    </li>
  )
}

function MegaMenu({ menu }: { menu: MegaMenuConfig }) {
  const [open, setOpen] = useState(false)

  return (
    <li
      className="nav-current toplevel menu-item-has-children relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="flex items-center gap-1 font-bold text-base text-brand-700 hover:text-accent py-3 cursor-pointer">
        {menu.label}
        <ChevronDown />
      </button>
      {open && (
        <ul className="ghost-submenu absolute top-full left-0 z-50 bg-background border border-border rounded-lg shadow-card-hover p-3 min-w-[28rem] grid grid-cols-2 gap-x-6">
          {menu.sections.map((section) => (
            <div key={section.header}>
              <li className="sublevel header subitem mb-1">
                <span className="menu-header text-xs font-bold uppercase text-brand-400 tracking-wide">{section.header}</span>
              </li>
              {section.items.map((item) => (
                <MegaMenuItemComponent key={item.title} item={item} />
              ))}
            </div>
          ))}
        </ul>
      )}
    </li>
  )
}

/* ------------------------------------------------------------------ */
/*  Secondary nav "More" dropdown                                      */
/* ------------------------------------------------------------------ */

function SecondaryMoreDropdown() {
  const [open, setOpen] = useState(false)

  return (
    <li
      className="nav-more nav-current menu-item-has-children relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="flex items-center gap-1 cursor-pointer">
        More
        <ChevronDown />
      </button>
      {open && (
        <ul className="ghost-submenu absolute top-full right-0 z-50 bg-background border border-border rounded-lg shadow-card-hover p-2 min-w-[12rem]">
          {SECONDARY_NAV_MORE.map((item) => (
            <li key={item.label} className="subitem">
              <a href={item.href} className="block py-2 px-3 rounded-lg hover:bg-brand-50 text-sm">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

/* ------------------------------------------------------------------ */
/*  Main header                                                        */
/* ------------------------------------------------------------------ */

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 px-px bg-background z-30 header-shadow">
      {/* Primary nav */}
      <nav className="bg-background px-4 lg:px-9 flex items-center">
        {/* Logo */}
        <Link href="/landing-v2">
          <span className="flex items-center cursor-pointer">
            <span className="full-logo text-xl font-black text-brand-700 hidden lg:inline">Bubble</span>
            <span className="logo-mini text-xl font-black text-brand-700 lg:hidden">B</span>
          </span>
        </Link>

        {/* Mega-menu nav */}
        <div className="px-5 gh-head-menu flex flex-row gap-x-5 hidden lg:flex">
          <ul className="nav flex flex-row flex-grow items-start gap-x-2 font-bold text-base">
            {MEGA_MENUS.map((menu) => (
              <MegaMenu key={menu.label} menu={menu} />
            ))}
            <li className="nav-pricing toplevel">
              <a href="https://bubble.io/pricing" className="block py-3 hover:text-accent">Pricing</a>
            </li>
            <li className="nav-enterprise toplevel">
              <a href="https://bubble.io/for-enterprise" className="block py-3 hover:text-accent">Enterprise</a>
            </li>
          </ul>
        </div>

        {/* Action buttons */}
        <div className="pl-5 gh-head-menu flex flex-row-reverse justify-between gap-x-5 ml-auto">
          <ul className="flex flex-row items-center lg:gap-x-5 font-bold text-base justify-end">
            <li className="static-menu py-3 lg:py-0 contact-sales hidden lg:block">
              <a href="https://bubble.io/contact-sales" className="text-brand-500 hover:text-accent outline-none focus:text-accent">
                Contact sales
              </a>
            </li>
            <li className="static-menu py-3 lg:py-0 lg:block login">
              <a
                href="https://bubble.io/login?mode=login"
                className="text-accent-dark hover:text-accent-light focus:text-accent-light lg:text-accent lg:hover:text-accent-dark lg:focus:text-accent-dark hover:underline focus:underline outline-solid rounded-full"
              >
                Log in
              </a>
            </li>
            <li className="static-menu lg:block py-3 lg:py-0">
              <a
                href="https://bubble.io/login?mode=signup"
                className="outline-none flex h-[2.625rem] px-5 items-center justify-center text-white bg-accent hover:bg-accent-dark focus:bg-accent-dark rounded-full font-semibold"
              >
                Get started
              </a>
            </li>
          </ul>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="outline-none lg:hidden ml-2 p-2"
          aria-label="mobile menu"
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="w-6 h-6 fill-brand-500">
            <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
          </svg>
        </button>
      </nav>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="lg:hidden bg-background border-t border-border px-4 py-4 flex flex-col gap-4">
          {MEGA_MENUS.map((menu) => (
            <div key={menu.label} className="flex flex-col gap-2">
              <span className="font-bold text-brand-700">{menu.label}</span>
              {menu.sections.map((section) => (
                <div key={section.header} className="pl-3 flex flex-col gap-1">
                  <span className="text-xs font-bold uppercase text-brand-400">{section.header}</span>
                  {section.items.map((item) => (
                    <a key={item.title} href={item.href} className="text-sm text-brand-600 hover:text-accent">
                      {item.title}
                    </a>
                  ))}
                </div>
              ))}
            </div>
          ))}
          <div className="flex flex-col gap-2 border-t border-border pt-4">
            <a href="https://bubble.io/pricing" className="font-bold text-brand-700">Pricing</a>
            <a href="https://bubble.io/for-enterprise" className="font-bold text-brand-700">Enterprise</a>
            <a href="https://bubble.io/contact-sales" className="text-brand-500">Contact sales</a>
            <a href="https://bubble.io/login?mode=login" className="text-accent">Log in</a>
            <a
              href="https://bubble.io/login?mode=signup"
              className="flex h-[2.625rem] px-5 items-center justify-center text-white bg-accent hover:bg-accent-dark rounded-full font-semibold"
            >
              Get started
            </a>
          </div>
        </div>
      )}

      {/* Secondary nav */}
      <div className="relative border-t border-border">
        <nav className="px-4 lg:px-9 bg-background h-14 flex items-center lg:justify-center gap-6 text-sm lg:text-base font-bold [&>*]:shrink-0">
          <ul className="nav flex items-center gap-6">
            {SECONDARY_NAV.map((item) => (
              <li key={item.label}>
                <a href={item.href} className="hover:text-accent">{item.label}</a>
              </li>
            ))}
            <SecondaryMoreDropdown />
            <li className="nav-search">
              <a href="#/search" className="hover:text-accent">Search</a>
            </li>
            <li className="nav-subscribe">
              <a href="https://bubble.io/newsletter" className="hover:text-accent">Subscribe</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
