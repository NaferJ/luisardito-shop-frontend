import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Card,
  CardBody,
  Button,
  Alert,
  AlertIcon,
  Spinner,
  useToast,
  Badge,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useColorModeValue,
} from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { useRouter } from 'next/router'
import { Layout } from '../../../components/Layout'
import { RequireAdmin } from '../../../components/RequireAdmin'
import { useKickSubscriptions } from '../../../hooks/useKickSubscriptions'
import { useAuth } from '../../../hooks/useAuth'

const EVENT_LABELS: Record<string, string> = {
  'chat.message.sent': 'Mensajes de Chat',
  'channel.followed': 'Nuevos Seguidores',
  'channel.subscription.new': 'Nuevas Suscripciones',
  'channel.subscription.renewal': 'Renovaciones de Suscripción',
  'channel.subscription.gifts': 'Regalos de Suscripción',
  'livestream.status.updated': 'Estado del Stream',
  'livestream.metadata.updated': 'Metadatos del Stream',
}

export default function KickSubscriptionsPage() {
  const router = useRouter()
  const toast = useToast()
  const { user } = useAuth()
  const { subscriptions, loading, error, refresh } = useKickSubscriptions()
  const [refreshing, setRefreshing] = useState(false)

  // Solo desarrolladores (rol_id 5) pueden acceder
  const isDeveloper = user?.rol_id === 5

  // Redirigir si no es desarrollador
  useEffect(() => {
    if (user && !isDeveloper) {
      router.push('/admin/kick')
    }
  }, [user, isDeveloper, router])

  // Color mode values
  const cardBg = useColorModeValue('white', 'gray.800')
  const cardBorder = useColorModeValue('gray.100', 'gray.600')
  const headerBg = useColorModeValue('purple.50', 'purple.900')
  const headerBorder = useColorModeValue('purple.100', 'purple.700')
  const tableHeaderBg = useColorModeValue('gray.50', 'gray.700')
  const tableBorder = useColorModeValue('gray.200', 'gray.600')
  const tableHoverBg = useColorModeValue('purple.25', 'purple.800')
  const infoAlertBg = useColorModeValue('blue.50', 'blue.900')
  const infoAlertBorder = useColorModeValue('blue.200', 'blue.700')
  const infoAlertTextColor = useColorModeValue('blue.800', 'blue.200')
  const infoAlertDescColor = useColorModeValue('blue.700', 'blue.300')
  const textColor = useColorModeValue('gray.800', 'gray.200')
  const textSecondaryColor = useColorModeValue('gray.500', 'gray.400')
  const textMutedColor = useColorModeValue('gray.700', 'gray.300')

  const handleRefresh = async () => {
    try {
      setRefreshing(true)
      await refresh()
      toast({
        title: 'Suscripciones actualizadas',
        status: 'success',
        duration: 2000,
      })
    } catch (err) {
      toast({
        title: 'Error al actualizar',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setRefreshing(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <Container maxW="container.xl" py={8}>
          <VStack spacing={8}>
            <Spinner size="xl" />
            <Text>Cargando suscripciones...</Text>
          </VStack>
        </Container>
      </Layout>
    )
  }

  // Si no es desarrollador, mostrar mensaje de acceso restringido
  if (user && !isDeveloper) {
    return (
      <Layout>
        <Container maxW="container.xl" py={8}>
          <VStack spacing={8}>
            <Alert status="warning" borderRadius="xl">
              <AlertIcon />
              <Box>
                <Text fontWeight="bold">Acceso Restringido</Text>
                <Text fontSize="sm">Esta sección está disponible solo para desarrolladores.</Text>
              </Box>
            </Alert>
            <Button onClick={() => router.push('/admin/kick')} colorScheme="purple">
              Volver a Administración de Kick
            </Button>
          </VStack>
        </Container>
      </Layout>
    )
  }

  return (
    <Layout>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Header mejorado */}
          <Box>
            <HStack mb={4}>
              <IconButton
                aria-label="Volver"
                icon={<ArrowBackIcon />}
                onClick={() => router.push('/admin/kick')}
                variant="ghost"
                size="lg"
              />
              <VStack align="start" spacing={1} flex={1}>
                <Heading size="xl" color="purple.600">
                  Suscripciones de Eventos
                </Heading>
                <Text color="gray.600" fontSize="lg">
                  Eventos de Kick a los que estás suscrito para recibir notificaciones
                </Text>
              </VStack>
              <Button
                onClick={handleRefresh}
                isLoading={refreshing}
                colorScheme="purple"
                variant="outline"
                borderRadius="lg"
              >
                Refrescar
              </Button>
            </HStack>

            {/* Stats rápidas */}
            {Array.isArray(subscriptions) && subscriptions.length > 0 && (
              <HStack spacing={4} flexWrap="wrap">
                <Badge colorScheme="purple" fontSize="sm" px={3} py={1}>
                  {subscriptions.length} suscripciones
                </Badge>
                <Badge
                  colorScheme={subscriptions.filter(s => s.status === 'active').length > 0 ? "green" : "gray"}
                  fontSize="sm"
                  px={3}
                  py={1}
                >
                  {subscriptions.filter(s => s.status === 'active').length} activas
                </Badge>
              </HStack>
            )}
          </Box>

          {error && (
            <Alert status="error" borderRadius="xl">
              <AlertIcon />
              <Box>
                <Text fontWeight="bold">Error al cargar suscripciones</Text>
                <Text fontSize="sm">{error}</Text>
              </Box>
            </Alert>
          )}

          <Card borderRadius="xl" overflow="hidden" bg={cardBg} border="1px solid" borderColor={cardBorder}>
            <CardBody p={0}>
              {!Array.isArray(subscriptions) || subscriptions.length === 0 ? (
                <Box p={8}>
                  <Alert status="info" borderRadius="lg" bg={infoAlertBg} border="1px solid" borderColor={infoAlertBorder}>
                    <AlertIcon />
                    <Box>
                      <Text fontWeight="bold" color={infoAlertTextColor} mb={1}>Sin suscripciones activas</Text>
                      <Text fontSize="sm" color={infoAlertDescColor}>
                        No hay suscripciones activas. Conecta tu cuenta de Kick en la página principal para
                        auto-suscribirte a los eventos necesarios.
                      </Text>
                    </Box>
                  </Alert>
                </Box>
              ) : (
                <VStack spacing={0} align="stretch">
                  {/* Header de la tabla */}
                  <Box bg={headerBg} p={6} borderBottom="1px solid" borderColor={headerBorder}>
                    <HStack justify="space-between" mb={2}>
                      <Heading size="lg" color="purple.700">Eventos Activos</Heading>
                      <Badge colorScheme="green" fontSize="md" px={4} py={2} borderRadius="full">
                        {subscriptions.length} {subscriptions.length === 1 ? 'evento' : 'eventos'}
                      </Badge>
                    </HStack>
                    <Text color="purple.600" fontSize="sm">
                      Lista de todos los eventos de Kick a los que estás suscrito
                    </Text>
                  </Box>

                  {/* Tabla mejorada */}
                  <TableContainer>
                    <Table variant="simple" size="md">
                      <Thead bg={tableHeaderBg}>
                        <Tr>
                          <Th borderColor={tableBorder} color={textMutedColor} fontWeight="bold">Evento</Th>
                          <Th borderColor={tableBorder} color={textMutedColor} fontWeight="bold">Tipo</Th>
                          <Th borderColor={tableBorder} color={textMutedColor} fontWeight="bold">Estado</Th>
                          <Th borderColor={tableBorder} color={textMutedColor} fontWeight="bold">Broadcaster</Th>
                          <Th borderColor={tableBorder} color={textMutedColor} fontWeight="bold">Fecha de Creación</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {subscriptions.filter(sub => sub && typeof sub === 'object').map((sub, index) => (
                          <Tr
                            key={sub.id || `sub-${index}`}
                            _hover={{ bg: tableHoverBg }}
                            transition="background-color 0.2s"
                          >
                            <Td borderColor={tableBorder} py={4}>
                              <VStack align="start" spacing={1}>
                                <Text fontWeight="semibold" color={textColor}>
                                  {EVENT_LABELS[sub.event_type] || 'Evento desconocido'}
                                </Text>
                                <Text fontSize="xs" color={textSecondaryColor}>
                                  ID: {sub.subscription_id || 'N/A'}
                                </Text>
                              </VStack>
                            </Td>
                            <Td borderColor={tableBorder}>
                              <Badge colorScheme="purple" fontSize="xs" px={2} py={1} borderRadius="md">
                                {sub.event_type || 'N/A'}
                              </Badge>
                            </Td>
                            <Td borderColor={tableBorder}>
                              <Badge
                                colorScheme={sub.status === 'active' || sub.status === 'enabled' ? 'green' : 'gray'}
                                fontSize="xs"
                                px={2}
                                py={1}
                                borderRadius="md"
                              >
                                {sub.status === 'active' || sub.status === 'enabled' ? 'Activo' : 'Inactivo'}
                              </Badge>
                            </Td>
                            <Td borderColor={tableBorder}>
                              <Text fontSize="sm" color={textColor}>
                                {sub.broadcaster_user_id || 'N/A'}
                              </Text>
                            </Td>
                            <Td borderColor={tableBorder}>
                              <Text fontSize="sm" color={textColor}>
                                {sub.created_at
                                  ? new Date(sub.created_at).toLocaleDateString('es-ES', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric'
                                    })
                                  : 'N/A'
                                }
                              </Text>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </VStack>
              )}
            </CardBody>
          </Card>

          {/* Información adicional mejorada */}
          <Alert status="info" borderRadius="xl" bg="blue.50" border="1px solid" borderColor="blue.200">
            <AlertIcon color="blue.500" />
            <Box>
              <Text fontWeight="bold" mb={2} color="blue.800">
                📡 Suscripciones Automáticas
              </Text>
              <Text fontSize="sm" color="blue.700" lineHeight={1.6}>
                Cuando el broadcaster conecta su cuenta de Kick, se suscriben automáticamente a todos los eventos
                necesarios para otorgar puntos. Las suscripciones se gestionan automáticamente y no requieren
                intervención manual.
              </Text>
            </Box>
          </Alert>
        </VStack>
      </Container>
    </Layout>
  )
}

KickSubscriptionsPage.getLayout = (page: React.ReactElement) => <RequireAdmin>{page}</RequireAdmin>
