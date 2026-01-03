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
import { useState, useEffect, useRef } from 'react'
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
import { UserBadge, UserAvatarWithBadge, KickVipIcon, KickSubIcon } from './UserBadge'
import { NotificationBell } from './NotificationBell'

// Componente de contenido de navbar con soporte para badges VIP y SUB
export default function NavbarContent() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [showNewBadge, setShowNewBadge] = useState(true)

  // Estados para controlar animaciones independientes
  const [animatingButtons, setAnimatingButtons] = useState<Set<string>>(new Set())

  // useRef para mantener track de los timeouts y evitar conflictos
  const timeoutRefs = useRef<Record<string, NodeJS.Timeout>>({})

  // Determinar qué avatar usar: Kick > inicial del nombre
  const avatarSrc = user ? user.kick_data?.avatar_url || user.avatar_url || user.kick_avatar || undefined : undefined
  const avatarName = user ? user.nickname || user.kick_username || user.display_name || user.nombre || user.email : ''

  // Detectar si el usuario tiene 2 badges (VIP + SUB)
  const vipInfo = user?.vip_info || user?.vip_status
  const isSubscriber = user?.subscriber_status?.is_active || user?.user_type === 'subscriber'
  const hasTwoBadges = Boolean(vipInfo?.is_active && isSubscriber)

  // Check if user has visited leaderboard before - Solo en cliente
  useEffect(() => {
    const hasVisited = localStorage.getItem('leaderboard_visited')
    setShowNewBadge(!hasVisited)
  }, [])

  // Limpiar timeouts al desmontar el componente
  useEffect(() => {
    return () => {
      Object.values(timeoutRefs.current).forEach(timeout => clearTimeout(timeout))
    }
  }, [])

  const handleLeaderboardClick = () => {
    localStorage.setItem('leaderboard_visited', 'true')
    setShowNewBadge(false)
  }

  const handleMouseEnter = (buttonId: string) => {
    // Limpiar timeout existente si lo hay
    if (timeoutRefs.current[buttonId]) {
      clearTimeout(timeoutRefs.current[buttonId])
      delete timeoutRefs.current[buttonId]
    }

    setAnimatingButtons(prev => new Set(prev).add(buttonId))
  }

  const handleMouseLeave = (buttonId: string) => {
    // Limpiar timeout anterior si existe
    if (timeoutRefs.current[buttonId]) {
      clearTimeout(timeoutRefs.current[buttonId])
    }

    // Mantener la animación durante 0.8s más después de quitar el cursor
    timeoutRefs.current[buttonId] = setTimeout(() => {
      setAnimatingButtons(prev => {
        const newSet = new Set(prev)
        newSet.delete(buttonId)
        return newSet
      })
      delete timeoutRefs.current[buttonId]
    }, 800)
  }

  // Definir todos los colores incondicionalmente para evitar cambios en el orden de hooks
  const floatingBg = useColorModeValue('rgba(255, 255, 255, 0.15)', 'rgba(13, 17, 23, 0.15)')
  const borderClr = useColorModeValue('rgba(208, 215, 222, 0.02)', 'rgba(66, 74, 83, 0.02)')
  const shadow = useColorModeValue('0 8px 32px rgba(0,0,0,0.080)', '0 8px 32px rgba(0,0,0,0.14)')
  const hoverBg = useColorModeValue('rgba(59, 130, 246, 0.12)', 'rgba(96, 165, 250, 0.18)')
  const hoverShadow = useColorModeValue(
    '0 4px 12px rgba(59, 130, 246, 0.2)',
    '0 4px 12px rgba(96, 165, 250, 0.3)'
  )
  const activeBg = useColorModeValue('rgba(59, 130, 246, 0.2)', 'rgba(96, 165, 250, 0.28)')
  const activeShadow = useColorModeValue(
    '0 4px 12px rgba(59, 130, 246, 0.3)',
    '0 4px 12px rgba(96, 165, 250, 0.4)'
  )

  // Sombras interiores con desenfoque gaussiano para hover y active en iconos
  // Efecto de burbuja con múltiples capas y glow
  const iconHoverInset = useColorModeValue(
    'inset 0 0 12px rgba(59, 130, 246, 0.4), inset 0 0 20px rgba(59, 130, 246, 0.15), inset 0 -2px 4px rgba(255, 255, 255, 0.3)',
    'inset 0 0 12px rgba(96, 165, 250, 0.5), inset 0 0 20px rgba(96, 165, 250, 0.2), inset 0 -2px 4px rgba(255, 255, 255, 0.1)'
  )
  const iconActiveInset = useColorModeValue(
    'inset 0 0 16px rgba(59, 130, 246, 0.5), inset 0 0 28px rgba(59, 130, 246, 0.25), inset 0 -2px 6px rgba(255, 255, 255, 0.4)',
    'inset 0 0 16px rgba(96, 165, 250, 0.6), inset 0 0 28px rgba(96, 165, 250, 0.3), inset 0 -2px 6px rgba(255, 255, 255, 0.15)'
  )

  // Colores para el menú - con efecto de absorción de colores del fondo
  const menuBg = useColorModeValue('rgba(255, 255, 255, 0.075)', 'rgba(13, 17, 23, 0.075)')
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
  const drawerBg = useColorModeValue('rgba(255, 255, 255, 1)', 'rgba(13, 17, 23, 1)')
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

  const handleLogout = () => {
    logout()
    onClose()
  }

  // Función para verificar si una ruta está activa - Comparación exacta
  const isActiveRoute = (path: string) => {
    if (path === '/') {
      return router.pathname === '/'
    }
    return router.pathname === path || router.pathname.startsWith(path + '/')
  }

  return (
    <>
      <Box
        position="fixed"
        top={4}
        left="50%"
        transform="translateX(-50%)"
        zIndex={50}
        w="auto"
        maxW={{
          base: 'calc(95vw + 50px)',
          sm: 'calc(92vw + 60px)',
          md: 'calc(88vw + 70px)',
          lg: 'calc(85vw + 80px)',
          xl: 'calc(80vw + 90px)',
          '2xl': 'calc(75vw + 100px)'
        }}
        minW={{
          base: '300px',
          sm: '380px',
          md: '480px',
          lg: '580px',
          xl: '650px'
        }}
      >
        <Box
          bg={floatingBg}
          sx={{
            backdropFilter: 'saturate(180%) blur(20px)',
            WebkitBackdropFilter: 'saturate(180%) blur(20px)',
            background: fallbackBg
          }}
          border="1px solid"
          borderColor={borderClr}
          borderRadius="2xl"
          boxShadow={shadow}
          px={{ base: 3, sm: 4, md: 6, lg: 8, xl: 10 }}
          py={{ base: 0.5, sm: 0.5, md: 0.5, lg: 1, xl: 1 }}
          position="relative"
        >
          {/* NAVBAR ESTRUCTURA: Izquierda | Centro | Derecha */}
          <HStack
            spacing={2}
            align="center"
            justify="space-between"
            w="full"
            minH={{ base: '37px', sm: '41px', md: '37px', lg: '41px' }}
            h={{ base: '37px', sm: '41px', md: '37px', lg: '41px' }}
          >
            {/* ============ SECCIÓN IZQUIERDA: Logo ============ */}
            <Box flex={1} display="flex" alignItems="center" minW="0">
              <ChakraLink
                as={NextLink}
                href="/"
                display="flex"
                alignItems="center"
                gap={{ base: 0.5, sm: 2 }}
                fontWeight="bold"
                fontSize={{ base: '9px', sm: 'lg', md: 'xl' }}
                _hover={{
                  opacity: 0.8,
                  transform: 'scale(1.05)',
                  transition: 'all 0.2s',
                  textDecoration: 'none'
                }}
              >
                <Image
                  src="/images/logo2.jpg"
                  alt="Luisardito Shop logo"
                  boxSize={{ base: 4, sm: 8, md: 8 }}
                  rounded="md"
                  objectFit="cover"
                  flexShrink={0}
                />
                {/* Mostrar "LS" en móvil, nombre completo en desktop */}
                <Badge
                  colorScheme="blue"
                  fontSize={{ base: '7px', sm: 'md' }}
                  px={{ base: 1, sm: 3 }}
                  py={{ base: 0.5, sm: 1.5 }}
                  borderRadius="sm"
                  display={{ base: 'block', sm: 'none' }}
                >
                  LS
                </Badge>
                <HStack spacing={2.5} display={{ base: 'none', sm: 'flex' }} mr={{ base: 0, sm: 2, md: 3, lg: 4 }}>
                  <Text whiteSpace="nowrap" fontSize={{ sm: 'sm', md: 'md', lg: 'md' }}>
                    Luisardito Shop
                  </Text>
                  <Badge
                    colorScheme="blue"
                    fontSize={{ base: '8px', sm: '9px', md: '10px', lg: '10px' }}
                    px={{ base: 2, sm: 2, md: 2, lg: 2 }}
                    py={{ base: 0.5, sm: 1, lg: 1 }}
                    borderRadius="sm"
                  >
                    beta
                  </Badge>
                </HStack>
              </ChakraLink>
            </Box>

            {/* Separador vertical entre logo e iconos */}
            {isAuthenticated && (
              <Divider
                orientation="vertical"
                h="24px"
                my="auto"
                borderColor={useColorModeValue('rgba(208, 215, 222, 0.6)', 'rgba(66, 74, 83, 0.6)')}
                borderWidth="1px"
                display={{ base: 'none', lg: 'block' }}
              />
            )}

            {/* ============ SECCIÓN CENTRO: Iconos de Navegación para TODAS las resoluciones ============ */}
            <HStack spacing={{ base: 0.5, sm: 1, md: 1.5, lg: 1.5 }} flex={1} justify="center" display={isAuthenticated ? { base: 'flex', md: 'none', lg: 'flex' } : 'none'}>
              {isAuthenticated && (
                <>
                  {/* Tienda */}
                  <Tooltip label="Tienda" placement="bottom" hasArrow fontSize="xs">
                    <ChakraLink as={NextLink} href="/productos" _hover={{ textDecoration: 'none' }}>
                      <Box
                        w={{ base: '32px', sm: '36px', lg: '36px' }}
                        h={{ base: '32px', sm: '36px', lg: '36px' }}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        borderRadius="lg"
                        bg="transparent"
                        cursor="pointer"
                        transition="all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
                        boxShadow={isActiveRoute('/productos') ? iconActiveInset : 'none'}
                        _hover={{
                          boxShadow: iconHoverInset
                        }}
                      >
                        <Icon as={MdShoppingCart} boxSize={{ base: 4, sm: 5, lg: 5 }} />
                      </Box>
                    </ChakraLink>
                  </Tooltip>

                  {/* Canjes */}
                  <Tooltip label="Mis Canjes" placement="bottom" hasArrow fontSize="xs">
                    <ChakraLink as={NextLink} href="/canjes" _hover={{ textDecoration: 'none' }}>
                      <Box
                        w={{ base: '32px', sm: '36px', lg: '36px' }}
                        h={{ base: '32px', sm: '36px', lg: '36px' }}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        borderRadius="lg"
                        bg="transparent"
                        cursor="pointer"
                        transition="all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
                        boxShadow={isActiveRoute('/canjes') ? iconActiveInset : 'none'}
                        _hover={{
                          boxShadow: iconHoverInset
                        }}
                      >
                        <Icon as={MdRedeem} boxSize={{ base: 4, sm: 5, lg: 5 }} />
                      </Box>
                    </ChakraLink>
                  </Tooltip>

                  {/* Leaderboard */}
                  <Tooltip label="Leaderboard" placement="bottom" hasArrow fontSize="xs">
                    <ChakraLink as={NextLink} href="/leaderboard" _hover={{ textDecoration: 'none' }}>
                      <Box
                        w={{ base: '32px', sm: '36px', lg: '36px' }}
                        h={{ base: '32px', sm: '36px', lg: '36px' }}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        borderRadius="lg"
                        bg="transparent"
                        cursor="pointer"
                        transition="all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
                        boxShadow={isActiveRoute('/leaderboard') ? iconActiveInset : 'none'}
                        _hover={{
                          boxShadow: iconHoverInset
                        }}
                      >
                        <Icon as={MdLeaderboard} boxSize={{ base: 4, sm: 5, lg: 5 }} />
                      </Box>
                    </ChakraLink>
                  </Tooltip>

                  {/* Separador vertical entre usuario y admin */}
                  {user?.rol_id && [3, 4, 5].includes(user.rol_id) && (
                    <Divider
                      orientation="vertical"
                      h="24px"
                      my="auto"
                      borderColor={useColorModeValue('rgba(208, 215, 222, 0.6)', 'rgba(66, 74, 83, 0.6)')}
                      borderWidth="1px"
                      display={{ base: 'none', sm: 'block' }}
                    />
                  )}

                  {/* Usuarios (Admin) - Si es admin */}
                  {user?.rol_id && [3, 4, 5].includes(user.rol_id) && (
                    <Tooltip label="Usuarios" placement="bottom" hasArrow fontSize="xs">
                      <ChakraLink as={NextLink} href="/admin/usuarios" _hover={{ textDecoration: 'none' }}>
                        <Box
                          w={{ base: '32px', sm: '36px', lg: '36px' }}
                          h={{ base: '32px', sm: '36px', lg: '36px' }}
                          display={{ base: 'none', sm: 'flex' }}
                          alignItems="center"
                          justifyContent="center"
                          borderRadius="lg"
                          bg="transparent"
                          cursor="pointer"
                          transition="all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
                          boxShadow={isActiveRoute('/admin/usuarios') ? iconActiveInset : 'none'}
                          _hover={{
                            boxShadow: iconHoverInset
                          }}
                        >
                          <Icon as={MdGroup} boxSize={{ base: 4, sm: 5, lg: 5 }} />
                        </Box>
                      </ChakraLink>
                    </Tooltip>
                  )}

                  {/* Canjes Admin - Si es admin */}
                  {user?.rol_id && [3, 4, 5].includes(user.rol_id) && (
                    <Tooltip label="Canjes Admin" placement="bottom" hasArrow fontSize="xs">
                      <ChakraLink as={NextLink} href="/admin/canjes" _hover={{ textDecoration: 'none' }}>
                        <Box
                          w={{ base: '32px', sm: '36px', lg: '36px' }}
                          h={{ base: '32px', sm: '36px', lg: '36px' }}
                          display={{ base: 'none', sm: 'flex' }}
                          alignItems="center"
                          justifyContent="center"
                          borderRadius="lg"
                          bg="transparent"
                          cursor="pointer"
                          transition="all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
                          boxShadow={isActiveRoute('/admin/canjes') ? iconActiveInset : 'none'}
                          _hover={{
                            boxShadow: iconHoverInset
                          }}
                        >
                          <Icon as={MdInventory} boxSize={{ base: 4, sm: 5, lg: 5 }} />
                        </Box>
                      </ChakraLink>
                    </Tooltip>
                  )}

                  {/* Kick Admin - Si es admin */}
                  {user?.rol_id && [3, 4, 5].includes(user.rol_id) && (
                    <Tooltip label="Configuración Kick" placement="bottom" hasArrow fontSize="xs">
                      <ChakraLink as={NextLink} href="/admin/kick" _hover={{ textDecoration: 'none' }}>
                        <Box
                          w={{ base: '32px', sm: '36px', lg: '36px' }}
                          h={{ base: '32px', sm: '36px', lg: '36px' }}
                          display={{ base: 'none', sm: 'flex' }}
                          alignItems="center"
                          justifyContent="center"
                          borderRadius="lg"
                          bg="transparent"
                          cursor="pointer"
                          transition="all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
                          boxShadow={isActiveRoute('/admin/kick') ? iconActiveInset : 'none'}
                          _hover={{
                            boxShadow: iconHoverInset
                          }}
                        >
                          <Image src="/images/logokick.png" alt="Kick" boxSize={5} filter={kickLogoFilter} />
                        </Box>
                      </ChakraLink>
                    </Tooltip>
                  )}
                </>
              )}
            </HStack>

            {/* Separador vertical entre centro y derecha */}
            {isAuthenticated && (
              <Divider
                orientation="vertical"
                h="24px"
                my="auto"
                borderColor={useColorModeValue('rgba(208, 215, 222, 0.6)', 'rgba(66, 74, 83, 0.6)')}
                borderWidth="1px"
                display={{ base: 'none', lg: 'block' }}
              />
            )}

            {/* ============ SECCIÓN DERECHA: Sugerencia, Controles, Badges, Perfil ============ */}
            <HStack spacing={{ base: 0.5, sm: 1, md: 1.5 }} flex={1} justify="flex-end" align="center">
              {/* Botón Sugerencia - Desktop */}
              <Button
                leftIcon={<Icon as={MdSend} />}
                size="xs"
                borderRadius="lg"
                display={{ base: 'none', lg: 'inline-flex' }}
                flexShrink={0}
                onClick={() => window.open('https://form.typeform.com/to/In8zTBm6', '_blank')}
                bg={suggestionBtnBg}
                color={suggestionBtnColor}
                border="1px solid"
                borderColor={suggestionBtnBorder}
                _hover={{
                  bg: suggestionBtnHoverBg,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s'
                }}
                transition="all 0.2s"
              >
                Sugerencia
              </Button>

              {/* Color Mode Toggle */}
              <Box flexShrink={0}>
                <ColorModeToggle />
              </Box>

              {/* Separador vertical antes de badges VIP/SUB */}
              {isAuthenticated && user && (
                <Divider
                  orientation="vertical"
                  h="24px"
                  my="auto"
                  borderColor={useColorModeValue('rgba(208, 215, 222, 0.6)', 'rgba(66, 74, 83, 0.6)')}
                  borderWidth="1px"
                  display={{ base: 'none', lg: 'block' }}
                />
              )}

              {/* Badges VIP y SUB */}
              {isAuthenticated && user && (
                <HStack spacing={1} display="flex" flexShrink={0} mx={hasTwoBadges ? { base: 2, sm: 3 } : { base: 1, sm: 2 }}>
                  {(user.subscriber_status?.is_active || user.user_type === 'subscriber') && (
                    <Tooltip label="Suscriptor" placement="bottom" hasArrow fontSize="xs">
                      <Box w={{ base: '20px', sm: '24px', lg: '28px' }} h={{ base: '20px', sm: '24px', lg: '28px' }} display="flex" alignItems="center" justifyContent="center" flexShrink={0} cursor="pointer" transition="all 0.2s ease-in-out" _hover={{ transform: 'scale(1.2)' }}>
                        <KickSubIcon size={{ base: 14, sm: 18, lg: 20 }} />
                      </Box>
                    </Tooltip>
                  )}

                  {(user.vip_info?.is_active || user.vip_status?.is_active) && (
                    <Tooltip
                      label="Usuario VIP"
                      placement="bottom"
                      hasArrow
                      fontSize="xs"
                    >
                      <Box w={{ base: '20px', sm: '24px', lg: '28px' }} h={{ base: '20px', sm: '24px', lg: '28px' }} display="flex" alignItems="center" justifyContent="center" flexShrink={0} cursor="pointer" transition="all 0.2s ease-in-out" _hover={{ transform: 'scale(1.2)' }}>
                        <KickVipIcon size={{ base: 14, sm: 18, lg: 20 }} />
                      </Box>
                    </Tooltip>
                  )}
                </HStack>
              )}

              {/* Puntos */}
              {isAuthenticated && user && (
                <Badge
                  colorScheme="yellow"
                  fontSize={{ base: '14px', sm: 'md', md: 'md', lg: '14px' }}
                  px={{ base: 4, sm: 5, md: 5, lg: 4 }}
                  py={{ base: 1.5, sm: 2.5, lg: 1 }}
                  borderRadius="full"
                  display={{ base: 'none', lg: 'block' }}
                  flexShrink={0}
                  whiteSpace="nowrap"
                  fontWeight="bold"
                >
                  {user.puntos?.toLocaleString()} pts
                </Badge>
              )}


              {/* Perfil o Login - Desktop */}
              {isAuthenticated && user ? (
                <HStack spacing={1} flexShrink={0}>
                  <Menu>
                    <Tooltip label="Perfil" placement="bottom" hasArrow>
                      <MenuButton
                        as={IconButton}
                        icon={<Avatar size={{ base: 'xs', sm: 'sm' }} name={avatarName} src={avatarSrc} />}
                        variant="ghost"
                        borderRadius="full"
                        display={{ base: 'none', lg: 'inline-flex' }}
                        flexShrink={0}
                        minW="auto"
                        h="auto"
                        p={0}
                      />
                    </Tooltip>
                    <MenuList
                    borderRadius="xl"
                    border="1px solid"
                    borderColor={borderClr}
                    boxShadow={menuShadow}
                    maxW="250px"
                    minW="200px"
                    zIndex={1000}
                    p={3}
                    bg={useColorModeValue('rgba(255, 255, 255, 0.95)', 'rgba(13, 17, 23, 0.95)')}
                    sx={{
                      backdropFilter: 'saturate(200%) blur(20px) contrast(1.2)',
                      WebkitBackdropFilter: 'saturate(200%) blur(20px) contrast(1.2)',
                      borderColor: useColorModeValue('rgba(208, 215, 222, 0.3)', 'rgba(66, 74, 83, 0.3)'),
                      boxShadow: useColorModeValue(
                        '0 20px 40px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.8)',
                        '0 20px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
                      )
                    }}
                  >
                    <VStack spacing={2} p={2} borderBottom="1px solid" borderColor={borderClr} mb={2}>
                      <Avatar size="md" name={avatarName} src={avatarSrc} />
                      <Text fontWeight="bold" fontSize="sm">
                        {user.nickname || user.nombre || user.email}
                      </Text>
                      <UserBadge user={user as any} size="sm" />
                    </VStack>
                    <MenuItem
                      onClick={() => router.push('/perfil')}
                      borderRadius="lg"
                      px={3}
                      py={2}
                      color={useColorModeValue('gray.800', 'gray.50')}
                      bg={useColorModeValue('transparent', 'rgba(66, 74, 83, 0.00)')}
                      _hover={{
                        bg: useColorModeValue('rgba(59, 130, 246, 0.15)', 'rgba(96, 165, 250, 0.25)'),
                        color: useColorModeValue('blue.600', 'blue.200')
                      }}
                      transition="all 0.2s"
                    >
                      Mi Perfil
                    </MenuItem>
                    <MenuItem
                      onClick={() => router.push('/historial')}
                      borderRadius="lg"
                      px={3}
                      py={2}
                      color={useColorModeValue('gray.800', 'gray.50')}
                      bg={useColorModeValue('transparent', 'rgba(66, 74, 83, 0.00)')}
                      _hover={{
                        bg: useColorModeValue('rgba(59, 130, 246, 0.15)', 'rgba(96, 165, 250, 0.25)'),
                        color: useColorModeValue('blue.600', 'blue.200')
                      }}
                      transition="all 0.2s"
                    >
                      Historial
                    </MenuItem>
                    <MenuItem
                      onClick={() => router.push('/canjes')}
                      borderRadius="lg"
                      px={3}
                      py={2}
                      color={useColorModeValue('gray.800', 'gray.50')}
                      bg={useColorModeValue('transparent', 'rgba(66, 74, 83, 0.00)')}
                      _hover={{
                        bg: useColorModeValue('rgba(59, 130, 246, 0.15)', 'rgba(96, 165, 250, 0.25)'),
                        color: useColorModeValue('blue.600', 'blue.200')
                      }}
                      transition="all 0.2s"
                    >
                      Mis Canjes
                    </MenuItem>
                    <Divider my={2} />
                    <MenuItem
                      onClick={handleLogout}
                      color={useColorModeValue('red.600', 'red.400')}
                      borderRadius="lg"
                      px={3}
                      py={2}
                      bg={useColorModeValue('transparent', 'rgba(66, 74, 83, 0.00)')}
                      _hover={{
                        bg: useColorModeValue('rgba(239, 68, 68, 0.15)', 'rgba(248, 113, 113, 0.25)'),
                        color: useColorModeValue('red.700', 'red.300')
                      }}
                      transition="all 0.2s"
                    >
                      Cerrar Sesión
                    </MenuItem>
                  </MenuList>
                </Menu>

                {/* Notificaciones Bell - A la derecha del avatar */}
                <NotificationBell />
              </HStack>
            ) : (
                <ChakraLink as={NextLink} href="/login" display={{ base: 'none', lg: 'block' }} flexShrink={0}>
                  <Button size="xs" borderRadius="lg">
                    Login
                  </Button>
                </ChakraLink>
              )}

              {/* Hamburguesa - Solo móvil y tablet */}
              <IconButton
                aria-label="Abrir menú"
                icon={<HamburgerIcon boxSize={4} />}
                variant="ghost"
                onClick={onOpen}
                display={{ base: 'inline-flex', lg: 'none' }}
                borderRadius="lg"
                size="xs"
                minW="auto"
                h="auto"
                p={1}
                flexShrink={0}
                transition="all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
                _hover={{
                  boxShadow: iconHoverInset,
                  transform: 'translateY(-1px)'
                }}
              />
            </HStack>
          </HStack>
        </Box>
        {/* Drawer del menú móvil y tablet */}
        <Drawer
          isOpen={isOpen}
          placement="right"
          onClose={onClose}
          size={{ base: 'full', md: 'xs' }}
        >
          <DrawerOverlay
            bg="rgba(0, 0, 0, 0.75)"
            sx={{
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              '@media (max-width: 768px)': {
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)'
              }
            }}
          />
          <DrawerContent
            borderRadius={{ base: '0', md: 'xl' }}
            mr={{ base: 0, md: 2 }}
            mt={{ base: 0, md: 2 }}
            mb={{ base: 0, md: 2 }}
            maxH={{ base: '100vh', md: '95vh' }}
            bg={drawerBg}
            sx={{
              backdropFilter: 'saturate(200%) blur(10px) contrast(1.1)',
              WebkitBackdropFilter: 'saturate(200%) blur(10px) contrast(1.1)',
              '@media (max-width: 768px)': {
                backdropFilter: 'none',
                WebkitBackdropFilter: 'none',
                willChange: 'transform',
                transform: 'translate3d(0, 0, 0)'
              }
            }}
            boxShadow={drawerShadow}
            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          >
            <DrawerHeader display="flex" alignItems="center" justifyContent="space-between">
              <ChakraLink
                as={NextLink}
                href="/"
                display="flex"
                alignItems="center"
                gap={2}
                onClick={onClose}
                _hover={{ textDecoration: 'none' }}
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
                          <UserBadge user={user as any} size="sm" />
                        </HStack>
                        <Badge colorScheme="yellow">{user.puntos?.toLocaleString()} pts</Badge>
                      </HStack>

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

                      <Box width="full" py={2}>
                        <ColorModeToggle />
                      </Box>

                      <Divider my={2} />

                      <ChakraLink as={NextLink} href="/productos" onClick={onClose} _hover={{ textDecoration: 'none' }}>
                        <Button
                          variant="ghost"
                          width="full"
                          justifyContent="flex-start"
                          leftIcon={<Icon as={MdShoppingCart} />}
                          borderRadius="xl"
                          bg={isActiveRoute('/productos') ? activeBg : 'transparent'}
                          _hover={{ bg: hoverBg, transform: 'translateX(4px)', transition: 'all 0.2s' }}
                          transition="all 0.2s"
                        >
                          Tienda
                        </Button>
                      </ChakraLink>

                      <ChakraLink as={NextLink} href="/canjes" onClick={onClose} _hover={{ textDecoration: 'none' }}>
                        <Button
                          variant="ghost"
                          width="full"
                          justifyContent="flex-start"
                          leftIcon={<Icon as={MdRedeem} />}
                          borderRadius="xl"
                          _hover={{ bg: hoverBg, transform: 'translateX(4px)', transition: 'all 0.2s' }}
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
                        _hover={{ textDecoration: 'none' }}
                      >
                        <Button
                          variant="ghost"
                          width="full"
                          justifyContent="flex-start"
                          leftIcon={<Icon as={MdLeaderboard} />}
                          borderRadius="xl"
                          _hover={{ bg: hoverBg, transform: 'translateX(4px)', transition: 'all 0.2s' }}
                          transition="all 0.2s"
                        >
                          <HStack spacing={2} width="100%" justify="space-between">
                            <Text>Leaderboard</Text>
                            {showNewBadge && (
                              <Badge fontSize="10px" px={2} py={0.5} borderRadius="full" fontWeight="bold" bg="linear-gradient(135deg, #48BB78, #38A169)" color="white">
                                NEW
                              </Badge>
                            )}
                          </HStack>
                        </Button>
                      </ChakraLink>

                      {user?.rol_id && [3, 4, 5].includes(user.rol_id) && (
                        <>
                          <Divider my={2} />
                          <ChakraLink as={NextLink} href="/admin/usuarios" onClick={onClose} _hover={{ textDecoration: 'none' }}>
                            <Button variant="ghost" width="full" justifyContent="flex-start" leftIcon={<Icon as={MdGroup} />} borderRadius="xl" _hover={{ bg: hoverBg, transform: 'translateX(4px)', transition: 'all 0.2s' }} transition="all 0.2s">
                              Usuarios
                            </Button>
                          </ChakraLink>
                          <ChakraLink as={NextLink} href="/admin/canjes" onClick={onClose} _hover={{ textDecoration: 'none' }}>
                            <Button variant="ghost" width="full" justifyContent="flex-start" leftIcon={<Icon as={MdInventory} />} borderRadius="xl" _hover={{ bg: hoverBg, transform: 'translateX(4px)', transition: 'all 0.2s' }} transition="all 0.2s">
                              Canjes Admin
                            </Button>
                          </ChakraLink>
                          <ChakraLink as={NextLink} href="/admin/kick" onClick={onClose} _hover={{ textDecoration: 'none' }}>
                            <Button variant="ghost" width="full" justifyContent="flex-start" leftIcon={<Image src="/images/logokick.png" alt="Kick" boxSize={5} filter={kickLogoFilter} />} borderRadius="xl" _hover={{ bg: hoverBg, transform: 'translateX(4px)', transition: 'all 0.2s' }} transition="all 0.2s">
                              Kick
                            </Button>
                          </ChakraLink>
                        </>
                      )}

                      <Divider my={2} />

                      <ChakraLink as={NextLink} href="/perfil" onClick={onClose} _hover={{ textDecoration: 'none' }}>
                        <Button variant="ghost" width="full" justifyContent="flex-start" leftIcon={<Icon as={MdPerson} />} borderRadius="xl" _hover={{ bg: hoverBg, transform: 'translateX(4px)', transition: 'all 0.2s' }} transition="all 0.2s">
                          <HStack spacing={2} width="100%" justify="space-between">
                            <Text>Mi Perfil</Text>
                            {!user.discord_username && <Image src="/images/discordlogo.png" alt="Discord" boxSize={5} />}
                          </HStack>
                        </Button>
                      </ChakraLink>

                      <ChakraLink as={NextLink} href="/historial" onClick={onClose} _hover={{ textDecoration: 'none' }}>
                        <Button variant="ghost" width="full" justifyContent="flex-start" leftIcon={<Icon as={MdHistory} />} borderRadius="xl" _hover={{ bg: hoverBg, transform: 'translateX(4px)', transition: 'all 0.2s' }} transition="all 0.2s">
                          Historial de Puntos
                        </Button>
                      </ChakraLink>

                      <Divider my={2} />

                      <Button leftIcon={<Icon as={MdSend} />} bg={suggestionBtnBg} color={suggestionBtnColor} border="1px solid" borderColor={suggestionBtnBorder} borderRadius="xl" width="full" justifyContent="center" _hover={{ bg: suggestionBtnHoverBg, transform: 'translateX(4px)', transition: 'all 0.2s' }} transition="all 0.2s" onClick={() => { window.open('https://form.typeform.com/to/In8zTBm6', '_blank'); onClose() }}>
                        Enviar Sugerencia
                      </Button>

                      <Divider my={2} />

                      <Button colorScheme="red" onClick={handleLogout} borderRadius="xl">
                        Cerrar Sesión
                      </Button>
                    </VStack>
                  )
                }

                return (
                  <VStack align="stretch" spacing={3}>
                    <ChakraLink as={NextLink} href="/leaderboard" onClick={() => { handleLeaderboardClick(); onClose() }} _hover={{ textDecoration: 'none' }}>
                      <Button variant="ghost" width="full" justifyContent="flex-start" leftIcon={<Icon as={MdLeaderboard} />} borderRadius="xl" _hover={{ bg: hoverBg, transform: 'translateX(4px)', transition: 'all 0.2s' }} transition="all 0.2s">
                        <HStack spacing={2} width="100%" justify="space-between">
                          <Text>Leaderboard</Text>
                          {showNewBadge && <Badge fontSize="10px" px={2} py={0.5} borderRadius="full" fontWeight="bold" bg="linear-gradient(135deg, #48BB78, #38A169)" color="white">
                            NEW
                          </Badge>}
                        </HStack>
                      </Button>
                    </ChakraLink>

                    <Divider my={2} />

                    <Box width="full" mb={2} py={2}>
                      <ColorModeToggle />
                    </Box>

                    <Divider my={2} />

                    <ChakraLink as={NextLink} href="/login" onClick={onClose} _hover={{ textDecoration: 'none' }}>
                      <Button variant="outline" width="full" borderRadius="xl">
                        Iniciar Sesión
                      </Button>
                    </ChakraLink>

                    <Divider my={2} />

                    <Button leftIcon={<Icon as={MdSend} />} bg={suggestionBtnBg} color={suggestionBtnColor} border="1px solid" borderColor={suggestionBtnBorder} borderRadius="xl" width="full" justifyContent="center" _hover={{ bg: suggestionBtnHoverBg, transform: 'translateX(4px)', transition: 'all 0.2s' }} transition="all 0.2s" onClick={() => { window.open('https://form.typeform.com/to/In8zTBm6', '_blank'); onClose() }}>
                      Enviar Sugerencia
                    </Button>

                    <Divider my={2} />
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

