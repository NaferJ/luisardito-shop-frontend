import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Icon,
  Badge,
  VStack,
  HStack,
  Divider,
  Circle,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Button,
  Center
} from '@chakra-ui/react'
import { 
  MdRocketLaunch, 
  MdLeaderboard, 
  MdSecurity, 
  MdBolt,
  MdCheckCircle,
  MdEmojiEvents,
  MdPayments,
  MdTimeline,
  MdStars
} from 'react-icons/md'
import { useColorModeValue } from '@chakra-ui/react'
import Head from 'next/head'
import Link from 'next/link'
import { Layout } from '../components/Layout'

/**
 * Visual Abstracto: Profile/History Center
 */
const HistoryVisual = () => {
  const bg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('rgba(0,0,0,0.04)', 'rgba(255,255,255,0.06)')
  const shadow = useColorModeValue('0 20px 40px -10px rgba(0,0,0,0.08)', '0 30px 60px -12px rgba(0,0,0,0.5)')
  
  return (
    <Box position="relative" w="full" py={10}>
      <VStack 
        spacing={5} 
        align="stretch" 
        bg={bg} 
        p={7} 
        borderRadius="3xl" 
        boxShadow={shadow} 
        border="1px solid" 
        borderColor={borderColor}
        backdropFilter="blur(10px)"
      >
        <VStack align="start" spacing={0}>
          <Text fontSize="10px" fontWeight="black" color="gray.400" textTransform="uppercase">Balance Actual</Text>
          <Text fontSize="2xl" fontWeight="900" color="orange.400">12,450 <Text as="span" fontSize="xs">PTS</Text></Text>
        </VStack>
        <Divider opacity={0.5} />
        {[
          { label: 'Tarjeta Regalo $10', pts: '-1000', color: 'blue' },
          { label: 'Suscripción VIP', pts: '-2500', color: 'purple' },
          { label: 'Emote Personalizado', pts: '-500', color: 'pink' }
        ].map((item, i) => (
          <HStack key={i} spacing={4}>
            <Circle size="10" bg={`${item.color}.500`} color="white" boxShadow="lg"><MdPayments /></Circle>
            <VStack align="start" spacing={-1} flex={1}>
              <Text fontWeight="bold" fontSize="sm">{item.label}</Text>
              <Text fontSize="2xs" color="gray.500">Hace 2 días</Text>
            </VStack>
            <Text fontWeight="black" fontSize="sm" color="red.400">{item.pts}</Text>
          </HStack>
        ))}
      </VStack>
      {/* Decorative Glows */}
      <Box position="absolute" top="0" right="-20px" bg="blue.400" w="100px" h="100px" borderRadius="full" zIndex={-1} opacity={0.15} filter="blur(40px)" />
      <Box position="absolute" bottom="0" left="-20px" bg="orange.400" w="80px" h="80px" borderRadius="full" zIndex={-1} opacity={0.1} filter="blur(40px)" />
    </Box>
  )
}

/**
 * Visual Abstracto: Leaderboard Champions
 */
const LeaderboardVisual = () => {
  return (
    <Box position="relative" w="full" pt={12} pb={6}>
      <HStack align="flex-end" justify="center" spacing={4}>
        {/* Silver */}
        <VStack spacing={3}>
          <Circle size="12" bg="gray.200" border="4px solid white" boxShadow="xl" _dark={{ borderColor: 'gray.700' }}>
            <Text fontWeight="black" color="gray.600">2</Text>
          </Circle>
          <Box w="70px" h="100px" bgGradient="linear(to-t, gray.300, gray.100)" borderRadius="xl" boxShadow="inner" />
        </VStack>
        {/* Gold */}
        <VStack spacing={3} transform="translateY(-20px)">
          <Icon as={MdEmojiEvents} boxSize={8} color="yellow.400" filter="drop-shadow(0 0 12px rgba(236, 201, 75, 0.8))" />
          <Circle size="16" bg="yellow.400" border="4px solid white" boxShadow="2xl" _dark={{ borderColor: 'gray.700' }}>
             <Text fontWeight="black" color="white" fontSize="xl">1</Text>
          </Circle>
          <Box w="90px" h="140px" bgGradient="linear(to-t, yellow.500, yellow.200)" borderRadius="xl" boxShadow="inner" />
        </VStack>
        {/* Bronze */}
        <VStack spacing={3}>
          <Circle size="12" bg="orange.200" border="4px solid white" boxShadow="xl" _dark={{ borderColor: 'gray.700' }}>
            <Text fontWeight="black" color="orange.600">3</Text>
          </Circle>
          <Box w="70px" h="70px" bgGradient="linear(to-t, orange.400, orange.100)" borderRadius="xl" boxShadow="inner" />
        </VStack>
      </HStack>
      {/* Floating badges */}
      <Box position="absolute" top="10%" left="5%" transform="rotate(-15deg)" p={2} bg="white" borderRadius="lg" boxShadow="xl" _dark={{ bg: 'gray.800' }}>
        <HStack spacing={2}><Icon as={MdStars} color="blue.400"/><Text fontSize="xs" fontWeight="bold">MVP</Text></HStack>
      </Box>
    </Box>
  )
}

