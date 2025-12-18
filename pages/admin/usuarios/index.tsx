import { Layout } from '../../../components/Layout'
import { RequireAdmin } from '../../../components/RequireAdmin'
import { UserBadge, UserAvatarWithBadge } from '../../../components/UserBadge'
import { StyledModal } from '../../../components/StyledModal'
import { ActionsMenu } from '../../../components/ActionsMenu'
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
  NumberInput,
  NumberInputField,
  useToast,
  Text,
  useColorModeValue,
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
  Avatar,
  Alert,
  AlertIcon,
  Icon
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
  ChevronUpIcon
} from '@chakra-ui/icons'
import { MdPeople, MdStar, MdSwapHoriz, MdTrendingUp } from 'react-icons/md'
import { FaTrophy, FaUserCheck, FaCoins, FaExchangeAlt } from 'react-icons/fa'
import Head from 'next/head'

export default function AdminUsuariosPage() {
  const router = useRouter()
  const toast = useToast()

  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<string>('id')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [pageSize, setPageSize] = useState(20)
  const [currentPage, setCurrentPage] = useState(1)
  const [filter, setFilter] = useState<
    'all' | 'vip' | 'migrated' | 'pending_migration' | 'subscribers'
  >('all')

  const { isOpen: isPuntosOpen, onOpen: onPuntosOpen, onClose: onPuntosClose } = useDisclosure()
  const { isOpen: isVipOpen, onOpen: onVipOpen, onClose: onVipClose } = useDisclosure()
  const {
    isOpen: isMigrationOpen,
    onOpen: onMigrationOpen,
    onClose: onMigrationClose
  } = useDisclosure()

  const [selectedUser, setSelectedUser] = useState<UsuarioAdmin | null>(null)
  const [puntos, setPuntos] = useState<number>(0)
  const [puntosMode, setPuntosMode] = useState<'add' | 'set'>('add') // 'add' para agregar/restar, 'set' para editar directo
  const [motivo, setMotivo] = useState('')
  const [vipDays, setVipDays] = useState<number | undefined>(30)
  const [migrationPoints, setMigrationPoints] = useState<number>(0)

  const {
    data: usuariosData,
    isLoading,
    error
  } = useAdminUsuarios({
    filter: 'all',
    limit: 10000 // Cargar todos los usuarios
  })

  const updatePuntos = useUpdateUsuarioPuntos()
  const removeVip = useRemoveVipFromUser()
  const grantVip = useGrantVipToUser()
  const manualMigration = useManualBotrixMigration()

  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const hoverBg = useColorModeValue('gray.50', 'gray.700')
  const textColor = useColorModeValue('gray.800', 'white')
  const mutedColor = useColorModeValue('gray.600', 'gray.400')
  const statBg = useColorModeValue('gray.50', 'gray.700')

  const openPuntosModal = (user: UsuarioAdmin) => {
    setSelectedUser(user)
    setPuntos(0)
    setPuntosMode('add')
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
        description: 'Debes proporcionar un motivo',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
      return
    }

    if (puntos === 0 && puntosMode === 'add') {
      toast({
        title: 'Sin cambios',
        description: 'No hay cambios en los puntos',
        status: 'warning',
        duration: 3000,
        isClosable: true
      })
      return
    }

    try {
      await updatePuntos.mutateAsync({
        usuarioId: selectedUser.id,
        puntos: puntos,
        motivo,
        operation: puntosMode // Enviamos 'add' o 'set' al backend
      })
      toast({
        title: 'Actualizado',
        description: 'Puntos actualizados correctamente',
        status: 'success',
        duration: 3000,
        isClosable: true
      })
      onPuntosClose()
    } catch {
      toast({
        title: 'Error',
        description: 'No se pudieron actualizar los puntos',
        status: 'error',
        duration: 3000,
        isClosable: true
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
        title: 'VIP Otorgado',
        description: 'El usuario ahora tiene acceso VIP',
        status: 'success',
        duration: 3000,
        isClosable: true
      })
      onVipClose()
    } catch {
      toast({
        title: 'Error',
        description: 'No se pudo otorgar VIP',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    }
  }

  const handleRemoveVip = async (user: UsuarioAdmin) => {
    if (
      !confirm(
        `¿Seguro que quieres remover VIP a ${user.nickname || user.kick_username || user.display_name || 'este usuario'}?`
      )
    )
      return

    try {
      await removeVip.mutateAsync({
        usuarioId: user.id,
        reason: 'Removido manualmente por admin'
      })
      toast({
        title: 'VIP Removido',
        description: 'El acceso VIP ha sido removido',
        status: 'success',
        duration: 3000,
        isClosable: true
      })
    } catch {
      toast({
        title: 'Error',
        description: 'No se pudo remover VIP',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    }
  }

  const handleManualMigration = async () => {
    if (!selectedUser || !migrationPoints) {
      toast({
        title: 'Error',
        description: 'Debes especificar los puntos a migrar',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
      return
    }

    try {
      await manualMigration.mutateAsync({
        usuarioId: selectedUser.id,
        pointsAmount: migrationPoints,
        kickUsername: selectedUser.kick_username || ''
      })
      toast({
        title: 'Migración Exitosa',
        description: 'Los puntos han sido migrados',
        status: 'success',
        duration: 3000,
        isClosable: true
      })
      onMigrationClose()
    } catch {
      toast({
        title: 'Error',
        description: 'No se pudo completar la migración',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    }
  }

  const processedData = useMemo(() => {
    if (!usuariosData?.users) return []

    // Función para normalizar texto: quitar espacios, acentos, minúsculas
    const normalize = (str: string) =>
      str
        .toLowerCase()
        .replace(/\s+/g, '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')

    const filtered = usuariosData.users.filter((user: UsuarioAdmin) => {
      const normalizedSearch = normalize(searchTerm)
      const matchesSearch =
        normalize(user.display_name || '').includes(normalizedSearch) ||
        normalize(user.nickname || '').includes(normalizedSearch) ||
        normalize(user.kick_username || '').includes(normalizedSearch) ||
        normalize(user.discord_username || '').includes(normalizedSearch)

      if (filter === 'vip') return matchesSearch && user.vip_status?.is_active
      if (filter === 'subscribers') return matchesSearch && user.subscriber_status?.is_active
      if (filter === 'migrated') return matchesSearch && user.botrix_migrated
      if (filter === 'pending_migration')
        return (
          matchesSearch && user.migration_status?.can_migrate && !user.migration_status?.migrated_at
        )

      return matchesSearch
    })

    return filtered.sort((a: UsuarioAdmin, b: UsuarioAdmin) => {
      let aVal = a[sortField]
      let bVal = b[sortField]

      if (sortField === 'puntos') {
        aVal = a.puntos || 0
        bVal = b.puntos || 0
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [usuariosData?.users, searchTerm, sortField, sortDirection, filter])

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
    if (!usuariosData?.users) return null

    const usuarios = usuariosData.users
    const totalUsers = usuarios.length
    const totalPoints = usuarios.reduce(
      (sum: number, user: UsuarioAdmin) => sum + (user.puntos || 0),
      0
    )
    const usersWithCanjes = usuarios.filter(
      (user: UsuarioAdmin) => (user.total_canjes || 0) > 0
    ).length
    const vipUsers = usuarios.filter((user: UsuarioAdmin) => user.vip_status?.is_active).length
    const migratedUsers = usuarios.filter((user: UsuarioAdmin) => user.botrix_migrated).length
    const subscribers = usuarios.filter(
      (user: UsuarioAdmin) => user.subscriber_status?.is_active
    ).length

    return {
      totalUsers,
      totalPoints,
      usersWithCanjes,
      vipUsers,
      migratedUsers,
      subscribers
    }
  }, [usuariosData?.users])

  if (isLoading) {
    return (
      <RequireAdmin>
        <Layout>
          <Container maxW="container.xl" py={8}>
            <Center minH="60vh">
              <VStack spacing={3}>
                <Spinner size="xl" color="blue.500" thickness="3px" />
                <Text color={mutedColor}>Cargando usuarios...</Text>
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
                <Text fontWeight="semibold">Error al cargar usuarios</Text>
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
        <meta name="description" content="Administra los usuarios de Luisardito Shop" />
      </Head>
      <Layout>
        <Container maxW="container.xl" py={{ base: 4, md: 6 }} px={{ base: 4, md: 6 }}>
          <VStack spacing={6} align="stretch">
            {/* Header */}
            <Box>
              <Heading size="lg" mb={2} color={textColor}>
                Gestión de Usuarios
              </Heading>
              <Text fontSize="sm" color={mutedColor}>
                Administra usuarios, puntos, VIPs y migraciones
              </Text>
            </Box>

            {/* Estadísticas Compactas */}
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
                    <MdPeople size={18} color="blue" />
                    <Text fontSize="xs" color={mutedColor} fontWeight="medium">
                      Total
                    </Text>
                  </HStack>
                  <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                    {stats.totalUsers}
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
                    <FaTrophy size={16} color="gold" />
                    <Text fontSize="xs" color={mutedColor} fontWeight="medium">
                      VIPs
                    </Text>
                  </HStack>
                  <Text fontSize="2xl" fontWeight="bold" color="yellow.600">
                    {stats.vipUsers}
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
                    <FaUserCheck size={16} color="green" />
                    <Text fontSize="xs" color={mutedColor} fontWeight="medium">
                      Subs
                    </Text>
                  </HStack>
                  <Text fontSize="2xl" fontWeight="bold" color="green.600">
                    {stats.subscribers}
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
                    <MdSwapHoriz size={18} color="cyan" />
                    <Text fontSize="xs" color={mutedColor} fontWeight="medium">
                      Migrados
                    </Text>
                  </HStack>
                  <Text fontSize="2xl" fontWeight="bold" color="cyan.600">
                    {stats.migratedUsers}
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
                    <MdTrendingUp size={18} color="orange" />
                    <Text fontSize="xs" color={mutedColor} fontWeight="medium">
                      Puntos
                    </Text>
                  </HStack>
                  <Text fontSize="2xl" fontWeight="bold" color="orange.600">
                    {(stats.totalPoints / 1000).toFixed(0)}k
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
                    <MdStar size={18} color="purple" />
                    <Text fontSize="xs" color={mutedColor} fontWeight="medium">
                      Canjes
                    </Text>
                  </HStack>
                  <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                    {stats.usersWithCanjes}
                  </Text>
                </Box>
              </SimpleGrid>
            )}

            {/* Filtros y Búsqueda */}
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
                    placeholder="Buscar usuarios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    borderRadius="lg"
                    size="md"
                  />
                </InputGroup>

                <Select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as 'all' | 'vip' | 'migrated' | 'pending_migration' | 'subscribers')}
                  w={{ base: 'full', md: '180px' }}
                  borderRadius="lg"
                  size="md"
                >
                  <option value="all">Todos</option>
                  <option value="vip">VIPs</option>
                  <option value="subscribers">Suscriptores</option>
                  <option value="migrated">Migrados</option>
                  <option value="pending_migration">Pendientes</option>
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
                    size="md"
                    w="90px"
                    borderRadius="lg"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </Select>
                </HStack>

                {(searchTerm || filter !== 'all') && (
                  <Badge colorScheme="blue" fontSize="sm" px={3} py={1} borderRadius="full">
                    {processedData.length} resultados
                  </Badge>
                )}
              </Flex>
            </Box>

            {/* Tabla de Usuarios */}
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
                      <Th py={3}>Usuario</Th>
                      <Th
                        py={3}
                        cursor="pointer"
                        onClick={() => handleSort('creado')}
                        _hover={{ bg: hoverBg }}
                        display={{ base: 'none', md: 'table-cell' }}
                      >
                        <HStack spacing={1}>
                          <Text>Registro</Text>
                          {sortField === 'creado' &&
                            (sortDirection === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />)}
                        </HStack>
                      </Th>
                      <Th
                        py={3}
                        cursor="pointer"
                        onClick={() => handleSort('puntos')}
                        _hover={{ bg: hoverBg }}
                      >
                        <HStack spacing={1}>
                          <Text>Puntos</Text>
                          {sortField === 'puntos' &&
                            (sortDirection === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />)}
                        </HStack>
                      </Th>
                      <Th py={3} display={{ base: 'none', lg: 'table-cell' }}>
                        Estado
                      </Th>
                      <Th py={3} display={{ base: 'none', lg: 'table-cell' }}>
                        Canjes
                      </Th>
                      <Th py={3}>Acciones</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {paginatedData.map((user: UsuarioAdmin) => (
                      <Tr key={user.id} _hover={{ bg: hoverBg }} transition="all 0.2s">
                        <Td py={3}>
                          <HStack spacing={3}>
                            <UserAvatarWithBadge user={user}>
                              <Avatar
                                size="sm"
                                name={user.nickname || user.kick_username || user.display_name || 'Usuario'}
                                src={user.kick_data?.avatar_url || user.kick_avatar}
                              />
                            </UserAvatarWithBadge>
                            <VStack align="start" spacing={0}>
                              <HStack spacing={2}>
                                <Text fontWeight="medium" fontSize="sm">
                                  {user.nickname || user.kick_username || user.display_name || `Usuario #${user.id}`}
                                </Text>
                                <UserBadge user={user} size="sm" />
                              </HStack>
                              {user.discord_info?.linked && (
                                <Text fontSize="xs" color="purple.500">
                                  {user.discord_info.display_name}
                                </Text>
                              )}
                            </VStack>
                          </HStack>
                        </Td>
                        <Td py={3} display={{ base: 'none', md: 'table-cell' }}>
                          <Text fontSize="sm" color={mutedColor}>
                            {user.creado
                              ? new Date(user.creado).toLocaleDateString('es-ES', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })
                              : 'N/A'}
                          </Text>
                        </Td>
                        <Td py={3}>
                          <Badge colorScheme="green" fontSize="sm" fontWeight="semibold">
                            {user.puntos?.toLocaleString() || 0}
                          </Badge>
                        </Td>
                        <Td py={3} display={{ base: 'none', lg: 'table-cell' }}>
                          <HStack spacing={1}>
                            {user.vip_status?.is_active && (
                              <Badge colorScheme="yellow" fontSize="xs">
                                VIP
                              </Badge>
                            )}
                            {user.subscriber_status?.is_active && (
                              <Badge colorScheme="green" fontSize="xs">
                                SUB
                              </Badge>
                            )}
                            {user.botrix_migrated && (
                              <Badge colorScheme="cyan" fontSize="xs">
                                MIG
                              </Badge>
                            )}
                          </HStack>
                        </Td>
                        <Td py={3} display={{ base: 'none', lg: 'table-cell' }}>
                          <Text fontSize="sm" color={textColor}>
                            {user.total_canjes || 0}
                          </Text>
                        </Td>
                        <Td py={3}>
                          <ActionsMenu
                            items={[
                              {
                                label: 'Editar puntos',
                                icon: EditIcon,
                                onClick: () => openPuntosModal(user)
                              },
                              {
                                label: 'Ver canjes',
                                icon: ViewIcon,
                                onClick: () =>
                                  router.push(
                                    `/admin/usuarios/${
                                      user.kick_username || user.nickname || user.id
                                    }`
                                  )
                              },
                              {
                                isDivider: true,
                                label: '',
                                icon: SettingsIcon,
                                onClick: () => {}
                              },
                              ...(user.vip_status?.is_active
                                ? [
                                    {
                                      label: 'Remover VIP',
                                      icon: SettingsIcon,
                                      onClick: () => handleRemoveVip(user),
                                      colorScheme: 'red' as const
                                    }
                                  ]
                                : [
                                    {
                                      label: 'Otorgar VIP',
                                      icon: FaTrophy,
                                      onClick: () => openVipModal(user),
                                      colorScheme: 'yellow' as const
                                    }
                                  ]),
                              ...(!user.migration_status?.migrated_at
                                ? [
                                    {
                                      label: 'Migración manual',
                                      icon: MdSwapHoriz,
                                      onClick: () => openMigrationModal(user),
                                      colorScheme: 'cyan' as const
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

          {/* Modal Editar Puntos */}
          <StyledModal
            isOpen={isPuntosOpen}
            onClose={onPuntosClose}
            title="Gestionar Puntos"
            subtitle={selectedUser?.nickname}
            avatarSrc={selectedUser?.kick_avatar}
            avatarName={selectedUser?.nickname || 'Usuario'}
            footer={
              <>
                <Button variant="ghost" onClick={onPuntosClose} size="lg">
                  Cancelar
                </Button>
                <Button
                  colorScheme={(() => {
                    if (puntosMode === 'add') return puntos > 0 ? 'green' : puntos < 0 ? 'red' : 'gray'
                    return 'blue'
                  })()}
                  onClick={savePuntos}
                  isLoading={updatePuntos.isPending}
                  isDisabled={!motivo.trim() || puntos === 0}
                  size="lg"
                >
                  Confirmar cambios
                </Button>
              </>
            }
          >
            <VStack spacing={4} align="stretch">
              {/* Puntos actuales */}
              <HStack bg={statBg} p={4} borderRadius="xl" justify="space-between" borderWidth="1px" borderColor={borderColor}>
                <HStack spacing={2}>
                  <Icon as={FaCoins} color="green.500" />
                  <Text fontSize="sm" color={mutedColor} fontWeight="medium">
                    Puntos actuales
                  </Text>
                </HStack>
                <Text fontSize="2xl" fontWeight="bold" color="green.500">
                  {selectedUser?.puntos?.toLocaleString() || 0}
                </Text>
              </HStack>

              {/* Modo de operación */}
              <VStack align="stretch" spacing={2}>
                <Text fontSize="sm" fontWeight="semibold" color={mutedColor}>
                  Modo de operación
                </Text>
                <HStack spacing={2}>
                  <Button
                    size="md"
                    flex={1}
                    variant={puntosMode === 'add' ? 'solid' : 'outline'}
                    colorScheme={puntosMode === 'add' ? 'blue' : 'gray'}
                    leftIcon={<Icon as={FaExchangeAlt} />}
                    onClick={() => {
                      setPuntosMode('add')
                      setPuntos(0)
                    }}
                  >
                    Sumar/Restar
                  </Button>
                  <Button
                    size="md"
                    flex={1}
                    variant={puntosMode === 'set' ? 'solid' : 'outline'}
                    colorScheme={puntosMode === 'set' ? 'purple' : 'gray'}
                    leftIcon={<EditIcon />}
                    onClick={() => {
                      setPuntosMode('set')
                      setPuntos(selectedUser?.puntos || 0)
                    }}
                  >
                    Establecer
                  </Button>
                </HStack>
              </VStack>

              {/* Input de puntos */}
              <VStack spacing={3} align="stretch">
                <VStack align="stretch" spacing={1}>
                  <Text fontSize="sm" fontWeight="semibold" color={mutedColor}>
                    {puntosMode === 'add' ? 'Cantidad a agregar/restar' : 'Nuevo total de puntos'}
                  </Text>
                  <NumberInput
                    value={puntos}
                    onChange={(_, val) => setPuntos(val)}
                    min={puntosMode === 'set' ? 0 : undefined}
                    size="lg"
                  >
                    <NumberInputField
                      placeholder={puntosMode === 'add' ? 'Ej: 50000 o -1000' : 'Ej: 1500000'}
                      fontSize="2xl"
                      fontWeight="bold"
                      textAlign="center"
                      h="64px"
                    />
                  </NumberInput>
                  {puntosMode === 'add' && (
                    <Text fontSize="xs" color={mutedColor}>
                      Usa números positivos para agregar o negativos para restar
                    </Text>
                  )}
                </VStack>

                {/* Vista previa del resultado */}
                {puntos !== 0 && (() => {
                  const resultado = puntosMode === 'add'
                    ? (selectedUser?.puntos || 0) + puntos
                    : puntos
                  const cambio = puntosMode === 'add' ? puntos : puntos - (selectedUser?.puntos || 0)

                  return (
                    <Box
                      bg={cambio > 0 ? 'green.50' : cambio < 0 ? 'red.50' : 'blue.50'}
                      _dark={{
                        bg: cambio > 0 ? 'green.900' : cambio < 0 ? 'red.900' : 'blue.900'
                      }}
                      p={4}
                      borderRadius="xl"
                      borderWidth="2px"
                      borderColor={cambio > 0 ? 'green.300' : cambio < 0 ? 'red.300' : 'blue.300'}
                    >
                      <VStack spacing={2}>
                        <HStack justify="space-between" w="full">
                          <Text fontSize="xs" fontWeight="semibold" color={mutedColor} textTransform="uppercase">
                            Vista previa
                          </Text>
                          {cambio !== 0 && (
                            <Badge
                              colorScheme={cambio > 0 ? 'green' : 'red'}
                              fontSize="xs"
                              px={2}
                              py={1}
                            >
                              {cambio > 0 ? '+' : ''}
                              {cambio.toLocaleString()} puntos
                            </Badge>
                          )}
                        </HStack>
                        <HStack spacing={4} w="full" justify="center">
                          <VStack spacing={0}>
                            <Text fontSize="xs" color={mutedColor}>
                              Actual
                            </Text>
                            <Text
                              fontSize="lg"
                              fontWeight="semibold"
                              color={mutedColor}
                              textDecoration="line-through"
                            >
                              {(selectedUser?.puntos || 0).toLocaleString()}
                            </Text>
                          </VStack>
                          <Icon
                            as={FaExchangeAlt}
                            boxSize={5}
                            color={cambio > 0 ? 'green.500' : cambio < 0 ? 'red.500' : 'blue.500'}
                          />
                          <VStack spacing={0}>
                            <Text fontSize="xs" color={mutedColor}>
                              Nuevo
                            </Text>
                            <Text
                              fontSize="2xl"
                              fontWeight="bold"
                              color={cambio > 0 ? 'green.600' : cambio < 0 ? 'red.600' : 'blue.600'}
                            >
                              {resultado.toLocaleString()}
                            </Text>
                          </VStack>
                        </HStack>
                      </VStack>
                    </Box>
                  )
                })()}
              </VStack>

              {/* Motivo */}
              <VStack align="stretch" spacing={1}>
                <Text fontSize="sm" fontWeight="semibold" color={mutedColor}>
                  Motivo del cambio <Text as="span" color="red.500">*</Text>
                </Text>
                <Input
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  placeholder="Ej: Premio por evento, ajuste manual, compensación..."
                  size="lg"
                />
              </VStack>
            </VStack>
          </StyledModal>

          {/* Modal Otorgar VIP */}
          <StyledModal
            isOpen={isVipOpen}
            onClose={onVipClose}
            title="Otorgar VIP"
            subtitle={selectedUser?.nickname}
            icon={FaTrophy}
            avatarSrc={selectedUser?.kick_avatar}
            avatarName={selectedUser?.nickname || 'Usuario'}
            footer={
              <>
                <Button variant="ghost" onClick={onVipClose} size="lg">
                  Cancelar
                </Button>
                <Button
                  colorScheme="yellow"
                  onClick={handleGrantVip}
                  isLoading={grantVip.isPending}
                  size="lg"
                  leftIcon={<Icon as={FaTrophy} />}
                >
                  Otorgar VIP
                </Button>
              </>
            }
          >
            <VStack spacing={4} align="stretch">
              <VStack align="stretch" spacing={1}>
                <Text fontSize="sm" fontWeight="semibold" color={mutedColor}>
                  Duración (días)
                </Text>
                <NumberInput 
                  value={vipDays} 
                  onChange={(_, value) => setVipDays(value)}
                  size="lg"
                >
                  <NumberInputField placeholder="30" />
                </NumberInput>
                <Text fontSize="xs" color={mutedColor}>
                  Deja vacío o 0 para VIP permanente
                </Text>
              </VStack>

              {vipDays && vipDays > 0 && (
                <Box bg={statBg} p={3} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
                  <Text fontSize="xs" color={mutedColor} mb={1}>
                    Vencimiento
                  </Text>
                  <Text fontSize="sm" fontWeight="semibold">
                    {new Date(Date.now() + vipDays * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Text>
                </Box>
              )}
            </VStack>
          </StyledModal>

          {/* Modal Migración Manual */}
          <StyledModal
            isOpen={isMigrationOpen}
            onClose={onMigrationClose}
            title="Migración Manual"
            subtitle={selectedUser?.nickname}
            icon={MdSwapHoriz}
            avatarSrc={selectedUser?.kick_avatar}
            avatarName={selectedUser?.nickname || 'Usuario'}
            footer={
              <>
                <Button variant="ghost" onClick={onMigrationClose} size="lg">
                  Cancelar
                </Button>
                <Button
                  colorScheme="cyan"
                  onClick={handleManualMigration}
                  isLoading={manualMigration.isPending}
                  size="lg"
                  leftIcon={<Icon as={MdSwapHoriz} />}
                >
                  Migrar Puntos
                </Button>
              </>
            }
          >
            <VStack spacing={4} align="stretch">
              <Alert status="info" borderRadius="lg">
                <AlertIcon />
                <Box>
                  <Text fontSize="sm" fontWeight="semibold">
                    Migración desde Botrix
                  </Text>
                  <Text fontSize="xs" color={mutedColor}>
                    Esta acción marcará al usuario como migrado
                  </Text>
                </Box>
              </Alert>

              <VStack align="stretch" spacing={1}>
                <Text fontSize="sm" fontWeight="semibold" color={mutedColor}>
                  Puntos a migrar <Text as="span" color="red.500">*</Text>
                </Text>
                <NumberInput
                  value={migrationPoints}
                  onChange={(_, value) => setMigrationPoints(value)}
                  size="lg"
                  min={0}
                >
                  <NumberInputField 
                    placeholder="Ej: 50000" 
                    fontSize="xl"
                    fontWeight="semibold"
                    textAlign="center"
                  />
                </NumberInput>
                <Text fontSize="xs" color={mutedColor}>
                  Cantidad de puntos que tenía en Botrix
                </Text>
              </VStack>

              {migrationPoints > 0 && (
                <Box 
                  bg="cyan.50" 
                  _dark={{ bg: 'cyan.900' }}
                  p={3} 
                  borderRadius="lg" 
                  borderWidth="2px" 
                  borderColor="cyan.300"
                >
                  <HStack justify="space-between">
                    <Text fontSize="xs" color={mutedColor} fontWeight="semibold">
                      Puntos totales después de la migración
                    </Text>
                    <Text fontSize="xl" fontWeight="bold" color="cyan.600">
                      {((selectedUser?.puntos || 0) + migrationPoints).toLocaleString()}
                    </Text>
                  </HStack>
                </Box>
              )}
            </VStack>
          </StyledModal>
        </Container>
      </Layout>
    </RequireAdmin>
  )
}
