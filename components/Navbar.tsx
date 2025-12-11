import {
  Box,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Text,
  Badge,
  Divider,
  useColorModeValue,
  Skeleton,
  SkeletonCircle,
  Link as ChakraLink,
  Image,
  IconButton,
  VStack,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  CloseButton,
  Tooltip,
  Icon
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { HamburgerIcon } from '@chakra-ui/icons'
import {
  MdShoppingCart,
  MdGroup,
  MdPerson,
  MdHistory,
  MdShoppingBag,
  MdSend,
  MdRedeem,
  MdInventory,
  MdLeaderboard
} from 'react-icons/md'
import { useAuth } from '../hooks/useAuth'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import ColorModeToggle from './ColorModeToggle'
import { UserBadge, UserAvatarWithBadge } from './UserBadge'

// Animaciones navideñas removidas para optimizar rendimiento

export default function Navbar() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [showNewBadge, setShowNewBadge] = useState(false)

  // Determinar qué avatar usar: Discord > Kick > inicial del nombre
  const avatarSrc = user
    ? (user.discord_info?.avatar && user.discord_info?.id
        ? `https://cdn.discordapp.com/avatars/${user.discord_info.id}/${user.discord_info.avatar}.png?size=256`
        : user.avatar_url || user.kick_data?.avatar_url || user.kick_avatar || undefined)
    : undefined
  const avatarName = user ? user.kick_username || user.display_name || user.nickname || user.nombre || user.email : ''

  // Detectar si el usuario tiene 2 badges (VIP + SUB)
  const vipInfo = user?.vip_info || user?.vip_status
  const isSubscriber = user?.subscriber_status?.is_active || user?.user_type === 'subscriber'
  const hasTwoBadges = Boolean(vipInfo?.is_active && isSubscriber)

  // Check if user has visited leaderboard before
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasVisited = localStorage.getItem('leaderboard_visited')
      setShowNewBadge(!hasVisited)
    }
  }, [])

  const handleLeaderboardClick = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('leaderboard_visited', 'true')
      setShowNewBadge(false)
    }
  }

  // Definir todos los colores incondicionalmente para evitar cambios en el orden de hooks
  const floatingBg = useColorModeValue('rgba(255, 255, 255, 0.10)', 'rgba(13, 17, 23, 0.10)')
  const borderClr = useColorModeValue('rgba(208, 215, 222, 0.02)', 'rgba(66, 74, 83, 0.02)')
  const shadow = useColorModeValue('0 8px 32px rgba(0,0,0,0.080)', '0 8px 32px rgba(0,0,0,0.14)')
  const hoverBg = useColorModeValue('rgba(59, 130, 246, 0.1)', 'rgba(96, 165, 250, 0.15)')
  const hoverShadow = useColorModeValue(
    '0 0 20px rgba(59, 130, 246, 0.4)',
    '0 0 25px rgba(96, 165, 250, 0.5)'
  )
  const activeBg = useColorModeValue('rgba(59, 130, 246, 0.2)', 'rgba(96, 165, 250, 0.25)')
  const activeShadow = useColorModeValue(
    '0 0 25px rgba(59, 130, 246, 0.6)',
    '0 0 30px rgba(96, 165, 250, 0.7)'
  )

  // Colores para el menú
  const menuBg = useColorModeValue('rgba(255, 255, 255, 0.95)', 'rgba(13, 17, 23, 0.95)')
  const menuShadow = useColorModeValue(
    '0 20px 40px rgba(0,0,0,0.15)',
    '0 20px 40px rgba(0,0,0,0.5)'
  )
  const menuItemHoverBg = useColorModeValue('rgba(59, 130, 246, 0.1)', 'rgba(96, 165, 250, 0.15)')
  const menuItemColor = useColorModeValue('gray.700', 'gray.100')
  const menuItemHoverColor = useColorModeValue('gray.900', 'white')
  const logoutHoverBg = useColorModeValue('rgba(239, 68, 68, 0.1)', 'rgba(248, 113, 113, 0.15)')
  const logoutHoverColor = useColorModeValue('red.600', 'red.400')

  // Colores para el drawer
  const drawerBg = useColorModeValue('rgba(255, 255, 255, 0.95)', 'rgba(13, 17, 23, 0.95)')
  const drawerShadow = useColorModeValue(
    '0 20px 40px rgba(0,0,0,0.15)',
    '0 20px 40px rgba(0,0,0,0.6)'
  )

  // Fallback background
  const fallbackBg = useColorModeValue('rgba(255, 255, 255, 0.65)', 'rgba(13, 17, 23, 0.65)')

  // Colores para el botón de sugerencia
  const suggestionBtnBg = useColorModeValue('white', 'black')
  const suggestionBtnColor = useColorModeValue('gray.800', 'white')
  const suggestionBtnHoverBg = useColorModeValue('gray.100', 'gray.800')
  const suggestionBtnBorder = useColorModeValue('gray.200', 'gray.700')

  // Filtro para el logo de Kick (blanco en modo oscuro, normal en modo claro)
  const kickLogoFilter = useColorModeValue('none', 'brightness(0) invert(1)')

  // Colores para el banner de advertencia de Discord en móvil
  const discordAlertBg = useColorModeValue('orange.50', 'orange.900')
  const discordAlertBgHover = useColorModeValue('orange.100', 'orange.800')
  const discordAlertBorder = useColorModeValue('orange.300', 'orange.600')
  const discordAlertTextBold = useColorModeValue('orange.800', 'orange.100')
  const discordAlertText = useColorModeValue('orange.700', 'orange.200')

  // Color para el borde del badge NEW
  const badgeBorderColor = useColorModeValue('white', 'gray.800')

  // Colores para decoraciones navideñas - removidos para optimizar rendimiento

  const handleLogout = () => {
    logout()
    onClose()
  }

  // Función para verificar si una ruta está activa
  const isActiveRoute = (path: string) => {
    if (path === '/') {
      return router.pathname === '/'
    }
    return router.pathname.startsWith(path)
  }

  return (
    <>
      {/* Decoraciones navideñas elaboradas - Parte superior */}
      {/* Decoraciones navideñas desactivadas por rendimiento */}

      <Box
        position="fixed"
        top={4}
        left="50%"
        transform="translateX(-50%)"
        zIndex={50}
        w="auto"
        maxW={{
          base: 'calc(95vw + 50px)', // < 480px - más espacio para 2 badges
          sm: 'calc(92vw + 60px)', // 480px - 768px
          md: 'calc(88vw + 70px)', // 768px - 992px (tablet portrait como 768x1024)
          lg: 'calc(85vw + 80px)', // 992px - 1200px
          xl: 'calc(80vw + 90px)', // 1200px - 1536px (como 1393x990)
          '2xl': 'calc(75vw + 100px)' // > 1536px
        }}
        minW={{
          base: '300px', // mínimo más pequeño para móvil
          sm: '380px', // tablet pequeña
          md: '480px', // tablet
          lg: '580px', // desktop pequeño
          xl: '650px' // desktop
        }}
      >
        <Box
          bg={floatingBg}
          sx={{
            backdropFilter: 'saturate(180%) blur(20px)',
            WebkitBackdropFilter: 'saturate(180%) blur(20px)',
            // Fallback para navegadores que no soportan backdrop-filter
            background: fallbackBg
          }}
          border="1px solid"
          borderColor={borderClr}
          borderRadius="2xl"
          boxShadow={shadow}
          px={{ base: 5, sm: 6, md: 8, lg: 12, xl: 14 }}
          py={{ base: 2, sm: 2.5, md: 0.5 }}
          position="relative"
        >
          {/* Decoraciones de borde desactivadas por rendimiento */}
          <HStack
            spacing={{ base: 2, sm: 3, md: 4, lg: 5 }}
            align="center"
            justify="space-between"
            w="full"
            minH={{ base: '36px', sm: '40px', md: '44px' }}
            maxH="50px"
          >
            {/* Logo con badge beta */}
            <Box flexShrink={0} minW={{ base: 'auto', lg: '150px', xl: '180px' }}>
              <ChakraLink
                as={NextLink}
                href="/"
                display="flex"
                alignItems="center"
                gap={{ base: 1, sm: 2 }}
                fontWeight="bold"
                fontSize={{ base: 'sm', sm: 'md', md: 'lg' }}
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
                  <Text whiteSpace="nowrap" fontSize={{ sm: 'sm', md: 'md', lg: 'lg' }}>
                    Luisardito Shop
                  </Text>
                  <Badge
                    colorScheme="blue"
                    fontSize={{ base: 'xx-small', sm: 'xs' }}
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
            </Box>

            {/* Enlaces de navegación con iconos flotantes - Solo desktop */}
            <HStack spacing={2} display={{ base: 'none', lg: 'flex' }} flex="1" justify="center">
              {/* Enlaces para usuarios autenticados */}
              {isAuthenticated && (
                <>
                  <Tooltip label="Tienda" placement="bottom">
                    <ChakraLink as={NextLink} href="/">
                      <IconButton
                        aria-label="Tienda"
                        icon={<Icon as={MdShoppingCart} boxSize={5} />}
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
                        icon={<Icon as={MdRedeem} boxSize={5} />}
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

                  {/* Leaderboard - Con badge NEW */}
                  <Tooltip label="Leaderboard" placement="bottom">
                    <ChakraLink as={NextLink} href="/leaderboard" onClick={handleLeaderboardClick}>
                      <Box position="relative">
                        <IconButton
                          aria-label="Leaderboard"
                          icon={<Icon as={MdLeaderboard} boxSize={5} />}
                          variant="ghost"
                          size="sm"
                          borderRadius="xl"
                          bg={isActiveRoute('/leaderboard') ? activeBg : 'transparent'}
                          boxShadow={isActiveRoute('/leaderboard') ? activeShadow : 'none'}
                          transform={isActiveRoute('/leaderboard') ? 'translateY(-2px)' : 'none'}
                          _hover={{
                            bg: hoverBg,
                            boxShadow: hoverShadow,
                            transform: 'translateY(-2px)',
                            transition: 'all 0.2s ease-in-out'
                          }}
                          transition="all 0.2s ease-in-out"
                        />
                        {showNewBadge && (
                          <Badge
                            position="absolute"
                            top="-4px"
                            right="-4px"
                            fontSize="9px"
                            px={1.5}
                            py={0.5}
                            borderRadius="full"
                            fontWeight="bold"
                            bg="linear-gradient(135deg, #48BB78, #38A169)"
                            color="white"
                            border="2px solid"
                            borderColor={badgeBorderColor}
                            boxShadow="0 2px 8px rgba(72, 187, 120, 0.4)"
                            animation="pulse 2s ease-in-out infinite"
                            sx={{
                              '@keyframes pulse': {
                                '0%, 100%': {
                                  transform: 'scale(1)',
                                  opacity: 1
                                },
                                '50%': {
                                  transform: 'scale(1.1)',
                                  opacity: 0.9
                                }
                              }
                            }}
                          >
                            NEW
                          </Badge>
                        )}
                      </Box>
                    </ChakraLink>
                  </Tooltip>

                  {/* Accesos de administrador */}
                  {user?.rol_id && [3, 4, 5].includes(user.rol_id) && (
                    <>
                      <Tooltip label="Usuarios" placement="bottom">
                        <ChakraLink as={NextLink} href="/admin/usuarios">
                          <IconButton
                            aria-label="Usuarios"
                            icon={<Icon as={MdGroup} boxSize={5} />}
                            variant="ghost"
                            size="sm"
                            borderRadius="xl"
                            bg={isActiveRoute('/admin/usuarios') ? activeBg : 'transparent'}
                            boxShadow={isActiveRoute('/admin/usuarios') ? activeShadow : 'none'}
                            transform={
                              isActiveRoute('/admin/usuarios') ? 'translateY(-2px)' : 'none'
                            }
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
                            icon={<Icon as={MdInventory} boxSize={5} />}
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
                            icon={
                              <Image
                                src="/images/logokick.png"
                                alt="Kick"
                                boxSize={5}
                                filter={kickLogoFilter}
                              />
                            }
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
                </>
              )}
            </HStack>

            {/* Controles del lado derecho */}
            <HStack
              spacing={{ base: 1, sm: 1.5, md: 2 }}
              align="center"
              flexShrink={0}
              minW={{
                base: 'auto',
                lg: hasTwoBadges ? '320px' : '280px',
                xl: hasTwoBadges ? '360px' : '320px'
              }}
              justify="flex-end"
            >
              {/* Botón de Sugerencia - Solo xl */}
              <Button
                leftIcon={<Icon as={MdSend} />}
                size="sm"
                bg={suggestionBtnBg}
                color={suggestionBtnColor}
                border="1px solid"
                borderColor={suggestionBtnBorder}
                borderRadius="xl"
                px={4}
                display={{ base: 'none', xl: 'inline-flex' }}
                flexShrink={0}
                _hover={{
                  bg: suggestionBtnHoverBg,
                  transform: 'translateY(-2px)',
                  boxShadow: 'md',
                  transition: 'all 0.2s ease-in-out'
                }}
                _active={{
                  transform: 'translateY(0)',
                  boxShadow: 'sm'
                }}
                transition="all 0.2s ease-in-out"
                onClick={() => window.open('https://form.typeform.com/to/In8zTBm6', '_blank')}
              >
                Sugerencia
              </Button>

              {/* Toggle de modo - Solo en tablet y desktop */}
              <Box display={{ base: 'none', md: 'block' }} flexShrink={0}>
                <ColorModeToggle />
              </Box>

              {/* Badge de puntos y botón de perfil para usuarios autenticados - Solo tablet y desktop */}
              {isAuthenticated && user && (
                <HStack
                  spacing={{ base: 1, md: 1.5 }}
                  display={{ base: 'none', md: 'flex' }}
                  align="center"
                  flexShrink={0}
                  flexWrap="nowrap"
                >
                  <UserBadge user={user as any} size="sm" />
                  {/* Badge de puntos */}
                  <Badge
                    colorScheme="yellow"
                    fontSize={{ base: 'xs', md: 'xs', xl: 'sm' }}
                    px={{ base: 2, md: 2, xl: 3 }}
                    py={{ base: 0.5, xl: 1 }}
                    borderRadius="full"
                    flexShrink={0}
                    whiteSpace="nowrap"
                  >
                    {user.puntos?.toLocaleString()} pts
                  </Badge>

                  {/* Advertencia de Discord no configurado */}
                  {!user.discord_info?.linked && (
                    <Tooltip
                      label="No has vinculado tu Discord. Ve a tu perfil para añadirlo."
                      placement="bottom"
                      hasArrow
                      bg="orange.500"
                      color="white"
                      fontSize="sm"
                      borderRadius="md"
                      p={3}
                    >
                      <Box
                        cursor="pointer"
                        onClick={() => router.push('/perfil')}
                        _hover={{
                          transform: 'scale(1.1)',
                          transition: 'all 0.2s'
                        }}
                        position="relative"
                      >
                        <Image
                          src="/images/discordlogo.png"
                          alt="Discord"
                          boxSize={5}
                          animation="pulse 2s infinite"
                          sx={{
                            '@keyframes pulse': {
                              '0%, 100%': { opacity: 1 },
                              '50%': { opacity: 0.5 }
                            }
                          }}
                        />
                        <Box
                          position="absolute"
                          top="-2px"
                          right="-2px"
                          bg="orange.500"
                          borderRadius="full"
                          boxSize="10px"
                        />
                      </Box>
                    </Tooltip>
                  )}

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
                          transform: 'translateY(-2px)'
                        }}
                        _active={{
                          bg: activeBg,
                          transform: 'translateY(0)'
                        }}
                        transition="all 0.3s ease"
                      >
                        <UserAvatarWithBadge user={user as any}>
                          <Avatar size="sm" name={avatarName} src={avatarSrc} />
                        </UserAvatarWithBadge>
                      </MenuButton>
                    </Tooltip>
                    <MenuList
                      borderRadius="xl"
                      border="1px solid"
                      borderColor={borderClr}
                      boxShadow={menuShadow}
                      maxW="250px"
                      minW="200px"
                      zIndex={1000}
                      p={2}
                      bg={menuBg}
                      sx={{
                        backdropFilter: 'saturate(180%) blur(20px)',
                        WebkitBackdropFilter: 'saturate(180%) blur(20px)'
                      }}
                    >
                      <VStack
                        spacing={1}
                        p={2}
                        borderBottom="1px solid"
                        borderColor={borderClr}
                        mb={1}
                      >
                        <UserAvatarWithBadge user={user as any}>
                          <Avatar size="md" name={avatarName} src={avatarSrc} />
                        </UserAvatarWithBadge>
                        <Text fontWeight="medium" fontSize="sm" whiteSpace="nowrap">
                          {user.kick_username || user.nickname || user.nombre || user.email}
                        </Text>
                        <UserBadge user={user as any} size="sm" />
                        <Badge colorScheme="yellow" fontSize="xs">
                          {user.puntos?.toLocaleString()} pts
                        </Badge>
                      </VStack>
                      <MenuItem
                        onClick={() => router.push('/perfil')}
                        borderRadius="lg"
                        whiteSpace="nowrap"
                        bg="transparent"
                        _hover={{
                          bg: menuItemHoverBg,
                          color: menuItemHoverColor
                        }}
                        _focus={{
                          bg: menuItemHoverBg,
                          color: menuItemHoverColor
                        }}
                        color={menuItemColor}
                      >
                        <HStack spacing={2} width="100%">
                          <Text>Mi Perfil</Text>
                          {!user.discord_username && (
                            <Image src="/images/discordlogo.png" alt="Discord" boxSize={4} />
                          )}
                        </HStack>
                      </MenuItem>
                      <MenuItem
                        onClick={() => router.push('/historial')}
                        borderRadius="lg"
                        whiteSpace="nowrap"
                        bg="transparent"
                        _hover={{
                          bg: menuItemHoverBg,
                          color: menuItemHoverColor
                        }}
                        _focus={{
                          bg: menuItemHoverBg,
                          color: menuItemHoverColor
                        }}
                        color={menuItemColor}
                      >
                        Historial de Puntos
                      </MenuItem>
                      <MenuItem
                        onClick={() => router.push('/canjes')}
                        borderRadius="lg"
                        whiteSpace="nowrap"
                        bg="transparent"
                        _hover={{
                          bg: menuItemHoverBg,
                          color: menuItemHoverColor
                        }}
                        _focus={{
                          bg: menuItemHoverBg,
                          color: menuItemHoverColor
                        }}
                        color={menuItemColor}
                      >
                        Mis Canjes
                      </MenuItem>
                      <MenuItem
                        onClick={() => router.push('/')}
                        borderRadius="lg"
                        whiteSpace="nowrap"
                        bg="transparent"
                        _hover={{
                          bg: menuItemHoverBg,
                          color: menuItemHoverColor
                        }}
                        _focus={{
                          bg: menuItemHoverBg,
                          color: menuItemHoverColor
                        }}
                        color={menuItemColor}
                      >
                        Catálogo
                      </MenuItem>
                      <Divider my={1} />
                      <MenuItem
                        onClick={handleLogout}
                        borderRadius="lg"
                        whiteSpace="nowrap"
                        bg="transparent"
                        color="red.500"
                        _hover={{
                          bg: logoutHoverBg,
                          color: logoutHoverColor
                        }}
                        _focus={{
                          bg: logoutHoverBg,
                          color: logoutHoverColor
                        }}
                      >
                        Cerrar Sesión
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </HStack>
              )}

              {/* Botón de login para usuarios no autenticados - Solo tablet y desktop */}
              {!isAuthenticated && !isLoading && (
                <ChakraLink as={NextLink} href="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    borderRadius="xl"
                    fontSize="xs"
                    px={{ base: 2, md: 3 }}
                    display={{ base: 'none', md: 'inline-flex' }}
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
              )}

              {/* Skeleton durante carga - Solo tablet y desktop */}
              {isLoading && (
                <HStack
                  spacing={{ base: 1, md: 2 }}
                  display={{ base: 'none', md: 'flex' }}
                  align="center"
                >
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
          </HStack>
        </Box>

        {/* Drawer móvil */}
        <Drawer
          isOpen={isOpen}
          placement="right"
          onClose={onClose}
          size={{ base: 'full', sm: 'xs' }}
        >
          <DrawerOverlay
            bg="rgba(0, 0, 0, 0.4)"
            sx={{
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)'
            }}
          />
          <DrawerContent
            borderRadius={{ base: '0', sm: 'xl' }}
            mr={{ base: 0, sm: 2 }}
            mt={{ base: 0, sm: 2 }}
            mb={{ base: 0, sm: 2 }}
            maxH={{ base: '100vh', sm: '95vh' }}
            bg={drawerBg}
            sx={{
              backdropFilter: 'saturate(180%) blur(20px)',
              WebkitBackdropFilter: 'saturate(180%) blur(20px)'
            }}
            boxShadow={drawerShadow}
          >
            <DrawerHeader display="flex" alignItems="center" justifyContent="space-between">
              <ChakraLink
                as={NextLink}
                href="/"
                display="flex"
                alignItems="center"
                gap={2}
                onClick={onClose}
              >
                <Image
                  src="/images/logo2.jpg"
                  alt="Luisardito Shop logo"
                  boxSize={6}
                  rounded="md"
                  objectFit="cover"
                />
                <HStack spacing={1}>
                  <Text fontWeight="bold">Luisardito Shop</Text>
                  <Badge colorScheme="blue" fontSize="xs">
                    beta
                  </Badge>
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
                  return (
                    <VStack align="stretch" spacing={2}>
                      <HStack justify="space-between">
                        <HStack>
                          <UserAvatarWithBadge user={user as any}>
                            <Avatar size="sm" name={avatarName} src={avatarSrc} />
                          </UserAvatarWithBadge>
                          <Text fontWeight="medium">{avatarName}</Text>
                        </HStack>
                        <Badge colorScheme="yellow">{user.puntos?.toLocaleString()} pts</Badge>
                      </HStack>

                      <UserBadge user={user as any} size="sm" />

                      {/* Alerta de Discord no vinculado */}
                      {!user.discord_info?.linked && (
                        <Box
                          p={3}
                          bg={discordAlertBg}
                          borderRadius="lg"
                          border="2px solid"
                          borderColor={discordAlertBorder}
                          cursor="pointer"
                          onClick={() => {
                            router.push('/perfil')
                            onClose()
                          }}
                          _hover={{
                            bg: discordAlertBgHover,
                            transform: 'scale(1.02)',
                            transition: 'all 0.2s'
                          }}
                          transition="all 0.2s"
                        >
                          <HStack spacing={2}>
                            <Image src="/images/discordlogo.png" alt="Discord" boxSize={5} />
                            <VStack align="start" spacing={0} flex={1}>
                              <Text fontSize="xs" fontWeight="bold" color={discordAlertTextBold}>
                                Discord no vinculado
                              </Text>
                              <Text fontSize="xs" color={discordAlertText}>
                                Toca aquí para vincularlo en tu perfil
                              </Text>
                            </VStack>
                          </HStack>
                        </Box>
                      )}

                      <Divider my={2} />

                      <ChakraLink as={NextLink} href="/" onClick={onClose}>
                        <Button
                          variant="ghost"
                          width="full"
                          justifyContent="flex-start"
                          leftIcon={<Icon as={MdShoppingCart} />}
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
                          leftIcon={<Icon as={MdRedeem} />}
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

                      <ChakraLink
                        as={NextLink}
                        href="/leaderboard"
                        onClick={() => {
                          handleLeaderboardClick()
                          onClose()
                        }}
                      >
                        <Button
                          variant="ghost"
                          width="full"
                          justifyContent="flex-start"
                          leftIcon={<Icon as={MdLeaderboard} />}
                          borderRadius="xl"
                          bg={isActiveRoute('/leaderboard') ? activeBg : 'transparent'}
                          boxShadow={isActiveRoute('/leaderboard') ? 'md' : 'none'}
                          _hover={{
                            bg: hoverBg,
                            transform: 'translateX(4px)',
                            transition: 'all 0.2s'
                          }}
                          transition="all 0.2s"
                        >
                          <HStack spacing={2} width="100%" justify="space-between">
                            <Text>Leaderboard</Text>
                            {showNewBadge && (
                              <Badge
                                fontSize="10px"
                                px={2}
                                py={0.5}
                                borderRadius="full"
                                fontWeight="bold"
                                bg="linear-gradient(135deg, #48BB78, #38A169)"
                                color="white"
                                boxShadow="0 2px 8px rgba(72, 187, 120, 0.4)"
                              >
                                NEW
                              </Badge>
                            )}
                          </HStack>
                        </Button>
                      </ChakraLink>

                      {user?.rol_id && [3, 4, 5].includes(user.rol_id) && (
                        <>
                          <Divider my={2} />

                          <ChakraLink as={NextLink} href="/admin/usuarios" onClick={onClose}>
                            <Button
                              variant="ghost"
                              width="full"
                              justifyContent="flex-start"
                              leftIcon={<Icon as={MdGroup} />}
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
                              leftIcon={<Icon as={MdInventory} />}
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
                              Canjes Admin
                            </Button>
                          </ChakraLink>
                          <ChakraLink as={NextLink} href="/admin/kick" onClick={onClose}>
                            <Button
                              variant="ghost"
                              width="full"
                              justifyContent="flex-start"
                              leftIcon={
                                <Image
                                  src="/images/logokick.png"
                                  alt="Kick"
                                  boxSize={5}
                                  filter={kickLogoFilter}
                                />
                              }
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
                          leftIcon={<Icon as={MdPerson} />}
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
                          <HStack spacing={2} width="100%" justify="space-between">
                            <Text>Mi Perfil</Text>
                            {!user.discord_username && (
                              <Image src="/images/discordlogo.png" alt="Discord" boxSize={5} />
                            )}
                          </HStack>
                        </Button>
                      </ChakraLink>
                      <ChakraLink as={NextLink} href="/historial" onClick={onClose}>
                        <Button
                          variant="ghost"
                          width="full"
                          justifyContent="flex-start"
                          leftIcon={<Icon as={MdHistory} />}
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
                          leftIcon={<Icon as={MdShoppingBag} />}
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

                      <Button
                        leftIcon={<Icon as={MdSend} />}
                        bg={suggestionBtnBg}
                        color={suggestionBtnColor}
                        border="1px solid"
                        borderColor={suggestionBtnBorder}
                        borderRadius="xl"
                        width="full"
                        justifyContent="center"
                        _hover={{
                          bg: suggestionBtnHoverBg,
                          transform: 'translateX(4px)',
                          transition: 'all 0.2s'
                        }}
                        transition="all 0.2s"
                        onClick={() => {
                          window.open('https://form.typeform.com/to/In8zTBm6', '_blank')
                          onClose()
                        }}
                      >
                        Enviar Sugerencia
                      </Button>

                      <Divider my={2} />

                      <Button colorScheme="red" onClick={handleLogout} borderRadius="xl">
                        Cerrar Sesión
                      </Button>

                      <Divider my={2} />

                      <ColorModeToggle />
                    </VStack>
                  )
                }

                return (
                  <VStack align="stretch" spacing={3}>
                    <ChakraLink
                      as={NextLink}
                      href="/leaderboard"
                      onClick={() => {
                        handleLeaderboardClick()
                        onClose()
                      }}
                    >
                      <Button
                        variant="ghost"
                        width="full"
                        justifyContent="flex-start"
                        leftIcon={<Icon as={MdLeaderboard} />}
                        borderRadius="xl"
                        bg={isActiveRoute('/leaderboard') ? activeBg : 'transparent'}
                        boxShadow={isActiveRoute('/leaderboard') ? 'md' : 'none'}
                        _hover={{
                          bg: hoverBg,
                          transform: 'translateX(4px)',
                          transition: 'all 0.2s'
                        }}
                        transition="all 0.2s"
                      >
                        <HStack spacing={2} width="100%" justify="space-between">
                          <Text>Leaderboard</Text>
                          {showNewBadge && (
                            <Badge
                              fontSize="10px"
                              px={2}
                              py={0.5}
                              borderRadius="full"
                              fontWeight="bold"
                              bg="linear-gradient(135deg, #48BB78, #38A169)"
                              color="white"
                              boxShadow="0 2px 8px rgba(72, 187, 120, 0.4)"
                            >
                              NEW
                            </Badge>
                          )}
                        </HStack>
                      </Button>
                    </ChakraLink>

                    <Divider my={2} />

                    <ChakraLink as={NextLink} href="/login" onClick={onClose}>
                      <Button variant="outline" width="full" borderRadius="xl">
                        Iniciar Sesión
                      </Button>
                    </ChakraLink>

                    <Divider my={2} />

                    <Button
                      leftIcon={<Icon as={MdSend} />}
                      bg={suggestionBtnBg}
                      color={suggestionBtnColor}
                      border="1px solid"
                      borderColor={suggestionBtnBorder}
                      borderRadius="xl"
                      width="full"
                      justifyContent="center"
                      _hover={{
                        bg: suggestionBtnHoverBg,
                        transform: 'translateX(4px)',
                        transition: 'all 0.2s'
                      }}
                      transition="all 0.2s"
                      onClick={() => {
                        window.open('https://form.typeform.com/to/In8zTBm6', '_blank')
                        onClose()
                      }}
                    >
                      Enviar Sugerencia
                    </Button>

                    <Divider my={2} />

                    <ColorModeToggle />
                  </VStack>
                )
              })()}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Box>
    </>
  )
}
