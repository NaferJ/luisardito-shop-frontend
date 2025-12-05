import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/router'
import {
  Box,
  VStack,
  HStack,
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
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  useColorModeValue,
  IconButton,
  Tooltip,
  useToast,
  Grid,
  GridItem,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Switch,
  FormHelperText,
  InputGroup,
  InputLeftAddon,
  Divider,
  Alert,
  AlertIcon,
  AlertDescription,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Badge,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay
} from '@chakra-ui/react'
import { InfoIcon, ChevronRightIcon, ArrowBackIcon, CopyIcon, WarningIcon } from '@chakra-ui/icons'
import { ProductoForm as ProductoFormType, Producto, Canje } from '../types'
import ImageUpload from './ImageUpload'
import { ProductFormPreview } from './ProductFormPreview'
import { generateSlug } from '../utils/slug'

interface ProductFormProps {
  mode: 'create' | 'edit'
  initialData?: Producto
  onSubmit: (data: Record<string, unknown>) => Promise<void>
  isLoading?: boolean
  canjes?: Canje[]
}

export function ProductForm({ mode, initialData, onSubmit, isLoading, canjes }: ProductFormProps) {
  const router = useRouter()
  const toast = useToast()
  const {
    isOpen: isExitDialogOpen,
    onOpen: onExitDialogOpen,
    onClose: onExitDialogClose
  } = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null)

  // Form state
  const [formData, setFormData] = useState<ProductoFormType>({
    nombre: initialData?.nombre || '',
    descripcion: initialData?.descripcion || '',
    precio: initialData?.precio || 100,
    stock: initialData?.stock || 0,
    imagen:
      (initialData as Producto & { imagen_url?: string })?.imagen_url || initialData?.imagen || '',
    estado: initialData?.estado || 'borrador'
  })
  const initialImageUrl = initialData
    ? (initialData as Producto & { imagen_url?: string }).imagen_url || initialData.imagen || null
    : null
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(initialImageUrl)
  const [slug, setSlug] = useState<string>(initialData?.slug || '')
  const [autoSlug, setAutoSlug] = useState<boolean>(true)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isUnlimitedStock, setIsUnlimitedStock] = useState<boolean>(false)

  // Theme colors
  const cardBg = useColorModeValue('white', 'gray.800')
  const cardBorder = useColorModeValue('gray.200', 'gray.600')
  const sectionBg = useColorModeValue('gray.50', 'gray.700')
  const labelColor = useColorModeValue('gray.700', 'gray.300')
  const helpTextColor = useColorModeValue('gray.600', 'gray.400')

  // Update form data when initialData changes (for duplicate functionality)
  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || '',
        descripcion: initialData.descripcion || '',
        precio: initialData.precio || 100,
        stock: initialData.stock || 0,
        imagen:
          (initialData as Producto & { imagen_url?: string })?.imagen_url ||
          initialData?.imagen ||
          '',
        estado: initialData.estado || 'borrador'
      })

      const imageUrl =
        (initialData as Producto & { imagen_url?: string }).imagen_url || initialData.imagen || null
      setUploadedImageUrl(imageUrl)
      setSlug(initialData.slug || '')
    }
  }, [initialData])

  // Auto-generate slug
  useEffect(() => {
    if (autoSlug && formData.nombre) {
      const newSlug = generateSlug(formData.nombre)
      setSlug(newSlug)
    }
  }, [formData.nombre, autoSlug])

  // Track unsaved changes
  useEffect(() => {
    if (mode === 'create') {
      const hasData = Boolean(formData.nombre || formData.descripcion || formData.precio !== 100)
      setHasUnsavedChanges(hasData)
    } else if (initialData) {
      const hasChanges =
        formData.nombre !== initialData.nombre ||
        formData.descripcion !== initialData.descripcion ||
        formData.precio !== initialData.precio ||
        formData.stock !== initialData.stock ||
        formData.estado !== initialData.estado ||
        uploadedImageUrl !==
          ((initialData as Producto & { imagen_url?: string }).imagen_url || initialData.imagen)
      setHasUnsavedChanges(hasChanges)
    }
  }, [formData, uploadedImageUrl, initialData, mode])

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  const handleInputChange = useCallback((field: keyof ProductoFormType, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }))
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, saveAsDraft?: boolean) => {
    e.preventDefault()

    // Validation
    if (!formData.nombre.trim()) {
      toast({
        title: 'Error de validación',
        description: 'El nombre del producto es requerido',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
      return
    }

    if (!formData.descripcion.trim()) {
      toast({
        title: 'Error de validación',
        description: 'La descripción del producto es requerida',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
      return
    }

    if (formData.precio <= 0) {
      toast({
        title: 'Error de validación',
        description: 'El precio debe ser mayor a 0',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
      return
    }

    if (formData.nombre.length > 100) {
      toast({
        title: 'Error de validación',
        description: 'El nombre no puede exceder 100 caracteres',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
      return
    }

    if (formData.descripcion.length > 500) {
      toast({
        title: 'Error de validación',
        description: 'La descripción no puede exceder 500 caracteres',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
      return
    }

    try {
      const imagenUrlToSend = uploadedImageUrl || formData.imagen || undefined
      const estadoFinal = saveAsDraft ? 'borrador' : formData.estado

      const payload: Record<string, unknown> = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        precio: formData.precio,
        stock: isUnlimitedStock ? 999999 : formData.stock,
        estado: estadoFinal,
        ...(imagenUrlToSend ? { imagen_url: imagenUrlToSend } : {}),
        ...(slug ? { slug } : {})
      }

      await onSubmit(payload)
      setHasUnsavedChanges(false)
    } catch (error) {
      // Error handling is done in parent component
      console.error('Form submission error:', error)
    }
  }

  const handleBack = () => {
    if (hasUnsavedChanges) {
      onExitDialogOpen()
    } else {
      router.back()
    }
  }

  const handleDuplicate = () => {
    if (mode === 'edit' && initialData) {
      router.push(`/admin/productos/nuevo?duplicate=${initialData.id}`)
    }
  }

  // Calculate stats
  const totalInventoryValue = formData.precio * formData.stock
  const canjesCount =
    mode === 'edit' ? (initialData as Producto & { canjes_count?: number })?.canjes_count || 0 : 0

  return (
    <>
      <Box w="full">
        {/* Breadcrumbs */}
        <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />} mb={6}>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => router.push('/')}>Productos</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink fontWeight="semibold">
              {mode === 'create' ? 'Crear Nuevo' : 'Editar'}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        {/* Header with actions */}
        <HStack justify="space-between" mb={6} flexWrap="wrap" gap={4}>
          <VStack align="start" spacing={1}>
            <Heading size="xl">
              {mode === 'create' ? 'Crear Nuevo Producto' : 'Editar Producto'}
            </Heading>
            {mode === 'create' && initialData && (
              <HStack>
                <Badge colorScheme="purple" fontSize="sm">
                  Duplicando producto
                </Badge>
                <Text color={helpTextColor} fontSize="sm">
                  Basado en: {initialData.nombre}
                </Text>
              </HStack>
            )}
            {mode === 'edit' && initialData && (
              <Text color={helpTextColor} fontSize="sm">
                Creado:{' '}
                {new Date(
                  (initialData as Producto & { created_at?: string; creado?: string }).created_at ||
                    (initialData as Producto & { created_at?: string; creado?: string }).creado ||
                    initialData.created_at
                ).toLocaleDateString('es-ES')}
                {' • '}
                Actualizado:{' '}
                {new Date(
                  (initialData as Producto & { updated_at?: string; actualizado?: string })
                    .updated_at ||
                    (initialData as Producto & { updated_at?: string; actualizado?: string })
                      .actualizado ||
                    initialData.updated_at
                ).toLocaleDateString('es-ES')}
              </Text>
            )}
          </VStack>

          <HStack>
            {mode === 'edit' && (
              <Tooltip label="Duplicar producto">
                <IconButton
                  aria-label="Duplicar producto"
                  icon={<CopyIcon />}
                  onClick={handleDuplicate}
                  variant="outline"
                />
              </Tooltip>
            )}
            <Button leftIcon={<ArrowBackIcon />} onClick={handleBack} variant="ghost">
              Volver
            </Button>
          </HStack>
        </HStack>

        {/* Unsaved changes indicator */
        {hasUnsavedChanges && (
          <Alert status="info" borderRadius="lg" mb={6}>
            <AlertIcon />
            <AlertDescription>Tienes cambios sin guardar</AlertDescription>
          </Alert>
        )}

        {/* Main form layout */}
        <Grid templateColumns={{ base: '1fr', lg: '1fr 400px' }} gap={6}>
          {/* Left column - Form */}
          <GridItem>
            <form onSubmit={handleSubmit}>
              <VStack spacing={6} align="stretch">
                {/* Basic Information Section */}
                <Card bg={cardBg} borderColor={cardBorder} borderWidth="1px">
                  <CardHeader>
                    <Heading size="md">Información Básica</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <FormControl isRequired>
                        <FormLabel color={labelColor}>
                          Nombre del producto
                          <Tooltip
                            label="Nombre visible para los usuarios. Máximo 100 caracteres."
                            hasArrow
                          >
                            <InfoIcon ml={2} boxSize={3} color="gray.500" />
                          </Tooltip>
                        </FormLabel>
                        <Input
                          value={formData.nombre}
                          onChange={(e) => handleInputChange('nombre', e.target.value)}
                          placeholder="Ej: Camiseta Oficial"
                          maxLength={100}
                        />
                        <FormHelperText color={helpTextColor}>
                          {formData.nombre.length}/100 caracteres
                          {formData.nombre.length > 50 && (
                            <Badge ml={2} colorScheme="orange" fontSize="xs">
                              Largo
                            </Badge>
                          )}
                        </FormHelperText>
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel color={labelColor}>
                          Descripción
                          <Tooltip label="Describe el producto. Máximo 500 caracteres." hasArrow>
                            <InfoIcon ml={2} boxSize={3} color="gray.500" />
                          </Tooltip>
                        </FormLabel>
                        <Textarea
                          value={formData.descripcion}
                          onChange={(e) => handleInputChange('descripcion', e.target.value)}
                          placeholder="Descripción detallada del producto..."
                          rows={5}
                          maxLength={500}
                        />
                        <FormHelperText color={helpTextColor}>
                          {formData.descripcion.length}/500 caracteres
                          {formData.descripcion.length > 200 && (
                            <Badge
                              ml={2}
                              colorScheme={formData.descripcion.length > 400 ? 'orange' : 'yellow'}
                              fontSize="xs"
                            >
                              {formData.descripcion.length > 400 ? 'Casi al límite' : 'Largo'}
                            </Badge>
                          )}
                        </FormHelperText>
                      </FormControl>

                      <FormControl>
                        <FormLabel color={labelColor}>
                          Slug (URL amigable)
                          <Tooltip
                            label="URL personalizada para el producto. Se genera automáticamente del nombre."
                            hasArrow
                          >
                            <InfoIcon ml={2} boxSize={3} color="gray.500" />
                          </Tooltip>
                        </FormLabel>
                        <InputGroup>
                          <InputLeftAddon>/productos/</InputLeftAddon>
                          <Input
                            value={slug}
                            onChange={(e) => {
                              setSlug(e.target.value)
                              setAutoSlug(false)
                            }}
                            placeholder="camiseta-oficial"
                            isDisabled={autoSlug}
                          />
                        </InputGroup>
                        <HStack mt={2}>
                          <Switch
                            size="sm"
                            isChecked={autoSlug}
                            onChange={(e) => setAutoSlug(e.target.checked)}
                          />
                          <Text fontSize="xs" color={helpTextColor}>
                            Generar automáticamente
                          </Text>
                        </HStack>
                      </FormControl>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Pricing & Stock Section */}
                <Card bg={cardBg} borderColor={cardBorder} borderWidth="1px">
                  <CardHeader>
                    <Heading size="md">Precio e Inventario</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <FormControl isRequired>
                        <FormLabel color={labelColor}>
                          Precio en puntos
                          <Tooltip label="Cantidad de puntos que costará el producto" hasArrow>
                            <InfoIcon ml={2} boxSize={3} color="gray.500" />
                          </Tooltip>
                        </FormLabel>
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
                        <FormHelperText color={helpTextColor}>
                          Valor total del inventario: {totalInventoryValue.toLocaleString()} puntos
                        </FormHelperText>
                      </FormControl>

                      <FormControl>
                        <FormLabel color={labelColor}>
                          Stock disponible
                          <Tooltip label="Cantidad de unidades disponibles" hasArrow>
                            <InfoIcon ml={2} boxSize={3} color="gray.500" />
                          </Tooltip>
                        </FormLabel>
                        <NumberInput
                          value={formData.stock}
                          onChange={(valueString, valueNumber) =>
                            handleInputChange('stock', valueNumber || 0)
                          }
                          min={0}
                          max={999999}
                          isDisabled={isUnlimitedStock}
                        >
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                        <HStack mt={2}>
                          <Switch
                            size="sm"
                            isChecked={isUnlimitedStock}
                            onChange={(e) => setIsUnlimitedStock(e.target.checked)}
                          />
                          <Text fontSize="xs" color={helpTextColor}>
                            Stock ilimitado
                          </Text>
                        </HStack>
                        {formData.stock <= 5 && formData.stock > 0 && !isUnlimitedStock && (
                          <HStack mt={2}>
                            <WarningIcon color="orange.500" boxSize={3} />
                            <Text fontSize="xs" color="orange.500">
                              Stock bajo
                            </Text>
                          </HStack>
                        )}
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel color={labelColor}>
                          Estado del producto
                          <Tooltip label="Estado de visibilidad del producto" hasArrow>
                            <InfoIcon ml={2} boxSize={3} color="gray.500" />
                          </Tooltip>
                        </FormLabel>
                        <Select
                          value={formData.estado}
                          onChange={(e) =>
                            handleInputChange(
                              'estado',
                              e.target.value as 'borrador' | 'publicado' | 'eliminado'
                            )
                          }
                        >
                          <option value="borrador">Borrador (no visible para usuarios)</option>
                          <option value="publicado">Publicado (visible en tienda)</option>
                          <option value="eliminado">Eliminado (oculto, puede recuperarse)</option>
                        </Select>
                      </FormControl>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Multimedia Section */}
                <Card bg={cardBg} borderColor={cardBorder} borderWidth="1px">
                  <CardHeader>
                    <Heading size="md">Imagen del Producto</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <ImageUpload
                        label="Subir imagen desde tu dispositivo"
                        value={uploadedImageUrl}
                        onChange={setUploadedImageUrl}
                      />

                      <Divider />

                      <FormControl>
                        <FormLabel color={labelColor}>
                          O pegar URL de imagen
                          <Tooltip label="Alternativa: pega una URL directa de una imagen" hasArrow>
                            <InfoIcon ml={2} boxSize={3} color="gray.500" />
                          </Tooltip>
                        </FormLabel>
                        <Input
                          value={formData.imagen}
                          onChange={(e) => handleInputChange('imagen', e.target.value)}
                          placeholder="https://ejemplo.com/imagen.jpg"
                          type="url"
                        />
                      </FormControl>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Statistics Section (Edit mode only) */}
                {mode === 'edit' && initialData && (
                  <Card bg={cardBg} borderColor={cardBorder} borderWidth="1px">
                    <CardHeader>
                      <Heading size="md">Estadísticas</Heading>
                    </CardHeader>
                    <CardBody>
                      <Grid templateColumns="repeat(auto-fit, minmax(150px, 1fr))" gap={4}>
                        <Stat>
                          <StatLabel>Total Canjeado</StatLabel>
                          <StatNumber>{canjesCount}</StatNumber>
                          <StatHelpText>veces</StatHelpText>
                        </Stat>
                        <Stat>
                          <StatLabel>Valor Inventario</StatLabel>
                          <StatNumber>{totalInventoryValue.toLocaleString()}</StatNumber>
                          <StatHelpText>puntos</StatHelpText>
                        </Stat>
                      </Grid>
                    </CardBody>
                  </Card>
                )}

                {/* Action Buttons */}
                <Card bg={sectionBg} borderColor={cardBorder} borderWidth="1px">
                  <CardBody>
                    <HStack spacing={4} justify="flex-end" flexWrap="wrap">
                      <Button type="button" variant="ghost" onClick={handleBack}>
                        Cancelar
                      </Button>

                      {mode === 'create' && (
                        <Button
                          type="button"
                          variant="outline"
                          colorScheme="yellow"
                          onClick={(e) =>
                            handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>, true)
                          }
                          isLoading={isLoading}
                        >
                          Guardar como Borrador
                        </Button>
                      )}

                      <Button
                        type="submit"
                        colorScheme="teal"
                        isLoading={isLoading}
                        loadingText={mode === 'create' ? 'Creando...' : 'Guardando...'}
                      >
                        {mode === 'create' ? 'Crear Producto' : 'Guardar Cambios'}
                      </Button>
                    </HStack>
                  </CardBody>
                </Card>
              </VStack>
            </form>
          </GridItem>

          {/* Right column - Preview */}
          <GridItem display={{ base: 'none', lg: 'block' }}>
            <ProductFormPreview formData={formData} imageUrl={uploadedImageUrl} />
          </GridItem>
        </Grid>
      </Box>

      {/* Exit confirmation dialog */}
      <AlertDialog
        isOpen={isExitDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={onExitDialogClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Cambios sin guardar
            </AlertDialogHeader>

            <AlertDialogBody>
              Tienes cambios sin guardar. ¿Estás seguro que quieres salir? Se perderán todos los
              cambios.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button colorScheme="blue" onClick={onExitDialogClose}>
                Continuar editando
              </Button>
              <Button colorScheme="red" onClick={() => router.back()} ml={3}>
                Salir sin guardar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
