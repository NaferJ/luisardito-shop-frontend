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
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Switch,
  Alert,
  AlertIcon,
  Spinner,
  useToast,
  Divider,
  Badge,
  IconButton,
  SimpleGrid,
} from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { useRouter } from 'next/router'
import { Layout } from '../../../components/Layout'
import { RequireAdmin } from '../../../components/RequireAdmin'
import { useKickPointsConfig } from '../../../hooks/useKickPointsConfig'

const CONFIG_LABELS: Record<string, { label: string; description: string }> = {
  chat_points_regular: {
    label: 'Puntos por Mensaje (Usuario Regular)',
    description: 'Puntos otorgados por cada mensaje en el chat de usuarios no suscritos',
  },
  chat_points_subscriber: {
    label: 'Puntos por Mensaje (Suscriptor)',
    description: 'Puntos otorgados por cada mensaje en el chat de suscriptores',
  },
  follow_points: {
    label: 'Puntos por Follow',
    description: 'Puntos otorgados cuando un usuario sigue el canal',
  },
  subscription_new_points: {
    label: 'Puntos por Nueva Suscripción',
    description: 'Puntos otorgados cuando un usuario se suscribe por primera vez',
  },
  subscription_renewal_points: {
    label: 'Puntos por Renovación',
    description: 'Puntos otorgados cuando un usuario renueva su suscripción',
  },
  gift_given_points: {
    label: 'Puntos por Regalar Suscripción',
    description: 'Puntos por cada suscripción regalada (multiplicado por cantidad)',
  },
  gift_received_points: {
    label: 'Puntos por Recibir Suscripción Regalo',
    description: 'Puntos otorgados a quien recibe una suscripción regalada',
  },
}

