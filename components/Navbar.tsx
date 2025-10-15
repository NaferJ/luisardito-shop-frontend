import { Flex, Box, Spacer, Button, HStack, Menu, MenuButton, MenuList, MenuItem, Avatar, Text, Badge, Container, Divider, useColorModeValue, Skeleton, SkeletonCircle, Link as ChakraLink, Image, IconButton, VStack, Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, useDisclosure, CloseButton } from '@chakra-ui/react'
import { ChevronDownIcon, ViewIcon, RepeatIcon, AtSignIcon, HamburgerIcon, SettingsIcon } from '@chakra-ui/icons'
import { useAuth } from '../hooks/useAuth'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import ColorModeToggle from './ColorModeToggle'

export function Navbar() {
  const { user, isAuthenticated, logout, isLoading } = useAuth()
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleLogout = () => {
    logout()
    onClose()
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

          {/* Enlaces de navegación (desktop) */}
          {isAuthenticated && (
            <HStack spacing={1} ml={4} display={{ base: 'none', md: 'flex' }}>
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
                  <ChakraLink as={NextLink} href="/admin/kick">
                    <Button variant="ghost" size="sm" leftIcon={<SettingsIcon boxSize={4} />}>Kick</Button>
                  </ChakraLink>
                </>
              )}
            </HStack>
          )}

          <Spacer />

          {/* Toggle de modo */}
          <ColorModeToggle />

          {/* Botón hamburguesa (mobile) */}
          <IconButton aria-label="Abrir menú" icon={<HamburgerIcon />} variant="ghost" onClick={onOpen} display={{ base: 'inline-flex', md: 'none' }} />

          {/* Menú de usuario (desktop) o placeholder durante carga */}
          {(() => {
            // Mostrar placeholder mientras se resuelve el estado de autenticación o cuando hay token pero el user aún no está cargado
            if (isLoading || (isAuthenticated && !user)) {
              return (
                <HStack spacing={3} minW={{ base: '180px', sm: '240px' }} justify="flex-end" display={{ base: 'none', md: 'flex' }}>
                  <Skeleton height="24px" width="72px" rounded="md" />
                  <SkeletonCircle size="8" />
                  <Skeleton height="28px" width="120px" rounded="md" />
                </HStack>
              )
            }

            if (isAuthenticated && user) {
              return (
                <HStack spacing={3} display={{ base: 'none', md: 'flex' }}>
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
              <HStack spacing={2} display={{ base: 'none', md: 'flex' }}>
                <ChakraLink as={NextLink} href="/login">
                  <Button variant="outline" size="sm">Iniciar Sesión</Button>
                </ChakraLink>
                <ChakraLink as={NextLink} href="/register">
                  <Button colorScheme="blue" size="sm">Registro</Button>
                </ChakraLink>
              </HStack>
            )
          })()}
        </Flex>
      </Container>

      {/* Drawer móvil */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader display="flex" alignItems="center" justifyContent="space-between">
            <ChakraLink as={NextLink} href="/" display="flex" alignItems="center" gap={2} onClick={onClose}>
              <Image src="/images/logo2.jpg" alt="Luisardito Shop logo" boxSize={6} rounded="md" objectFit="cover" />
              <Text fontWeight="bold">Luisardito Shop</Text>
            </ChakraLink>
            <CloseButton onClick={onClose} />
          </DrawerHeader>
          <DrawerBody>
            {(() => {
              if (isLoading || (isAuthenticated && !user)) {
                return (
                  <VStack align="stretch" spacing={3}>
                    <Skeleton height="20px" />
                    <Skeleton height="20px" />
                    <Skeleton height="20px" />
                  </VStack>
                )
              }

              if (isAuthenticated && user) {
                return (
                  <VStack align="stretch" spacing={2}>
                    <HStack justify="space-between">
                      <HStack>
                        <Avatar size="sm" name={(user as any).nickname} />
                        <Text fontWeight="medium">{(user as any).nickname}</Text>
                      </HStack>
                      <Badge colorScheme="yellow">{user.puntos?.toLocaleString()} pts</Badge>
                    </HStack>

                    <Divider my={2} />

                    <ChakraLink as={NextLink} href="/" onClick={onClose}>
                      <Button variant="ghost" width="full" justifyContent="flex-start" leftIcon={<ViewIcon />}>Tienda</Button>
                    </ChakraLink>
                    <ChakraLink as={NextLink} href="/canjes" onClick={onClose}>
                      <Button variant="ghost" width="full" justifyContent="flex-start" leftIcon={<RepeatIcon />}>Mis Canjes</Button>
                    </ChakraLink>

                    {(user?.rol_id && [3,4,5].includes(user.rol_id)) && (
                      <>
                        <ChakraLink as={NextLink} href="/admin/usuarios" onClick={onClose}>
                          <Button variant="ghost" width="full" justifyContent="flex-start" leftIcon={<AtSignIcon />}>Usuarios</Button>
                        </ChakraLink>
                        <ChakraLink as={NextLink} href="/admin/canjes" onClick={onClose}>
                          <Button variant="ghost" width="full" justifyContent="flex-start" leftIcon={<RepeatIcon />}>Canjes</Button>
                        </ChakraLink>
                        <ChakraLink as={NextLink} href="/admin/kick" onClick={onClose}>
                          <Button variant="ghost" width="full" justifyContent="flex-start" leftIcon={<SettingsIcon />}>Kick</Button>
                        </ChakraLink>
                      </>
                    )}

                    <Divider my={2} />

                    <ChakraLink as={NextLink} href="/perfil" onClick={onClose}>
                      <Button variant="ghost" width="full" justifyContent="flex-start">Mi Perfil</Button>
                    </ChakraLink>
                    <ChakraLink as={NextLink} href="/historial" onClick={onClose}>
                      <Button variant="ghost" width="full" justifyContent="flex-start">Historial de Puntos</Button>
                    </ChakraLink>
                    <ChakraLink as={NextLink} href="/" onClick={onClose}>
                      <Button variant="ghost" width="full" justifyContent="flex-start">Catálogo</Button>
                    </ChakraLink>

                    <Divider my={2} />

                    <Button colorScheme="red" onClick={handleLogout}>Cerrar Sesión</Button>

                    <Divider my={2} />

                    <ColorModeToggle />
                  </VStack>
                )
              }

              return (
                <VStack align="stretch" spacing={3}>
                  <ChakraLink as={NextLink} href="/login" onClick={onClose}>
                    <Button variant="outline" width="full">Iniciar Sesión</Button>
                  </ChakraLink>
                  <ChakraLink as={NextLink} href="/register" onClick={onClose}>
                    <Button colorScheme="blue" width="full">Registro</Button>
                  </ChakraLink>

                  <Divider my={2} />

                  <ColorModeToggle />
                </VStack>
              )
            })()}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  )
}
