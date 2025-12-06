import { useState } from 'react'
import {
  Container,
  Heading,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Switch,
  Button,
  Box,
  Text,
  SimpleGrid,
  useColorModeValue,
  useToast,
  Spinner,
  Center,
  Checkbox
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { Layout } from '../../../components/Layout'
import { TransparentCard } from '../../../components/TransparentCard'
import { RequireAdmin } from '../../../components/RequireAdmin'
import { useCreatePromocion } from '../../../hooks/usePromocion'
import { useProductos } from '../../../hooks/useProductos'
import { MetadataVisual } from '../../../types'

export default function CrearPromocionPage() {
  const router = useRouter()
  const toast = useToast()

  const { data: productos, isLoading: loadingProductos } = useProductos()
  const createMutation = useCreatePromocion()

  const [formData, setFormData] = useState({
    nombre: '',
    titulo: '',
    descripcion: '',
    tipo: 'producto' as 'producto' | 'categoria' | 'global' | 'por_cantidad',
    tipo_descuento: 'porcentaje' as 'porcentaje' | 'fijo' | '2x1' | '3x2',
    valor_descuento: 0,
    descuento_maximo: null as number | null,
    fecha_inicio: '',
    fecha_fin: '',
    cantidad_usos_maximos: null as number | null,
    usos_por_usuario: 1,
    minimo_puntos: 0,
    requiere_codigo: false,
    codigo: '',
    prioridad: 0,
    estado: 'activo' as 'activo' | 'programado' | 'expirado' | 'inactivo' | 'pausado',
    aplica_acumulacion: false,
    productos_ids: [] as number[],
    metadata_visual: {
      badge: {
        texto: 'OFERTA',
        posicion: 'top-right' as const,
        animacion: 'pulse' as const
      },
      gradiente: ['#FF6B6B', '#FF8E53'] as [string, string],
      badge_color: '#FF0000',
      mostrar_countdown: true,
      mostrar_ahorro: true
    } as MetadataVisual
  })

  const headingColor = useColorModeValue('gray.900', 'white')
  const textColor = useColorModeValue('gray.700', 'gray.300')
  const cardBorderColor = useColorModeValue('gray.200', 'gray.600')
  const cardHoverBorderColor = useColorModeValue('gray.300', 'gray.500')
  const selectedBgColor = useColorModeValue('blue.50', 'blue.900')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.titulo || !formData.nombre || !formData.fecha_inicio || !formData.fecha_fin) {
      toast({
        title: 'Campos requeridos',
        description: 'Por favor completa todos los campos obligatorios',
        status: 'warning',
        duration: 3000,
        isClosable: true
      })
      return
    }

    try {
      await createMutation.mutateAsync({
        ...formData,
        fecha_inicio: new Date(formData.fecha_inicio).toISOString(),
        fecha_fin: new Date(formData.fecha_fin).toISOString()
      })

      toast({
        title: 'Promoción creada',
        status: 'success',
        duration: 3000,
        isClosable: true
      })

      router.push('/admin/promociones')
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'No se pudo crear la promoción',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }
  }

  if (loadingProductos) {
    return (
      <Layout>
        <RequireAdmin>
          <Center minH="60vh">
            <Spinner size="xl" color="blue.500" />
          </Center>
        </RequireAdmin>
      </Layout>
    )
  }

  return (
    <Layout>
      <RequireAdmin>
        <Container maxW="container.lg" py={8}>
          <form onSubmit={handleSubmit}>
            <VStack spacing={6} align="stretch">
              <HStack justify="space-between">
                <Heading size="xl" color={headingColor}>
                  Nueva Promoción
                </Heading>
                <HStack>
                  <Button variant="ghost" onClick={() => router.back()}>
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    colorScheme="blue"
                    isLoading={createMutation.isPending}
                  >
                    Crear
                  </Button>
                </HStack>
              </HStack>

              <TransparentCard p={6}>
                <VStack spacing={6} align="stretch">
                  <Text fontSize="lg" fontWeight="semibold" color={headingColor}>
                    Información Básica
                  </Text>

                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Título Público</FormLabel>
                      <Input
                        value={formData.titulo}
                        onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                        placeholder="Black Friday"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Nombre Interno</FormLabel>
                      <Input
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        placeholder="black-friday-2025"
                      />
                    </FormControl>
                  </SimpleGrid>

                  <FormControl>
                    <FormLabel>Descripción</FormLabel>
                    <Textarea
                      value={formData.descripcion}
                      onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                      rows={3}
                      placeholder="Descuento especial de Black Friday"
                    />
                  </FormControl>

                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Tipo</FormLabel>
                      <Select
                        value={formData.tipo}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            tipo: e.target.value as typeof formData.tipo
                          })
                        }
                      >
                        <option value="producto">Producto</option>
                        <option value="categoria">Categoría</option>
                        <option value="global">Global</option>
                        <option value="por_cantidad">Por Cantidad</option>
                      </Select>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Tipo de Descuento</FormLabel>
                      <Select
                        value={formData.tipo_descuento}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            tipo_descuento: e.target.value as typeof formData.tipo_descuento
                          })
                        }
                      >
                        <option value="porcentaje">Porcentaje</option>
                        <option value="fijo">Puntos Fijos</option>
                        <option value="2x1">2x1</option>
                        <option value="3x2">3x2</option>
                      </Select>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>
                        Valor {formData.tipo_descuento === 'porcentaje' ? '(0-100)' : '(puntos)'}
                      </FormLabel>
                      <NumberInput
                        value={formData.valor_descuento}
                        onChange={(_, val) =>
                          setFormData({ ...formData, valor_descuento: val || 0 })
                        }
                        min={0}
                        max={formData.tipo_descuento === 'porcentaje' ? 100 : undefined}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                  </SimpleGrid>
                </VStack>
              </TransparentCard>

              <TransparentCard p={6}>
                <VStack spacing={6} align="stretch">
                  <Text fontSize="lg" fontWeight="semibold" color={headingColor}>
                    Vigencia y Límites
                  </Text>

                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Fecha Inicio</FormLabel>
                      <Input
                        type="datetime-local"
                        value={formData.fecha_inicio}
                        onChange={(e) =>
                          setFormData({ ...formData, fecha_inicio: e.target.value })
                        }
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Fecha Fin</FormLabel>
                      <Input
                        type="datetime-local"
                        value={formData.fecha_fin}
                        onChange={(e) => setFormData({ ...formData, fecha_fin: e.target.value })}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Usos Máximos Totales</FormLabel>
                      <NumberInput
                        value={formData.cantidad_usos_maximos || ''}
                        onChange={(_, val) =>
                          setFormData({
                            ...formData,
                            cantidad_usos_maximos: val || null
                          })
                        }
                        min={0}
                      >
                        <NumberInputField placeholder="Ilimitado" />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Usos por Usuario</FormLabel>
                      <NumberInput
                        value={formData.usos_por_usuario}
                        onChange={(_, val) =>
                          setFormData({ ...formData, usos_por_usuario: val || 1 })
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
                      <FormLabel>Estado Inicial</FormLabel>
                      <Select
                        value={formData.estado}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            estado: e.target.value as typeof formData.estado
                          })
                        }
                      >
                        <option value="activo">Activo</option>
                        <option value="programado">Programado</option>
                        <option value="pausado">Pausado</option>
                        <option value="inactivo">Inactivo</option>
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Prioridad</FormLabel>
                      <NumberInput
                        value={formData.prioridad}
                        onChange={(_, val) => setFormData({ ...formData, prioridad: val || 0 })}
                        min={0}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                  </SimpleGrid>

                  <FormControl display="flex" alignItems="center">
                    <FormLabel mb={0}>Requiere Código de Cupón</FormLabel>
                    <Switch
                      isChecked={formData.requiere_codigo}
                      onChange={(e) =>
                        setFormData({ ...formData, requiere_codigo: e.target.checked })
                      }
                    />
                  </FormControl>

                  {formData.requiere_codigo && (
                    <FormControl>
                      <FormLabel>Código de Cupón</FormLabel>
                      <Input
                        value={formData.codigo}
                        onChange={(e) =>
                          setFormData({ ...formData, codigo: e.target.value.toUpperCase() })
                        }
                        placeholder="VERANO2024"
                        textTransform="uppercase"
                      />
                    </FormControl>
                  )}
                </VStack>
              </TransparentCard>

              <TransparentCard p={6}>
                <VStack spacing={6} align="stretch">
                  <HStack justify="space-between">
                    <Text fontSize="lg" fontWeight="semibold" color={headingColor}>
                      Productos Aplicables
                    </Text>
                    {productos && productos.length > 0 && (
                      <HStack spacing={2}>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            const allIds = productos.map(p => p.id)
                            setFormData({
                              ...formData,
                              productos_ids: allIds
                            })
                          }}
                        >
                          Seleccionar todos
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              productos_ids: []
                            })
                          }}
                        >
                          Deseleccionar todos
                        </Button>
                      </HStack>
                    )}
                  </HStack>

                  {productos && productos.length > 0 ? (
                    <Box maxH="500px" overflowY="auto">
                      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={3}>
                        {productos.map((producto) => {
                          const isSelected = formData.productos_ids.includes(producto.id)
                          return (
                            <Box
                              key={producto.id}
                              p={3}
                              borderWidth="2px"
                              borderColor={isSelected ? 'blue.500' : cardBorderColor}
                              borderRadius="lg"
                              cursor="pointer"
                              onClick={() => {
                                const isCurrentlySelected = formData.productos_ids.includes(producto.id)
                                setFormData({
                                  ...formData,
                                  productos_ids: isCurrentlySelected
                                    ? formData.productos_ids.filter(id => id !== producto.id)
                                    : [...formData.productos_ids, producto.id]
                                })
                              }}
                              transition="all 0.2s"
                              _hover={{
                                borderColor: isSelected ? 'blue.600' : cardHoverBorderColor,
                                transform: 'translateY(-2px)',
                                boxShadow: 'md'
                              }}
                              bg={isSelected ? selectedBgColor : 'transparent'}
                              position="relative"
                            >
                              <HStack spacing={3}>
                                <Checkbox
                                  isChecked={isSelected}
                                  onChange={() => {}}
                                  pointerEvents="none"
                                />
                                <Box
                                  w="60px"
                                  h="60px"
                                  borderRadius="md"
                                  overflow="hidden"
                                  flexShrink={0}
                                  bg="gray.100"
                                >
                                  {producto.imagen_url || producto.imagen ? (
                                    <img
                                      src={producto.imagen_url || producto.imagen}
                                      alt={producto.nombre}
                                      style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                      }}
                                    />
                                  ) : (
                                    <Center h="100%">
                                      <Text fontSize="xs" color="gray.400">Sin imagen</Text>
                                    </Center>
                                  )}
                                </Box>
                                <VStack align="start" spacing={0} flex={1} overflow="hidden">
                                  <Text fontSize="sm" fontWeight="semibold" noOfLines={1}>
                                    {producto.nombre}
                                  </Text>
                                  <Text fontSize="xs" color={textColor}>
                                    {producto.precio} pts
                                  </Text>
                                  <HStack spacing={2} mt={1}>
                                    {producto.estado !== 'publicado' && (
                                      <Text fontSize="xs" color="orange.500" fontWeight="medium">
                                        {producto.estado}
                                      </Text>
                                    )}
                                    {producto.stock <= 0 && (
                                      <Text fontSize="xs" color="red.500" fontWeight="medium">
                                        Sin stock
                                      </Text>
                                    )}
                                  </HStack>
                                </VStack>
                              </HStack>
                            </Box>
                          )
                        })}
                      </SimpleGrid>
                    </Box>
                  ) : (
                    <Text color={textColor}>No hay productos disponibles</Text>
                  )}

                  {formData.productos_ids.length > 0 && (
                    <Text fontSize="sm" color="blue.500" fontWeight="medium">
                      {formData.productos_ids.length} producto{formData.productos_ids.length !== 1 ? 's' : ''} seleccionado{formData.productos_ids.length !== 1 ? 's' : ''}
                    </Text>
                  )}
                </VStack>
              </TransparentCard>

              <TransparentCard p={6}>
                <VStack spacing={6} align="stretch">
                  <Text fontSize="lg" fontWeight="semibold" color={headingColor}>
                    Configuración Visual
                  </Text>

                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl>
                      <FormLabel>Texto del Badge</FormLabel>
                      <Input
                        value={formData.metadata_visual.badge.texto}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            metadata_visual: {
                              ...formData.metadata_visual,
                              badge: {
                                ...formData.metadata_visual.badge,
                                texto: e.target.value
                              }
                            }
                          })
                        }
                        placeholder="25% OFF"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Posición del Badge</FormLabel>
                      <Select
                        value={formData.metadata_visual.badge.posicion}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            metadata_visual: {
                              ...formData.metadata_visual,
                              badge: {
                                ...formData.metadata_visual.badge,
                                posicion: e.target.value as any
                              }
                            }
                          })
                        }
                      >
                        <option value="top-right">Superior Derecha</option>
                        <option value="top-left">Superior Izquierda</option>
                        <option value="bottom-right">Inferior Derecha</option>
                        <option value="bottom-left">Inferior Izquierda</option>
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Color Gradiente 1</FormLabel>
                      <Input
                        type="color"
                        value={formData.metadata_visual.gradiente[0]}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            metadata_visual: {
                              ...formData.metadata_visual,
                              gradiente: [e.target.value, formData.metadata_visual.gradiente[1]]
                            }
                          })
                        }
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Color Gradiente 2</FormLabel>
                      <Input
                        type="color"
                        value={formData.metadata_visual.gradiente[1]}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            metadata_visual: {
                              ...formData.metadata_visual,
                              gradiente: [formData.metadata_visual.gradiente[0], e.target.value]
                            }
                          })
                        }
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Animación</FormLabel>
                      <Select
                        value={formData.metadata_visual.badge.animacion}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            metadata_visual: {
                              ...formData.metadata_visual,
                              badge: {
                                ...formData.metadata_visual.badge,
                                animacion: e.target.value as any
                              }
                            }
                          })
                        }
                      >
                        <option value="none">Sin animación</option>
                        <option value="pulse">Pulso</option>
                        <option value="bounce">Rebote</option>
                      </Select>
                    </FormControl>
                  </SimpleGrid>

                  <HStack spacing={6}>
                    <FormControl display="flex" alignItems="center">
                      <FormLabel mb={0}>Mostrar Countdown</FormLabel>
                      <Switch
                        isChecked={formData.metadata_visual.mostrar_countdown}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            metadata_visual: {
                              ...formData.metadata_visual,
                              mostrar_countdown: e.target.checked
                            }
                          })
                        }
                      />
                    </FormControl>

                    <FormControl display="flex" alignItems="center">
                      <FormLabel mb={0}>Mostrar Ahorro</FormLabel>
                      <Switch
                        isChecked={formData.metadata_visual.mostrar_ahorro}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            metadata_visual: {
                              ...formData.metadata_visual,
                              mostrar_ahorro: e.target.checked
                            }
                          })
                        }
                      />
                    </FormControl>
                  </HStack>
                </VStack>
              </TransparentCard>

              <HStack justify="flex-end">
                <Button variant="ghost" onClick={() => router.back()}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  colorScheme="blue"
                  isLoading={createMutation.isPending}
                >
                  Crear Promoción
                </Button>
              </HStack>
            </VStack>
          </form>
        </Container>
      </RequireAdmin>
    </Layout>
  )
}
