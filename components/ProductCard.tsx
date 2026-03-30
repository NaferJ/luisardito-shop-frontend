import { useState, useRef, useCallback } from 'react'
import {
  Box,
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
  useColorModeValue,
} from '@chakra-ui/react'
import NextImage from 'next/image'
import {
  EditIcon,
  DeleteIcon,
  CheckCircleIcon
} from '@chakra-ui/icons'
import { ActionsMenu } from './ActionsMenu'
import { Producto } from '../types'
import { useUpdateProducto } from '../hooks/useProductosAdmin'
import { useRouter } from 'next/router'
import { useAuth } from '../hooks/useAuth'
import { FiArchive, FiUsers, FiTag } from 'react-icons/fi'
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
  const [imageLoaded, setImageLoaded] = useState(false)
  const descuento = producto.descuento
  const tieneDescuento = descuento?.tieneDescuento && descuento.promocion
  // ── Tokens de color ──
  const cardBg = useColorModeValue('white', 'gray.900')
  const cardBorderColor = useColorModeValue('rgba(0,0,0,0.08)', 'rgba(255,255,255,0.06)')
  const cardHoverBorderColor = useColorModeValue('rgba(0,0,0,0.15)', 'rgba(255,255,255,0.15)')
  const overlayGradient = useColorModeValue(
    'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.08) 70%, transparent 100%)',
    'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.65) 40%, rgba(0,0,0,0.15) 70%, transparent 100%)'
  )
  const defaultShadow = useColorModeValue(
    '0 2px 8px -2px rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.06)',
    '0 2px 8px -2px rgba(0,0,0,0.4), 0 1px 2px -1px rgba(0,0,0,0.3)'
  )
  const hoverShadow = useColorModeValue(
    '0 20px 40px -12px rgba(0,0,0,0.15), 0 8px 16px -8px rgba(0,0,0,0.1)',
    '0 20px 40px -12px rgba(0,0,0,0.6), 0 8px 16px -8px rgba(0,0,0,0.4)'
  )
  const modalTextColor = useColorModeValue('gray.600', 'gray.300')
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
  const imgSrc = producto.imagen_url || producto.imagen || '/no-image.png'
  return (
    <>
      {/*
        ARQUITECTURA ANTI-ARTEFACTO:
        - OUTER Box: maneja transform en hover. SIN overflow:hidden, SIN border-radius clipping.
        - INNER Box: maneja overflow:hidden + border-radius. SIN transform.
        Esto evita el bug de Chromium donde overflow:hidden + border-radius + transform
        causan lineas negras por renderizado sub-pixel.
      */}
      <Box
        onClick={() => router.push(`/productos/${generateSlug(producto.nombre)}`)}
        cursor="pointer"
        h="full"
        role="group"
        transition="transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.35s cubic-bezier(0.4, 0, 0.2, 1)"
        _hover={{
          transform: 'translateY(-6px) scale(1.01)',
          boxShadow: hoverShadow,
        }}
        boxShadow={defaultShadow}
        borderRadius="2xl"
      >
        {/* INNER: capa de clipping visual */}
        <Box
          position="relative"
          borderRadius="2xl"
          overflow="hidden"
          bg={cardBg}
          border="1.5px solid"
          borderColor={cardBorderColor}
          h="full"
          display="flex"
          flexDirection="column"
          transition="border-color 0.3s ease"
          _groupHover={{ borderColor: cardHoverBorderColor }}
        >
          {/* Skeleton mientras carga la imagen */}
          {!imageLoaded && (
            <Box position="absolute" inset={0} zIndex={20}>
              <Skeleton h="full" w="full" borderRadius="2xl" speed={1.2} />
            </Box>
          )}
          {/* Badge de Estado (admin) */}
          {isAdmin && (
            <Box position="absolute" top={3} left={3} zIndex={10}>
              <Badge
                variant="solid"
                colorScheme={producto.estado === 'publicado' ? 'green' : 'orange'}
                borderRadius="full" px={2.5} py={0.5} fontSize="2xs" fontWeight="black"
                boxShadow="lg"
                textTransform="uppercase"
              >
                {producto.estado}
              </Badge>
            </Box>
          )}
          {/* Tag de Descuento */}
          {tieneDescuento && (
            <Box
              position="absolute"
              top={3}
              right={isAdmin ? 14 : 3}
              zIndex={10}
              transition="transform 0.3s ease"
              _groupHover={{ transform: 'scale(1.05) rotate(2deg)' }}
            >
              <VStack
                spacing={0}
                bg="red.500"
                color="white"
                px={2} py={1.5}
                borderRadius="lg"
                boxShadow="lg"
                minW="44px"
              >
                <Text fontSize="md" fontWeight="900" lineHeight="1">{descuento?.porcentajeDescuento}%</Text>
                <Text fontSize="7px" fontWeight="black" letterSpacing="0.5px">OFF</Text>
              </VStack>
            </Box>
          )}
          {/* Acciones Admin */}
          {isAdmin && (
            <Box position="absolute" top={3} right={3} zIndex={11} onClick={e => e.stopPropagation()}>
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
          <AspectRatio ratio={4 / 5} w="full">
            <Box position="relative">
              {/* Wrapper de zoom: se escala en hover, contenido se recorta por el padre */}
              <Box
                position="absolute"
                inset={0}
                transition="transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
                _groupHover={outOfStock ? undefined : { transform: 'scale(1.05)' }}
              >
                <NextImage
                  src={imgSrc}
                  alt={producto.nombre}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  style={{
                    objectFit: 'cover',
                    filter: outOfStock ? 'grayscale(100%)' : 'none',
                    opacity: producto.estado === 'borrador' ? 0.6 : 1,
                  }}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageLoaded(true)}
                  loading="lazy"
                  placeholder="empty"
                />
              </Box>
              {/* Overlay Gradiente */}
              <Box position="absolute" inset={0} bg={overlayGradient} zIndex={1} />
              {/* Contenido sobre la imagen */}
              <VStack
                position="absolute"
                bottom={0} left={0} right={0}
                p={4} spacing={2} align="start"
                zIndex={2}
              >
                <VStack align="start" spacing={0.5} w="full">
                  <Text
                    color="white"
                    fontWeight="800"
                    fontSize={{ base: 'md', md: 'lg' }}
                    noOfLines={1}
                    letterSpacing="-0.3px"
                    textShadow="0 1px 3px rgba(0,0,0,0.3)"
                  >
                    {producto.nombre}
                  </Text>
                  <Text
                    color="whiteAlpha.800"
                    fontSize="xs"
                    noOfLines={2}
                    fontWeight="medium"
                    lineHeight="1.4"
                  >
                    {producto.descripcion}
                  </Text>
                </VStack>
                <HStack w="full" justify="space-between" align="flex-end">
                  <VStack align="start" spacing={0.5}>
                    {tieneDescuento && (
                      <Text
                        fontSize="10px"
                        color="whiteAlpha.700"
                        textDecoration="line-through"
                        fontWeight="bold"
                      >
                        {formatNumber(descuento?.precioOriginal ?? producto.precio)} PTS
                      </Text>
                    )}
                    {/* Badge de Precio — Solid Glass */}
                    <HStack
                      bg="rgba(0,0,0,0.45)"
                      color="white"
                      px={3} py={1}
                      borderRadius="lg"
                      spacing={1.5}
                      border="1px solid rgba(255,255,255,0.12)"
                      boxShadow="0 2px 8px rgba(0,0,0,0.2)"
                    >
                      <Icon as={FiTag} boxSize={3} />
                      <Text fontWeight="900" fontSize="sm">
                        {formatNumber(tieneDescuento ? (descuento?.precioFinal ?? producto.precio) : producto.precio)}
                        <Text as="span" fontSize="10px" ml={1} fontWeight="700" opacity={0.85}>PTS</Text>
                      </Text>
                    </HStack>
                  </VStack>
                  <HStack spacing={3}>
                    <HStack spacing={1} color="whiteAlpha.800">
                      <Icon as={FiArchive} boxSize={3} />
                      <Text fontSize="xs" fontWeight="bold">{producto.stock}</Text>
                    </HStack>
                    {typeof producto.canjes_count === 'number' && (
                      <HStack spacing={1} align="center" color="whiteAlpha.800">
                        <Icon as={FiUsers} boxSize={3} />
                        <Text fontSize="xs" fontWeight="bold">{producto.canjes_count}</Text>
                      </HStack>
                    )}
                  </HStack>
                </HStack>
              </VStack>
            </Box>
          </AspectRatio>
          {/* Sin Stock Overlay — SIN backdropFilter */}
          {outOfStock && (
            <Box
              position="absolute" inset={0} bg="rgba(0,0,0,0.65)"
              zIndex={5}
              display="flex" alignItems="center" justifyContent="center"
            >
              <Badge
                colorScheme="red" variant="solid"
                px={6} py={2} borderRadius="full"
                fontSize="sm" fontWeight="black"
                transform="rotate(-10deg)"
              >
                AGOTADO
              </Badge>
            </Box>
          )}
        </Box>
      </Box>
      {/* Modal de Confirmación */}
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent borderRadius="2xl">
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
/**
 * Skeleton que replica la forma de ProductCard.
 * Misma estructura de dos capas: outer sin clip, inner con clip.
 */
export function ProductCardSkeleton() {
  const cardBg = useColorModeValue('white', 'gray.900')
  const borderColor = useColorModeValue('rgba(0,0,0,0.08)', 'rgba(255,255,255,0.06)')
  const shimmerBase = useColorModeValue('gray.100', 'gray.800')
  const shimmerHighlight = useColorModeValue('gray.200', 'gray.700')
  const defaultShadow = useColorModeValue(
    '0 2px 8px -2px rgba(0,0,0,0.08)',
    '0 2px 8px -2px rgba(0,0,0,0.4)'
  )
  return (
    <Box borderRadius="2xl" boxShadow={defaultShadow} h="full">
      <Box
        borderRadius="2xl"
        overflow="hidden"
        bg={cardBg}
        border="1.5px solid"
        borderColor={borderColor}
        h="full"
        display="flex"
        flexDirection="column"
      >
        <AspectRatio ratio={4 / 5} w="full">
          <Box position="relative">
            <Skeleton
              startColor={shimmerBase}
              endColor={shimmerHighlight}
              h="full"
              w="full"
              speed={1.2}
              borderRadius="0"
            />
            <Box position="absolute" bottom={0} left={0} right={0} p={4} zIndex={2}>
              <VStack align="start" spacing={2} w="full">
                <Skeleton startColor="whiteAlpha.200" endColor="whiteAlpha.100" h="18px" w="70%" borderRadius="md" speed={1.4} />
                <Skeleton startColor="whiteAlpha.200" endColor="whiteAlpha.100" h="10px" w="90%" borderRadius="sm" speed={1.4} />
                <Skeleton startColor="whiteAlpha.200" endColor="whiteAlpha.100" h="10px" w="55%" borderRadius="sm" speed={1.4} />
                <HStack w="full" justify="space-between" align="flex-end" pt={1}>
                  <Skeleton startColor="whiteAlpha.200" endColor="whiteAlpha.100" h="28px" w="85px" borderRadius="lg" speed={1.4} />
                  <HStack spacing={3}>
                    <Skeleton startColor="whiteAlpha.200" endColor="whiteAlpha.100" h="12px" w="28px" borderRadius="sm" speed={1.4} />
                    <Skeleton startColor="whiteAlpha.200" endColor="whiteAlpha.100" h="12px" w="28px" borderRadius="sm" speed={1.4} />
                  </HStack>
                </HStack>
              </VStack>
            </Box>
          </Box>
        </AspectRatio>
      </Box>
    </Box>
  )
}
