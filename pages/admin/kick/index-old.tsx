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
  Switch,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Divider,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { Layout } from '../../../components/Layout'
import { RequireAdmin } from '../../../components/RequireAdmin'
import { useKickBroadcaster } from '../../../hooks/useKickBroadcaster'
import { useKickAdminConfig } from '../../../hooks/useKickAdminConfig'
import { useAuth } from '../../../hooks/useAuth'

export default function KickAdminPage() {
  const router = useRouter()
  const toast = useToast()
  const { user } = useAuth()
  const { status, loading: statusLoading, error: statusError } = useKickBroadcaster()
  const {
    config,
    loading: configLoading,
    error: configError,
    updateMigrationConfig,
    updateVipConfig,
    cleanupExpiredVips
  } = useKickAdminConfig()

  const [updatingMigration, setUpdatingMigration] = useState(false)
  const [updatingVip, setUpdatingVip] = useState(false)
  const [cleaningVips, setCleaningVips] = useState(false)

  // Solo desarrolladores (rol_id 4) pueden ver toda la información
  const isDeveloper = user?.rol_id === 4

  const handleMigrationToggle = async (enabled: boolean) => {
    try {
      setUpdatingMigration(true)
      await updateMigrationConfig(enabled)
      toast({
        title: 'Configuración actualizada',
        description: `Migración Botrix ${enabled ? 'activada' : 'desactivada'}`,
        status: 'success',
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la configuración de migración',
        status: 'error',
        duration: 5000,
      })
    } finally {
      setUpdatingMigration(false)
    }
  }

  const handleVipConfigUpdate = async (field: string, value: any) => {
    try {
      setUpdatingVip(true)
      await updateVipConfig({ [field]: value })
      toast({
        title: 'Configuración VIP actualizada',
        status: 'success',
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la configuración VIP',
        status: 'error',
        duration: 5000,
      })
    } finally {
      setUpdatingVip(false)
    }
  }

  const handleCleanupVips = async () => {
    try {
      setCleaningVips(true)
      await cleanupExpiredVips()
      toast({
        title: 'VIPs expirados limpiados',
        description: 'Se han removido todos los VIPs expirados',
        status: 'success',
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo limpiar los VIPs expirados',
        status: 'error',
        duration: 5000,
      })
    } finally {
      setCleaningVips(false)
    }
  }

  if (statusLoading || configLoading) {
    return (
      <Layout>
        <Container maxW="container.xl" py={8}>
          <VStack spacing={8}>
            <Spinner size="xl" />
            <Text>Cargando configuración de Kick...</Text>
          </VStack>
        </Container>
      </Layout>
    )
  }

  return (
    <RequireAdmin>
      <Layout>
        <Container maxW="container.xl" py={8}>
          <VStack spacing={8} align="stretch">
            {/* Header */}
            <Box>
              <Heading size="xl" mb={2} color="purple.600">
                Administración de Kick
              </Heading>
              <Text color="gray.600" fontSize="lg">
                Gestiona la integración con Kick, configuración de puntos y sistemas VIP
              </Text>
            </Box>

            {(statusError || configError) && (
              <Alert status="error" borderRadius="xl">
                <AlertIcon />
                <Box>
                  <AlertTitle>Error de conexión</AlertTitle>
                  <AlertDescription>{statusError || configError}</AlertDescription>
                </Box>
              </Alert>
            )}

            {/* Estado de Conexión - Solo para desarrolladores */}
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
                          {status?.connected ? "Webhooks permanentes activos" : "Sin conexión a Kick"}
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

                  {status?.connected && status.broadcaster && (
                    <Box p={6}>
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

                        <Card bg="green.50" borderColor="green.200" border="1px solid">
                          <CardBody>
                            <Stat>
                              <StatLabel color="green.600" fontSize="sm" fontWeight="bold">
                                🔄 Sistema
                              </StatLabel>
                              <StatNumber fontSize="xl" color="green.700">
                                Operativo
                              </StatNumber>
                              <StatHelpText color="green.500">
                                Webhooks permanentes
                              </StatHelpText>
                            </Stat>
                          </CardBody>
                        </Card>

                        <Card bg="blue.50" borderColor="blue.200" border="1px solid">
                          <CardBody>
                            <Stat>
                              <StatLabel color="blue.600" fontSize="sm" fontWeight="bold">
                                📡 Eventos
                              </StatLabel>
                              <StatNumber fontSize="xl" color="blue.700">
                                Activos
                              </StatNumber>
                              <StatHelpText color="blue.500">
                                Chat, follows, subs
                              </StatHelpText>
                            </Stat>
                          </CardBody>
                        </Card>
                      </SimpleGrid>
                    </Box>
                  )}
                </CardBody>
              </Card>
            )}

            {/* Configuración de Migración Botrix */}
            <Card borderRadius="xl">
              <CardBody>
                <VStack spacing={6} align="stretch">
                  <Box>
                    <Heading size="md" color="cyan.600" mb={2}>
                      🔄 Migración desde Botrix
                    </Heading>
                    <Text color="gray.600" fontSize="sm">
                      Permite a los usuarios migrar sus puntos desde el bot Botrix automáticamente
                    </Text>
                  </Box>

                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="migration-toggle" mb="0" flex="1">
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="semibold">Migración automática</Text>
                        <Text fontSize="sm" color="gray.600">
                          Detecta automáticamente respuestas del bot Botrix y migra puntos
                        </Text>
                      </VStack>
                    </FormLabel>
                    <Switch
                      id="migration-toggle"
                      colorScheme="cyan"
                      size="lg"
                      isChecked={config?.migration.migration_enabled || false}
                      onChange={(e) => handleMigrationToggle(e.target.checked)}
                      isDisabled={updatingMigration}
                    />
                  </FormControl>

                  {config?.migration.stats && (
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <Stat>
                        <StatLabel>Usuarios migrados</StatLabel>
                        <StatNumber color="cyan.600">
                          {config.migration.stats.migrated_users}
                        </StatNumber>
                      </Stat>
                      <Stat>
                        <StatLabel>Total puntos migrados</StatLabel>
                        <StatNumber color="cyan.600">
                          {config.migration.stats.total_points?.toLocaleString()}
                        </StatNumber>
                      </Stat>
                    </SimpleGrid>
                  )}
                </VStack>
              </CardBody>
            </Card>

            {/* Configuración VIP */}
            <Card borderRadius="xl">
              <CardBody>
                <VStack spacing={6} align="stretch">
                  <Box>
                    <Heading size="md" color="gold" mb={2}>
                      👑 Sistema VIP
                    </Heading>
                    <Text color="gray.600" fontSize="sm">
                      Configura puntos especiales y beneficios para usuarios VIP
                    </Text>
                  </Box>

                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="vip-toggle" mb="0" flex="1">
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="semibold">Puntos especiales VIP</Text>
                        <Text fontSize="sm" color="gray.600">
                          Los usuarios VIP ganan puntos adicionales por actividades
                        </Text>
                      </VStack>
                    </FormLabel>
                    <Switch
                      id="vip-toggle"
                      colorScheme="yellow"
                      size="lg"
                      isChecked={config?.vip.vip_points_enabled || false}
                      onChange={(e) => handleVipConfigUpdate('vip_points_enabled', e.target.checked)}
                      isDisabled={updatingVip}
                    />
                  </FormControl>

                  {config?.vip.vip_points_enabled && (
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                      <FormControl>
                        <FormLabel fontSize="sm" fontWeight="semibold">
                          Puntos por mensaje VIP
                        </FormLabel>
                        <NumberInput
                          value={config.vip.vip_chat_points}
                          min={0}
                          max={100}
                          onChange={(_, value) => handleVipConfigUpdate('vip_chat_points', value)}
                        >
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      </FormControl>

                      <FormControl>
                        <FormLabel fontSize="sm" fontWeight="semibold">
                          Puntos por follow VIP
                        </FormLabel>
                        <NumberInput
                          value={config.vip.vip_follow_points}
                          min={0}
                          max={1000}
                          onChange={(_, value) => handleVipConfigUpdate('vip_follow_points', value)}
                        >
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      </FormControl>

                      <FormControl>
                        <FormLabel fontSize="sm" fontWeight="semibold">
                          Puntos por suscripción VIP
                        </FormLabel>
                        <NumberInput
                          value={config.vip.vip_sub_points}
                          min={0}
                          max={2000}
                          onChange={(_, value) => handleVipConfigUpdate('vip_sub_points', value)}
                        >
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      </FormControl>
                    </SimpleGrid>
                  )}

                  <Divider />

                  <HStack>
                    <Button
                      colorScheme="yellow"
                      variant="outline"
                      onClick={handleCleanupVips}
                      isLoading={cleaningVips}
                      loadingText="Limpiando..."
                    >
                      🧹 Limpiar VIPs expirados
                    </Button>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>

            {/* Enlaces rápidos */}
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              <Card
                borderRadius="xl"
                cursor="pointer"
                transition="all 0.2s"
                _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                onClick={() => router.push('/admin/kick/puntos')}
              >
                <CardBody textAlign="center">
                  <Heading size="md" color="blue.600" mb={2}>
                    ⚙️ Configuración de Puntos
                  </Heading>
                  <Text fontSize="sm" color="gray.600">
                    Gestiona puntos por eventos y actividades
                  </Text>
                </CardBody>
              </Card>

              <Card
                borderRadius="xl"
                cursor="pointer"
                transition="all 0.2s"
                _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                onClick={() => router.push('/admin/usuarios')}
              >
                <CardBody textAlign="center">
                  <Heading size="md" color="purple.600" mb={2}>
                    👥 Gestionar Usuarios
                  </Heading>
                  <Text fontSize="sm" color="gray.600">
                    Ver usuarios, VIPs y migración
                  </Text>
                </CardBody>
              </Card>

              <Card
                borderRadius="xl"
                cursor="pointer"
                transition="all 0.2s"
                _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                onClick={() => router.push('/admin/canjes')}
              >
                <CardBody textAlign="center">
                  <Heading size="md" color="green.600" mb={2}>
                    🎁 Gestionar Canjes
                  </Heading>
                  <Text fontSize="sm" color="gray.600">
                    Entregar recompensas y VIPs
                  </Text>
                </CardBody>
              </Card>
            </SimpleGrid>
          </VStack>
        </Container>
      </Layout>
    </RequireAdmin>
  )
}
