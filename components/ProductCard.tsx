import { useState, useEffect, useRef, useMemo } from 'react'
import {
  Box,
  Image,
  Text,
  Button,
  VStack,
  HStack,
  Badge,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useToast,
  useColorModeValue,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Tooltip,
  Icon,
  Skeleton
} from '@chakra-ui/react'
import { SettingsIcon, ViewIcon, EditIcon, DeleteIcon, CheckCircleIcon } from '@chakra-ui/icons'
import { ActionsMenu } from './ActionsMenu'
import { Producto } from '../types'
import { useUpdateProducto } from '../hooks/useProductosAdmin'
// @ts-expect-error ColorThief no tiene tipos definidos
import ColorThief from 'colorthief'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { useAuth } from '../hooks/useAuth'
import { MdPeople } from 'react-icons/md'
import { FiPackage } from 'react-icons/fi'
import { generateSlug } from '../utils/slug'

function formatNumber(num: number): string {
  if (num >= 1000000000) return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B'
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  return num.toString()
}

// Calcular la luminosidad de un color RGB
function getLuminance(r: number, g: number, b: number): number {
  // Normalizar valores RGB de 0-255 a 0-1
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  // Fórmula de luminancia relativa
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

// Determinar si un color es claro u oscuro
function isColorLight(r: number, g: number, b: number): boolean {
  return getLuminance(r, g, b) > 0.5
}

// Obtener el color de texto apropiado según el fondo
function getTextColor(bgColor: number[]): string {
  return isColorLight(bgColor[0], bgColor[1], bgColor[2]) ? 'gray.800' : 'white'
}

interface ProductCardProps {
  producto: Producto
  isAdmin?: boolean
}

export function ProductCard({ producto, isAdmin = false }: ProductCardProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null)
  const toast = useToast()
  const router = useRouter()
  const { user } = useAuth()

  const updateProductoMutation = useUpdateProducto()

  const [dominantColors, setDominantColors] = useState<number[][]>([])
  const [gradientAngle, setGradientAngle] = useState<number>(0)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [bgImageLoaded, setBgImageLoaded] = useState(false)

  const descuento = producto.descuento
  const tieneDescuento = descuento?.tieneDescuento && descuento.promocion

  // Memoizamos el ángulo del gradiente para que sea consistente por producto
  const memoizedGradientAngle = useMemo(() => {
    // Usamos el ID del producto como seed para generar un ángulo consistente
    const seed = producto.id || 0
    return (seed * 137.508) % 360 // Golden angle para mejor distribución
  }, [producto.id])

  useEffect(() => {
    const imgSrc = producto.imagen_url || producto.imagen
    if (!imgSrc) return

    // Precargar imagen en background para extracción de colores
    const img = document.createElement('img')
    img.crossOrigin = 'anonymous'
    img.src = imgSrc
    img.onload = () => {
      setBgImageLoaded(true)
      try {
        const colorThief = new ColorThief()
        const palette = colorThief.getPalette(img, 3)
        setDominantColors(palette)
        setGradientAngle(memoizedGradientAngle)
      } catch (error) {
        console.error('Error extracting colors:', error)
      }
    }
    img.onerror = () => {
      setBgImageLoaded(true) // Marcar como cargada incluso en error
    }
  }, [producto.imagen_url, producto.imagen, memoizedGradientAngle])

  // Theme colors - MUST be called before any conditional returns
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const textColor = useColorModeValue('gray.700', 'gray.300')
  const headingColor = useColorModeValue('gray.900', 'white')
  const hoverBorderColor = useColorModeValue('blue.300', 'blue.600')
  const hoverShadow = useColorModeValue(
    '0 20px 40px rgba(59, 130, 246, 0.2)',
    '0 20px 40px rgba(59, 130, 246, 0.4)'
  )

  // Menu colors
  // const menuBg = useColorModeValue('white', 'gray.700')
  // const menuHoverBg = useColorModeValue('gray.100', 'gray.600')

  // No image placeholder colors
  const noImageBg = useColorModeValue('gray.100', 'gray.700')
  const noImageHoverBg = useColorModeValue('gray.200', 'gray.600')

  // Delete menu colors
  // const deleteHoverBg = useColorModeValue('red.50', 'red.900')

  // Estado colors
  const estadoThemeMap: Record<
    string,
    { light: { bg: string; color: string }; dark: { bg: string; color: string } }
  > = {
    publicado: {
      light: { bg: 'green.100', color: 'green.800' },
      dark: { bg: 'green.700', color: 'green.100' }
    },
    borrador: {
      light: { bg: 'yellow.100', color: 'yellow.800' },
      dark: { bg: 'yellow.700', color: 'yellow.100' }
    },
    eliminado: {
      light: { bg: 'red.100', color: 'red.800' },
      dark: { bg: 'red.700', color: 'red.100' }
    },
    default: {
      light: { bg: 'gray.200', color: 'gray.800' },
      dark: { bg: 'gray.600', color: 'gray.200' }
    }
  }

  const estadoColors = estadoThemeMap[producto.estado] || estadoThemeMap.default
  const estadoBg = useColorModeValue(estadoColors.light.bg, estadoColors.dark.bg)
  const estadoColor = useColorModeValue(estadoColors.light.color, estadoColors.dark.color)

  // Solo mostrar productos publicados a usuarios que no pueden ver borradores
  const canSeeDrafts = isAdmin || (user && user.rol_id > 2)
  if (!canSeeDrafts && producto.estado !== 'publicado') {
    return null
  }

  const handleDelete = async () => {
    try {
      await updateProductoMutation.mutateAsync({
        id: producto.id,
        productoData: { estado: 'eliminado' }
      })

      toast({
        title: 'Producto eliminado',
        description: 'El producto se movió a eliminados',
        status: 'success',
        duration: 3000,
        isClosable: true
      })
      onClose()
    } catch {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el producto',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    }
  }

  const toggleEstado = async () => {
    const nuevoEstado = producto.estado === 'publicado' ? 'borrador' : 'publicado'

    try {
      await updateProductoMutation.mutateAsync({
        id: producto.id,
        productoData: { estado: nuevoEstado }
      })

      toast({
        title: 'Estado actualizado',
        description: `Producto cambiado a ${nuevoEstado}`,
        status: 'success',
        duration: 3000,
        isClosable: true
      })
    } catch {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el estado',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
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

  const outOfStock = producto.stock <= 0
  const canAfford = !!user && user.puntos >= producto.precio

  return (
    <>
      <Box
        as={motion.div}
        bg="transparent"
        borderRadius="2xl"
        overflow="hidden"
        border="2px solid"
        borderColor={borderColor}
        opacity={producto.estado === 'borrador' ? 0.7 : 1}
        position="relative"
        transition="transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease"
        boxShadow="md"
        _hover={{
          transform: 'translateY(-8px)',
          boxShadow: outOfStock ? 'md' : (dominantColors.length > 0 ? `0 20px 40px rgba(${dominantColors[0].join(',')}, 0.3)` : hoverShadow),
          borderColor: outOfStock ? borderColor : (dominantColors.length > 0 ? `rgb(${dominantColors[0].join(',')})` : hoverBorderColor)
        }}
        role="group"
        cursor="pointer"
        onClick={() => router.push(`/productos/${generateSlug(producto.nombre)}`)}
        h="full"
        display="flex"
        flexDirection="column"
        willChange="transform"
        sx={{
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${producto.imagen_url || producto.imagen || '/no-image.png'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: outOfStock ? 'blur(8px) grayscale(100%)' : 'blur(8px)',
            opacity: 0.5,
            zIndex: -2,
            pointerEvents: 'none'
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: dominantColors.length >= 3 ? `linear-gradient(${gradientAngle}deg, rgba(${dominantColors[0].join(',')}, 0.2), rgba(${dominantColors[1].join(',')}, 0.2), rgba(${dominantColors[2].join(',')}, 0.2))` : 'transparent',
            zIndex: -1,
            pointerEvents: 'none'
          }
        }}
      >
        {/* Badge de oferta/descuento */}
        {tieneDescuento && descuento.promocion && (
          <Badge
            position="absolute"
            top={3}
            right={isAdmin ? 14 : 3}
            bgGradient={`linear(135deg, ${descuento.promocion.metadata_visual.gradiente[0]}, ${descuento.promocion.metadata_visual.gradiente[1]})`}
            color="white"
            fontSize="sm"
            fontWeight="bold"
            px={4}
            py={2}
            borderRadius="full"
            boxShadow="lg"
            textTransform="uppercase"
            animation={
              descuento.promocion.metadata_visual.badge.animacion === 'pulse'
                ? 'pulse 2s infinite'
                : descuento.promocion.metadata_visual.badge.animacion === 'bounce'
                ? 'bounce 2s infinite'
                : undefined
            }
            zIndex={10}
          >
            {descuento.promocion.metadata_visual.badge.texto}
          </Badge>
        )}

        {/* Etiqueta flotante de descuento - Estilo Tag */}
        {tieneDescuento && descuento && (
          <Box
            position="absolute"
            top="50%"
            left="-8px"
            transform="translateY(-50%)"
            zIndex={9}
          >
            {/* Tag principal */}
            <Box
              bg="red.500"
              color="white"
              fontSize="2xl"
              fontWeight="black"
              px={4}
              py={3}
              position="relative"
              boxShadow="0 4px 12px rgba(0,0,0,0.3)"
              transform="rotate(-3deg)"
              borderRadius="4px"
              border="2px dashed"
              borderColor="whiteAlpha.600"
              _before={{
                content: '""',
                position: 'absolute',
                bottom: '-8px',
                left: '8px',
                width: 0,
                height: 0,
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: '8px solid',
                borderTopColor: 'red.700'
              }}
            >
              <VStack spacing={0} align="center">
                <Text fontSize="3xl" fontWeight="black" lineHeight="1">
                  {descuento.porcentajeDescuento}%
                </Text>
                <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="wider">
                  OFF
                </Text>
              </VStack>
              
              {/* Agujero del tag */}
              <Box
                position="absolute"
                top="50%"
                right="8px"
                transform="translateY(-50%)"
                width="8px"
                height="8px"
                borderRadius="full"
                bg="white"
                boxShadow="inset 0 2px 4px rgba(0,0,0,0.2)"
              />
            </Box>
          </Box>
        )}

        {/* Badge de estado (solo para admin) */}
        {isAdmin && (
          <Box position="absolute" top={3} left={3} zIndex={10}>
            <Badge
              bg={estadoBg}
              color={estadoColor}
              fontSize="xs"
              fontWeight="bold"
              px={3}
              py={1}
              borderRadius="full"
              boxShadow="md"
            >
              {getEstadoText(producto.estado)}
            </Badge>
          </Box>
        )}

        {/* Menú de admin en esquina superior derecha */}
        {isAdmin && (
          <Box 
            position="absolute" 
            top={3} 
            right={3} 
            zIndex={10}
            onClick={(e) => e.stopPropagation()}
          >
            <ActionsMenu
              items={[
                {
                  label: 'Ver',
                  icon: ViewIcon,
                  onClick: () => router.push(`/productos/${generateSlug(producto.nombre)}`)
                },
                {
                  label: 'Editar',
                  icon: EditIcon,
                  onClick: () => router.push(`/admin/productos/${producto.id}/editar`),
                  colorScheme: 'blue' as const
                },
                {
                  label: producto.estado === 'publicado' ? 'A Borrador' : 'Publicar',
                  icon: CheckCircleIcon,
                  onClick: toggleEstado,
                  colorScheme: producto.estado === 'publicado' ? 'orange' : 'green'
                },
                {
                  isDivider: true,
                  label: '',
                  icon: SettingsIcon,
                  onClick: () => {}
                },
                {
                  label: 'Eliminar',
                  icon: DeleteIcon,
                  onClick: onOpen,
                  colorScheme: 'red' as const
                }
              ]}
            />
          </Box>
        )}

        {/* Imagen del producto */}
        <Box position="relative" overflow="hidden">
          {producto.imagen_url || producto.imagen ? (
            <>
              <Skeleton
                isLoaded={imageLoaded}
                w="full"
                h="220px"
                startColor={dominantColors.length > 0 ? `rgba(${dominantColors[0].join(',')}, 0.1)` : 'gray.200'}
                endColor={dominantColors.length > 1 ? `rgba(${dominantColors[1].join(',')}, 0.2)` : 'gray.300'}
              >
                <Image
                  src={producto.imagen_url || producto.imagen}
                  alt=""
                  w="full"
                  h="220px"
                  objectFit="cover"
                  fallbackSrc="/no-image.png"
                  loading="lazy"
                  transition="transform 0.3s ease, opacity 0.3s ease"
                  filter={outOfStock ? 'grayscale(100%)' : 'none'}
                  willChange="transform"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageLoaded(true)}
                  opacity={imageLoaded ? 1 : 0}
                  _groupHover={{
                    transform: 'scale(1.05)'
                  }}
                />
              </Skeleton>
            </>
          ) : (
            <Box
              w="full"
              h="220px"
              bg={noImageBg}
              display="flex"
              alignItems="center"
              justifyContent="center"
              transition="all 0.3s ease"
              _groupHover={{
                bg: noImageHoverBg
              }}
            >
              <Icon as={FiPackage} boxSize="4xl" />
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
        <VStack align="stretch" p={4} spacing={3} flex={1}>
          <VStack align="start" spacing={1} flex={1}>
            <Text fontWeight="bold" fontSize="lg" color={headingColor} noOfLines={1} w="full">
              {producto.nombre}
            </Text>
            <Text fontSize="sm" color={textColor} noOfLines={2} minH="40px">
              {producto.descripcion}
            </Text>
          </VStack>

          {/* Información de precio y stock */}
          <HStack justify="space-between" w="full">
            <VStack align="start" spacing={1}>
              {tieneDescuento && descuento.promocion ? (
                <>
                  <HStack spacing={2} align="center">
                    <Text
                      fontSize="xs"
                      color={textColor}
                      textDecoration="line-through"
                      opacity={0.6}
                    >
                      {formatNumber(descuento.precioOriginal)} pts
                    </Text>
                    <Badge
                      bg={dominantColors.length > 0 ? `rgb(${dominantColors[0].join(',')})` : undefined}
                      color={dominantColors.length > 0 ? getTextColor(dominantColors[0]) : 'white'}
                      fontSize="md"
                      px={2}
                      py={1}
                      borderRadius="md"
                      fontWeight="bold"
                    >
                      {formatNumber(descuento.precioFinal)} pts
                    </Badge>
                  </HStack>
                  {descuento.promocion.metadata_visual.mostrar_ahorro && (
                    <Text
                      fontSize="2xs"
                      color="green.500"
                      fontWeight="medium"
                    >
                      Ahorras {formatNumber(descuento.precioOriginal - descuento.precioFinal)} pts
                    </Text>
                  )}
                </>
              ) : (
                <Badge
                  bg={dominantColors.length > 0 ? `rgb(${dominantColors[0].join(',')})` : undefined}
                  color={dominantColors.length > 0 ? getTextColor(dominantColors[0]) : 'white'}
                  fontSize="md"
                  px={3}
                  py={1}
                  borderRadius="lg"
                  fontWeight="bold"
                >
                  {formatNumber(producto.precio)} pts
                </Badge>
              )}
            </VStack>
            <HStack spacing={2}>
              <Badge
                colorScheme={producto.stock > 0 ? 'green' : 'red'}
                fontSize="xs"
                px={2}
                py={1}
                borderRadius="md"
                display="flex"
                alignItems="center"
                gap={1}
              >
                <Icon as={FiPackage} boxSize={3} />
                {producto.stock}
              </Badge>
              {typeof (producto as { canjes_count?: number }).canjes_count === 'number' && (
                <Badge
                  colorScheme="purple"
                  fontSize="xs"
                  px={2}
                  py={1}
                  borderRadius="md"
                  display="flex"
                  alignItems="center"
                  gap={1}
                >
                  <Icon as={MdPeople} boxSize={3} />
                  {(producto as { canjes_count?: number }).canjes_count}
                </Badge>
              )}
            </HStack>
          </HStack>

          {/* Indicador de disponibilidad para el usuario */}
          {user && !isAdmin && (
            <Box w="full">
              {outOfStock ? (
                <Badge colorScheme="yellow" w="full" textAlign="center" py={1} borderRadius="md">
                  Agotado
                </Badge>
              ) : !canAfford ? (
                <Badge colorScheme="red" w="full" textAlign="center" py={1} borderRadius="md">
                  Puntos insuficientes ({formatNumber(user.puntos)} pts)
                </Badge>
              ) : (
                <Badge colorScheme="green" w="full" textAlign="center" py={1} borderRadius="md">
                  {tieneDescuento ? 'Disponible con descuento' : 'Disponible'}
                </Badge>
              )}
            </Box>
          )}
        </VStack>
      </Box>

      {/* Dialog de confirmación de eliminación */}
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Eliminar Producto
            </AlertDialogHeader>

            <AlertDialogBody>
              ¿Estás seguro de que quieres eliminar &quot;{producto.nombre}&quot;? El producto se
              moverá a eliminados y no será visible para los usuarios.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancelar
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDelete}
                ml={3}
                isLoading={updateProductoMutation.isPending}
              >
                Eliminar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
