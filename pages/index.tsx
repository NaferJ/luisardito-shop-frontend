import { Layout } from '../components/Layout'
import { SimpleGrid, Spinner, Center, Box, HStack, Text, Button, useColorModeValue, IconButton, Menu, MenuButton, MenuList, MenuItem, Tooltip, Portal, Badge } from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import { useProductos } from '../hooks/useProductos'
import { ProductCard } from '../components/ProductCard'
import { useAuth } from '../hooks/useAuth'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { SettingsIcon } from '@chakra-ui/icons'

export default function Home() {
  const { data: productos, isLoading, error } = useProductos()
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

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
    <Layout>
      {/* Banner de modo administrador */}
      {isAdmin && (
        <Box
          mb={6}
          p={5}
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
          <HStack justify="space-between" align="center" position="relative" zIndex={1}>
            <HStack spacing={4}>
              <Box
                p={3}
                borderRadius="xl"
                bg="blue.500"
                color="white"
                shadow="lg"
                animation={`${keyframes`0%,100%{transform:rotate(0deg)}25%{transform:rotate(5deg)}75%{transform:rotate(-5deg)}`} 4s ease-in-out infinite`}
              >
                <SettingsIcon boxSize={6} />
              </Box>
              <Box>
                <HStack spacing={2} mb={1}>
                  <Text fontWeight="black" fontSize="lg" color={headingColor}>
                    Modo Administrador
                  </Text>
                  <Badge colorScheme="blue" fontSize="xs" px={2} py={1} borderRadius="md">
                    ADMIN
                  </Badge>
                </HStack>
                <Text fontSize="sm" color={subtextColor} fontWeight="medium">
                  Gestiona productos, usuarios y canjes con herramientas avanzadas
                </Text>
              </Box>
            </HStack>

            {/* Mini menú mejorado */}
            <HStack spacing={3}>
              <Menu isLazy placement="bottom-end">
                <Tooltip label="Accesos de administrador" hasArrow>
                  <MenuButton
                    as={Button}
                    leftIcon={<SettingsIcon />}
                    rightIcon={<Box as="span" transform="rotate(90deg)">⚡</Box>}
                    variant="solid"
                    bg={gearBg}
                    color={gearColor}
                    size="md"
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
                    fontSize="sm"
                  >
                    Panel Admin
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
                      icon="➕"
                    >
                      Nuevo Producto
                    </MenuItem>
                    <MenuItem
                      bg="transparent"
                      _hover={{ bg: menuHoverBg }}
                      _focus={{ bg: menuHoverBg }}
                      onClick={() => router.push('/admin/productos')}
                      borderRadius="lg"
                      icon="📋"
                    >
                      Gestionar Productos
                    </MenuItem>
                    <MenuItem
                      bg="transparent"
                      _hover={{ bg: menuHoverBg }}
                      _focus={{ bg: menuHoverBg }}
                      onClick={() => router.push('/admin/usuarios')}
                      borderRadius="lg"
                      icon="👥"
                    >
                      Gestionar Usuarios
                    </MenuItem>
                    <MenuItem
                      bg="transparent"
                      _hover={{ bg: menuHoverBg }}
                      _focus={{ bg: menuHoverBg }}
                      onClick={() => router.push('/admin/canjes')}
                      borderRadius="lg"
                      icon="🔄"
                    >
                      Gestionar Canjes
                    </MenuItem>
                  </MenuList>
                </Portal>
              </Menu>
            </HStack>
          </HStack>
        </Box>
      )}

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
  )
}
