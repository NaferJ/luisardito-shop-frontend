import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useAuth } from '../../hooks/useAuth'
import {
  PiStack,
  PiDeviceMobileSpeaker,
  PiMagicWand,
  PiLightbulb,
  PiLaptop,
  PiBuildings,
  PiSparkle,
  PiLayout,
  PiPlug,
  PiUsers,
  PiStorefront,
  PiBookOpenText,
  PiBook,
  PiArticle,
  PiUsersThree,
  PiChatText,
  PiCursorClick,
  PiConfetti,
  PiSquaresFour,
  PiListChecks,
  PiCaretDown,
  PiArrowRight,
  PiShoppingCart,
  PiTrophy,
  PiGift,
  PiGear,
  PiMonitorPlay,
  PiUser,
  PiClockCounterClockwise,
  PiSignOut,
  IconType,
} from 'react-icons/pi'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface MegaMenuItem {
  icon: IconType
  title: string
  sublabel: string
  href: string
  adminOnly?: boolean
}

interface MegaMenuSection {
  header: string
  items: MegaMenuItem[]
  column?: number
}

/* ------------------------------------------------------------------ */
/*  Menu data — "Puntos" mega-menu                                     */
/*  column 0 = left column, column 1 = right column (stacked)         */
/* ------------------------------------------------------------------ */

