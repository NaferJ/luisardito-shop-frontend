import { Layout } from '../../../components/Layout'
import { RequireAdmin } from '../../../components/RequireAdmin'
import {
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
  useColorModeValue,
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
  Alert,
  AlertIcon,
  Stack,
  FormControl,
  FormLabel,
  Textarea,
  Switch,
  Tooltip,
  Tag,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay
} from '@chakra-ui/react'
import { useState, useRef } from 'react'
import {
  useBotCommands,
  useBotCommandStats,
  useCreateBotCommand,
  useUpdateBotCommand,
  useDeleteBotCommand,
  useToggleBotCommand,
  useDuplicateBotCommand,
  useTestBotCommand,
  BotCommand,
  CommandFormData
} from '../../../hooks/useBotCommands'
import {
  AddIcon,
  SearchIcon,
  EditIcon,
  DeleteIcon,
  CopyIcon,
  CloseIcon,
  RepeatIcon
} from '@chakra-ui/icons'
import Head from 'next/head'

export default function AdminComandosPage() {
  const toast = useToast()
  const cancelRef = useRef<HTMLButtonElement>(null)

  // Estados
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'simple' | 'dynamic'>('all')
  const [filterEnabled, setFilterEnabled] = useState<'all' | 'true' | 'false'>('all')
  const [selectedCommand, setSelectedCommand] = useState<BotCommand | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  // Modales
  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure()
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()
  const { isOpen: isTestOpen, onOpen: onTestOpen, onClose: onTestClose } = useDisclosure()

  // Form data
  const [formData, setFormData] = useState<CommandFormData>({
    command: '',
    aliases: [],
    response_message: '',
    description: '',
    command_type: 'simple',
    dynamic_handler: '',
    enabled: true,
    requires_permission: false,
    permission_level: 'viewer',
    cooldown_seconds: 0
  })

  const [aliasInput, setAliasInput] = useState('')
  const [testUsername, setTestUsername] = useState('TestUser')
  const [testArgs, setTestArgs] = useState('')
  const [testResult, setTestResult] = useState('')

  // Queries
  const { data: commandsData, isLoading } = useBotCommands({
    search: searchTerm,
    command_type: filterType !== 'all' ? filterType : undefined,
    enabled: filterEnabled !== 'all' ? filterEnabled === 'true' : undefined
  })

  const { data: statsData } = useBotCommandStats()

  // Mutations
  const createMutation = useCreateBotCommand()
  const updateMutation = useUpdateBotCommand()
  const deleteMutation = useDeleteBotCommand()
  const toggleMutation = useToggleBotCommand()
  const duplicateMutation = useDuplicateBotCommand()
  const testMutation = useTestBotCommand()

  // Theme colors
  const hoverBg = useColorModeValue('gray.50', 'gray.700')
  const statBg = useColorModeValue('blue.50', 'blue.900')

  // Comandos filtrados
  const commands = commandsData?.data || []
  const stats = statsData?.data

  // Handlers
  const handleOpenForm = (command?: BotCommand) => {
    if (command) {
      setIsEditing(true)
      setSelectedCommand(command)
      setFormData({
        command: command.command,
        aliases: command.aliases,
        response_message: command.response_message,
        description: command.description || '',
        command_type: command.command_type,
        dynamic_handler: command.dynamic_handler || '',
        enabled: command.enabled,
        requires_permission: command.requires_permission,
        permission_level: command.permission_level,
        cooldown_seconds: command.cooldown_seconds
      })
    } else {
      setIsEditing(false)
      setSelectedCommand(null)
      setFormData({
        command: '',
        aliases: [],
        response_message: '',
        description: '',
        command_type: 'simple',
        dynamic_handler: '',
        enabled: true,
        requires_permission: false,
        permission_level: 'viewer',
        cooldown_seconds: 0
      })
    }
    onFormOpen()
  }

  const handleCloseForm = () => {
    setFormData({
      command: '',
      aliases: [],
      response_message: '',
      description: '',
      command_type: 'simple',
      dynamic_handler: '',
      enabled: true,
      requires_permission: false,
      permission_level: 'viewer',
      cooldown_seconds: 0
    })
    setAliasInput('')
    setIsEditing(false)
    setSelectedCommand(null)
    onFormClose()
  }

  const handleSave = async () => {
    try {
      if (isEditing && selectedCommand) {
        await updateMutation.mutateAsync({ id: selectedCommand.id, command: formData })
        toast({
          title: 'Comando actualizado',
          status: 'success',
          duration: 3000
        })
      } else {
        await createMutation.mutateAsync(formData)
        toast({
          title: 'Comando creado',
          status: 'success',
          duration: 3000
        })
      }
      handleCloseForm()
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } }
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Error al guardar comando',
        status: 'error',
        duration: 5000
      })
    }
  }

  const handleDelete = async () => {
    if (!selectedCommand) return
    try {
      await deleteMutation.mutateAsync(selectedCommand.id)
      toast({
        title: 'Comando eliminado',
        status: 'success',
        duration: 3000
      })
      onDeleteClose()
    } catch {
      toast({
        title: 'Error al eliminar',
        status: 'error',
        duration: 3000
      })
    }
  }

  const handleToggle = async (id: number) => {
    try {
      await toggleMutation.mutateAsync(id)
      toast({
        title: 'Estado actualizado',
        status: 'success',
        duration: 2000
      })
    } catch {
      toast({
        title: 'Error',
        status: 'error',
        duration: 3000
      })
    }
  }

  const handleDuplicate = async (id: number) => {
    try {
      await duplicateMutation.mutateAsync(id)
      toast({
        title: 'Comando duplicado',
        status: 'success',
        duration: 3000
      })
    } catch {
      toast({
        title: 'Error al duplicar',
        status: 'error',
        duration: 3000
      })
    }
  }

  const handleTest = async () => {
    try {
      const result = await testMutation.mutateAsync({
        response_message: formData.response_message,
        test_username: testUsername,
        test_args: testArgs
      })
      if (result.ok && result.data) {
        setTestResult(result.data.processed)
      }
    } catch {
      toast({
        title: 'Error al probar',
        status: 'error',
        duration: 3000
      })
    }
  }

  const addAlias = () => {
    if (aliasInput.trim() && !formData.aliases?.includes(aliasInput.trim())) {
      setFormData({
        ...formData,
        aliases: [...(formData.aliases || []), aliasInput.trim()]
      })
      setAliasInput('')
    }
  }

  const removeAlias = (alias: string) => {
    setFormData({
      ...formData,
      aliases: formData.aliases?.filter((a) => a !== alias) || []
    })
  }

  return (
    <RequireAdmin>
      <Layout>
        <Head>
          <title>Gestión de Comandos - Admin</title>
        </Head>

        <Container maxW="7xl" py={8}>
          {/* Header */}
          <Flex justify="space-between" align="center" mb={8}>
            <VStack align="start" spacing={1}>
              <Heading size="lg">🤖 Comandos del Bot</Heading>
              <Text color="gray.500" fontSize="sm">
                Gestiona los comandos del bot de Kick
              </Text>
            </VStack>
            <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={() => handleOpenForm()}>
              Nuevo Comando
            </Button>
          </Flex>

          {/* Estadísticas */}
          {stats && (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={4} mb={6}>
              <Card bg={statBg}>
                <CardBody>
                  <Stat>
                    <StatLabel>Total</StatLabel>
                    <StatNumber>{stats.summary.total}</StatNumber>
                  </Stat>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <Stat>
                    <StatLabel>Habilitados</StatLabel>
                    <StatNumber color="green.500">{stats.summary.enabled}</StatNumber>
                  </Stat>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <Stat>
                    <StatLabel>Deshabilitados</StatLabel>
                    <StatNumber color="red.500">{stats.summary.disabled}</StatNumber>
                  </Stat>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <Stat>
                    <StatLabel>Simples</StatLabel>
                    <StatNumber>{stats.summary.simple}</StatNumber>
                  </Stat>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <Stat>
                    <StatLabel>Dinámicos</StatLabel>
                    <StatNumber>{stats.summary.dynamic}</StatNumber>
                  </Stat>
                </CardBody>
              </Card>
            </SimpleGrid>
          )}

          {/* Filtros */}
          <Card mb={6}>
            <CardBody>
              <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
                <InputGroup maxW={{ base: 'full', md: '300px' }}>
                  <InputLeftElement>
                    <SearchIcon color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Buscar comando..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>

                <Select
                  maxW={{ base: 'full', md: '200px' }}
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as 'all' | 'simple' | 'dynamic')}
                >
                  <option value="all">Todos los tipos</option>
                  <option value="simple">Simples</option>
                  <option value="dynamic">Dinámicos</option>
                </Select>

                <Select
                  maxW={{ base: 'full', md: '200px' }}
                  value={filterEnabled}
                  onChange={(e) => setFilterEnabled(e.target.value as 'all' | 'true' | 'false')}
                >
                  <option value="all">Todos los estados</option>
                  <option value="true">Habilitados</option>
                  <option value="false">Deshabilitados</option>
                </Select>
              </Stack>
            </CardBody>
          </Card>

          {/* Tabla */}
          <Card>
            <CardBody>
              {isLoading ? (
                <Center py={10}>
                  <Spinner size="xl" />
                </Center>
              ) : commands.length === 0 ? (
                <Center py={10}>
                  <VStack>
                    <Text color="gray.500">No se encontraron comandos</Text>
                    <Button
                      leftIcon={<AddIcon />}
                      colorScheme="blue"
                      variant="outline"
                      onClick={() => handleOpenForm()}
                    >
                      Crear primer comando
                    </Button>
                  </VStack>
                </Center>
              ) : (
                <TableContainer>
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>Estado</Th>
                        <Th>Comando</Th>
                        <Th>Descripción</Th>
                        <Th>Tipo</Th>
                        <Th isNumeric>Usos</Th>
                        <Th>Acciones</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {commands.map((command) => (
                        <Tr key={command.id} _hover={{ bg: hoverBg }}>
                          <Td>
                            <Switch
                              isChecked={command.enabled}
                              onChange={() => handleToggle(command.id)}
                              colorScheme="green"
                            />
                          </Td>
                          <Td>
                            <VStack align="start" spacing={0}>
                              <Text fontWeight="bold">!{command.command}</Text>
                              {command.aliases && command.aliases.length > 0 && (
                                <HStack spacing={1} flexWrap="wrap">
                                  {command.aliases.map((alias) => (
                                    <Tag key={alias} size="sm" variant="subtle" colorScheme="blue">
                                      !{alias}
                                    </Tag>
                                  ))}
                                </HStack>
                              )}
                            </VStack>
                          </Td>
                          <Td>
                            <Text fontSize="sm" noOfLines={2} maxW="300px">
                              {command.description || command.response_message}
                            </Text>
                          </Td>
                          <Td>
                            <Badge
                              colorScheme={command.command_type === 'simple' ? 'blue' : 'purple'}
                            >
                              {command.command_type}
                            </Badge>
                          </Td>
                          <Td isNumeric>
                            <Badge>{command.usage_count.toLocaleString()}</Badge>
                          </Td>
                          <Td>
                            <HStack spacing={1}>
                              <Tooltip label="Editar">
                                <IconButton
                                  aria-label="Editar"
                                  icon={<EditIcon />}
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleOpenForm(command)}
                                />
                              </Tooltip>
                              <Tooltip label="Duplicar">
                                <IconButton
                                  aria-label="Duplicar"
                                  icon={<CopyIcon />}
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDuplicate(command.id)}
                                />
                              </Tooltip>
                              <Tooltip label="Eliminar">
                                <IconButton
                                  aria-label="Eliminar"
                                  icon={<DeleteIcon />}
                                  size="sm"
                                  variant="ghost"
                                  colorScheme="red"
                                  onClick={() => {
                                    setSelectedCommand(command)
                                    onDeleteOpen()
                                  }}
                                />
                              </Tooltip>
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              )}
            </CardBody>
          </Card>
        </Container>

        {/* Modal Crear/Editar */}
        <Modal isOpen={isFormOpen} onClose={handleCloseForm} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{isEditing ? 'Editar Comando' : 'Nuevo Comando'}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Nombre del Comando</FormLabel>
                  <InputGroup>
                    <InputLeftElement>!</InputLeftElement>
                    <Input
                      pl={8}
                      value={formData.command}
                      onChange={(e) => setFormData({ ...formData, command: e.target.value })}
                      placeholder="tienda"
                    />
                  </InputGroup>
                </FormControl>

                <FormControl>
                  <FormLabel>Aliases (separados por Enter)</FormLabel>
                  <HStack>
                    <Input
                      value={aliasInput}
                      onChange={(e) => setAliasInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addAlias()
                        }
                      }}
                      placeholder="shop, store"
                    />
                    <Button onClick={addAlias} size="sm">
                      Agregar
                    </Button>
                  </HStack>
                  <HStack mt={2} flexWrap="wrap">
                    {formData.aliases?.map((alias) => (
                      <Tag key={alias} size="sm" borderRadius="full" colorScheme="blue">
                        !{alias}
                        <IconButton
                          aria-label="Eliminar alias"
                          icon={<CloseIcon />}
                          size="xs"
                          ml={1}
                          variant="ghost"
                          onClick={() => removeAlias(alias)}
                        />
                      </Tag>
                    ))}
                  </HStack>
                </FormControl>

                <FormControl>
                  <FormLabel>Descripción</FormLabel>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Muestra el enlace de la tienda"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Mensaje de Respuesta</FormLabel>
                  <Textarea
                    value={formData.response_message}
                    onChange={(e) => setFormData({ ...formData, response_message: e.target.value })}
                    placeholder="{channel} tienda del canal: https://shop.example.com"
                    rows={3}
                  />
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    Variables: {'{username}'} {'{channel}'} {'{args}'} {'{target_user}'}{' '}
                    {'{points}'}
                  </Text>
                </FormControl>

                <FormControl>
                  <FormLabel>Tipo de Comando</FormLabel>
                  <Select
                    value={formData.command_type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        command_type: e.target.value as 'simple' | 'dynamic'
                      })
                    }
                  >
                    <option value="simple">Simple (respuesta estática)</option>
                    <option value="dynamic">Dinámico (lógica especial)</option>
                  </Select>
                </FormControl>

                {formData.command_type === 'dynamic' && (
                  <FormControl>
                    <FormLabel>Handler Dinámico</FormLabel>
                    <Input
                      value={formData.dynamic_handler}
                      onChange={(e) =>
                        setFormData({ ...formData, dynamic_handler: e.target.value })
                      }
                      placeholder="puntos_handler"
                    />
                  </FormControl>
                )}

                <FormControl>
                  <FormLabel>Cooldown (segundos)</FormLabel>
                  <Input
                    type="number"
                    value={formData.cooldown_seconds}
                    onChange={(e) =>
                      setFormData({ ...formData, cooldown_seconds: parseInt(e.target.value) || 0 })
                    }
                  />
                </FormControl>

                <FormControl display="flex" alignItems="center">
                  <FormLabel mb={0}>Habilitado</FormLabel>
                  <Switch
                    isChecked={formData.enabled}
                    onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                    colorScheme="green"
                  />
                </FormControl>

                <Button
                  leftIcon={<RepeatIcon />}
                  variant="outline"
                  size="sm"
                  onClick={onTestOpen}
                  w="full"
                >
                  Probar Comando
                </Button>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={handleCloseForm}>
                Cancelar
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleSave}
                isLoading={createMutation.isPending || updateMutation.isPending}
              >
                {isEditing ? 'Actualizar' : 'Crear'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Modal Probar */}
        <Modal isOpen={isTestOpen} onClose={onTestClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>🧪 Probar Comando</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Mensaje Original</FormLabel>
                  <Textarea value={formData.response_message} isReadOnly rows={2} />
                </FormControl>

                <FormControl>
                  <FormLabel>Usuario de Prueba</FormLabel>
                  <Input value={testUsername} onChange={(e) => setTestUsername(e.target.value)} />
                </FormControl>

                <FormControl>
                  <FormLabel>Argumentos (opcional)</FormLabel>
                  <Input value={testArgs} onChange={(e) => setTestArgs(e.target.value)} />
                </FormControl>

                {testResult && (
                  <Alert status="success" borderRadius="md">
                    <AlertIcon />
                    <VStack align="start" flex={1} spacing={1}>
                      <Text fontWeight="bold" fontSize="sm">
                        Resultado:
                      </Text>
                      <Text fontSize="sm">{testResult}</Text>
                    </VStack>
                  </Alert>
                )}
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onTestClose}>
                Cerrar
              </Button>
              <Button colorScheme="blue" onClick={handleTest} isLoading={testMutation.isPending}>
                Probar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Dialog Eliminar */}
        <AlertDialog isOpen={isDeleteOpen} leastDestructiveRef={cancelRef} onClose={onDeleteClose}>
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader>Eliminar Comando</AlertDialogHeader>
              <AlertDialogBody>
                ¿Estás seguro de eliminar el comando <strong>!{selectedCommand?.command}</strong>?
                Esta acción no se puede deshacer.
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onDeleteClose}>
                  Cancelar
                </Button>
                <Button
                  colorScheme="red"
                  onClick={handleDelete}
                  ml={3}
                  isLoading={deleteMutation.isPending}
                >
                  Eliminar
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Layout>
    </RequireAdmin>
  )
}
