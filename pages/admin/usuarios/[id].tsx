import { Layout } from '../../../components/Layout'
import { RequireAdmin } from '../../../components/RequireAdmin'
import { ActionsMenu } from '../../../components/ActionsMenu'
import { useRouter } from 'next/router'
import { useAdminUsuario } from '../../../hooks/useAdminUsuario'
import { useAdminUsuarioCanjes } from '../../../hooks/useAdminUsuarioCanjes'
import { useUpdateCanjeEstado, useDevolverCanje } from '../../../hooks/useAdminCanjes'
import {
  Container,
  Heading,
  Spinner,
  Center,
  Text,
  HStack,
  VStack,
  Button,
  Badge,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useToast,
  useColorModeValue,
  Portal,
  Box,
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
  Alert,
  AlertIcon,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
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
  Image,
  Tooltip
} from '@chakra-ui/react'
import {
  SettingsIcon,
  ArrowBackIcon,
  SearchIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@chakra-ui/icons'
import { MdPending, MdCheckCircle, MdCancel, MdUndo, MdShoppingBag } from 'react-icons/md'
import { useMemo, useState } from 'react'
import Head from 'next/head'

export default function AdminUsuarioGestionPage() {
  const router = useRouter()
  const { id } = router.query

  // Primero obtener el usuario por ID o slug para obtener el ID numérico
  const {
    data: usuario,
    isLoading: isLoadingUsuario,
    error: errorUsuario
  } = useAdminUsuario(id as string)

  // Una vez tenemos el usuario, obtener sus canjes usando el ID numérico
  const {
    data: canjes,
    isLoading: isLoadingCanjes,
    error: errorCanjes,
    refetch
  } = useAdminUsuarioCanjes(usuario?.id)
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
  const [pageSize, setPageSize] = useState(20)
  const [currentPage, setCurrentPage] = useState(1)

  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const hoverBg = useColorModeValue('gray.50', 'gray.700')
  const textColor = useColorModeValue('gray.800', 'white')
  const mutedColor = useColorModeValue('gray.600', 'gray.400')
  const statBg = useColorModeValue('gray.50', 'gray.700')

  const userInfo = useMemo(() => {
    if (usuario) {
      return {
        id: usuario.id,
        nickname: usuario.nickname || String(usuario.id),
        nombre: usuario.nombre,
        email: usuario.email,
        kick_username: (usuario as any).kick_username,
        kick_avatar: (usuario as any).kick_avatar,
        discord_username: usuario.discord_username,
        puntos: usuario.puntos || 0
      }
    }

    // Fallback: obtener info del primer canje si no tenemos usuario
    if (!canjes || canjes.length === 0) return null
    const firstCanje = canjes[0]
    const usuarioFromCanje = firstCanje?.Usuario || firstCanje?.usuario
    return {
      id: usuarioFromCanje?.id || id,
      nickname: usuarioFromCanje?.nickname || id,
      nombre: usuarioFromCanje?.nombre,
      email: usuarioFromCanje?.email,
      kick_username: usuarioFromCanje?.kick_username,
      kick_avatar: usuarioFromCanje?.kick_avatar,
      discord_username: usuarioFromCanje?.discord_username,
      puntos: usuarioFromCanje?.puntos || 0
    }
  }, [usuario, canjes, id])

  const processedData = useMemo(() => {
    if (!canjes) return []

    let filtered = canjes.filter((canje: any) => {
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch =
        canje?.Producto?.nombre?.toLowerCase().includes(searchLower) ||
        canje.id.toString().includes(searchLower) ||
        canje.estado.toLowerCase().includes(searchLower)

      const matchesFilter = filterEstado === 'todos' || canje.estado === filterEstado

      return matchesSearch && matchesFilter
    })

    return filtered.sort((a: any, b: any) => {
      let aVal = a[sortField]
      let bVal = b[sortField]

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
  }, [canjes, searchTerm, sortField, sortDirection, filterEstado])

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
      case 'pendiente':
        return 'yellow'
      case 'entregado':
        return 'green'
      case 'cancelado':
        return 'red'
      case 'devuelto':
        return 'purple'
      default:
        return 'gray'
    }
  }

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return MdPending
      case 'entregado':
        return MdCheckCircle
      case 'cancelado':
        return MdCancel
      case 'devuelto':
        return MdUndo
      default:
        return MdShoppingBag
    }
  }

  const handleUpdateEstado = async (canjeId: number, nuevoEstado: string) => {
    try {
      await updateEstado.mutateAsync({ canjeId, estado: nuevoEstado })
      toast({
        title: 'Actualizado',
        description: `Canje marcado como ${nuevoEstado}`,
        status: 'success',
        duration: 3000,
        isClosable: true
      })
      refetch()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    }
  }

  const handleDevolucion = async () => {
    if (!selectedCanje || !devolucionMotivo.trim()) {
      toast({
        title: 'Error',
        description: 'Debe proporcionar un motivo',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
      return
    }

    try {
      await devolver.mutateAsync({
        canjeId: selectedCanje.id,
        motivo: devolucionMotivo.trim()
      })
      toast({
        title: 'Devuelto',
        description: 'Los puntos han sido devueltos',
        status: 'success',
        duration: 3000,
        isClosable: true
      })
      onClose()
      setSelectedCanje(null)
      setDevolucionMotivo('')
      refetch()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo procesar la devolución',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    }
  }

  const openDevolucionModal = (canje: any) => {
    setSelectedCanje(canje)
    setDevolucionMotivo('')
    onOpen()
  }

  const isLoading = isLoadingUsuario || isLoadingCanjes
  const error = errorUsuario || errorCanjes

  if (isLoading) {
    return (
      <RequireAdmin>
        <Layout>
          <Container maxW="container.xl" py={8}>
            <Center minH="60vh">
              <VStack spacing={3}>
                <Spinner size="xl" color="blue.500" thickness="3px" />
                <Text color={mutedColor}>Cargando información del usuario...</Text>
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
                <Text fontWeight="semibold">Error al cargar canjes del usuario</Text>
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
        <title>
          Canjes de {userInfo?.kick_username || userInfo?.nickname || 'Usuario'} - Admin
        </title>
        <meta name="description" content="Gestión de canjes del usuario" />
      </Head>
      <Layout>
        <Container maxW="container.xl" py={{ base: 4, md: 6 }} px={{ base: 4, md: 6 }}>
          <VStack spacing={6} align="stretch">
            {/* Header con info del usuario */}
            <Flex direction={{ base: 'column', md: 'row' }} gap={4} align="start">
              <Button
                leftIcon={<ArrowBackIcon />}
                variant="outline"
                onClick={() => router.push('/admin/usuarios')}
                size="sm"
              >
                Volver
              </Button>

              {userInfo && (
                <Flex align="center" gap={4} flex="1">
                  <Avatar
                    size="lg"
                    name={
                      userInfo.kick_username ||
                      userInfo.nickname ||
                      userInfo.nombre ||
                      userInfo.email
                    }
                    src={userInfo.kick_avatar}
                    borderWidth="2px"
                    borderColor={borderColor}
                  />
                  <VStack align="start" spacing={1}>
                    <Heading size="md" color={textColor}>
                      {userInfo?.kick_username ||
                        userInfo?.nickname ||
                        userInfo?.nombre ||
                        `Usuario #${userInfo.id}`}
                    </Heading>
                    {userInfo.discord_username && (
                      <Text fontSize="sm" color="purple.500">
                        {userInfo.discord_username}
                      </Text>
                    )}
                    <HStack spacing={2}>
                      {userInfo.kick_username && (
                        <Badge colorScheme="green" fontSize="xs">
                          Kick
                        </Badge>
                      )}
                      {userInfo.discord_username && (
                        <Badge colorScheme="purple" fontSize="xs">
                          Discord
                        </Badge>
                      )}
                      <Badge colorScheme="yellow" fontSize="xs">
                        {userInfo.puntos?.toLocaleString()} pts
                      </Badge>
                    </HStack>
                  </VStack>
                </Flex>
              )}
            </Flex>

            {/* Estadísticas */}
            {stats && (
              <SimpleGrid columns={{ base: 3, md: 5 }} spacing={3}>
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
                    {stats.total}
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
                    <MdPending size={18} color="orange" />
                    <Text fontSize="xs" color={mutedColor} fontWeight="medium">
                      Pendientes
                    </Text>
                  </HStack>
                  <Text fontSize="2xl" fontWeight="bold" color="yellow.600">
                    {stats.pendientes}
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
                      Entregados
                    </Text>
                  </HStack>
                  <Text fontSize="2xl" fontWeight="bold" color="green.600">
                    {stats.entregados}
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
                    <MdCancel size={18} color="red" />
                    <Text fontSize="xs" color={mutedColor} fontWeight="medium">
                      Cancelados
                    </Text>
                  </HStack>
                  <Text fontSize="2xl" fontWeight="bold" color="red.600">
                    {stats.cancelados}
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
                    <MdUndo size={18} color="purple" />
                    <Text fontSize="xs" color={mutedColor} fontWeight="medium">
                      Devueltos
                    </Text>
                  </HStack>
                  <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                    {stats.devueltos}
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
                    placeholder="Buscar canjes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    borderRadius="lg"
                  />
                </InputGroup>

                <Select
                  value={filterEstado}
                  onChange={(e) => setFilterEstado(e.target.value)}
                  w={{ base: 'full', md: '150px' }}
                  borderRadius="lg"
                >
                  <option value="todos">Todos</option>
                  <option value="pendiente">Pendientes</option>
                  <option value="entregado">Entregados</option>
                  <option value="cancelado">Cancelados</option>
                  <option value="devuelto">Devueltos</option>
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
                  </Select>
                </HStack>

                {(searchTerm || filterEstado !== 'todos') && (
                  <Badge colorScheme="blue" fontSize="sm" px={3} py={1} borderRadius="full">
                    {processedData.length} resultados
                  </Badge>
                )}
              </Flex>
            </Box>

            {/* Tabla de canjes */}
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
                        onClick={() => handleSort('fecha')}
                        _hover={{ bg: hoverBg }}
                        display={{ base: 'none', md: 'table-cell' }}
                      >
                        <HStack spacing={1}>
                          <Text>Fecha</Text>
                          {sortField === 'fecha' &&
                            (sortDirection === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />)}
                        </HStack>
                      </Th>
                      <Th py={3}>Puntos</Th>
                      <Th py={3}>Estado</Th>
                      <Th py={3}>Acciones</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {paginatedData.map((canje: any) => (
                      <Tr key={canje.id} _hover={{ bg: hoverBg }} transition="all 0.2s">
                        <Td py={3}>
                          <HStack spacing={3}>
                            <Image
                              src={canje.Producto?.imagen_url || '/placeholder.png'}
                              alt={canje.Producto?.nombre || 'Producto'}
                              boxSize="40px"
                              objectFit="cover"
                              borderRadius="md"
                              fallbackSrc="/placeholder.png"
                            />
                            <VStack align="start" spacing={0}>
                              <Text fontSize="sm" fontWeight="medium" color={textColor}>
                                {canje.Producto?.nombre || 'Producto eliminado'}
                              </Text>
                              {canje.Producto?.descripcion && (
                                <Tooltip
                                  label={canje.Producto.descripcion}
                                  placement="top"
                                  hasArrow
                                >
                                  <Text
                                    fontSize="xs"
                                    color={mutedColor}
                                    noOfLines={1}
                                    maxW="200px"
                                    cursor="help"
                                  >
                                    {canje.Producto.descripcion}
                                  </Text>
                                </Tooltip>
                              )}
                            </VStack>
                          </HStack>
                        </Td>
                        <Td py={3} display={{ base: 'none', md: 'table-cell' }}>
                          <Text fontSize="sm" color={mutedColor}>
                            {canje.fecha
                              ? new Date(canje.fecha).toLocaleDateString('es-ES', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                              : 'N/A'}
                          </Text>
                        </Td>
                        <Td py={3}>
                          <Badge colorScheme="orange" fontSize="sm" fontWeight="semibold">
                            {canje.Producto?.precio?.toLocaleString() || 0}
                          </Badge>
                        </Td>
                        <Td py={3}>
                          <Badge
                            colorScheme={getEstadoColor(canje.estado)}
                            fontSize="sm"
                            display="flex"
                            alignItems="center"
                            gap={1}
                            w="fit-content"
                          >
                            <Box as={getEstadoIcon(canje.estado)} size="14px" />
                            {canje.estado}
                          </Badge>
                        </Td>
                        <Td py={3}>
                          <ActionsMenu
                            items={[
                              ...(canje.estado !== 'entregado'
                                ? [
                                    {
                                      label: 'Marcar entregado',
                                      icon: SettingsIcon,
                                      onClick: () => handleUpdateEstado(canje.id, 'entregado'),
                                      colorScheme: 'green' as const
                                    }
                                  ]
                                : []),
                              ...(canje.estado !== 'cancelado'
                                ? [
                                    {
                                      label: 'Cancelar canje',
                                      icon: SettingsIcon,
                                      onClick: () => handleUpdateEstado(canje.id, 'cancelado'),
                                      colorScheme: 'red' as const
                                    }
                                  ]
                                : []),
                              ...(canje.estado !== 'devuelto'
                                ? [
                                    {
                                      label: 'Devolver puntos',
                                      icon: SettingsIcon,
                                      onClick: () => openDevolucionModal(canje),
                                      colorScheme: 'purple' as const
                                    }
                                  ]
                                : [])
                            ]}
                          />
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

          {/* Modal de devolución */}
          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent mx={4} borderRadius="xl">
              <ModalHeader>
                <VStack align="start" spacing={1}>
                  <Text>Devolver Puntos</Text>
                  <Text fontSize="sm" fontWeight="normal" color={mutedColor}>
                    Canje #{selectedCanje?.id}
                  </Text>
                </VStack>
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <VStack spacing={4} align="stretch">
                  <Box>
                    <Text fontSize="sm" mb={2} color={mutedColor}>
                      Producto:
                    </Text>
                    <Text fontWeight="medium">{selectedCanje?.Producto?.nombre}</Text>
                  </Box>

                  <Box>
                    <Text fontSize="sm" mb={2} color={mutedColor}>
                      Puntos a devolver:
                    </Text>
                    <Badge colorScheme="orange" fontSize="lg" px={3} py={1}>
                      {selectedCanje?.puntos_canjeados?.toLocaleString() || 0}
                    </Badge>
                  </Box>

                  <FormControl>
                    <FormLabel fontSize="sm">Motivo de la devolución</FormLabel>
                    <Textarea
                      value={devolucionMotivo}
                      onChange={(e) => setDevolucionMotivo(e.target.value)}
                      placeholder="Ej: Error en la entrega, producto no disponible, etc."
                      rows={3}
                    />
                  </FormControl>
                </VStack>
              </ModalBody>
              <ModalFooter gap={3}>
                <Button variant="ghost" onClick={onClose}>
                  Cancelar
                </Button>
                <Button
                  colorScheme="purple"
                  onClick={handleDevolucion}
                  isLoading={devolver.isPending}
                >
                  Devolver
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Container>
      </Layout>
    </RequireAdmin>
  )
}
