import { Layout } from '../components/Layout'
import { RequireAuth } from '../components/RequireAuth'
import { Box, VStack, HStack, Text, Badge, Spinner, Center, Divider, Image } from '@chakra-ui/react'
import { useCanjes } from '../hooks/useCanjes'

export default function CanjesPage() {
  const { data: canjes, isLoading, error } = useCanjes()

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
          <Center mt={10}>Error al cargar tus canjes</Center>
        </Layout>
      </RequireAuth>
    )
  }

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'pendiente': return 'yellow'
      case 'entregado': return 'green'
      case 'cancelado': return 'red'
      case 'devuelto': return 'purple'
      default: return 'gray'
    }
  }

  const getStatusText = (estado: string) => {
    switch (estado) {
      case 'pendiente': return 'Pendiente'
      case 'entregado': return 'Entregado'
      case 'cancelado': return 'Cancelado'
      case 'devuelto': return 'Devuelto'
      default: return estado
    }
  }

  return (
    <RequireAuth>
      <Layout>
        <Box maxW="container.lg" mx="auto" p={6}>
          <Text fontSize="3xl" fontWeight="bold" mb={6}>
            Mis Canjes
          </Text>

          {!canjes || canjes.length === 0 ? (
            <Center py={10}>
              <VStack spacing={4}>
                <Text fontSize="lg" color="text.muted">
                  No tienes canjes realizados
                </Text>
                <Text fontSize="sm" color="text.muted">
                  Ve al catálogo y canjea productos con tus puntos
                </Text>
              </VStack>
            </Center>
          ) : (
            <VStack spacing={4} align="stretch">
              {canjes.map((canje) => (
                <Box
                  key={canje.id}
                  borderWidth="1px"
                  borderColor="border.default"
                  borderRadius="lg"
                  p={4}
                  bg="bg.canvas"
                  shadow="sm"
                >
                  <HStack spacing={4} align="start">
                    {/* Imagen del producto */}
                    {(canje as any).Producto?.imagen_url && (
                      <Image
                        src={(canje as any).Producto.imagen_url}
                        alt={(canje as any).Producto.nombre}
                        boxSize="80px"
                        objectFit="cover"
                        borderRadius="md"
                      />
                    )}

                    {/* Información del canje */}
                    <VStack align="start" spacing={2} flex="1">
                      <HStack justify="space-between" w="full">
                        <Text fontWeight="bold" fontSize="lg">
                          {(canje as any).Producto?.nombre || 'Producto no encontrado'}
                        </Text>
                        <Badge colorScheme={getStatusColor(canje.estado)}>
                          {getStatusText(canje.estado)}
                        </Badge>
                      </HStack>

                      <Text color="text.muted">
                        {(canje as any).Producto?.descripcion}
                      </Text>

                      <HStack spacing={4}>
                        <Text fontSize="sm" color="accent.fg" fontWeight="semibold">
                          {(canje as any).Producto?.precio} puntos
                        </Text>
                        <Text fontSize="sm" color="text.muted">
                          Fecha: {new Date(canje.fecha).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Text>
                      </HStack>

                      {canje.estado === 'pendiente' && (
                        <Text fontSize="sm" color="orange.600" fontStyle="italic">
                          Tu canje está siendo procesado
                        </Text>
                      )}
                      {canje.estado === 'entregado' && (
                        <Text fontSize="sm" color="green.600" fontStyle="italic">
                          ¡Canje completado con éxito!
                        </Text>
                      )}
                    </VStack>
                  </HStack>
                </Box>
              ))}
            </VStack>
          )}

          <Divider my={6} />

          <Text fontSize="sm" color="text.muted" textAlign="center">
            Los canjes pendientes serán procesados en las próximas 24-48 horas
          </Text>
        </Box>
      </Layout>
    </RequireAuth>
  )
}
