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
  NumberInput,
  NumberInputField,
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
  WrapItem
} from '@chakra-ui/react'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useAdminUsuarios, useUpdateUsuarioPuntos, UsuarioAdmin } from '../../../hooks/useAdminUsuarios'
import {
  SettingsIcon,
  SearchIcon,
  EditIcon,
  ViewIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  AddIcon
} from '@chakra-ui/icons'

export default function AdminUsuariosPage() {
  const { data: usuarios, isLoading, error } = useAdminUsuarios({ limit: 50, offset: 0 })
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedUser, setSelectedUser] = useState<{ id: number; nickname?: string; puntos: number } | null>(null)
  const [puntos, setPuntos] = useState<number>(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<string>('id')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  const updatePuntos = useUpdateUsuarioPuntos()
  const toast = useToast()
  const router = useRouter()

  // Theme colors
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const hoverBg = useColorModeValue('gray.50', 'gray.700')
  const headerBg = useColorModeValue('gray.50', 'gray.700')

  const openModal = (u: UsuarioAdmin) => {
    setSelectedUser({ id: u.id, nickname: (u as any).nickname || u.nombre, puntos: u.puntos })
    setPuntos(u.puntos)
    onOpen()
  }

  const savePuntos = async () => {
    if (!selectedUser) return
    try {
      await updatePuntos.mutateAsync({
        usuarioId: selectedUser.id,
        puntos,
        motivo: 'Ajuste manual admin'
      })
      toast({
        title: '✅ Puntos actualizados',
        description: `Se actualizaron los puntos de ${selectedUser.nickname}`,
        status: 'success'
      })
      onClose()
    } catch (e: any) {
      toast({
        title: 'Error',
        description: e?.response?.data?.error || 'No se pudo actualizar',
        status: 'error'
      })
    }
  }

  // Filtered and sorted data
  const processedData = useMemo(() => {
    if (!usuarios) return []

    let filtered = usuarios.filter((user: any) => {
      const searchLower = searchTerm.toLowerCase()
      return (
        user.nickname?.toLowerCase().includes(searchLower) ||
        user.nombre?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.id.toString().includes(searchLower)
      )
    })

    filtered.sort((a: any, b: any) => {
      let aVal = a[sortField]
      let bVal = b[sortField]

      if (sortField === 'nickname') {
        aVal = a.nickname || a.nombre || ''
        bVal = b.nickname || b.nombre || ''
      }

      if (typeof aVal === 'string') aVal = aVal.toLowerCase()
      if (typeof bVal === 'string') bVal = bVal.toLowerCase()

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [usuarios, searchTerm, sortField, sortDirection])

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
    if (!usuarios) return null

    const totalUsers = usuarios.length
    const totalPoints = usuarios.reduce((sum: number, user: any) => sum + (user.puntos || 0), 0)
    const avgPoints = Math.round(totalPoints / totalUsers)
    const usersWithCanjes = usuarios.filter((user: any) => (user.total_canjes || 0) > 0).length

    return { totalUsers, totalPoints, avgPoints, usersWithCanjes }
  }, [usuarios])

  if (isLoading) {
    return (
      <RequireAdmin>
        <Layout>
          <Container maxW="container.xl" py={8}>
            <Center minH="50vh">
              <VStack spacing={4}>
                <Spinner size="xl" color="blue.500" thickness="4px" />
                <Text fontSize="lg" color="gray.600">Cargando usuarios...</Text>
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
                <Text fontWeight="bold">Error al cargar usuarios</Text>
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
      <Layout>
        <Container maxW="container.xl" py={{ base: 4, md: 8 }} px={{ base: 4, md: 6 }}>
          <VStack spacing={{ base: 4, md: 6 }} align="stretch">
            {/* Header */}
            <Box>
              <Heading size={{ base: 'lg', md: 'xl' }} mb={2} color="gray.800" _dark={{ color: 'white' }}>
                👥 Gestión de Usuarios
              </Heading>
              <Text color="gray.600" _dark={{ color: 'gray.400' }}>
                Administra los usuarios registrados y sus puntos
              </Text>
            </Box>

            {/* Statistics Cards */}
            {stats && (
              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                <Card bg={cardBg} shadow="md" borderRadius="xl">
                  <CardBody textAlign="center" py={6}>
                    <Stat>
                      <StatLabel color="gray.600">Total Usuarios</StatLabel>
                      <StatNumber color="blue.600" fontSize="2xl">
                        {stats.totalUsers}
                      </StatNumber>
                    </Stat>
                  </CardBody>
                </Card>

                <Card bg={cardBg} shadow="md" borderRadius="xl">
                  <CardBody textAlign="center" py={6}>
                    <Stat>
                      <StatLabel color="gray.600">Puntos Totales</StatLabel>
                      <StatNumber color="green.600" fontSize="2xl">
                        {stats.totalPoints.toLocaleString()}
                      </StatNumber>
                    </Stat>
                  </CardBody>
                </Card>

                <Card bg={cardBg} shadow="md" borderRadius="xl">
                  <CardBody textAlign="center" py={6}>
                    <Stat>
                      <StatLabel color="gray.600">Promedio Puntos</StatLabel>
                      <StatNumber color="purple.600" fontSize="2xl">
                        {stats.avgPoints.toLocaleString()}
                      </StatNumber>
                    </Stat>
                  </CardBody>
                </Card>

                <Card bg={cardBg} shadow="md" borderRadius="xl">
                  <CardBody textAlign="center" py={6}>
                    <Stat>
                      <StatLabel color="gray.600">Con Canjes</StatLabel>
                      <StatNumber color="orange.600" fontSize="2xl">
                        {stats.usersWithCanjes}
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
                      placeholder="Buscar usuarios..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      borderRadius="lg"
                    />
                  </InputGroup>

                  <HStack spacing={4}>
                    <Text fontSize="sm" color="gray.600" whiteSpace="nowrap">
                      Mostrar:
                    </Text>
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
                  </HStack>

                  {searchTerm && (
                    <Tag
                      size="md"
                      colorScheme="blue"
                      borderRadius="full"
                    >
                      <TagLabel>{processedData.length} resultados</TagLabel>
                      <TagCloseButton onClick={() => setSearchTerm('')} />
                    </Tag>
                  )}
                </Stack>
              </CardBody>
            </Card>

            {/* Users Table */}
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
                      <Th>Usuario</Th>
                      <Th
                        cursor="pointer"
                        onClick={() => handleSort('email')}
                        _hover={{ bg: hoverBg }}
                        display={{ base: 'none', md: 'table-cell' }}
                      >
                        <HStack>
                          <Text>Email</Text>
                          {sortField === 'email' && (
                            sortDirection === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />
                          )}
                        </HStack>
                      </Th>
                      <Th
                        cursor="pointer"
                        onClick={() => handleSort('puntos')}
                        _hover={{ bg: hoverBg }}
                      >
                        <HStack>
                          <Text>Puntos</Text>
                          {sortField === 'puntos' && (
                            sortDirection === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />
                          )}
                        </HStack>
                      </Th>
                      <Th display={{ base: 'none', lg: 'table-cell' }}>Canjes</Th>
                      <Th>Acciones</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {paginatedData.map((user: any) => (
                      <Tr
                        key={user.id}
                        _hover={{ bg: hoverBg }}
                        transition="all 0.2s"
                      >
                        <Td fontWeight="bold" color="blue.600">
                          #{user.id}
                        </Td>
                        <Td>
                          <HStack spacing={3}>
                            <Avatar
                              size="sm"
                              name={user.nickname || user.nombre || user.email}
                              src={user.kick_avatar}
                            />
                            <VStack align="start" spacing={0}>
                              <Text fontWeight="medium" fontSize="sm">
                                {user.nickname || user.nombre || 'Sin nombre'}
                              </Text>
                              <Text fontSize="xs" color="gray.500" display={{ base: 'block', md: 'none' }}>
                                {user.email}
                              </Text>
                              {user.kick_username && (
                                <Badge colorScheme="green" fontSize="xs">
                                  Kick: {user.kick_username}
                                </Badge>
                              )}
                            </VStack>
                          </HStack>
                        </Td>
                        <Td display={{ base: 'none', md: 'table-cell' }}>
                          <Text fontSize="sm" color="gray.600">
                            {user.email}
                          </Text>
                        </Td>
                        <Td>
                          <Badge
                            colorScheme="yellow"
                            fontSize="sm"
                            px={3}
                            py={1}
                            borderRadius="full"
                          >
                            {user.puntos?.toLocaleString() || 0}
                          </Badge>
                        </Td>
                        <Td display={{ base: 'none', lg: 'table-cell' }}>
                          <VStack align="start" spacing={1}>
                            <Text fontSize="sm">
                              Total: {user.total_canjes || 0}
                            </Text>
                            {user.canjes_pendientes > 0 && (
                              <Badge colorScheme="orange" fontSize="xs">
                                {user.canjes_pendientes} pendientes
                              </Badge>
                            )}
                          </VStack>
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
                              >
                                <MenuItem
                                  icon={<EditIcon />}
                                  onClick={() => openModal(user)}
                                  borderRadius="lg"
                                  mx={1}
                                >
                                  Editar puntos
                                </MenuItem>
                                <MenuItem
                                  icon={<ViewIcon />}
                                  onClick={() => router.push(`/admin/usuarios/${user.id}`)}
                                  borderRadius="lg"
                                  mx={1}
                                >
                                  Ver canjes
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
                      Mostrando {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, processedData.length)} de {processedData.length} usuarios
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
          </VStack>

          {/* Edit Points Modal */}
          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay backdropFilter="blur(10px)" />
            <ModalContent borderRadius="2xl" mx={4}>
              <ModalHeader>
                <VStack align="start" spacing={1}>
                  <Text>✏️ Editar Puntos</Text>
                  <Text fontSize="sm" fontWeight="normal" color="gray.600">
                    Usuario: {selectedUser?.nickname}
                  </Text>
                </VStack>
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <VStack spacing={4} align="stretch">
                  <Box>
                    <Text mb={2} fontWeight="medium">Puntos actuales:</Text>
                    <Badge colorScheme="blue" fontSize="lg" px={4} py={2} borderRadius="lg">
                      {selectedUser?.puntos?.toLocaleString() || 0} puntos
                    </Badge>
                  </Box>

                  <Box>
                    <Text mb={2} fontWeight="medium">Nuevos puntos:</Text>
                    <NumberInput
                      value={puntos}
                      onChange={(_, val) => setPuntos(val)}
                      min={0}
                      max={999999999}
                    >
                      <NumberInputField borderRadius="lg" />
                    </NumberInput>
                  </Box>

                  <Alert status="info" borderRadius="lg">
                    <AlertIcon />
                    <Text fontSize="sm">
                      Esta acción creará un registro en el historial de puntos del usuario.
                    </Text>
                  </Alert>
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" mr={3} onClick={onClose} borderRadius="lg">
                  Cancelar
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={savePuntos}
                  isLoading={updatePuntos.isLoading}
                  borderRadius="lg"
                >
                  Guardar Cambios
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Container>
      </Layout>
    </RequireAdmin>
  )
}
