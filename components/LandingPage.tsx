import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Flex,
  Grid,
  GridItem,
  VStack,
  HStack,
  Link as ChakraLink,
  useColorModeValue,
  Divider,
  Icon,
  SimpleGrid,
  Progress
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { useState, useEffect } from 'react'
import { FaCheck } from 'react-icons/fa'
import {
  MdHistory,
  MdLeaderboard,
  MdShoppingCart,
  MdTrendingUp,
  MdVerified,
  MdSecurity,
  MdStar,
  MdCardGiftcard,
  MdLocalOffer,
  MdVpnKey,
  MdGift,
  MdThumbUp
} from 'react-icons/md'

// Real content for Luisardito Shop
export const loremContent = {
  short: 'La plataforma oficial de recompensas de Luisardito.',
  medium: 'Gana puntos de lealtad escribiendo en el chat, regalando suscripciones, regalando KICKS y participando en streams. Canjea tus puntos por productos exclusivos, accesos VIP y mucho más. Todo en una plataforma segura y transparente.',
  long: 'Luisardito Shop es tu tienda oficial de recompensas. Cada punto que ganas contabiliza hacia productos exclusivos, pases VIP, accesos prioritarios y sorpresas especiales. Tu actividad en la comunidad se recompensa de forma justa y directa.',
  longList: [
    'Gana puntos escribiendo en chat, regalando suscripciones, regalando KICKS y siendo parte activa de la comunidad.',
    'Catálogo exclusivo con merchandising oficial, accesos VIP y experiencias de comunidad.',
    'Historial completo y transparente de tu actividad y canjes personales.',
  ]
}

export const featuresList = [
  { title: 'Puntos Verificados', description: 'Cada punto que ganas es contabilizado de forma real y verificada. Tu historial muestra exactamente cómo ganaste cada punto.' },
  { title: 'Canjes Personales', description: 'Canjea tus puntos cuando quieras y sigue el estado de tu pedido en tu historial de canjes.' },
  { title: 'Seguridad Total', description: 'Tu cuenta, tus puntos y tu información personal están completamente protegidos.' }
]

export const faqItems = [
  { question: '¿Cómo gano puntos?', answer: 'Ganas puntos de lealtad escribiendo en el chat durante los streams de Luisardito. También ganas puntos regalando suscripciones, regalando KICKS y siendo parte activa de la comunidad. Cada acción tiene un valor de puntos definido.' },
  { question: '¿Qué puedo canjear?', answer: 'Puedes canjear merchandising oficial, accesos VIP prioritarios, emojis exclusivos y otras recompensas especiales. El catálogo se actualiza regularmente con nuevos productos, cada uno con su valor en puntos.' },
  { question: '¿Cómo veo mi historial?', answer: 'En tu perfil personal puedes ver tu historial completo de puntos ganados y canjes realizados. Accede a la sección "Historial" para ver toda tu actividad y estado actual de puntos.' },
  { question: '¿Cuándo me llega mi canje?', answer: 'El tiempo depende del tipo de producto. Merchandising físico puede tomar hasta 30 días para procesarse y enviarse. Accesos digitales se activan de forma inmediata. Puedes seguir el estado en tu historial.' },
  { question: '¿Puedo ver lo que otros canjearon?', answer: 'Tu historial es personal y privado. Solo tú ves tus canjes y actividad. Sí puedes ver el leaderboard de usuarios para comparar tu posición en la comunidad.' },
  { question: '¿Es seguro canjear aquí?', answer: 'Completamente. Tus puntos, información personal y datos de canje están completamente protegidos. Tu actividad es verificable y transparente en tu historial personal.' },
]


