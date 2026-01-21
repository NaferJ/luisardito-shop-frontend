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
  Icon,
  Flex,
  Center,
  Portal
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { HamburgerIcon } from '@chakra-ui/icons'
import {
  MdShoppingCart,
  MdGroup,
  MdPerson,
  MdHistory,
  MdRedeem,
  MdInventory,
  MdLeaderboard,
  MdLogout,
  MdSend
} from 'react-icons/md'
import { useAuth } from '../hooks/useAuth'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import ColorModeToggle from './ColorModeToggle'
import { UserBadge, UserAvatarWithBadge, KickVipIcon, KickSubIcon } from './UserBadge'
import { NotificationBell } from './NotificationBell'

export default function NavbarContent() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [showNewBadge, setShowNewBadge] = useState(true)

  const avatarSrc = user ? user.kick_data?.avatar_url || user.avatar_url || user.kick_avatar || undefined : undefined
  const avatarName = user ? user.nickname || user.kick_username || user.display_name || user.nombre || user.email : ''

  const isSubscriber = user?.subscriber_status?.is_active || user?.user_type === 'subscriber'
  const isVip = user?.vip_info?.is_active || user?.vip_status?.is_active

  useEffect(() => {
    const hasVisited = localStorage.getItem('leaderboard_visited')
    setShowNewBadge(!hasVisited)
  }, [])

  const handleLeaderboardClick = () => {
    localStorage.setItem('leaderboard_visited', 'true')
    setShowNewBadge(false)
  }

  const handleLogout = () => {
    logout()
    onClose()
  }

  const isActiveRoute = (path: string) => {
    if (path === '/') return router.pathname === '/'
    return router.pathname === path || router.pathname.startsWith(path + '/')
  }

  // --- MODERN GLASS STYLES ---
  const glassBg = useColorModeValue('rgba(255, 255, 255, 0.72)', 'rgba(10, 10, 18, 0.68)')
  const glassBorder = useColorModeValue('rgba(0, 0, 0, 0.06)', 'rgba(255, 255, 255, 0.08)')
  const accentColor = useColorModeValue('blue.500', 'blue.400')
  const shadowFloating = useColorModeValue(
    '0 8px 20px -6px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
    '0 20px 40px -12px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03)'
  )

  // Filtro para el logo de Kick (blanco en modo oscuro, normal en modo claro)
  const kickLogoFilter = useColorModeValue('none', 'brightness(0) invert(1)')

  const NavItem = ({ href, icon, label, badge = false, customIcon = null }: { href: string; icon: any; label: string; badge?: boolean; customIcon?: any }) => {
    const active = isActiveRoute(href)
    return (
      <Tooltip label={label} placement="bottom" hasArrow fontSize="xs">
        <Box
          as={NextLink}
          href={href}
          position="relative"
          display="flex"
          alignItems="center"
          justifyContent="center"
          px={3}
          h="36px"
          borderRadius="lg"
          bg={active ? useColorModeValue('blue.50', 'whiteAlpha.100') : 'transparent'}
          color={active ? accentColor : useColorModeValue('gray.600', 'gray.400')}
          transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
          cursor="pointer"
          _hover={{
            bg: useColorModeValue('gray.100', 'whiteAlpha.200'),
            color: accentColor,
            transform: 'translateY(-1px)'
          }}
        >
          {customIcon ? customIcon : <Icon as={icon} boxSize={4} />}
          {badge && (
            <Box
              position="absolute"
              top="6px"
              right="6px"
              w="5px"
              h="5px"
              borderRadius="full"
              bg="red.500"
              boxShadow="0 0 0 1.5px white"
              _dark={{ boxShadow: "0 0 0 1.5px #1A202C" }}
            />
          )}
          {active && (
            <Box
              position="absolute"
              bottom="-2px"
              left="30%"
              right="30%"
              h="2px"
              borderRadius="full"
              bg={accentColor}
              boxShadow={`0 0 8px ${accentColor}`}
            />
          )}
        </Box>
      </Tooltip>
    )
  }

  // --- SKELETON MODERN ---
  if (isLoading) {
    return (
      <Box position="fixed" top={{ base: 2, md: 4 }} left="50%" transform="translateX(-50%)" zIndex={1000} w="full" px={{ base: 4, md: 8 }} maxW="1200px">
        <Flex bg={glassBg} backdropFilter="blur(20px)" border="1px solid" borderColor={glassBorder} borderRadius="2xl" h="54px" px={4} align="center" justify="space-between" boxShadow={shadowFloating}>
          <HStack spacing={3}>
            <Skeleton borderRadius="lg" width="28px" height="28px" />
            <Skeleton height="14px" width="80px" borderRadius="full" />
          </HStack>
          <HStack spacing={3}>
            <Skeleton height="28px" width="100px" borderRadius="lg" display={{ base: 'none', lg: 'block' }} />
            <Skeleton borderRadius="full" width="28px" height="28px" />
            <Skeleton borderRadius="full" width="28px" height="28px" />
          </HStack>
        </Flex>
      </Box>
    )
  }

  return (
    <>
      <Box
        position="fixed"
        top={{ base: 2, md: 4 }}
        left="50%"
        transform="translateX(-50%)"
        zIndex={1000}
        w="full"
        px={{ base: 3, md: 8 }}
        maxW="930px"
      >
        <Flex
          bg={glassBg}
          backdropFilter="blur(20px) saturate(180%)"
          border="1px solid"
          borderColor={glassBorder}
          borderRadius={{ base: "xl", md: "2xl" }}
          boxShadow={shadowFloating}
          h={{ base: "54px", md: "60px" }}
          px={{ base: 3, md: 4 }}
          align="center"
          justify="space-between"
          transition="all 0.4s ease"
        >
          {/* LEFT: Identity */}
          <HStack spacing={3} flex={1}>
            <ChakraLink as={NextLink} href="/" display="flex" alignItems="center" gap={2.5} _hover={{ textDecoration: 'none' }}>
              <Image src="/images/logo2.jpg" alt="Logo" boxSize={{ base: "28px", md: "32px" }} borderRadius="lg" />
              <VStack align="start" spacing={-1.5} display={{ base: 'none', sm: 'flex' }}>
                <Text fontWeight="900" fontSize="xs" letterSpacing="-0.2px">
                  LUISARDITO
                </Text>
                <Text fontSize="9px" fontWeight="black" color="blue.400" textTransform="uppercase" letterSpacing="0.5px">
                  Shop
                </Text>
              </VStack>
            </ChakraLink>
          </HStack>

          {/* CENTER: Compact Navigation */}
          <HStack 
            spacing={0.5} 
            display={{ base: 'none', lg: 'flex' }}
            bg={useColorModeValue('rgba(0,0,0,0.02)', 'rgba(255,255,255,0.04)')}
            p={1}
            borderRadius="xl"
          >
            <NavItem href="/productos" icon={MdShoppingCart} label="Tienda" />
            <NavItem href="/canjes" icon={MdRedeem} label="Canjes" />
            <NavItem href="/leaderboard" icon={MdLeaderboard} label="Ranking" badge={showNewBadge} />
            
            {user?.rol_id && [3, 4, 5].includes(user.rol_id) && (
              <>
                <Box w="1px" h="14px" bg={glassBorder} mx={2} />
                <NavItem href="/admin/usuarios" icon={MdGroup} label="Usuarios" />
                <NavItem href="/admin/canjes" icon={MdInventory} label="Inventario" />
                <NavItem href="/admin/kick" icon={null} label="Kick" customIcon={<Image src="/images/logokick.png" alt="Kick" boxSize={4} filter={kickLogoFilter} />} />
              </>
            )}
          </HStack>

          {/* RIGHT: Profile & Actions */}
          <HStack spacing={{ base: 1, md: 2 }} flex={1} justify="flex-end">
            {isAuthenticated && user && (
              <Box 
                display={{ base: 'none', md: 'flex' }}
                bg={useColorModeValue('orange.50', 'rgba(251, 146, 60, 0.12)')}
                border="1px solid"
                borderColor={useColorModeValue('orange.100', 'rgba(251, 146, 60, 0.2)')}
                px={4}
                h="32px"
                alignItems="center"
                borderRadius="full"
                mr={0}
                ml={2}
              >
                <Text fontWeight="900" fontSize="xs" color={useColorModeValue('orange.600', 'orange.300')} whiteSpace="nowrap">
                  {user.puntos?.toLocaleString()} <Text as="span" fontSize="9px" fontWeight="black" ml={0.5}>PTS</Text>
                </Text>
              </Box>
            )}

            <HStack spacing={0.5}>
              <IconButton
                aria-label="Sugerencias"
                icon={<MdSend size={16} />}
                variant="ghost"
                size="xs"
                w="32px"
                h="32px"
                mr={2}
                borderRadius="lg"
                onClick={() => window.open('https://form.typeform.com/to/In8zTBm6', '_blank')}
                _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
              />
              <ColorModeToggle />
              {isAuthenticated && <NotificationBell />}
            </HStack>

            {/* Badges VIP y SUB */}
            {isAuthenticated && user && (
              <HStack spacing={1} display="flex" flexShrink={0} mx={2}>
                {(user.subscriber_status?.is_active || user.user_type === 'subscriber') && (
                  <Tooltip label="Suscriptor" placement="bottom" hasArrow fontSize="xs">
                    <Box w="30px" h="30px" display="flex" alignItems="center" justifyContent="center" flexShrink={0} cursor="pointer" transition="all 0.2s ease-in-out" _hover={{ transform: 'scale(1.2)' }}>
                      <KickSubIcon size={20} />
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
                    <Box w="30px" h="30px" display="flex" alignItems="center" justifyContent="center" flexShrink={0} cursor="pointer" transition="all 0.2s ease-in-out" _hover={{ transform: 'scale(1.2)' }}>
                      <KickVipIcon size={20} />
                    </Box>
                  </Tooltip>
                )}
              </HStack>
            )}

            {isAuthenticated ? (
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
                <Portal>
                  <MenuList
                    bg={useColorModeValue('white', 'gray.700')}
                    backdropFilter="blur(20px)"
                    borderColor={glassBorder}
                    boxShadow="0 10px 30px rgba(0,0,0,0.15)"
                    borderRadius="xl"
                    p={1.5}
                    minW="200px"
                  >
                    <Box px={3} py={2.5} mb={1} mt={1}>
                      <Text fontWeight="800" fontSize="xs" noOfLines={1} color={useColorModeValue('gray.800', 'white')}>{avatarName}</Text>
                      <UserBadge user={user} size="sm" />
                    </Box>
                    <Divider opacity={0.5} />
                    <MenuLinkItem href="/perfil" icon={MdPerson} label="Mi Perfil" />
                    <MenuLinkItem href="/historial" icon={MdHistory} label="Historial" />
                    <MenuLinkItem href="/canjes" icon={MdRedeem} label="Mis Canjes" />
                    <Divider my={1} opacity={0.5} />
                    <MenuItem 
                      onClick={handleLogout} 
                      color="red.400" 
                      fontWeight="bold"
                      borderRadius="lg"
                      fontSize="xs"
                      _hover={{ bg: 'red.50', _dark: { bg: 'whiteAlpha.50' } }}
                    >
                      <HStack spacing={2} w="full">
                        <MdLogout size={14} />
                        <Text>Cerrar Sesión</Text>
                      </HStack>
                    </MenuItem>
                  </MenuList>
                </Portal>
              </Menu>
            ) : (
              <Button
                as={NextLink}
                href="/login"
                colorScheme="blue"
                size="xs"
                fontWeight="900"
                borderRadius="full"
                px={4}
                boxShadow="0 4px 10px rgba(66, 153, 225, 0.2)"
                _hover={{ transform: 'translateY(-1px)' }}
              >
                LOGIN
              </Button>
            )}

            <IconButton
              display={{ base: 'flex', lg: 'none' }}
              aria-label="Menu"
              icon={<HamburgerIcon boxSize={3.5} />}
              variant="ghost"
              size="xs"
              w="32px"
              h="32px"
              borderRadius="lg"
              onClick={onOpen}
            />
          </HStack>
        </Flex>
      </Box>

      {/* MOBILE DRAWER */}
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        size={{ base: 'full', md: 'xs' }}
      >
        <DrawerOverlay backdropFilter="blur(8px)" bg="blackAlpha.400" />
        <DrawerContent bg={useColorModeValue('white', 'gray.900')} borderLeft="1px solid" borderColor={glassBorder} width="280px">
          <DrawerHeader borderBottomWidth="1px" py={5} px={5}>
            <Flex align="center" justify="space-between">
              <Text fontWeight="900" fontSize="md" letterSpacing="-0.5px">MENÚ LUISARDITO</Text>
              <CloseButton onClick={onClose} borderRadius="full" size="sm" />
            </Flex>
          </DrawerHeader>

          <DrawerBody py={5} px={5}>
            <VStack spacing={5} align="stretch">
              {isAuthenticated && user && (
                <Box p={3.5} borderRadius="xl" bg={useColorModeValue('blue.50', 'whiteAlpha.50')} border="1px solid" borderColor="blue.100" _dark={{ borderColor: 'whiteAlpha.100' }}>
                  <HStack spacing={3} mb={3}>
                    <UserAvatarWithBadge user={user}>
                      <Avatar size="sm" name={avatarName} src={avatarSrc} />
                    </UserAvatarWithBadge>
                    <VStack align="start" spacing={-1}>
                      <Text fontWeight="800" fontSize="sm">{avatarName}</Text>
                      <UserBadge user={user} size="sm" />
                    </VStack>
                  </HStack>
                  <Flex justify="space-between" align="center" bg="whiteAlpha.400" p={2} borderRadius="lg">
                    <Text fontSize="10px" fontWeight="bold" color="gray.500" textTransform="uppercase">Puntos</Text>
                    <Text fontWeight="900" fontSize="sm" color="orange.400">{user.puntos?.toLocaleString()}</Text>
                  </Flex>
                </Box>
              )}

              <VStack align="stretch" spacing={1}>
                <DrawerLink href="/productos" icon={MdShoppingCart} label="Tienda" isActive={isActiveRoute('/productos')} onClick={onClose} />
                <DrawerLink href="/canjes" icon={MdRedeem} label="Mis Canjes" isActive={isActiveRoute('/canjes')} onClick={onClose} />
                <DrawerLink href="/leaderboard" icon={MdLeaderboard} label="Leaderboard" isActive={isActiveRoute('/leaderboard')} onClick={() => { handleLeaderboardClick(); onClose(); }} isNew={showNewBadge} />
                
                {user?.rol_id && [3, 4, 5].includes(user.rol_id) && (
                  <Box pt={3}>
                    <Text fontSize="9px" fontWeight="black" color="gray.400" mb={2} ml={2} textTransform="uppercase" letterSpacing="1px">Administración</Text>
                    <DrawerLink href="/admin/usuarios" icon={MdGroup} label="Usuarios" isActive={isActiveRoute('/admin/usuarios')} onClick={onClose} />
                    <DrawerLink href="/admin/canjes" icon={MdInventory} label="Inventario" isActive={isActiveRoute('/admin/canjes')} onClick={onClose} />
                    <DrawerLink href="/admin/kick" icon={null} label="Kick" isActive={isActiveRoute('/admin/kick')} onClick={onClose} customIcon={<Image src="/images/logokick.png" alt="Kick" boxSize={4} filter={kickLogoFilter} />} />
                  </Box>
                )}
              </VStack>

              <Divider />

              <Button
                leftIcon={<MdSend />}
                variant="subtle"
                borderRadius="lg"
                fontSize="xs"
                h="40px"
                onClick={() => window.open('https://form.typeform.com/to/In8zTBm6', '_blank')}
              >
                Sugerencia
              </Button>

              {isAuthenticated ? (
                <Button variant="ghost" colorScheme="red" leftIcon={<MdLogout />} onClick={handleLogout} borderRadius="lg" fontSize="xs" h="40px">
                  Cerrar Sesión
                </Button>
              ) : (
                <Button colorScheme="blue" as={NextLink} href="/login" onClick={onClose} borderRadius="lg" fontSize="xs" h="40px">
                  Iniciar Sesión
                </Button>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

const MenuLinkItem = ({ href, icon, label }: { href: string; icon: any; label: string }) => (
  <MenuItem 
    as={NextLink} 
    href={href} 
    borderRadius="lg"
    fontSize="xs"
    fontWeight="600"
    _hover={{ bg: { base: 'blue.50', _dark: 'whiteAlpha.100' }, color: 'blue.400' }}
  >
    <HStack spacing={2} w="full">
      <Icon as={icon} boxSize={3.5} />
      <Text>{label}</Text>
    </HStack>
  </MenuItem>
)

const DrawerLink = ({ href, icon, label, isActive, onClick, isNew, customIcon }: { href: string; icon: any; label: string; isActive: boolean; onClick: () => void; isNew?: boolean; customIcon?: any }) => {
  const activeBg = { base: 'blue.50', _dark: 'whiteAlpha.200' }
  const hoverBg = { base: 'gray.100', _dark: 'whiteAlpha.100' }
  const color = isActive ? 'blue.500' : 'inherit'
  
  return (
    <Button
      as={NextLink}
      href={href}
      onClick={onClick}
      variant="ghost"
      justifyContent="flex-start"
      leftIcon={customIcon ? customIcon : <Icon as={icon} boxSize={4} />}
      h="44px"
      borderRadius="lg"
      bg={isActive ? activeBg : 'transparent'}
      color={color}
      fontSize="xs"
      fontWeight={isActive ? "800" : "600"}
      _hover={{ bg: hoverBg }}
    >
      <Box flex="1" textAlign="left">{label}</Box>
      {isNew && <Badge ml={2} colorScheme="green" variant="solid" fontSize="8px" borderRadius="full">NEW</Badge>}
    </Button>
  )
}

