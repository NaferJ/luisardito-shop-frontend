import dynamic from 'next/dynamic'

const NavbarContent = dynamic(() => import('./NavbarContent'), {
  ssr: false,
  loading: () => <div style={{ height: '80px' }} /> // Placeholder mientras carga
})

export default function Navbar() {
  return <NavbarContent />
}

