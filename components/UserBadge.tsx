import {
  Box,
  Badge,
  Tooltip,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Image,
  Flex,
  Avatar,
  Text,
  useColorModeValue
} from '@chakra-ui/react'

// Icono de SUB (Suscriptor) de Kick.com - Estrella brillante
const KickSubIcon = ({ size = 60 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_209_29946)">
      <path
        d="M17.0284 2.91378L16.2357 0.667951C16.1573 0.445558 15.8427 0.445558 15.7643 0.667951L14.9716 2.91378C12.9003 8.78263 8.78263 12.9003 2.91378 14.9716L0.667951 15.7643C0.445558 15.8427 0.445558 16.1573 0.667951 16.2357L2.91378 17.0284C8.78263 19.0998 12.9003 23.2174 14.9716 29.0862L15.7643 31.3321C15.8427 31.5544 16.1573 31.5544 16.2357 31.3321L17.0284 29.0862C19.0998 23.2174 23.2174 19.0998 29.0862 17.0284L31.3321 16.2357C31.5544 16.1573 31.5544 15.8427 31.3321 15.7643L29.0862 14.9716C23.2174 12.9003 19.0998 8.78263 17.0284 2.91378Z"
        fill="black"
      ></path>
      <path
        d="M17.0284 2.91378L16.2357 0.667951C16.1573 0.445558 15.8427 0.445558 15.7643 0.667951L14.9716 2.91378C12.9003 8.78263 8.78263 12.9003 2.91378 14.9716L0.667951 15.7643C0.445558 15.8427 0.445558 16.1573 0.667951 16.2357L2.91378 17.0284C8.78263 19.0998 12.9003 23.2174 14.9716 29.0862L15.7643 31.3321C15.8427 31.5544 16.1573 31.5544 16.2357 31.3321L17.0284 29.0862C19.0998 23.2174 23.2174 19.0998 29.0862 17.0284L31.3321 16.2357C31.5544 16.1573 31.5544 15.8427 31.3321 15.7643L29.0862 14.9716C23.2174 12.9003 19.0998 8.78263 17.0284 2.91378Z"
        fill="url(#paint0_radial_209_29946)"
      ></path>
    </g>
    <defs>
      <radialGradient
        id="paint0_radial_209_29946"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(16 16) rotate(90) scale(16)"
      >
        <stop stopColor="#E1FF00"></stop>
        <stop offset="1" stopColor="#2AA300"></stop>
      </radialGradient>
      <clipPath id="clip0_209_29946">
        <rect width="32" height="32" fill="white"></rect>
      </clipPath>
    </defs>
  </svg>
)

