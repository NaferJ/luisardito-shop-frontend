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

/** Estilos compartidos para el pseudo-elemento de fondo */
function backgroundSx(isLive: boolean) {
  return {
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
  }
}

/** Componente de foto de perfil con indicador de estado */
function ProfileImage({ src, username, isLive, onlineBg, offlineBg, size }: {
  src: string; username: string; isLive: boolean; onlineBg: string; offlineBg: string; size: string
}) {
  const boxSize = size === 'sm' ? '60px' : '80px'
  const indicatorSize = size === 'sm' ? '12px' : '16px'
  return (
    <Box position="relative" mx={size === 'sm' ? undefined : 'auto'}>
      <Image
        src={src.startsWith('http') ? src : `/images${src}`}
        alt={username}
        boxSize={boxSize}
        borderRadius="full"
        objectFit="cover"
        border="2px solid"
        borderColor={isLive ? onlineBg : offlineBg}
        boxShadow={isLive ? `0 0 15px ${onlineBg}` : 'sm'}
        transition="all 0.3s"
        onDragStart={(e) => e.preventDefault()}
      />
      {isLive && (
        <Box
          position="absolute"
          bottom={1}
          right={1}
          boxSize={indicatorSize}
          bg={onlineBg}
          borderRadius="full"
          border="2px solid white"
          boxShadow="0 0 8px rgba(0, 255, 0, 0.5)"
          animation="pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
        />
      )}
    </Box>
  )
}

/** Badge de estado (ONLINE/OFFLINE) */
function StatusBadge({ isLive, size = 'md' }: { isLive: boolean; size?: 'sm' | 'md' }) {
  return (
    <Flex justify="center">
      <Badge
        colorScheme={isLive ? 'green' : 'gray'}
        fontSize="xs"
        px={size === 'sm' ? 2 : 2.5}
        py={size === 'sm' ? 0.5 : 1}
        borderRadius="full"
        fontWeight={size === 'sm' ? '600' : '700'}
        letterSpacing={size === 'sm' ? undefined : 'wide'}
        display="flex"
        alignItems="center"
        gap={size === 'sm' ? 1 : 1.5}
        boxShadow={isLive ? 'md' : 'none'}
      >
        <Icon as={isLive ? FiRadio : FiClock} boxSize={size === 'sm' ? 2.5 : 3} />
        {isLive ? 'ONLINE' : 'OFFLINE'}
      </Badge>
    </Flex>
  )
}

/** Nombre del usuario con verificación */
function UsernameDisplay({ username, isVerified, fontSize = 'lg' }: {
  username: string; isVerified: boolean; fontSize?: string
}) {
  return (
    <VStack spacing={0.5} align="center">
      <HStack spacing={fontSize === 'sm' ? 1 : 1.5}>
        <Text fontSize={fontSize} fontWeight="bold" textAlign="center">
          {username}
        </Text>
        {isVerified && (
          <Icon as={FiCheckCircle} color="green.500" boxSize={fontSize === 'sm' ? 3 : 4} />
        )}
      </HStack>
    </VStack>
  )
}

/** Botón para ir al canal */
function ChannelButton({ channelUrl, isLive, onlineBg, buttonOfflineBg, textColor, compact = false }: {
  channelUrl: string; isLive: boolean; onlineBg: string; buttonOfflineBg: string; textColor: string; compact?: boolean
}) {
  return (
    <Link href={channelUrl} isExternal _hover={{ textDecoration: 'none' }} w="full">
      <Box
        as="button"
        w="full"
        py={compact ? 1.5 : 2}
        px={compact ? 2 : 3}
        borderRadius="md"
        bg={isLive ? onlineBg : buttonOfflineBg}
        color={isLive ? 'white' : textColor}
        fontWeight="600"
        fontSize="xs"
        transition="all 0.2s"
        _hover={{ transform: compact ? 'translateY(-1px)' : 'translateY(-2px)', boxShadow: compact ? 'sm' : 'md' }}
        _active={{ transform: 'translateY(0)' }}
      >
        <HStack justify="center" spacing={compact ? 1 : 1.5}>
          <Text>{isLive ? 'VER EN VIVO' : (compact ? 'VISITAR' : 'VISITAR CANAL')}</Text>
          <Icon as={ExternalLinkIcon} boxSize={compact ? 2.5 : 3} />
        </HStack>
      </Box>
    </Link>
  )
}