/**
 * Visual Abstracto: Realtime Status Tracker
 */
const StatusVisual = () => {
  const stepColor = useColorModeValue('blue.500', 'blue.400')
  return (
    <Box w="full" py={8}>
      <VStack spacing={6} align="stretch" bg={useColorModeValue('gray.50', 'whiteAlpha.50')} p={8} borderRadius="3xl" border="2px dashed" borderColor={useColorModeValue('gray.200', 'whiteAlpha.200')}>
        <HStack justify="space-between">
          <Text fontWeight="900" fontSize="sm">ORDEN #7892</Text>
          <Badge colorScheme="orange">En Proceso</Badge>
        </HStack>
        
        <HStack spacing={0} position="relative" h="2px" bg="gray.200" _dark={{ bg: 'whiteAlpha.200' }} my={6}>
          <Box position="absolute" left="0" w="65%" h="full" bg={stepColor} boxShadow="0 0 10px rgba(66, 153, 225, 0.5)" />
          {[0, 33, 66, 100].map((pos, i) => (
            <Circle 
              key={i} 
              position="absolute" 
              left={`${pos}%`} 
              transform="translateX(-50%)" 
              size="4" 
              bg={pos <= 66 ? stepColor : 'gray.300'} 
              border="2px solid white"
              _dark={{ borderColor: 'gray.800' }}
            />
          ))}
        </HStack>

        <VStack align="start" spacing={4}>
          <HStack spacing={3}>
            <Icon as={MdCheckCircle} color="green.400" />
            <Text fontSize="xs" fontWeight="bold">Canje Solicitado</Text>
          </HStack>
          <HStack spacing={3}>
            <Icon as={MdTimeline} color="blue.400" />
            <Text fontSize="xs" fontWeight="bold">Validando Puntos...</Text>
          </HStack>
          <HStack spacing={3} opacity={0.4}>
            <Icon as={MdBolt} />
            <Text fontSize="xs" fontWeight="bold">Entrega Final</Text>
          </HStack>
        </VStack>
      </VStack>
    </Box>
  )
}

export const HeroSection = () => {
  const handleScrollToPeople = () => {
    const element = document.getElementById('people');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Box position="relative" pt={{ base: "140px", md: "100px" }} pb={{ base: "100px", md: "160px" }} overflow="hidden">
      
      <Container maxW="container.lg">
        <VStack spacing={10} textAlign="center">
          <HStack bg={useColorModeValue('blue.50', 'whiteAlpha.100')} px={4} py={1.5} borderRadius="full" border="1px solid" borderColor="blue.100" _dark={{ borderColor: 'whiteAlpha.200' }}>
            <Icon as={MdStars} color="blue.500" />
            <Text fontSize="xs" fontWeight="900" letterSpacing="1px" color="blue.500" textTransform="uppercase">Comunidad de Luisardito</Text>
          </HStack>
          
          <Heading as="h1" fontSize={{ base: "5xl", md: "8xl" }} fontWeight="900" lineHeight="0.9" letterSpacing="-4px">
            Gana. Canjea.<br />
            <Text as="span" bgGradient="linear(to-br, blue.400, orange.400)" bgClip="text" filter="drop-shadow(0 0 20px rgba(66, 153, 225, 0.3))">
              Disfruta.
            </Text>
          </Heading>

          <Text fontSize={{ base: "lg", md: "2xl" }} color="gray.500" maxW="2xl" fontWeight="600" lineHeight="tall">
            La plataforma de rewards más rápida para streamers. Transforma tu tiempo en premios increíbles sin complicaciones.
          </Text>

          <HStack spacing={4} pt={4}>
            <Link href="/productos">
              <Button size="xl" colorScheme="blue" borderRadius="2xl" px={12} h="64px" fontSize="md" fontWeight="900" boxShadow="0 20px 40px -10px rgba(66, 153, 225, 0.4)" _hover={{ transform: 'translateY(-2px) scale(1.02)' }}>
                IR A LA TIENDA
              </Button>
            </Link>
            <Button onClick={handleScrollToPeople} size="xl" variant="ghost" borderRadius="2xl" px={8} h="64px" fontSize="md" fontWeight="800">
              SABER MÁS
            </Button>
          </HStack>

          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={12} pt={24} w="full">
            <StatItem icon={MdRocketLaunch} label="CANJES INSTANTÁNEOS" />
            <StatItem icon={MdSecurity} label="SEGURIDAD TOTAL" />
            <StatItem icon={MdLeaderboard} label="TOP RANKING" />
            <StatItem icon={MdCheckCircle} label="API OFICIAL" />
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  )
}

const StatItem = ({ icon, label }: { icon: React.ElementType; label: string }) => (
  <VStack spacing={4}>
    <Center boxSize="14" borderRadius="2xl" bg={useColorModeValue('white', 'whiteAlpha.100')} boxShadow="xl" border="1px solid" borderColor={useColorModeValue('gray.100', 'whiteAlpha.100')}>
      <Icon as={icon} boxSize={6} color="blue.500" />
    </Center>
    <Text fontSize="10px" fontWeight="black" textTransform="uppercase" letterSpacing="2px" color="gray.400">{label}</Text>
  </VStack>
)