// Icono de VIP de Kick.com
const KickVipIcon = ({ size = 60 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
  >
    <path
      d="M30 0C31.1046 0 32 0.895431 32 2V30C32 31.1046 31.1046 32 30 32H2C0.895431 32 0 31.1046 0 30V2C0 0.895431 0.895431 4.10637e-08 2 0H30ZM15.9648 5C15.7748 5.00005 15.588 5.05204 15.4238 5.15039C15.2596 5.24878 15.124 5.39057 15.0303 5.56055L9.82812 15.0176L3.55078 11.8906C3.36913 11.7985 3.16534 11.7607 2.96387 11.7822C2.76241 11.8038 2.57048 11.8842 2.41113 12.0127C2.25235 12.1408 2.13185 12.3126 2.06348 12.5078C1.99511 12.7031 1.98143 12.9144 2.02441 13.1172L4.58301 25.127C4.63544 25.3782 4.77165 25.6034 4.96777 25.7627C5.16376 25.9217 5.40762 26.0056 5.65723 26H26.251C26.5009 26.0057 26.7453 25.9219 26.9414 25.7627C27.1376 25.6034 27.2737 25.3782 27.3262 25.127L29.9697 13.1172C30.0187 12.9103 30.0086 12.6932 29.9404 12.4922C29.8722 12.2912 29.7485 12.1151 29.585 11.9844C29.4215 11.8537 29.2249 11.7743 29.0186 11.7559C28.8122 11.7374 28.6049 11.7802 28.4219 11.8799L22.1025 15.0283L16.9004 5.56055C16.8066 5.39054 16.6701 5.24878 16.5059 5.15039C16.3416 5.05207 16.1549 5 15.9648 5Z"
      fill="url(#paint0_linear_746_28171)"
    ></path>
    <path
      d="M30 0C31.1046 0 32 0.895431 32 2V30C32 31.1046 31.1046 32 30 32H2C0.895431 32 0 31.1046 0 30V2C0 0.895431 0.895431 4.10637e-08 2 0H30ZM15.9648 5C15.7748 5.00005 15.588 5.05204 15.4238 5.15039C15.2596 5.24878 15.124 5.39057 15.0303 5.56055L9.82812 15.0176L3.55078 11.8906C3.36913 11.7985 3.16534 11.7607 2.96387 11.7822C2.76241 11.8038 2.57048 11.8842 2.41113 12.0127C2.25235 12.1408 2.13185 12.3126 2.06348 12.5078C1.99511 12.7031 1.98143 12.9144 2.02441 13.1172L4.58301 25.127C4.63544 25.3782 4.77165 25.6034 4.96777 25.7627C5.16376 25.9217 5.40762 26.0056 5.65723 26H26.251C26.5009 26.0057 26.7453 25.9219 26.9414 25.7627C27.1376 25.6034 27.2737 25.3782 27.3262 25.127L29.9697 13.1172C30.0187 12.9103 30.0086 12.6932 29.9404 12.4922C29.8722 12.2912 29.7485 12.1151 29.585 11.9844C29.4215 11.8537 29.2249 11.7743 29.0186 11.7559C28.8122 11.7374 28.6049 11.7802 28.4219 11.8799L22.1025 15.0283L16.9004 5.56055C16.8066 5.39054 16.6701 5.24878 16.5059 5.15039C16.3416 5.05207 16.1549 5 15.9648 5Z"
      fill="url(#paint1_linear_746_28171)"
    ></path>
    <defs>
      <linearGradient
        id="paint0_linear_746_28171"
        x1="18.8102"
        y1="-12.7222"
        x2="2.88536"
        y2="39.1063"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF6A4A"></stop>
        <stop offset="1" stopColor="#C70C00"></stop>
      </linearGradient>
      <linearGradient
        id="paint1_linear_746_28171"
        x1="15.7467"
        y1="-4.75575"
        x2="16.321"
        y2="39.0672"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFC900"></stop>
        <stop offset="0.99" stopColor="#FF9500"></stop>
      </linearGradient>
    </defs>
  </svg>
)

// Tipos actualizados para soportar las nuevas funcionalidades
interface VipInfo {
  is_active?: boolean
  is_permanent?: boolean
  expires_at?: string
  granted_at?: string
  expires_soon?: boolean
}

interface MigrationStatus {
  can_migrate?: boolean
  migrated?: boolean
  migrated_at?: string
  points_migrated?: number
}

interface Usuario {
  id: number
  nickname?: string
  email: string
  puntos: number
  rol_id?: number
  discord_username?: string
  user_type?: 'regular' | 'subscriber' | 'vip'
  vip_info?: VipInfo
  vip_status?: VipInfo // Alias para compatibilidad
  migration_status?: MigrationStatus
  subscriber_status?: {
    is_active?: boolean
    expires_soon?: boolean
  }
}

interface UserBadgeProps {
  user: Usuario
  size?: 'sm' | 'md' | 'lg'
  showTooltip?: boolean
  fontSize?: string
  px?: number
  py?: number
  maxW?: string
}

export const UserBadge = ({ user, size = 'md', showTooltip = true, fontSize, px, py, maxW }: UserBadgeProps) => {
  const badges = []

  // Compatibilidad: usar vip_info o vip_status
  const vipInfo = user.vip_info || user.vip_status
  const isSubscriber = user.subscriber_status?.is_active || user.user_type === 'subscriber'

  // Badge Suscriptor
  if (isSubscriber) {
    const subBadge = (
      <Flex
        key="sub"
        align="center"
        justify="center"
        w={size === 'sm' ? '50px' : size === 'md' ? '60px' : '76px'}
        h={size === 'sm' ? '50px' : size === 'md' ? '60px' : '76px'}
        borderRadius="full"
        bg="transparent"
        _hover={{
          transform: 'scale(1.15)',
          cursor: 'pointer'
        }}
        transition="all 0.2s"
      >
        <KickSubIcon size={size === 'sm' ? 28 : size === 'md' ? 32 : 40} />
      </Flex>
    )

    if (showTooltip) {
      badges.push(
        <Tooltip key="sub-tooltip" label="Suscriptor del canal" hasArrow>
          {subBadge}
        </Tooltip>
      )
    } else {
      badges.push(subBadge)
    }
  }

  // Badge VIP
  if (vipInfo?.is_active) {
    const vipBadge = (
      <Flex
        key="vip"
        align="center"
        justify="center"
        w={size === 'sm' ? '50px' : size === 'md' ? '60px' : '76px'}
        h={size === 'sm' ? '50px' : size === 'md' ? '60px' : '76px'}
        borderRadius="full"
        bg="transparent"
        _hover={{
          transform: 'scale(1.15)',
          cursor: 'pointer'
        }}
        transition="all 0.2s"
      >
        <KickVipIcon size={size === 'sm' ? 28 : size === 'md' ? 32 : 40} />
      </Flex>
    )

    if (showTooltip) {
      badges.push(
        <Tooltip
          key="vip-tooltip"
          label={
            vipInfo.is_permanent
              ? 'Usuario VIP Permanente'
              : vipInfo.expires_at
                ? `VIP hasta ${new Date(vipInfo.expires_at).toLocaleDateString('es-ES')}`
                : 'Usuario VIP'
          }
          hasArrow
        >
          {vipBadge}
        </Tooltip>
      )
    } else {
      badges.push(vipBadge)
    }
  }

  // Badge migración Botrix
  if (user.migration_status?.migrated && showTooltip && size !== 'sm') {
    const migrationBadge = (
      <Badge
        key="migration"
        colorScheme="cyan"
        fontSize="sm"
        px={3}
        py={1}
        borderRadius="md"
        variant="subtle"
      >
        Migrado
      </Badge>
    )

    badges.push(
      <Tooltip
        key="migration-tooltip"
        label={`Migró ${user.migration_status.points_migrated?.toLocaleString()} puntos desde Botrix`}
        hasArrow
      >
        {migrationBadge}
      </Tooltip>
    )
  }

  // Badge Discord (opcional, solo si queremos mostrarlo)
  if (user.discord_username && showTooltip && size === 'lg') {
    const discordBadge = (
      <Badge
        key="discord"
        colorScheme="blue"
        fontSize="xs"
        px={2}
        py={1}
        borderRadius="md"
        variant="subtle"
      >
        🎮 Discord
      </Badge>
    )

    badges.push(
      <Tooltip key="discord-tooltip" label={`Discord: ${user.discord_username}`} hasArrow>
        {discordBadge}
      </Tooltip>
    )
  }

  if (badges.length === 0) {
    return null
  }

  return (
    <HStack spacing={1} maxW={maxW}>
      {badges}
    </HStack>
  )
}

// Componente para mostrar solo el avatar con distintivo visual
interface UserAvatarWithBadgeProps {
  user: Usuario
  children: React.ReactNode // El Avatar del usuario
  imageUrl?: string // URL de la imagen para preview (Ej: kick_data?.avatar_url)
}

export const UserAvatarWithBadge = ({ user, children, imageUrl }: UserAvatarWithBadgeProps) => {
  // Compatibilidad: usar vip_info o vip_status
  const vipInfo = user.vip_info || user.vip_status
  const isSubscriber = user.subscriber_status?.is_active || user.user_type === 'subscriber'
  const { isOpen, onOpen, onClose } = useDisclosure()

  // Colores adaptativos para claro/oscuro
  const modalBg = useColorModeValue('rgba(255, 255, 255, 0.98)', 'rgba(13, 17, 23, 0.98)')
  const textColor = useColorModeValue('gray.800', 'gray.100')
  const placeholderSubtextColor = useColorModeValue('gray.500', 'gray.400')
  const closeButtonBg = useColorModeValue('white', 'gray.800')
  const closeButtonColor = useColorModeValue('black', 'white')
  const closeButtonHoverBg = useColorModeValue('gray.100', 'gray.700')

  return (
    <Box position="relative" display="inline-block">
      <Box
        onClickCapture={(e) => {
          e.stopPropagation()
          onOpen()
        }}
        _hover={{
          transform: 'scale(1.1)',
          transition: 'transform 0.3s ease'
        }}
        transition="transform 0.3s ease"
        cursor="pointer"
      >
        {children}
      </Box>

      {/* Overlay para Suscriptor y VIP combinados */}
      {(isSubscriber || vipInfo?.is_active) && (
        <Box
          position="absolute"
          top="-2px"
          left="-2px"
          right="-2px"
          bottom="-2px"
          borderRadius="full"
          border="3px solid"
          borderColor={
            isSubscriber && vipInfo?.is_active
              ? 'linear-gradient(135deg, #48BB78, #FFD700)'
              : isSubscriber
                ? 'green.400'
                : 'gold'
          }
          pointerEvents="none"
          _hover={{
            boxShadow: isSubscriber && vipInfo?.is_active
              ? '0 0 15px rgba(72, 187, 120, 0.7), 0 0 15px rgba(255, 215, 0, 0.7)'
              : isSubscriber
                ? '0 0 15px rgba(72, 187, 120, 0.7)'
                : '0 0 15px rgba(255, 215, 0, 0.7)'
          }}
          transition="box-shadow 0.3s ease"
          _before={{
            content: '""',
            position: 'absolute',
            top: '-1px',
            left: '-1px',
            right: '-1px',
            bottom: '-1px',
            borderRadius: 'full',
            border: '1px solid',
            borderColor: isSubscriber ? 'green.300' : 'yellow.300'
          }}
          animation={vipInfo?.is_active ? 'pulse 2s infinite' : undefined}
          sx={{
            '@keyframes pulse': {
              '0%, 100%': { opacity: 1 },
              '50%': { opacity: 0.7 }
            }
          }}
        />
      )}

      {/* Overlay para VIP solo (ya no se usa, mantenido por compatibilidad) */}
      {false && vipInfo?.is_active && (
        <Box
          position="absolute"
          top="-2px"
          left="-2px"
          right="-2px"
          bottom="-2px"
          borderRadius="full"
          border="3px solid"
          borderColor="gold"
          pointerEvents="none"
          _before={{
            content: '""',
            position: 'absolute',
            top: '-1px',
            left: '-1px',
            right: '-1px',
            bottom: '-1px',
            borderRadius: 'full',
            border: '1px solid',
            borderColor: 'yellow.300'
          }}
          animation="pulse 2s infinite"
          sx={{
            '@keyframes pulse': {
              '0%, 100%': { opacity: 1 },
              '50%': { opacity: 0.7 }
            }
          }}
        />
      )}

      {/* Modal para preview de imagen con desenfoque */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay
          backdropFilter="blur(8px)"
          bg="rgba(0, 0, 0, 0.6)"
        />
        <ModalContent
          bg="transparent"
          shadow="none"
          maxW="600px"
          maxH="90vh"
        >
          <ModalCloseButton
            bg={closeButtonBg}
            color={closeButtonColor}
            rounded="full"
            size="lg"
            position="absolute"
            top={-4}
            right={-4}
            _hover={{
              bg: closeButtonHoverBg,
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)'
            }}
            zIndex={10}
          />
          <ModalBody
            p={0}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Flex
              position="relative"
              rounded="lg"
              overflow="hidden"
              boxShadow="0 20px 60px rgba(0, 0, 0, 0.5)"
              bg={modalBg}
              w="full"
              maxW="600px"
              minH="300px"
              alignItems="center"
              justifyContent="center"
            >
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={`${user.nickname || 'Usuario'} profile`}
                  maxW="100%"
                  maxH="80vh"
                  objectFit="contain"
                  rounded="lg"
                />
              ) : (
                <Box textAlign="center" p={8}>
                  <Avatar
                    size="2xl"
                    name={user.nickname || 'Usuario'}
                    src={undefined}
                    mb={4}
                  />
                  <Text fontSize="lg" fontWeight="semibold" color={textColor}>
                    {user.nickname || 'Usuario'}
                  </Text>
                  <Text fontSize="sm" color={placeholderSubtextColor} mt={2}>
                    No hay foto de perfil disponible
                  </Text>
                </Box>
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}
