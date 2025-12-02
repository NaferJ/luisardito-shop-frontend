import { useState, useEffect, useMemo } from 'react'
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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Switch,
  Alert,
  AlertIcon,
  useToast,
  Badge,
  IconButton,
  SimpleGrid,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Flex,
} from '@chakra-ui/react'
import { ArrowBackIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons'
import { useRouter } from 'next/router'
import { Layout } from '../../../components/Layout'
import { RequireAdmin } from '../../../components/RequireAdmin'
import { useKickPointsConfig } from '../../../hooks/useKickPointsConfig'
import Head from "next/head";

const CONFIG_LABELS: Record<string, { label: string; description: string; category: string }> = {
  chat_points_regular: {
    label: 'Mensajes Regulares',
    description: 'Puntos por mensaje en el chat (usuarios no suscritos)',
    category: 'Chat',
  },
  chat_points_subscriber: {
    label: 'Mensajes Suscriptores',
    description: 'Puntos por mensaje en el chat (suscriptores)',
    category: 'Chat',
  },
  chat_points_vip: {
    label: 'Mensajes VIP',
    description: 'Puntos por mensaje en el chat (usuarios VIP)',
    category: 'Chat',
  },
  follow_points: {
    label: 'Follows',
    description: 'Puntos cuando un usuario sigue el canal',
    category: 'Engagement',
  },
  subscription_new_points: {
    label: 'Nueva Suscripción',
    description: 'Puntos por primera suscripción al canal',
    category: 'Suscripciones',
  },
  subscription_renewal_points: {
    label: 'Renovación',
    description: 'Puntos por renovar suscripción existente',
    category: 'Suscripciones',
  },
  gift_given_points: {
    label: 'Regalar Suscripción',
    description: 'Puntos por cada suscripción regalada',
    category: 'Gifts',
  },
  gift_received_points: {
    label: 'Recibir Regalo',
    description: 'Puntos al recibir una suscripción regalada',
    category: 'Gifts',
  },
}

export default function KickPointsConfigPage() {
  const router = useRouter()
  const toast = useToast()
  const { configs, loading, error, updateMultipleConfigs, initializeConfig, resetToDefaults } = useKickPointsConfig()
  const [saving, setSaving] = useState(false)
  const [initializing, setInitializing] = useState(false)

  // Color mode values
  const cardBg = useColorModeValue('white', 'gray.800')
  const cardBorder = useColorModeValue('gray.200', 'gray.600')
  const tableBg = useColorModeValue('white', 'gray.800')
  const tableHoverBg = useColorModeValue('gray.50', 'gray.700')
  const statBg = useColorModeValue('gray.50', 'gray.700')
  const labelColor = useColorModeValue('gray.700', 'gray.300')
  const descriptionColor = useColorModeValue('gray.600', 'gray.400')
  const mutedColor = useColorModeValue('gray.600', 'gray.400')
  const textColor = useColorModeValue('gray.800', 'white')

  const [formData, setFormData] = useState<Record<string, { value: number; enabled: boolean }>>({})
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (Array.isArray(configs) && configs.length > 0) {
      const newFormData: Record<string, { value: number; enabled: boolean }> = {}
      configs.forEach((item) => {
        if (item && item.config_key) {
          newFormData[item.config_key] = {
            value: item.config_value || 0,
            enabled: item.enabled || false,
          }
        }
      })
      setFormData(newFormData)
      setHasChanges(false)
    }
  }, [configs])

  const handleValueChange = (key: string, value: number) => {
    setFormData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        value,
      },
    }))
    setHasChanges(true)
  }

  const handleEnabledChange = (key: string, enabled: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        enabled,
      },
    }))
    setHasChanges(true)
  }

  const handleSaveAll = async () => {
    try {
      setSaving(true)
      
      const updates = Object.entries(formData).map(([key, data]) => ({
        config_key: key,
        config_value: data.value,
        enabled: data.enabled,
      }))

      await updateMultipleConfigs(updates)

      toast({
        title: 'Configuración actualizada',
        description: 'Todos los cambios se han guardado correctamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      
      setHasChanges(false)
    } catch (err) {
      toast({
        title: 'Error al guardar',
        description: 'No se pudieron guardar los cambios',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    if (Array.isArray(configs) && configs.length > 0) {
      const resetData: Record<string, { value: number; enabled: boolean }> = {}
      configs.forEach((item) => {
        if (item && item.config_key) {
          resetData[item.config_key] = {
            value: item.config_value || 0,
            enabled: item.enabled || false,
          }
        }
      })
      setFormData(resetData)
      setHasChanges(false)
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
        isClosable: true,
      })
    } catch (err) {
      toast({
        title: 'Error al inicializar',
        description: 'No se pudo inicializar la configuración',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setInitializing(false)
    }
  }

  const handleResetToDefaults = async () => {
    if (!confirm('¿Estás seguro de restablecer TODAS las configuraciones a sus valores por defecto? Esto sobrescribirá todos los valores actuales.')) {
      return
    }

    try {
      setInitializing(true)
      await resetToDefaults()

      toast({
        title: 'Configuración restablecida',
        description: 'Todos los valores han sido restablecidos',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (err) {
      toast({
        title: 'Error al restablecer',
        description: 'No se pudieron restablecer los valores',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setInitializing(false)
    }
  }

  const groupedConfigs = useMemo(() => {
    const groups: Record<string, string[]> = {}
    Object.keys(CONFIG_LABELS).forEach((key) => {
      const category = CONFIG_LABELS[key].category
      if (!groups[category]) groups[category] = []
      groups[category].push(key)
    })
    return groups
  }, [])

  return (
    <RequireAdmin>
      <Layout>
          <Head>
              <title>Puntos - Luisardito Shop</title>
              <meta name="description" content="Configura la cantidad de puntos que se otorgan por cada acción en la tienda." />
          </Head>
        <Container maxW="container.xl" py={8}>
          <VStack spacing={6} align="stretch">
            {/* Header */}
            <Flex
              justify="space-between"
              align={{ base: 'start', md: 'center' }}
              direction={{ base: 'column', md: 'row' }}
              gap={4}
            >
              <HStack spacing={4}>
                <IconButton
                  aria-label="Volver"
                  icon={<ArrowBackIcon />}
                  onClick={() => router.push('/admin/kick')}
                  variant="ghost"
                  size="lg"
                />
                <VStack align="start" spacing={1}>
                  <Heading size="lg" color={textColor}>
                    Configuración de Puntos
                  </Heading>
                  <Text color={mutedColor} fontSize="sm">
                    Define cuántos puntos se otorgan por cada tipo de evento
                  </Text>
                </VStack>
              </HStack>
            </Flex>

            {error && (
              <Alert status="error" borderRadius="lg">
                <AlertIcon />
                <Box>
                  <Text fontWeight="bold">Error al cargar configuración</Text>
                  <Text fontSize="sm">{error}</Text>
                </Box>
              </Alert>
            )}

            {!loading && (!Array.isArray(configs) || configs.length === 0) ? (
              <Card borderRadius="lg" bg={cardBg} borderWidth="1px" borderColor={cardBorder}>
                <CardBody p={8}>
                  <VStack spacing={6}>
                    <Alert status="info" borderRadius="lg">
                      <AlertIcon />
                      <Box>
                        <Text fontWeight="bold" mb={1}>Configuración no encontrada</Text>
                        <Text fontSize="sm" color={descriptionColor}>
                          No hay configuración establecida. Inicializa la configuración para empezar.
                        </Text>
                      </Box>
                    </Alert>
                    <Button
                      colorScheme="blue"
                      onClick={handleInitialize}
                      isLoading={initializing}
                      size="lg"
                      px={8}
                    >
                      Inicializar Configuración
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            ) : (
              <>
                {/* Barra de acciones */}
                <Card borderRadius="lg" bg={cardBg} borderWidth="1px" borderColor={cardBorder}>
                  <CardBody p={4}>
                    <Flex
                      justify="space-between"
                      align="center"
                      direction={{ base: 'column', md: 'row' }}
                      gap={3}
                    >
                      <HStack spacing={2}>
                        {hasChanges && (
                          <Badge colorScheme="orange" fontSize="sm" px={3} py={1}>
                            Cambios pendientes
                          </Badge>
                        )}
                      </HStack>

                      <HStack spacing={3}>
                        {hasChanges && (
                          <Button
                            variant="outline"
                            onClick={handleReset}
                            leftIcon={<CloseIcon />}
                            size="md"
                          >
                            Descartar
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          onClick={handleResetToDefaults}
                          isLoading={initializing}
                          size="md"
                        >
                          Restablecer Valores
                        </Button>
                        <Button
                          colorScheme="blue"
                          onClick={handleSaveAll}
                          isLoading={saving}
                          isDisabled={!hasChanges}
                          leftIcon={<CheckIcon />}
                          size="md"
                        >
                          Guardar Todo
                        </Button>
                      </HStack>
                    </Flex>
                  </CardBody>
                </Card>

                {/* Tabla de configuraciones */}
                <Box
                  bg={tableBg}
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor={cardBorder}
                  overflow="hidden"
                >
                  <TableContainer>
                    <Table variant="simple" size="sm">
                      <Thead bg={statBg}>
                        <Tr>
                          <Th py={3} width="30%">Configuración</Th>
                          <Th py={3} width="30%">Descripción</Th>
                          <Th py={3} width="20%">Puntos</Th>
                          <Th py={3} width="10%" textAlign="center">Estado</Th>
                          <Th py={3} width="10%" textAlign="center">Activo</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {Object.entries(groupedConfigs).map(([category, keys]) => (
                          <>
                            <Tr key={`category-${category}`} bg={statBg}>
                              <Td colSpan={5} py={2}>
                                <Text fontSize="xs" fontWeight="bold" color={labelColor}>
                                  {category}
                                </Text>
                              </Td>
                            </Tr>
                            {keys.map((key) => {
                              const formValue = formData[key] || { value: 0, enabled: false }
                              const config = CONFIG_LABELS[key]

                              return (
                                <Tr key={key} _hover={{ bg: tableHoverBg }} transition="all 0.2s">
                                  <Td py={3}>
                                    <Text fontSize="sm" fontWeight="medium" color={textColor}>
                                      {config.label}
                                    </Text>
                                  </Td>
                                  <Td py={3}>
                                    <Text fontSize="xs" color={descriptionColor} noOfLines={2}>
                                      {config.description}
                                    </Text>
                                  </Td>
                                  <Td py={3}>
                                    <NumberInput
                                      value={formValue.value}
                                      onChange={(_, value) => handleValueChange(key, value)}
                                      min={0}
                                      max={10000}
                                      isDisabled={!formValue.enabled}
                                      size="sm"
                                      maxW="120px"
                                    >
                                      <NumberInputField />
                                      <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                      </NumberInputStepper>
                                    </NumberInput>
                                  </Td>
                                  <Td py={3} textAlign="center">
                                    <Badge
                                      colorScheme={formValue.enabled ? 'green' : 'gray'}
                                      fontSize="xs"
                                    >
                                      {formValue.enabled ? 'Activo' : 'Inactivo'}
                                    </Badge>
                                  </Td>
                                  <Td py={3} textAlign="center">
                                    <Switch
                                      isChecked={formValue.enabled}
                                      onChange={(e) => handleEnabledChange(key, e.target.checked)}
                                      colorScheme="green"
                                      size="md"
                                    />
                                  </Td>
                                </Tr>
                              )
                            })}
                          </>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Box>
              </>
            )}
          </VStack>
        </Container>
      </Layout>
    </RequireAdmin>
  )
}
