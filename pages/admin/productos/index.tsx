import { Layout } from '../../../components/Layout'
import { RequireAdmin } from '../../../components/RequireAdmin'
import { 
  Box, 
  Container, 
  VStack, 
  HStack, 
  Text, 
  Button, 
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Spinner,
  Center,
  Heading,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useToast
} from '@chakra-ui/react'
import { useProductos } from '../../../hooks/useProductos'
import { useDeleteProducto, useUpdateProducto } from '../../../hooks/useProductosAdmin'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import Link from 'next/link'

export default function AdminProductosPage() {
  const { data: productos, isLoading, error } = useProductos()
  const deleteProductoMutation = useDeleteProducto()
  const updateProductoMutation = useUpdateProducto()
  const router = useRouter()
  const toast = useToast()

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [productToDelete, setProductToDelete] = useState<number | null>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)

  const handleDeleteClick = (id: number) => {
    setProductToDelete(id)
    onOpen()
  }

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return

    try {
      // Usar eliminación suave (cambio de estado) en lugar de eliminación física
      await updateProductoMutation.mutateAsync({
        id: productToDelete,
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
      setProductToDelete(null)
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

  if (isLoading) {
    return (
      <RequireAdmin>
        <Layout>
          <Center mt={10}><Spinner size="xl" /></Center>
        </Layout>
      </RequireAdmin>
    )
  }

  if (error) {
    return (
      <RequireAdmin>
        <Layout>
          <Center mt={10}>Error al cargar productos</Center>
        </Layout>
      </RequireAdmin>
    )
  }

  return (
    <RequireAdmin>
      <Layout>
        <Container maxW="container.xl" py={8}>
          <VStack spacing={6} align="stretch">
            {/* Encabezado */}
            <HStack justify="space-between">
              <Heading size="xl">Administración de Productos</Heading>
              <Link href="/admin/productos/nuevo" passHref>
                <Button colorScheme="teal" size="lg">
                  Crear Nuevo Producto
                </Button>
              </Link>
            </HStack>

            {/* Tabla de productos */}
            {!productos || productos.length === 0 ? (
              <Center py={10}>
                <VStack spacing={4}>
                  <Text fontSize="lg" color="gray.500">
                    No hay productos creados
                  </Text>
                  <Link href="/admin/productos/nuevo" passHref>
                    <Button colorScheme="teal">
                      Crear Primer Producto
                    </Button>
                  </Link>
                </VStack>
              </Center>
            ) : (
              <Box overflowX="auto">
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Nombre</Th>
                      <Th>Descripción</Th>
                      <Th>Precio</Th>
                      <Th>Stock</Th>
                      <Th>Estado</Th>
                      <Th>Acciones</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {productos.map((producto) => {
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
                          default: return 'Desconocido'
                        }
                      }

                      const isEliminado = producto.estado === 'eliminado'

                      return (
                        <Tr 
                          key={producto.id} 
                          opacity={producto.estado === 'borrador' ? 0.7 : isEliminado ? 0.5 : 1}
                          bg={isEliminado ? 'red.50' : 'transparent'}
                        >
                          <Td fontWeight="semibold" textDecoration={isEliminado ? 'line-through' : 'none'}>
                            {producto.nombre}
                          </Td>
                          <Td maxW="200px" isTruncated textDecoration={isEliminado ? 'line-through' : 'none'}>
                            {producto.descripcion}
                          </Td>
                          <Td>
                            <Badge colorScheme="teal">
                              {producto.precio} pts
                            </Badge>
                          </Td>
                          <Td>
                            <Badge 
                              colorScheme={producto.stock > 0 ? 'green' : 'red'}
                            >
                              {producto.stock}
                            </Badge>
                          </Td>
                          <Td>
                            <Badge 
                              colorScheme={getEstadoColor(producto.estado)}
                            >
                              {getEstadoText(producto.estado)}
                            </Badge>
                          </Td>
                          <Td>
                            <HStack spacing={2}>
                              <Link href={`/admin/productos/${producto.id}/editar`} passHref>
                                <Button size="sm" colorScheme="blue" variant="outline">
                                  {isEliminado ? 'Recuperar' : 'Editar'}
                                </Button>
                              </Link>
                              {!isEliminado && (
                                <Button 
                                  size="sm" 
                                  colorScheme="red" 
                                  variant="outline"
                                  onClick={() => handleDeleteClick(producto.id)}
                                  isLoading={updateProductoMutation.isPending}
                                >
                                  Eliminar
                                </Button>
                              )}
                            </HStack>
                          </Td>
                        </Tr>
                      )
                    })}
                  </Tbody>
                </Table>
              </Box>
            )}
          </VStack>

          {/* Dialog de confirmación de eliminación */}
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
                  ¿Estás seguro de que quieres eliminar este producto? El producto se moverá a eliminados y no será visible para los usuarios.
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={onClose}>
                    Cancelar
                  </Button>
                  <Button 
                    colorScheme="red" 
                    onClick={handleDeleteConfirm}
                    ml={3}
                    isLoading={updateProductoMutation.isPending}
                  >
                    Eliminar
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </Container>
      </Layout>
    </RequireAdmin>
  )
}
