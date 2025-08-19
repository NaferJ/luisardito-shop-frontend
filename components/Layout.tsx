import { ReactNode } from 'react'
import { Box } from '@chakra-ui/react'
import { Navbar } from './Navbar'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <Box minH="100vh" bg="gray.50">
      <Navbar />
      <Box p={8}>
        {children}
      </Box>
    </Box>
  )
}
