import { useState } from 'react'
import { useRouter } from 'next/router'
import { Layout } from '../../components/Layout'
import { useProducto } from '../../hooks/useProducto'
import { useAuth } from '../../hooks/useAuth.tsx'
import { useCreateCanje } from '../../hooks/useCanjes'
import {
  Box,
  Container,
  Grid,
  GridItem,
  Image,
  Text,
  Button,
  VStack,
  HStack,
  Spinner,
  Center,
  Badge,
  Heading,
  Divider,
  useToast,
  Alert,
  AlertIcon
} from '@chakra-ui/react'

export default function ProductoDetallePage() {
  const router = useRouter()
  const { id } = router.query
  const { data: producto, isLoading, error } = useProducto(id as string)
  const { user, isAuthenticated } = useAuth()
  const createCanjeMutation = useCreateCanje()
  const toast = useToast()
  const [canjeError, setCanjeError] = useState<string | null>(null)

  if (isLoading) {
    return (
      <Layout>
        <Center mt={10}>
          <Spinner size="xl" />
        </Center>
      </Layout>
    )
  }

  if (error || !producto) {
    return (
      <Layout>
        <Center mt={10}>
          <Text>Error al cargar el producto</Text>
        </Center>
      </Layout>
    )
  }

  const handleCanjeAction = async () => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (producto.stock <= 0 || !user || user.puntos < producto.precio) {
      return // No hacer nada si no cumple las condiciones
    }

    setCanjeError(null)

    try {
      await createCanjeMutation.mutateAsync(producto.id)
      toast({
        title: '¡Canje exitoso!',
        description: `Has canjeado ${producto.nombre} por ${producto.precio} puntos`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      // Opcional: redirigir a la página de canjes
      router.push('/canjes')
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Error al realizar el canje'
      setCanjeError(errorMessage)
      toast({
        title: 'Error en el canje',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const getButtonState = () => {
    if (!isAuthenticated) {
      return {
        text: 'Inicia sesión para canjear',
        colorScheme: 'blue',
        disabled: false,
        isLoading: false
      }
    }

    if (producto.stock <= 0) {
      return {
        text: 'Sin stock',
        colorScheme: 'red',
        disabled: true,
        isLoading: false
      }
    }

    if (!user || user.puntos < producto.precio) {
      return {
        text: 'Puntos insuficientes',
        colorScheme: 'orange',
        disabled: true,
        isLoading: false
      }
    }

    return {
      text: createCanjeMutation.isPending 
        ? 'Canjeando...' 
        : `Canjear por ${producto.precio} puntos`,
      colorScheme: 'teal',
      disabled: createCanjeMutation.isPending,
      isLoading: createCanjeMutation.isPending
    }
  }

  const buttonState = getButtonState()

  return (
    <Layout>
      <Container maxW="container.lg" py={8}>
        {canjeError && (
          <Alert status="error" mb={6}>
            <AlertIcon />
            {canjeError}
          </Alert>
        )}

        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={8}>
          <GridItem>
            <Box borderRadius="lg" overflow="hidden" bg="white" boxShadow="sm">
              {(producto.imagen_url || producto.imagen) ? (
                <Image
                  src={producto.imagen_url || producto.imagen}
                  alt={producto.nombre}
                  w="100%"
                  h="400px"
                  objectFit="cover"
                />
              ) : (
                <Center h="400px" bg="gray.100">
                  <Text color="gray.500">Sin imagen</Text>
                </Center>
              )}
            </Box>
          </GridItem>

          <GridItem>
            <VStack align="start" spacing={4} h="100%">
              <Box>
                <Heading size="lg" mb={2}>
                  {producto.nombre}
                </Heading>
                <HStack spacing={2}>
                  <Badge colorScheme={producto.stock > 0 ? 'green' : 'red'}>
                    {producto.stock > 0 ? `${producto.stock} disponibles` : 'Sin stock'}
                  </Badge>
                </HStack>
              </Box>

              <Divider />

              <Box>
                <Text fontSize="lg" mb={4}>
                  {producto.descripcion}
                </Text>
              </Box>

              <Box>
                <Text fontSize="2xl" fontWeight="bold" color="teal.600">
                  {producto.precio} puntos
                </Text>
                {isAuthenticated && user && (
                  <Text fontSize="sm" color="gray.600">
                    Tienes {user.puntos} puntos disponibles
                  </Text>
                )}
              </Box>

              <Box mt="auto" w="100%">
                <Button
                  size="lg"
                  w="100%"
                  colorScheme={buttonState.colorScheme}
                  isDisabled={buttonState.disabled}
                  isLoading={buttonState.isLoading}
                  onClick={handleCanjeAction}
                >
                  {buttonState.text}
                </Button>
              </Box>
            </VStack>
          </GridItem>
        </Grid>
      </Container>
    </Layout>
  )
}
