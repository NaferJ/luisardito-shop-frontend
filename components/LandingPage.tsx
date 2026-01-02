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
  SimpleGrid
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { useState } from 'react'
import { FaCheck } from 'react-icons/fa'

// Real content for Luisardito Shop
export const loremContent = {
  short: 'La plataforma oficial de canjes de Luisardito.',
  medium: 'Gana puntos viendo streams, suscribiéndote y donando. Canjea tus puntos por productos exclusivos, accesos VIP y mucho más. Todo en una plataforma segura y transparente.',
  long: 'Luisardito Shop es la tienda de rewards oficial donde puedes canjear todos tus puntos acumulados. Desde productos exclusivos hasta accesos VIP, experiencias especiales y donaciones a caridad. Cada punto cuenta y cada canje es una celebración de tu apoyo.',
  longList: [
    'Gana puntos en cada suscripción, donación y participación en chat.',
    'Catálogo exclusivo actualizado constantemente con nuevos productos.',
    'Transacciones transparentes y verificadas en tiempo real.',
  ]
}

export const featuresList = [
  { title: 'Puntos Confiables', description: 'Cada punto que ganas es real y verificado. Sin sorpresas, solo transparencia.' },
  { title: 'Canjes Rápidos', description: 'Desde que canjes hasta que recibes, todo sucede rápido y sin complicaciones.' },
  { title: 'Seguridad Total', description: 'Tu cuenta y tus puntos están protegidos con la máxima seguridad.' }
]

export const faqItems = [
  { question: '¿Cómo gano puntos?', answer: 'Ganas puntos viendo streams en vivo, suscribiéndote al canal, donando KICKS y participando en el chat. La cantidad varía según tu nivel (VIP, suscriptor o normal).' },
  { question: '¿Qué puedo canjear?', answer: 'Puedes canjear desde merchandising oficial, accesos VIP, experiencias exclusivas hasta donaciones benéficas. El catálogo se actualiza constantemente con nuevos productos.' },
  { question: '¿Cuánto tarda en llegar mi pedido?', answer: 'Los pedidos pueden tardar hasta 1 mes en procesarse y enviarse dependiendo del tipo de producto y tu ubicación.' },
  { question: '¿Puedo transferir mis puntos?', answer: 'No, los puntos son personales y no transferibles. Se usan para canjear en la tienda oficial de Luisardito.' },
  { question: '¿Mi información es segura?', answer: 'Sí, usamos encriptación de última generación y cumplimos con todas las regulaciones de protección de datos.' },
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

  return (
    <Box borderBottom={`1px solid ${borderColor}`} suppressHydrationWarning>
      <Container maxW="6xl" py={16} px={4}>
        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }}  gap={10} mb={10} mt={10}>
          {/* Left side */}
          <VStack align="start" justify="center" spacing={6}>
            <Text
              fontSize="xs"
              fontWeight="bold"
              letterSpacing="0.25em"
              color={useColorModeValue('rgb(59, 130, 246)', 'rgb(96, 165, 250)')}
              textTransform="uppercase"
            >
              Tu tienda de rewards oficial
            </Text>

            <Heading
              as="h1"
              fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
              fontWeight="bold"
              lineHeight="tight"
            >
              Canjea tus puntos por premios exclusivos
            </Heading>

            <Text fontSize={{ base: 'sm', md: 'base' }} color={mutedColor} lineHeight="relaxed">
              {loremContent.medium}
            </Text>

            <HStack spacing={3} flexWrap="wrap">
              <NextLink href="/register">
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

          {/* Right side - Mock dashboard */}
          <Box
            borderRadius="2xl"
            border={`1px solid ${borderColor}`}
            bg={sectionBg}
            p={4}
            display="flex"
            align="center"
            justify="center"
          >
            <Box h="256px" w="full" borderRadius="xl" bg={cardBg} />
          </Box>
        </Grid>

        {/* Quick features grid below hero */}
        <Divider borderColor={borderColor} my={10} />

        <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
          {featuresList.map((feature, idx) => (
            <VStack key={idx} align="start" spacing={1}>
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

  const imageMock = (
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

  return (
    <Box borderBottom={`1px solid ${borderColor}`} id={id} suppressHydrationWarning>
      <Container maxW="6xl" py={16} px={4}>
        <Grid
          templateColumns={{ base: '1fr', md: '1fr 1fr' }}
          gap={10}
          direction={imagePosition === 'left' ? 'reverse' : undefined}
        >
          {contentArea}
          {imageMock}
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

