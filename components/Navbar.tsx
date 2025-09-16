import { Flex, Box, Spacer, Button, HStack, Menu, MenuButton, MenuList, MenuItem, Avatar, Text, Badge, Container, Divider, useColorModeValue, Skeleton, SkeletonCircle, Link as ChakraLink, Image } from '@chakra-ui/react'
import { ChevronDownIcon, ViewIcon, RepeatIcon, AtSignIcon } from '@chakra-ui/icons'
import { useAuth } from '../hooks/useAuth'
import { useKickAuth } from '../hooks/useKickAuth'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import ColorModeToggle from './ColorModeToggle'

export function Navbar() {
  const { user, isAuthenticated, logout, isLoading } = useAuth()
  const { connectWithKick } = useKickAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
  }

  const translucentBg = useColorModeValue('rgba(255, 255, 255, 0.7)', 'rgba(13, 17, 23, 0.6)')
  const borderClr = useColorModeValue('rgba(208, 215, 222, 0.8)', 'rgba(66, 74, 83, 0.8)')
  const shadow = useColorModeValue('0 4px 20px rgba(0,0,0,0.06)', '0 8px 30px rgba(0,0,0,0.35)')

  return (
    <Box as="header" bg={translucentBg} sx={{ backdropFilter: 'saturate(160%) blur(8px)', WebkitBackdropFilter: 'saturate(160%) blur(8px)' }} borderBottom="1px solid" borderColor={borderClr} position="sticky" top={0} zIndex={10} boxShadow={shadow}>
      <Container maxW="6xl" px={4}>
        <Flex align="center" minH={14} gap={4}>
          {/* Logo */}
          <ChakraLink as={NextLink} href="/" display="flex" alignItems="center" gap={2} fontWeight="bold" fontSize="lg" _hover={{ opacity: 0.8 }}>
            <Image src="/images/logo2.jpg" alt="Luisardito Shop logo" boxSize={6} rounded="md" objectFit="cover" />
            Luisardito Shop
          </ChakraLink>

          {/* Enlaces de navegación */}
          {isAuthenticated && (
            <HStack spacing={1} ml={4}>
              <ChakraLink as={NextLink} href="/">
                <Button variant="ghost" size="sm" leftIcon={<ViewIcon boxSize={4} />}>Tienda</Button>
              </ChakraLink>
              <ChakraLink as={NextLink} href="/canjes">
                <Button variant="ghost" size="sm" leftIcon={<RepeatIcon boxSize={4} />}>Mis Canjes</Button>
              </ChakraLink>
              {/* Accesos de administrador */}
              {(user?.rol_id && [3,4,5].includes(user.rol_id)) && (
                <>
                  <ChakraLink as={NextLink} href="/admin/usuarios">
                    <Button variant="ghost" size="sm" leftIcon={<AtSignIcon boxSize={4} />}>Usuarios</Button>
                  </ChakraLink>
                  <ChakraLink as={NextLink} href="/admin/canjes">
                    <Button variant="ghost" size="sm" leftIcon={<RepeatIcon boxSize={4} />}>Canjes</Button>
                  </ChakraLink>
                </>
              )}
            </HStack>
          )}

          <Spacer />

          {/* Toggle de modo */}
          <ColorModeToggle />

          {/* Menú de usuario autenticado o placeholder durante carga */}
          {(() => {
            // Mostrar placeholder mientras se resuelve el estado de autenticación o cuando hay token pero el user aún no está cargado
            if (isLoading || (isAuthenticated && !user)) {
              return (
                <HStack spacing={3} minW={{ base: '180px', sm: '240px' }} justify="flex-end">
                  <Skeleton height="24px" width="72px" rounded="md" />
                  <SkeletonCircle size="8" />
                  <Skeleton height="28px" width="120px" rounded="md" />
                </HStack>
              )
            }

            if (isAuthenticated && user) {
              return (
                <HStack spacing={3}>
                  {/* Badge de puntos */}
                  <Badge colorScheme="yellow" fontSize="sm" px={2} py={1}>
                    {user.puntos?.toLocaleString()} pts
                  </Badge>

                  {/* Menú de usuario */}
                  <Menu>
                    <MenuButton as={Button} variant="ghost" rightIcon={<ChevronDownIcon />} size="sm">
                      <HStack spacing={2}>
                        <Avatar size="sm" name={(user as any).nickname} />
                        <Text fontSize="sm">{(user as any).nickname}</Text>
                      </HStack>
                    </MenuButton>
                    <MenuList>
                      <MenuItem onClick={() => router.push('/perfil')}>Mi Perfil</MenuItem>
                      <MenuItem onClick={() => router.push('/historial')}>Historial de Puntos</MenuItem>
                      <MenuItem onClick={() => router.push('/canjes')}>Mis Canjes</MenuItem>
                      <MenuItem onClick={() => router.push('/')}>Catálogo</MenuItem>
                      <Divider />
                      <MenuItem onClick={handleLogout} color="red.500">Cerrar Sesión</MenuItem>
                    </MenuList>
                  </Menu>
                </HStack>
              )
            }

            // Usuarios no autenticados
            return (
              <HStack spacing={2}>
                <ChakraLink as={NextLink} href="/login">
                  <Button variant="outline" size="sm">Iniciar Sesión</Button>
                </ChakraLink>
                <ChakraLink as={NextLink} href="/register">
                  <Button colorScheme="blue" size="sm">Registro</Button>
                </ChakraLink>
                {/* Botón OAuth con Kick */}
                <Button onClick={connectWithKick} colorScheme="yellow" variant="solid" size="sm">
                  Conectar con Kick
                </Button>
              </HStack>
            )
          })()}
        </Flex>
      </Container>
    </Box>
  )
}
