import {
  Box,
  VStack,
  HStack,
  Image,
  Text,
  Badge,
  Link,
  useColorModeValue,
  Icon,
  Flex,
  Skeleton,
  SkeletonCircle,
  IconButton
} from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { FiRadio, FiClock, FiCheckCircle, FiMinimize, FiMaximize } from 'react-icons/fi'
import { useState, useRef, useEffect } from 'react'
import { TransparentCard } from './TransparentCard'
import { useBroadcasterInfo } from '../hooks/useBroadcasterInfo'

/**
 * Panel lateral del broadcaster principal
 * Muestra foto de perfil, nombre, estado (online/offline) y metadata del stream
 * Desktop: Flotante a la izquierda (position: fixed) - Compacto
 * Móvil: Horizontal arriba del banner
 */
export const BroadcasterPanel = () => {
  const { broadcasterInfo, loading, error } = useBroadcasterInfo(30000)

  const textColor = useColorModeValue('gray.700', 'gray.200')
  const mutedColor = useColorModeValue('gray.500', 'gray.400')
  const onlineBg = useColorModeValue('green.500', 'green.400')
  const offlineBg = useColorModeValue('gray.400', 'gray.500')
  const buttonOfflineBg = useColorModeValue('gray.100', 'gray.700')
  const separatorColor = useColorModeValue('gray.200', 'gray.600')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const [isCompact, setIsCompact] = useState(false)
  const [position, setPosition] = useState({ x: 24, y: 120 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const panelRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    const rect = panelRef.current?.getBoundingClientRect()
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    } else {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  // Estado de carga
  if (loading) {
    return (
      <>
        {/* Desktop - Flotante */}
        <Box
          position="fixed"
          display={{ base: 'none', lg: 'block' }}
          left={6}
          top="120px"
          w="260px"
          zIndex={100}
          bg="transparent"
          borderRadius="xl"
          overflow="hidden"
          border="2px solid"
          borderColor={borderColor}
          boxShadow="md"
          sx={{
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: 'url(/images/banneroff.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(8px)',
              opacity: 0.5,
              zIndex: -2,
              pointerEvents: 'none'
            }
          }}
        >
          <TransparentCard p={3} w="full" opacity={0.95}>
            <VStack spacing={3} align="stretch">
              <SkeletonCircle size="80px" mx="auto" />
              <Skeleton height="20px" />
              <Skeleton height="16px" />
            </VStack>
          </TransparentCard>
        </Box>

        {/* Mobile - Horizontal */}
        <Box
          display={{ base: 'block', lg: 'none' }}
          mb={4}
          bg="transparent"
          borderRadius="xl"
          overflow="hidden"
          border="2px solid"
          borderColor={borderColor}
          boxShadow="md"
          position="relative"
          sx={{
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: 'url(/images/banneroff.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(8px)',
              opacity: 0.5,
              zIndex: -2,
              pointerEvents: 'none'
            }
          }}
        >
          <TransparentCard p={3} w="full" opacity={0.95}>
            <HStack spacing={3}>
              <SkeletonCircle size="60px" />
              <VStack align="start" flex={1} spacing={1}>
                <Skeleton height="16px" w="80px" />
                <Skeleton height="12px" w="60px" />
              </VStack>
            </HStack>
          </TransparentCard>
        </Box>
      </>
    )
  }

  // Estado de error
  if (error || !broadcasterInfo) {
    return (
      <>
        {/* Desktop - Flotante */}
        <Box
          position="fixed"
          display={{ base: 'none', lg: 'block' }}
          left={6}
          top="120px"
          w="260px"
          zIndex={100}
          bg="transparent"
          borderRadius="xl"
          overflow="hidden"
          border="2px solid"
          borderColor={borderColor}
          boxShadow="md"
          sx={{
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: 'url(/images/banneroff.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(8px)',
              opacity: 0.5,
              zIndex: -2,
              pointerEvents: 'none'
            }
          }}
        >
          <TransparentCard p={3} w="full" opacity={0.95}>
            <VStack spacing={2}>
              <Text fontSize="sm" color="red.500" textAlign="center">
                {error || 'No se pudo cargar la información'}
              </Text>
            </VStack>
          </TransparentCard>
        </Box>

        {/* Mobile - Horizontal */}
        <Box
          display={{ base: 'block', lg: 'none' }}
          mb={4}
          bg="transparent"
          borderRadius="xl"
          overflow="hidden"
          border="2px solid"
          borderColor={borderColor}
          boxShadow="md"
        >
          <TransparentCard p={3} w="full" opacity={0.95}>
            <Text fontSize="sm" color="red.500" textAlign="center">
              {error || 'No se pudo cargar la información'}
            </Text>
          </TransparentCard>
        </Box>
      </>
    )
  }

  const { username, profile_picture, channel_url, is_verified, stream } = broadcasterInfo
  const isLive = stream.is_live

  return (
    <>
      {/* Panel flotante para desktop - COMPACTO */}
      <Box
        position="fixed"
        display={{ base: 'none', lg: 'block' }}
        left={`${position.x}px`}
        top={`${position.y}px`}
        w={isCompact ? '120px' : '260px'}
        zIndex={100}
        bg="transparent"
        borderRadius="xl"
        overflow="hidden"
        border="2px solid"
        borderColor={isLive ? onlineBg : borderColor}
        transition={isDragging ? 'none' : 'all 0.3s ease'}
        boxShadow="md"
        _hover={!isDragging ? {
          transform: 'translateY(-4px)',
          boxShadow: isLive ? '0 20px 40px rgba(34, 197, 94, 0.3)' : 'lg',
          borderColor: isLive ? onlineBg : borderColor
        } : {}}
        sx={{
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: isLive ? 'url(/images/logo2.jpg)' : 'url(/images/banneroff.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(8px)',
            opacity: 0.5,
            zIndex: -2,
            pointerEvents: 'none'
          }
        }}
        ref={panelRef}
        onMouseDown={handleMouseDown}
        cursor={isDragging ? 'grabbing' : 'grab'}
        userSelect="none"
      >
        <TransparentCard p={3} w="full" opacity={0.95}>
          <VStack spacing={3} align="stretch">
            <HStack justify="space-between" w="full" mb={2}>
              <Text fontSize="xs" color={mutedColor}>Panel</Text>
              <IconButton
                aria-label="Toggle compact"
                icon={isCompact ? <FiMaximize /> : <FiMinimize />}
                size="xs"
                variant="ghost"
                onClick={() => setIsCompact(!isCompact)}
              />
            </HStack>

            {isCompact ? (
              <>
                {/* Modo compacto */}
                <Box position="relative" mx="auto">
                  <Image
                    src={profile_picture.startsWith('http') ? profile_picture : `/images${profile_picture}`}
                    alt={username}
                    boxSize="60px"
                    borderRadius="full"
                    objectFit="cover"
                    border="2px solid"
                    borderColor={isLive ? onlineBg : offlineBg}
                    boxShadow={isLive ? `0 0 15px ${onlineBg}` : 'sm'}
                    transition="all 0.3s"
                  />
                  {isLive && (
                    <Box
                      position="absolute"
                      bottom={1}
                      right={1}
                      boxSize="12px"
                      bg={onlineBg}
                      borderRadius="full"
                      border="2px solid white"
                      boxShadow="0 0 8px rgba(0, 255, 0, 0.5)"
                      animation="pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
                    />
                  )}
                </Box>

                <VStack spacing={0.5} align="center">
                  <HStack spacing={1}>
                    <Text fontSize="sm" fontWeight="bold" color={textColor}>
                      {username}
                    </Text>
                    {is_verified && (
                      <Icon as={FiCheckCircle} color="green.500" boxSize={3} />
                    )}
                  </HStack>
                </VStack>

                <Flex justify="center">
                  <Badge
                    colorScheme={isLive ? 'green' : 'gray'}
                    fontSize="xs"
                    px={2}
                    py={0.5}
                    borderRadius="full"
                    fontWeight="600"
                    display="flex"
                    alignItems="center"
                    gap={1}
                    boxShadow={isLive ? 'md' : 'none'}
                  >
                    <Icon as={isLive ? FiRadio : FiClock} boxSize={2.5} />
                    {isLive ? 'ONLINE' : 'OFFLINE'}
                  </Badge>
                </Flex>

                <Link
                  href={channel_url}
                  isExternal
                  _hover={{ textDecoration: 'none' }}
                  w="full"
                >
                  <Box
                    as="button"
                    w="full"
                    py={1.5}
                    px={2}
                    borderRadius="md"
                    bg={isLive ? onlineBg : buttonOfflineBg}
                    color={isLive ? 'white' : textColor}
                    fontWeight="600"
                    fontSize="xs"
                    transition="all 0.2s"
                    _hover={{
                      transform: 'translateY(-1px)',
                      boxShadow: 'sm'
                    }}
                    _active={{
                      transform: 'translateY(0)'
                    }}
                  >
                    <HStack justify="center" spacing={1}>
                      <Text>{isLive ? 'VER EN VIVO' : 'VISITAR'}</Text>
                      <Icon as={ExternalLinkIcon} boxSize={2.5} />
                    </HStack>
                  </Box>
                </Link>
              </>
            ) : (
              <>
                {/* Foto de perfil - Más pequeña */}
                <Box position="relative" mx="auto">
                  <Image
                    src={profile_picture.startsWith('http') ? profile_picture : `/images${profile_picture}`}
                    alt={username}
                    boxSize="80px"
                    borderRadius="full"
                    objectFit="cover"
                    border="2px solid"
                    borderColor={isLive ? onlineBg : offlineBg}
                    boxShadow={isLive ? `0 0 15px ${onlineBg}` : 'sm'}
                    transition="all 0.3s"
                  />

                  {/* Indicador de estado pulsante - Más pequeño */}
                  {isLive && (
                    <Box
                      position="absolute"
                      bottom={1}
                      right={1}
                      boxSize="16px"
                      bg={onlineBg}
                      borderRadius="full"
                      border="2px solid white"
                      boxShadow="0 0 8px rgba(0, 255, 0, 0.5)"
                      animation="pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
                    />
                  )}
                </Box>

                {/* Nombre y verificación - Compacto */}
                <VStack spacing={0.5} align="center">
                  <HStack spacing={1.5}>
                    <Text
                      fontSize="lg"
                      fontWeight="bold"
                      color={textColor}
                      textAlign="center"
                    >
                      {username}
                    </Text>
                    {is_verified && (
                      <Icon as={FiCheckCircle} color="green.500" boxSize={4} />
                    )}
                  </HStack>
                </VStack>

                {/* Badge de estado - Compacto con iconos */}
                <Flex justify="center">
                  <Badge
                    colorScheme={isLive ? 'green' : 'gray'}
                    fontSize="xs"
                    px={2.5}
                    py={1}
                    borderRadius="full"
                    fontWeight="700"
                    letterSpacing="wide"
                    display="flex"
                    alignItems="center"
                    gap={1.5}
                    boxShadow={isLive ? 'md' : 'none'}
                  >
                    <Icon as={isLive ? FiRadio : FiClock} boxSize={3} />
                    {isLive ? 'ONLINE' : 'OFFLINE'}
                  </Badge>
                </Flex>

                {/* Información del stream - Más compacta */}
                <VStack spacing={1.5} align="stretch" pt={1}>
                  {isLive ? (
                    <>
                      {/* Título del stream */}
                      {stream.title && (
                        <Box>
                          <Text fontSize="2xs" color={mutedColor} fontWeight="600" mb={0.5}>
                            EN VIVO
                          </Text>
                          <Text fontSize="xs" color={textColor} fontWeight="500" noOfLines={2}>
                            {stream.title}
                          </Text>
                        </Box>
                      )}

                      {/* Categoría */}
                      {stream.category && (
                        <Box>
                          <Text fontSize="2xs" color={mutedColor} fontWeight="600" mb={0.5}>
                            CATEGORÍA
                          </Text>
                          <Text fontSize="xs" color={textColor} noOfLines={1}>
                            {stream.category}
                          </Text>
                        </Box>
                      )}

                      {/* Tiempo en vivo */}
                      {stream.uptime_minutes !== null && (
                        <HStack spacing={1.5}>
                          <Icon as={FiClock} color={mutedColor} boxSize={3} />
                          <Text fontSize="2xs" color={mutedColor}>
                            Hace{' '}
                            <Text as="span" fontWeight="600" color={textColor}>
                              {stream.uptime_minutes < 60
                                ? `${stream.uptime_minutes}m`
                                : `${Math.floor(stream.uptime_minutes / 60)}h ${stream.uptime_minutes % 60}m`}
                            </Text>
                          </Text>
                        </HStack>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Última vez en vivo */}
                      {stream.last_live_ago && (
                        <Box textAlign="center">
                          <Text fontSize="2xs" color={mutedColor} mb={0.5}>
                            Última vez en vivo
                          </Text>
                          <Text fontSize="xs" color={textColor} fontWeight="500">
                            {stream.last_live_ago}
                          </Text>
                        </Box>
                      )}
                    </>
                  )}
                </VStack>

                {/* Enlace al canal - Más compacto */}
                <Link
                  href={channel_url}
                  isExternal
                  _hover={{ textDecoration: 'none' }}
                  w="full"
                >
                  <Box
                    as="button"
                    w="full"
                    py={2}
                    px={3}
                    borderRadius="md"
                    bg={isLive ? onlineBg : buttonOfflineBg}
                    color={isLive ? 'white' : textColor}
                    fontWeight="600"
                    fontSize="xs"
                    transition="all 0.2s"
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: 'md'
                    }}
                    _active={{
                      transform: 'translateY(0)'
                    }}
                  >
                    <HStack justify="center" spacing={1.5}>
                      <Text>{isLive ? 'VER EN VIVO' : 'VISITAR CANAL'}</Text>
                      <Icon as={ExternalLinkIcon} boxSize={3} />
                    </HStack>
                  </Box>
                </Link>

                {/* Separador - Con iconos en lugar de emojis */}
                <Box borderTop="1px solid" borderColor={separatorColor} pt={2}>
                  <HStack justify="center" spacing={1.5}>
                    <Icon as={isLive ? FiRadio : FiClock} color={mutedColor} boxSize={3} />
                    <Text fontSize="2xs" color={mutedColor}>
                      {isLive ? 'Transmitiendo ahora' : 'Próximamente en vivo'}
                    </Text>
                  </HStack>
                </Box>
              </>
            )}
          </VStack>
        </TransparentCard>
      </Box>

      {/* Panel horizontal para móvil */}
      <Box
        display={{ base: 'block', lg: 'none' }}
        mb={4}
        bg="transparent"
        borderRadius="xl"
        overflow="hidden"
        border="2px solid"
        borderColor={isLive ? onlineBg : borderColor}
        transition="all 0.3s ease"
        boxShadow="md"
        position="relative"
        sx={{
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: isLive ? 'url(/images/logo2.jpg)' : 'url(/images/banneroff.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(8px)',
            opacity: 0.5,
            zIndex: -2,
            pointerEvents: 'none'
          }
        }}
      >
        <TransparentCard p={3} w="full" opacity={0.95}>
          <HStack spacing={3}>
            {/* Foto de perfil pequeña */}
            <Box position="relative">
              <Image
                src={profile_picture.startsWith('http') ? profile_picture : `/images${profile_picture}`}
                alt={username}
                boxSize="60px"
                borderRadius="full"
                objectFit="cover"
                border="2px solid"
                borderColor={isLive ? onlineBg : offlineBg}
                boxShadow={isLive ? `0 0 15px ${onlineBg}` : 'sm'}
              />
              {isLive && (
                <Box
                  position="absolute"
                  bottom={0}
                  right={0}
                  boxSize="14px"
                  bg={onlineBg}
                  borderRadius="full"
                  border="2px solid white"
                  boxShadow="0 0 8px rgba(0, 255, 0, 0.5)"
                />
              )}
            </Box>

            {/* Información condensada */}
            <VStack align="start" flex={1} spacing={0.5}>
              <HStack spacing={1.5}>
                <Text fontSize="md" fontWeight="bold" color={textColor}>
                  {username}
                </Text>
                {is_verified && (
                  <Icon as={FiCheckCircle} color="green.500" boxSize={3.5} />
                )}
              </HStack>
              
              <Badge
                colorScheme={isLive ? 'green' : 'gray'}
                fontSize="xs"
                px={2}
                py={0.5}
                borderRadius="full"
                fontWeight="600"
                display="flex"
                alignItems="center"
                gap={1}
              >
                <Icon as={isLive ? FiRadio : FiClock} boxSize={2.5} />
                {isLive ? 'ONLINE' : 'OFFLINE'}
              </Badge>
              
              {isLive && stream.title && (
                <Text fontSize="xs" color={mutedColor} noOfLines={1}>
                  {stream.title}
                </Text>
              )}
              {!isLive && stream.last_live_ago && (
                <Text fontSize="xs" color={mutedColor}>
                  {stream.last_live_ago}
                </Text>
              )}
            </VStack>

            {/* Botón compacto */}
            <Link href={channel_url} isExternal _hover={{ textDecoration: 'none' }}>
              <Box
                as="button"
                px={3}
                py={2}
                borderRadius="md"
                bg={isLive ? onlineBg : buttonOfflineBg}
                color={isLive ? 'white' : textColor}
                fontWeight="600"
                fontSize="xs"
                transition="all 0.2s"
                _hover={{
                  transform: 'scale(1.05)',
                  boxShadow: 'md'
                }}
              >
                <Icon as={ExternalLinkIcon} boxSize={3} />
              </Box>
            </Link>
          </HStack>
        </TransparentCard>
      </Box>
    </>
  )
}
