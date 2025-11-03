import { Layout } from '../../../components/Layout'
import { RequireAdmin } from '../../../components/RequireAdmin'
import {
  useAdminCanjes,
  useUpdateCanjeEstado,
  useDevolverCanje
} from '../../../hooks/useAdminCanjes'
import {
  Box,
  Container,
  Heading,
  Badge,
  Spinner,
  Center,
  useToast,
  Text,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorModeValue,
  Portal,
  VStack,
  HStack,
  Card,
  CardBody,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Avatar,
  Flex,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Alert,
  AlertIcon,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Stack,
  Tag,
  TagLabel,
  TagCloseButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  FormControl,
  FormLabel,
  Textarea,
  Button,
  Image
} from '@chakra-ui/react'
import {
  SettingsIcon,
  SearchIcon,
  EditIcon,
  CheckIcon,
  CloseIcon,
  RepeatIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@chakra-ui/icons'
import { UserBadge, UserAvatarWithBadge } from '../../../components/UserBadge'
import { useMemo, useState } from 'react'
import type { AxiosError } from 'axios'
import type { Canje } from '../../../types'
import Head from "next/head";

export default function AdminCanjesPage() {
  const { data: canjes, isLoading, error, refetch } = useAdminCanjes()
  const updateEstado = useUpdateCanjeEstado()
  const devolver = useDevolverCanje()
  const toast = useToast()

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedCanje, setSelectedCanje] = useState<any>(null)
  const [devolucionMotivo, setDevolucionMotivo] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEstado, setFilterEstado] = useState<string>('todos')
  const [sortField, setSortField] = useState<string>('id')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  // Theme colors
  const cardBg = useColorModeValue('black.50', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const hoverBg = useColorModeValue('gray.50', 'gray.700')
  const headerBg = useColorModeValue('gray.50', 'gray.700')

  // Processed data with filters and sorting
  const processedData = useMemo(() => {
    if (!canjes) return []

    let filtered = canjes.filter((canje: any) => {
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch = (
        canje?.Usuario?.nickname?.toLowerCase().includes(searchLower) ||
        canje?.Producto?.nombre?.toLowerCase().includes(searchLower) ||
        canje.id.toString().includes(searchLower) ||
        canje.estado.toLowerCase().includes(searchLower)
      )

      const matchesFilter = filterEstado === 'todos' || canje.estado === filterEstado

      return matchesSearch && matchesFilter
    })

    filtered.sort((a: any, b: any) => {
      let aVal = a[sortField]
      let bVal = b[sortField]

      if (sortField === 'usuario') {
        aVal = a?.Usuario?.nickname || a?.usuario?.nickname || ''
        bVal = b?.Usuario?.nickname || b?.usuario?.nickname || ''
      }

      if (sortField === 'producto') {
        aVal = a?.Producto?.nombre || ''
        bVal = b?.Producto?.nombre || ''
      }

      if (typeof aVal === 'string') aVal = aVal.toLowerCase()
      if (typeof bVal === 'string') bVal = bVal.toLowerCase()

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [canjes, searchTerm, sortField, sortDirection, filterEstado])

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
    if (!canjes) return null

    const total = canjes.length
    const pendientes = canjes.filter((c: any) => c.estado === 'pendiente').length
    const entregados = canjes.filter((c: any) => c.estado === 'entregado').length
    const cancelados = canjes.filter((c: any) => c.estado === 'cancelado').length
    const devueltos = canjes.filter((c: any) => c.estado === 'devuelto').length

    return { total, pendientes, entregados, cancelados, devueltos }
  }, [canjes])

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'pendiente': return 'yellow'
      case 'entregado': return 'green'
      case 'cancelado': return 'red'
      case 'devuelto': return 'purple'
      default: return 'gray'
    }
  }

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'pendiente': return '⏳'
      case 'entregado': return '✅'
      case 'cancelado': return '❌'
      case 'devuelto': return '↩️'
      default: return '❓'
    }
  }

  const handleUpdateEstado = async (
    canjeId: number,
    nuevoEstado: 'pendiente' | 'entregado' | 'cancelado'
  ) => {
    try {
      await updateEstado.mutateAsync({ canjeId, estado: nuevoEstado })
      toast({
        title: '✅ Estado actualizado',
        description: `Canje marcado como ${nuevoEstado}`,
        status: 'success'
      })
      refetch()
    } catch (e: unknown) {
      const err = e as AxiosError<{ error?: string }>
      toast({
        title: 'Error',
        description: err.response?.data?.error || 'No se pudo actualizar',
        status: 'error'
      })
    }
  }

  const handleDevolucion = async () => {
    if (!selectedCanje || !devolucionMotivo.trim()) {
      toast({
        title: 'Error',
        description: 'Debe proporcionar un motivo para la devolución',
        status: 'error'
      })
      return
    }

    try {
      await devolver.mutateAsync({
        canjeId: selectedCanje.id,
        motivo: devolucionMotivo.trim()
      })
      toast({
        title: '✅ Canje devuelto',
        description: 'Los puntos han sido devueltos al usuario',
        status: 'success'
      })
      onClose()
      setSelectedCanje(null)
      setDevolucionMotivo('')
      refetch()
    } catch (e: unknown) {
      const err = e as AxiosError<{ error?: string }>
      toast({
        title: 'Error',
        description: err.response?.data?.error || 'No se pudo procesar la devolución',
        status: 'error'
      })
    }
  }

  const openDevolucionModal = (canje: any) => {
    setSelectedCanje(canje)
    setDevolucionMotivo('')
    onOpen()
  }

  if (isLoading) {
    return (
      <RequireAdmin>
        <Layout>
          <Container maxW="container.xl" py={8}>
            <Center minH="50vh">
              <VStack spacing={4}>
                <Spinner size="xl" color="blue.500" thickness="4px" />
                <Text fontSize="lg" color="gray.600">Cargando canjes...</Text>
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
                <Text fontWeight="bold">Error al cargar canjes</Text>
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
            <title>Gestión de Canjes - Luisardito Shop</title>
            <meta name="description" content="Administra los canjes de puntos realizados por los usuarios en Luisardito Shop"/>
        </Head>
      <Layout>
        <Container maxW="container.xl" py={{ base: 4, md: 8 }} px={{ base: 4, md: 6 }}>
          <VStack spacing={{ base: 4, md: 6 }} align="stretch">
            {/* Header */}
            <Box>
              <Heading size={{ base: 'lg', md: 'xl' }} mb={2} color="gray.800" _dark={{ color: 'white' }}>
                Gestión de Canjes
              </Heading>
              <Text color="gray.600" _dark={{ color: 'gray.400' }}>
                Administra todos los canjes de puntos realizados por los usuarios
              </Text>
            </Box>

            {/* Statistics Cards */}
            {stats && (
              <SimpleGrid columns={{ base: 2, md: 5 }} spacing={4}>
                <Card bg={cardBg} shadow="md" borderRadius="xl">
                  <CardBody textAlign="center" py={6}>
                    <Stat>
                      <StatLabel color="black.500">Total Canjes</StatLabel>
                      <StatNumber color="blue.600" fontSize="2xl">
                        {stats.total}
                      </StatNumber>
                    </Stat>
                  </CardBody>
                </Card>

                <Card bg={cardBg} shadow="md" borderRadius="xl">
                  <CardBody textAlign="center" py={6}>
                    <Stat>
                      <StatLabel color="black.500">Pendientes</StatLabel>
                      <StatNumber color="yellow.600" fontSize="2xl">
                        {stats.pendientes}
                      </StatNumber>
                    </Stat>
                  </CardBody>
                </Card>

                <Card bg={cardBg} shadow="md" borderRadius="xl">
                  <CardBody textAlign="center" py={6}>
                    <Stat>
                      <StatLabel color="black.500">Entregados</StatLabel>
                      <StatNumber color="green.600" fontSize="2xl">
                        {stats.entregados}
                      </StatNumber>
                    </Stat>
                  </CardBody>
                </Card>

                <Card bg={cardBg} shadow="md" borderRadius="xl">
                  <CardBody textAlign="center" py={6}>
                    <Stat>
                      <StatLabel color="black.500">Cancelados</StatLabel>
                      <StatNumber color="red.600" fontSize="2xl">
                        {stats.cancelados}
                      </StatNumber>
                    </Stat>
                  </CardBody>
                </Card>

                <Card bg={cardBg} shadow="md" borderRadius="xl">
                  <CardBody textAlign="center" py={6}>
                    <Stat>
                      <StatLabel color="black.500">Devueltos</StatLabel>
                      <StatNumber color="purple.600" fontSize="2xl">
                        {stats.devueltos}
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
                      placeholder="Buscar canjes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      borderRadius="lg"
                    />
                  </InputGroup>

                  <HStack spacing={4} wrap="wrap">
                    <VStack spacing={1} align="start">
                      <Text fontSize="xs" color="black.500">Estado:</Text>
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
                        <option value="pendiente">Pendientes</option>
                        <option value="entregado">Entregados</option>
                        <option value="cancelado">Cancelados</option>
                        <option value="devuelto">Devueltos</option>
                      </Select>
                    </VStack>

                    <VStack spacing={1} align="start">
                      <Text fontSize="xs" color="black.500">Mostrar:</Text>
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

            {/* Canjes Table */}
            {!canjes || canjes.length === 0 ? (
              <Card bg={cardBg} shadow="md" borderRadius="xl">
                <CardBody>
                  <Center py={20}>
                    <VStack spacing={6}>
                      <Box fontSize="6xl">🛒</Box>
                      <VStack spacing={2}>
                        <Text fontSize="lg" fontWeight="bold" color="gray.600">
                          No hay canjes registrados
                        </Text>
                        <Text fontSize="sm" color="gray.500" textAlign="center">
                          Los canjes aparecerán aquí cuando los usuarios canjeen productos
                        </Text>
                      </VStack>
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
                          onClick={() => handleSort('usuario')}
                          _hover={{ bg: hoverBg }}
                        >
                          <HStack>
                            <Text>Usuario</Text>
                            {sortField === 'usuario' && (
                              sortDirection === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />
                            )}
                          </HStack>
                        </Th>
                        <Th>Producto</Th>
                        <Th>Precio</Th>
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
                        <Th
                          cursor="pointer"
                          onClick={() => handleSort('fecha')}
                          _hover={{ bg: hoverBg }}
                        >
                          <HStack>
                            <Text>Fecha</Text>
                            {sortField === 'fecha' && (
                              sortDirection === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />
                            )}
                          </HStack>
                        </Th>
                        <Th>Acciones</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {paginatedData.map((canje: any) => (
                        <Tr
                          key={canje.id}
                          _hover={{ bg: hoverBg }}
                          transition="all 0.2s"
                        >
                          <Td>
                          <HStack spacing={3}>
                              <UserAvatarWithBadge user={(canje?.Usuario || canje?.usuario) as any}>
                                <Avatar
                                  size="sm"
                                  name={canje?.Usuario?.kick_username || canje?.Usuario?.nickname || canje?.usuario?.nickname}
                                  src={canje?.Usuario?.kick_avatar || canje?.usuario?.kick_avatar}
                                />
                              </UserAvatarWithBadge>
                              <VStack align="start" spacing={0}>
                                <Text fontWeight="medium" fontSize="sm">
                                  {canje?.Usuario?.kick_username || canje?.Usuario?.nickname || canje?.usuario?.nickname || `Usuario #${canje.usuario_id}`}
                                </Text>
                                <UserBadge user={(canje?.Usuario || canje?.usuario) as any} size="sm" />
                                {(canje?.Usuario?.discord_username || canje?.usuario?.discord_username) && (
                                  <Text fontSize="xs" color="purple.500">
                                    Discord: {canje?.Usuario?.discord_username || canje?.usuario?.discord_username}
                                  </Text>
                                )}
                              </VStack>
                            </HStack>
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
                                {canje?.Producto?.imagen_url ? (
                                  <Image
                                    src={canje?.Producto?.imagen_url}
                                    alt={canje?.Producto?.nombre}
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
                                >
                                  {canje?.Producto?.nombre || `Producto #${canje.producto_id}`}
                                </Text>
                                <Text
                                  fontSize="xs"
                                  color="gray.500"
                                  maxW="200px"
                                  isTruncated
                                >
                                  {canje?.Producto?.descripcion}
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
                              {canje?.Producto?.precio?.toLocaleString() || 0} pts
                            </Badge>
                          </Td>
                          <Td>
                            <Badge
                              colorScheme={getEstadoColor(canje.estado)}
                              fontSize="sm"
                              px={3}
                              py={1}
                              borderRadius="full"
                            >
                              {getEstadoIcon(canje.estado)} {canje.estado}
                            </Badge>
                          </Td>
                          <Td>
                            <Text fontSize="sm" color="gray.500">
                              {new Date(canje.fecha).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </Text>
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
                                    icon={<RepeatIcon />}
                                    onClick={() => handleUpdateEstado(canje.id, 'pendiente')}
                                    borderRadius="lg"
                                    whiteSpace="nowrap"
                                  >
                                    Marcar pendiente
                                  </MenuItem>
                                  <MenuItem
                                    icon={<CheckIcon />}
                                    onClick={() => handleUpdateEstado(canje.id, 'entregado')}
                                    borderRadius="lg"
                                    whiteSpace="nowrap"
                                  >
                                    Marcar entregado
                                  </MenuItem>
                                  <MenuItem
                                    icon={<CloseIcon />}
                                    onClick={() => handleUpdateEstado(canje.id, 'cancelado')}
                                    borderRadius="lg"
                                    whiteSpace="nowrap"
                                  >
                                    Marcar cancelado
                                  </MenuItem>
                                  <MenuItem
                                    icon={<RepeatIcon />}
                                    onClick={() => openDevolucionModal(canje)}
                                    borderRadius="lg"
                                    whiteSpace="nowrap"
                                    color="purple.500"
                                  >
                                    Procesar devolución
                                  </MenuItem>
                                </MenuList>
                              </Portal>
                            </Menu>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Box p={4} borderTop="1px solid" borderColor={borderColor}>
                    <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
                      <Text fontSize="sm" color="gray.600">
                        Mostrando {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, processedData.length)} de {processedData.length} canjes
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

          {/* Devolución Modal */}
          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay backdropFilter="blur(10px)" />
            <ModalContent borderRadius="2xl" mx={4}>
              <ModalHeader>
                <VStack align="start" spacing={1}>
                  <Text>↩️ Procesar Devolución</Text>
                  <Text fontSize="sm" fontWeight="normal" color="gray.600">
                    Canje #{selectedCanje?.id} - {selectedCanje?.Producto?.nombre}
                  </Text>
                </VStack>
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <VStack spacing={4} align="stretch">
                  <Alert status="info" borderRadius="lg">
                    <AlertIcon />
                    <Text fontSize="sm">
                      Esta acción devolverá los puntos al usuario y marcará el canje como devuelto.
                    </Text>
                  </Alert>

                  <FormControl isRequired>
                    <FormLabel>Motivo de la devolución</FormLabel>
                    <Textarea
                      value={devolucionMotivo}
                      onChange={(e) => setDevolucionMotivo(e.target.value)}
                      placeholder="Describe el motivo de la devolución..."
                      borderRadius="lg"
                      resize="none"
                      rows={3}
                    />
                  </FormControl>
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" mr={3} onClick={onClose} borderRadius="lg">
                  Cancelar
                </Button>
                <Button
                  colorScheme="purple"
                  onClick={handleDevolucion}
                  isLoading={devolver.isPending}
                  borderRadius="lg"
                  isDisabled={!devolucionMotivo.trim()}
                >
                  Procesar Devolución
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Container>
      </Layout>
    </RequireAdmin>
  )
}
