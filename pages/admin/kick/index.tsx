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
  Badge,
  Button,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { Layout } from '../../../components/Layout'
import { RequireAdmin } from '../../../components/RequireAdmin'
import { useKickBroadcaster } from '../../../hooks/useKickBroadcaster'

export default function KickAdminPage() {
  const router = useRouter()
  const toast = useToast()
  const { status, loading, error, refresh, disconnect } = useKickBroadcaster()
  const [disconnecting, setDisconnecting] = useState(false)

  const handleDisconnect = async () => {
    if (!confirm('¿Estás seguro de que deseas desconectar el broadcaster de Kick?')) {
      return
    }

    try {
      setDisconnecting(true)
      await disconnect()
      toast({
        title: 'Broadcaster desconectado',
        description: 'La conexión con Kick ha sido desconectada exitosamente',
        status: 'success',
        duration: 3000,
      })
    } catch (err) {
      toast({
        title: 'Error',
        description: 'No se pudo desconectar el broadcaster',
        status: 'error',
        duration: 5000,
      })
    } finally {
      setDisconnecting(false)
    }
  }

  const handleConnectKick = () => {
    // Redirigir al OAuth de Kick
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/kick`
  }

  if (loading) {
    return (
      <Layout>
        <Container maxW="container.xl" py={8}>
          <VStack spacing={8}>
            <Spinner size="xl" />
            <Text>Cargando información de Kick...</Text>
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
          <Box>
            <Heading size="xl" mb={2}>
              Administración de Kick
            </Heading>
            <Text color="gray.600">
              Gestiona la integración con Kick, configuración de puntos y suscripciones a eventos
            </Text>
          </Box>

          {error && (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Estado de Conexión */}
          <Card>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <HStack justify="space-between">
                  <Heading size="md">Estado de Conexión</Heading>
                  <Badge colorScheme={status?.connected ? 'green' : 'red'} fontSize="md" px={3} py={1}>
                    {status?.connected ? 'Conectado' : 'Desconectado'}
                  </Badge>
                </HStack>

                {status?.connected && status.broadcaster ? (
                  <VStack spacing={4} align="stretch">
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                      <Stat>
                        <StatLabel>Broadcaster</StatLabel>
                        <StatNumber fontSize="lg">{status.broadcaster.kick_username}</StatNumber>
                        <StatHelpText>ID: {status.broadcaster.kick_user_id}</StatHelpText>
                      </Stat>

                      <Stat>
                        <StatLabel>Token</StatLabel>
                        <StatNumber fontSize="lg">
                          {status.token?.is_expired ? (
                            <Badge colorScheme="red">Expirado</Badge>
                          ) : (
                            <Badge colorScheme="green">Válido</Badge>
                          )}
                        </StatNumber>
                        <StatHelpText>
                          {status.token?.expires_at &&
                            new Date(status.token.expires_at).toLocaleDateString('es-ES')}
                        </StatHelpText>
                      </Stat>

                      <Stat>
                        <StatLabel>Suscripciones</StatLabel>
                        <StatNumber fontSize="lg">{status.subscriptions?.total_active || 0}</StatNumber>
                        <StatHelpText>
                          {status.subscriptions?.auto_subscribed ? 'Auto-suscritas' : 'Manuales'}
                        </StatHelpText>
                      </Stat>
                    </SimpleGrid>

                    <HStack>
                      <Button colorScheme="red" onClick={handleDisconnect} isLoading={disconnecting}>
                        Desconectar
                      </Button>
                      <Button onClick={refresh}>Refrescar</Button>
                    </HStack>
                  </VStack>
                ) : (
                  <VStack spacing={4}>
                    <Alert status="warning">
                      <AlertIcon />
                      <Box>
                        <AlertTitle>No conectado</AlertTitle>
                        <AlertDescription>
                          El broadcaster no está conectado. Conecta tu cuenta de Kick para empezar a recibir eventos y
                          otorgar puntos.
                        </AlertDescription>
                      </Box>
                    </Alert>
                    <Button colorScheme="purple" onClick={handleConnectKick} size="lg">
                      Conectar con Kick
                    </Button>
                  </VStack>
                )}
              </VStack>
            </CardBody>
          </Card>

          {/* Tabs de Gestión */}
          {status?.connected && (
            <Tabs colorScheme="purple">
              <TabList>
                <Tab>Configuración de Puntos</Tab>
                <Tab>Suscripciones</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <Button
                    colorScheme="purple"
                    onClick={() => router.push('/admin/kick/puntos')}
                    width="full"
                    size="lg"
                  >
                    Gestionar Configuración de Puntos
                  </Button>
                </TabPanel>

                <TabPanel>
                  <Button
                    colorScheme="purple"
                    onClick={() => router.push('/admin/kick/suscripciones')}
                    width="full"
                    size="lg"
                  >
                    Gestionar Suscripciones
                  </Button>
                </TabPanel>
              </TabPanels>
            </Tabs>
          )}
        </VStack>
      </Container>
    </Layout>
  )
}

KickAdminPage.getLayout = (page: React.ReactElement) => <RequireAdmin>{page}</RequireAdmin>
