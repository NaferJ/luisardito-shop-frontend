import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Layout } from '../../components/Layout'
import { useProducto } from '../../hooks/useProducto'
import { useAuth } from '../../hooks/useAuth'
import { useCreateCanje } from '../../hooks/useCanjes'
import { useProductos } from '../../hooks/useProductos'
import { ProductCard } from '../../components/ProductCard'
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
  Icon,
  Heading,
  Divider,
  useToast,
  Alert,
  AlertIcon
} from '@chakra-ui/react'
import { MdPeople } from 'react-icons/md'

export default function ProductoDetallePage() {
  const router = useRouter()
  const { slug } = router.query
  const { data: producto, isLoading, error } = useProducto(slug as string)
  const { user, isAuthenticated } = useAuth()
  const createCanjeMutation = useCreateCanje()
  const { data: productos } = useProductos()
  const toast = useToast()
  const [canjeError, setCanjeError] = useState<string | null>(null)

  // Redirect to 404 if product not found
  useEffect(() => {
    if (error && (error as any)?.response?.status === 404) {
      router.push('/404')
    }
  }, [error, router])

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
    // If it's a 404, we already redirected, so this won't show
    // For other errors, show generic error
    if ((error as any)?.response?.status !== 404) {
      return (
        <Layout>
          <Center mt={10}>
            <Text>Error al cargar el producto</Text>
          </Center>
        </Layout>
      )
    }
    // For 404, return null since we're redirecting
    return null
  }

  // Validación: si el producto no está publicado y el usuario no puede ver borradores, mostrar 404
  const canSeeDrafts = user && user.rol_id > 2 // Roles 3,4,5 pueden ver borradores
  if (producto.estado !== 'publicado' && !canSeeDrafts) {
    return (
      <Layout>
        <Center mt={10}>
          <Text>Producto no encontrado</Text>
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
      <Head>
        <title>{producto.nombre} - Luisardito Shop</title>
        <meta name="description" content={`${producto.descripcion} - Canjea por ${producto.precio} puntos en Luisardito Shop`}/>
        <meta property="og:title" content={`${producto.nombre} - Luisardito Shop`}/>
        <meta property="og:description" content={producto.descripcion}/>
        {(producto.imagen_url || producto.imagen) && (
          <meta property="og:image" content={producto.imagen_url || producto.imagen}/>
        )}
      </Head>
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
                <HStack spacing={3} align="center">
                  <Badge colorScheme="blue" borderRadius="full" px={3} py={1} fontSize="sm">
                    {producto.precio} pts
                  </Badge>
                  <Badge colorScheme={producto.stock > 0 ? 'green' : 'red'} borderRadius="full" px={2} py={1} fontSize="xs" display="inline-flex" alignItems="center" gap={1}>
                    <span role="img" aria-label="stock">📦</span>
                    {producto.stock}
                  </Badge>
                  {typeof (producto as any).canjes_count === 'number' && (
                    <Badge colorScheme="purple" borderRadius="full" px={2} py={1} fontSize="xs" display="inline-flex" alignItems="center" gap={1}>
                      <Icon as={MdPeople} />
                      {(producto as any).canjes_count}
                    </Badge>
                  )}
                </HStack>
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

        {/* Productos similares */}
        {(() => {
          const canSeeDrafts = user && user.rol_id > 2
          const productosSimilares = productos
            ?.filter(p => p.id !== producto.id && (p.estado === 'publicado' || canSeeDrafts))
            ?.sort((a, b) => Math.abs(a.precio - producto.precio) - Math.abs(b.precio - producto.precio))
            ?.slice(0, 4) || []
          return productosSimilares.length > 0 ? (
            <Box mt={12}>
              <Heading size="md" mb={6} textAlign="center">
                Productos similares
              </Heading>
              <Grid templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6}>
                {productosSimilares.map(p => (
                  <ProductCard key={p.id} producto={p} />
                ))}
              </Grid>
            </Box>
          ) : null
        })()}
      </Container>
    </Layout>
  )
}
