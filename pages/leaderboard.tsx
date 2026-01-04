import { useState, useEffect } from 'react'
import { Layout } from '../components/Layout'
import {
  Box,
  Container,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  Badge,
  HStack,
  VStack,
  Text,
  Spinner,
  Center,
  useColorModeValue,
  Flex,
  Icon,
  Card,
  CardBody,
  Divider
} from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import { MdKeyboardArrowUp, MdKeyboardArrowDown, MdRemove, MdNewReleases } from 'react-icons/md'
import { useAuth } from '../hooks/useAuth'
import { UserBadge, UserAvatarWithBadge } from '../components/UserBadge'
import Head from 'next/head'
import { API_BASE_URL } from '../lib/api'
import { getAuthCookie } from '../lib/cookies'
import { SearchUserCombobox } from '../components/SearchUserCombobox'

// Animación elegante y sutil para top 3
const subtleGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(255, 215, 0, 0);
  }
  50% {
    box-shadow: 0 0 15px 0 rgba(255, 215, 0, 0.3);
  }
`

const subtleGlowSilver = keyframes`
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(192, 192, 192, 0);
  }
  50% {
    box-shadow: 0 0 15px 0 rgba(192, 192, 192, 0.3);
  }
`

const subtleGlowBronze = keyframes`
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(205, 127, 50, 0);
  }
  50% {
    box-shadow: 0 0 15px 0 rgba(205, 127, 50, 0.3);
  }
