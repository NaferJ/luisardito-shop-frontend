import { ReactNode } from 'react'
import { Box, Container } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import Footer from './Footer'

const NavbarClient = dynamic(() => import('./Navbar').then(m => m.Navbar), { ssr: false })

export function Layout({ children }: { children: ReactNode }) {
  return (
    <Box minH="100vh" bg="bg.canvas" display="flex" flexDir="column">
      <NavbarClient />
      <Container maxW="6xl" px={4} pt={20} pb={8} flex="1">
        {children}
      </Container>
      <Footer />
    </Box>
  )
}
