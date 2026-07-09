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
  CardHeader,
  Badge,
  Button,
  Alert,
  AlertIcon,
  Spinner,
  useToast,
  SimpleGrid,
  Switch,
  FormControl,
  FormLabel,
  Divider,
  Icon,
  useColorModeValue
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { SettingsIcon, InfoIcon, ChatIcon } from '@chakra-ui/icons'
import { Layout } from '../../../components/Layout'
import { RequireAdmin } from '../../../components/RequireAdmin'
import { useKickBroadcaster } from '../../../hooks/useKickBroadcaster'
import { useKickAdminConfig } from '../../../hooks/useKickAdminConfig'
import { useAuth } from '../../../hooks/useAuth'
import { useAdminUsuarios } from '../../../hooks/useAdminUsuarios'
import Head from 'next/head'

/** Función auxiliar para extraer mensajes de error de API de manera consistente */
function extractApiErrorMessage(error: any, defaultMessage: string): string {
  if (error?.response?.status === 401) return 'Error de autenticación. Verifica tu sesión.'
  if (error?.response?.status === 403) return 'No tienes permisos para realizar esta acción.'
  if (error?.response?.status === 404) return 'Recurso no encontrado. Puede que el endpoint no esté disponible.'
  return error?.response?.data?.message || error?.message || defaultMessage
}

