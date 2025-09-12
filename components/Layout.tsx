import { ReactNode } from 'react'
import { Box, Container } from '@chakra-ui/react'
import { Navbar } from './Navbar'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <Box minH="100vh" bg="bg.canvas">
      <Navbar />
      <Container maxW="6xl" px={4} py={8}>
        {children}
      </Container>
    </Box>
  )
}
