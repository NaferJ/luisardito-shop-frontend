import {
  Box,
  VStack,
  Text,
  Image,
  Badge,
  HStack,
  Heading,
  useColorModeValue,
  Card,
  CardBody,
  Divider
} from '@chakra-ui/react'
import { ProductoForm } from '../types'

interface ProductFormPreviewProps {
  formData: ProductoForm
  imageUrl: string | null
}

export function ProductFormPreview({ formData, imageUrl }: ProductFormPreviewProps) {
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const textColor = useColorModeValue('gray.600', 'gray.400')
  const headingColor = useColorModeValue('gray.900', 'white')
  const noImageBg = useColorModeValue('gray.100', 'gray.700')
  const labelColor = useColorModeValue('gray.500', 'gray.500')

  const getEstadoColorScheme = (estado: string) => {
    switch (estado) {
      case 'publicado':
        return 'green'
      case 'borrador':
        return 'yellow'
      case 'eliminado':
        return 'red'
      default:
        return 'gray'
    }
  }

  const getEstadoText = (estado: string) => {
    switch (estado) {
      case 'publicado':
        return 'Publicado'
      case 'borrador':
        return 'Borrador'
      case 'eliminado':
        return 'Eliminado'
      default:
        return estado
    }
  }

  const outOfStock = formData.stock <= 0
  const hasImage = imageUrl || formData.imagen

  return (
    <VStack spacing={4} align="stretch" position="sticky" top="20px">
      <VStack align="start" spacing={1}>
        <Text fontSize="sm" fontWeight="semibold" color={labelColor} textTransform="uppercase" letterSpacing="wide">
          Vista Previa
        </Text>
        <Text fontSize="xs" color={textColor}>
          Así se verá en la tienda
        </Text>
      </VStack>

      <Card
        bg={cardBg}
        borderRadius="2xl"
        overflow="hidden"
        border="2px solid"
        borderColor={borderColor}
        boxShadow="xl"
        opacity={formData.estado === 'borrador' ? 0.85 : 1}
      >
        {/* Badge de estado */}
        <Box position="relative">
          <Box position="absolute" top={3} left={3} zIndex={10}>
            <Badge
              colorScheme={getEstadoColorScheme(formData.estado)}
              fontSize="xs"
              fontWeight="bold"
              px={3}
              py={1}
              borderRadius="full"
              boxShadow="md"
            >
              {getEstadoText(formData.estado)}
            </Badge>
          </Box>

          {/* Imagen del producto */}
          {hasImage ? (
            <Image
              src={imageUrl || formData.imagen}
              alt={formData.nombre || 'Preview del producto'}
              w="full"
              h="280px"
              objectFit="cover"
              fallbackSrc="/no-image.png"
              filter={outOfStock ? 'grayscale(100%)' : 'none'}
            />
          ) : (
            <Box
              w="full"
              h="280px"
              bg={noImageBg}
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
              gap={2}
            >
              <Text fontSize="5xl">📦</Text>
              <Text fontSize="sm" color={textColor}>
                Sin imagen
              </Text>
            </Box>
          )}

          {/* Badge de sin stock */}
          {outOfStock && (
            <Box
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              bg="blackAlpha.700"
              color="white"
              px={4}
              py={2}
              borderRadius="full"
              fontWeight="bold"
              fontSize="sm"
              backdropFilter="blur(10px)"
            >
              Sin Stock
            </Box>
          )}
        </Box>

        {/* Contenido de la tarjeta */}
        <CardBody>
          <VStack align="stretch" spacing={3}>
            <VStack align="start" spacing={1}>
              <Heading size="md" color={headingColor} noOfLines={2}>
                {formData.nombre || 'Nombre del producto'}
              </Heading>
              <Text fontSize="sm" color={textColor} noOfLines={3} minH="60px">
                {formData.descripcion || 'Descripción del producto...'}
              </Text>
            </VStack>

            <Divider />

            {/* Información de precio y stock */}
            <HStack justify="space-between" w="full">
              <VStack align="start" spacing={0}>
                <Text fontSize="xs" color={labelColor}>
                  Precio
                </Text>
                <Badge
                  colorScheme="blue"
                  fontSize="lg"
                  px={3}
                  py={1}
                  borderRadius="lg"
                  fontWeight="bold"
                >
                  {formData.precio} pts
                </Badge>
              </VStack>

              <VStack align="end" spacing={0}>
                <Text fontSize="xs" color={labelColor}>
                  Stock
                </Text>
                <Badge
                  colorScheme={formData.stock > 0 ? 'green' : 'red'}
                  fontSize="md"
                  px={3}
                  py={1}
                  borderRadius="lg"
                  fontWeight="bold"
                >
                  {formData.stock}
                </Badge>
              </VStack>
            </HStack>

            {/* Estado de disponibilidad */}
            <Box w="full">
              {outOfStock ? (
                <Badge colorScheme="yellow" w="full" textAlign="center" py={2} borderRadius="md" fontSize="sm">
                  Agotado
                </Badge>
              ) : formData.estado === 'publicado' ? (
                <Badge colorScheme="green" w="full" textAlign="center" py={2} borderRadius="md" fontSize="sm">
                  Disponible para canje
                </Badge>
              ) : (
                <Badge colorScheme="gray" w="full" textAlign="center" py={2} borderRadius="md" fontSize="sm">
                  No visible para usuarios
                </Badge>
              )}
            </Box>
          </VStack>
        </CardBody>
      </Card>

      {/* Información adicional */}
      <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
        <CardBody>
          <VStack spacing={2} align="stretch">
            <Text fontSize="xs" fontWeight="semibold" color={labelColor} textTransform="uppercase">
              Resumen
            </Text>
            <VStack spacing={1} align="stretch" fontSize="xs" color={textColor}>
              <HStack justify="space-between">
                <Text>Longitud nombre:</Text>
                <Text fontWeight="semibold" color={formData.nombre.length > 50 ? 'orange.500' : 'inherit'}>
                  {formData.nombre.length}/100
                </Text>
              </HStack>
              <HStack justify="space-between">
                <Text>Longitud descripción:</Text>
                <Text fontWeight="semibold" color={formData.descripcion.length > 200 ? 'orange.500' : 'inherit'}>
                  {formData.descripcion.length}/500
                </Text>
              </HStack>
              <HStack justify="space-between">
                <Text>Tiene imagen:</Text>
                <Badge colorScheme={hasImage ? 'green' : 'red'} fontSize="xs">
                  {hasImage ? 'Sí' : 'No'}
                </Badge>
              </HStack>
              <HStack justify="space-between">
                <Text>Valor total inventario:</Text>
                <Text fontWeight="semibold">
                  {formData.precio * formData.stock} pts
                </Text>
              </HStack>
            </VStack>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  )
}
