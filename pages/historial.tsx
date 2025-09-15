import { Layout } from '../components/Layout'
import { RequireAuth } from '../components/RequireAuth'
import { useAuth } from '../hooks/useAuth'
import { useHistorialPuntos } from '../hooks/useHistorialPuntos'
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Badge,
  Spinner,
  Center,
  Card,
  CardBody,
  Heading,
  Divider
} from '@chakra-ui/react'

export default function HistorialPage() {
  const { user } = useAuth()
  const { data: historial, isLoading, error } = useHistorialPuntos(user?.id)

  if (isLoading) {
    return (
      <RequireAuth>
        <Layout>
          <Center mt={10}><Spinner size="xl" /></Center>
        </Layout>
      </RequireAuth>
    )
  }

  if (error) {
    return (
      <RequireAuth>
        <Layout>
          <Center mt={10}>Error al cargar el historial de puntos</Center>
        </Layout>
      </RequireAuth>
    )
  }

  const getChangeColor = (cambio: number) => {
    return cambio > 0 ? 'green' : 'red'
  }

  const getChangeText = (cambio: number) => {
    return cambio > 0 ? `+${cambio}` : `${cambio}`
  }

  return (
    <RequireAuth>
      <Layout>
        <Container maxW="container.lg" py={8}>
          <VStack spacing={6} align="stretch">
            {/* Encabezado */}
            <Box>
              <Heading size="xl" mb={2}>Historial de Puntos</Heading>
              <Text color="gray.600">
                Saldo actual: <Badge colorScheme="purple" fontSize="md">{user?.puntos?.toLocaleString()} puntos</Badge>
              </Text>
            </Box>

            {/* Lista de movimientos */}
            {!historial || historial.length === 0 ? (
              <Center py={10}>
                <VStack spacing={4}>
                  <Text fontSize="lg" color="gray.500">
                    No hay movimientos de puntos
                  </Text>
                  <Text fontSize="sm" color="gray.400">
                    Los movimientos de puntos aparecerán aquí cuando realices canjes o recibas puntos
                  </Text>
                </VStack>
              </Center>
            ) : (
              <VStack spacing={4} align="stretch">
                {historial.map((movimiento) => (
                  <Card key={movimiento.id}>
                    <CardBody>
                      <HStack justify="space-between" align="start">
                        <VStack align="start" spacing={1} flex="1">
                          <Text fontWeight="semibold">
                            {movimiento.motivo}
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            {new Date(movimiento.fecha).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </Text>
                        </VStack>

                        <Badge 
                          colorScheme={getChangeColor(movimiento.cambio)} 
                          fontSize="md" 
                          px={3} 
                          py={1}
                        >
                          {getChangeText(movimiento.cambio)} puntos
                        </Badge>
                      </HStack>
                    </CardBody>
                  </Card>
                ))}
              </VStack>
            )}

            <Divider />

            <Text fontSize="sm" color="gray.500" textAlign="center">
              Los puntos se obtienen por participar en actividades y se gastan al canjear productos
            </Text>
          </VStack>
        </Container>
      </Layout>
    </RequireAuth>
  )
}
