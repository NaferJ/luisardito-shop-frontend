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
import { Layout } from '../components/Layout'

export default function Landing() {
  return (
    <>
      <Head>
        <title>Luisardito Shop - Tienda de Rewards</title>
        <meta name="description" content="Canjea tus puntos por increíbles premios" />
      </Head>

      <Layout>
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
          label="Leaderboard"
          title="Compite y sigue tu posición en la comunidad"
          description="Visualiza el leaderboard en tiempo real para ver tu posición respecto a otros usuarios. Sigue tu progreso, compite amistosamente y descubre quiénes son los miembros más activos de la comunidad."
          imagePosition="left"
        />
        <ContentSection
          id="realtime"
          label="Historial de Canjes"
          title="Sigue el estado de tus canjes en tiempo real"
          description="Accede a tu historial completo de canjes y sigue el estado de cada uno. Desde que realizas el canje hasta que llega a tu puerta, tienes toda la información en un solo lugar. Transparencia total sobre tus transacciones."
          imagePosition="right"
          showList
        />
        <FAQSection />
      </Layout>
    </>
  )
}

