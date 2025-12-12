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
}

export const UserBadge = ({ user, size = 'md', showTooltip = true }: UserBadgeProps) => {
  const badges = []

  // Compatibilidad: usar vip_info o vip_status
  const vipInfo = user.vip_info || user.vip_status
  const isSubscriber = user.subscriber_status?.is_active || user.user_type === 'subscriber'

  // Badge combinado para Sub + VIP
  if (isSubscriber && vipInfo?.is_active) {
    const combinedBadge = (
      <Badge
        key="sub-vip"
        fontSize={size === 'sm' ? 'xs' : 'sm'}
        px={size === 'sm' ? 2 : 3}
        py={1}
        borderRadius="md"
        fontWeight="bold"
        bg="linear-gradient(135deg, #48BB78, #FFD700)"
        color="white"
        border="1px solid"
        borderColor="green.400"
        _hover={{
          transform: 'scale(1.05)',
          boxShadow: '0 0 15px rgba(72, 187, 120, 0.7), 0 0 15px rgba(255, 215, 0, 0.7)'
        }}
        transition="all 0.2s"
      >
        SUB+VIP
      </Badge>
    )

    if (showTooltip) {
      badges.push(
        <Tooltip
          key="sub-vip-tooltip"
          label={
            vipInfo.is_permanent
              ? 'Suscriptor y VIP Permanente'
              : vipInfo.expires_at
                ? `Suscriptor y VIP hasta ${new Date(vipInfo.expires_at).toLocaleDateString('es-ES')}`
                : 'Suscriptor y VIP'
          }
          hasArrow
        >
          {combinedBadge}
        </Tooltip>
      )
    } else {
      badges.push(combinedBadge)
    }
  }
  // Badge Suscriptor (solo si no es VIP)
  else if (isSubscriber) {
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
        <Tooltip key="sub-tooltip" label="Suscriptor del canal" hasArrow>
          {subBadge}
        </Tooltip>
      )
    } else {
      badges.push(subBadge)
    }
  }
  // Badge VIP (solo si no es Subscriber)
  else if (vipInfo?.is_active) {
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
  const isSubscriber = user.subscriber_status?.is_active || user.user_type === 'subscriber'

  return (
    <Box position="relative" display="inline-block">
      <Box
        _hover={{
          transform: 'scale(1.1)',
          transition: 'transform 0.3s ease'
        }}
        transition="transform 0.3s ease"
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
    </Box>
  )
}
