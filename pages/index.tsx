import { Layout } from '../components/Layout'
import {
  SimpleGrid,
  Spinner,
  Center,
  Box,
  HStack,
  Text,
  Button,
  useColorModeValue,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Portal,
  Badge,
  Flex
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
  ChatIcon
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

  const carouselItems = [
    {
      icon: '🎁',
      text: '¡Duplicamos tus donaciones! Por cada 1,000 KICKS que dones al canal, recibirás 2,000 puntos.'
    },
    {
      icon: '📦',
      text: 'Los envíos pueden tardar hasta 1 mes. Ten paciencia mientras procesamos tu pedido.'
    },
    {
      icon: '⭐',
      text: 'Si anteriormente ya habías canjeado VIP, contacta a un moderador para migrar tu VIP a la página actual.'
    },
    {
      icon: '💎',
      text: `Gana puntos participando: ${configs?.find((c) => c.config_key === 'chat_points_regular')?.config_value || 0} por mensaje en chat, ${configs?.find((c) => c.config_key === 'chat_points_vip')?.config_value || 0} si eres VIP, y ${configs?.find((c) => c.config_key === 'chat_points_subscriber')?.config_value || 0} si eres suscriptor.`
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselItems.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [carouselItems.length])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % carouselItems.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length)
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
            <Box
              mb={6}
              mt={4}
              p={5}
              bg={adminBannerBg}
              borderRadius="2xl"
              border="2px solid"
              borderColor={adminBannerBorder}
              boxShadow="xl"
              backdropFilter="blur(10px)"
              position="relative"
              overflow="hidden"
            >
              <Box
                position="absolute"
                top={-2}
                right={-2}
                w="100px"
                h="100px"
                bg={adminIconBg}
                opacity={0.1}
                borderRadius="full"
                animation={`${pulse} 3s ease-in-out infinite`}
              />

              <Flex
                justify="space-between"
                align="center"
                direction={{ base: 'column', md: 'row' }}
                gap={4}
              >
                <HStack spacing={4}>
                  <Box
                    p={3}
                    bg={adminIconBg}
                    color="white"
                    borderRadius="xl"
                    animation={`${float} 3s ease-in-out infinite`}
                  >
                    <SettingsIcon boxSize={6} />
                  </Box>
                  <Box>
                    <HStack mb={1}>
                      <Text fontWeight="bold" fontSize="xl" color={accentColor}>
                        Modo Administrador
                      </Text>
                      <Badge colorScheme="blue" fontSize="xs">
                        ADMIN
                      </Badge>
                    </HStack>
                    <Text fontSize="sm" color={textColor}>
                      Gestiona productos, usuarios y canjes con herramientas avanzadas
                    </Text>
                  </Box>
                </HStack>

                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<SettingsIcon />}
                    colorScheme="blue"
                    size="md"
                    borderRadius="xl"
                    boxShadow="md"
                    _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                    transition="all 0.2s"
                  >
                    Panel Admin
                  </MenuButton>
                  <Portal>
                    <MenuList boxShadow="xl" borderRadius="xl" p={2}>
                      <MenuItem
                        icon={<AddIcon />}
                        onClick={() => router.push('/admin/productos/nuevo')}
                        borderRadius="lg"
                      >
                        Nuevo Producto
                      </MenuItem>
                      <MenuItem
                        icon={<ViewIcon />}
                        onClick={() => router.push('/admin/productos')}
                        borderRadius="lg"
                      >
                        Gestionar Productos
                      </MenuItem>
                      <MenuItem
                        icon={<EditIcon />}
                        onClick={() => router.push('/admin/usuarios')}
                        borderRadius="lg"
                      >
                        Gestionar Usuarios
                      </MenuItem>
                      <MenuItem
                        icon={<ChatIcon />}
                        onClick={() => router.push('/admin/comandos')}
                        borderRadius="lg"
                      >
                        Gestionar Comandos
                      </MenuItem>
                      <MenuItem
                        icon={<RepeatIcon />}
                        onClick={() => router.push('/admin/canjes')}
                        borderRadius="lg"
                      >
                        Gestionar Canjes
                      </MenuItem>
                    </MenuList>
                  </Portal>
                </Menu>
              </Flex>
            </Box>
          )}

          {/* Carrusel de información mejorado */}
          <Box
            mb={8}
            py={3}
            px={4}
            mt={4}
            bg={cardBg}
            borderRadius="xl"
            border="1px solid"
            borderColor={borderColor}
            boxShadow="lg"
            position="relative"
            overflow="hidden"
          >
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              h="4px"
              bg="linear-gradient(90deg, #3B82F6, #8B5CF6, #EC4899, #3B82F6)"
              backgroundSize="200% 100%"
              animation={`${keyframes`0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; }`} 3s linear infinite`}
            />

            <Flex align="center" gap={3}>
              <IconButton
                aria-label="Anterior"
                icon={<ChevronLeftIcon boxSize={5} />}
                onClick={prevSlide}
                variant="ghost"
                size="sm"
                borderRadius="full"
                color={accentColor}
              />

              <Box flex={1} position="relative" minH="70px" display="flex" alignItems="center">
                {carouselItems.map((item, index) => (
                  <Flex
                    key={index}
                    align="center"
                    gap={4}
                    position="absolute"
                    w="full"
                    opacity={index === currentIndex ? 1 : 0}
                    transform={index === currentIndex ? 'translateX(0)' : 'translateX(20px)'}
                    transition="all 0.5s ease"
                    pointerEvents={index === currentIndex ? 'auto' : 'none'}
                  >
                    <Text fontSize="2xl" animation={`${float} 2s ease-in-out infinite`}>
                      {item.icon}
                    </Text>
                    <Text fontSize="sm" color={textColor} lineHeight="short">
                      {item.text}
                    </Text>
                  </Flex>
                ))}
              </Box>

              <IconButton
                aria-label="Siguiente"
                icon={<ChevronRightIcon boxSize={5} />}
                onClick={nextSlide}
                variant="ghost"
                size="sm"
                borderRadius="full"
                color={accentColor}
              />
            </Flex>

            <HStack spacing={2} justify="center" mt={3}>
              {carouselItems.map((_, index) => (
                <Box
                  key={index}
                  w={index === currentIndex ? '24px' : '8px'}
                  h="8px"
                  borderRadius="full"
                  bg={index === currentIndex ? accentColor : borderColor}
                  cursor="pointer"
                  onClick={() => setCurrentIndex(index)}
                  transition="all 0.3s"
                  _hover={{ bg: accentColor }}
                />
              ))}
            </HStack>
          </Box>

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
