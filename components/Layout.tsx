import { ReactNode } from 'react'
import { Box, Container } from '@chakra-ui/react'
import dynamic from 'next/dynamic'

// Render Navbar only on the client to avoid SSR/CSR auth state mismatches
const NavbarClient = dynamic(() => import('./Navbar').then(m => m.Navbar), { ssr: false })

export function Layout({ children }: { children: ReactNode }) {
  return (
    <Box minH="100vh" bg="bg.canvas">
      <NavbarClient />
      <Container maxW="6xl" px={4} py={8}>
        {children}
      </Container>
    </Box>
  )
}