`

interface LeaderboardUser {
  usuario_id: number
  nickname: string
  puntos: number
  position: number
  position_change: number
  change_indicator: 'up' | 'down' | 'neutral' | 'new'
  previous_position: number | null
  previous_points: number | null
  is_vip: boolean
  is_subscriber: boolean
  watchtime_minutes?: number
  max_puntos?: number
  message_count?: number
  kick_data: {
    avatar_url?: string
    username?: string
  } | null
  discord_info?: {
    linked: boolean
    id: string
    username: string
    discriminator: string
    avatar: string
    display_name: string
    linked_at: string
  }
}

interface MyPositionData {
  usuario_id: number
  nickname: string
  puntos: number
  position: number
  position_change: number
  change_indicator: 'up' | 'down' | 'neutral' | 'new'
  previous_position: number | null
  previous_points: number | null
  is_vip: boolean
  is_subscriber: boolean
  watchtime_minutes?: number
  max_puntos?: number
  discord_info?: {
    linked: boolean
    id: string
    username: string
    discriminator: string
    avatar: string
    display_name: string
    linked_at: string
  }
}

export default function LeaderboardPage() {
  const { isAuthenticated } = useAuth()
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([])
  const [myPosition, setMyPosition] = useState<MyPositionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [daysUntilReset, setDaysUntilReset] = useState<number | null>(null)
  const [hoursUntilReset, setHoursUntilReset] = useState<number | null>(null)

  // Theme colors - must be called unconditionally
  const bgCard = useColorModeValue('white', 'gray.800')
  const bgHover = useColorModeValue('gray.50', 'gray.700')
  const textSecondary = useColorModeValue('gray.600', 'gray.400')
  const highlightBg = useColorModeValue('blue.50', 'blue.900')
  const highlightBorder = useColorModeValue('blue.500', 'blue.300')
  const theadBg = useColorModeValue('gray.50', 'gray.900')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  // Top 3 elegant styles
  const goldBg = useColorModeValue('rgba(255, 215, 0, 0.08)', 'rgba(255, 215, 0, 0.12)')
  const silverBg = useColorModeValue('rgba(192, 192, 192, 0.08)', 'rgba(192, 192, 192, 0.12)')
  const bronzeBg = useColorModeValue('rgba(205, 127, 50, 0.08)', 'rgba(205, 127, 50, 0.12)')

  const goldBorder = useColorModeValue('#FFD700', '#FDB813')
  const silverBorder = useColorModeValue('#C0C0C0', '#D3D3D3')
  const bronzeBorder = useColorModeValue('#CD7F32', '#E9964A')

  useEffect(() => {
    fetchLeaderboard()
    if (isAuthenticated) {
      fetchMyPosition()
    }
  }, [isAuthenticated])

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_BASE_URL}/api/leaderboard?limit=100`)
      const data = await response.json()

      if (data.success && data.data) {
        setLeaderboard(data.data)
        // Capturar información de reset si está disponible
        if (data.meta) {
          setDaysUntilReset(data.meta.days_until_reset ?? null)
          setHoursUntilReset(data.meta.hours_until_reset ?? null)
        }
      } else {
        setError(data.message || 'Error al cargar el leaderboard')
        console.error('Error en respuesta:', data)
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err)
      setError('Error de conexión con el servidor')
    } finally {
      setLoading(false)
    }
  }

  const fetchMyPosition = async () => {
    try {
      const token = getAuthCookie()
      if (!token) {
        console.log('No auth token found')
        return
      }

      const response = await fetch(`${API_BASE_URL}/api/leaderboard/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const data = await response.json()

      if (data.success && data.data) {
        setMyPosition(data.data)
      } else {
        console.log('No position data received:', data)
      }
    } catch (err) {
      console.error('Error fetching my position:', err)
    }
  }

  const renderChangeIndicator = (user: LeaderboardUser | MyPositionData) => {
    const { change_indicator, position_change } = user

    switch (change_indicator) {
      case 'up':
        return (
          <HStack spacing={1} color="green.500">
            <Icon as={MdKeyboardArrowUp} boxSize={5} />
            <Text fontWeight="bold" fontSize="sm">
              {position_change}
            </Text>
          </HStack>
        )
      case 'down':
        return (
          <HStack spacing={1} color="red.500">
            <Icon as={MdKeyboardArrowDown} boxSize={5} />
            <Text fontWeight="bold" fontSize="sm">
              {position_change}
            </Text>
          </HStack>
        )
      case 'new':
        return (
          <HStack spacing={1} color="yellow.500">
            <Icon as={MdNewReleases} boxSize={5} />
            <Text fontWeight="bold" fontSize="xs">
              NEW
            </Text>
          </HStack>
        )
      default:
        return <Icon as={MdRemove} boxSize={5} color={textSecondary} />
    }
  }

  const getPositionColor = (position: number) => {
    if (position === 1) return 'yellow.400'
    if (position === 2) return 'gray.400'
    if (position === 3) return 'orange.600'
    return textSecondary
  }

  const getTopThreeStyle = (position: number) => {
    if (position === 1) {
      return {
        bg: goldBg,
        borderLeft: '3px solid',
        borderLeftColor: goldBorder,
        animation: `${subtleGlow} 3s ease-in-out infinite`,
        transition: 'all 0.2s ease'
      }
    }

    if (position === 2) {
      return {
        bg: silverBg,
        borderLeft: '3px solid',
        borderLeftColor: silverBorder,
        animation: `${subtleGlowSilver} 3s ease-in-out infinite`,
        transition: 'all 0.2s ease'
      }
    }

    if (position === 3) {
      return {
        bg: bronzeBg,
        borderLeft: '3px solid',
        borderLeftColor: bronzeBorder,
        animation: `${subtleGlowBronze} 3s ease-in-out infinite`,
        transition: 'all 0.2s ease'
      }
    }

    return {}
  }

  const formatWatchtime = (minutes?: number) => {
    if (!minutes || minutes === 0) return '0 min'

    // Si es menor a 60 minutos, mostrar solo minutos
    if (minutes < 60) {
      return `${Math.round(minutes)} min`
    }

    // Si es menor a 24 horas, mostrar horas (sin minutos si cumple hora)
    if (minutes < 60 * 24) {
      const hours = Math.floor(minutes / 60)
      const mins = minutes % 60
      // Si hay minutos pero no llega a cumplir otra hora, mostrar minutos
      return mins > 0 ? `${hours}h ${Math.round(mins)} min` : `${hours}h`
    }

    // Si es menor a 7 días, mostrar días y horas
    if (minutes < 60 * 24 * 7) {
      const days = Math.floor(minutes / (60 * 24))
      const remainingMinutes = minutes % (60 * 24)
      const hours = Math.floor(remainingMinutes / 60)
      const mins = remainingMinutes % 60
      // Solo mostrar minutos si no hay horas o si hay minutos sin llegar a otra hora
      if (hours === 0 && mins > 0) {
        return `${days}d ${Math.round(mins)} min`
      }
      return hours > 0 ? `${days}d ${hours}h` : `${days}d`
    }

    // Si es menor a 30 días, mostrar semanas, días y horas
    if (minutes < 60 * 24 * 30) {
      const weeks = Math.floor(minutes / (60 * 24 * 7))
      const remainingMinutes = minutes % (60 * 24 * 7)
      const days = Math.floor(remainingMinutes / (60 * 24))
      const remainingMinsAfterDays = remainingMinutes % (60 * 24)
      const hours = Math.floor(remainingMinsAfterDays / 60)
      const mins = remainingMinsAfterDays % 60

      // Si no hay horas pero hay minutos, mostrar minutos
      if (hours === 0 && mins > 0) {
        if (days > 0) {
          return `${weeks}s ${days}d ${Math.round(mins)} min`
        }
        return `${weeks}s ${Math.round(mins)} min`
      }

      if (hours > 0) {
        return days > 0 ? `${weeks}s ${days}d ${hours}h` : `${weeks}s ${hours}h`
      } else if (days > 0) {
        return `${weeks}s ${days}d`
      }
      return `${weeks}s`
    }

    // Si es menor a 365 días, mostrar meses, días y horas
    if (minutes < 60 * 24 * 365) {
      const months = Math.floor(minutes / (60 * 24 * 30))
      const remainingMinutes = minutes % (60 * 24 * 30)
      const days = Math.floor(remainingMinutes / (60 * 24))
      const remainingMinsAfterDays = remainingMinutes % (60 * 24)
      const hours = Math.floor(remainingMinsAfterDays / 60)
      const mins = remainingMinsAfterDays % 60

      // Si no hay horas pero hay minutos, mostrar minutos
      if (hours === 0 && mins > 0) {
        if (days > 0) {
          return `${months}m ${days}d ${Math.round(mins)} min`
        }
        return `${months}m ${Math.round(mins)} min`
      }

      if (hours > 0) {
        return days > 0 ? `${months}m ${days}d ${hours}h` : `${months}m ${hours}h`
      } else if (days > 0) {
        return `${months}m ${days}d`
      }
      return `${months}m`
    }

    // Si es 365 días o más, mostrar años, meses, semanas y horas
    const years = Math.floor(minutes / (60 * 24 * 365))
    const remainingMinutes = minutes % (60 * 24 * 365)
    const months = Math.floor(remainingMinutes / (60 * 24 * 30))
    const remainingMinsAfterMonths = remainingMinutes % (60 * 24 * 30)
    const weeks = Math.floor(remainingMinsAfterMonths / (60 * 24 * 7))
    const remainingMinsAfterWeeks = remainingMinsAfterMonths % (60 * 24 * 7)
    const days = Math.floor(remainingMinsAfterWeeks / (60 * 24))
    const remainingMinsAfterDays = remainingMinsAfterWeeks % (60 * 24)
    const hours = Math.floor(remainingMinsAfterDays / 60)
    const mins = remainingMinsAfterDays % 60

    // Si no hay horas pero hay minutos, mostrar minutos
    if (hours === 0 && mins > 0) {
      if (weeks > 0) {
        return days > 0 ? `${years}a ${months}m ${weeks}s ${days}d ${Math.round(mins)} min` : `${years}a ${months}m ${weeks}s ${Math.round(mins)} min`
      } else if (days > 0) {
        return `${years}a ${months}m ${days}d ${Math.round(mins)} min`
      }
      return `${years}a ${months}m ${Math.round(mins)} min`
    }

    if (hours > 0) {
      if (weeks > 0) {
        return days > 0 ? `${years}a ${months}m ${weeks}s ${days}d ${hours}h` : `${years}a ${months}m ${weeks}s ${hours}h`
      } else if (days > 0) {
        return `${years}a ${months}m ${days}d ${hours}h`
      }
      return `${years}a ${months}m ${hours}h`
    } else if (weeks > 0) {
      return days > 0 ? `${years}a ${months}m ${weeks}s ${days}d` : `${years}a ${months}m ${weeks}s`
    } else if (days > 0) {
      return `${years}a ${months}m ${days}d`
    } else if (months > 0) {
      return `${years}a ${months}m`
    }
    return `${years}a`
  }

  return (
    <Layout>
      <Head>
        <title>Leaderboard | Luisardito Shop</title>
        <meta name="description" content="Top ranking de usuarios por puntos" />
      </Head>

      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box textAlign="center" mb={6}>
            <Heading size="lg" mb={1} fontWeight="bold">
              Tabla de Clasificación
            </Heading>
            <Text color={textSecondary} fontSize="sm">
              Rankings en tiempo real
            </Text>
            {(daysUntilReset !== null || hoursUntilReset !== null) && (
              <Text color={textSecondary} fontSize="xs" mt={2}>
                {daysUntilReset && daysUntilReset > 0
                  ? `Reinicia en ${daysUntilReset} día${daysUntilReset !== 1 ? 's' : ''}`
                  : hoursUntilReset && hoursUntilReset > 0
                    ? `Reinicia en ${hoursUntilReset} hora${hoursUntilReset !== 1 ? 's' : ''}`
                    : 'Reinicia pronto'}
              </Text>
            )}
          </Box>

          {/* Search User Combobox */}
          {!loading && !error && (
            <Box textAlign="center" mb={4}>
              <SearchUserCombobox users={leaderboard} />
            </Box>
          )}

          {/* My Position Card */}
          {isAuthenticated && myPosition && (
            <Card
              bg={highlightBg}
              borderWidth="1px"
              borderColor={highlightBorder}
              shadow="sm"
              size="sm"
            >
              <CardBody py={3}>
                <Flex align="center" justify="space-between" gap={4} flexWrap="wrap">
                  <HStack spacing={3}>
                    <Box>
                      <Text fontSize="xs" fontWeight="medium" color={textSecondary} mb={0.5}>
                        Tu Posición
                      </Text>
                      <HStack spacing={2}>
                        <Text fontSize="2xl" fontWeight="bold" lineHeight="1">
                          #{myPosition.position}
                        </Text>
                        {renderChangeIndicator(myPosition)}
                      </HStack>
                    </Box>
                  </HStack>

                  <HStack spacing={4} divider={<Divider orientation="vertical" h="30px" />}>
                    {myPosition.watchtime_minutes !== undefined && (
                      <VStack align="start" spacing={0}>
                        <Text fontSize="xs" color={textSecondary}>
                          Watchtime
                        </Text>
                        <Text fontSize="lg" fontWeight="semibold">
                          {formatWatchtime(myPosition.watchtime_minutes)}
                        </Text>
                      </VStack>
                    )}

                    {myPosition.max_puntos !== undefined && (
                      <VStack align="start" spacing={0}>
                        <Text fontSize="xs" color={textSecondary}>
                          Max Puntos
                        </Text>
                        <Text fontSize="lg" fontWeight="semibold">
                          {myPosition.max_puntos.toLocaleString()}
                        </Text>
                      </VStack>
                    )}

                    <VStack align="start" spacing={0}>
                      <Text fontSize="xs" color={textSecondary}>
                        Puntos
                      </Text>
                      <Text fontSize="lg" fontWeight="semibold">
                        {myPosition.puntos.toLocaleString()}
                      </Text>
                    </VStack>

                    {myPosition.previous_points && (
                      <VStack align="start" spacing={0}>
                        <Text fontSize="xs" color={textSecondary}>
                          Anterior
                        </Text>
                        <Text fontSize="md">{myPosition.previous_points.toLocaleString()}</Text>
                      </VStack>
                    )}
                  </HStack>
                </Flex>
              </CardBody>
            </Card>
          )}

          {/* Leaderboard Table */}
          <Card
            bg={bgCard}
            shadow="sm"
            overflow="hidden"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <CardBody p={0}>
              {loading ? (
                <Center py={8}>
                  <VStack spacing={3}>
                    <Spinner size="lg" color="blue.500" thickness="3px" />
                    <Text color={textSecondary} fontSize="sm">
                      Cargando rankings...
                    </Text>
                  </VStack>
                </Center>
              ) : error ? (
                <Center py={8}>
                  <VStack spacing={3}>
                    <Text color="red.500" fontWeight="semibold" fontSize="sm">
                      {error}
                    </Text>
                    <Text color={textSecondary} fontSize="xs">
                      Verifica que el backend esté ejecutándose correctamente.
                    </Text>
                  </VStack>
                </Center>
              ) : (
                <Box overflowX="auto">
                  <Table variant="simple" size="sm">
                    <Thead bg={theadBg}>
                      <Tr>
                        <Th w="70px" fontSize="xs">
                          Pos
                        </Th>
                        <Th fontSize="xs">Usuario</Th>
                        <Th isNumeric fontSize="xs">
                          Watchtime
                        </Th>
                        <Th w="120px" isNumeric fontSize="xs">
                          Max Puntos
                        </Th>
                        <Th w="90px" isNumeric fontSize="xs">
                          Puntos
                        </Th>
                        <Th w="100px" textAlign="center" fontSize="xs">
                          Cambio
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {leaderboard.map((user) => (
                        <Tr
                          key={user.usuario_id}
                          id={`user-${user.usuario_id}`}
                          bg={
                            user.usuario_id === myPosition?.usuario_id ? highlightBg : 'transparent'
                          }
                          {...(user.usuario_id === myPosition?.usuario_id && {
                            borderLeft: '3px solid',
                            borderLeftColor: highlightBorder
                          })}
                          _hover={{ bg: bgHover }}
                          {...(user.position <= 3 && getTopThreeStyle(user.position))}
                        >
                          <Td>
                            <Text
                              fontSize="md"
                              fontWeight="bold"
                              color={getPositionColor(user.position)}
                            >
                              #{user.position}
                            </Text>
                          </Td>

                          <Td>
                            <HStack spacing={2}>
                              <UserAvatarWithBadge
                                user={{
                                  id: user.usuario_id,
                                  email: '',
                                  puntos: user.puntos,
                                  rol_id: user.is_vip ? 5 : 1,
                                  nickname: user.nickname,
                                  discord_username: user.kick_data?.username,
                                  user_type: user.is_subscriber
                                    ? 'subscriber'
                                    : user.is_vip
                                      ? 'vip'
                                      : 'regular',
                                  vip_info: user.is_vip ? { is_active: true } : undefined,
                                  subscriber_status: user.is_subscriber
                                    ? { is_active: true, expires_soon: false }
                                    : undefined
                                }}
                                imageUrl={user.kick_data?.avatar_url}
                              >
                                <Avatar
                                  size="xs"
                                  name={user.nickname}
                                  src={user.kick_data?.avatar_url}
                                  bg="blue.500"
                                />
                              </UserAvatarWithBadge>
                              <VStack align="start" spacing={0}>
                                <HStack spacing={0.5}>
                                  <Text fontWeight="medium" fontSize="sm">
                                    {user.nickname}
                                  </Text>
                                  {isAuthenticated &&
                                    myPosition &&
                                    user.usuario_id === myPosition.usuario_id && (
                                      <Badge
                                        colorScheme="blue"
                                        fontSize="xs"
                                        px={2}
                                        py={0.5}
                                        borderRadius="md"
                                        fontWeight="bold"
                                      >
                                        Tú
                                      </Badge>
                                    )}
                                  <Box ml="auto">
                                    <UserBadge
                                      user={{
                                        id: user.usuario_id,
                                        email: '',
                                        puntos: user.puntos,
                                        rol_id: user.is_vip ? 5 : 1,
                                        nickname: user.nickname,
                                        discord_username: user.kick_data?.username,
                                        user_type: user.is_subscriber
                                          ? 'subscriber'
                                          : user.is_vip
                                            ? 'vip'
                                            : 'regular',
                                        vip_info: user.is_vip ? { is_active: true } : undefined,
                                        subscriber_status: user.is_subscriber
                                          ? { is_active: true, expires_soon: false }
                                          : undefined
                                      }}
                                      size="sm"
                                    />
                                  </Box>
                                </HStack>
                              </VStack>
                            </HStack>
                          </Td>

                          <Td isNumeric>
                            <Text fontSize="sm" color={textSecondary}>
                              {formatWatchtime(user.watchtime_minutes)}
                            </Text>
                          </Td>

                          <Td isNumeric>
                            <Text fontSize="sm" color={textSecondary}>
                              {(user.max_puntos ?? 0).toLocaleString()}
                            </Text>
                          </Td>

                          <Td isNumeric>
                            <Text fontSize="md" fontWeight="semibold">
                              {user.puntos.toLocaleString()}
                            </Text>
                          </Td>

                          <Td textAlign="center">
                            {renderChangeIndicator(user)}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              )}
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Layout>
  )
}
