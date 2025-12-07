import { Layout } from '../components/Layout'
import { ActionsMenu } from '../components/ActionsMenu'
import { TransparentCard } from '../components/TransparentCard'
import { BroadcasterPanel } from '../components/BroadcasterPanel'
import {
  SimpleGrid,
  Spinner,
  Center,
  Box,
  HStack,
  Text,
  useColorModeValue,
  IconButton,
  Badge,
  Flex,
  Image
} from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import { useState, useEffect } from 'react'
import { useProductos } from '../hooks/useProductos'
import { ProductCard } from '../components/ProductCard'
import { useAuth } from '../hooks/useAuth'
import { useRouter } from 'next/router'
import { usePublicKickPointsConfig } from '../hooks/usePublicKickPointsConfig'
import Head from 'next/head'
import {
  SettingsIcon,
  AddIcon,
  ViewIcon,
  EditIcon,
  RepeatIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChatIcon,
  StarIcon
} from '@chakra-ui/icons'

// Animaciones suaves (reducidas para rendimiento)
const snowfall = keyframes`
  0% { transform: translateY(-100px) translateX(0px); opacity: 0; }
  5% { opacity: 1; }
  95% { opacity: 1; }
  100% { transform: translateY(calc(100vh + 100px)) translateX(20px); opacity: 0; }
`

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
`

export default function Home() {
  const { data: productos, isLoading, error } = useProductos()
  const { user } = useAuth()
  const router = useRouter()
  const { configs } = usePublicKickPointsConfig()

  const [currentIndex, setCurrentIndex] = useState(0)

  const isAdmin = !!(user?.rol_id && [3, 4, 5].includes(user.rol_id))

  // Theme colors - all hooks must be called before any conditional returns
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.700', 'gray.200')
  const accentColor = useColorModeValue('blue.600', 'blue.300')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const snowColor = useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(200, 220, 255, 0.6)')
  const adminBannerBg = useColorModeValue('rgba(255, 255, 255, 0.95)', 'rgba(26, 32, 44, 0.95)')
  const adminBannerBorder = useColorModeValue('blue.200', 'blue.700')
  const adminIconBg = useColorModeValue('blue.500', 'blue.400')

  const bannerItems = [
    {
      title: 'Duplicación de Donaciones',
      description: `Por cada 1,000 KICKS donados al canal, recibirás ${(configs?.find((c) => c.config_key === 'kicks_gifted_multiplier')?.config_value || 2) * 1000} puntos en tu cuenta.`,
      color: 'blue'
    },
    {
      title: 'Tiempo de Envío',
      description: 'Los pedidos pueden tardar hasta 1 mes en procesarse y enviarse.',
      color: 'purple'
    },
    {
      title: 'Migración VIP',
      description: 'Si ya canjeaste VIP anteriormente, contacta a un moderador para migrar tu estatus.',
      color: 'cyan'
    },
    {
      title: 'Gana Puntos',
      description: `Participa en el chat: ${configs?.find((c) => c.config_key === 'chat_points_regular')?.config_value || 0} puntos normales, ${configs?.find((c) => c.config_key === 'chat_points_vip')?.config_value || 0} VIP, ${configs?.find((c) => c.config_key === 'chat_points_subscriber')?.config_value || 0} suscriptores.`,
      color: 'green'
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerItems.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [bannerItems.length])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % bannerItems.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + bannerItems.length) % bannerItems.length)
  }

  if (isLoading) {
    return (
      <Layout>
        <Center mt={10}>
          <Spinner size="xl" color={accentColor} thickness="4px" />
        </Center>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <Center mt={10}>
          <Text color="red.500" fontSize="lg">
            Error al cargar productos.
          </Text>
        </Center>
      </Layout>
    )
  }

  return (
    <>
      <Head>
        <title>Tienda - Luisardito Shop</title>
        <meta
          name="description"
          content="Explora nuestro catálogo de productos y canjea tus puntos por increíbles recompensas"
        />
      </Head>
      <Layout>
        {/* Fondo desactivado por rendimiento */}

        {/* Decoración navideña - Nieve ULTRA reducida (solo 5 copos) */}
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          pointerEvents="none"
          zIndex={0}
          overflow="hidden"
          display={{ base: 'none', md: 'block' }}
        >
          {/* Solo 5 copos sutiles para rendimiento óptimo */}
          {[...Array(5)].map((_, i) => {
            const delay = -(Math.random() * 30)
            const duration = 20 + Math.random() * 15
            return (
              <Box
                key={`snow-${i}`}
                position="absolute"
                left={`${(i + 1) * 20}%`}
                w="3px"
                h="3px"
                bg={snowColor}
                borderRadius="full"
                animation={`${snowfall} ${duration}s linear infinite`}
                sx={{ animationDelay: `${delay}s`, willChange: 'transform' }}
                opacity={0.5}
              />
            )
          })}
        </Box>

        {/* Luces desactivadas por rendimiento */}

        <Box position="relative" zIndex={1}>
          {/* Banner de modo administrador */}
          {isAdmin && (
            <TransparentCard
              mb={6}
              mt={4}
              px={6}
              py={4}
              position="relative"
              overflow="hidden"
            >
              <Flex
                justify="space-between"
                align="center"
                direction={{ base: 'column', md: 'row' }}
                gap={3}
              >
                <HStack spacing={3}>
                  <Badge
                    colorScheme="blue"
                    fontSize="xs"
                    px={2}
                    py={1}
                    borderRadius="md"
                    fontWeight="600"
                    letterSpacing="wider"
                  >
                    ADMIN
                  </Badge>
                  <Text
                    fontSize="sm"
                    color={textColor}
                    fontFamily="'Inter', sans-serif"
                  >
                    Gestiona productos, usuarios, canjes y promociones
                  </Text>
                </HStack>

                <ActionsMenu
                  buttonIcon={<SettingsIcon />}
                  buttonLabel="Panel"
                  buttonSize="sm"
                  items={[
                    {
                      label: 'Nuevo Producto',
                      icon: AddIcon,
                      onClick: () => router.push('/admin/productos/nuevo'),
                      colorScheme: 'green' as const
                    },
                    {
                      label: 'Productos',
                      icon: ViewIcon,
                      onClick: () => router.push('/admin/productos')
                    },
                    {
                      label: 'Usuarios',
                      icon: EditIcon,
                      onClick: () => router.push('/admin/usuarios')
                    },
                    {
                      label: 'Comandos',
                      icon: ChatIcon,
                      onClick: () => router.push('/admin/comandos')
                    },
                    {
                      label: 'Canjes',
                      icon: RepeatIcon,
                      onClick: () => router.push('/admin/canjes')
                    },
                    {
                      label: 'Promociones',
                      icon: StarIcon,
                      onClick: () => router.push('/admin/promociones')
                    }
                  ]}
                />
              </Flex>
            </TransparentCard>
          )}

          {/* Banner informativo con imagen de fondo */}
          <TransparentCard
            mb={8}
            mt={4}
            position="relative"
            overflow="hidden"
            p={0}
          >
            {/* Imagen de fondo */}
            <Image
              src="/images/banner.png"
              alt="Banner"
              position="absolute"
              top={0}
              left={0}
              w="full"
              h="full"
              objectFit="cover"
              opacity={0.25}
              filter="brightness(1.4)"
            />

            <Flex align="center" justify="space-between" gap={2} px={4} py={3} position="relative">
              <IconButton
                aria-label="Anterior"
                icon={<ChevronLeftIcon />}
                onClick={prevSlide}
                variant="ghost"
                size="sm"
                borderRadius="full"
                bg={useColorModeValue('rgba(255,255,255,0.6)', 'rgba(0,0,0,0.4)')}
                backdropFilter="blur(10px)"
                _hover={{ 
                  bg: useColorModeValue('rgba(255,255,255,0.8)', 'rgba(0,0,0,0.6)'),
                  transform: 'translateX(-2px)' 
                }}
                transition="all 0.2s"
              />

              <Box flex={1} position="relative" minH="60px">
                {bannerItems.map((item, index) => (
                  <Flex
                    key={index}
                    align="center"
                    justify="center"
                    direction="column"
                    gap={1}
                    position="absolute"
                    w="full"
                    opacity={index === currentIndex ? 1 : 0}
                    transform={index === currentIndex ? 'scale(1)' : 'scale(0.95)'}
                    transition="all 0.5s ease"
                    pointerEvents={index === currentIndex ? 'auto' : 'none'}
                  >
                    <Badge
                      colorScheme={item.color}
                      px={2}
                      py={1}
                      borderRadius="md"
                      fontSize="xs"
                      fontWeight="600"
                      letterSpacing="wide"
                    >
                      {item.title.toUpperCase()}
                    </Badge>
                    <Text
                      fontSize="sm"
                      color={textColor}
                      fontFamily="'Inter', sans-serif"
                      textAlign="center"
                      noOfLines={2}
                    >
                      {item.description}
                    </Text>
                  </Flex>
                ))}
              </Box>

              <IconButton
                aria-label="Siguiente"
                icon={<ChevronRightIcon />}
                onClick={nextSlide}
                variant="ghost"
                size="sm"
                borderRadius="full"
                bg={useColorModeValue('rgba(255,255,255,0.6)', 'rgba(0,0,0,0.4)')}
                backdropFilter="blur(10px)"
                _hover={{ 
                  bg: useColorModeValue('rgba(255,255,255,0.8)', 'rgba(0,0,0,0.6)'),
                  transform: 'translateX(2px)' 
                }}
                transition="all 0.2s"
              />
            </Flex>

            {/* Indicadores */}
            <HStack spacing={1} justify="center" pb={2}>
              {bannerItems.map((_, index) => (
                <Box
                  key={index}
                  w={index === currentIndex ? '20px' : '6px'}
                  h="6px"
                  borderRadius="full"
                  bg={index === currentIndex ? accentColor : useColorModeValue('gray.400', 'gray.600')}
                  cursor="pointer"
                  onClick={() => setCurrentIndex(index)}
                  transition="all 0.3s"
                  boxShadow={index === currentIndex ? `0 0 8px ${accentColor}` : 'none'}
                  opacity={index === currentIndex ? 1 : 0.6}
                  _hover={{ 
                    opacity: 1,
                    transform: 'scale(1.2)'
                  }}
                />
              ))}
            </HStack>
          </TransparentCard>

          {/* Panel del broadcaster flotante */}
          <BroadcasterPanel />

          {/* Título de catálogo */}
          <Box mb={6} textAlign="center">
            <Text
              fontSize={{ base: '2xl', md: '3xl' }}
              fontWeight="bold"
              bgGradient="linear(to-r, blue.400, purple.400, pink.400)"
              bgClip="text"
              mb={2}
            >
              Catálogo de Productos
            </Text>
            <Text fontSize="sm" color={textColor}>
              Descubre increíbles recompensas y canjea tus puntos
            </Text>
          </Box>

          {/* Grid de productos */}
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6} mb={8}>
            {productos?.map((producto, index) => (
              <Box
                key={producto.id}
                opacity={0}
                animation={`${keyframes`
                  0% { opacity: 0; transform: translateY(20px); }
                  100% { opacity: 1; transform: translateY(0); }
                `} 0.5s ease-out forwards`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard producto={producto} isAdmin={isAdmin} />
              </Box>
            ))}
          </SimpleGrid>

          {/* Mensaje de temporada navideña */}
          <Box
            mt={8}
            p={6}
            bg={cardBg}
            borderRadius="2xl"
            border="2px solid"
            borderColor={borderColor}
            textAlign="center"
            position="relative"
            overflow="hidden"
          >
            <Box
              position="absolute"
              top={-4}
              right={-4}
              fontSize="6xl"
              opacity={0.1}
              animation={`${float} 4s ease-in-out infinite`}
            >
              ❄️
            </Box>
            <Text fontSize="lg" fontWeight="bold" color={accentColor} mb={2}>
              ¡Felices Fiestas! 🎄
            </Text>
            <Text fontSize="sm" color={textColor}>
              Gracias por ser parte de nuestra comunidad. Disfruta canjeando tus puntos por
              increíbles recompensas.
            </Text>
          </Box>
        </Box>
      </Layout>
    </>
  )
}
