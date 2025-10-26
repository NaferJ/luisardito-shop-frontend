import { ReactNode } from 'react'
import { Box, Container } from '@chakra-ui/react'
import Navbar from './Navbar'
import Footer from './Footer'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <Box minH="100vh" bg="bg.canvas" display="flex" flexDir="column">
      <Navbar />
      <Container maxW="6xl" px={4} pt={20} pb={8} flex="1">
        {children}
      </Container>
      <Footer />
    </Box>
  )
}
