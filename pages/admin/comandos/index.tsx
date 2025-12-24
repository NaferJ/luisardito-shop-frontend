import { Layout } from '../../../components/Layout'
import { RequireAdmin } from '../../../components/RequireAdmin'
import { ActionsMenu } from '../../../components/ActionsMenu'
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
  AlertDialogOverlay,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Checkbox,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react'
import { useState, useRef, useMemo } from 'react'
import {
  useBotCommands,
  useCreateBotCommand,
  useUpdateBotCommand,
  useDeleteBotCommand,
  useTestBotCommand,
  BotCommand,
  CommandFormData
} from '../../../hooks/useBotCommands'
import {
  AddIcon,
  SearchIcon,
  EditIcon,
  DeleteIcon,
  CloseIcon,
  RepeatIcon,
  ChevronDownIcon,
} from '@chakra-ui/icons'
import Head from 'next/head'

export default function AdminComandosPage() {
  const toast = useToast()
  const cancelRef = useRef<HTMLButtonElement>(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'simple' | 'dynamic'>('all')
  const [filterEnabled, setFilterEnabled] = useState<'all' | 'true' | 'false'>('all')
  const [selectedCommand, setSelectedCommand] = useState<BotCommand | null>(null)
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure()
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()
  const { isOpen: isTestOpen, onOpen: onTestOpen, onClose: onTestClose } = useDisclosure()

  const [isEditing, setIsEditing] = useState(false)
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
    cooldown_seconds: 0,
    auto_send_interval_seconds: 0
  })

  const [aliasInput, setAliasInput] = useState('')
  const [testUsername, setTestUsername] = useState('TestUser')
  const [testArgs, setTestArgs] = useState('')
  const [testResult, setTestResult] = useState('')

  const { data: commandsData, isLoading } = useBotCommands({
    search: searchTerm,
    command_type: filterType !== 'all' ? filterType : undefined,
    enabled: filterEnabled !== 'all' ? filterEnabled === 'true' : undefined
  })

  const createMutation = useCreateBotCommand()
  const updateMutation = useUpdateBotCommand()
  const deleteMutation = useDeleteBotCommand()
  const testMutation = useTestBotCommand()

  const hoverBg = useColorModeValue('gray.50', 'gray.700')
  const cardBg = useColorModeValue('white', 'gray.800')
  const cardBorder = useColorModeValue('gray.200', 'gray.600')
  const tableBg = useColorModeValue('white', 'gray.800')
  const statBg = useColorModeValue('gray.50', 'gray.700')
  const textColor = useColorModeValue('gray.800', 'white')
  const mutedColor = useColorModeValue('gray.600', 'gray.400')

  const commands = useMemo(() => commandsData?.data || [], [commandsData])

  const filteredCommands = useMemo(() => {
    return commands.filter((cmd) => {
      const matchesSearch = cmd.command.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cmd.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cmd.response_message.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesType = filterType === 'all' || cmd.command_type === filterType
      const matchesEnabled = filterEnabled === 'all' || 
        (filterEnabled === 'true' ? cmd.enabled : !cmd.enabled)
      
      return matchesSearch && matchesType && matchesEnabled
    })
  }, [commands, searchTerm, filterType, filterEnabled])

  const handleOpenForm = (command?: BotCommand) => {
    if (command) {
      setIsEditing(true)
      setSelectedCommand(command)
      setFormData({
        command: command.command,
        aliases: command.aliases || [],
        response_message: command.response_message,
        description: command.description || '',
        command_type: command.command_type,
        dynamic_handler: command.dynamic_handler || '',
        enabled: command.enabled,
        requires_permission: command.requires_permission,
        permission_level: command.permission_level,
        cooldown_seconds: command.cooldown_seconds,
        auto_send_interval_seconds: command.auto_send_interval_seconds || 0
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
        cooldown_seconds: 0,
        auto_send_interval_seconds: 0
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
      cooldown_seconds: 0,
      auto_send_interval_seconds: 0
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
          duration: 3000,
          isClosable: true,
        })
      } else {
        await createMutation.mutateAsync(formData)
        toast({
          title: 'Comando creado',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      }
      handleCloseForm()
    } catch {
      toast({
        title: 'Error',
        description: 'No se pudo guardar el comando',
        status: 'error',
        duration: 3000,
        isClosable: true,
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
        duration: 3000,
        isClosable: true,
      })
      onDeleteClose()
    } catch {
      toast({
        title: 'Error al eliminar',
        status: 'error',
        duration: 3000,
        isClosable: true,
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
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleBulkEnable = async () => {
    try {
      for (const id of selectedIds) {
        const cmd = commands.find(c => c.id === id)
        if (cmd && !cmd.enabled) {
          await updateMutation.mutateAsync({ 
            id, 
            command: { ...cmd, enabled: true } 
          })
        }
      }
      toast({
        title: 'Comandos activados',
        description: `Se activaron ${selectedIds.length} comando(s)`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      setSelectedIds([])
    } catch {
      toast({
        title: 'Error',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleBulkDisable = async () => {
    try {
      for (const id of selectedIds) {
        const cmd = commands.find(c => c.id === id)
        if (cmd && cmd.enabled) {
          await updateMutation.mutateAsync({ 
            id, 
            command: { ...cmd, enabled: false } 
          })
        }
      }
      toast({
        title: 'Comandos desactivados',
        description: `Se desactivaron ${selectedIds.length} comando(s)`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      setSelectedIds([])
    } catch {
      toast({
        title: 'Error',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleBulkDelete = async () => {
    if (!confirm(`¿Estás seguro de eliminar ${selectedIds.length} comando(s)?`)) return
    
    try {
      for (const id of selectedIds) {
        await deleteMutation.mutateAsync(id)
      }
      toast({
        title: 'Comandos eliminados',
        description: `Se eliminaron ${selectedIds.length} comando(s)`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      setSelectedIds([])
    } catch {
      toast({
        title: 'Error al eliminar',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const toggleSelection = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredCommands.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredCommands.map(c => c.id))
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
          <VStack spacing={6} align="stretch">
            <Flex
              justify="space-between"
              align={{ base: 'start', md: 'center' }}
              direction={{ base: 'column', md: 'row' }}
              gap={4}
            >
              <VStack align="start" spacing={1}>
                <Heading size="lg" color={textColor}>
                  Gestión de Comandos
                </Heading>
                <Text color={mutedColor} fontSize="sm">
                  Administra los comandos del bot de Kick
                </Text>
              </VStack>
              <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={() => handleOpenForm()}>
                Nuevo Comando
              </Button>
            </Flex>

            <Card bg={cardBg} borderRadius="lg" borderWidth="1px" borderColor={cardBorder}>
              <CardBody p={4}>
                <Flex
                  justify="space-between"
                  align="center"
                  direction={{ base: 'column', md: 'row' }}
                  gap={3}
                >
                  <Stack direction={{ base: 'column', md: 'row' }} spacing={3} flex={1}>
                    <InputGroup maxW={{ base: 'full', md: '300px' }}>
                      <InputLeftElement>
                        <SearchIcon color={mutedColor} />
                      </InputLeftElement>
                      <Input
                        placeholder="Buscar comandos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </InputGroup>

                    <Select
                      maxW={{ base: 'full', md: '150px' }}
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value as 'all' | 'simple' | 'dynamic')}
                    >
                      <option value="all">Todos</option>
                      <option value="simple">Simples</option>
                      <option value="dynamic">Dinámicos</option>
                    </Select>

                    <Select
                      maxW={{ base: 'full', md: '150px' }}
                      value={filterEnabled}
                      onChange={(e) => setFilterEnabled(e.target.value as 'all' | 'true' | 'false')}
                    >
                      <option value="all">Todos</option>
                      <option value="true">Activos</option>
                      <option value="false">Inactivos</option>
                    </Select>
                  </Stack>

                  {selectedIds.length > 0 && (
                    <HStack spacing={2}>
                      <Badge colorScheme="blue" fontSize="sm" px={3} py={1}>
                        {selectedIds.length} seleccionados
                      </Badge>
                      <Menu>
                        <MenuButton colorScheme="blue" as={Button} rightIcon={<ChevronDownIcon />} size="md">
                          Acciones
                        </MenuButton>
                        <MenuList>
                          <MenuItem onClick={handleBulkEnable}>Activar seleccionados</MenuItem>
                          <MenuItem onClick={handleBulkDisable}>Desactivar seleccionados</MenuItem>
                          <MenuItem onClick={handleBulkDelete} color="red.500">
                            Eliminar seleccionados
                          </MenuItem>
                          <MenuItem onClick={() => setSelectedIds([])}>Deseleccionar</MenuItem>
                        </MenuList>
                      </Menu>
                    </HStack>
                  )}
                </Flex>
              </CardBody>
            </Card>

            <Box
              bg={tableBg}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={cardBorder}
              overflow="hidden"
              overflowX="auto"
            >
              {isLoading ? (
                <Center py={10}>
                  <VStack spacing={3}>
                    <Spinner size="xl" />
                    <Text color={mutedColor}>Cargando comandos...</Text>
                  </VStack>
                </Center>
              ) : filteredCommands.length === 0 ? (
                <Center py={10}>
                  <VStack>
                    <Text color={mutedColor}>No se encontraron comandos</Text>
                    <Button leftIcon={<AddIcon />} colorScheme="blue" variant="outline" onClick={() => handleOpenForm()}>
                      Crear primer comando
                    </Button>
                  </VStack>
                </Center>
              ) : (
                <TableContainer>
                  <Table variant="simple" size="sm" style={{ tableLayout: 'fixed', width: '100%' }}>
                    <Thead bg={statBg}>
                      <Tr>
                        <Th py={3} width="50px">
                          <Checkbox
                            isChecked={selectedIds.length === filteredCommands.length}
                            isIndeterminate={selectedIds.length > 0 && selectedIds.length < filteredCommands.length}
                            onChange={toggleSelectAll}
                          />
                        </Th>
                        <Th py={3} width="120px">Comando</Th>
                        <Th py={3} width="280px">Respuesta</Th>
                        <Th py={3} width="200px">Descripción</Th>
                        <Th py={3} width="80px">Tipo</Th>
                        <Th py={3} width="80px" isNumeric>Usos</Th>
                        <Th py={3} width="90px" textAlign="center">Estado</Th>
                        <Th py={3} width="120px" textAlign="center">Acciones</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredCommands.map((command) => (
                        <Tr key={command.id} _hover={{ bg: hoverBg }} transition="all 0.2s">
                          <Td py={3}>
                            <Checkbox
                              isChecked={selectedIds.includes(command.id)}
                              onChange={() => toggleSelection(command.id)}
                            />
                          </Td>
                          <Td py={3}>
                            <VStack align="start" spacing={1}>
                              <Text fontWeight="bold" fontSize="sm">
                                {command.command}
                              </Text>
                              {command.aliases && command.aliases.length > 0 && (
                                <HStack spacing={1} flexWrap="wrap">
                                  {command.aliases.map((alias) => (
                                    <Tag key={alias} size="sm" variant="subtle" colorScheme="blue">
                                      {alias}
                                    </Tag>
                                  ))}
                                </HStack>
                              )}
                            </VStack>
                          </Td>
                          <Td py={3}>
                            <Text 
                              fontSize="xs" 
                              noOfLines={2} 
                              wordBreak="break-word"
                              overflow="hidden"
                              textOverflow="ellipsis"
                            >
                              {command.response_message}
                            </Text>
                          </Td>
                          <Td py={3}>
                            <Text 
                              fontSize="xs" 
                              color={mutedColor} 
                              noOfLines={2}
                              wordBreak="break-word"
                              overflow="hidden"
                              textOverflow="ellipsis"
                            >
                              {command.description || 'Sin descripción'}
                            </Text>
                          </Td>
                          <Td py={3}>
                            <Badge colorScheme={command.command_type === 'simple' ? 'blue' : 'purple'} fontSize="xs">
                              {command.command_type}
                            </Badge>
                          </Td>
                          <Td py={3} isNumeric>
                            <Badge colorScheme="gray" fontSize="xs">
                              {command.usage_count.toLocaleString()}
                            </Badge>
                          </Td>
                          <Td py={3} textAlign="center">
                            <Badge colorScheme={command.enabled ? 'green' : 'gray'} fontSize="xs">
                              {command.enabled ? 'Activo' : 'Inactivo'}
                            </Badge>
                          </Td>
                          <Td py={3} textAlign="center">
                            <ActionsMenu
                              items={[
                                {
                                  label: 'Editar',
                                  icon: EditIcon,
                                  onClick: () => handleOpenForm(command)
                                },
                                {
                                  label: 'Eliminar',
                                  icon: DeleteIcon,
                                  onClick: () => {
                                    setSelectedCommand(command)
                                    onDeleteOpen()
                                  },
                                  colorScheme: 'red' as const
                                }
                              ]}
                            />
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          </VStack>
        </Container>

        <Modal isOpen={isFormOpen} onClose={handleCloseForm} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{isEditing ? 'Editar Comando' : 'Nuevo Comando'}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Nombre del Comando</FormLabel>
                  <Input
                    value={formData.command}
                    onChange={(e) => setFormData({ ...formData, command: e.target.value })}
                    placeholder="tienda"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Aliases</FormLabel>
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
                    <Button colorScheme="blue" onClick={addAlias} size="sm">
                      Agregar
                    </Button>
                  </HStack>
                  <HStack mt={2} flexWrap="wrap">
                    {formData.aliases?.map((alias) => (
                      <Tag key={alias} size="sm" borderRadius="full" colorScheme="blue">
                        {alias}
                        <IconButton
                          aria-label="Eliminar"
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
                    placeholder="Visita la tienda: https://shop.example.com"
                    rows={3}
                  />
                  <Text fontSize="xs" color={mutedColor} mt={1}>
                    Variables: {'{username}'} {'{channel}'} {'{args}'} {'{target_user}'} {'{points}'}
                  </Text>
                </FormControl>

                <FormControl>
                  <FormLabel>Tipo de Comando</FormLabel>
                  <Select
                    value={formData.command_type}
                    onChange={(e) => setFormData({ ...formData, command_type: e.target.value as 'simple' | 'dynamic' })}
                  >
                    <option value="simple">Simple</option>
                    <option value="dynamic">Dinámico</option>
                  </Select>
                </FormControl>

                {formData.command_type === 'dynamic' && (
                  <FormControl>
                    <FormLabel>Handler Dinámico</FormLabel>
                    <Input
                      value={formData.dynamic_handler}
                      onChange={(e) => setFormData({ ...formData, dynamic_handler: e.target.value })}
                      placeholder="puntos_handler"
                    />
                  </FormControl>
                )}

                <FormControl>
                  <FormLabel>Cooldown (segundos)</FormLabel>
                  <NumberInput
                    value={formData.cooldown_seconds}
                    onChange={(_, value) => setFormData({ ...formData, cooldown_seconds: value })}
                    min={0}
                    max={3600}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>
                    Intervalo Auto-envío (segundos)
                    <Tooltip label="Si es mayor a 0, el comando se enviará automáticamente cada X segundos. Útil para anuncios o recordatorios.">
                      <Text as="span" fontSize="xs" color={mutedColor} ml={2}>ℹ️</Text>
                    </Tooltip>
                  </FormLabel>
                  <NumberInput
                    value={formData.auto_send_interval_seconds}
                    onChange={(_, value) => setFormData({ ...formData, auto_send_interval_seconds: value })}
                    min={0}
                    max={86400}
                  >
                    <NumberInputField placeholder="0 = desactivado" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <Text fontSize="xs" color={mutedColor} mt={1}>
                    0 = desactivado. Mínimo recomendado: 15 segundos. Máximo: 86400 (24 horas)
                  </Text>
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

        <Modal isOpen={isTestOpen} onClose={onTestClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Probar Comando</ModalHeader>
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
                  <FormLabel>Argumentos</FormLabel>
                  <Input value={testArgs} onChange={(e) => setTestArgs(e.target.value)} />
                </FormControl>

                {testResult && (
                  <Card w="full" bg={statBg}>
                    <CardBody>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold" fontSize="sm">
                          Resultado:
                        </Text>
                        <Text fontSize="sm">{testResult}</Text>
                      </VStack>
                    </CardBody>
                  </Card>
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

        <AlertDialog isOpen={isDeleteOpen} leastDestructiveRef={cancelRef} onClose={onDeleteClose}>
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader>Eliminar Comando</AlertDialogHeader>
              <AlertDialogBody>
                ¿Estás seguro de eliminar el comando <strong>{selectedCommand?.command}</strong>?
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
