import { useState } from 'react'
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
} from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { useRouter } from 'next/router'
import { Layout } from '../../../components/Layout'
import { RequireAdmin } from '../../../components/RequireAdmin'
import { useKickSubscriptions } from '../../../hooks/useKickSubscriptions'

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
  const { subscriptions, loading, error, refresh } = useKickSubscriptions()
  const [refreshing, setRefreshing] = useState(false)

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

          <Card borderRadius="xl" overflow="hidden">
            <CardBody p={0}>
              {!Array.isArray(subscriptions) || subscriptions.length === 0 ? (
                <Box p={8}>
                  <Alert status="info" borderRadius="lg" bg="blue.50" border="1px solid" borderColor="blue.200">
                    <AlertIcon />
                    <Box>
                      <Text fontWeight="bold" color="blue.800" mb={1}>Sin suscripciones activas</Text>
                      <Text fontSize="sm" color="blue.700">
                        No hay suscripciones activas. Conecta tu cuenta de Kick en la página principal para
                        auto-suscribirte a los eventos necesarios.
                      </Text>
                    </Box>
                  </Alert>
                </Box>
              ) : (
                <VStack spacing={0} align="stretch">
                  {/* Header de la tabla */}
                  <Box bg="purple.50" p={6} borderBottom="1px solid" borderColor="purple.100">
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
                      <Thead bg="gray.50">
                        <Tr>
                          <Th borderColor="gray.200" color="gray.700" fontWeight="bold">Evento</Th>
                          <Th borderColor="gray.200" color="gray.700" fontWeight="bold">Tipo</Th>
                          <Th borderColor="gray.200" color="gray.700" fontWeight="bold">Estado</Th>
                          <Th borderColor="gray.200" color="gray.700" fontWeight="bold">Broadcaster</Th>
                          <Th borderColor="gray.200" color="gray.700" fontWeight="bold">Fecha de Creación</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {subscriptions.filter(sub => sub && typeof sub === 'object').map((sub, index) => (
                          <Tr
                            key={sub.id || `sub-${index}`}
                            _hover={{ bg: "purple.25" }}
                            transition="background-color 0.2s"
                          >
                            <Td borderColor="gray.100" py={4}>
                              <VStack align="start" spacing={1}>
                                <Text fontWeight="semibold" color="gray.800">
                                  {EVENT_LABELS[sub.event_type] || 'Evento desconocido'}
                                </Text>
                                <Text fontSize="xs" color="gray.500">
                                  ID: {sub.subscription_id || 'N/A'}
                                </Text>
                              </VStack>
                            </Td>
                            <Td borderColor="gray.100">
                              <Badge colorScheme="purple" fontSize="xs" px={2} py={1} borderRadius="md">
                                {sub.event_type || 'N/A'}
                              </Badge>
                            </Td>
                            <Td borderColor="gray.100">
                              <Badge
                                colorScheme={sub.status === 'active' ? 'green' : sub.status === 'enabled' ? 'green' : 'gray'}
                                fontSize="xs"
                                px={2}
                                py={1}
                                borderRadius="md"
                              >
                                {sub.status === 'active' || sub.status === 'enabled' ? 'Activo' : 'Inactivo'}
                              </Badge>
                            </Td>
                            <Td borderColor="gray.100">
                              <Text fontSize="sm" color="gray.700">
                                {sub.broadcaster_user_id || 'N/A'}
                              </Text>
                            </Td>
                            <Td borderColor="gray.100">
                              <Text fontSize="sm" color="gray.700">
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
