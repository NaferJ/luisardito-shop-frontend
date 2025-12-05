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
  AlertIcon,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  useColorModeValue,
  IconButton,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useClipboard,
  Stack,
  Progress
} from '@chakra-ui/react'
import {
  MdPeople,
  MdShoppingCart,
  MdInventory,
  MdChevronRight,
  MdHome,
  MdShare,
  MdContentCopy,
  MdNotifications,
  MdInfo,
  MdTrendingUp
} from 'react-icons/md'
import { FaTwitter, FaFacebook, FaWhatsapp } from 'react-icons/fa'
import NextLink from 'next/link'

export default function ProductoDetallePage() {
  const router = useRouter()
  const { slug } = router.query
  const { data: producto, isLoading, error } = useProducto(slug as string)
  const { user, isAuthenticated } = useAuth()
  const createCanjeMutation = useCreateCanje()
  const { data: productos } = useProductos()
  const toast = useToast()
  const [canjeError, setCanjeError] = useState<string | null>(null)

  const productUrl = typeof window !== 'undefined' ? window.location.href : ''
  const { hasCopied, onCopy } = useClipboard(productUrl)

  // Theme colors
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const accentColor = useColorModeValue('blue.600', 'blue.400')
  const textColor = useColorModeValue('gray.800', 'gray.100')
  const mutedColor = useColorModeValue('gray.600', 'gray.400')
  const infoBg = useColorModeValue('gray.50', 'gray.800')

  useEffect(() => {
    if (error && (error as any)?.response?.status === 404) {
      router.push('/404')
    }
  }, [error, router])

  useEffect(() => {
    if (hasCopied) {
      toast({
        title: 'Enlace copiado',
        description: 'El enlace del producto ha sido copiado al portapapeles',
        status: 'success',
        duration: 2000,
        isClosable: true
      })
    }
  }, [hasCopied, toast])

  if (isLoading) {
    return (
      <Layout>
        <Center minH="60vh">
          <VStack spacing={3}>
            <Spinner size="xl" color={accentColor} thickness="3px" />
            <Text color={mutedColor} fontSize="sm">
              Cargando producto
            </Text>
          </VStack>
        </Center>
      </Layout>
    )
  }

  if (error || !producto) {
    if ((error as any)?.response?.status !== 404) {
      return (
        <Layout>
          <Center minH="60vh">
            <VStack spacing={4}>
              <Text fontSize="lg" color="red.500">
                Error al cargar el producto
              </Text>
              <Button colorScheme="blue" variant="outline" onClick={() => router.push('/')}>
                Volver al inicio
              </Button>
            </VStack>
          </Center>
        </Layout>
      )
    }
    return null
  }

  const canSeeDrafts = user && user.rol_id > 2
  if (producto.estado !== 'publicado' && !canSeeDrafts) {
    return (
      <Layout>
        <Center minH="60vh">
          <VStack spacing={4}>
            <Text fontSize="lg">Producto no encontrado</Text>
            <Button colorScheme="blue" variant="outline" onClick={() => router.push('/')}>
              Volver al inicio
            </Button>
          </VStack>
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
      return
    }

    setCanjeError(null)

    try {
      await createCanjeMutation.mutateAsync(producto.id)
      toast({
        title: 'Canje exitoso',
        description: `Has canjeado ${producto.nombre} por ${producto.precio} puntos`,
        status: 'success',
        duration: 5000,
        isClosable: true
      })
      router.push('/canjes')
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Error al realizar el canje'
      setCanjeError(errorMessage)
      toast({
        title: 'Error en el canje',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }
  }

  const handleNotifyStock = () => {
    toast({
      title: 'Notificación activada',
      description: 'Te avisaremos cuando este producto esté disponible',
      status: 'info',
      duration: 3000,
      isClosable: true
    })
  }

  const shareOnTwitter = () => {
    const text = `Mira este producto: ${producto.nombre} - ${producto.precio} puntos`
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(productUrl)}`,
      '_blank'
    )
  }

  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`,
      '_blank'
    )
  }

  const shareOnWhatsApp = () => {
    const text = `Mira este producto: ${producto.nombre} - ${producto.precio} puntos`
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + productUrl)}`, '_blank')
  }

  const getButtonState = () => {
    if (!isAuthenticated) {
      return {
        text: 'Iniciar sesión para canjear',
        colorScheme: 'blue',
        disabled: false,
        isLoading: false,
        variant: 'solid'
      }
    }

    if (producto.stock <= 0) {
      return {
        text: 'Sin stock',
        colorScheme: 'gray',
        disabled: true,
        isLoading: false,
        variant: 'outline'
      }
    }

    if (!user || user.puntos < producto.precio) {
      return {
        text: `Faltan ${producto.precio - (user?.puntos || 0)} puntos`,
        colorScheme: 'orange',
        disabled: true,
        isLoading: false,
        variant: 'outline'
      }
    }

    return {
      text: createCanjeMutation.isPending ? 'Procesando...' : 'Canjear ahora',
      colorScheme: 'blue',
      disabled: createCanjeMutation.isPending,
      isLoading: createCanjeMutation.isPending,
      variant: 'solid'
    }
  }

  const buttonState = getButtonState()

  const productosSimilares =
    productos
      ?.filter((p) => p.id !== producto.id && (p.estado === 'publicado' || canSeeDrafts))
      ?.sort((a, b) => Math.abs(a.precio - producto.precio) - Math.abs(b.precio - producto.precio))
      ?.slice(0, 4) || []

  const stockPercentage = Math.min(100, (producto.stock / 50) * 100)

  return (
    <Layout>
      <Head>
        <title>{producto.nombre} - Luisardito Shop</title>
        <meta
          name="description"
          content={`${producto.descripcion} - Canjea por ${producto.precio} puntos`}
        />
        <meta property="og:title" content={`${producto.nombre} - Luisardito Shop`} />
        <meta property="og:description" content={producto.descripcion} />
        {(producto.imagen_url || producto.imagen) && (
          <meta property="og:image" content={producto.imagen_url || producto.imagen} />
        )}
      </Head>

      <Container maxW="container.xl" py={{ base: 4, md: 6 }}>
        {/* Breadcrumbs */}
        <Breadcrumb
          spacing={2}
          separator={<Icon as={MdChevronRight} color={mutedColor} boxSize={4} />}
          mb={4}
          fontSize="sm"
        >
          <BreadcrumbItem>
            <BreadcrumbLink
              as={NextLink}
              href="/"
              color={mutedColor}
              _hover={{ color: accentColor }}
            >
              <HStack spacing={1}>
                <Icon as={MdHome} boxSize={4} />
                <Text>Inicio</Text>
              </HStack>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink
              as={NextLink}
              href="/"
              color={mutedColor}
              _hover={{ color: accentColor }}
            >
              Productos
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <Text color={accentColor} fontWeight="medium" noOfLines={1}>
              {producto.nombre}
            </Text>
          </BreadcrumbItem>
        </Breadcrumb>

        {/* Error Alert */}
        {canjeError && (
          <Alert status="error" mb={4} borderRadius="lg">
            <AlertIcon />
            {canjeError}
          </Alert>
        )}

        {/* Main Content */}
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1.2fr' }} gap={{ base: 6, lg: 8 }}>
          {/* Imagen */}
          <GridItem>
            <Box position="sticky" top={4}>
              <Box
                borderRadius="lg"
                overflow="hidden"
                bg={cardBg}
                border="1px solid"
                borderColor={borderColor}
                position="relative"
              >
                {producto.estado !== 'publicado' && canSeeDrafts && (
                  <Badge
                    position="absolute"
                    top={3}
                    left={3}
                    colorScheme="orange"
                    fontSize="xs"
                    px={2}
                    py={1}
                    borderRadius="md"
                    zIndex={1}
                  >
                    Borrador
                  </Badge>
                )}
                {producto.imagen_url || producto.imagen ? (
                  <Image
                    src={producto.imagen_url || producto.imagen}
                    alt={producto.nombre}
                    w="100%"
                    h={{ base: '300px', md: '400px', lg: '500px' }}
                    objectFit="cover"
                  />
                ) : (
                  <Center h={{ base: '300px', md: '400px', lg: '500px' }} bg={infoBg}>
                    <VStack spacing={2}>
                      <Icon as={MdInventory} boxSize={12} color={mutedColor} />
                      <Text color={mutedColor} fontSize="sm">
                        Sin imagen
                      </Text>
                    </VStack>
                  </Center>
                )}
              </Box>

              {/* Stats rápidas */}
              <HStack spacing={3} mt={3}>
                <Box
                  flex={1}
                  bg={cardBg}
                  border="1px solid"
                  borderColor={borderColor}
                  borderRadius="lg"
                  p={3}
                  textAlign="center"
                >
                  <Text fontSize="xs" color={mutedColor} mb={1}>
                    Precio
                  </Text>
                  <Text fontSize="xl" fontWeight="bold" color={accentColor}>
                    {producto.precio}
                  </Text>
                  <Text fontSize="xs" color={mutedColor}>
                    puntos
                  </Text>
                </Box>
                <Box
                  flex={1}
                  bg={cardBg}
                  border="1px solid"
                  borderColor={borderColor}
                  borderRadius="lg"
                  p={3}
                  textAlign="center"
                >
                  <Text fontSize="xs" color={mutedColor} mb={1}>
                    Stock
                  </Text>
                  <Text
                    fontSize="xl"
                    fontWeight="bold"
                    color={producto.stock > 0 ? 'green.500' : 'red.500'}
                  >
                    {producto.stock}
                  </Text>
                  <Text fontSize="xs" color={mutedColor}>
                    unidades
                  </Text>
                </Box>
                {typeof (producto as any).canjes_count === 'number' && (
                  <Box
                    flex={1}
                    bg={cardBg}
                    border="1px solid"
                    borderColor={borderColor}
                    borderRadius="lg"
                    p={3}
                    textAlign="center"
                  >
                    <Text fontSize="xs" color={mutedColor} mb={1}>
                      Canjes
                    </Text>
                    <Text fontSize="xl" fontWeight="bold" color="purple.500">
                      {(producto as any).canjes_count}
                    </Text>
                    <Text fontSize="xs" color={mutedColor}>
                      realizados
                    </Text>
                  </Box>
                )}
              </HStack>
            </Box>
          </GridItem>

          {/* Información */}
          <GridItem>
            <VStack align="stretch" spacing={4}>
              {/* Header */}
              <Flex justify="space-between" align="start">
                <Box flex={1}>
                  <Heading size="xl" mb={2} color={textColor}>
                    {producto.nombre}
                  </Heading>
                  <HStack spacing={2} flexWrap="wrap">
                    <Badge
                      colorScheme={producto.stock > 0 ? 'green' : 'red'}
                      fontSize="xs"
                      px={2}
                      py={1}
                      borderRadius="md"
                    >
                      {producto.stock > 0 ? 'Disponible' : 'Agotado'}
                    </Badge>
                    {producto.stock > 0 && producto.stock < 5 && (
                      <Badge colorScheme="orange" fontSize="xs" px={2} py={1} borderRadius="md">
                        Últimas unidades
                      </Badge>
                    )}
                  </HStack>
                </Box>

                {/* Acciones */}
                <HStack spacing={2}>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<Icon as={MdShare} />}
                      variant="ghost"
                      size="sm"
                      aria-label="Compartir"
                    />
                    <MenuList>
                      <MenuItem icon={<Icon as={FaTwitter} />} onClick={shareOnTwitter}>
                        Twitter
                      </MenuItem>
                      <MenuItem icon={<Icon as={FaFacebook} />} onClick={shareOnFacebook}>
                        Facebook
                      </MenuItem>
                      <MenuItem icon={<Icon as={FaWhatsapp} />} onClick={shareOnWhatsApp}>
                        WhatsApp
                      </MenuItem>
                      <MenuItem icon={<Icon as={MdContentCopy} />} onClick={onCopy}>
                        Copiar enlace
                      </MenuItem>
                    </MenuList>
                  </Menu>

                  {producto.stock <= 0 && (
                    <Tooltip label="Notificarme cuando esté disponible">
                      <IconButton
                        icon={<Icon as={MdNotifications} />}
                        variant="ghost"
                        size="sm"
                        aria-label="Notificar"
                        onClick={handleNotifyStock}
                      />
                    </Tooltip>
                  )}
                </HStack>
              </Flex>

              <Divider />

              {/* Descripción */}
              <Box>
                <Text fontSize="md" color={textColor} lineHeight="1.7">
                  {producto.descripcion}
                </Text>
              </Box>

              {/* Stock Progress */}
              {producto.stock > 0 && producto.stock < 20 && (
                <Box>
                  <Flex justify="space-between" mb={1}>
                    <Text fontSize="xs" color={mutedColor}>
                      Disponibilidad
                    </Text>
                    <Text fontSize="xs" color={mutedColor}>
                      {producto.stock} unidades
                    </Text>
                  </Flex>
                  <Progress
                    value={stockPercentage}
                    size="sm"
                    colorScheme={
                      stockPercentage > 50 ? 'green' : stockPercentage > 20 ? 'orange' : 'red'
                    }
                    borderRadius="full"
                  />
                </Box>
              )}

              {/* Info adicional */}
              <Box bg={infoBg} borderRadius="lg" p={4}>
                <Stack spacing={3} divider={<Divider />}>
                  <Flex justify="space-between" align="center">
                    <HStack spacing={2}>
                      <Icon as={MdInfo} color={mutedColor} boxSize={4} />
                      <Text fontSize="sm" color={mutedColor}>
                        Precio de canje
                      </Text>
                    </HStack>
                    <Text fontSize="lg" fontWeight="bold" color={accentColor}>
                      {producto.precio} puntos
                    </Text>
                  </Flex>

                  {isAuthenticated && user && (
                    <Flex justify="space-between" align="center">
                      <HStack spacing={2}>
                        <Icon as={MdTrendingUp} color={mutedColor} boxSize={4} />
                        <Text fontSize="sm" color={mutedColor}>
                          Tus puntos disponibles
                        </Text>
                      </HStack>
                      <Text
                        fontSize="lg"
                        fontWeight="bold"
                        color={user.puntos >= producto.precio ? 'green.500' : 'orange.500'}
                      >
                        {user.puntos} puntos
                      </Text>
                    </Flex>
                  )}

                  {typeof (producto as any).canjes_count === 'number' && (
                    <Flex justify="space-between" align="center">
                      <HStack spacing={2}>
                        <Icon as={MdPeople} color={mutedColor} boxSize={4} />
                        <Text fontSize="sm" color={mutedColor}>
                          Popularidad
                        </Text>
                      </HStack>
                      <Text fontSize="md" fontWeight="medium" color={textColor}>
                        {(producto as any).canjes_count} canjes realizados
                      </Text>
                    </Flex>
                  )}
                </Stack>
              </Box>

              {/* Botón de canje */}
              <Box pt={2}>
                <Button
                  size="lg"
                  w="100%"
                  colorScheme={buttonState.colorScheme}
                  variant={buttonState.variant}
                  isDisabled={buttonState.disabled}
                  isLoading={buttonState.isLoading}
                  onClick={handleCanjeAction}
                  leftIcon={<Icon as={MdShoppingCart} />}
                  _hover={{
                    transform: buttonState.disabled ? 'none' : 'translateY(-2px)',
                    boxShadow: buttonState.disabled ? 'none' : 'lg'
                  }}
                  transition="all 0.2s"
                >
                  {buttonState.text}
                </Button>

                {!isAuthenticated && (
                  <Text mt={2} textAlign="center" fontSize="xs" color={mutedColor}>
                    Inicia sesión con tu cuenta de Kick para canjear productos
                  </Text>
                )}

                {isAuthenticated && user && user.puntos < producto.precio && (
                  <Text mt={2} textAlign="center" fontSize="xs" color={mutedColor}>
                    Acumula más puntos viendo streams y participando en el chat
                  </Text>
                )}
              </Box>
            </VStack>
          </GridItem>
        </Grid>

        {/* Productos similares */}
        {productosSimilares.length > 0 && (
          <Box mt={12}>
            <Flex align="center" justify="space-between" mb={4}>
              <Heading size="md" color={textColor}>
                Productos similares
              </Heading>
            </Flex>
            <Grid
              templateColumns={{
                base: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)'
              }}
              gap={4}
            >
              {productosSimilares.map((p) => (
                <ProductCard key={p.id} producto={p} />
              ))}
            </Grid>
          </Box>
        )}
      </Container>
    </Layout>
  )
}