export const ContentSection = ({ id, label, title, description, imagePosition, visualType, link }: { id: string; label: string; title: string; description: string; imagePosition: string; visualType: string; link: string }) => {
  const isLeft = imagePosition === 'left'
  
  return (
    <Box py={{ base: 20, md: 40 }} id={id} position="relative">
      <Container maxW="container.lg">
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 16, md: 32 }} alignItems="center">
          <VStack align="start" spacing={8} order={{ base: 2, md: isLeft ? 2 : 1 }}>
            <Badge colorScheme="orange" variant="subtle" px={4} py={1} borderRadius="lg" fontSize="xs" fontWeight="black">{label}</Badge>
            <Heading fontSize={{ base: "4xl", md: "6xl" }} fontWeight="900" letterSpacing="-2px" lineHeight="1">{title}</Heading>
            <Text fontSize="xl" color="gray.500" lineHeight="1.6" fontWeight="medium">{description}</Text>
            <Link href={link}>
              <Button variant="outline" size="lg" colorScheme="blue" borderRadius="xl" px={8} fontWeight="900" border="2px solid">
                EXPLORAR AHORA
              </Button>
            </Link>
          </VStack>
          
          <Center order={{ base: 1, md: isLeft ? 1 : 2 }} position="relative">
             <Box position="absolute" inset="-20%" bg="blue.500" borderRadius="full" opacity={0.05} filter="blur(60px)" />
            {visualType === 'history' && <HistoryVisual />}
            {visualType === 'leaderboard' && <LeaderboardVisual />}
            {visualType === 'realtime' && <StatusVisual />}
          </Center>
        </SimpleGrid>
      </Container>
    </Box>
  )
}

export const FAQSection = () => {
  return (
    <Box py={32} bg={useColorModeValue('white', 'gray.950')} borderTop="1px solid" borderColor={useColorModeValue('gray.100', 'whiteAlpha.100')}>
      <Container maxW="container.md">
        <VStack spacing={16}>
          <VStack spacing={4} textAlign="center">
            <Text color="blue.500" fontWeight="900" fontSize="xs" letterSpacing="3px">CENTRO DE AYUDA</Text>
            <Heading fontSize="5xl" fontWeight="900" letterSpacing="-2px">¿Tienes dudas?</Heading>
          </VStack>
          
          <Accordion allowToggle w="full">
            <FAQItem 
              title="¿Cómo obtengo puntos?" 
              content="Es automático. Al ver el stream de Luisardito en Kick y participar en el chat, tus puntos se acumulan en tiempo real por watch time y actividad. ¡Asegúrate de haber iniciado sesión aquí!" 
            />
            <FAQItem 
              title="¿Los canjes son reales?" 
              content="Sí, todos los canjes son reales. Contamos con un sistema de validación manual para premios físicos y automático para digitales, respaldado por cientos de testimonios de usuarios satisfechos." 
            />
            <FAQItem 
              title="¿Cómo funciona el Leaderboard?" 
              content="El leaderboard se actualiza en tiempo real y muestra la clasificación de usuarios por puntos acumulados." 
            />
          </Accordion>
        </VStack>
      </Container>
    </Box>
  )
}

const FAQItem = ({ title, content }: { title: string; content: string }) => (
  <AccordionItem borderRadius="2xl" mb={4} border="none" bg={useColorModeValue('gray.50', 'whiteAlpha.50')} _hover={{ boxShadow: 'md', borderRadius: '2xl' }} transition="all 0.2s">
    <AccordionButton p={7} _hover={{ bg: 'blue.50', _dark: { bg: 'whiteAlpha.100' } }} transition="all 0.2s">
      <Text fontWeight="800" flex="1" textAlign="left" fontSize="lg">{title}</Text>
      <AccordionIcon />
    </AccordionButton>
    <AccordionPanel p={7} pt={0} color="gray.500" fontSize="md" fontWeight="medium">
      {content}
    </AccordionPanel>
  </AccordionItem>
)

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
          visualType="history"
          link="/historial"
        />
        <ContentSection
          id="performance"
          label="Leaderboard"
          title="Compite y sigue tu posición en la comunidad"
          description="Visualiza el leaderboard en tiempo real para ver tu posición respecto a otros usuarios. Sigue tu progreso, compite amistosamente y descubre quiénes son los miembros más activos de la comunidad."
          imagePosition="left"
          visualType="leaderboard"
          link="/leaderboard"
        />
        <ContentSection
          id="realtime"
          label="Historial de Canjes"
          title="Sigue el estado de tus canjes en tiempo real"
          description="Accede a tu historial completo de canjes y sigue el estado de cada uno. Desde que realizas el canje hasta que llega a tu puerta, tienes toda la información en un solo lugar. Transparencia total sobre tus transacciones."
          imagePosition="right"
          visualType="realtime"
          link="/canjes"
        />
        <FAQSection />
      </Layout>
    </>
  )
}