// ===================== Hero Section =====================
export function HeroSection() {
  const borderColor = useColorModeValue('gray.200', 'gray.800')
  const textColor = useColorModeValue('gray.800', 'gray.50')
  const mutedColor = useColorModeValue('gray.600', 'gray.300')
  const sectionBg = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.900')
  const buttonBg = useColorModeValue('rgb(59, 130, 246)', 'rgb(96, 165, 250)')
  const buttonHoverBg = useColorModeValue('rgb(37, 99, 235)', 'rgb(56, 189, 248)')
  const accentColor = useColorModeValue('rgb(59, 130, 246)', 'rgb(96, 165, 250)')
  const [animateCards, setAnimateCards] = useState(false)

  useEffect(() => {
    setAnimateCards(true)
  }, [])

  const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <Box
      p={4}
      bg={cardBg}
      borderRadius="lg"
      border={`1px solid ${borderColor}`}
      opacity={animateCards ? 1 : 0}
      transform={animateCards ? 'translateY(0)' : 'translateY(20px)'}
      transition="all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)"
      _hover={{
        transform: 'translateY(-8px)',
        borderColor: accentColor,
        boxShadow: `0 12px 24px rgba(59, 130, 246, 0.15)`
      }}
    >
      <HStack spacing={3}>
        <Icon boxSize={5} color={accentColor} />
        <VStack align="start" spacing={0}>
          <Text fontSize="xs" color={mutedColor}>{label}</Text>
          <Text fontSize="lg" fontWeight="bold">{value}</Text>
        </VStack>
      </HStack>
    </Box>
  )

  const DashboardAnimation = () => {
    const [displayValue, setDisplayValue] = useState(0)

    useEffect(() => {
      if (!animateCards) return
      const timer = setTimeout(() => {
        const interval = setInterval(() => {
          setDisplayValue((prev) => {
            if (prev >= 8450) return 8450
            return prev + 100
          })
        }, 20)
        return () => clearInterval(interval)
      }, 300)
      return () => clearTimeout(timer)
    }, [animateCards])

    const products = [
      { name: 'VIP Mensual', price: 500, icon: MdCardGiftcard },
      { name: 'Merchandising', price: 1000, icon: MdLocalOffer },
      { name: 'Premium', price: 750, icon: MdVpnKey }
    ]

    return (
      <Box
        borderRadius="2xl"
        border={`2px solid ${borderColor}`}
        bg={sectionBg}
        p={6}
        display="flex"
        flexDir="column"
        gap={4}
        opacity={animateCards ? 1 : 0}
        transform={animateCards ? 'scale(1)' : 'scale(0.95)'}
        transition="all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)"
        position="relative"
        overflow="hidden"
        sx={{
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(45deg, rgba(59, 130, 246, 0.05), rgba(147, 197, 253, 0.05), rgba(59, 130, 246, 0.05))',
            filter: 'blur(10px)',
            zIndex: -1,
            pointerEvents: 'none'
          }
        }}
      >
        <Text fontSize="sm" fontWeight="bold">Catálogo de tienda</Text>

        <SimpleGrid columns={2} gap={3}>
          {products.map((product, idx) => (
            <Box
              key={idx}
              p={3}
              bg={cardBg}
              borderRadius="lg"
              border={`1px solid ${borderColor}`}
              opacity={animateCards ? 1 : 0}
              transform={animateCards ? 'scale(1)' : 'scale(0.9)'}
              transition={`all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${idx * 0.1}s`}
              cursor="pointer"
              _hover={{
                transform: 'scale(1.08)',
                borderColor: accentColor,
                boxShadow: `0 12px 24px rgba(59, 130, 246, 0.2)`
              }}
              textAlign="center"
            >
              <Icon as={product.icon} boxSize={8} color={accentColor} mb={2} />
              <Text fontSize="10px" fontWeight="bold" mb={1}>{product.name}</Text>
              <Text fontSize="10px" color={mutedColor}>{product.price} pts</Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    )
  }

  return (
    <Box borderBottom={`1px solid ${borderColor}`} suppressHydrationWarning>
      <Container maxW="6xl" py={16} px={4}>
        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={10} mb={10} mt={10}>
          {/* Left side */}
          <VStack align="start" justify="center" spacing={6}>
            <Text
              fontSize="xs"
              fontWeight="bold"
              letterSpacing="0.25em"
              color={accentColor}
              textTransform="uppercase"
              opacity={animateCards ? 1 : 0}
              transform={animateCards ? 'translateX(0)' : 'translateX(-20px)'}
              transition="all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)"
            >
              Tu tienda de recompensas oficial
            </Text>

            <Heading
              as="h1"
              fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
              fontWeight="bold"
              lineHeight="tight"
              opacity={animateCards ? 1 : 0}
              transform={animateCards ? 'translateX(0)' : 'translateX(-20px)'}
              transition="all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)"
            >
              Canjea tus puntos por premios exclusivos
            </Heading>

            <Text
              fontSize={{ base: 'sm', md: 'base' }}
              color={mutedColor}
              lineHeight="relaxed"
              opacity={animateCards ? 1 : 0}
              transform={animateCards ? 'translateX(0)' : 'translateX(-20px)'}
              transition="all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)"
            >
              {loremContent.medium}
            </Text>

            <HStack
              spacing={3}
              flexWrap="wrap"
              opacity={animateCards ? 1 : 0}
              transform={animateCards ? 'translateX(0)' : 'translateX(-20px)'}
              transition="all 0.9s cubic-bezier(0.34, 1.56, 0.64, 1)"
            >
              <NextLink href="/login">
                <Button
                  size="md"
                  borderRadius="full"
                  bg={buttonBg}
                  color="white"
                  fontWeight="bold"
                  _hover={{
                    bg: buttonHoverBg,
                    transform: 'translateY(-2px)',
                    boxShadow: '0 10px 20px rgba(59, 130, 246, 0.3)'
                  }}
                  transition="all 0.2s"
                >
                  Comenzar ahora
                </Button>
              </NextLink>
            </HStack>
          </VStack>

          {/* Right side - Animated dashboard */}
          <DashboardAnimation />
        </Grid>

        {/* Quick features grid below hero */}
        <Divider borderColor={borderColor} my={10} />

        <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
          {featuresList.map((feature, idx) => (
            <VStack
              key={idx}
              align="start"
              spacing={1}
              opacity={animateCards ? 1 : 0}
              transform={animateCards ? 'translateY(0)' : 'translateY(20px)'}
              transition={`all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${idx * 0.1}s`}
              _hover={{
                transform: 'translateY(-4px)'
              }}
            >
              <Heading as="h3" fontSize="sm" fontWeight="medium">
                {feature.title}
              </Heading>
              <Text fontSize="sm" color={mutedColor}>
                {feature.description}
              </Text>
            </VStack>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  )
}

// ===================== Content Section Component =====================
export function ContentSection({
  id,
  label,
  title,
  description,
  imagePosition = 'right',
  showList = false,
  listItems = loremContent.longList
}: {
  id?: string
  label: string
  title: string
  description: string
  imagePosition?: 'left' | 'right'
  showList?: boolean
  listItems?: string[]
}) {
  const borderColor = useColorModeValue('gray.200', 'gray.800')
  const mutedColor = useColorModeValue('gray.600', 'gray.300')
  const labelColor = useColorModeValue('rgb(59, 130, 246)', 'rgb(96, 165, 250)')
  const sectionBg = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.900')
  const accentColor = useColorModeValue('rgb(59, 130, 246)', 'rgb(96, 165, 250)')

  // Componente para historial de puntos
  const HistorialVisualizacion = () => {
    const [animatedValue, setAnimatedValue] = useState(0)
    const [displayPoints, setDisplayPoints] = useState(0)

    useEffect(() => {
      const timer = setTimeout(() => setAnimatedValue(85), 500)
      return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
      if (animatedValue === 0) return
      const interval = setInterval(() => {
        setDisplayPoints((prev) => {
          if (prev >= 4250) return 4250
          return prev + 50
        })
      }, 10)
      return () => clearInterval(interval)
    }, [animatedValue])

    return (
      <Box
        borderRadius="2xl"
        border={`2px solid ${borderColor}`}
        bg={sectionBg}
        p={8}
        display="flex"
        flexDir="column"
        align="center"
        justify="center"
        gap={6}
        opacity={animatedValue ? 1 : 0}
        transform={animatedValue ? 'scale(1)' : 'scale(0.95)'}
        transition="all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)"
      >
        <VStack spacing={4} w="100%">
          <HStack
            spacing={3}
            w="100%"
            p={4}
            bg={cardBg}
            borderRadius="lg"
            borderLeft={`4px solid ${accentColor}`}
            opacity={animatedValue ? 1 : 0}
            transform={animatedValue ? 'translateX(0)' : 'translateX(-20px)'}
            transition="all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)"
            suppressHydrationWarning
          >
            <Icon as={MdHistory} boxSize={6} color={accentColor} />
            <VStack align="start" spacing={1} flex={1}>
              <Text fontSize="sm" fontWeight="bold">Puntos disponibles</Text>
              <Text fontSize="2xl" fontWeight="bold" suppressHydrationWarning>{displayPoints.toLocaleString()}</Text>
            </VStack>
          </HStack>

          <Box
            w="100%"
            p={4}
            bg={cardBg}
            borderRadius="lg"
            opacity={animatedValue ? 1 : 0}
            transform={animatedValue ? 'translateX(0)' : 'translateX(20px)'}
            transition="all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)"
          >
            <HStack justify="space-between" mb={2}>
              <Text fontSize="xs" mb={2} fontWeight="medium">Progreso semanal</Text>
              <Text fontSize="sm" fontWeight="bold">{animatedValue}%</Text>
            </HStack>
            <Progress
              value={animatedValue}
              colorScheme="blue"
              borderRadius="full"
              size="md"
              transition="all 0.3s"
            />
          </Box>

          <VStack
            align="start"
            spacing={2}
            w="100%"
            opacity={animatedValue ? 1 : 0}
            transform={animatedValue ? 'translateY(0)' : 'translateY(20px)'}
            transition="all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)"
          >
            <HStack
              fontSize="sm"
              color={mutedColor}
              w="100%"
              p={3}
              bg={cardBg}
              borderRadius="lg"
              _hover={{ borderColor: accentColor, borderWidth: 1 }}
              transition="all 0.2s"
            >
              <MdVerified color={accentColor} boxSize={5} />
              <VStack align="start" spacing={0}>
                <Text fontWeight="bold">Último canje</Text>
                <Text fontSize="xs">Hace 2 días</Text>
              </VStack>
            </HStack>
            <HStack
              fontSize="sm"
              color={mutedColor}
              w="100%"
              p={3}
              bg={cardBg}
              borderRadius="lg"
              _hover={{ borderColor: accentColor, borderWidth: 1 }}
              transition="all 0.2s"
            >
              <MdTrendingUp color={accentColor} boxSize={5} />
              <VStack align="start" spacing={0}>
                <Text fontWeight="bold">Ganancia esta semana</Text>
                <Text fontSize="xs">+450 puntos</Text>
              </VStack>
            </HStack>
          </VStack>
        </VStack>
      </Box>
    )
  }

  // Componente para leaderboard
  const LeaderboardVisualizacion = () => {
    const [animate, setAnimate] = useState(false)
    const positions = [
      { name: 'Usuario1', puntos: 5000, position: 1 },
      { name: 'Tu posición', puntos: 3500, position: 5, isYou: true },
      { name: 'Usuario3', puntos: 2800, position: 8 }
    ]

    useEffect(() => {
      const timer = setTimeout(() => setAnimate(true), 300)
      return () => clearTimeout(timer)
    }, [])

    return (
      <Box
        borderRadius="2xl"
        border={`2px solid ${borderColor}`}
        bg={sectionBg}
        p={8}
        display="flex"
        flexDir="column"
        align="center"
        justify="center"
        opacity={animate ? 1 : 0}
        transform={animate ? 'scale(1)' : 'scale(0.95)'}
        transition="all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)"
      >
        <HStack
          spacing={3}
          mb={6}
          opacity={animate ? 1 : 0}
          transform={animate ? 'translateY(0)' : 'translateY(-20px)'}
          transition="all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)"
        >
          <Icon as={MdLeaderboard} boxSize={8} color={accentColor} />
          <Heading fontSize="lg" fontWeight="bold">Ranking Global</Heading>
        </HStack>

        <VStack spacing={3} w="100%">
          {positions.map((pos, idx) => (
            <HStack
              key={idx}
              w="100%"
              p={4}
              bg={pos.isYou ? useColorModeValue('blue.50', 'blue.900') : cardBg}
              borderRadius="lg"
              border={pos.isYou ? `2px solid ${accentColor}` : `1px solid ${borderColor}`}
              justify="space-between"
              opacity={animate ? 1 : 0}
              transform={animate ? 'translateX(0)' : 'translateX(-20px)'}
              transition={`all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${idx * 0.1}s`}
              _hover={{
                transform: 'translateX(8px)',
                boxShadow: `0 8px 16px rgba(59, 130, 246, 0.1)`
              }}
              cursor="pointer"
              suppressHydrationWarning
            >
              <HStack spacing={4}>
                <Box
                  minW="10"
                  h="10"
                  bg={accentColor}
                  borderRadius="full"
                  display="flex"
                  align="center"
                  justify="center"
                  color="white"
                  fontSize="sm"
                  fontWeight="bold"
                  flexShrink={0}
                >
                  {pos.position}
                </Box>
                <VStack align="start" spacing={0.5}>
                  <Text fontSize="sm" fontWeight="bold">{pos.name}</Text>
                  <Text fontSize="xs" color={mutedColor} suppressHydrationWarning>{pos.puntos.toLocaleString()} pts</Text>
                </VStack>
              </HStack>
              {pos.isYou && (
                <Icon as={MdStar} color={accentColor} boxSize={6} />
              )}
            </HStack>
          ))}
        </VStack>

        <Box
          w="100%"
          p={3}
          bg={cardBg}
          borderRadius="lg"
          mt={4}
          textAlign="center"
          opacity={animate ? 1 : 0}
          transform={animate ? 'translateY(0)' : 'translateY(20px)'}
          transition="all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)"
        >
          <Text fontSize="10px" color={mutedColor}>Actualizado hace 5 minutos</Text>
        </Box>
      </Box>
    )
  }

  // Componente para canjes
  const CanjesVisualizacion = () => {
    const [activeIndex, setActiveIndex] = useState(0)
    const [animate, setAnimate] = useState(false)
    const canjes = [
      { name: 'VIP Mensual', status: 'Entregado', color: 'green' },
      { name: 'Merchandising', status: 'En envío', color: 'blue' },
      { name: 'Acceso Premium', status: 'Procesando', color: 'orange' }
    ]

    useEffect(() => {
      const timer = setTimeout(() => setAnimate(true), 300)
      return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % canjes.length)
      }, 3000)
      return () => clearInterval(interval)
    }, [canjes.length])

    return (
      <Box
        borderRadius="2xl"
        border={`2px solid ${borderColor}`}
        bg={sectionBg}
        p={8}
        display="flex"
        flexDir="column"
        align="center"
        justify="center"
        opacity={animate ? 1 : 0}
        transform={animate ? 'scale(1)' : 'scale(0.95)'}
        transition="all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)"
      >
        <HStack
          spacing={3}
          mb={6}
          opacity={animate ? 1 : 0}
          transform={animate ? 'translateY(0)' : 'translateY(-20px)'}
          transition="all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)"
        >
          <Icon as={MdShoppingCart} boxSize={8} color={accentColor} />
          <Heading fontSize="lg" fontWeight="bold">Mis Canjes</Heading>
        </HStack>

        <VStack spacing={3} w="100%">
          {canjes.map((canje, idx) => (
            <Box
              key={idx}
              w="100%"
              p={4}
              bg={cardBg}
              borderRadius="lg"
              border={idx === activeIndex ? `2px solid ${accentColor}` : `1px solid ${borderColor}`}
              opacity={idx === activeIndex ? 1 : 0.6}
              transform={idx === activeIndex ? 'scale(1.02)' : 'scale(1)'}
              transition="all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)"
              boxShadow={idx === activeIndex ? `0 12px 24px rgba(59, 130, 246, 0.15)` : 'none'}
              cursor="pointer"
              _hover={{
                transform: 'scale(1.01)',
                borderColor: accentColor
              }}
            >
              <HStack justify="space-between" align="start">
                <VStack align="start" spacing={1} flex={1}>
                  <Text fontSize="sm" fontWeight="bold">{canje.name}</Text>
                  <HStack spacing={2}>
                    <Box
                      w={2}
                      h={2}
                      borderRadius="full"
                      bg={useColorModeValue(`${canje.color}.400`, `${canje.color}.300`)}
                      animation={idx === activeIndex ? 'pulse 2s infinite' : 'none'}
                    />
                    <Text fontSize="xs" color={mutedColor}>{canje.status}</Text>
                  </HStack>
                </VStack>
                <Box
                  px={3}
                  py={1}
                  borderRadius="full"
                  bg={useColorModeValue(`${canje.color}.100`, `${canje.color}.900`)}
                  fontSize="10px"
                  fontWeight="bold"
                  color={useColorModeValue(`${canje.color}.700`, `${canje.color}.300`)}
                >
                  {canje.status}
                </Box>
              </HStack>

              {idx === activeIndex && (
                <Box
                  w="100%"
                  h="1px"
                  bg={accentColor}
                  mt={3}
                  opacity={0.3}
                />
              )}
            </Box>
          ))}
        </VStack>

        <HStack
          spacing={2}
          mt={4}
          opacity={animate ? 1 : 0}
          transform={animate ? 'translateY(0)' : 'translateY(20px)'}
          transition="all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)"
        >
          {canjes.map((_, idx) => (
            <Box
              key={idx}
              w={2}
              h={2}
              borderRadius="full"
              bg={idx === activeIndex ? accentColor : borderColor}
              transition="all 0.3s"
            />
          ))}
        </HStack>
      </Box>
    )
  }

  // Seleccionar componente según el ID
  const getVisualization = () => {
    switch (id) {
      case 'people':
        return <HistorialVisualizacion />
      case 'performance':
        return <LeaderboardVisualizacion />
      case 'realtime':
        return <CanjesVisualizacion />
      default:
        return (
          <Box
            borderRadius="2xl"
            border={`1px solid ${borderColor}`}
            bg={sectionBg}
            p={4}
            display="flex"
            align="center"
            justify="center"
          >
            <Box h="224px" w="full" borderRadius="xl" bg={cardBg} />
          </Box>
        )
    }
  }

  const contentArea = (
    <VStack align="start" justify="center" spacing={3}>
      <Text
        fontSize="xs"
        fontWeight="bold"
        letterSpacing="0.25em"
        color={labelColor}
        textTransform="uppercase"
      >
        {label}
      </Text>

      <Heading as="h2" fontSize={{ base: '2xl', md: '3xl' }} fontWeight="semibold">
        {title}
      </Heading>

      <Text fontSize="sm" color={mutedColor}>
        {description}
      </Text>

      {showList && (
        <VStack align="start" spacing={1} pt={2}>
          {listItems.map((item, idx) => (
            <HStack key={idx} spacing={2}>
              <Icon as={FaCheck} color={labelColor} boxSize={4} />
              <Text fontSize="sm" color={mutedColor}>
                {item}
              </Text>
            </HStack>
          ))}
        </VStack>
      )}
    </VStack>
  )

  const visualization = getVisualization()

  return (
    <Box borderBottom={`1px solid ${borderColor}`} id={id} suppressHydrationWarning>
      <Container maxW="6xl" py={16} px={4}>
        <Grid
          templateColumns={{ base: '1fr', md: '1fr 1fr' }}
          gap={10}
          direction={imagePosition === 'left' ? 'reverse' : undefined}
        >
          {contentArea}
          {visualization}
        </Grid>
      </Container>
    </Box>
  )
}


// ===================== FAQ Section =====================
export function FAQSection() {
  const borderColor = useColorModeValue('gray.200', 'gray.800')
  const textColor = useColorModeValue('gray.800', 'gray.50')
  const mutedColor = useColorModeValue('gray.600', 'gray.300')
  const cardBg = useColorModeValue('white', 'gray.900')

  return (
    <Box borderBottom={`1px solid ${borderColor}`} id="faq" suppressHydrationWarning>
      <Container maxW="4xl" py={16} px={4}>
        <Heading as="h2" fontSize={{ base: '2xl', md: '3xl' }} fontWeight="semibold" mb={8}>
          Preguntas frecuentes
        </Heading>

        <VStack spacing={4}>
          {faqItems.map((faq, idx) => (
            <Box
              key={idx}
              borderRadius="xl"
              border={`1px solid ${borderColor}`}
              bg={cardBg}
              p={4}
              w="full"
              as="details"
              css={{
                '&[open] summary': {
                  fontWeight: 'bold'
                }
              }}
            >
              <summary style={{ cursor: 'pointer', fontWeight: 500, fontSize: '0.875rem' }}>
                {faq.question}
              </summary>
              <Text fontSize="sm" color={mutedColor} mt={3}>
                {faq.answer}
              </Text>
            </Box>
          ))}
        </VStack>
      </Container>
    </Box>
  )
}

// Footer Component was removed - use the main Footer.tsx component instead