const PUNTOS_MENU: MegaMenuSection[] = [
  {
    header: 'Puntos',
    column: 0,
    items: [
      { icon: PiShoppingCart, title: 'Tienda', sublabel: 'Explora los productos disponibles.', href: '/productos' },
      { icon: PiGift, title: 'Canjes', sublabel: 'Revisa y gestiona tus canjes.', href: '/canjes' },
      { icon: PiTrophy, title: 'Ranking', sublabel: 'Mira tu posición en el ranking de puntos.', href: '/leaderboard' },
      { icon: PiClockCounterClockwise, title: 'Historial', sublabel: 'Revisa tu actividad reciente.', href: '/historial' },
    ],
  },
  {
    header: 'Gestión',
    column: 1,
    items: [
      { icon: PiUsers, title: 'Usuarios', sublabel: 'Gestiona los usuarios de la plataforma.', href: '/admin/usuarios', adminOnly: true },
      { icon: PiStack, title: 'Inventario', sublabel: 'Administra el inventario de canjes.', href: '/admin/canjes', adminOnly: true },
    ],
  },
  {
    header: 'Integraciones',
    column: 1,
    items: [
      { icon: PiMonitorPlay, title: 'Kick', sublabel: 'Configuración de la integración con Kick.', href: '/admin/kick', adminOnly: true },
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  Phosphor caret-down icon (matches Bubble's icon set exactly)      */
/* ------------------------------------------------------------------ */

function CaretDown({ rotate }: { rotate: boolean }) {
  return (
    <span
      className="icon-item inline-flex items-center justify-center w-4 h-4"
      style={{ transition: 'transform 0.3s ease', transform: rotate ? 'rotate(180deg)' : 'rotate(0deg)' }}
    >
      <PiCaretDown style={{ width: '100%', height: '100%' }} />
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  Mega menu dropdown panel                                           */
/* ------------------------------------------------------------------ */

function MegaMenuItemComponent({ item }: { item: MegaMenuItem }) {
  const Icon = item.icon
  return (
    <li>
      <a
        href={item.href}
        className="group flex items-start gap-4 py-3 px-3 rounded-lg hover:bg-brand-50/60 transition-colors duration-200 cursor-pointer"
      >
        <span className="flex items-center justify-center w-5 h-5 shrink-0 text-[#1A1A1A] mt-0.5 group-hover:text-accent transition-colors duration-200">
          <Icon style={{ width: '20px', height: '20px' }} />
        </span>
        <span className="flex flex-col">
          <span className="font-normal text-sm text-[#1A1A1A] group-hover:text-accent transition-colors duration-200">
            {item.title}
          </span>
          <span className="text-xs text-brand-600 mt-0.5">{item.sublabel}</span>
        </span>
      </a>
    </li>
  )
}

function MegaMenuDropdown({
  label,
  sections,
  isOpen,
  onToggle,
  alignRight,
  isAdmin,
}: {
  label: string
  sections: MegaMenuSection[]
  isOpen: boolean
  onToggle: () => void
  alignRight?: boolean
  isAdmin?: boolean
}) {
  // Filter out admin-only items/sections when user is not admin
  const visibleSections = sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => !item.adminOnly || isAdmin),
    }))
    .filter((section) => section.items.length > 0)

  // Group sections into columns (sections without a `column` each get their own column)
  const columns = new Map<number, MegaMenuSection[]>()
  visibleSections.forEach((section, index) => {
    const col = section.column ?? index
    if (!columns.has(col)) columns.set(col, [])
    columns.get(col)!.push(section)
  })
  const columnList = Array.from(columns.values())

  return (
    <div className="relative">
      <button
        type="button"
        className="focus_header flex items-center gap-1.5 font-bold text-base text-[#1A1A1A] hover:text-accent py-3 cursor-pointer rounded"
        onClick={onToggle}
      >
        <span className="label-item">{label}</span>
        <CaretDown rotate={isOpen} />
      </button>
      {isOpen && (
        <div className={`absolute top-full z-50 mt-0 mega-menu-dropdown ${alignRight ? 'right-0' : 'left-1/2 -translate-x-1/2'}`}>
          <div className="bg-white rounded-lg shadow-dropdown p-6 min-w-[40rem]">
            <div className={`grid ${columnList.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-x-12`}>
              {columnList.map((columnSections, colIndex) => (
                <div key={colIndex} className="flex flex-col gap-4">
                  {columnSections.map((section) => (
                    <div key={section.header}>
                      <span className="block text-xs font-bold uppercase text-brand-600 tracking-wide mb-2 px-3">
                        {section.header}
                      </span>
                      <ul>
                        {section.items.map((item) => (
                          <MegaMenuItemComponent key={item.title} item={item} />
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  User avatar dropdown (authenticated state)                         */
/* ------------------------------------------------------------------ */

function UserMenu({ user, onLogout, isOpen, onToggle }: { user: any; onLogout: () => void; isOpen: boolean; onToggle: () => void }) {
  const avatarSrc = user?.kick_data?.avatar_url || user?.avatar_url || user?.kick_avatar || undefined
  const avatarName = user?.nickname || user?.kick_username || user?.display_name || user?.nombre || user?.email || ''

  const menuItems = [
    { icon: PiUser, title: 'Mi Perfil', sublabel: 'Edita tu información personal.', href: '/perfil' },
  ]

  return (
    <div className="relative">
      <button
        type="button"
        className="focus_header flex items-center cursor-pointer rounded"
        onClick={onToggle}
      >
        {avatarSrc ? (
          <img
            src={avatarSrc}
            alt={avatarName}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <span className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-bold">
            {avatarName.charAt(0).toUpperCase()}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 z-50 mt-0 mega-menu-dropdown-right">
          <div className="bg-white rounded-lg shadow-dropdown p-6 min-w-[20rem]">
            {/* Header row: avatar + name + points */}
            <div className="flex items-center gap-4 pb-4 mb-2 border-b border-border">
              {avatarSrc ? (
                <img src={avatarSrc} alt={avatarName} className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <span className="w-12 h-12 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-lg font-bold">
                  {avatarName.charAt(0).toUpperCase()}
                </span>
              )}
              <div className="flex flex-col">
                <span className="font-bold text-base text-[#1A1A1A] truncate">{avatarName}</span>
                {user?.puntos != null && (
                  <span className="text-sm text-brand-400 font-semibold mt-0.5">
                    {user.puntos.toLocaleString()} <span className="text-[10px] font-bold tracking-wider">PTS</span>
                  </span>
                )}
              </div>
            </div>
            {/* Menu items */}
            <div className="flex flex-col">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.title}
                    href={item.href}
                    className="group flex items-start gap-4 py-3 px-3 rounded-lg hover:bg-brand-50/60 transition-colors duration-200 cursor-pointer"
                  >
                    <span className="flex items-center justify-center w-5 h-5 shrink-0 text-[#1A1A1A] mt-0.5 group-hover:text-accent transition-colors duration-200">
                      <Icon style={{ width: '20px', height: '20px' }} />
                    </span>
                    <span className="flex flex-col">
                      <span className="font-normal text-sm text-[#1A1A1A] group-hover:text-accent transition-colors duration-200">
                        {item.title}
                      </span>
                      <span className="text-xs text-brand-600 mt-0.5">{item.sublabel}</span>
                    </span>
                  </a>
                )
              })}
            </div>
            {/* Logout */}
            <div className="border-t border-border mt-2 pt-3">
              <button
                type="button"
                onClick={onLogout}
                className="group flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-red-50 transition-colors duration-200 w-full"
              >
                <span className="flex items-center justify-center w-5 h-5 shrink-0 text-red-500 mt-0.5">
                  <PiSignOut style={{ width: '20px', height: '20px' }} />
                </span>
                <span className="text-sm text-red-500 font-semibold">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main header                                                        */
/* ------------------------------------------------------------------ */

export default function Header() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [puntosOpen, setPuntosOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)

  const isAdmin = !!(user?.rol_id && [3, 4, 5].includes(user.rol_id))

  const anyMenuOpen = puntosOpen || profileOpen

  useEffect(() => {
    if (!anyMenuOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setPuntosOpen(false)
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [anyMenuOpen])

  // Only one menu can be open at a time
  const togglePuntos = () => {
    setProfileOpen(false)
    setPuntosOpen(!puntosOpen)
  }
  const toggleProfile = () => {
    setPuntosOpen(false)
    setProfileOpen(!profileOpen)
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <header ref={headerRef} className="v2-header sticky top-0 z-30 bg-white/70 backdrop-blur-md font-sans">
      {/* Animated watercolor circles background */}
      <div className="absolute inset-0 z-0 pointer-events-none aquarela-bg overflow-hidden">
        <span className="aquarela-circle aquarela-c1" />
        <span className="aquarela-circle aquarela-c2" />
        <span className="aquarela-circle aquarela-c3" />
        <span className="aquarela-circle aquarela-c4" />
        <span className="aquarela-circle aquarela-c5" />
      </div>

      {/* Grayout overlay behind open mega-menus */}
      {anyMenuOpen && (
        <div className="fixed inset-0 top-[72px] bg-black/5 z-20 mega-menu-overlay" />
      )}

      {/* Primary nav row */}
      <div className="relative z-30">
        <div className="flex items-center justify-between px-8 lg:px-40 h-[72px]">
          {/* Left group: logo + nav items */}
          <div className="flex items-center gap-0 lg:gap-14">
            {/* Logo */}
            <Link href="/landing-v2" className="flex items-center cursor-pointer shrink-0">
              <span className="hidden lg:inline text-2xl font-extrabold text-[#1A1A1A] tracking-tight">Luisardito</span>
              <span className="lg:hidden text-2xl font-extrabold text-[#1A1A1A]">L</span>
            </Link>

            {/* Nav items — hidden on mobile */}
            <div className="hidden lg:flex items-center gap-6">
              <MegaMenuDropdown
                label="Puntos"
                sections={PUNTOS_MENU}
                isOpen={puntosOpen}
                onToggle={togglePuntos}
                isAdmin={isAdmin}
              />
            </div>
          </div>

          {/* Right group: auth */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Auth */}
            {isLoading ? null : isAuthenticated && user ? (
              <>
                {user.puntos != null && (
                  <span className="flex flex-col items-end leading-none whitespace-nowrap">
                    <span className="font-extrabold text-base text-[#1A1A1A]">{user.puntos.toLocaleString()}</span>
                    <span className="text-[9px] font-bold text-brand-400 tracking-wider mt-0.5">PTS</span>
                  </span>
                )}
                <UserMenu user={user} onLogout={handleLogout} isOpen={profileOpen} onToggle={toggleProfile} />
              </>
            ) : (
              <Link
                href="/login"
                className="focus_header font-bold text-base text-[#1A1A1A] hover:text-accent cursor-pointer transition-colors duration-200 rounded"
              >
                Iniciar sesión
              </Link>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden ml-2 p-2"
            aria-label="menu"
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#1A1A1A]">
              <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-border px-4 py-4 flex flex-col gap-4">
          {PUNTOS_MENU.map((section) => {
            const visibleItems = section.items.filter((item) => !item.adminOnly || isAdmin)
            if (visibleItems.length === 0) return null
            return (
              <div key={section.header} className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase text-brand-600">{section.header}</span>
                {visibleItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <a key={item.title} href={item.href} className="flex items-center gap-2 text-sm text-[#1A1A1A] hover:text-accent pl-3">
                      <Icon style={{ width: '16px', height: '16px' }} />
                      {item.title}
                    </a>
                  )
                })}
              </div>
            )
          })}
          <div className="flex flex-col gap-2 border-t border-border pt-4">
            {isAuthenticated && user ? (
              <>
                <a href="/perfil" className="font-bold text-[#1A1A1A]">Mi Perfil</a>
                <a href="/historial" className="font-bold text-[#1A1A1A]">Historial</a>
                <a href="/canjes" className="font-bold text-[#1A1A1A]">Mis Canjes</a>
                <button type="button" onClick={handleLogout} className="text-left text-red-500 font-bold">Cerrar Sesión</button>
              </>
            ) : (
              <a href="/login" className="font-bold text-[#1A1A1A]">Iniciar sesión</a>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
