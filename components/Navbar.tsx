import { Flex, Box, Spacer, Button, HStack, Menu, MenuButton, MenuList, MenuItem, Avatar, Text, Badge, Container, Divider, useColorModeValue, Skeleton, SkeletonCircle, Link as ChakraLink, Image, IconButton, VStack, Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, useDisclosure, CloseButton, Tooltip } from '@chakra-ui/react'
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

  const floatingBg = useColorModeValue('rgba(255, 255, 255, 0.95)', 'rgba(13, 17, 23, 0.95)')
  const borderClr = useColorModeValue('rgba(208, 215, 222, 0.8)', 'rgba(66, 74, 83, 0.8)')
  const shadow = useColorModeValue('0 4px 20px rgba(0,0,0,0.15)', '0 8px 30px rgba(0,0,0,0.4)')
  const hoverBg = useColorModeValue('rgba(59, 130, 246, 0.1)', 'rgba(96, 165, 250, 0.15)')
  const hoverShadow = useColorModeValue('0 0 20px rgba(59, 130, 246, 0.4)', '0 0 25px rgba(96, 165, 250, 0.5)')

  return (
    <Box position="fixed" top={4} left="50%" transform="translateX(-50%)" zIndex={50} w="auto" maxW="90vw">
      <Box
        bg={floatingBg}
        sx={{
          backdropFilter: 'saturate(160%) blur(12px)',
          WebkitBackdropFilter: 'saturate(160%) blur(12px)'
        }}
        border="1px solid"
        borderColor={borderClr}
        borderRadius="2xl"
        boxShadow={shadow}
        px={4}
        py={2}
      >
        <Flex align="center" gap={20}>
          {/* Logo con badge beta */}
          <ChakraLink
            as={NextLink}
            href="/"
            display="flex"
            alignItems="center"
            gap={2}
            fontWeight="bold"
            fontSize="lg"
            _hover={{
              opacity: 0.8,
              transform: 'scale(1.05)',
              transition: 'all 0.2s'
            }}
          >
            <Image src="/images/logo2.jpg" alt="Luisardito Shop logo" boxSize={8} rounded="lg" objectFit="cover" />
            <HStack spacing={2}>
              <Text whiteSpace="nowrap">Luisardito Shop</Text>
              <Badge colorScheme="blue" fontSize="xs" px={2} py={0.5} borderRadius="md">beta</Badge>
            </HStack>
          </ChakraLink>

          {/* Enlaces de navegación con iconos flotantes */}
          {isAuthenticated && (
            <HStack spacing={2} display={{ base: 'none', md: 'flex' }}>
              <Tooltip label="Tienda" placement="bottom">
                <ChakraLink as={NextLink} href="/">
                  <IconButton
                    aria-label="Tienda"
                    icon={<ViewIcon boxSize={5} />}
                    variant="ghost"
                    size="sm"
                    borderRadius="xl"
                    _hover={{
                      bg: hoverBg,
                      boxShadow: hoverShadow,
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s ease-in-out'
                    }}
                  />
                </ChakraLink>
              </Tooltip>

              <Tooltip label="Mis Canjes" placement="bottom">
                <ChakraLink as={NextLink} href="/canjes">
                  <IconButton
                    aria-label="Mis Canjes"
                    icon={<RepeatIcon boxSize={5} />}
                    variant="ghost"
                    size="sm"
                    borderRadius="xl"
                    _hover={{
                      bg: hoverBg,
                      boxShadow: hoverShadow,
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s ease-in-out'
                    }}
                  />
                </ChakraLink>
              </Tooltip>

              {/* Accesos de administrador */}
              {(user?.rol_id && [3,4,5].includes(user.rol_id)) && (
                <>
                  <Tooltip label="Usuarios" placement="bottom">
                    <ChakraLink as={NextLink} href="/admin/usuarios">
                      <IconButton
                        aria-label="Usuarios"
                        icon={<AtSignIcon boxSize={5} />}
                        variant="ghost"
                        size="sm"
                        borderRadius="xl"
                        _hover={{
                          bg: hoverBg,
                          boxShadow: hoverShadow,
                          transform: 'translateY(-2px)',
                          transition: 'all 0.2s ease-in-out'
                        }}
                      />
                    </ChakraLink>
                  </Tooltip>

                  <Tooltip label="Canjes Admin" placement="bottom">
                    <ChakraLink as={NextLink} href="/admin/canjes">
                      <IconButton
                        aria-label="Canjes Admin"
                        icon={<RepeatIcon boxSize={5} />}
                        variant="ghost"
                        size="sm"
                        borderRadius="xl"
                        _hover={{
                          bg: hoverBg,
                          boxShadow: hoverShadow,
                          transform: 'translateY(-2px)',
                          transition: 'all 0.2s ease-in-out'
                        }}
                      />
                    </ChakraLink>
                  </Tooltip>

                  <Tooltip label="Configuración Kick" placement="bottom">
                    <ChakraLink as={NextLink} href="/admin/kick">
                      <IconButton
                        aria-label="Configuración Kick"
                        icon={<SettingsIcon boxSize={5} />}
                        variant="ghost"
                        size="sm"
                        borderRadius="xl"
                        _hover={{
                          bg: hoverBg,
                          boxShadow: hoverShadow,
                          transform: 'translateY(-2px)',
                          transition: 'all 0.2s ease-in-out'
                        }}
                      />
                    </ChakraLink>
                  </Tooltip>
                </>
              )}
            </HStack>
          )}

          {/* Toggle de modo */}
          <ColorModeToggle />

          {/* Botón hamburguesa (mobile) */}
          <IconButton
            aria-label="Abrir menú"
            icon={<HamburgerIcon />}
            variant="ghost"
            onClick={onOpen}
            display={{ base: 'inline-flex', md: 'none' }}
            borderRadius="xl"
            _hover={{
              bg: hoverBg,
              boxShadow: hoverShadow,
              transform: 'translateY(-2px)',
              transition: 'all 0.2s ease-in-out'
            }}
          />

          {/* Menú de usuario (desktop) o placeholder durante carga */}
          {(() => {
            if (isLoading || (isAuthenticated && !user)) {
              return (
                <HStack spacing={3} minW="180px" justify="flex-end" display={{ base: 'none', md: 'flex' }}>
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
                  <Badge colorScheme="yellow" fontSize="sm" px={3} py={1} borderRadius="full">
                    {user.puntos?.toLocaleString()} pts
                  </Badge>

                  {/* Menú de usuario */}
                  <Menu>
                    <MenuButton
                      as={Button}
                      variant="ghost"
                      rightIcon={<ChevronDownIcon />}
                      size="sm"
                      borderRadius="xl"
                      _hover={{
                        bg: hoverBg,
                        boxShadow: hoverShadow,
                        transform: 'translateY(-2px)',
                        transition: 'all 0.2s ease-in-out'
                      }}
                    >
                      <HStack spacing={2}>
                        <Avatar size="sm" name={(user as any).nickname} />
                        <Text fontSize="sm">{(user as any).nickname}</Text>
                      </HStack>
                    </MenuButton>
                    <MenuList borderRadius="xl" border="1px solid" borderColor={borderClr} boxShadow={shadow}>
                      <MenuItem onClick={() => router.push('/perfil')} borderRadius="lg" mx={1}>Mi Perfil</MenuItem>
                      <MenuItem onClick={() => router.push('/historial')} borderRadius="lg" mx={1}>Historial de Puntos</MenuItem>
                      <MenuItem onClick={() => router.push('/canjes')} borderRadius="lg" mx={1}>Mis Canjes</MenuItem>
                      <MenuItem onClick={() => router.push('/')} borderRadius="lg" mx={1}>Catálogo</MenuItem>
                      <Divider />
                      <MenuItem onClick={handleLogout} color="red.500" borderRadius="lg" mx={1}>Cerrar Sesión</MenuItem>
                    </MenuList>
                  </Menu>
                </HStack>
              )
            }

            return (
              <HStack spacing={2} display={{ base: 'none', md: 'flex' }}>
                <ChakraLink as={NextLink} href="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    borderRadius="xl"
                    _hover={{
                      bg: hoverBg,
                      boxShadow: hoverShadow,
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                    Iniciar Sesión
                  </Button>
                </ChakraLink>
                <ChakraLink as={NextLink} href="/register">
                  <Button
                    colorScheme="blue"
                    size="sm"
                    borderRadius="xl"
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: '0 0 25px rgba(66, 153, 225, 0.6)',
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                    Registro
                  </Button>
                </ChakraLink>
              </HStack>
            )
          })()}
        </Flex>
      </Box>

      {/* Drawer móvil */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent borderRadius="xl" mr={2} mt={2} mb={2} maxH="95vh">
          <DrawerHeader display="flex" alignItems="center" justifyContent="space-between">
            <ChakraLink as={NextLink} href="/" display="flex" alignItems="center" gap={2} onClick={onClose}>
              <Image src="/images/logo2.jpg" alt="Luisardito Shop logo" boxSize={6} rounded="md" objectFit="cover" />
              <HStack spacing={1}>
                <Text fontWeight="bold">Luisardito Shop</Text>
                <Badge colorScheme="blue" fontSize="xs">beta</Badge>
              </HStack>
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
                      <Button variant="ghost" width="full" justifyContent="flex-start" leftIcon={<ViewIcon />} borderRadius="xl">Tienda</Button>
                    </ChakraLink>
                    <ChakraLink as={NextLink} href="/canjes" onClick={onClose}>
                      <Button variant="ghost" width="full" justifyContent="flex-start" leftIcon={<RepeatIcon />} borderRadius="xl">Mis Canjes</Button>
                    </ChakraLink>

                    {(user?.rol_id && [3,4,5].includes(user.rol_id)) && (
                      <>
                        <ChakraLink as={NextLink} href="/admin/usuarios" onClick={onClose}>
                          <Button variant="ghost" width="full" justifyContent="flex-start" leftIcon={<AtSignIcon />} borderRadius="xl">Usuarios</Button>
                        </ChakraLink>
                        <ChakraLink as={NextLink} href="/admin/canjes" onClick={onClose}>
                          <Button variant="ghost" width="full" justifyContent="flex-start" leftIcon={<RepeatIcon />} borderRadius="xl">Canjes</Button>
                        </ChakraLink>
                        <ChakraLink as={NextLink} href="/admin/kick" onClick={onClose}>
                          <Button variant="ghost" width="full" justifyContent="flex-start" leftIcon={<SettingsIcon />} borderRadius="xl">Kick</Button>
                        </ChakraLink>
                      </>
                    )}

                    <Divider my={2} />

                    <ChakraLink as={NextLink} href="/perfil" onClick={onClose}>
                      <Button variant="ghost" width="full" justifyContent="flex-start" borderRadius="xl">Mi Perfil</Button>
                    </ChakraLink>
                    <ChakraLink as={NextLink} href="/historial" onClick={onClose}>
                      <Button variant="ghost" width="full" justifyContent="flex-start" borderRadius="xl">Historial de Puntos</Button>
                    </ChakraLink>
                    <ChakraLink as={NextLink} href="/" onClick={onClose}>
                      <Button variant="ghost" width="full" justifyContent="flex-start" borderRadius="xl">Catálogo</Button>
                    </ChakraLink>

                    <Divider my={2} />

                    <Button colorScheme="red" onClick={handleLogout} borderRadius="xl">Cerrar Sesión</Button>

                    <Divider my={2} />

                    <ColorModeToggle />
                  </VStack>
                )
              }

              return (
                <VStack align="stretch" spacing={3}>
                  <ChakraLink as={NextLink} href="/login" onClick={onClose}>
                    <Button variant="outline" width="full" borderRadius="xl">Iniciar Sesión</Button>
                  </ChakraLink>
                  <ChakraLink as={NextLink} href="/register" onClick={onClose}>
                    <Button colorScheme="blue" width="full" borderRadius="xl">Registro</Button>
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
