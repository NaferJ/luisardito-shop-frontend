import { useState } from 'react'
import { useRouter } from 'next/router'
import { Layout } from '../../../components/Layout'
import { RequireAdmin } from '../../../components/RequireAdmin'
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
  useToast
} from '@chakra-ui/react'
import { useCreateProducto } from '../../../hooks/useProductosAdmin'
import { ProductoForm } from '../../../types'
import ImageUpload from '../../../components/ImageUpload'

export default function NuevoProductoPage() {
  const router = useRouter()
  const toast = useToast()
  const createProductoMutation = useCreateProducto()

  const [formData, setFormData] = useState<ProductoForm>({
    nombre: '',
    descripcion: '',
    precio: 100,
    stock: 0,
    imagen: '',
    estado: 'borrador'
  })
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)

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
      const imagenUrlToSend = uploadedImageUrl || formData.imagen || undefined
      const payload: any = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: formData.precio,
        stock: formData.stock,
        estado: formData.estado,
        ...(imagenUrlToSend ? { imagen_url: imagenUrlToSend } : {})
      }

      await createProductoMutation.mutateAsync(payload)

      toast({
        title: 'Producto creado',
        description: `Producto "${formData.nombre}" creado como ${formData.estado}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      router.push('/')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo crear el producto',
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

  return (
    <RequireAdmin>
      <Layout>
        <Container maxW="container.md" py={8}>
          <VStack spacing={6} align="stretch">
            <Heading size="xl">Crear Nuevo Producto</Heading>

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
                        <FormLabel>Stock inicial</FormLabel>
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

                    {/* Subida de imagen a Cloudinary */}
                    <ImageUpload
                      label="Imagen del producto (sube desde tu dispositivo)"
                      value={uploadedImageUrl}
                      onChange={setUploadedImageUrl}
                    />

                    {/* Alternativa: pegar una URL directa */}
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
                      <FormLabel>Estado inicial</FormLabel>
                      <Select
                        value={formData.estado}
                        onChange={(e) => handleInputChange('estado', e.target.value as 'borrador' | 'publicado')}
                      >
                        <option value="borrador">Borrador (no visible para usuarios)</option>
                        <option value="publicado">Publicado (visible en tienda)</option>
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
                        isLoading={createProductoMutation.isPending}
                        loadingText="Creando..."
                        flex="1"
                      >
                        Crear Producto
                      </Button>
                    </HStack>
                  </VStack>
                </form>
              </CardBody>
            </Card>
          </VStack>
        </Container>
      </Layout>
    </RequireAdmin>
  )
}
