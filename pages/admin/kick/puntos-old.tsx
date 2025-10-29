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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormControl,
  FormLabel,
  Switch,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  SimpleGrid,
  Divider,
  Badge,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { Layout } from '../../../components/Layout'
import { RequireAdmin } from '../../../components/RequireAdmin'
import { useKickPointsConfig } from '../../../hooks/useKickPointsConfig'

export default function KickPuntosAdminPage() {
  const router = useRouter()
  const toast = useToast()
  const { configs, loading, error, updateConfig } = useKickPointsConfig()
  const [updating, setUpdating] = useState<string | null>(null)

  const handleConfigUpdate = async (configKey: string, value: number | boolean) => {
    try {
      setUpdating(configKey)
      await updateConfig(configKey, value)
      toast({
        title: 'Configuración actualizada',
        description: `${configKey} actualizado correctamente`,
        status: 'success',
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la configuración',
        status: 'error',
        duration: 5000,
      })
    } finally {
      setUpdating(null)
    }
  }

  if (loading) {
    return (
      <Layout>
        <Container maxW="container.xl" py={8}>
          <VStack spacing={8}>
            <Spinner size="xl" />
            <Text>Cargando configuración de puntos...</Text>
          </VStack>
        </Container>
      </Layout>
    )
  }

  const getConfigValue = (key: string) => {
    const config = configs?.find(c => c.config_key === key)
    return config?.config_value || 0
  }

  const getConfigEnabled = (key: string) => {
    const config = configs?.find(c => c.config_key === key)
    return config?.enabled || false
  }

  return (
    <RequireAdmin>
      <Layout>
        <Container maxW="container.xl" py={8}>
          <VStack spacing={8} align="stretch">
            {/* Header */}
            <Box>
              <HStack spacing={4} mb={4}>
                <Button
                  variant="ghost"
                  onClick={() => router.push('/admin/kick')}
                  size="sm"
                >
                  ← Volver
                </Button>
              </HStack>
              <Heading size="xl" mb={2} color="blue.600">
                ⚙️ Configuración de Puntos
              </Heading>
              <Text color="black.600" fontSize="lg">
                Gestiona la cantidad de puntos otorgados por diferentes eventos de Kick
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

            {/* Configuración de eventos básicos */}
            <Card borderRadius="xl">
              <CardBody>
                <VStack spacing={6} align="stretch">
                  <Box>
                    <Heading size="md" color="blue.600" mb={2}>
                      💬 Eventos de Chat
                    </Heading>
                    <Text color="black.600" fontSize="sm">
                      Puntos otorgados por participación en chat
                    </Text>
                  </Box>

                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <FormControl>
                      <FormLabel>
                        <HStack justify="space-between">
                          <Text>Puntos por mensaje</Text>
                          <Switch
                            isChecked={getConfigEnabled('chat_message_points')}
                            onChange={(e) => handleConfigUpdate('chat_message_points_enabled', e.target.checked)}
                            colorScheme="blue"
                          />
                        </HStack>
                      </FormLabel>
                      <NumberInput
                        value={getConfigValue('chat_message_points')}
                        min={0}
                        max={50}
                        isDisabled={!getConfigEnabled('chat_message_points') || updating === 'chat_message_points'}
                        onChange={(_, value) => handleConfigUpdate('chat_message_points', value)}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <Text fontSize="xs" color="black.500" mt={1}>
                        Puntos base por cada mensaje enviado en chat
                      </Text>
                    </FormControl>

                    <FormControl>
                      <FormLabel>
                        <HStack justify="space-between">
                          <Text>Cooldown entre mensajes (segundos)</Text>
                          <Badge colorScheme="black" fontSize="xs">Automático</Badge>
                        </HStack>
                      </FormLabel>
                      <NumberInput
                        value={getConfigValue('chat_cooldown_seconds')}
                        min={10}
                        max={300}
                        isDisabled={updating === 'chat_cooldown_seconds'}
                        onChange={(_, value) => handleConfigUpdate('chat_cooldown_seconds', value)}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <Text fontSize="xs" color="black.500" mt={1}>
                        Tiempo mínimo entre mensajes para obtener puntos
                      </Text>
                    </FormControl>
                  </SimpleGrid>
                </VStack>
              </CardBody>
            </Card>

            {/* Configuración de eventos sociales */}
            <Card borderRadius="xl">
              <CardBody>
                <VStack spacing={6} align="stretch">
                  <Box>
                    <Heading size="md" color="green.400" mb={2}>
                      👥 Eventos Sociales
                    </Heading>
                    <Text color="black.600" fontSize="sm">
                      Puntos por follows, suscripciones y otros eventos importantes
                    </Text>
                  </Box>

                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <FormControl>
                      <FormLabel>
                        <HStack justify="space-between">
                          <Text>Puntos por follow</Text>
                          <Switch
                            isChecked={getConfigEnabled('follow_points')}
                            onChange={(e) => handleConfigUpdate('follow_points_enabled', e.target.checked)}
                            colorScheme="green"
                          />
                        </HStack>
                      </FormLabel>
                      <NumberInput
                        value={getConfigValue('follow_points')}
                        min={0}
                        max={1000}
                        isDisabled={!getConfigEnabled('follow_points') || updating === 'follow_points'}
                        onChange={(_, value) => handleConfigUpdate('follow_points', value)}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <Text fontSize="xs" color="black.500" mt={1}>
                        Puntos otorgados cuando alguien sigue el canal
                      </Text>
                    </FormControl>

                    <FormControl>
                      <FormLabel>
                        <HStack justify="space-between">
                          <Text>Puntos por suscripción</Text>
                          <Switch
                            isChecked={getConfigEnabled('subscription_points')}
                            onChange={(e) => handleConfigUpdate('subscription_points_enabled', e.target.checked)}
                            colorScheme="green"
                          />
                        </HStack>
                      </FormLabel>
                      <NumberInput
                        value={getConfigValue('subscription_points')}
                        min={0}
                        max={2000}
                        isDisabled={!getConfigEnabled('subscription_points') || updating === 'subscription_points'}
                        onChange={(_, value) => handleConfigUpdate('subscription_points', value)}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <Text fontSize="xs" color="black.500" mt={1}>
                        Puntos por suscribirse al canal
                      </Text>
                    </FormControl>
                  </SimpleGrid>
                </VStack>
              </CardBody>
            </Card>

            {/* Configuración especial */}
            <Card borderRadius="xl">
              <CardBody>
                <VStack spacing={6} align="stretch">
                  <Box>
                    <Heading size="md" color="purple.600" mb={2}>
                      ⭐ Eventos Especiales
                    </Heading>
                    <Text color="black.600" fontSize="sm">
                      Configuración para eventos especiales y multiplicadores
                    </Text>
                  </Box>

                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <FormControl>
                      <FormLabel>
                        <HStack justify="space-between">
                          <Text>Multiplicador suscriptores</Text>
                          <Badge colorScheme="purple" fontSize="xs">⭐ SUBS</Badge>
                        </HStack>
                      </FormLabel>
                      <NumberInput
                        value={getConfigValue('subscriber_multiplier')}
                        min={1}
                        max={10}
                        step={0.1}
                        precision={1}
                        isDisabled={updating === 'subscriber_multiplier'}
                        onChange={(_, value) => handleConfigUpdate('subscriber_multiplier', value)}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <Text fontSize="xs" color="black.500" mt={1}>
                        Multiplicador de puntos para suscriptores del canal
                      </Text>
                    </FormControl>

                    <FormControl>
                      <FormLabel>
                        <HStack justify="space-between">
                          <Text>Puntos por raid recibido</Text>
                          <Switch
                            isChecked={getConfigEnabled('raid_points')}
                            onChange={(e) => handleConfigUpdate('raid_points_enabled', e.target.checked)}
                            colorScheme="purple"
                          />
                        </HStack>
                      </FormLabel>
                      <NumberInput
                        value={getConfigValue('raid_points')}
                        min={0}
                        max={5000}
                        isDisabled={!getConfigEnabled('raid_points') || updating === 'raid_points'}
                        onChange={(_, value) => handleConfigUpdate('raid_points', value)}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <Text fontSize="xs" color="black.500" mt={1}>
                        Puntos bonus cuando recibimos un raid
                      </Text>
                    </FormControl>
                  </SimpleGrid>
                </VStack>
              </CardBody>
            </Card>

            {/* Información del sistema */}
            <Card borderRadius="xl" bg="black.50">
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <Heading size="sm" color="black.700">
                    ℹ️ Información del Sistema
                  </Heading>

                  <VStack spacing={2} align="stretch" fontSize="sm" color="black.600">
                    <Text>• Los puntos se otorgan automáticamente cuando se detectan los eventos</Text>
                    <Text>• Los usuarios VIP reciben puntos adicionales según su configuración especial</Text>
                    <Text>• Los suscriptores del canal reciben el multiplicador configurado</Text>
                    <Text>• El cooldown de chat evita spam y farming de puntos</Text>
                    <Text>• Los cambios se aplican inmediatamente a nuevos eventos</Text>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        </Container>
      </Layout>
    </RequireAdmin>
  )
}
