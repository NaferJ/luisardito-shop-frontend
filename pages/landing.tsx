import { Box, useColorModeValue } from '@chakra-ui/react'
import Head from 'next/head'
import {
  HeroSection,
  ContentSection,
  FAQSection,
  loremContent
} from '../components/LandingPage'
import Navbar from '../components/Navbar'
import { Footer } from '../components/Footer'

export default function Landing() {
  const bgColor = useColorModeValue('white', 'gray.950')
  const textColor = useColorModeValue('gray.800', 'gray.50')

  return (
    <>
      <Head>
        <title>Luisardito Shop - Tienda de Rewards</title>
        <meta name="description" content="Canjea tus puntos por increíbles premios" />
      </Head>

      <Box bg={bgColor} color={textColor} minH="100vh" suppressHydrationWarning>
        <Navbar />
        <HeroSection />
        <ContentSection
          id="people"
          label="Tu Historial"
          title="Visualiza todos tus canjes y puntos disponibles"
          description="Accede a tu perfil personalizado donde puedes ver tu historial completo de canjes, puntos acumulados, nivel de usuario y beneficios exclusivos. Todo organizado en un lugar seguro y fácil de navegar."
          imagePosition="right"
        />
        <ContentSection
          id="performance"
          label="Estadísticas"
          title="Visualiza en tiempo real qué productos son los favoritos"
          description="Accede a dashboards completos con estadísticas sobre los canjes más populares, tendencias del catálogo, productos agotados y disponibles. Información valiosa para tomar las mejores decisiones sobre qué canjear."
          imagePosition="left"
        />
        <ContentSection
          id="realtime"
          label="En Tiempo Real"
          title="Observa cada canje que se realiza en la plataforma"
          description="Sigue en vivo todas las transacciones de la comunidad. Visualiza qué premios están siendo canjeados, quiénes están celebrando sus canjes y mantente conectado con la actividad del ecosistema."
          imagePosition="right"
          showList
        />
        <FAQSection />
        <Footer />
      </Box>
    </>
  )
}

