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
  SimpleGrid,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { Layout } from '../../../components/Layout'
import { RequireAdmin } from '../../../components/RequireAdmin'
import { useKickBroadcaster } from '../../../hooks/useKickBroadcaster'
import { useAuth } from '../../../hooks/useAuth'

export default function KickAdminPage() {
  const router = useRouter()
  const toast = useToast()
  const { user } = useAuth()
  const { status, loading, error, refresh, disconnect } = useKickBroadcaster()
  const [disconnecting, setDisconnecting] = useState(false)

  // Solo desarrolladores (rol_id 5) pueden ver toda la información
  const isDeveloper = user?.rol_id === 4

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
          {/* Header mejorado */}
          <Box>
            <Heading size="xl" mb={2} color="purple.600">
              Administración de Kick
            </Heading>
            <Text color="gray.600" fontSize="lg">
              Gestiona la integración con Kick, configuración de puntos y suscripciones a eventos
            </Text>
          </Box>

          {error && (
            <Alert status="error" borderRadius="xl">
              <AlertIcon />
              <Box>
                <AlertTitle>Error de conexión</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Box>
            </Alert>
          )}

          {/* Estado de Conexión mejorado - Solo para desarrolladores */}
          {isDeveloper && (
            <Card borderRadius="xl" overflow="hidden">
              <CardBody p={0}>
                <Box bg={status?.connected ? "green.50" : "red.50"} p={6} borderBottom="1px solid" borderColor={status?.connected ? "green.100" : "red.100"}>
                  <HStack justify="space-between" align="center">
                    <VStack align="start" spacing={1}>
                      <Heading size="lg" color={status?.connected ? "green.700" : "red.700"}>
                        Estado de Conexión
                      </Heading>
                      <Text color={status?.connected ? "green.600" : "red.600"} fontSize="sm">
                        {status?.connected ? "Integración activa con Kick" : "Sin conexión a Kick"}
                      </Text>
                    </VStack>
                    <Badge
                      colorScheme={status?.connected ? 'green' : 'red'}
                      fontSize="lg"
                      px={4}
                      py={2}
                      borderRadius="full"
                    >
                      {status?.connected ? '🟢 Conectado' : '🔴 Desconectado'}
                    </Badge>
                  </HStack>
                </Box>

                <Box p={6}>
                  {status?.connected && status.broadcaster ? (
                    <VStack spacing={6} align="stretch">
                      {/* Stats grid */}
                      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                        <Card bg="purple.50" borderColor="purple.200" border="1px solid">
                          <CardBody>
                            <Stat>
                              <StatLabel color="purple.600" fontSize="sm" fontWeight="bold">
                                👤 Broadcaster
                              </StatLabel>
                              <StatNumber fontSize="xl" color="purple.700">
                                {status.broadcaster.kick_username}
                              </StatNumber>
                              <StatHelpText color="purple.500">
                                ID: {status.broadcaster.kick_user_id}
                              </StatHelpText>
                            </Stat>
                          </CardBody>
                        </Card>

                        <Card bg="blue.50" borderColor="blue.200" border="1px solid">
                          <CardBody>
                            <Stat>
                              <StatLabel color="blue.600" fontSize="sm" fontWeight="bold">
                                🔐 Token de Acceso
                              </StatLabel>
                              <StatNumber fontSize="xl">
                                {status.token?.is_expired ? (
                                  <Badge colorScheme="red" fontSize="lg" px={3} py={1}>
                                    ❌ Expirado
                                  </Badge>
                                ) : (
                                  <Badge colorScheme="green" fontSize="lg" px={3} py={1}>
                                    ✅ Válido
                                  </Badge>
                                )}
                              </StatNumber>
                              <StatHelpText color="blue.500">
                                {status.token?.expires_at &&
                                  `Expira: ${new Date(status.token.expires_at).toLocaleDateString('es-ES')}`}
                              </StatHelpText>
                            </Stat>
                          </CardBody>
                        </Card>

                        <Card bg="green.50" borderColor="green.200" border="1px solid">
                          <CardBody>
                            <Stat>
                              <StatLabel color="green.600" fontSize="sm" fontWeight="bold">
                                📡 Suscripciones
                              </StatLabel>
                              <StatNumber fontSize="xl" color="green.700">
                                {status.subscriptions?.total_active || 0}
                              </StatNumber>
                              <StatHelpText color="green.500">
                                {status.subscriptions?.auto_subscribed ? '🤖 Auto-suscritas' : '🔧 Manuales'}
                              </StatHelpText>
                            </Stat>
                          </CardBody>
                        </Card>
                      </SimpleGrid>

                      {/* Acciones */}
                      <HStack spacing={4} justify="center">
                        <Button
                          colorScheme="red"
                          onClick={handleDisconnect}
                          isLoading={disconnecting}
                          borderRadius="lg"
                          px={6}
                          _hover={{ transform: "translateY(-1px)" }}
                        >
                          🔌 Desconectar
                        </Button>
                        <Button
                          onClick={refresh}
                          variant="outline"
                          colorScheme="purple"
                          borderRadius="lg"
                          px={6}
                          _hover={{ transform: "translateY(-1px)" }}
                        >
                          🔄 Refrescar
                        </Button>
                      </HStack>
                    </VStack>
                  ) : (
                    <VStack spacing={6}>
                      <Alert status="warning" borderRadius="lg" bg="orange.50" border="1px solid" borderColor="orange.200">
                        <AlertIcon color="orange.500" />
                        <Box>
                          <AlertTitle color="orange.800">No conectado a Kick</AlertTitle>
                          <AlertDescription color="orange.700">
                            El broadcaster no está conectado. Conecta tu cuenta de Kick para empezar a recibir eventos y
                            otorgar puntos automáticamente a tus viewers.
                          </AlertDescription>
                        </Box>
                      </Alert>
                      <Button
                        colorScheme="purple"
                        onClick={handleConnectKick}
                        size="lg"
                        borderRadius="xl"
                        px={10}
                        py={6}
                        fontSize="lg"
                        _hover={{ transform: "scale(1.05)" }}
                        transition="all 0.2s"
                      >
                        🚀 Conectar con Kick
                      </Button>
                    </VStack>
                  )}
                </Box>
              </CardBody>
            </Card>
          )}

          {/* Gestión rápida */}
          {status?.connected && (
            <SimpleGrid columns={{ base: 1, md: isDeveloper ? 2 : 1 }} spacing={6}>
              <Card
                borderRadius="xl"
                bg="gradient-to-br"
                bgGradient="linear(to-br, purple.50, purple.100)"
                border="1px solid"
                borderColor="purple.200"
                _hover={{ transform: "translateY(-2px)", boxShadow: "xl" }}
                transition="all 0.2s"
                cursor="pointer"
                onClick={() => router.push('/admin/kick/puntos')}
              >
                <CardBody p={6}>
                  <VStack spacing={4} align="center">
                    <Box fontSize="4xl">⚙️</Box>
                    <VStack spacing={2}>
                      <Heading size="md" color="purple.700" textAlign="center">
                        Configuración de Puntos
                      </Heading>
                      <Text fontSize="sm" color="purple.600" textAlign="center">
                        Define cuántos puntos se otorgan por cada evento de Kick
                      </Text>
                    </VStack>
                    <Button colorScheme="purple" size="sm" borderRadius="lg">
                      Gestionar Puntos
                    </Button>
                  </VStack>
                </CardBody>
              </Card>

              {/* Suscripciones de Eventos - Solo para desarrolladores */}
              {isDeveloper && (
                <Card
                  borderRadius="xl"
                  bg="gradient-to-br"
                  bgGradient="linear(to-br, blue.50, blue.100)"
                  border="1px solid"
                  borderColor="blue.200"
                  _hover={{ transform: "translateY(-2px)", boxShadow: "xl" }}
                  transition="all 0.2s"
                  cursor="pointer"
                  onClick={() => router.push('/admin/kick/suscripciones')}
                >
                  <CardBody p={6}>
                    <VStack spacing={4} align="center">
                      <Box fontSize="4xl">📡</Box>
                      <VStack spacing={2}>
                        <Heading size="md" color="blue.700" textAlign="center">
                          Suscripciones de Eventos
                        </Heading>
                        <Text fontSize="sm" color="blue.600" textAlign="center">
                          Visualiza y gestiona las suscripciones a eventos de Kick
                        </Text>
                      </VStack>
                      <Button colorScheme="blue" size="sm" borderRadius="lg">
                        Ver Suscripciones
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
              )}
            </SimpleGrid>
          )}
        </VStack>
      </Container>
    </Layout>
  )
}

KickAdminPage.getLayout = (page: React.ReactElement) => <RequireAdmin>{page}</RequireAdmin>
