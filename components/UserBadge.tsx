import { Box, Badge, Tooltip, HStack } from '@chakra-ui/react'

// Tipos actualizados para soportar las nuevas funcionalidades
interface VipInfo {
  is_active?: boolean
  is_permanent?: boolean
  expires_at?: string
  granted_at?: string
  expires_soon?: boolean
}

interface MigrationStatus {
  points_migrated?: number
  migrated?: boolean
  can_migrate?: boolean
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
  botrix_info?: {
    migrated?: boolean
    points_migrated?: number
  }
  subscriber_status?: {
    is_active?: boolean
    expires_soon?: boolean
  }
}

interface UserBadgeProps {
  user: Usuario
  size?: 'sm' | 'md' | 'lg'
  showTooltip?: boolean
}

export const UserBadge = ({ user, size = 'md', showTooltip = true }: UserBadgeProps) => {
  const badges = []

  // Compatibilidad: usar vip_info o vip_status
  const vipInfo = user.vip_info || user.vip_status

  // Badge VIP
  if (vipInfo?.is_active) {
    const vipBadge = (
      <Badge
        key="vip"
        colorScheme="yellow"
        fontSize={size === 'sm' ? 'xs' : 'sm'}
        px={size === 'sm' ? 2 : 3}
        py={1}
        borderRadius="md"
        fontWeight="bold"
        bg="linear-gradient(135deg, #FFD700, #FFA500)"
        color="black"
        border="1px solid"
        borderColor="yellow.400"
        _hover={{
          transform: 'scale(1.05)',
          boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)'
        }}
        transition="all 0.2s"
      >
        VIP
      </Badge>
    )

    if (showTooltip) {
      badges.push(
        <Tooltip
          key="vip-tooltip"
          label={
            vipInfo.is_permanent
              ? "Usuario VIP Permanente"
              : vipInfo.expires_at
              ? `VIP hasta ${new Date(vipInfo.expires_at).toLocaleDateString('es-ES')}`
              : "Usuario VIP"
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

  // Badge Suscriptor (si subscriber_status.is_active y no es VIP)
  if (user.subscriber_status?.is_active && !vipInfo?.is_active) {
    const subBadge = (
      <Badge
        key="sub"
        colorScheme="green"
        fontSize={size === 'sm' ? 'xs' : 'sm'}
        px={size === 'sm' ? 2 : 3}
        py={1}
        borderRadius="md"
        fontWeight="bold"
        bg="linear-gradient(135deg, #48BB78, #38A169)"
        color="white"
        border="1px solid"
        borderColor="green.400"
        _hover={{
          transform: 'scale(1.05)',
          boxShadow: '0 0 10px rgba(72, 187, 120, 0.5)'
        }}
        transition="all 0.2s"
      >
        SUB
      </Badge>
    )

    if (showTooltip) {
      badges.push(
        <Tooltip
          key="sub-tooltip"
          label="Suscriptor del canal"
          hasArrow
        >
          {subBadge}
        </Tooltip>
      )
    } else {
      badges.push(subBadge)
    }
  }

  // Badge migración Botrix - usando migration_status o botrix_info
  const migrationInfo = user.migration_status || user.botrix_info
  if (migrationInfo?.migrated && showTooltip && size !== 'sm') {
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
        label={`Migró ${migrationInfo.points_migrated?.toLocaleString()} puntos desde Botrix`}
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
      <Tooltip
        key="discord-tooltip"
        label={`Discord: ${user.discord_username}`}
        hasArrow
      >
        {discordBadge}
      </Tooltip>
    )
  }

  if (badges.length === 0) {
    return null
  }

  return (
    <HStack spacing={1} flexWrap="wrap">
      {badges}
    </HStack>
  )
}

// Componente para mostrar solo el avatar con distintivo visual
interface UserAvatarWithBadgeProps {
  user: Usuario
  children: React.ReactNode // El Avatar del usuario
}

export const UserAvatarWithBadge = ({ user, children }: UserAvatarWithBadgeProps) => {
  // Compatibilidad: usar vip_info o vip_status
  const vipInfo = user.vip_info || user.vip_status

  return (
    <Box position="relative" display="inline-block">
      {children}

      {/* Overlay para VIP */}
      {vipInfo?.is_active && (
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
            borderColor: 'yellow.300',
          }}
          animation="pulse 2s infinite"
          sx={{
            '@keyframes pulse': {
              '0%, 100%': { opacity: 1 },
              '50%': { opacity: 0.7 },
            },
          }}
        />
      )}

      {/* Overlay para Suscriptor (solo si no es VIP) */}
      {user.subscriber_status?.is_active && !vipInfo?.is_active && (
        <Box
          position="absolute"
          top="-2px"
          left="-2px"
          right="-2px"
          bottom="-2px"
          borderRadius="full"
          border="3px solid"
          borderColor="green.400"
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
            borderColor: 'green.300',
          }}
        />
      )}
    </Box>
  )
}
