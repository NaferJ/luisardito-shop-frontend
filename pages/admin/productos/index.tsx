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
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
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
    Card,
    CardBody,
    CardHeader,
    Input,
    InputGroup,
    InputLeftElement,
    Select,
    Flex,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    Divider,
    Avatar,
    Tooltip,
    Alert,
    AlertIcon,
    Stack,
    Tag,
    TagLabel,
    TagCloseButton,
    Wrap,
    WrapItem,
    Image,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter
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
import NextLink from 'next/link'
import Head from 'next/head'

export default function AdminProductosPage() {
    const { data: productos, isLoading, error } = useProductos()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const {
        isOpen: isDeleteOpen,
        onOpen: onDeleteOpen,
        onClose: onDeleteClose
    } = useDisclosure()

    const [productToDelete, setProductToDelete] = useState<number | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [sortField, setSortField] = useState<string>('id')
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
    const [pageSize, setPageSize] = useState(10)
    const [currentPage, setCurrentPage] = useState(1)
    const [filterEstado, setFilterEstado] = useState<string>('todos')

    const deleteProductoMutation = useDeleteProducto()
    const updateProductoMutation = useUpdateProducto()
    const toast = useToast()
    const router = useRouter()
    const cancelRef = useRef<HTMLButtonElement>(null)

    // Theme colors
    const cardBg = useColorModeValue('black.200', 'gray.800')
    const borderColor = useColorModeValue('gray.200', 'gray.600')
    const hoverBg = useColorModeValue('gray.50', 'gray.700')
    const headerBg = useColorModeValue('gray.50', 'gray.700')

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
                title: '✅ Producto eliminado',
                description: 'El producto se movió a eliminados',
                status: 'success'
            })
            onDeleteClose()
            setProductToDelete(null)
        } catch (error) {
            toast({
                title: 'Error',
                description: 'No se pudo eliminar el producto',
                status: 'error'
            })
        }
    }

    // Filtered and sorted data
    const processedData = useMemo(() => {
        if (!productos) return []

        let filtered = productos.filter((producto: any) => {
            const searchLower = searchTerm.toLowerCase()
            const matchesSearch = (
                producto.nombre?.toLowerCase().includes(searchLower) ||
                producto.descripcion?.toLowerCase().includes(searchLower) ||
                producto.id.toString().includes(searchLower)
            )

            const matchesFilter = filterEstado === 'todos' || producto.estado === filterEstado

            return matchesSearch && matchesFilter
        })

        filtered.sort((a: any, b: any) => {
            let aVal = a[sortField]
            let bVal = b[sortField]

            if (typeof aVal === 'string') aVal = aVal.toLowerCase()
            if (typeof bVal === 'string') bVal = bVal.toLowerCase()

            if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
            if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
            return 0
        })

        return filtered
    }, [productos, searchTerm, sortField, sortDirection, filterEstado])

    // Pagination
    const totalPages = Math.ceil(processedData.length / pageSize)
    const paginatedData = processedData.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    )

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortField(field)
            setSortDirection('asc')
        }
    }

    // Statistics
    const stats = useMemo(() => {
        if (!productos) return null

        const totalProducts = productos.length
        const publicados = productos.filter((p: any) => p.estado === 'publicado').length
        const borradores = productos.filter((p: any) => p.estado === 'borrador').length
        const eliminados = productos.filter((p: any) => p.estado === 'eliminado').length
        const totalStock = productos.reduce((sum: number, product: any) => sum + (product.stock || 0), 0)
        const avgPrice = Math.round(productos.reduce((sum: number, product: any) => sum + (product.precio || 0), 0) / totalProducts)

        return { totalProducts, publicados, borradores, eliminados, totalStock, avgPrice }
    }, [productos])

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

    if (isLoading) {
        return (
            <RequireAdmin>
                <Layout>
                    <Container maxW="container.xl" py={8}>
                        <Center minH="50vh">
                            <VStack spacing={4}>
                                <Spinner size="xl" color="blue.500" thickness="4px" />
                                <Text fontSize="lg" color="gray.600">Cargando productos...</Text>
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
                        <Alert status="error" borderRadius="xl">
                            <AlertIcon />
                            <Box>
                                <Text fontWeight="bold">Error al cargar productos</Text>
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
                <meta name="description" content="Administra el catálogo de productos de Luisardito Shop"/>
            </Head>
            <Layout>
                <Container maxW="container.xl" py={{ base: 4, md: 8 }} px={{ base: 4, md: 6 }}>
                    <VStack spacing={{ base: 4, md: 6 }} align="stretch">
                        {/* Header */}
                        <Flex justify="space-between" align={{ base: 'start', md: 'center' }} direction={{ base: 'column', md: 'row' }} gap={4}>
                            <Box>
                                <Heading size={{ base: 'lg', md: 'xl' }} mb={2} color="gray.800" _dark={{ color: 'white' }}>
                                    Gestión de Productos
                                </Heading>
                                <Text color="gray.600" _dark={{ color: 'gray.400' }}>
                                    Administra el catálogo de productos de la tienda
                                </Text>
                            </Box>
                            <NextLink href="/admin/productos/nuevo" passHref>
                                <Button
                                    colorScheme="blue"
                                    leftIcon={<AddIcon />}
                                    size={{ base: 'md', md: 'lg' }}
                                    borderRadius="xl"
                                    _hover={{
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 0 25px rgba(66, 153, 225, 0.6)',
                                    }}
                                >
                                    Nuevo Producto
                                </Button>
                            </NextLink>
                        </Flex>

                        {/* Statistics Cards */}
                        {stats && (
                            <SimpleGrid columns={{ base: 2, md: 4, lg: 6 }} spacing={4}>
                                <Card bg={cardBg} shadow="md" borderRadius="xl">
                                    <CardBody textAlign="center" py={6}>
                                        <Stat>
                                            <StatLabel color="gray.500">Total</StatLabel>
                                            <StatNumber color="blue.600" fontSize="2xl">
                                                {stats.totalProducts}
                                            </StatNumber>
                                        </Stat>
                                    </CardBody>
                                </Card>

                                <Card bg={cardBg} shadow="md" borderRadius="xl">
                                    <CardBody textAlign="center" py={6}>
                                        <Stat>
                                            <StatLabel color="gray.500">Publicados</StatLabel>
                                            <StatNumber color="green.600" fontSize="2xl">
                                                {stats.publicados}
                                            </StatNumber>
                                        </Stat>
                                    </CardBody>
                                </Card>

                                <Card bg={cardBg} shadow="md" borderRadius="xl">
                                    <CardBody textAlign="center" py={6}>
                                        <Stat>
                                            <StatLabel color="gray.500">Borradores</StatLabel>
                                            <StatNumber color="yellow.600" fontSize="2xl">
                                                {stats.borradores}
                                            </StatNumber>
                                        </Stat>
                                    </CardBody>
                                </Card>

                                <Card bg={cardBg} shadow="md" borderRadius="xl">
                                    <CardBody textAlign="center" py={6}>
                                        <Stat>
                                            <StatLabel color="gray.500">Eliminados</StatLabel>
                                            <StatNumber color="red.600" fontSize="2xl">
                                                {stats.eliminados}
                                            </StatNumber>
                                        </Stat>
                                    </CardBody>
                                </Card>

                                <Card bg={cardBg} shadow="md" borderRadius="xl">
                                    <CardBody textAlign="center" py={6}>
                                        <Stat>
                                            <StatLabel color="gray.500">Stock Total</StatLabel>
                                            <StatNumber color="purple.600" fontSize="2xl">
                                                {stats.totalStock}
                                            </StatNumber>
                                        </Stat>
                                    </CardBody>
                                </Card>

                                <Card bg={cardBg} shadow="md" borderRadius="xl">
                                    <CardBody textAlign="center" py={6}>
                                        <Stat>
                                            <StatLabel color="gray.500">Precio Promedio</StatLabel>
                                            <StatNumber color="orange.600" fontSize="2xl">
                                                {stats.avgPrice}
                                            </StatNumber>
                                        </Stat>
                                    </CardBody>
                                </Card>
                            </SimpleGrid>
                        )}

                        {/* Search and Filters */}
                        <Card bg={cardBg} shadow="md" borderRadius="xl">
                            <CardBody>
                                <Stack direction={{ base: 'column', md: 'row' }} spacing={4} align="center">
                                    <InputGroup maxW={{ base: 'full', md: '300px' }}>
                                        <InputLeftElement>
                                            <SearchIcon color="gray.400" />
                                        </InputLeftElement>
                                        <Input
                                            placeholder="Buscar productos..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            borderRadius="lg"
                                        />
                                    </InputGroup>

                                    <HStack spacing={4} wrap="wrap">
                                        <VStack spacing={1} align="start">
                                            <Text fontSize="xs" color="gray.500">Estado:</Text>
                                            <Select
                                                value={filterEstado}
                                                onChange={(e) => {
                                                    setFilterEstado(e.target.value)
                                                    setCurrentPage(1)
                                                }}
                                                size="sm"
                                                w="120px"
                                                borderRadius="lg"
                                            >
                                                <option value="todos">Todos</option>
                                                <option value="publicado">Publicados</option>
                                                <option value="borrador">Borradores</option>
                                                <option value="eliminado">Eliminados</option>
                                            </Select>
                                        </VStack>

                                        <VStack spacing={1} align="start">
                                            <Text fontSize="xs" color="gray.500">Mostrar:</Text>
                                            <Select
                                                value={pageSize}
                                                onChange={(e) => {
                                                    setPageSize(Number(e.target.value))
                                                    setCurrentPage(1)
                                                }}
                                                size="sm"
                                                w="80px"
                                                borderRadius="lg"
                                            >
                                                <option value={5}>5</option>
                                                <option value={10}>10</option>
                                                <option value={25}>25</option>
                                                <option value={50}>50</option>
                                            </Select>
                                        </VStack>
                                    </HStack>

                                    {(searchTerm || filterEstado !== 'todos') && (
                                        <Tag
                                            size="md"
                                            colorScheme="blue"
                                            borderRadius="full"
                                        >
                                            <TagLabel>{processedData.length} resultados</TagLabel>
                                            <TagCloseButton onClick={() => {
                                                setSearchTerm('')
                                                setFilterEstado('todos')
                                            }} />
                                        </Tag>
                                    )}
                                </Stack>
                            </CardBody>
                        </Card>

                        {/* Products Table */}
                        {!productos || productos.length === 0 ? (
                            <Card bg={cardBg} shadow="md" borderRadius="xl">
                                <CardBody>
                                    <Center py={20}>
                                        <VStack spacing={6}>
                                            <Box fontSize="6xl">📦</Box>
                                            <VStack spacing={2}>
                                                <Text fontSize="lg" fontWeight="bold" color="gray.600">
                                                    No hay productos creados
                                                </Text>
                                                <Text fontSize="sm" color="gray.500" textAlign="center">
                                                    Comienza agregando tu primer producto a la tienda
                                                </Text>
                                            </VStack>
                                            <NextLink href="/admin/productos/nuevo" passHref>
                                                <Button colorScheme="blue" size="lg" leftIcon={<AddIcon />} borderRadius="xl">
                                                    Crear Primer Producto
                                                </Button>
                                            </NextLink>
                                        </VStack>
                                    </Center>
                                </CardBody>
                            </Card>
                        ) : (
                            <Card bg={cardBg} shadow="md" borderRadius="xl" overflow="hidden">
                                <TableContainer>
                                    <Table variant="simple">
                                        <Thead bg={headerBg}>
                                            <Tr>
                                                <Th
                                                    cursor="pointer"
                                                    onClick={() => handleSort('id')}
                                                    _hover={{ bg: hoverBg }}
                                                >
                                                    <HStack>
                                                        <Text>ID</Text>
                                                        {sortField === 'id' && (
                                                            sortDirection === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />
                                                        )}
                                                    </HStack>
                                                </Th>
                                                <Th>Producto</Th>
                                                <Th
                                                    cursor="pointer"
                                                    onClick={() => handleSort('precio')}
                                                    _hover={{ bg: hoverBg }}
                                                >
                                                    <HStack>
                                                        <Text>Precio</Text>
                                                        {sortField === 'precio' && (
                                                            sortDirection === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />
                                                        )}
                                                    </HStack>
                                                </Th>
                                                <Th
                                                    cursor="pointer"
                                                    onClick={() => handleSort('stock')}
                                                    _hover={{ bg: hoverBg }}
                                                >
                                                    <HStack>
                                                        <Text>Stock</Text>
                                                        {sortField === 'stock' && (
                                                            sortDirection === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />
                                                        )}
                                                    </HStack>
                                                </Th>
                                                <Th
                                                    cursor="pointer"
                                                    onClick={() => handleSort('estado')}
                                                    _hover={{ bg: hoverBg }}
                                                >
                                                    <HStack>
                                                        <Text>Estado</Text>
                                                        {sortField === 'estado' && (
                                                            sortDirection === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />
                                                        )}
                                                    </HStack>
                                                </Th>
                                                <Th>Acciones</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {paginatedData.map((producto: any) => {
                                                const isEliminado = producto.estado === 'eliminado'
                                                const isBorrador = producto.estado === 'borrador'

                                                return (
                                                    <Tr
                                                        key={producto.id}
                                                        _hover={{ bg: hoverBg }}
                                                        transition="all 0.2s"
                                                        opacity={isEliminado ? 0.6 : isBorrador ? 0.8 : 1}
                                                    >
                                                        <Td fontWeight="bold" color="blue.600">
                                                            #{producto.id}
                                                        </Td>
                                                        <Td>
                                                            <HStack spacing={3}>
                                                                <Box
                                                                    boxSize="40px"
                                                                    borderRadius="lg"
                                                                    overflow="hidden"
                                                                    bg="gray.100"
                                                                    _dark={{ bg: 'gray.700' }}
                                                                    flexShrink={0}
                                                                >
                                                                    {producto.imagen_url ? (
                                                                        <Image
                                                                            src={producto.imagen_url}
                                                                            alt={producto.nombre}
                                                                            w="full"
                                                                            h="full"
                                                                            objectFit="cover"
                                                                        />
                                                                    ) : (
                                                                        <Center w="full" h="full">
                                                                            <Text fontSize="xs" color="gray.500">📦</Text>
                                                                        </Center>
                                                                    )}
                                                                </Box>
                                                                <VStack align="start" spacing={0}>
                                                                    <Text
                                                                        fontWeight="medium"
                                                                        fontSize="sm"
                                                                        textDecoration={isEliminado ? 'line-through' : 'none'}
                                                                    >
                                                                        {producto.nombre}
                                                                    </Text>
                                                                    <Text
                                                                        fontSize="xs"
                                                                        color="gray.500"
                                                                        maxW="200px"
                                                                        isTruncated
                                                                        textDecoration={isEliminado ? 'line-through' : 'none'}
                                                                    >
                                                                        {producto.descripcion}
                                                                    </Text>
                                                                </VStack>
                                                            </HStack>
                                                        </Td>
                                                        <Td>
                                                            <Badge
                                                                colorScheme="green"
                                                                fontSize="sm"
                                                                px={3}
                                                                py={1}
                                                                borderRadius="full"
                                                            >
                                                                {producto.precio?.toLocaleString() || 0} pts
                                                            </Badge>
                                                        </Td>
                                                        <Td>
                                                            <Badge
                                                                colorScheme={producto.stock > 0 ? 'blue' : 'red'}
                                                                fontSize="sm"
                                                                px={3}
                                                                py={1}
                                                                borderRadius="full"
                                                            >
                                                                {producto.stock || 0} unidades
                                                            </Badge>
                                                        </Td>
                                                        <Td>
                                                            <Badge
                                                                colorScheme={getEstadoColor(producto.estado)}
                                                                fontSize="sm"
                                                                px={3}
                                                                py={1}
                                                                borderRadius="full"
                                                            >
                                                                {getEstadoText(producto.estado)}
                                                            </Badge>
                                                        </Td>
                                                        <Td>
                                                            <Menu isLazy placement="bottom-end">
                                                                <MenuButton
                                                                    as={IconButton}
                                                                    aria-label="Acciones"
                                                                    icon={<SettingsIcon />}
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    borderRadius="lg"
                                                                    _hover={{ bg: 'blue.50', _dark: { bg: 'blue.900' } }}
                                                                />
                                                                <Portal>
                                                                    <MenuList
                                                                        zIndex={1400}
                                                                        borderRadius="xl"
                                                                        border="1px solid"
                                                                        borderColor={borderColor}
                                                                        shadow="xl"
                                                                        p={2}
                                                                        minW="180px"
                                                                    >
                                                                        <MenuItem
                                                                            icon={<EditIcon />}
                                                                            onClick={() => router.push(`/admin/productos/${producto.id}/editar`)}
                                                                            borderRadius="lg"
                                                                            whiteSpace="nowrap"
                                                                        >
                                                                            {isEliminado ? 'Recuperar' : 'Editar'}
                                                                        </MenuItem>
                                                                        <MenuItem
                                                                            icon={<ViewIcon />}
                                                                            onClick={() => router.push(`/productos/${producto.id}`)}
                                                                            borderRadius="lg"
                                                                            whiteSpace="nowrap"
                                                                        >
                                                                            Ver en tienda
                                                                        </MenuItem>
                                                                        {!isEliminado && (
                                                                            <MenuItem
                                                                                icon={<DeleteIcon />}
                                                                                onClick={() => handleDeleteClick(producto.id)}
                                                                                borderRadius="lg"
                                                                                color="red.500"
                                                                                whiteSpace="nowrap"
                                                                            >
                                                                                Eliminar
                                                                            </MenuItem>
                                                                        )}
                                                                    </MenuList>
                                                                </Portal>
                                                            </Menu>
                                                        </Td>
                                                    </Tr>
                                                )
                                            })}
                                        </Tbody>
                                    </Table>
                                </TableContainer>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <Box p={4} borderTop="1px solid" borderColor={borderColor}>
                                        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
                                            <Text fontSize="sm" color="gray.600">
                                                Mostrando {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, processedData.length)} de {processedData.length} productos
                                            </Text>

                                            <HStack spacing={2}>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                                    isDisabled={currentPage === 1}
                                                    borderRadius="lg"
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
                                                                variant={currentPage === page ? "solid" : "outline"}
                                                                colorScheme={currentPage === page ? "blue" : "gray"}
                                                                onClick={() => setCurrentPage(page)}
                                                                borderRadius="lg"
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
                                                    borderRadius="lg"
                                                >
                                                    Siguiente
                                                </Button>
                                            </HStack>
                                        </Flex>
                                    </Box>
                                )}
                            </Card>
                        )}
                    </VStack>

                    {/* Delete Confirmation Modal */}
                    <AlertDialog
                        isOpen={isDeleteOpen}
                        leastDestructiveRef={cancelRef}
                        onClose={onDeleteClose}
                        isCentered
                    >
                        <AlertDialogOverlay backdropFilter="blur(10px)">
                            <AlertDialogContent borderRadius="2xl" mx={4}>
                                <AlertDialogHeader>
                                    <VStack align="start" spacing={1}>
                                        <Text>🗑️ Eliminar Producto</Text>
                                        <Text fontSize="sm" fontWeight="normal" color="gray.600">
                                            Esta acción cambiará el estado del producto a "eliminado"
                                        </Text>
                                    </VStack>
                                </AlertDialogHeader>
                                <AlertDialogBody>
                                    <VStack spacing={4} align="stretch">
                                        <Alert status="warning" borderRadius="lg">
                                            <AlertIcon />
                                            <Text fontSize="sm">
                                                El producto no será eliminado permanentemente, solo se ocultará de la tienda.
                                                Podrás recuperarlo más tarde si es necesario.
                                            </Text>
                                        </Alert>
                                    </VStack>
                                </AlertDialogBody>
                                <AlertDialogFooter>
                                    <Button
                                        ref={cancelRef}
                                        onClick={onDeleteClose}
                                        variant="ghost"
                                        borderRadius="lg"
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        colorScheme="red"
                                        onClick={handleDeleteConfirm}
                                        ml={3}
                                        isLoading={updateProductoMutation.isPending}
                                        borderRadius="lg"
                                    >
                                        Eliminar Producto
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
