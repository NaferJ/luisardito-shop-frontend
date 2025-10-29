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
import { Producto } from '../types'
import { useUpdateProducto } from '../hooks/useProductosAdmin'
import { useRef } from 'react'
import type { KeyboardEvent } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { useAuth } from '../hooks/useAuth'
import { MdPeople } from 'react-icons/md'

interface ProductCardProps {
  producto: Producto
  isAdmin?: boolean
}

export function ProductCard({ producto, isAdmin = false }: ProductCardProps) {
  // Todos los hooks DEBEN ejecutarse primero, antes de cualquier return condicional
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null)
  const toast = useToast()
  const router = useRouter()
  const { user } = useAuth()

  const updateProductoMutation = useUpdateProducto()

  // UI theme helpers (light/dark aware) - todos los hooks useColorModeValue
  const menuBg = useColorModeValue('rgba(255,255,255,0.92)', 'rgba(17,24,39,0.85)')
  const menuBorder = useColorModeValue('blackAlpha.300', 'whiteAlpha.300')
  const menuColor = useColorModeValue('gray.800', 'gray.100')
  const menuHoverBg = useColorModeValue('gray.100', 'gray.700')
  const overlayGradient = useColorModeValue(
    'linear-gradient(to top, rgba(0,0,0,0.825) 0%, rgba(0,0,0,0.525) 40%, rgba(0,0,0,0) 100%)',
    'linear-gradient(to top, rgba(0,0,0,0.975) 0%, rgba(0,0,0,0.60) 45%, rgba(0,0,0,0) 100%)'
  )
  const gearBg = useColorModeValue('white', 'gray.700')
  const gearColor = useColorModeValue('blue.600', 'cyan.300')
  const gearBorder = useColorModeValue('blackAlpha.200', 'whiteAlpha.300')
  const gearHoverBg = useColorModeValue('gray.50', 'gray.600')
  const cardBorder = useColorModeValue('blackAlpha.200', 'whiteAlpha.300')

  // Solo mostrar productos publicados a usuarios normales (después de todos los hooks)
  if (!isAdmin && producto.estado !== 'publicado') {
    return null
  }

  const handleDelete = async () => {
    try {
      // En lugar de eliminar físicamente, cambiamos el estado a "eliminado"
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

  const getEstadoColor = (estado: string) => {
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

  // Precomputed shadows/borders
  const adminBadgeShadow = useColorModeValue(
    '0 2px 6px rgba(0,0,0,0.12)',
    '0 4px 10px rgba(0,0,0,0.35)'
  )
  const gearShadow = useColorModeValue('0 2px 8px rgba(0,0,0,0.18)', '0 6px 16px rgba(0,0,0,0.45)')
  const menuShadow = useColorModeValue(
    '0 8px 24px rgba(0,0,0,0.18)',
    '0 12px 32px rgba(0,0,0,0.65)'
  )

  // Affordance/stock based hover border colors (light/dark aware)
  const affordGreen = useColorModeValue('green.400', 'green.300')
  const outOfStockYellow = useColorModeValue('yellow.400', 'yellow.300')
  const notEnoughRed = useColorModeValue('red.400', 'red.300')

  const outOfStock = producto.stock <= 0
  const canAfford = !!user && user.puntos >= producto.precio

  const derivedHoverBorder = outOfStock
    ? outOfStockYellow
    : !!user
      ? canAfford
        ? affordGreen
        : notEnoughRed
      : undefined

  const ringColorVar = derivedHoverBorder
    ? `var(--chakra-colors-${derivedHoverBorder.replace('.', '-')})`
    : undefined

  const hoverStyles = {
    transform: 'translateY(-2px)',
    boxShadow: ringColorVar ? `var(--chakra-shadows-md), 0 0 0 3px ${ringColorVar}` : 'md'
  }

  const estadoThemeMap: Record<
    string,
    {
      light: { bg: string; color: string; border: string }
      dark: { bg: string; color: string; border: string }
    }
  > = {
    publicado: {
      light: { bg: 'green.50', color: 'green.700', border: 'green.200' },
      dark: { bg: 'green.700', color: 'green.50', border: 'green.600' }
    },
    borrador: {
      light: { bg: 'yellow.50', color: 'yellow.800', border: 'yellow.200' },
      dark: { bg: 'yellow.700', color: 'gray.900', border: 'yellow.600' }
    },
    eliminado: {
      light: { bg: 'red.50', color: 'red.700', border: 'red.200' },
      dark: { bg: 'red.700', color: 'red.50', border: 'red.600' }
    },
    default: {
      light: { bg: 'gray.100', color: 'gray.700', border: 'gray.300' },
      dark: { bg: 'gray.700', color: 'gray.100', border: 'gray.600' }
    }
  }
  const estadoColors = estadoThemeMap[producto.estado] || estadoThemeMap.default
  const estadoBg = useColorModeValue(estadoColors.light.bg, estadoColors.dark.bg)
  const estadoColor = useColorModeValue(estadoColors.light.color, estadoColors.dark.color)
  const estadoBorder = useColorModeValue(estadoColors.light.border, estadoColors.dark.border)
  const deleteColor = useColorModeValue('red.600', 'red.300')
  const deleteHoverBg = useColorModeValue('red.50', 'red.700')
  const deleteHoverColor = useColorModeValue('red.700', 'red.200')

  return (
    <>
      <Box
        as={motion.div}
        borderWidth="1px"
        borderColor={cardBorder}
        bg="bg.canvas"
        borderRadius="2xl"
        overflow="hidden"
        opacity={producto.estado === 'borrador' ? 0.7 : 1}
        position="relative"
        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        _hover={{
          ...hoverStyles,
          transform: 'translateY(-8px) scale(1.02)',
          boxShadow: useColorModeValue(
            '0 20px 40px rgba(0,0,0,0.15)',
            '0 20px 40px rgba(0,0,0,0.4)'
          ),
          borderColor: useColorModeValue('blue.200', 'blue.600'),
        }}
        role="group"
        cursor="pointer"
        onClick={() => router.push(`/productos/${producto.id}`)}
        onKeyDown={(e: any) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            router.push(`/productos/${producto.id}`)
          }
        }}
        tabIndex={0}
        boxShadow={useColorModeValue(
          '0 4px 12px rgba(0,0,0,0.1)',
          '0 4px 12px rgba(0,0,0,0.3)'
        )}
      >
        {/* Badge de estado (solo para admin) */}
        {isAdmin && (
          <Box position="absolute" top={2} left={2} zIndex={2}>
            <Box
              as="span"
              px={3}
              py={1.5}
              borderRadius="xl"
              fontSize="xs"
              fontWeight="bold"
              bg={estadoBg}
              color={estadoColor}
              border="1px solid"
              borderColor={estadoBorder}
              boxShadow="0 4px 12px rgba(0,0,0,0.2)"
              backdropFilter="blur(8px)"
            >
              {getEstadoText(producto.estado)}
            </Box>
          </Box>
        )}

        {/* Imagen del producto (ocupa toda la tarjeta) */}
        {producto.imagen_url || producto.imagen ? (
          <Image
            src={producto.imagen_url || producto.imagen}
            alt={producto.nombre}
            w="full"
            h="260px"
            objectFit="cover"
            fallbackSrc="/no-image.png"
            transition="all 0.3s ease"
            sx={{
              filter: outOfStock ? 'grayscale(100%)' : 'none',
            }}
            _groupHover={{
              transform: 'scale(1.05)',
            }}
          />
        ) : (
          <Box
            w="full"
            h="260px"
            bg={useColorModeValue('gray.100', 'gray.700')}
            display="flex"
            alignItems="center"
            justifyContent="center"
            transition="all 0.3s ease"
            _groupHover={{
              bg: useColorModeValue('gray.200', 'gray.600'),
            }}
          >
            <Text color="gray.500" fontSize="sm" fontWeight="medium">
              📦 Sin imagen
            </Text>
          </Box>
        )}

        {/* Overlay con info y acciones al hover */}
        <Box
          position="absolute"
          inset={0}
          bgImage={overlayGradient}
          bgRepeat="no-repeat"
          bgSize="cover"
          color="white"
          opacity={0}
          transition="opacity 0.45s ease"
          _groupHover={{ opacity: 1 }}
          _focusWithin={{ opacity: 1 }}
          display="flex"
          flexDirection="column"
          justifyContent="flex-end"
          p={3}
        >
          {/* Esquina superior derecha: menú de configuración (solo admin) */}
          {isAdmin && (
            <Box position="absolute" top={2} right={2}>
              <Menu isLazy placement="bottom-end">
                <Tooltip label="Opciones" hasArrow>
                  <MenuButton
                    as={IconButton}
                    aria-label="Opciones de producto"
                    icon={<SettingsIcon boxSize={5} />}
                    variant="solid"
                    bg={gearBg}
                    color={gearColor}
                    size="sm"
                    borderRadius="xl"
                    border="1px solid"
                    borderColor={gearBorder}
                    boxShadow="0 4px 12px rgba(0,0,0,0.2)"
                    backdropFilter="blur(8px)"
                    _hover={{
                      bg: gearHoverBg,
                      transform: 'scale(1.1)',
                      boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)'
                    }}
                    _active={{ bg: gearHoverBg, transform: 'scale(1.05)' }}
                    _expanded={{ bg: gearHoverBg }}
                    onClick={(e) => e.stopPropagation()}
                    transition="all 0.2s ease"
                  />
                </Tooltip>
                <MenuList
                  bg={menuBg}
                  color={menuColor}
                  borderColor={menuBorder}
                  boxShadow="0 12px 28px rgba(0,0,0,0.25)"
                  borderRadius="xl"
                  sx={{ backdropFilter: 'saturate(160%) blur(12px)' }}
                  onClick={(e) => e.stopPropagation()}
                  p={2}
                  minW="180px"
                >
                  <MenuItem
                    icon={<ViewIcon />}
                    bg="transparent"
                    _hover={{ bg: menuHoverBg }}
                    _focus={{ bg: menuHoverBg }}
                    onClick={() => router.push(`/productos/${producto.id}`)}
                    borderRadius="lg"
                    whiteSpace="nowrap"
                  >
                    Ver
                  </MenuItem>
                  <MenuItem
                    icon={<EditIcon />}
                    bg="transparent"
                    _hover={{ bg: menuHoverBg }}
                    _focus={{ bg: menuHoverBg }}
                    onClick={() => router.push(`/admin/productos/${producto.id}/editar`)}
                    borderRadius="lg"
                    whiteSpace="nowrap"
                  >
                    Editar
                  </MenuItem>
                  <MenuItem
                    icon={<CheckCircleIcon />}
                    bg="transparent"
                    _hover={{ bg: menuHoverBg }}
                    _focus={{ bg: menuHoverBg }}
                    onClick={toggleEstado}
                    borderRadius="lg"
                    whiteSpace="nowrap"
                  >
                    {producto.estado === 'publicado' ? 'A Borrador' : 'Publicar'}
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem
                    icon={<DeleteIcon />}
                    onClick={onOpen}
                    bg="transparent"
                    color={deleteColor}
                    _hover={{ bg: deleteHoverBg, color: deleteHoverColor }}
                    _focus={{ bg: deleteHoverBg }}
                    borderRadius="lg"
                    whiteSpace="nowrap"
                  >
                    Eliminar
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>
          )}

          {/* Contenido inferior: título, descripción y acciones */}
          <VStack align="start" spacing={2}>
            <Text fontWeight="bold" fontSize="lg" noOfLines={1}>
              {producto.nombre}
            </Text>
            <Text fontSize="sm" noOfLines={2} opacity={0.9}>
              {producto.descripcion}
            </Text>
            <HStack justify="space-between" w="full">
              <HStack spacing={2}>
                <Badge
                  colorScheme="blue"
                  fontSize="sm"
                  px={3}
                  py={1}
                  borderRadius="xl"
                  fontWeight="bold"
                >
                  {producto.precio} pts
                </Badge>
                <Badge
                  colorScheme={producto.stock > 0 ? 'green' : 'red'}
                  fontSize="xs"
                  px={2}
                  py={1}
                  borderRadius="lg"
                >
                  Stock: {producto.stock}
                </Badge>
                {typeof (producto as any).canjes_count === 'number' && (
                  <Badge
                    colorScheme="purple"
                    fontSize="xs"
                    px={2}
                    py={1}
                    borderRadius="lg"
                    display="inline-flex"
                    alignItems="center"
                    gap={1}
                  >
                    <Icon as={MdPeople} boxSize={3.5} />
                    {(producto as any).canjes_count}
                  </Badge>
                )}
              </HStack>
            </HStack>
          </VStack>
        </Box>
      </Box>

      {/* Dialog de confirmación */}
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
              <Button colorScheme="blackAlpha" ref={cancelRef} onClick={onClose}>
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
