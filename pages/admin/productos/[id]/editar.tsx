import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Layout } from '../../../../components/Layout'
import { RequireAdmin } from '../../../../components/RequireAdmin'
import {
  Container,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  Button,
  HStack,
  Card,
  CardBody,
  useToast,
  Spinner,
  Center,
  Badge,
  Text
} from '@chakra-ui/react'
import { useProducto } from '../../../../hooks/useProducto'
import { useUpdateProducto } from '../../../../hooks/useProductosAdmin'
import { ProductoForm } from '../../../../types'

export default function EditarProductoPage() {
  const router = useRouter()
  const { id } = router.query
  const toast = useToast()

  const { data: producto, isLoading: loadingProducto, error } = useProducto(id as string)
  const updateProductoMutation = useUpdateProducto()

  const [formData, setFormData] = useState<{
    nombre: string
    descripcion: string
    precio: number
    stock: number
    imagen: string
    estado: 'borrador' | 'publicado' | 'eliminado'
  }>({
    nombre: '',
    descripcion: '',
    precio: 100,
    stock: 0,
    imagen: '',
    estado: 'borrador'
  })

  // Cargar datos del producto cuando esté disponible
  useEffect(() => {
    if (producto) {
      setFormData({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        stock: producto.stock,
        imagen: producto.imagen || '',
        estado: producto.estado || 'publicado' // Fallback para productos existentes
      })
    }
  }, [producto])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nombre || !formData.descripcion || formData.precio <= 0) {
      toast({
        title: 'Error',
        description: 'Por favor completa todos los campos requeridos',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    try {
      await updateProductoMutation.mutateAsync({
        id: producto!.id,
        productoData: formData
      })

      toast({
        title: 'Producto actualizado',
        description: `Producto "${formData.nombre}" actualizado correctamente`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      router.push('/')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el producto',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleInputChange = (field: keyof ProductoForm, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'publicado': return 'green'
      case 'borrador': return 'yellow'
      case 'eliminado': return 'red'
      default: return 'gray'
    }
  }

  if (loadingProducto) {
    return (
      <RequireAdmin>
        <Layout>
          <Center mt={10}><Spinner size="xl" /></Center>
        </Layout>
      </RequireAdmin>
    )
  }

  if (error || !producto) {
    return (
      <RequireAdmin>
        <Layout>
          <Center mt={10}>
            <VStack spacing={4}>
              <Text fontSize="lg" color="red.500">
                Producto no encontrado
              </Text>
              <Button onClick={() => router.push('/')}>
                Volver al catálogo
              </Button>
            </VStack>
          </Center>
        </Layout>
      </RequireAdmin>
    )
  }

  return (
    <RequireAdmin>
      <Layout>
        <Container maxW="container.md" py={8}>
          <VStack spacing={6} align="stretch">
            <VStack spacing={2} align="start">
              <HStack>
                <Heading size="xl">Editar Producto</Heading>
                <Badge colorScheme={getEstadoColor(producto.estado)}>
                  {producto.estado?.charAt(0).toUpperCase() + producto.estado?.slice(1) || 'Publicado'}
                </Badge>
              </HStack>
              <Text color="gray.600">
                Creado el {new Date((producto as any).creado).toLocaleDateString('es-ES')}
              </Text>
            </VStack>

            <Card>
              <CardBody>
                <form onSubmit={handleSubmit}>
                  <VStack spacing={4} align="stretch">
                    <FormControl isRequired>
                      <FormLabel>Nombre del producto</FormLabel>
                      <Input
                        value={formData.nombre}
                        onChange={(e) => handleInputChange('nombre', e.target.value)}
                        placeholder="Ej: Camiseta Oficial"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Descripción</FormLabel>
                      <Textarea
                        value={formData.descripcion}
                        onChange={(e) => handleInputChange('descripcion', e.target.value)}
                        placeholder="Descripción del producto..."
                        rows={4}
                      />
                    </FormControl>

                    <HStack spacing={4}>
                      <FormControl isRequired>
                        <FormLabel>Precio en puntos</FormLabel>
                        <NumberInput
                          value={formData.precio}
                          onChange={(valueString, valueNumber) => 
                            handleInputChange('precio', valueNumber || 0)
                          }
                          min={1}
                        >
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Stock disponible</FormLabel>
                        <NumberInput
                          value={formData.stock}
                          onChange={(valueString, valueNumber) => 
                            handleInputChange('stock', valueNumber || 0)
                          }
                          min={0}
                        >
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      </FormControl>
                    </HStack>

                    <FormControl>
                      <FormLabel>URL de imagen (opcional)</FormLabel>
                      <Input
                        value={formData.imagen}
                        onChange={(e) => handleInputChange('imagen', e.target.value)}
                        placeholder="https://example.com/imagen.jpg"
                        type="url"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Estado del producto</FormLabel>
                      <Select
                        value={formData.estado}
                        onChange={(e) => handleInputChange('estado', e.target.value as 'borrador' | 'publicado' | 'eliminado')}
                      >
                        <option value="borrador">Borrador (no visible para usuarios)</option>
                        <option value="publicado">Publicado (visible en tienda)</option>
                        <option value="eliminado">Eliminado (oculto, puede recuperarse)</option>
                      </Select>
                    </FormControl>

                    <HStack spacing={4} pt={4}>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        flex="1"
                      >
                        Cancelar
                      </Button>

                      <Button
                        type="submit"
                        colorScheme="teal"
                        isLoading={updateProductoMutation.isPending}
                        loadingText="Guardando..."
                        flex="1"
                      >
                        Guardar Cambios
                      </Button>
                    </HStack>
                  </VStack>
                </form>
              </CardBody>
            </Card>

            {/* Información adicional */}
            <Card bg="gray.50">
              <CardBody>
                <VStack spacing={2} align="start">
                  <Text fontWeight="semibold" fontSize="sm">Información adicional:</Text>
                  <Text fontSize="xs" color="gray.600">
                    Creado: {new Date((producto as any).creado).toLocaleDateString('es-ES')} | 
                    Actualizado: {new Date((producto as any).actualizado).toLocaleDateString('es-ES')}
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        </Container>
      </Layout>
    </RequireAdmin>
  )
}
