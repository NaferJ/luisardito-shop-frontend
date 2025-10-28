import { Layout } from '../components/Layout'
import { RequireAuth } from '../components/RequireAuth'
import { useAuth } from '../hooks/useAuth'
import { useHistorialPuntos } from '../hooks/useHistorialPuntos'
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Badge,
  Spinner,
  Center,
  Card,
  CardBody,
  Heading,
  Divider,
  Icon,
  Switch,
  FormControl,
  FormLabel,
  Tooltip,
} from '@chakra-ui/react'
import { useState } from 'react'
import { MdStar, MdSwapHoriz, MdChat, MdPerson, MdCrown } from 'react-icons/md'

export default function HistorialPage() {
  const { user } = useAuth()
  const [includeAll, setIncludeAll] = useState(false)
  const { data: historial, isLoading, error } = useHistorialPuntos(user?.id, includeAll)

  // Función para obtener el icono y color según el tipo de evento
  const getEventIcon = (movimiento: any) => {
    const concept = movimiento.concepto || movimiento.motivo
    const eventData = movimiento.kick_event_data

    if (eventData?.event_type === 'botrix_migration') {
      return { icon: MdSwapHoriz, color: 'cyan.500' }
    }
    if (eventData?.event_type === 'vip_granted') {
      return { icon: MdCrown, color: 'yellow.500' }
    }
    if (concept?.includes('VIP') || eventData?.is_vip) {
      return { icon: MdCrown, color: 'yellow.500' }
    }
    if (concept?.includes('chat') || concept?.includes('mensaje')) {
      return { icon: MdChat, color: 'blue.500' }
    }
    if (concept?.includes('follow') || concept?.includes('seguir')) {
      return { icon: MdPerson, color: 'green.500' }
    }
    if (concept?.includes('suscr') || eventData?.user_type === 'subscriber') {
      return { icon: MdStar, color: 'purple.500' }
    }

    return { icon: MdSwapHoriz, color: 'gray.500' }
  }

  const getEventDescription = (movimiento: any) => {
    const concept = movimiento.concepto || movimiento.motivo
    const eventData = movimiento.kick_event_data

      console.log('Movimiento:', movimiento);
      console.log('Datos del evento:', eventData);

    if (eventData?.event_type === 'botrix_migration') {
      return {
        title: 'Migración desde Botrix',
        subtitle: `${eventData.original_points?.toLocaleString()} puntos migrados automáticamente`,
        badge: { text: '🔄 Migración', color: 'cyan' }
      }
    }

    if (eventData?.event_type === 'vip_granted') {
      const duration = eventData.duration_days
        ? `por ${eventData.duration_days} días`
        : 'permanente'
      return {
        title: `VIP otorgado (${duration})`,
        subtitle: 'Estado VIP activado',
        badge: { text: 'VIP', color: 'yellow' }
      }
    }

    if (concept?.includes('vip') || eventData?.is_vip) {
      return {
        title: concept,
        subtitle: 'Evento con bonificación VIP',
        badge: { text: 'VIP', color: 'yellow' }
      }
    }

    if (eventData?.user_type === 'subscriber') {
      return {
        title: concept,
        subtitle: 'Evento con bonificación de suscriptor',
        badge: { text: 'SUB', color: 'purple' }
      }
    }

    return {
      title: concept,
      subtitle: null,
      badge: null
    }
  }

  if (isLoading) {
    return (
      <RequireAuth>
        <Layout>
          <Center mt={10}><Spinner size="xl" /></Center>
        </Layout>
      </RequireAuth>
    )
  }

  if (error) {
    return (
      <RequireAuth>
        <Layout>
          <Center mt={10}>Error al cargar el historial de puntos</Center>
        </Layout>
      </RequireAuth>
    )
  }

  const getChangeColor = (cambio: number) => {
    return cambio > 0 ? 'green' : 'red'
  }

  const getChangeText = (cambio: number) => {
    return cambio > 0 ? `+${cambio}` : `${cambio}`
  }

  return (
    <RequireAuth>
      <Layout>
        <Container maxW="container.lg" py={8}>
          <VStack spacing={6} align="stretch">
            {/* Encabezado */}
            <Box>
              <Heading size="xl" mb={2}>Historial de Puntos</Heading>
              <HStack justify="space-between" align="center">
                <Text color="gray.600">
                  Saldo actual: <Badge colorScheme="purple" fontSize="md">{user?.puntos?.toLocaleString()} puntos</Badge>
                </Text>

                {/* Toggle para admins */}
                {user?.rol_id && [3, 4].includes(user.rol_id) && (
                  <FormControl display="flex" alignItems="center" w="auto">
                    <FormLabel htmlFor="include-all" mb="0" fontSize="sm">
                      Ver eventos de chat automático
                    </FormLabel>
                    <Tooltip label="Los administradores pueden ver todos los eventos, incluyendo chat automático">
                      <Switch
                        id="include-all"
                        isChecked={includeAll}
                        onChange={(e) => setIncludeAll(e.target.checked)}
                        colorScheme="purple"
                        size="sm"
                      />
                    </Tooltip>
                  </FormControl>
                )}
              </HStack>
            </Box>

            {/* Lista de movimientos */}
            {!historial || historial.length === 0 ? (
              <Center py={10}>
                <VStack spacing={4}>
                  <Text fontSize="lg" color="gray.500">
                    No hay movimientos de puntos
                  </Text>
                  <Text fontSize="sm" color="gray.400">
                    Los movimientos de puntos aparecerán aquí cuando realices canjes o recibas puntos
                  </Text>
                </VStack>
              </Center>
            ) : (
              <VStack spacing={4} align="stretch">
                {historial.map((movimiento) => {
                  const eventIcon = getEventIcon(movimiento)
                  const eventDesc = getEventDescription(movimiento)

                  return (
                    <Card key={movimiento.id} _hover={{ shadow: 'md' }} transition="all 0.2s">
                      <CardBody>
                        <HStack justify="space-between" align="start" spacing={4}>
                          {/* Icono y contenido */}
                          <HStack spacing={3} flex="1">
                            <Icon
                              as={eventIcon.icon}
                              color={eventIcon.color}
                              boxSize={5}
                              mt={1}
                            />
                            <VStack align="start" spacing={1} flex="1">
                              <HStack>
                                <Text fontWeight="semibold" fontSize="md">
                                  {eventDesc.title}
                                </Text>
                                {eventDesc.badge && (
                                  <Badge
                                    colorScheme={eventDesc.badge.color}
                                    size="sm"
                                    fontSize="xs"
                                  >
                                    {eventDesc.badge.text}
                                  </Badge>
                                )}
                              </HStack>

                              {eventDesc.subtitle && (
                                <Text fontSize="sm" color="gray.600">
                                  {eventDesc.subtitle}
                                </Text>
                              )}

                              <Text fontSize="xs" color="gray.500">
                                {new Date(movimiento.fecha).toLocaleDateString('es-ES', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </Text>
                            </VStack>
                          </HStack>

                          {/* Badge de puntos */}
                          <Badge
                            colorScheme={getChangeColor(movimiento.cambio || movimiento.puntos)}
                            fontSize="md"
                            px={3}
                            py={2}
                            borderRadius="lg"
                            fontWeight="bold"
                          >
                            {getChangeText(movimiento.cambio || movimiento.puntos)} puntos
                          </Badge>
                        </HStack>
                      </CardBody>
                    </Card>
                  )
                })}
              </VStack>
            )}

            <Divider />

            <VStack spacing={2}>
              <Text fontSize="sm" color="gray.500" textAlign="center">
                Los puntos se obtienen por participar en actividades y se gastan al canjear productos
              </Text>
              <HStack spacing={4} fontSize="xs" color="gray.400">
                <HStack spacing={1}>
                  <Icon as={MdSwapHoriz} color="cyan.500" />
                  <Text>Migración</Text>
                </HStack>
                <HStack spacing={1}>
                  <Icon as={MdCrown} color="yellow.500" />
                  <Text>VIP</Text>
                </HStack>
                <HStack spacing={1}>
                  <Icon as={MdStar} color="purple.500" />
                  <Text>Suscriptor</Text>
                </HStack>
                <HStack spacing={1}>
                  <Icon as={MdChat} color="blue.500" />
                  <Text>Chat</Text>
                </HStack>
              </HStack>
            </VStack>
          </VStack>
        </Container>
      </Layout>
    </RequireAuth>
  )
}
