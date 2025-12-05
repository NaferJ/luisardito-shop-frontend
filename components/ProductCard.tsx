import { useState, useEffect, useRef } from 'react'
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
  Icon
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

  useEffect(() => {
    const imgSrc = producto.imagen_url || producto.imagen
    if (!imgSrc) return

    const img = document.createElement('img')
    img.crossOrigin = 'anonymous'
    img.src = imgSrc
    img.onload = () => {
      try {
        const colorThief = new ColorThief()
        const palette = colorThief.getPalette(img, 3) // 3 colores para mejor degradado
        setDominantColors(palette)
        setGradientAngle(Math.random() * 360) // Ángulo aleatorio
      } catch (error) {
        console.error('Error extracting colors:', error)
      }
    }
  }, [producto.imagen_url, producto.imagen])

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
            <Image
              src={producto.imagen_url || producto.imagen}
              alt={producto.nombre}
              w="full"
              h="220px"
              objectFit="cover"
              fallbackSrc="/no-image.png"
              transition="transform 0.3s ease"
              filter={outOfStock ? 'grayscale(100%)' : 'none'}
              willChange="transform"
              _groupHover={{
                transform: 'scale(1.05)'
              }}
            />
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
            <Badge
              bg={dominantColors.length > 0 ? `rgb(${dominantColors[0].join(',')})` : undefined}
              color="white"
              fontSize="md"
              px={3}
              py={1}
              borderRadius="lg"
              fontWeight="bold"
            >
              {formatNumber(producto.precio)} pts
            </Badge>
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
                  Puntos insuficientes
                </Badge>
              ) : (
                <Badge colorScheme="green" w="full" textAlign="center" py={1} borderRadius="md">
                  Disponible
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
