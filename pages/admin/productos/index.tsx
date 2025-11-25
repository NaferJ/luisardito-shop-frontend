import { Layout } from '../../../components/Layout'
import { RequireAdmin } from '../../../components/RequireAdmin'
import {
  Box,
  Container,
  Heading,
  Button,
  Badge,
  HStack,
  VStack,
  Spinner,
  Center,
  useDisclosure,
  useToast,
  Text,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorModeValue,
  Portal,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Flex,
  SimpleGrid,
  Alert,
  AlertIcon,
  Image,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Tooltip
} from '@chakra-ui/react'
import { useState, useMemo, useRef } from 'react'
import { useRouter } from 'next/router'
import { useProductos } from '../../../hooks/useProductos'
import { useDeleteProducto, useUpdateProducto } from '../../../hooks/useProductosAdmin'
import {
  SettingsIcon,
  SearchIcon,
  EditIcon,
  ViewIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  AddIcon,
  DeleteIcon
} from '@chakra-ui/icons'
import {
  MdShoppingBag,
  MdCheckCircle,
  MdDrafts,
  MdDelete,
  MdInventory,
  MdAttachMoney
} from 'react-icons/md'
import NextLink from 'next/link'
import Head from 'next/head'

export default function AdminProductosPage() {
  const { data: productos, isLoading, error } = useProductos()
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()

  const [productToDelete, setProductToDelete] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<string>('id')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [pageSize, setPageSize] = useState(20)
  const [currentPage, setCurrentPage] = useState(1)
  const [filterEstado, setFilterEstado] = useState<string>('todos')

  const deleteProductoMutation = useDeleteProducto()
  const updateProductoMutation = useUpdateProducto()
  const toast = useToast()
  const router = useRouter()
  const cancelRef = useRef<HTMLButtonElement>(null)

  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const hoverBg = useColorModeValue('gray.50', 'gray.700')
  const textColor = useColorModeValue('gray.800', 'white')
  const mutedColor = useColorModeValue('gray.600', 'gray.400')
  const statBg = useColorModeValue('gray.50', 'gray.700')

  const handleDeleteClick = (id: number) => {
    setProductToDelete(id)
    onDeleteOpen()
  }

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return

    try {
      await updateProductoMutation.mutateAsync({
        id: productToDelete,
        productoData: { estado: 'eliminado' }
      })

      toast({
        title: 'Eliminado',
        description: 'El producto ha sido eliminado',
        status: 'success',
        duration: 3000,
        isClosable: true
      })
      onDeleteClose()
      setProductToDelete(null)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el producto',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    }
  }

  const processedData = useMemo(() => {
    if (!productos) return []

    let filtered = productos.filter((producto: any) => {
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch =
        producto.nombre?.toLowerCase().includes(searchLower) ||
        producto.descripcion?.toLowerCase().includes(searchLower) ||
        producto.id.toString().includes(searchLower)

      const matchesFilter = filterEstado === 'todos' || producto.estado === filterEstado

      return matchesSearch && matchesFilter
    })

    return filtered.sort((a: any, b: any) => {
      let aVal = a[sortField]
      let bVal = b[sortField]

      if (typeof aVal === 'string') aVal = aVal.toLowerCase()
      if (typeof bVal === 'string') bVal = bVal.toLowerCase()

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [productos, searchTerm, sortField, sortDirection, filterEstado])

  const totalPages = Math.ceil(processedData.length / pageSize)
  const paginatedData = processedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const stats = useMemo(() => {
    if (!productos) return null

    const totalProducts = productos.length
    const publicados = productos.filter((p: any) => p.estado === 'publicado').length
    const borradores = productos.filter((p: any) => p.estado === 'borrador').length
    const eliminados = productos.filter((p: any) => p.estado === 'eliminado').length
    const totalStock = productos.reduce(
      (sum: number, product: any) => sum + (product.stock || 0),
      0
    )
    const avgPrice =
      totalProducts > 0
        ? Math.round(
            productos.reduce((sum: number, product: any) => sum + (product.precio || 0), 0) /
              totalProducts
          )
        : 0

    return { totalProducts, publicados, borradores, eliminados, totalStock, avgPrice }
  }, [productos])

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

  if (isLoading) {
    return (
      <RequireAdmin>
        <Layout>
          <Container maxW="container.xl" py={8}>
            <Center minH="60vh">
              <VStack spacing={3}>
                <Spinner size="xl" color="blue.500" thickness="3px" />
                <Text color={mutedColor}>Cargando productos...</Text>
              </VStack>
            </Center>
          </Container>
        </Layout>
      </RequireAdmin>
    )
  }

  if (error) {
    return (
      <RequireAdmin>
        <Layout>
          <Container maxW="container.xl" py={8}>
            <Alert status="error" borderRadius="lg">
              <AlertIcon />
              <Box>
                <Text fontWeight="semibold">Error al cargar productos</Text>
                <Text fontSize="sm">{error.message}</Text>
              </Box>
            </Alert>
          </Container>
        </Layout>
      </RequireAdmin>
    )
  }

  return (
    <RequireAdmin>
      <Head>
        <title>Gestión de Productos - Luisardito Shop</title>
        <meta name="description" content="Administra el catálogo de productos de Luisardito Shop" />
      </Head>
      <Layout>
        <Container maxW="container.xl" py={{ base: 4, md: 6 }} px={{ base: 4, md: 6 }}>
          <VStack spacing={6} align="stretch">
            {/* Header */}
            <Flex
              justify="space-between"
              align={{ base: 'start', md: 'center' }}
              direction={{ base: 'column', md: 'row' }}
              gap={4}
            >
              <Box>
                <Heading size="lg" mb={2} color={textColor}>
                  Gestión de Productos
                </Heading>
                <Text fontSize="sm" color={mutedColor}>
                  Administra el catálogo de productos de la tienda
                </Text>
              </Box>
              <NextLink href="/admin/productos/nuevo" passHref>
                <Button colorScheme="blue" leftIcon={<AddIcon />} size="md">
                  Nuevo Producto
                </Button>
              </NextLink>
            </Flex>

            {/* Estadísticas */}
            {stats && (
              <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={3}>
                <Box
                  bg={statBg}
                  p={4}
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <HStack spacing={2} mb={2}>
                    <MdShoppingBag size={18} color="blue" />
                    <Text fontSize="xs" color={mutedColor} fontWeight="medium">
                      Total
                    </Text>
                  </HStack>
                  <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                    {stats.totalProducts}
                  </Text>
                </Box>

                <Box
                  bg={statBg}
                  p={4}
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <HStack spacing={2} mb={2}>
                    <MdCheckCircle size={18} color="green" />
                    <Text fontSize="xs" color={mutedColor} fontWeight="medium">
                      Publicados
                    </Text>
                  </HStack>
                  <Text fontSize="2xl" fontWeight="bold" color="green.600">
                    {stats.publicados}
                  </Text>
                </Box>

                <Box
                  bg={statBg}
                  p={4}
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <HStack spacing={2} mb={2}>
                    <MdDrafts size={18} color="orange" />
                    <Text fontSize="xs" color={mutedColor} fontWeight="medium">
                      Borradores
                    </Text>
                  </HStack>
                  <Text fontSize="2xl" fontWeight="bold" color="yellow.600">
                    {stats.borradores}
                  </Text>
                </Box>

                <Box
                  bg={statBg}
                  p={4}
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <HStack spacing={2} mb={2}>
                    <MdDelete size={18} color="red" />
                    <Text fontSize="xs" color={mutedColor} fontWeight="medium">
                      Eliminados
                    </Text>
                  </HStack>
                  <Text fontSize="2xl" fontWeight="bold" color="red.600">
                    {stats.eliminados}
                  </Text>
                </Box>

                <Box
                  bg={statBg}
                  p={4}
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <HStack spacing={2} mb={2}>
                    <MdInventory size={18} color="purple" />
                    <Text fontSize="xs" color={mutedColor} fontWeight="medium">
                      Stock
                    </Text>
                  </HStack>
                  <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                    {stats.totalStock}
                  </Text>
                </Box>

                <Box
                  bg={statBg}
                  p={4}
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <HStack spacing={2} mb={2}>
                    <MdAttachMoney size={18} color="orange" />
                    <Text fontSize="xs" color={mutedColor} fontWeight="medium">
                      Precio Prom
                    </Text>
                  </HStack>
                  <Text fontSize="2xl" fontWeight="bold" color="orange.600">
                    {stats.avgPrice}
                  </Text>
                </Box>
              </SimpleGrid>
            )}

            {/* Filtros y búsqueda */}
            <Box bg={cardBg} p={4} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
              <Flex
                direction={{ base: 'column', md: 'row' }}
                gap={3}
                align={{ base: 'stretch', md: 'center' }}
              >
                <InputGroup maxW={{ base: 'full', md: '300px' }}>
                  <InputLeftElement>
                    <SearchIcon color={mutedColor} />
                  </InputLeftElement>
                  <Input
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    borderRadius="lg"
                  />
                </InputGroup>

                <Select
                  value={filterEstado}
                  onChange={(e) => {
                    setFilterEstado(e.target.value)
                    setCurrentPage(1)
                  }}
                  w={{ base: 'full', md: '150px' }}
                  borderRadius="lg"
                >
                  <option value="todos">Todos</option>
                  <option value="publicado">Publicados</option>
                  <option value="borrador">Borradores</option>
                  <option value="eliminado">Eliminados</option>
                </Select>

                <HStack spacing={2}>
                  <Text fontSize="sm" color={mutedColor} whiteSpace="nowrap">
                    Mostrar:
                  </Text>
                  <Select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value))
                      setCurrentPage(1)
                    }}
                    w="90px"
                    borderRadius="lg"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </Select>
                </HStack>

                {(searchTerm || filterEstado !== 'todos') && (
                  <Badge colorScheme="blue" fontSize="sm" px={3} py={1} borderRadius="full">
                    {processedData.length} resultados
                  </Badge>
                )}
              </Flex>
            </Box>

            {/* Tabla de productos */}
            <Box
              bg={cardBg}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={borderColor}
              overflow="hidden"
            >
              <TableContainer>
                <Table variant="simple" size="sm">
                  <Thead bg={statBg}>
                    <Tr>
                      <Th py={3}>Producto</Th>
                      <Th
                        py={3}
                        cursor="pointer"
                        onClick={() => handleSort('precio')}
                        _hover={{ bg: hoverBg }}
                      >
                        <HStack spacing={1}>
                          <Text>Precio</Text>
                          {sortField === 'precio' &&
                            (sortDirection === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />)}
                        </HStack>
                      </Th>
                      <Th
                        py={3}
                        cursor="pointer"
                        onClick={() => handleSort('stock')}
                        _hover={{ bg: hoverBg }}
                        display={{ base: 'none', md: 'table-cell' }}
                      >
                        <HStack spacing={1}>
                          <Text>Stock</Text>
                          {sortField === 'stock' &&
                            (sortDirection === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />)}
                        </HStack>
                      </Th>
                      <Th py={3} display={{ base: 'none', lg: 'table-cell' }}>
                        Categoría
                      </Th>
                      <Th py={3}>Estado</Th>
                      <Th py={3}>Acciones</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {paginatedData.map((producto: any) => (
                      <Tr key={producto.id} _hover={{ bg: hoverBg }} transition="all 0.2s">
                        <Td py={3}>
                          <HStack spacing={3}>
                            <Image
                              src={producto.imagen}
                              alt={producto.nombre}
                              boxSize="40px"
                              objectFit="cover"
                              borderRadius="md"
                              fallbackSrc="/placeholder.png"
                            />
                            <VStack align="start" spacing={0}>
                              <Text fontSize="sm" fontWeight="medium" color={textColor}>
                                {producto.nombre}
                              </Text>
                              <Text fontSize="xs" color={mutedColor} noOfLines={1} maxW="200px">
                                {producto.descripcion}
                              </Text>
                            </VStack>
                          </HStack>
                        </Td>
                        <Td py={3}>
                          <Badge colorScheme="green" fontSize="sm" fontWeight="semibold">
                            {producto.precio?.toLocaleString() || 0}
                          </Badge>
                        </Td>
                        <Td py={3} display={{ base: 'none', md: 'table-cell' }}>
                          <Badge colorScheme={producto.stock > 0 ? 'blue' : 'red'} fontSize="sm">
                            {producto.stock || 0}
                          </Badge>
                        </Td>
                        <Td py={3} display={{ base: 'none', lg: 'table-cell' }}>
                          <Text fontSize="sm" color={mutedColor}>
                            {producto.categoria || 'Sin categoría'}
                          </Text>
                        </Td>
                        <Td py={3}>
                          <Badge colorScheme={getEstadoColor(producto.estado)} fontSize="xs">
                            {producto.estado}
                          </Badge>
                        </Td>
                        <Td py={3}>
                          <Menu placement="bottom-end">
                            <Tooltip label="Acciones">
                              <MenuButton
                                as={IconButton}
                                aria-label="Acciones"
                                icon={<SettingsIcon />}
                                size="sm"
                                variant="ghost"
                              />
                            </Tooltip>
                            <Portal>
                              <MenuList
                                zIndex={1400}
                                borderRadius="lg"
                                borderWidth="1px"
                                borderColor={borderColor}
                                shadow="lg"
                                minW="160px"
                              >
                                <MenuItem
                                  icon={<ViewIcon />}
                                  onClick={() => router.push(`/productos/${producto.slug}`)}
                                  fontSize="sm"
                                >
                                  Ver producto
                                </MenuItem>
                                <MenuItem
                                  icon={<EditIcon />}
                                  onClick={() =>
                                    router.push(`/admin/productos/${producto.id}/editar`)
                                  }
                                  fontSize="sm"
                                >
                                  Editar
                                </MenuItem>
                                {producto.estado !== 'eliminado' && (
                                  <MenuItem
                                    icon={<DeleteIcon />}
                                    onClick={() => handleDeleteClick(producto.id)}
                                    fontSize="sm"
                                    color="red.500"
                                  >
                                    Eliminar
                                  </MenuItem>
                                )}
                              </MenuList>
                            </Portal>
                          </Menu>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>

              {/* Paginación */}
              {totalPages > 1 && (
                <Box p={4} borderTopWidth="1px" borderColor={borderColor}>
                  <Flex
                    justify="space-between"
                    align="center"
                    direction={{ base: 'column', sm: 'row' }}
                    gap={3}
                  >
                    <Text fontSize="sm" color={mutedColor}>
                      {(currentPage - 1) * pageSize + 1} -{' '}
                      {Math.min(currentPage * pageSize, processedData.length)} de{' '}
                      {processedData.length}
                    </Text>

                    <HStack spacing={2}>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        isDisabled={currentPage === 1}
                      >
                        Anterior
                      </Button>

                      <HStack spacing={1}>
                        {[...Array(Math.min(5, totalPages))].map((_, i) => {
                          const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i
                          if (page > totalPages) return null

                          return (
                            <Button
                              key={page}
                              size="sm"
                              variant={currentPage === page ? 'solid' : 'outline'}
                              colorScheme={currentPage === page ? 'blue' : 'gray'}
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </Button>
                          )
                        })}
                      </HStack>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        isDisabled={currentPage === totalPages}
                      >
                        Siguiente
                      </Button>
                    </HStack>
                  </Flex>
                </Box>
              )}
            </Box>
          </VStack>

          {/* Dialog de confirmación de eliminación */}
          <AlertDialog
            isOpen={isDeleteOpen}
            leastDestructiveRef={cancelRef}
            onClose={onDeleteClose}
            isCentered
          >
            <AlertDialogOverlay>
              <AlertDialogContent mx={4}>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Eliminar Producto
                </AlertDialogHeader>

                <AlertDialogBody>
                  ¿Estás seguro de que quieres eliminar este producto? Esta acción moverá el
                  producto a eliminados.
                </AlertDialogBody>

                <AlertDialogFooter gap={3}>
                  <Button ref={cancelRef} onClick={onDeleteClose}>
                    Cancelar
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={handleDeleteConfirm}
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
