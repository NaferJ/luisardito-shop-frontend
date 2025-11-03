import { Layout } from '../../../components/Layout'
import { RequireAdmin } from '../../../components/RequireAdmin'
import { UserBadge, UserAvatarWithBadge } from '../../../components/UserBadge'
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
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Flex,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Divider,
  Avatar,
  Alert,
  AlertIcon,
  Stack,
  Tag,
  TagLabel,
  TagCloseButton,
  FormControl,
  FormLabel,
} from '@chakra-ui/react'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/router'
import {
  useAdminUsuarios,
  useUpdateUsuarioPuntos,
  useRemoveVipFromUser,
  useGrantVipToUser,
  useManualBotrixMigration,
  UsuarioAdmin
} from '../../../hooks/useAdminUsuarios'
import {
  SettingsIcon,
  SearchIcon,
  EditIcon,
  ViewIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@chakra-ui/icons'
import Head from "next/head";

export default function AdminUsuariosPage() {
  const router = useRouter()
  const toast = useToast()

  // Estados originales
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<string>('id')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [filter, setFilter] = useState<'all' | 'vip' | 'migrated' | 'pending_migration' | 'subscribers'>('all')

  // Modales originales + nuevos
  const { isOpen: isPuntosOpen, onOpen: onPuntosOpen, onClose: onPuntosClose } = useDisclosure()
  const { isOpen: isVipOpen, onOpen: onVipOpen, onClose: onVipClose } = useDisclosure()
  const { isOpen: isMigrationOpen, onOpen: onMigrationOpen, onClose: onMigrationClose } = useDisclosure()

  // Estados para modales
  const [selectedUser, setSelectedUser] = useState<UsuarioAdmin | null>(null)
  const [puntos, setPuntos] = useState<number>(0)
  const [motivo, setMotivo] = useState('')
  const [vipDays, setVipDays] = useState<number | undefined>(30)
  const [migrationPoints, setMigrationPoints] = useState<number>(0)

  // Hooks de datos - usando el hook actualizado pero con lógica de filtrado local para compatibilidad
  const { data: usuariosData, isLoading, error } = useAdminUsuarios({
    page: 1,
    //limit: 100, // Cargar más para filtrado local
    filter: 'all'
  })

  const updatePuntos = useUpdateUsuarioPuntos()
  const removeVip = useRemoveVipFromUser()
  const grantVip = useGrantVipToUser()
  const manualMigration = useManualBotrixMigration()

  // Theme colors
  const cardBg = useColorModeValue('black.800', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const hoverBg = useColorModeValue('gray.50', 'gray.700')
  const headerBg = useColorModeValue('gray.50', 'gray.700')

  // Funciones de modal originales
  const openPuntosModal = (user: UsuarioAdmin) => {
    setSelectedUser(user)
    setPuntos(0)
    setMotivo('')
    onPuntosOpen()
  }

  const openVipModal = (user: UsuarioAdmin) => {
    setSelectedUser(user)
    setVipDays(30)
    onVipOpen()
  }

  const openMigrationModal = (user: UsuarioAdmin) => {
    setSelectedUser(user)
    setMigrationPoints(0)
    onMigrationOpen()
  }

  const savePuntos = async () => {
    if (!selectedUser || !motivo.trim()) {
      toast({
        title: 'Error',
        description: 'Debes proporcionar un motivo para el cambio de puntos',
        status: 'error',
        duration: 3000,
      })
      return
    }

    try {
      await updatePuntos.mutateAsync({
        usuarioId: selectedUser.id,
        puntos,
        motivo
      })
      toast({
        title: 'Puntos actualizados',
        description: `Se ${puntos >= 0 ? 'agregaron' : 'restaron'} ${Math.abs(puntos)} puntos a ${selectedUser.nickname || selectedUser.email}`,
        status: 'success'
      })
      onPuntosClose()
    } catch (e: any) {
      toast({
        title: 'Error',
        description: e?.response?.data?.error || 'No se pudo actualizar',
        status: 'error'
      })
    }
  }

  const handleGrantVip = async () => {
    if (!selectedUser) return

    try {
      await grantVip.mutateAsync({
        usuarioId: selectedUser.id,
        durationDays: vipDays
      })
      toast({
        title: 'VIP otorgado',
        description: `${selectedUser.nickname || selectedUser.email} ahora es VIP${vipDays ? ` por ${vipDays} días` : ' permanente'}`,
        status: 'success',
      })
      onVipClose()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo otorgar VIP',
        status: 'error',
        duration: 5000,
      })
    }
  }

  const handleRemoveVip = async (user: UsuarioAdmin) => {
    if (!confirm(`¿Estás seguro de remover VIP a ${user.nickname || user.email}?`)) return

    try {
      await removeVip.mutateAsync({
        usuarioId: user.id,
        reason: 'Removido manualmente por administrador'
      })
      toast({
        title: 'VIP removido',
        description: `Se removió el VIP de ${user.nickname || user.email}`,
        status: 'success',
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo remover VIP',
        status: 'error',
        duration: 5000,
      })
    }
  }

  const handleManualMigration = async () => {
    if (!selectedUser || migrationPoints <= 0) {
      toast({
        title: 'Error',
        description: 'Debes especificar una cantidad válida de puntos',
        status: 'error',
        duration: 3000,
      })
      return
    }

    try {
      await manualMigration.mutateAsync({
        usuarioId: selectedUser.id,
        pointsAmount: migrationPoints,
        kickUsername: selectedUser.nickname || selectedUser.email
      })
      toast({
        title: 'Migración completada',
        description: `Se migraron ${migrationPoints.toLocaleString()} puntos para ${selectedUser.nickname || selectedUser.email}`,
        status: 'success',
        duration: 3000,
      })
      onMigrationClose()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo completar la migración',
        status: 'error',
        duration: 5000,
      })
    }
  }

  // Lógica de filtrado y paginación original
  const processedData = useMemo(() => {
    if (!usuariosData?.users) return []

    let filtered = usuariosData.users.filter((user: UsuarioAdmin) => {
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch = (
        user.nickname?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.id.toString().includes(searchLower) ||
        user.discord_username?.toLowerCase().includes(searchLower)
      )

      if (!matchesSearch) return false

      // Aplicar filtros
      switch (filter) {
        case 'vip':
          return user.vip_status?.is_active
        case 'migrated':
          return user.migration_status?.points_migrated
        case 'pending_migration':
          return user.migration_status?.can_migrate && !user.migration_status?.points_migrated
        case 'subscribers':
          return user.user_type === 'subscriber'
        default:
          return true
      }
    })

    filtered.sort((a: UsuarioAdmin, b: UsuarioAdmin) => {
      let aVal = a[sortField as keyof UsuarioAdmin]
      let bVal = b[sortField as keyof UsuarioAdmin]

      if (sortField === 'nickname') {
        aVal = a.nickname || a.email || ''
        bVal = b.nickname || b.email || ''
      }

      if (typeof aVal === 'string') aVal = aVal.toLowerCase()
      if (typeof bVal === 'string') bVal = bVal.toLowerCase()

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [usuariosData?.users, searchTerm, sortField, sortDirection, filter])

  // Pagination original
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

  // Statistics originales + nuevas
  const stats = useMemo(() => {
    if (!usuariosData?.users) return null

    const usuarios = usuariosData.users
    const totalUsers = usuarios.length
    const totalPoints = usuarios.reduce((sum: number, user: UsuarioAdmin) => sum + (user.puntos || 0), 0)
    const avgPoints = Math.round(totalPoints / totalUsers)
    const usersWithCanjes = usuarios.filter((user: UsuarioAdmin) => (user.total_canjes || 0) > 0).length
    const vipUsers = usuarios.filter((user: UsuarioAdmin) => user.vip_status?.is_active).length
    const migratedUsers = usuarios.filter((user: UsuarioAdmin) => user.migration_status?.points_migrated).length

    return {
      totalUsers,
      totalPoints,
      avgPoints,
      usersWithCanjes,
      vipUsers,
      migratedUsers
    }
  }, [usuariosData?.users])

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
        <Head>
            <title>Gestión de Usuarios - Luisardito Shop</title>
            <meta name="description" content="Administra los usuarios de Luisardito Shop"/>
        </Head>
      <Layout>
        <Container maxW="container.xl" py={{ base: 4, md: 8 }} px={{ base: 4, md: 6 }}>
          <VStack spacing={{ base: 4, md: 6 }} align="stretch">
            {/* Header original */}
            <Box>
              <Heading size={{ base: 'lg', md: 'xl' }} mb={2} color="gray.800" _dark={{ color: 'white' }}>
                Gestión de Usuarios
              </Heading>
              <Text color="gray.600" _dark={{ color: 'gray.400' }}>
                Administra los usuarios registrados, VIPs, migración y puntos
              </Text>
            </Box>

            {/* Statistics Cards mejoradas */}
            {stats && (
              <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={4}>
                <Card bg={cardBg} shadow="md" borderRadius="xl">
                  <CardBody textAlign="center" py={6}>
                    <Stat>
                      <StatLabel color="black.600">Total Usuarios</StatLabel>
                      <StatNumber color="blue.600" fontSize="2xl">
                        {stats.totalUsers}
                      </StatNumber>
                    </Stat>
                  </CardBody>
                </Card>

                <Card bg={cardBg} shadow="md" borderRadius="xl">
                  <CardBody textAlign="center" py={6}>
                    <Stat>
                      <StatLabel color="black.600">VIPs</StatLabel>
                      <StatNumber color="yellow.600" fontSize="2xl">
                        {stats.vipUsers}
                      </StatNumber>
                    </Stat>
                  </CardBody>
                </Card>

                <Card bg={cardBg} shadow="md" borderRadius="xl">
                  <CardBody textAlign="center" py={6}>
                    <Stat>
                      <StatLabel color="black.600">Migrados</StatLabel>
                      <StatNumber color="cyan.600" fontSize="2xl">
                        {stats.migratedUsers}
                      </StatNumber>
                    </Stat>
                  </CardBody>
                </Card>

                <Card bg={cardBg} shadow="md" borderRadius="xl">
                  <CardBody textAlign="center" py={6}>
                    <Stat>
                      <StatLabel color="black.600">Puntos Totales</StatLabel>
                      <StatNumber color="green.600" fontSize="2xl">
                        {stats.totalPoints.toLocaleString()}
                      </StatNumber>
                    </Stat>
                  </CardBody>
                </Card>

                <Card bg={cardBg} shadow="md" borderRadius="xl">
                  <CardBody textAlign="center" py={6}>
                    <Stat>
                      <StatLabel color="black.600">Promedio</StatLabel>
                      <StatNumber color="purple.600" fontSize="2xl">
                        {stats.avgPoints.toLocaleString()}
                      </StatNumber>
                    </Stat>
                  </CardBody>
                </Card>

                <Card bg={cardBg} shadow="md" borderRadius="xl">
                  <CardBody textAlign="center" py={6}>
                    <Stat>
                      <StatLabel color="black.600">Con Canjes</StatLabel>
                      <StatNumber color="orange.600" fontSize="2xl">
                        {stats.usersWithCanjes}
                      </StatNumber>
                    </Stat>
                  </CardBody>
                </Card>
              </SimpleGrid>
            )}

            {/* Search and Filters mejorado */}
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

                  <Select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    w={{ base: 'full', md: '200px' }}
                    borderRadius="lg"
                  >
                    <option value="all">Todos los usuarios</option>
                    <option value="vip">Solo VIPs</option>
                    <option value="subscribers">Solo suscriptores</option>
                    <option value="migrated">Ya migrados</option>
                    <option value="pending_migration">Pendientes migración</option>
                  </Select>

                  <HStack spacing={4}>
                    <Text fontSize="sm" color="black.600" whiteSpace="nowrap">
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

                  {(searchTerm || filter !== 'all') && (
                    <Tag
                      size="md"
                      colorScheme="blue"
                      borderRadius="full"
                    >
                      <TagLabel>{processedData.length} resultados</TagLabel>
                      <TagCloseButton onClick={() => {
                        setSearchTerm('')
                        setFilter('all')
                      }} />
                    </Tag>
                  )}
                </Stack>
              </CardBody>
            </Card>

            {/* Users Table original + nuevas funcionalidades */}
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
                        onClick={() => handleSort('creado')}
                        _hover={{ bg: hoverBg }}
                        display={{ base: 'none', md: 'table-cell' }}
                      >
                        <HStack>
                          <Text>Fecha de Registro</Text>
                          {sortField === 'creado' && (
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
                      <Th display={{ base: 'none', lg: 'table-cell' }}>Estado</Th>
                      <Th display={{ base: 'none', lg: 'table-cell' }}>Canjes</Th>
                      <Th>Acciones</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {paginatedData.map((user: UsuarioAdmin) => (
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
                            <UserAvatarWithBadge user={user}>
                              <Avatar
                                size="sm"
                                name={user.nickname || user.email}
                              />
                            </UserAvatarWithBadge>
                            <VStack align="start" spacing={0}>
                              <HStack>
                                <Text fontWeight="medium" fontSize="sm">
                                  {user.nickname || 'Sin username'}
                                </Text>
                                <UserBadge user={user} size="sm" />
                              </HStack>
                              {user.discord_username && (
                                <Text fontSize="xs" color="purple.500">
                                  Discord: {user.discord_username}
                                </Text>
                              )}
                            </VStack>
                          </HStack>
                        </Td>
                        <Td display={{ base: 'none', md: 'table-cell' }}>
                          <Text fontSize="sm" color="gray.500">
                            {user.creado ? new Date(user.creado).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            }) : 'N/A'}
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
                            {user.vip_status?.is_active && (
                              <Badge colorScheme="yellow" fontSize="xs">
                                VIP {user.vip_status.is_permanent ? 'Permanente' : 'Temporal'}
                              </Badge>
                            )}
                            {user.migration_status?.points_migrated ? (
                              <Badge colorScheme="cyan" fontSize="xs">
                                🔄 {user.migration_status.points_migrated.toLocaleString()} pts
                              </Badge>
                            ) : user.migration_status?.can_migrate ? (
                              <Badge colorScheme="orange" fontSize="xs">
                                ⏳ Pendiente migración
                              </Badge>
                            ) : null}
                          </VStack>
                        </Td>
                        <Td display={{ base: 'none', lg: 'table-cell' }}>
                          <VStack align="start" spacing={1}>
                            <Text fontSize="sm">
                              Total: {user.total_canjes || 0}
                            </Text>
                            {(user.canjes_pendientes || 0) > 0 && (
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
                                p={2}
                                minW="180px"
                              >
                                <MenuItem
                                  icon={<EditIcon />}
                                  onClick={() => openPuntosModal(user)}
                                  borderRadius="lg"
                                >
                                  Editar puntos
                                </MenuItem>
                                <MenuItem
                                  icon={<ViewIcon />}
                                  onClick={() => router.push(`/admin/usuarios/${user.id}`)}
                                  borderRadius="lg"
                                >
                                  Ver canjes
                                </MenuItem>
                                {user.vip_status?.is_active ? (
                                  <MenuItem
                                    icon={<SettingsIcon />}
                                    onClick={() => handleRemoveVip(user)}
                                    borderRadius="lg"
                                    color="red.500"
                                  >
                                    Remover VIP
                                  </MenuItem>
                                ) : (
                                  <MenuItem
                                    icon={<SettingsIcon />}
                                    onClick={() => openVipModal(user)}
                                    borderRadius="lg"
                                    color="yellow.500"
                                  >
                                    Otorgar VIP
                                  </MenuItem>
                                )}
                                {!user.migration_status?.points_migrated && (
                                  <MenuItem
                                    icon={<SettingsIcon />}
                                    onClick={() => openMigrationModal(user)}
                                    borderRadius="lg"
                                    color="cyan.500"
                                  >
                                    Migración manual
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

              {/* Pagination original */}
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

          {/* Modal original para editar puntos */}
          <Modal isOpen={isPuntosOpen} onClose={onPuntosClose} isCentered>
            <ModalOverlay backdropFilter="blur(10px)" />
            <ModalContent borderRadius="2xl" mx={4}>
              <ModalHeader>
                <VStack align="start" spacing={1}>
                  <Text>✏️ Editar Puntos</Text>
                  <Text fontSize="sm" fontWeight="normal" color="gray.600">
                    Usuario: {selectedUser?.nickname || selectedUser?.email}
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

                  <FormControl>
                    <Text mb={2} fontWeight="medium">Cambio de puntos:</Text>
                    <NumberInput
                      value={puntos}
                      onChange={(_, val) => setPuntos(val)}
                    >
                      <NumberInputField
                        borderRadius="lg"
                        placeholder="Ej: 1000 (positivo) o -500 (negativo)"
                      />
                    </NumberInput>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Motivo</FormLabel>
                    <Input
                      value={motivo}
                      onChange={(e) => setMotivo(e.target.value)}
                      placeholder="Ej: Ajuste manual, premio por evento, etc."
                      borderRadius="lg"
                    />
                  </FormControl>

                  <Alert status="info" borderRadius="lg">
                    <AlertIcon />
                    <Text fontSize="sm">
                      Esta acción creará un registro en el historial de puntos del usuario.
                    </Text>
                  </Alert>
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" mr={3} onClick={onPuntosClose} borderRadius="lg">
                  Cancelar
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={savePuntos}
                  isLoading={updatePuntos.isPending}
                  borderRadius="lg"
                >
                  Guardar Cambios
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* Modal para otorgar VIP */}
          <Modal isOpen={isVipOpen} onClose={onVipClose} isCentered>
            <ModalOverlay backdropFilter="blur(10px)" />
            <ModalContent borderRadius="2xl" mx={4}>
              <ModalHeader>
                <VStack align="start" spacing={1}>
                  <HStack>
                    <SettingsIcon />
                    <Text>Otorgar VIP</Text>
                  </HStack>
                  <Text fontSize="sm" fontWeight="normal" color="gray.600">
                    Usuario: {selectedUser?.nickname || selectedUser?.email}
                  </Text>
                </VStack>
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel>Duración (días)</FormLabel>
                    <NumberInput value={vipDays} onChange={(_, value) => setVipDays(value)}>
                      <NumberInputField
                        placeholder="Ej: 30 (dejar vacío para permanente)"
                        borderRadius="lg"
                      />
                    </NumberInput>
                    <Text fontSize="xs" color="gray.500" mt={1}>
                      Deja vacío o 0 para VIP permanente
                    </Text>
                  </FormControl>
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" mr={3} onClick={onVipClose} borderRadius="lg">
                  Cancelar
                </Button>
                <Button
                  colorScheme="yellow"
                  onClick={handleGrantVip}
                  isLoading={grantVip.isPending}
                  borderRadius="lg"
                >
                  Otorgar VIP
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* Modal para migración manual */}
          <Modal isOpen={isMigrationOpen} onClose={onMigrationClose} isCentered>
            <ModalOverlay backdropFilter="blur(10px)" />
            <ModalContent borderRadius="2xl" mx={4}>
              <ModalHeader>
                <VStack align="start" spacing={1}>
                  <HStack>
                    <SettingsIcon />
                    <Text>Migración Manual</Text>
                  </HStack>
                  <Text fontSize="sm" fontWeight="normal" color="gray.600">
                    Usuario: {selectedUser?.nickname || selectedUser?.email}
                  </Text>
                </VStack>
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel>Puntos a migrar</FormLabel>
                    <NumberInput
                      value={migrationPoints}
                      onChange={(_, value) => setMigrationPoints(value)}
                    >
                      <NumberInputField
                        placeholder="Ej: 50000"
                        borderRadius="lg"
                      />
                    </NumberInput>
                    <Text fontSize="xs" color="gray.500" mt={1}>
                      Cantidad de puntos que tenía en Botrix
                    </Text>
                  </FormControl>
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" mr={3} onClick={onMigrationClose} borderRadius="lg">
                  Cancelar
                </Button>
                <Button
                  colorScheme="cyan"
                  onClick={handleManualMigration}
                  isLoading={manualMigration.isPending}
                  borderRadius="lg"
                >
                  Migrar puntos
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Container>
      </Layout>
    </RequireAdmin>
  )
}
