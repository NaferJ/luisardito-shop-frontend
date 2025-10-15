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
          {/* Header */}
          <HStack>
            <IconButton
              aria-label="Volver"
              icon={<ArrowBackIcon />}
              onClick={() => router.push('/admin/kick')}
            />
            <Box flex={1}>
              <Heading size="xl" mb={2}>
                Suscripciones de Eventos
              </Heading>
              <Text color="gray.600">Eventos de Kick a los que estás suscrito</Text>
            </Box>
            <Button onClick={handleRefresh} isLoading={refreshing}>
              Refrescar
            </Button>
          </HStack>

          {error && (
            <Alert status="error">
              <AlertIcon />
              {error}
            </Alert>
          )}

          <Card>
            <CardBody>
              {subscriptions.length === 0 ? (
                <Alert status="info">
                  <AlertIcon />
                  No hay suscripciones activas. Conecta tu cuenta de Kick en la página principal para
                  auto-suscribirte a los eventos necesarios.
                </Alert>
              ) : (
                <VStack spacing={4} align="stretch">
                  <HStack justify="space-between" mb={2}>
                    <Heading size="md">Eventos Activos</Heading>
                    <Badge colorScheme="green" fontSize="md" px={3} py={1}>
                      {subscriptions.length} {subscriptions.length === 1 ? 'evento' : 'eventos'}
                    </Badge>
                  </HStack>

                  <TableContainer>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Evento</Th>
                          <Th>Tipo</Th>
                          <Th>Estado</Th>
                          <Th>Broadcaster</Th>
                          <Th>Fecha de Creación</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {subscriptions.map((sub) => (
                          <Tr key={sub.id}>
                            <Td>
                              <Text fontWeight="medium">
                                {EVENT_LABELS[sub.event_type] || sub.event_type}
                              </Text>
                            </Td>
                            <Td>
                              <Badge colorScheme="purple" fontSize="xs">
                                {sub.event_type}
                              </Badge>
                            </Td>
                            <Td>
                              <Badge
                                colorScheme={sub.status === 'enabled' ? 'green' : 'gray'}
                                fontSize="xs"
                              >
                                {sub.status === 'enabled' ? 'Activo' : 'Inactivo'}
                              </Badge>
                            </Td>
                            <Td>{sub.broadcaster_user_id}</Td>
                            <Td>{new Date(sub.created_at).toLocaleDateString('es-ES')}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </VStack>
              )}
            </CardBody>
          </Card>

          {/* Información adicional */}
          <Alert status="info">
            <AlertIcon />
            <Box>
              <Text fontWeight="bold" mb={1}>
                Suscripciones Automáticas
              </Text>
              <Text fontSize="sm">
                Cuando el broadcaster conecta su cuenta de Kick, se suscriben automáticamente a todos los eventos
                necesarios para otorgar puntos. No es necesario gestionarlas manualmente.
              </Text>
            </Box>
          </Alert>
        </VStack>
      </Container>
    </Layout>
  )
}

KickSubscriptionsPage.getLayout = (page: React.ReactElement) => <RequireAdmin>{page}</RequireAdmin>