export default function KickPointsConfigPage() {
  const router = useRouter()
  const toast = useToast()
  const { config, loading, error, updateConfig, initializeConfig } = useKickPointsConfig()
  const [saving, setSaving] = useState(false)
  const [initializing, setInitializing] = useState(false)

  const [formData, setFormData] = useState<Record<string, { value: number; enabled: boolean }>>({})

  // Inicializar formData cuando se carga la config
  useEffect(() => {
    if (Array.isArray(config) && config.length > 0) {
      const newFormData: Record<string, { value: number; enabled: boolean }> = {}
      config.forEach((item) => {
        if (item && item.config_key) {
          newFormData[item.config_key] = {
            value: item.config_value || 0,
            enabled: item.enabled || false,
          }
        }
      })
      setFormData(newFormData)
    }
  }, [config])

  const handleValueChange = (key: string, value: number) => {
    setFormData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        value,
      },
    }))
  }

  const handleEnabledChange = (key: string, enabled: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        enabled,
      },
    }))
  }

  const handleSave = async (key: string) => {
    try {
      setSaving(true)
      const data = formData[key]
      await updateConfig(key, data.value, data.enabled)
      toast({
        title: 'Configuración actualizada',
        status: 'success',
        duration: 2000,
      })
    } catch (err) {
      toast({
        title: 'Error al guardar',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setSaving(false)
    }
  }

  const handleInitialize = async () => {
    if (!confirm('¿Estás seguro de inicializar la configuración con valores por defecto?')) {
      return
    }

    try {
      setInitializing(true)
      await initializeConfig()
      toast({
        title: 'Configuración inicializada',
        description: 'Se han establecido los valores por defecto',
        status: 'success',
        duration: 3000,
      })
    } catch (err) {
      toast({
        title: 'Error al inicializar',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setInitializing(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <Container maxW="container.xl" py={8}>
          <VStack spacing={8}>
            <Spinner size="xl" />
            <Text>Cargando configuración...</Text>
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
                  Configuración de Puntos
                </Heading>
                <Text color="gray.600" fontSize="lg">
                  Define cuántos puntos se otorgan por cada tipo de evento en Kick
                </Text>
              </VStack>
            </HStack>

            {/* Stats rápidas */}
            {Array.isArray(config) && config.length > 0 && (
              <HStack spacing={4} flexWrap="wrap">
                <Badge colorScheme="purple" fontSize="sm" px={3} py={1}>
                  {config.length} configuraciones
                </Badge>
                <Badge
                  colorScheme={config.filter(c => c.enabled).length > 0 ? "green" : "gray"}
                  fontSize="sm"
                  px={3}
                  py={1}
                >
                  {config.filter(c => c.enabled).length} activas
                </Badge>
              </HStack>
            )}
          </Box>

          {error && (
            <Alert status="error" borderRadius="xl">
              <AlertIcon />
              <Box>
                <Text fontWeight="bold">Error al cargar configuración</Text>
                <Text fontSize="sm">{error}</Text>
              </Box>
            </Alert>
          )}

          {!Array.isArray(config) || config.length === 0 ? (
            <Card borderRadius="xl" bg="gradient-to-br" bgGradient="linear(to-br, purple.50, blue.50)">
              <CardBody p={8}>
                <VStack spacing={6}>
                  <Alert status="info" borderRadius="lg" bg="white" boxShadow="sm">
                    <AlertIcon />
                    <Box>
                      <Text fontWeight="bold" mb={1}>Configuración no encontrada</Text>
                      <Text fontSize="sm">
                        No hay configuración establecida. Inicializa la configuración para empezar a otorgar puntos.
                      </Text>
                    </Box>
                  </Alert>
                  <Button
                    colorScheme="purple"
                    onClick={handleInitialize}
                    isLoading={initializing}
                    size="lg"
                    borderRadius="xl"
                    px={8}
                  >
                    Inicializar Configuración
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          ) : (
            <VStack spacing={6} align="stretch">
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                {Object.keys(CONFIG_LABELS).map((key) => {
                try {
                  // Validar que config sea un array y contenga elementos válidos
                  if (!Array.isArray(config) || config.length === 0) {
                    return null
                  }

                  const configItem = config.find((c) => c && typeof c === 'object' && c.config_key === key)
                  if (!configItem) {
                    console.warn(`No se encontró configuración para la clave: ${key}`)
                    return null
                  }

                  // Validar que formData[key] existe o crear valores por defecto
                  const formValue = formData[key] || {
                    value: typeof configItem.config_value === 'number' ? configItem.config_value : 0,
                    enabled: typeof configItem.enabled === 'boolean' ? configItem.enabled : false
                  }

                return (
                  <Card
                    key={key}
                    borderRadius="xl"
                    border="1px solid"
                    borderColor={formValue.enabled ? "purple.200" : "gray.200"}
                    bg={formValue.enabled ? "purple.50" : "gray.50"}
                    _hover={{
                      transform: "translateY(-2px)",
                      boxShadow: "lg",
                      borderColor: formValue.enabled ? "purple.300" : "gray.300"
                    }}
                    transition="all 0.2s"
                  >
                    <CardBody p={6}>
                      <VStack spacing={5} align="stretch">
                        {/* Header de la tarjeta */}
                        <HStack justify="space-between" align="start">
                          <VStack align="start" spacing={2} flex={1}>
                            <HStack>
                              <Heading size="md" color={formValue.enabled ? "purple.700" : "gray.600"}>
                                {CONFIG_LABELS[key].label}
                              </Heading>
                              <Badge
                                colorScheme={formValue.enabled ? 'green' : 'gray'}
                                fontSize="xs"
                                px={2}
                                py={1}
                                borderRadius="full"
                              >
                                {formValue.enabled ? 'Activo' : 'Inactivo'}
                              </Badge>
                            </HStack>
                            <Text fontSize="sm" color="gray.600" lineHeight={1.5}>
                              {CONFIG_LABELS[key].description}
                            </Text>
                          </VStack>
                        </HStack>

                        <Divider />

                        {/* Controles */}
                        <HStack spacing={4} align="end">
                          <FormControl flex={1}>
                            <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                              Puntos otorgados
                            </FormLabel>
                            <NumberInput
                              value={formValue.value}
                              onChange={(_, value) => handleValueChange(key, value)}
                              min={0}
                              max={10000}
                              isDisabled={!formValue.enabled}
                            >
                              <NumberInputField
                                borderRadius="lg"
                                _focus={{ borderColor: "purple.400", boxShadow: "0 0 0 1px purple.400" }}
                              />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                          </FormControl>

                          <FormControl display="flex" alignItems="center" width="auto">
                            <FormLabel mb={0} mr={3} fontSize="sm" fontWeight="medium" color="gray.700">
                              Habilitado
                            </FormLabel>
                            <Switch
                              isChecked={formValue.enabled}
                              onChange={(e) => handleEnabledChange(key, e.target.checked)}
                              colorScheme="purple"
                              size="lg"
                            />
                          </FormControl>

                          <Button
                            colorScheme="purple"
                            onClick={() => handleSave(key)}
                            isLoading={saving}
                            borderRadius="lg"
                            px={6}
                            _hover={{ transform: "translateY(-1px)" }}
                          >
                            Guardar
                          </Button>
                        </HStack>
                      </VStack>
                    </CardBody>
                  </Card>
                )
                } catch (error) {
                  console.error(`Error procesando configuración para ${key}:`, error)
                  return (
                    <Alert key={key} status="warning">
                      <AlertIcon />
                      Error al cargar configuración para {CONFIG_LABELS[key]?.label || key}
                    </Alert>
                  )
                }
              })}
              </SimpleGrid>

              {/* Botón de reinicio mejorado */}
              <Card borderRadius="xl" bg="gray.50">
                <CardBody p={6}>
                  <VStack spacing={4}>
                    <VStack spacing={2}>
                      <Heading size="md" color="gray.700">Restablecer Configuración</Heading>
                      <Text fontSize="sm" color="gray.600" textAlign="center">
                        Esto restablecerá todas las configuraciones a sus valores por defecto
                      </Text>
                    </VStack>
                    <Button
                      colorScheme="gray"
                      variant="outline"
                      onClick={handleInitialize}
                      isLoading={initializing}
                      borderRadius="lg"
                      px={8}
                    >
                      Restablecer a Valores por Defecto
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            </VStack>
          )}
        </VStack>
      </Container>
    </Layout>
  )
}

KickPointsConfigPage.getLayout = (page: React.ReactElement) => <RequireAdmin>{page}</RequireAdmin>