/** Información del stream (título, categoría, tiempo en vivo) */
function StreamInfo({ stream, isLive, textColor, mutedColor }: {
  stream: any; isLive: boolean; textColor: string; mutedColor: string
}) {
  return (
    <VStack spacing={1.5} align="stretch" pt={1}>
      {isLive ? (
        <>
          {stream.title && (
            <Box>
              <Text fontSize="2xs" color={mutedColor} fontWeight="600" mb={0.5}>EN VIVO</Text>
              <Text fontSize="xs" color={textColor} fontWeight="500" noOfLines={2}>{stream.title}</Text>
            </Box>
          )}
          {stream.category && (
            <Box>
              <Text fontSize="2xs" color={mutedColor} fontWeight="600" mb={0.5}>CATEGORÍA</Text>
              <Text fontSize="xs" color={textColor} noOfLines={1}>{stream.category}</Text>
            </Box>
          )}
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
          {stream.last_live_ago && (
            <Box textAlign="center">
              <Text fontSize="2xs" color={mutedColor} mb={0.5}>Última vez en vivo</Text>
              <Text fontSize="xs" color={textColor} fontWeight="500">{stream.last_live_ago}</Text>
            </Box>
          )}
        </>
      )}
    </VStack>
  )
}

/** Esqueleto de carga para el panel */
function PanelSkeleton({ borderColor }: { borderColor: string }) {
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
        sx={backgroundSx(false)}
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
        sx={backgroundSx(false)}
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

/** Mensaje de error para el panel */
function PanelError({ borderColor, errorMessage }: { borderColor: string; errorMessage: string }) {
  return (
    <>
      {/* Desktop */}
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
        sx={backgroundSx(false)}
      >
        <TransparentCard p={3} w="full" opacity={0.95}>
          <VStack spacing={2}>
            <Text fontSize="sm" color="red.500" textAlign="center">{errorMessage}</Text>
          </VStack>
        </TransparentCard>
      </Box>

      {/* Mobile */}
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
          <Text fontSize="sm" color="red.500" textAlign="center">{errorMessage}</Text>
        </TransparentCard>
      </Box>
    </>
  )
}

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

  if (loading) {
    return <PanelSkeleton borderColor={borderColor} />
  }

  if (error || !broadcasterInfo) {
    return <PanelError borderColor={borderColor} errorMessage={error || 'No se pudo cargar la información'} />
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
        sx={backgroundSx(isLive)}
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
                <ProfileImage src={profile_picture} username={username} isLive={isLive} onlineBg={onlineBg} offlineBg={offlineBg} size="sm" />
                <UsernameDisplay username={username} isVerified={is_verified} fontSize="sm" />
                <StatusBadge isLive={isLive} size="sm" />
                <ChannelButton channelUrl={channel_url} isLive={isLive} onlineBg={onlineBg} buttonOfflineBg={buttonOfflineBg} textColor={textColor} compact />
              </>
            ) : (
              <>
                <ProfileImage src={profile_picture} username={username} isLive={isLive} onlineBg={onlineBg} offlineBg={offlineBg} size="md" />
                <UsernameDisplay username={username} isVerified={is_verified} />
                <StatusBadge isLive={isLive} />
                <StreamInfo stream={stream} isLive={isLive} textColor={textColor} mutedColor={mutedColor} />
                <ChannelButton channelUrl={channel_url} isLive={isLive} onlineBg={onlineBg} buttonOfflineBg={buttonOfflineBg} textColor={textColor} />

                {/* Separador */}
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
        sx={backgroundSx(isLive)}
      >
        <TransparentCard p={3} w="full" opacity={0.95}>
          <HStack spacing={3}>
            {/* Foto de perfil pequeña */}
            <ProfileImage src={profile_picture} username={username} isLive={isLive} onlineBg={onlineBg} offlineBg={offlineBg} size="sm" />

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
