import { Layout } from '../components/Layout'
import { SimpleGrid, Spinner, Center, Box, HStack, Text, Button, useColorModeValue, IconButton, Menu, MenuButton, MenuList, MenuItem, Tooltip, Portal, Badge, Flex, Avatar } from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import { useState, useEffect } from 'react'
import { useProductos } from '../hooks/useProductos'
import { ProductCard } from '../components/ProductCard'
import { useAuth } from '../hooks/useAuth'
import { useRouter } from 'next/router'
import { useKickPointsConfig } from '../hooks/useKickPointsConfig'
import Link from 'next/link'
import Head from 'next/head'
import { SettingsIcon, AddIcon, ViewIcon, EditIcon, RepeatIcon } from '@chakra-ui/icons'

export default function Home() {
  const { data: productos, isLoading, error } = useProductos()
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const { configs } = useKickPointsConfig()

  const [currentIndex, setCurrentIndex] = useState(0)

  const carouselItems = [
    {
      text: "Los envíos pueden tardar hasta 1 mes. Por favor, ten paciencia mientras procesamos tu pedido.",
    },
    {
      text: "Si anteriormente ya habías canjeado VIP, por favor contacta a un moderador para migrar tu VIP a la página actual.",
    },
    {
      text: `Gana puntos participando: ${configs?.find(c => c.config_key === 'chat_points_regular')?.config_value || 0} por mensaje en chat, ${configs?.find(c => c.config_key === 'chat_points_subscriber')?.config_value || 0} si eres suscriptor, y ${configs?.find(c => c.config_key === 'chat_points_vip')?.config_value || 0} si eres VIP. Además, regalar suscripciones (${configs?.find(c => c.config_key === 'gift_given_points')?.config_value || 0} pts), recibir regalos (${configs?.find(c => c.config_key === 'gift_received_points')?.config_value || 0} pts), nuevas suscripciones (${configs?.find(c => c.config_key === 'subscription_new_points')?.config_value || 0} pts), renovaciones (${configs?.find(c => c.config_key === 'subscription_renewal_points')?.config_value || 0} pts) y follows (${configs?.find(c => c.config_key === 'follow_points')?.config_value || 0} pts) también te dan puntos.`,
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselItems.length)
    }, 15000)
    return () => clearInterval(interval)
  }, [])

  const isAdmin = !!(user?.rol_id && [3, 4, 5].includes(user.rol_id))
  const adminBannerBg = useColorModeValue('rgba(219, 234, 254, 0.6)', 'rgba(13, 17, 23, 0.6)')
  const adminBannerBorderColor = useColorModeValue('blue.200', 'whiteAlpha.300')
  const adminBannerShadow = useColorModeValue('0 6px 20px rgba(59,130,246,0.15)', '0 10px 28px rgba(0,0,0,0.55)')
  const headingColor = useColorModeValue('blue.900', 'blue.100')
  const subtextColor = useColorModeValue('blue.700', 'blue.300')
  const gearBg = useColorModeValue('white', 'gray.700')
  const gearColor = useColorModeValue('blue.600', 'cyan.300')
  const gearBorder = useColorModeValue('blackAlpha.200', 'whiteAlpha.300')
  const gearHoverBg = useColorModeValue('gray.50', 'gray.600')
  const menuBg = useColorModeValue('rgba(255,255,255,0.92)', 'rgba(17,24,39,0.85)')
  const menuColor = useColorModeValue('gray.800', 'gray.100')
  const menuBorder = useColorModeValue('blackAlpha.300', 'whiteAlpha.300')
  const menuShadow = useColorModeValue('0 8px 24px rgba(0,0,0,0.18)', '0 12px 32px rgba(0,0,0,0.65)')
  const menuHoverBg = useColorModeValue('gray.100', 'gray.700')
  const gearShadow = useColorModeValue('0 2px 8px rgba(0,0,0,0.18)', '0 6px 16px rgba(0,0,0,0.45)')
  
  if (isLoading) {
    return (
      <Layout>
        <Center mt={10}><Spinner size="xl" /></Center>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <Center mt={10}>Error al cargar productos.</Center>
      </Layout>
    )
  }

  return (
    <>
      <Head>
        <title>Tienda - Luisardito Shop</title>
        <meta name="description" content="Explora nuestro catálogo de productos y canjea tus puntos por increíbles recompensas" />
      </Head>
      <Layout>
      {/* Banner de modo administrador */}
      {isAdmin && (
        <Box
          mb={6}
          mt={4}
          p={{ base: 3, sm: 4, md: 5 }}
          position="relative"
          overflow="hidden"
          borderRadius="2xl"
          border="1px solid"
          bg={adminBannerBg}
          borderColor={adminBannerBorderColor}
          boxShadow={adminBannerShadow}
          sx={{ backdropFilter: 'saturate(160%) blur(12px)', WebkitBackdropFilter: 'saturate(160%) blur(12px)' }}
        >
          {/* Liquid gradient decorative blobs */}
          <Box position="absolute" inset={-6} pointerEvents="none" zIndex={0}>
            <Box
              position="absolute"
              top="-24px"
              left="-24px"
              w="180px"
              h="180px"
              borderRadius="full"
              bgGradient="radial(blue.400, transparent)"
              filter="blur(24px)"
              opacity={0.5}
              animation={`${keyframes`0%{transform:translate(0,0) scale(1)}50%{transform:translate(18px,-12px) scale(1.06)}100%{transform:translate(0,0) scale(1)}`} 5s ease-in-out infinite`}
            />
            <Box
              position="absolute"
              bottom="-28px"
              right="-28px"
              w="220px"
              h="220px"
              borderRadius="full"
              bgGradient="radial(cyan.400, transparent)"
              filter="blur(26px)"
              opacity={0.45}
              animation={`${keyframes`0%{transform:translate(0,0) scale(1)}50%{transform:translate(-22px,14px) scale(1.06)}100%{transform:translate(0,0) scale(1)}`} 6s ease-in-out infinite`}
            />
          </Box>

          {/* Content */}
          <Flex
            justify="space-between"
            align={{ base: 'flex-start', md: 'center' }}
            direction={{ base: 'column', md: 'row' }}
            gap={{ base: 3, md: 0 }}
            position="relative"
            zIndex={1}
          >
            <HStack spacing={{ base: 3, md: 4 }} align="flex-start">
              <Box
                p={{ base: 2, md: 3 }}
                borderRadius="xl"
                bg="blue.500"
                color="white"
                shadow="lg"
                animation={`${keyframes`0%,100%{transform:rotate(0deg)}25%{transform:rotate(5deg)}75%{transform:rotate(-5deg)}`} 4s ease-in-out infinite`}
                flexShrink={0}
              >
                <SettingsIcon boxSize={{ base: 5, md: 6 }} />
              </Box>
              <Box flex="1" minW={0}>
                <HStack
                  spacing={{ base: 1, sm: 2 }}
                  mb={1}
                  wrap="wrap"
                  align="center"
                >
                  <Text
                    fontWeight="black"
                    fontSize={{ base: 'md', sm: 'lg', md: 'lg' }}
                    color={headingColor}
                    whiteSpace="nowrap"
                  >
                    Modo Administrador
                  </Text>
                  <Badge
                    colorScheme="blue"
                    fontSize={{ base: 'xx-small', sm: 'xs' }}
                    px={{ base: 1, sm: 2 }}
                    py={1}
                    borderRadius="md"
                    flexShrink={0}
                  >
                    ADMIN
                  </Badge>
                </HStack>
                <Text
                  fontSize={{ base: 'xs', sm: 'sm' }}
                  color={subtextColor}
                  fontWeight="medium"
                  lineHeight="short"
                  noOfLines={{ base: 2, md: 1 }}
                >
                  Gestiona productos, usuarios y canjes con herramientas avanzadas
                </Text>
              </Box>
            </HStack>

            {/* Mini menú mejorado */}
            <Box flexShrink={0} alignSelf={{ base: 'stretch', md: 'auto' }}>
              <Menu isLazy placement="bottom-end">
                <Tooltip label="Accesos de administrador" hasArrow>
                  <MenuButton
                    as={Button}
                    variant="solid"
                    bg={gearBg}
                    color={gearColor}
                    size={{ base: 'sm', md: 'md' }}
                    borderRadius="xl"
                    border="1px solid"
                    borderColor={gearBorder}
                    boxShadow={gearShadow}
                    _hover={{
                      bg: gearHoverBg,
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)'
                    }}
                    _active={{ bg: gearHoverBg, transform: 'translateY(0)' }}
                    fontWeight="bold"
                    fontSize={{ base: 'xs', md: 'sm' }}
                    w={{ base: 'full', md: 'auto' }}
                    minW={{ base: 'auto', md: '140px' }}
                  >
                    <HStack spacing={2}>
                      <SettingsIcon />
                      <Text>Panel Admin</Text>
                    </HStack>
                  </MenuButton>
                </Tooltip>
                <Portal>
                  <MenuList
                    zIndex={1400}
                    bg={menuBg}
                    color={menuColor}
                    borderColor={menuBorder}
                    boxShadow={menuShadow}
                    borderRadius="xl"
                    sx={{ backdropFilter: 'saturate(160%) blur(8px)' }}
                    p={2}
                    minW="200px"
                  >
                    <MenuItem
                      bg="transparent"
                      _hover={{ bg: menuHoverBg }}
                      _focus={{ bg: menuHoverBg }}
                      onClick={() => router.push('/admin/productos/nuevo')}
                      borderRadius="lg"
                      icon={<AddIcon />}
                    >
                      Nuevo Producto
                    </MenuItem>
                    <MenuItem
                      bg="transparent"
                      _hover={{ bg: menuHoverBg }}
                      _focus={{ bg: menuHoverBg }}
                      onClick={() => router.push('/admin/productos')}
                      borderRadius="lg"
                      icon={<ViewIcon />}
                    >
                      Gestionar Productos
                    </MenuItem>
                    <MenuItem
                      bg="transparent"
                      _hover={{ bg: menuHoverBg }}
                      _focus={{ bg: menuHoverBg }}
                      onClick={() => router.push('/admin/usuarios')}
                      borderRadius="lg"
                      icon={<EditIcon />}
                    >
                      Gestionar Usuarios
                    </MenuItem>
                    <MenuItem
                      bg="transparent"
                      _hover={{ bg: menuHoverBg }}
                      _focus={{ bg: menuHoverBg }}
                      onClick={() => router.push('/admin/canjes')}
                      borderRadius="lg"
                      icon={<RepeatIcon />}
                    >
                      Gestionar Canjes
                    </MenuItem>
                  </MenuList>
                </Portal>
              </Menu>
            </Box>
          </Flex>
        </Box>
      )}

      {/* Carrusel de información */}
      <Box mt={4} p={4} bg={useColorModeValue('gray.50', 'gray.800')} borderRadius="xl" border="1px solid" borderColor={useColorModeValue('gray.200', 'gray.600')}>
        <HStack spacing={4} align="center">
          <Avatar src="/images/logo.jpg" size="md" />
          <Text fontSize="sm" color={useColorModeValue('gray.700', 'gray.300')} flex="1">
            {carouselItems[currentIndex].text}
          </Text>
        </HStack>
        <HStack spacing={2} justify="center" mt={4}>
          {carouselItems.map((_, index) => (
            <Box
              key={index}
              w={3}
              h={3}
              borderRadius="full"
              bg={index === currentIndex ? 'blue.500' : 'gray.300'}
              cursor="pointer"
              onClick={() => setCurrentIndex(index)}
              transition="all 0.2s"
              _hover={{ bg: 'blue.400' }}
            />
          ))}
        </HStack>
      </Box>

      {/* Grid de productos */}
      <SimpleGrid
        columns={[1, 2, 3, 4]}
        spacing={6}
        p={6}
        sx={{
          '& > *': {
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            _hover: {
              transform: 'translateY(-8px) scale(1.02)',
              zIndex: 2,
              filter: 'drop-shadow(0 20px 35px rgba(0, 0, 0, 0.15))'
            }
          }
        }}
      >
        {productos?.map((producto, index) => (
          <Box
            key={producto.id}
            style={{
              animationDelay: `${index * 0.1}s`,
              animation: 'fadeInUp 0.6s ease-out forwards',
            }}
            sx={{
              '@keyframes fadeInUp': {
                '0%': {
                  opacity: 0,
                  transform: 'translateY(30px)'
                },
                '100%': {
                  opacity: 1,
                  transform: 'translateY(0)'
                }
              }
            }}
          >
            <ProductCard
              producto={producto}
              isAdmin={isAdmin}
            />
          </Box>
        ))}
      </SimpleGrid>
    </Layout>
    </>
  )
}
