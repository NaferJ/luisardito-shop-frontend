import { Flex, Box, Button, HStack, Menu, MenuButton, MenuList, MenuItem, Avatar, Text, Badge, Divider, useColorModeValue, Skeleton, SkeletonCircle, Link as ChakraLink, Image, IconButton, VStack, Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, useDisclosure, CloseButton, Tooltip } from '@chakra-ui/react'
import { ViewIcon, RepeatIcon, AtSignIcon, HamburgerIcon, SettingsIcon } from '@chakra-ui/icons'
import { useAuth } from '../hooks/useAuth'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import ColorModeToggle from './ColorModeToggle'

export default function Navbar() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
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
  const activeBg = useColorModeValue('rgba(59, 130, 246, 0.2)', 'rgba(96, 165, 250, 0.25)')
  const activeShadow = useColorModeValue('0 0 25px rgba(59, 130, 246, 0.6)', '0 0 30px rgba(96, 165, 250, 0.7)')

  // Función para verificar si una ruta está activa
  const isActiveRoute = (path: string) => {
    if (path === '/') {
      return router.pathname === '/'
    }
    return router.pathname.startsWith(path)
  }

  return (
    <Box
      position="fixed"
      top={4}
      left="50%"
      transform="translateX(-50%)"
      zIndex={50}
      w="auto"
      maxW={{
        base: "95vw",    // < 480px
        sm: "92vw",      // 480px - 768px
        md: "88vw",      // 768px - 992px (tablet portrait como 768x1024)
        lg: "85vw",      // 992px - 1200px
        xl: "80vw",      // 1200px - 1536px (como 1393x990)
        "2xl": "75vw"    // > 1536px
      }}
      minW={{
        base: "300px",   // mínimo más pequeño para móvil
        sm: "380px",     // tablet pequeña
        md: "480px",     // tablet
        lg: "580px",     // desktop pequeño
        xl: "650px"      // desktop
      }}
    >
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
        px={{ base: 2, sm: 3, md: 4, lg: 5, xl: 6 }}
        py={{ base: 2, sm: 2.5, md: 0.5 }}
      >
        <Flex
          align="center"
          gap={{ base: 1, sm: 1.5, md: 2, lg: 3, xl: 4 }}
          justify="space-between"
          w="full"
          minH={{ base: "36px", sm: "40px", md: "44px" }}
          maxH="50px"
        >
          {/* Logo con badge beta */}
          <ChakraLink
            as={NextLink}
            href="/"
            display="flex"
            alignItems="center"
            gap={{ base: 1, sm: 2 }}
            fontWeight="bold"
            fontSize={{ base: "sm", sm: "md", md: "lg" }}
            flexShrink={0}
            minW="fit-content"
            _hover={{
              opacity: 0.8,
              transform: 'scale(1.05)',
              transition: 'all 0.2s'
            }}
          >
            <Image
              src="/images/logo2.jpg"
              alt="Luisardito Shop logo"
              boxSize={{ base: 5, sm: 6, md: 7, lg: 8 }}
              rounded="lg"
              objectFit="cover"
              flexShrink={0}
            />
            <HStack spacing={1} display={{ base: 'none', sm: 'flex', lg: 'flex' }}>
              <Text whiteSpace="nowrap" fontSize={{ sm: "sm", md: "md", lg: "lg" }}>
                Luisardito Shop
              </Text>
              <Badge
                colorScheme="blue"
                fontSize={{ base: "xx-small", sm: "xs" }}
                px={{ base: 1, sm: 2 }}
                py={0.5}
                borderRadius="md"
              >
                beta
              </Badge>
            </HStack>
            {/* Logo compacto para móvil */}
            <Badge
              colorScheme="blue"
              fontSize="xx-small"
              px={1}
              py={0.5}
              borderRadius="md"
              display={{ base: 'block', sm: 'none' }}
            >
              LS
            </Badge>
          </ChakraLink>

          {/* Enlaces de navegación con iconos flotantes - Solo desktop */}
          {isAuthenticated && (
            <HStack spacing={2} display={{ base: 'none', lg: 'flex' }} flex="1" justify="center">
              <Tooltip label="Tienda" placement="bottom">
                <ChakraLink as={NextLink} href="/">
                  <IconButton
                    aria-label="Tienda"
                    icon={<ViewIcon boxSize={5} />}
                    variant="ghost"
                    size="sm"
                    borderRadius="xl"
                    bg={isActiveRoute('/') ? activeBg : 'transparent'}
                    boxShadow={isActiveRoute('/') ? activeShadow : 'none'}
                    transform={isActiveRoute('/') ? 'translateY(-2px)' : 'none'}
                    _hover={{
                      bg: hoverBg,
                      boxShadow: hoverShadow,
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s ease-in-out'
                    }}
                    transition="all 0.2s ease-in-out"
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
                    bg={isActiveRoute('/canjes') ? activeBg : 'transparent'}
                    boxShadow={isActiveRoute('/canjes') ? activeShadow : 'none'}
                    transform={isActiveRoute('/canjes') ? 'translateY(-2px)' : 'none'}
                    _hover={{
                      bg: hoverBg,
                      boxShadow: hoverShadow,
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s ease-in-out'
                    }}
                    transition="all 0.2s ease-in-out"
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
                        bg={isActiveRoute('/admin/usuarios') ? activeBg : 'transparent'}
                        boxShadow={isActiveRoute('/admin/usuarios') ? activeShadow : 'none'}
                        transform={isActiveRoute('/admin/usuarios') ? 'translateY(-2px)' : 'none'}
                        _hover={{
                          bg: hoverBg,
                          boxShadow: hoverShadow,
                          transform: 'translateY(-2px)',
                          transition: 'all 0.2s ease-in-out'
                        }}
                        transition="all 0.2s ease-in-out"
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
                        bg={isActiveRoute('/admin/canjes') ? activeBg : 'transparent'}
                        boxShadow={isActiveRoute('/admin/canjes') ? activeShadow : 'none'}
                        transform={isActiveRoute('/admin/canjes') ? 'translateY(-2px)' : 'none'}
                        _hover={{
                          bg: hoverBg,
                          boxShadow: hoverShadow,
                          transform: 'translateY(-2px)',
                          transition: 'all 0.2s ease-in-out'
                        }}
                        transition="all 0.2s ease-in-out"
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
                        bg={isActiveRoute('/admin/kick') ? activeBg : 'transparent'}
                        boxShadow={isActiveRoute('/admin/kick') ? activeShadow : 'none'}
                        transform={isActiveRoute('/admin/kick') ? 'translateY(-2px)' : 'none'}
                        _hover={{
                          bg: hoverBg,
                          boxShadow: hoverShadow,
                          transform: 'translateY(-2px)',
                          transition: 'all 0.2s ease-in-out'
                        }}
                        transition="all 0.2s ease-in-out"
                      />
                    </ChakraLink>
                  </Tooltip>
                </>
              )}
            </HStack>
          )}

          {/* Controles del lado derecho */}
          <HStack
            spacing={{ base: 1, sm: 2, md: 3 }}
            flexShrink={0}
            align="center"
            minW="fit-content"
          >
            {/* Toggle de modo - Solo en tablet y desktop */}
            <Box display={{ base: 'none', md: 'block' }} flexShrink={0}>
              <ColorModeToggle />
            </Box>

            {/* Badge de puntos y botón de perfil para usuarios autenticados - Solo tablet y desktop */}
            {isAuthenticated && user && (
              <HStack
                spacing={{ base: 1, md: 2 }}
                display={{ base: 'none', md: 'flex' }}
                align="center"
                flexShrink={0}
              >
                {/* Badge de puntos */}
                <Badge
                  colorScheme="yellow"
                  fontSize={{ base: "xs", md: "sm" }}
                  px={{ base: 2, md: 3 }}
                  py={1}
                  borderRadius="full"
                  flexShrink={0}
                  whiteSpace="nowrap"
                >
                  {user.puntos?.toLocaleString()} pts
                </Badge>

                {/* Menú de usuario */}
                <Menu placement="bottom-end" gutter={8}>
                  <Tooltip label="Perfil de Usuario" placement="bottom">
                    <MenuButton
                      as={Button}
                      variant="ghost"
                      size="sm"
                      borderRadius="xl"
                      px="0"
                      py="0"
                      minW="auto"
                      h="auto"
                      flexShrink={0}
                      _hover={{
                        bg: hoverBg,
                        boxShadow: hoverShadow,
                        transform: 'translateY(-2px)',
                      }}
                      _active={{
                        bg: activeBg,
                        transform: 'translateY(0)',
                      }}
                      transition="all 0.3s ease"
                    >
                      <Avatar
                        size="sm"
                        name={user.kick_username || user.nickname || user.nombre || user.email}
                        src={user.kick_avatar || undefined}
                      />
                    </MenuButton>
                  </Tooltip>
                  <MenuList
                    borderRadius="xl"
                    border="1px solid"
                    borderColor={borderClr}
                    boxShadow={shadow}
                    maxW="250px"
                    minW="200px"
                    zIndex={1000}
                    p={2}
                  >
                    <VStack spacing={1} p={2} borderBottom="1px solid" borderColor={borderClr} mb={1}>
                      <Avatar
                        size="md"
                        name={user.kick_username || user.nickname || user.nombre || user.email}
                        src={user.kick_avatar || undefined}
                      />
                      <Text fontWeight="medium" fontSize="sm" whiteSpace="nowrap">
                        {user.kick_username || user.nickname || user.nombre || user.email}
                      </Text>
                      <Badge colorScheme="yellow" fontSize="xs">{user.puntos?.toLocaleString()} pts</Badge>
                    </VStack>
                    <MenuItem onClick={() => router.push('/perfil')} borderRadius="lg" whiteSpace="nowrap">Mi Perfil</MenuItem>
                    <MenuItem onClick={() => router.push('/historial')} borderRadius="lg" whiteSpace="nowrap">Historial de Puntos</MenuItem>
                    <MenuItem onClick={() => router.push('/canjes')} borderRadius="lg" whiteSpace="nowrap">Mis Canjes</MenuItem>
                    <MenuItem onClick={() => router.push('/')} borderRadius="lg" whiteSpace="nowrap">Catálogo</MenuItem>
                    <Divider my={1} />
                    <MenuItem onClick={handleLogout} color="red.500" borderRadius="lg" whiteSpace="nowrap">Cerrar Sesión</MenuItem>
                  </MenuList>
                </Menu>
              </HStack>
            )}

            {/* Botones de login/registro para usuarios no autenticados - Solo tablet y desktop */}
            {!isAuthenticated && !isLoading && (
              <HStack spacing={{ base: 1, md: 2 }} display={{ base: 'none', md: 'flex' }} align="center">
                <ChakraLink as={NextLink} href="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    borderRadius="xl"
                    fontSize="xs"
                    px={{ base: 2, md: 3 }}
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
                    fontSize="xs"
                    px={{ base: 2, md: 3 }}
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
            )}

            {/* Skeleton durante carga - Solo tablet y desktop */}
            {isLoading && (
              <HStack spacing={{ base: 1, md: 2 }} display={{ base: 'none', md: 'flex' }} align="center">
                <Skeleton height="20px" width="60px" rounded="md" flexShrink={0} />
                <SkeletonCircle size="6" flexShrink={0} />
              </HStack>
            )}

            {/* Botón hamburguesa - Siempre visible en móvil y tablet */}
            <IconButton
              aria-label="Abrir menú"
              icon={<HamburgerIcon boxSize={4} />}
              variant="ghost"
              onClick={onOpen}
              display={{ base: 'inline-flex', lg: 'none' }}
              borderRadius="xl"
              size="sm"
              minW="auto"
              h="auto"
              p={2}
              _hover={{
                bg: hoverBg,
                boxShadow: hoverShadow,
                transform: 'translateY(-2px)',
                transition: 'all 0.2s ease-in-out'
              }}
            />
          </HStack>
        </Flex>
      </Box>

      {/* Drawer móvil */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size={{ base: "full", sm: "xs" }}>
        <DrawerOverlay />
        <DrawerContent borderRadius={{ base: "0", sm: "xl" }} mr={{ base: 0, sm: 2 }} mt={{ base: 0, sm: 2 }} mb={{ base: 0, sm: 2 }} maxH={{ base: "100vh", sm: "95vh" }}>
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
                    <Divider my={2} />
                    <ColorModeToggle />
                  </VStack>
                )
              }

              if (isAuthenticated && user) {
                // Determinar qué avatar usar: Kick si está disponible, sino inicial del nombre
                const avatarSrc = user.kick_avatar || undefined
                const avatarName = user.kick_username || user.nickname || user.nombre || user.email

                return (
                  <VStack align="stretch" spacing={2}>
                    <HStack justify="space-between">
                      <HStack>
                        <Avatar
                          size="sm"
                          name={avatarName}
                          src={avatarSrc}
                        />
                        <Text fontWeight="medium">{avatarName}</Text>
                      </HStack>
                      <Badge colorScheme="yellow">{user.puntos?.toLocaleString()} pts</Badge>
                    </HStack>

                    <Divider my={2} />

                    <ChakraLink as={NextLink} href="/" onClick={onClose}>
                      <Button
                        variant="ghost"
                        width="full"
                        justifyContent="flex-start"
                        leftIcon={<ViewIcon />}
                        borderRadius="xl"
                        bg={isActiveRoute('/') ? activeBg : 'transparent'}
                        boxShadow={isActiveRoute('/') ? 'md' : 'none'}
                        _hover={{
                          bg: hoverBg,
                          transform: 'translateX(4px)',
                          transition: 'all 0.2s'
                        }}
                        transition="all 0.2s"
                      >
                        Tienda
                      </Button>
                    </ChakraLink>
                    <ChakraLink as={NextLink} href="/canjes" onClick={onClose}>
                      <Button
                        variant="ghost"
                        width="full"
                        justifyContent="flex-start"
                        leftIcon={<RepeatIcon />}
                        borderRadius="xl"
                        bg={isActiveRoute('/canjes') ? activeBg : 'transparent'}
                        boxShadow={isActiveRoute('/canjes') ? 'md' : 'none'}
                        _hover={{
                          bg: hoverBg,
                          transform: 'translateX(4px)',
                          transition: 'all 0.2s'
                        }}
                        transition="all 0.2s"
                      >
                        Mis Canjes
                      </Button>
                    </ChakraLink>

                    {(user?.rol_id && [3,4,5].includes(user.rol_id)) && (
                      <>
                        <ChakraLink as={NextLink} href="/admin/usuarios" onClick={onClose}>
                          <Button
                            variant="ghost"
                            width="full"
                            justifyContent="flex-start"
                            leftIcon={<AtSignIcon />}
                            borderRadius="xl"
                            bg={isActiveRoute('/admin/usuarios') ? activeBg : 'transparent'}
                            boxShadow={isActiveRoute('/admin/usuarios') ? 'md' : 'none'}
                            _hover={{
                              bg: hoverBg,
                              transform: 'translateX(4px)',
                              transition: 'all 0.2s'
                            }}
                            transition="all 0.2s"
                          >
                            Usuarios
                          </Button>
                        </ChakraLink>
                        <ChakraLink as={NextLink} href="/admin/canjes" onClick={onClose}>
                          <Button
                            variant="ghost"
                            width="full"
                            justifyContent="flex-start"
                            leftIcon={<RepeatIcon />}
                            borderRadius="xl"
                            bg={isActiveRoute('/admin/canjes') ? activeBg : 'transparent'}
                            boxShadow={isActiveRoute('/admin/canjes') ? 'md' : 'none'}
                            _hover={{
                              bg: hoverBg,
                              transform: 'translateX(4px)',
                              transition: 'all 0.2s'
                            }}
                            transition="all 0.2s"
                          >
                            Canjes
                          </Button>
                        </ChakraLink>
                        <ChakraLink as={NextLink} href="/admin/kick" onClick={onClose}>
                          <Button
                            variant="ghost"
                            width="full"
                            justifyContent="flex-start"
                            leftIcon={<SettingsIcon />}
                            borderRadius="xl"
                            bg={isActiveRoute('/admin/kick') ? activeBg : 'transparent'}
                            boxShadow={isActiveRoute('/admin/kick') ? 'md' : 'none'}
                            _hover={{
                              bg: hoverBg,
                              transform: 'translateX(4px)',
                              transition: 'all 0.2s'
                            }}
                            transition="all 0.2s"
                          >
                            Kick
                          </Button>
                        </ChakraLink>
                      </>
                    )}

                    <Divider my={2} />

                    <ChakraLink as={NextLink} href="/perfil" onClick={onClose}>
                      <Button
                        variant="ghost"
                        width="full"
                        justifyContent="flex-start"
                        borderRadius="xl"
                        bg={isActiveRoute('/perfil') ? activeBg : 'transparent'}
                        boxShadow={isActiveRoute('/perfil') ? 'md' : 'none'}
                        _hover={{
                          bg: hoverBg,
                          transform: 'translateX(4px)',
                          transition: 'all 0.2s'
                        }}
                        transition="all 0.2s"
                      >
                        Mi Perfil
                      </Button>
                    </ChakraLink>
                    <ChakraLink as={NextLink} href="/historial" onClick={onClose}>
                      <Button
                        variant="ghost"
                        width="full"
                        justifyContent="flex-start"
                        borderRadius="xl"
                        bg={isActiveRoute('/historial') ? activeBg : 'transparent'}
                        boxShadow={isActiveRoute('/historial') ? 'md' : 'none'}
                        _hover={{
                          bg: hoverBg,
                          transform: 'translateX(4px)',
                          transition: 'all 0.2s'
                        }}
                        transition="all 0.2s"
                      >
                        Historial de Puntos
                      </Button>
                    </ChakraLink>
                    <ChakraLink as={NextLink} href="/" onClick={onClose}>
                      <Button
                        variant="ghost"
                        width="full"
                        justifyContent="flex-start"
                        borderRadius="xl"
                        bg={isActiveRoute('/') ? activeBg : 'transparent'}
                        boxShadow={isActiveRoute('/') ? 'md' : 'none'}
                        _hover={{
                          bg: hoverBg,
                          transform: 'translateX(4px)',
                          transition: 'all 0.2s'
                        }}
                        transition="all 0.2s"
                      >
                        Catálogo
                      </Button>
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
