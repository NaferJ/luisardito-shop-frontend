import { ReactNode, useState, useEffect } from 'react'
import { Box, Container, useColorModeValue } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import Footer from './Footer'
// @ts-expect-error ColorThief no tiene tipos definidos
import ColorThief from 'colorthief'

// Import dinámico sin SSR para evitar problemas de hidratación
const Navbar = dynamic(() => import('./Navbar'), {
  ssr: false
})

interface LayoutProps {
  children: ReactNode
  productImageUrl?: string
}

export function Layout({ children, productImageUrl }: LayoutProps) {
  const [dominantColor, setDominantColor] = useState<number[] | null>(null)

  // Colores adaptados según el tema
  const defaultBgGradient = useColorModeValue(
    "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99, 102, 241, 0.35), rgba(129, 140, 248, 0.15) 40%, transparent 70%), #ffffff",
    "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99, 102, 241, 0.25), transparent 70%), #0d1117"
  )
  const defaultBgColor = useColorModeValue('white', 'brand.900')

  // Extraer color dominante de la imagen del producto (misma lógica que ProductCard)
  useEffect(() => {
    if (!productImageUrl) {
      setDominantColor(null)
      return
    }

    const img = document.createElement('img')
    img.crossOrigin = 'anonymous'
    img.src = productImageUrl
    img.onload = () => {
      try {
        const colorThief = new ColorThief()
        const palette = colorThief.getPalette(img, 3)
        // Usar el primer color dominante, igual que ProductCard usa para bordes
        setDominantColor(palette[0])
      } catch (error) {
        console.error('Error extracting colors:', error)
      }
    }
  }, [productImageUrl])

  // Generar gradiente con el color dominante o usar el default
  const productBgGradient = dominantColor
    ? `radial-gradient(ellipse 100% 80% at 50% 0%, rgba(${dominantColor.join(',')}, ${useColorModeValue('0.55', '0.45')}), rgba(${dominantColor.join(',')}, ${useColorModeValue('0.3', '0.2')}) 50%, transparent 80%), ${useColorModeValue('#ffffff', '#0d1117')}`
    : defaultBgGradient
  const bgGradient = dominantColor ? productBgGradient : defaultBgGradient
  const bgColor = dominantColor ? useColorModeValue('white', 'brand.900') : defaultBgColor

  return (
    <Box
      minH="100vh"
      bg={bgColor}
      display="flex"
      flexDir="column"
      position="relative"
    >
      {/* Indigo Cosmos Background with Top Glow */}
      <Box
        position="absolute"
        inset={0}
        zIndex={0}
        style={{
          background: bgGradient,
        }}
      />
      {/* Content on top of background */}
      <Box position="relative" zIndex={1} display="flex" flexDir="column" minH="100vh">
        <Navbar />
        <Container maxW="6xl" px={4} pt={{ base: 20, md: 16 }} pb={8} flex="1">
          {children}
        </Container>
        <Footer />
      </Box>
    </Box>
  )
}
