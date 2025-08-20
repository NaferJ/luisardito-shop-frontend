import { Box, Image, Text, Button, VStack, HStack, Badge, useDisclosure, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, useToast } from '@chakra-ui/react'
import { Producto } from '../types'
import Link from 'next/link'
import { useDeleteProducto, useUpdateProducto } from '../hooks/useProductosAdmin'
import { useRef } from 'react'

interface ProductCardProps {
  producto: Producto
  isAdmin?: boolean
}

export function ProductCard({ producto, isAdmin = false }: ProductCardProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null)
  const toast = useToast()

  const deleteProductoMutation = useDeleteProducto()
  const updateProductoMutation = useUpdateProducto()

  // Solo mostrar productos publicados a usuarios normales
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
        isClosable: true,
      })
      onClose()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el producto',
        status: 'error',
        duration: 3000,
        isClosable: true,
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
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el estado',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'publicado': return 'green'
      case 'borrador': return 'yellow'
      case 'eliminado': return 'red'
      default: return 'gray'
    }
  }

  const getEstadoText = (estado: string) => {
    switch (estado) {
      case 'publicado': return 'Publicado'
      case 'borrador': return 'Borrador'
      case 'eliminado': return 'Eliminado'
      default: return estado
    }
  }

  return (
    <>
      <Box 
        borderWidth="1px" 
        borderRadius="lg" 
        overflow="hidden"
        opacity={producto.estado === 'borrador' ? 0.7 : 1}
        position="relative"
      >
        {/* Badge de estado (solo para admin) */}
        {isAdmin && (
          <Badge
            position="absolute"
            top={2}
            right={2}
            colorScheme={getEstadoColor(producto.estado)}
            zIndex={1}
          >
            {getEstadoText(producto.estado)}
          </Badge>
        )}

        {/* ID del producto (solo para admin) */}
        {isAdmin && (
          <Badge
            position="absolute"
            top={2}
            left={2}
            colorScheme="gray"
            zIndex={1}
          >
            #{producto.id}
          </Badge>
        )}

        {/* Imagen del producto */}
        {producto.imagen && (
          <Image 
            src={producto.imagen} 
            alt={producto.nombre} 
            boxSize="200px" 
            objectFit="cover" 
            w="full"
          />
        )}

        <VStack spacing={2} p={4} align="start">
          <Text fontWeight="bold">{producto.nombre}</Text>
          <Text fontSize="sm" color="gray.600">{producto.descripcion}</Text>
          <HStack justify="space-between" w="full">
            <Text color="teal.600" fontWeight="semibold">{producto.precio} pts</Text>
            <Badge colorScheme={producto.stock > 0 ? 'green' : 'red'}>
              Stock: {producto.stock}
            </Badge>
          </HStack>

          {/* Botones para usuarios normales */}
          {!isAdmin && (
            <Link href={`/productos/${producto.id}`} passHref>
              <Button size="sm" colorScheme="teal" w="full">Ver detalle</Button>
            </Link>
          )}

          {/* Controles de admin */}
          {isAdmin && (
            <VStack spacing={2} w="full">
              <HStack spacing={2} w="full">
                <Link href={`/productos/${producto.id}`} passHref>
                  <Button size="sm" colorScheme="purple" flex="1">Ver</Button>
                </Link>
                <Link href={`/admin/productos/${producto.id}/editar`} passHref>
                  <Button size="sm" colorScheme="blue" flex="1">Editar</Button>
                </Link>
              </HStack>

              <HStack spacing={2} w="full">
                <Button 
                  size="sm" 
                  colorScheme={producto.estado === 'publicado' ? 'yellow' : 'green'}
                  flex="1"
                  onClick={toggleEstado}
                  isLoading={updateProductoMutation.isPending}
                >
                  {producto.estado === 'publicado' ? 'A Borrador' : 'Publicar'}
                </Button>

                <Button 
                  size="sm" 
                  colorScheme="red" 
                  flex="1"
                  onClick={onOpen}
                  isLoading={deleteProductoMutation.isPending}
                >
                  Eliminar
                </Button>
              </HStack>
            </VStack>
          )}
        </VStack>
      </Box>

      {/* Dialog de confirmación */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Eliminar Producto
            </AlertDialogHeader>

            <AlertDialogBody>
              ¿Estás seguro de que quieres eliminar "{producto.nombre}"? 
              El producto se moverá a eliminados y no será visible para los usuarios.
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
