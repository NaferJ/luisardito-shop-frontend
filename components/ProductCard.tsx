import { useState, useEffect, useRef, useCallback } from 'react'
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
  Icon,
  Skeleton,
  AspectRatio,
} from '@chakra-ui/react'
import { 
  EditIcon, 
  DeleteIcon, 
  CheckCircleIcon 
} from '@chakra-ui/icons'
import { ActionsMenu } from './ActionsMenu'
import { Producto } from '../types'
import { useUpdateProducto } from '../hooks/useProductosAdmin'
// @ts-expect-error ColorThief no tiene tipos definidos
import ColorThief from 'colorthief'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'
import { useAuth } from '../hooks/useAuth'
import { FiArchive, FiUsers, FiTag } from 'react-icons/fi'
import { generateSlug } from '../utils/slug'
import { useColorModeValue } from '@chakra-ui/react'

const MotionBox = motion(Box)

function formatNumber(num: number): string {
  if (num >= 1000000000) return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B'
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  return num.toString()
}

function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

function getTextColor(bgColor: number[]): string {
  return getLuminance(bgColor[0], bgColor[1], bgColor[2]) > 0.5 ? 'gray.800' : 'white'
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
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const descuento = producto.descuento
  const tieneDescuento = descuento?.tieneDescuento && descuento.promocion

  useEffect(() => {
    const imgSrc = producto.imagen_url || producto.imagen
    if (!imgSrc) {
      setImageLoaded(true)
      return
    }

    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.src = imgSrc
    img.onload = () => {
      try {
        const colorThief = new ColorThief()
        const palette = colorThief.getPalette(img, 3)
        setDominantColors(palette)
        setImageLoaded(true)
      } catch (error) {
        console.error('Error extracting colors:', error)
        setImageLoaded(true)
      }
    }
    img.onerror = () => setImageLoaded(true)
  }, [producto.imagen_url, producto.imagen])

  // Estilos base
  const borderColor = useColorModeValue('rgba(0,0,0,0.06)', 'rgba(255,255,255,0.08)')
  const cardBg = useColorModeValue('white', 'gray.900')
  const overlayGradient = useColorModeValue(
    'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 50%, transparent 100%)',
    'linear-gradient(to top, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.85) 50%, transparent 100%)'
  )
  const overlayTextColor = useColorModeValue('white', 'gray.100')
  const overlayTextMutedColor = useColorModeValue('whiteAlpha.700', 'gray.300')
  const overlayIconColor = useColorModeValue('whiteAlpha.800', 'gray.200')
  const modalTextColor = useColorModeValue('gray.600', 'gray.300')
  const cardShadow = useColorModeValue('lg', 'dark-lg')

  const canSeeDrafts = isAdmin || (user && user.rol_id > 2)

  const handleDelete = async () => {
    try {
      await updateProductoMutation.mutateAsync({
        id: producto.id,
        productoData: { estado: 'eliminado' }
      })
      toast({ title: 'Eliminado', description: 'Producto movido a papelera', status: 'success' })
      onClose()
    } catch {
      toast({ title: 'Error', description: 'No se pudo eliminar', status: 'error' })
    }
  }

  const toggleEstado = useCallback(async () => {
    const nuevoEstado = producto.estado === 'publicado' ? 'borrador' : 'publicado'
    try {
      await updateProductoMutation.mutateAsync({ id: producto.id, productoData: { estado: nuevoEstado } })
      toast({ title: 'Actualizado', description: `Estado: ${nuevoEstado}`, status: 'success' })
    } catch {
      toast({ title: 'Error', status: 'error' })
    }
  }, [producto.id, producto.estado, updateProductoMutation, toast])

  if (!canSeeDrafts && producto.estado !== 'publicado') return null

  const outOfStock = producto.stock <= 0
  const accentRGB = dominantColors[0] ? `${dominantColors[0].join(',')}` : '66, 153, 225'
  const accentColor = `rgb(${accentRGB})`

  return (
    <>
      <MotionBox
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={() => router.push(`/productos/${generateSlug(producto.nombre)}`)}
        position="relative"
        borderRadius="3xl"
        overflow="hidden"
        bg={cardBg}
        border="3px solid"
        borderColor={isHovered ? accentColor : borderColor}
        boxShadow={isHovered ? `0 20px 40px -10px rgba(${accentRGB}, 0.4)` : cardShadow}
        cursor="pointer"
        transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
        h="full"
        display="flex"
        flexDirection="column"
      >
        {/* Skeleton de carga */}
        {!imageLoaded && (
          <Box position="absolute" inset={0} zIndex={20}>
            <Skeleton h="full" w="full" borderRadius="3xl" />
          </Box>
        )}

        {/* Badges de Estado */}
        <AnimatePresence>
          {isAdmin && (
            <Box position="absolute" top={4} left={4} zIndex={10}>
              <Badge 
                variant="solid" 
                colorScheme={producto.estado === 'publicado' ? 'green' : 'orange'}
                borderRadius="full" px={3} py={1} fontSize="2xs" fontWeight="black"
                boxShadow="xl"
              >
                {producto.estado.toUpperCase()}
              </Badge>
            </Box>
          )}
        </AnimatePresence>

        {/* Tag de Descuento Pro */}
        {tieneDescuento && (
          <Box
            position="absolute"
            top={4}
            right={isAdmin ? 16 : 4}
            zIndex={10}
            transform={isHovered ? "scale(1.1) rotate(5deg)" : "scale(1) rotate(0deg)"}
            transition="transform 0.3s ease"
          >
            <VStack spacing={0} bg="red.500" color="white" p={2} borderRadius="xl" boxShadow="2xl" minW="50px">
              <Text fontSize="lg" fontWeight="900" lineHeight="1">{descuento.porcentajeDescuento}%</Text>
              <Text fontSize="8px" fontWeight="black">OFF</Text>
            </VStack>
          </Box>
        )}

        {/* Acciones Admin */}
        {isAdmin && (
          <Box position="absolute" top={4} right={4} zIndex={11} onClick={e => e.stopPropagation()}>
            <ActionsMenu
              items={[
                { label: 'Editar', icon: EditIcon, onClick: () => router.push(`/admin/productos/${producto.id}/editar`) },
                { label: producto.estado === 'publicado' ? 'Ocultar' : 'Publicar', icon: CheckCircleIcon, onClick: toggleEstado },
                { label: 'Eliminar', icon: DeleteIcon, onClick: onOpen, colorScheme: 'red' }
              ]}
            />
          </Box>
        )}

        {/* Imagen Principal */}
        <AspectRatio ratio={4/5} w="full">
          <Box overflow="hidden" position="relative">
            <Image
              src={producto.imagen_url || producto.imagen || '/no-image.png'}
              alt={producto.nombre}
              objectFit="cover"
              w="full"
              h="full"
              transition="transform 0.6s ease"
              transform={isHovered ? "scale(1.1)" : "scale(1)"}
              filter={outOfStock ? 'grayscale(100%)' : 'none'}
              opacity={producto.estado === 'borrador' ? 0.6 : 1}
            />
            
            {/* Overlay Gradiente */}
            <Box position="absolute" inset={0} bg={overlayGradient} zIndex={1} />

            {/* Texto y Contenido Overlay */}
            <VStack 
              position="absolute" 
              bottom={0} left={0} right={0} 
              p={6} spacing={3} align="start" 
              zIndex={2}
            >
              <VStack align="start" spacing={1} w="full">
                <Text color={overlayTextColor} fontWeight="900" fontSize="xl" noOfLines={1} letterSpacing="-0.5px">
                  {producto.nombre}
                </Text>
                <Text color={overlayTextMutedColor} fontSize="xs" noOfLines={2} fontWeight="medium">
                  {producto.descripcion}
                </Text>
              </VStack>

              <HStack w="full" justify="space-between" align="flex-end">
                <VStack align="start" spacing={0}>
                  {tieneDescuento && (
                    <Text fontSize="10px" color={overlayTextMutedColor} textDecoration="line-through" fontWeight="bold">
                      {formatNumber(descuento.precioOriginal)} PTS
                    </Text>
                  )}
                  <HStack 
                    bg={accentColor} 
                    color={getTextColor(dominantColors[0] || [66,153,225])} 
                    px={3} py={1} borderRadius="lg" spacing={1.5}
                    boxShadow={`0 8px 16px -4px rgba(${accentRGB}, 0.5)`}
                  >
                    <Icon as={FiTag} boxSize={3} />
                    <Text fontWeight="900" fontSize="sm">
                      {formatNumber(tieneDescuento ? descuento.precioFinal : producto.precio)} 
                      <Text as="span" fontSize="10px" ml={1}>PTS</Text>
                    </Text>
                  </HStack>
                </VStack>

                <HStack spacing={3}>
                  <HStack spacing={1} color={overlayIconColor}>
                    <Icon as={FiArchive} boxSize={3} />
                    <Text fontSize="xs" fontWeight="bold">{producto.stock}</Text>
                  </HStack>
                  {typeof producto.canjes_count === 'number' && (
                    <HStack spacing={1} align="center" color={overlayIconColor}>
                      <Icon as={FiUsers} boxSize={3} />
                      <Text fontSize="xs" fontWeight="bold">{producto.canjes_count}</Text>
                    </HStack>
                  )}
                </HStack>
              </HStack>
            </VStack>
          </Box>
        </AspectRatio>

        {/* Sin Stock Overlay */}
        {outOfStock && (
          <Box 
            position="absolute" inset={0} bg="blackAlpha.600" 
            backdropFilter="blur(4px)" zIndex={5} 
            display="flex" alignItems="center" justifyContent="center"
          >
            <Badge colorScheme="red" variant="solid" px={6} py={2} borderRadius="full" fontSize="sm" fontWeight="black" transform="rotate(-10deg)">
              AGOTADO
            </Badge>
          </Box>
        )}
      </MotionBox>

      {/* Modal de Confirmación */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent borderRadius="3xl">
            <AlertDialogHeader fontWeight="900" fontSize="xl">Eliminar Producto</AlertDialogHeader>
            <AlertDialogBody color={modalTextColor}>
              ¿Confirmas que deseas mover &quot;{producto.nombre}&quot; a la papelera? No será visible para los clientes.
            </AlertDialogBody>
            <AlertDialogFooter gap={3}>
              <Button variant="ghost" borderRadius="xl" ref={cancelRef} onClick={onClose}>
                Cancelar
              </Button>
              <Button colorScheme="red" borderRadius="xl" fontWeight="bold" onClick={handleDelete} isLoading={updateProductoMutation.isPending}>
                Eliminar Definitivamente
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