export default function KickAdminPage() {
  const router = useRouter()
  const toast = useToast()
  const { user, isLoading: authLoading } = useAuth()

  // Solo cargar datos si el usuario está autenticado y cargado
  const shouldLoadData = !authLoading && user && user.rol_id >= 3 // Admin o Developer

  const { status, loading: statusLoading, error: statusError } = useKickBroadcaster()
  const {
    config,
    loading: configLoading,
    error: configError,
    updateMigrationConfig,
    updateVipConfig,
    updateWatchtimeMigrationConfig,
    cleanupExpiredVips
  } = useKickAdminConfig()

  // Obtener usuarios para estadísticas en tiempo real
  const { data: usuariosData } = useAdminUsuarios({
    page: 1,
    filter: 'all'
  })

  const [updatingMigration, setUpdatingMigration] = useState(false)
  const [updatingVip, setUpdatingVip] = useState(false)
  const [updatingWatchtime, setUpdatingWatchtime] = useState(false)
  const [cleaningVips, setCleaningVips] = useState(false)

  // Solo desarrolladores (rol_id 4) pueden ver información completa
  const isDeveloper = user?.rol_id === 4

  // Theme colors con mejor contraste en modo oscuro (hoisted antes de retornos condicionales)
  const cardBg = useColorModeValue('white', 'gray.700')
  const borderColor = useColorModeValue('gray.200', 'gray.500')
  const enabledBg = useColorModeValue('green.50', 'green.700')
  const enabledBorder = useColorModeValue('green.200', 'green.400')
  const disabledBg = useColorModeValue('gray.50', 'gray.600')
  const disabledBorder = useColorModeValue('gray.200', 'gray.500')
  const textPrimary = useColorModeValue('gray.800', 'gray.100')
  const textSecondary = useColorModeValue('gray.600', 'gray.300')

  // Si aún se está cargando la autenticación, mostrar loading
  if (authLoading) {
    return (
      <RequireAdmin>
        <Layout>
          <Container maxW="container.xl" py={8}>
            <Box textAlign="center" py={20}>
              <Spinner size="xl" />
              <Text mt={4} color="gray.500">
                Verificando autenticación...
              </Text>
            </Box>
          </Container>
        </Layout>
      </RequireAdmin>
    )
  }

  const handleMigrationToggle = async (enabled: boolean) => {
    try {
      setUpdatingMigration(true)
      await updateMigrationConfig(enabled)
      toast({
        title: 'Configuración actualizada',
        description: `Migración Botrix ${enabled ? 'activada' : 'desactivada'}`,
        status: 'success',
        duration: 3000
      })
    } catch (error: any) {
      const errorMessage = extractApiErrorMessage(
        error,
        'No se pudo actualizar la configuración de migración'
      )

      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000
      })
    } finally {
      setUpdatingMigration(false)
    }
  }

  const handleVipToggle = async (enabled: boolean) => {
    try {
      setUpdatingVip(true)
      await updateVipConfig({ points_enabled: enabled })
      toast({
        title: 'Sistema VIP actualizado',
        description: `Puntos VIP ${enabled ? 'activados' : 'desactivados'}`,
        status: 'success',
        duration: 3000
      })
    } catch (error: any) {
      const errorMessage = extractApiErrorMessage(error, 'No se pudo actualizar la configuración VIP')

      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000
      })
    } finally {
      setUpdatingVip(false)
    }
  }

  const handleWatchtimeToggle = async (enabled: boolean) => {
    try {
      setUpdatingWatchtime(true)
      await updateWatchtimeMigrationConfig(enabled)
      toast({
        title: 'Configuración actualizada',
        description: `Migración de watchtime ${enabled ? 'activada' : 'desactivada'}`,
        status: 'success',
        duration: 3000
      })
    } catch (error: any) {
      const errorMessage = extractApiErrorMessage(
        error,
        'No se pudo actualizar la configuración de migración de watchtime'
      )

      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000
      })
    } finally {
      setUpdatingWatchtime(false)
    }
  }

  const handleCleanupVips = async () => {
    if (!confirm('¿Estás seguro de limpiar todos los VIPs expirados?')) return

    try {
      setCleaningVips(true)
      await cleanupExpiredVips()
      toast({
        title: 'VIPs expirados limpiados',
        description: 'Se han removido todos los VIPs expirados',
        status: 'success',
        duration: 3000
      })
    } catch (error: any) {
      const errorMessage = extractApiErrorMessage(error, 'No se pudo limpiar los VIPs expirados')

      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000
      })
    } finally {
      setCleaningVips(false)
    }
  }

  if (statusLoading || configLoading) {
    return (
      <RequireAdmin>
        <Layout>
          <Container maxW="container.xl" py={8}>
            <VStack spacing={8}>
              <Spinner size="xl" color="purple.500" thickness="4px" />
              <Text fontSize="lg" color="gray.600">
                Cargando configuración de Kick...
              </Text>
            </VStack>
          </Container>
        </Layout>
      </RequireAdmin>
    )
  }

  if (configError || statusError) {
    // Si es un error de endpoints no disponibles, mostrar mensaje más amigable
    const isEndpointError =
      configError?.includes('no disponible') ||
      statusError?.includes('no disponible') ||
      configError?.includes('404') ||
      statusError?.includes('404')

    return (
      <RequireAdmin>
        <Head>
          <title>Administración de Kick - Luisardito Shop</title>
          <meta
            name="description"
            content="Administración de la integración con Kick en Luisardito Shop"
          />
        </Head>
        <Layout>
          <Container maxW="container.xl" py={8}>
            <Alert status={isEndpointError ? 'warning' : 'error'} borderRadius="xl">
              <AlertIcon />
              <Box>
                <Text fontWeight="bold">
                  {isEndpointError
                    ? 'Funcionalidad de Kick no disponible'
                    : 'Error al cargar configuración'}
                </Text>
                <Text fontSize="sm">
                  {isEndpointError
                    ? 'Los endpoints de administración de Kick no están disponibles en el backend. Contacta al desarrollador para habilitar esta funcionalidad.'
                    : configError || statusError}
                </Text>
              </Box>
            </Alert>
          </Container>
        </Layout>
      </RequireAdmin>
    )
  }

  // Determinar estados actuales de la configuración con nombres REALES del backend
  const migrationEnabled = config?.migration?.enabled ?? false
  const watchtimeMigrationEnabled = config?.watchtime_migration?.enabled ?? false
  const vipEnabled = config?.vip?.points_enabled ?? false

  // Calcular estadísticas REALES desde los datos de usuarios (en tiempo real)
  const migratedUsers = usuariosData?.users?.filter((user) => user.botrix_migrated).length ?? 0
  const totalPointsMigrated =
    usuariosData?.users?.reduce(
      (sum, user) => sum + (user.migration_status?.points_migrated || 0),
      0
    ) ?? 0
  const watchtimeMigratedUsers = config?.watchtime_migration?.stats?.migrated_users ?? 0
  const totalWatchtimeMigrated = config?.watchtime_migration?.stats?.total_minutes_migrated ?? 0
  const activeVips = usuariosData?.users?.filter((user) => user.vip_status?.is_active).length ?? 0
  const expiredVips = config?.vip?.stats?.expired_vips ?? 0

  // Si no hay configuración disponible pero tampoco hay error crítico,
  // mostrar interfaz con valores por defecto
  const hasConfig = !!config

  return (
    <RequireAdmin>
      <Layout>
        <Container maxW="container.xl" py={6}>
          <VStack spacing={8} align="stretch">
            {/* Header */}
            <Box>
              <Heading size="xl" mb={2} color="green.600">
                Administración de Kick
              </Heading>
              <Text color="gray.600" fontSize="lg">
                Gestiona la integración con Kick, configuración VIP y migración de puntos
              </Text>
            </Box>

            {/* Estado de Conexión - Solo para desarrolladores */}
            {isDeveloper && (
              <Card bg={cardBg} borderRadius="xl" border="1px solid" borderColor={borderColor}>
                <CardHeader pb={3}>
                  <HStack>
                    <Icon as={InfoIcon} color="blue.500" />
                    <Heading size="md">Estado de Conexión</Heading>
                  </HStack>
                </CardHeader>
                <CardBody pt={0}>
                  <HStack justify="space-between">
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="semibold">
                        {status?.connected ? '🟢 Conectado' : '🔴 Desconectado'}
                      </Text>
                      <Text fontSize="sm" color="gray.400">
                        {status?.connected ? 'Conexión activa con Kick' : 'Sin conexión a Kick'}
                      </Text>
                    </VStack>
                    <Badge
                      colorScheme={status?.connected ? 'green' : 'red'}
                      fontSize="md"
                      px={4}
                      py={2}
                      borderRadius="full"
                    >
                      {status?.connected ? 'Operativo' : 'Inactivo'}
                    </Badge>
                  </HStack>
                </CardBody>
              </Card>
            )}

            {/* Configuraciones principales */}
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
              {/* Migración desde Botrix */}
              <Card
                bg={migrationEnabled ? enabledBg : disabledBg}
                borderRadius="xl"
                border="2px solid"
                borderColor={migrationEnabled ? enabledBorder : disabledBorder}
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                  borderColor: migrationEnabled ? 'green.300' : 'gray.300'
                }}
                transition="all 0.2s"
              >
                <CardHeader pb={3}>
                  <HStack justify="space-between" align="start">
                    <VStack align="start" spacing={1}>
                      <HStack>
                        <Icon as={SettingsIcon} color="cyan.500" />
                        <Heading size="md" color={migrationEnabled ? 'green.400' : textPrimary}>
                          Migración desde Botrix
                        </Heading>
                      </HStack>
                      <Text fontSize="sm" color={textSecondary}>
                        Permite a los usuarios migrar sus puntos desde el bot Botrix automáticamente
                      </Text>
                    </VStack>
                    <Badge
                      colorScheme={migrationEnabled ? 'green' : 'gray'}
                      fontSize="sm"
                      px={3}
                      py={1}
                      borderRadius="full"
                    >
                      {migrationEnabled ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </HStack>
                </CardHeader>
                <CardBody pt={0}>
                  <VStack spacing={4} align="stretch">
                    <FormControl display="flex" alignItems="center" justifyContent="space-between">
                      <FormLabel mb={0} fontWeight="semibold">
                        Migración automática
                      </FormLabel>
                      <Switch
                        isChecked={migrationEnabled}
                        onChange={(e) => handleMigrationToggle(e.target.checked)}
                        isDisabled={updatingMigration || !hasConfig}
                        colorScheme="green"
                        size="lg"
                      />
                    </FormControl>

                    <Text fontSize="sm" color={textSecondary}>
                      {hasConfig
                        ? 'Detecta automáticamente respuestas del bot Botrix y migra puntos'
                        : 'Funcionalidad no disponible - endpoint no configurado'}
                    </Text>

                    {migrationEnabled && (
                      <>
                        <Divider />
                        <SimpleGrid columns={2} spacing={4}>
                          <Box>
                            <Text fontSize="xs" color={textSecondary} mb={1}>
                              Usuarios migrados
                            </Text>
                            <Text fontSize="2xl" fontWeight="bold" color="cyan.500">
                              {migratedUsers}
                            </Text>
                          </Box>
                          <Box>
                            <Text fontSize="xs" color={textSecondary} mb={1}>
                              Total puntos migrados
                            </Text>
                            <Text fontSize="2xl" fontWeight="bold" color="cyan.500">
                              {totalPointsMigrated.toLocaleString()}
                            </Text>
                          </Box>
                        </SimpleGrid>
                      </>
                    )}
                  </VStack>
                </CardBody>
              </Card>

              {/* Sistema VIP */}
              <Card
                bg={vipEnabled ? enabledBg : disabledBg}
                borderRadius="xl"
                border="2px solid"
                borderColor={vipEnabled ? enabledBorder : disabledBorder}
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                  borderColor: vipEnabled ? 'green.300' : 'gray.300'
                }}
                transition="all 0.2s"
              >
                <CardHeader pb={3}>
                  <HStack justify="space-between" align="start">
                    <VStack align="start" spacing={1}>
                      <HStack>
                        <Icon as={SettingsIcon} color="yellow.500" />
                        <Heading size="md" color={vipEnabled ? 'green.400' : textPrimary}>
                          Sistema VIP
                        </Heading>
                      </HStack>
                      <Text fontSize="sm" color={textSecondary}>
                        Configura puntos especiales y beneficios para usuarios VIP
                      </Text>
                    </VStack>
                    <Badge
                      colorScheme={vipEnabled ? 'green' : 'gray'}
                      fontSize="sm"
                      px={3}
                      py={1}
                      borderRadius="full"
                    >
                      {vipEnabled ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </HStack>
                </CardHeader>
                <CardBody pt={0}>
                  <VStack spacing={4} align="stretch">
                    <FormControl display="flex" alignItems="center" justifyContent="space-between">
                      <FormLabel mb={0} fontWeight="semibold">
                        Puntos especiales VIP
                      </FormLabel>
                      <Switch
                        isChecked={vipEnabled}
                        onChange={(e) => handleVipToggle(e.target.checked)}
                        isDisabled={updatingVip || !hasConfig}
                        colorScheme="green"
                        size="lg"
                      />
                    </FormControl>

                    <Text fontSize="sm" color={textSecondary}>
                      {hasConfig
                        ? 'Los usuarios VIP ganan puntos adicionales por actividades'
                        : 'Funcionalidad no disponible - endpoint no configurado'}
                    </Text>

                    {vipEnabled && hasConfig && (
                      <>
                        <Divider />
                        <SimpleGrid columns={2} spacing={4}>
                          <Box>
                            <Text fontSize="xs" color={textSecondary} mb={1}>
                              VIPs activos
                            </Text>
                            <Text fontSize="2xl" fontWeight="bold" color="yellow.500">
                              {activeVips}
                            </Text>
                          </Box>
                          <Box>
                            <Text fontSize="xs" color={textSecondary} mb={1}>
                              VIPs expirados
                            </Text>
                            <Text fontSize="2xl" fontWeight="bold" color="orange.500">
                              {expiredVips}
                            </Text>
                          </Box>
                        </SimpleGrid>
                      </>
                    )}

                    {vipEnabled && (
                      <>
                        <Divider />
                        <Button
                          variant="outline"
                          colorScheme="orange"
                          size="sm"
                          onClick={handleCleanupVips}
                          isLoading={cleaningVips}
                          loadingText="Limpiando..."
                          leftIcon={<SettingsIcon />}
                        >
                          Limpiar VIPs expirados
                        </Button>
                      </>
                    )}
                  </VStack>
                </CardBody>
              </Card>

              {/* Migración de Watchtime */}
              <Card
                bg={watchtimeMigrationEnabled ? enabledBg : disabledBg}
                borderRadius="xl"
                border="2px solid"
                borderColor={watchtimeMigrationEnabled ? enabledBorder : disabledBorder}
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                  borderColor: watchtimeMigrationEnabled ? 'green.300' : 'gray.300'
                }}
                transition="all 0.2s"
              >
                <CardHeader pb={3}>
                  <HStack justify="space-between" align="start">
                    <VStack align="start" spacing={1}>
                      <HStack>
                        <Icon as={SettingsIcon} color="purple.500" />
                        <Heading size="md" color={watchtimeMigrationEnabled ? 'green.400' : textPrimary}>
                          Migración de Watchtime
                        </Heading>
                      </HStack>
                      <Text fontSize="sm" color={textSecondary}>
                        Migra el tiempo de visualización de usuarios desde el bot Botrix automáticamente
                      </Text>
                    </VStack>
                    <Badge
                      colorScheme={watchtimeMigrationEnabled ? 'green' : 'gray'}
                      fontSize="sm"
                      px={3}
                      py={1}
                      borderRadius="full"
                    >
                      {watchtimeMigrationEnabled ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </HStack>
                </CardHeader>
                <CardBody pt={0}>
                  <VStack spacing={4} align="stretch">
                    <FormControl display="flex" alignItems="center" justifyContent="space-between">
                      <FormLabel mb={0} fontWeight="semibold">
                        Migración automática de watchtime
                      </FormLabel>
                      <Switch
                        isChecked={watchtimeMigrationEnabled}
                        onChange={(e) => handleWatchtimeToggle(e.target.checked)}
                        isDisabled={updatingWatchtime || !hasConfig}
                        colorScheme="green"
                        size="lg"
                      />
                    </FormControl>

                    <Text fontSize="sm" color={textSecondary}>
                      {hasConfig
                        ? 'Detecta automáticamente mensajes de watchtime del bot Botrix y migra los datos'
                        : 'Funcionalidad no disponible - endpoint no configurado'}
                    </Text>

                    {watchtimeMigrationEnabled && (
                      <>
                        <Divider />
                        <SimpleGrid columns={2} spacing={4}>
                          <Box>
                            <Text fontSize="xs" color={textSecondary} mb={1}>
                              Usuarios migrados
                            </Text>
                            <Text fontSize="2xl" fontWeight="bold" color="purple.500">
                              {watchtimeMigratedUsers}
                            </Text>
                          </Box>
                          <Box>
                            <Text fontSize="xs" color={textSecondary} mb={1}>
                              Total minutos migrados
                            </Text>
                            <Text fontSize="2xl" fontWeight="bold" color="purple.500">
                              {totalWatchtimeMigrated.toLocaleString()}
                            </Text>
                          </Box>
                        </SimpleGrid>
                      </>
                    )}
                  </VStack>
                </CardBody>
              </Card>
            </SimpleGrid>

            {/* Botones de configuración */}
            <Card bg={cardBg} borderRadius="xl" border="1px solid" borderColor={borderColor}>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <Heading size="md" color="green.500">
                    Configuración Avanzada
                  </Heading>
                  <Text fontSize="sm" color="black.600">
                    Accede a configuraciones detalladas y ajustes específicos
                  </Text>

                  <HStack spacing={4} wrap="wrap">
                    <Button
                      colorScheme="purple"
                      variant="outline"
                      onClick={() => router.push('/admin/kick/puntos')}
                      leftIcon={<SettingsIcon />}
                      size="md"
                    >
                      Configurar Puntos
                    </Button>
                    <Button
                      colorScheme="blue"
                      variant="outline"
                      onClick={() => router.push('/admin/usuarios')}
                      leftIcon={<SettingsIcon />}
                      size="md"
                    >
                      Gestionar Usuarios
                    </Button>
                    <Button
                      colorScheme="teal"
                      variant="outline"
                      onClick={() => router.push('/admin/comandos')}
                      leftIcon={<ChatIcon />}
                      size="md"
                    >
                      Gestionar Comandos
                    </Button>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        </Container>
      </Layout>
    </RequireAdmin>
  )
}
