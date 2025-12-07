import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Card,
  CardBody,
  Button,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Switch,
  Alert,
  AlertIcon,
  useToast,
  Badge,
  IconButton,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SimpleGrid,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  FormHelperText,
} from '@chakra-ui/react'
import { 
  ArrowBackIcon, 
  CheckIcon, 
  CloseIcon, 
  RepeatIcon,
  AddIcon,
  DeleteIcon,
} from '@chakra-ui/icons'
import { useRouter } from 'next/router'
import { Layout } from '../../../components/Layout'
import { RequireAdmin } from '../../../components/RequireAdmin'
import { useKickRewards } from '../../../hooks/useKickRewards'
import Head from "next/head"

interface RewardFormData {
  value: number
  enabled: boolean
  auto_accept: boolean
}

export default function KickRewardsPage() {
  const router = useRouter()
  const toast = useToast()
  const { rewards, stats, loading, error, syncFromKick, updateRewardPoints, createReward, deleteReward } = useKickRewards()
  const [saving, setSaving] = useState(false)
  const [syncing, setSyncing] = useState(false)

  // Modal states
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure()
  const [newReward, setNewReward] = useState({
    title: '',
    description: '',
    cost: 1000,
    puntos_a_otorgar: 1000,
    background_color: '#00e701',
    is_user_input_required: false,
    auto_accept: true,
  })

  // Color mode values
  const cardBg = useColorModeValue('white', 'gray.800')
  const cardBorder = useColorModeValue('gray.200', 'gray.600')
  const tableBg = useColorModeValue('white', 'gray.800')
  const tableHoverBg = useColorModeValue('gray.50', 'gray.700')
  const statBg = useColorModeValue('gray.50', 'gray.700')
  const labelColor = useColorModeValue('gray.700', 'gray.300')
  const descriptionColor = useColorModeValue('gray.600', 'gray.400')
  const mutedColor = useColorModeValue('gray.600', 'gray.400')
  const textColor = useColorModeValue('gray.800', 'white')

  const [formData, setFormData] = useState<Record<number, RewardFormData>>({})
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (rewards.length > 0) {
      const newFormData: Record<number, RewardFormData> = {}
      rewards.forEach((reward) => {
        newFormData[reward.id] = {
          value: reward.puntos_a_otorgar || 0,
          enabled: reward.is_enabled || false,
          auto_accept: reward.auto_accept || false,
        }
      })
      setFormData(newFormData)
      setHasChanges(false)
    }
  }, [rewards])

  const handleValueChange = (id: number, value: number) => {
    setFormData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        value,
      },
    }))
    setHasChanges(true)
  }

  const handleEnabledChange = (id: number, enabled: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        enabled,
      },
    }))
    setHasChanges(true)
  }

  const handleAutoAcceptChange = (id: number, auto_accept: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        auto_accept,
      },
    }))
    setHasChanges(true)
  }

  const handleSaveAll = async () => {
    try {
      setSaving(true)
      
      const updates = Object.entries(formData).map(async ([idStr, data]) => {
        const id = parseInt(idStr)
        return await updateRewardPoints(id, data.value, data.auto_accept)
      })

      const results = await Promise.all(updates)
      const allSuccess = results.every(r => r.success)

      if (allSuccess) {
        toast({
          title: 'Recompensas actualizadas',
          description: 'Todos los cambios se han guardado correctamente',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        setHasChanges(false)
      } else {
        toast({
          title: 'Error parcial',
          description: 'Algunas recompensas no se pudieron actualizar',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        })
      }
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    if (rewards.length > 0) {
      const resetData: Record<number, RewardFormData> = {}
      rewards.forEach((reward) => {
        resetData[reward.id] = {
          value: reward.puntos_a_otorgar || 0,
          enabled: reward.is_enabled || false,
          auto_accept: reward.auto_accept || false,
        }
      })
      setFormData(resetData)
      setHasChanges(false)
    }
  }

  const handleSync = async () => {
    try {
      setSyncing(true)
      const result = await syncFromKick()

      if (result.success) {
        toast({
          title: 'Sincronización exitosa',
          description: 'Las recompensas se han actualizado desde Kick',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      } else {
        toast({
          title: 'Error al sincronizar',
          description: result.error || 'No se pudo completar la sincronización',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      }
    } finally {
      setSyncing(false)
    }
  }

  const handleCreateReward = async () => {
    try {
      setSaving(true)
      const result = await createReward(newReward)

      if (result.success) {
        toast({
          title: 'Recompensa creada',
          description: 'La recompensa se ha creado en Kick',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        onCreateClose()
        setNewReward({
          title: '',
          description: '',
          cost: 1000,
          puntos_a_otorgar: 1000,
          background_color: '#00e701',
          is_user_input_required: false,
          auto_accept: true,
        })
      } else {
        toast({
          title: 'Error al crear',
          description: result.error || 'No se pudo crear la recompensa',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteReward = async (id: number, title: string) => {
    if (!confirm(`¿Estás seguro de eliminar "${title}"? Esta acción es irreversible.`)) {
      return
    }

    const result = await deleteReward(id)

    if (result.success) {
      toast({
        title: 'Recompensa eliminada',
        description: 'La recompensa se ha eliminado de Kick',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } else {
      toast({
        title: 'Error al eliminar',
        description: result.error || 'No se pudo eliminar la recompensa',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  return (
    <RequireAdmin>
      <Layout>
        <Head>
          <title>Recompensas - Luisardito Shop</title>
          <meta name="description" content="Gestiona las recompensas de Kick y sus puntos." />
        </Head>
        <Container maxW="container.xl" py={8}>
          <VStack spacing={6} align="stretch">
            {/* Header */}
            <Flex
              justify="space-between"
              align={{ base: 'start', md: 'center' }}
              direction={{ base: 'column', md: 'row' }}
              gap={4}
            >
              <HStack spacing={4}>
                <IconButton
                  aria-label="Volver"
                  icon={<ArrowBackIcon />}
                  onClick={() => router.push('/admin/kick')}
                  variant="ghost"
                  size="lg"
                />
                <VStack align="start" spacing={1}>
                  <Heading size="lg" color={textColor}>
                    Recompensas de Kick
                  </Heading>
                  <Text color={mutedColor} fontSize="sm">
                    Gestiona las recompensas y cuántos puntos otorgan al canjearse
                  </Text>
                </VStack>
              </HStack>
            </Flex>

            {error && (
              <Alert status="error" borderRadius="lg">
                <AlertIcon />
                <Box>
                  <Text fontWeight="bold">Error al cargar recompensas</Text>
                  <Text fontSize="sm">{error}</Text>
                </Box>
              </Alert>
            )}

            {/* Stats Cards */}
            {stats && (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
                <Card borderRadius="lg" bg={cardBg} borderWidth="1px" borderColor={cardBorder}>
                  <CardBody p={4}>
                    <Stat>
                      <StatLabel fontSize="sm" color={labelColor}>Total Recompensas</StatLabel>
                      <StatNumber fontSize="2xl">{stats.total}</StatNumber>
                      <StatHelpText fontSize="xs" color={descriptionColor}>
                        {stats.enabled} activas, {stats.paused} pausadas
                      </StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>

                <Card borderRadius="lg" bg={cardBg} borderWidth="1px" borderColor={cardBorder}>
                  <CardBody p={4}>
                    <Stat>
                      <StatLabel fontSize="sm" color={labelColor}>Total Canjeadas</StatLabel>
                      <StatNumber fontSize="2xl">{stats.total_redemptions}</StatNumber>
                      <StatHelpText fontSize="xs" color={descriptionColor}>
                        Canjeos totales
                      </StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>

                <Card borderRadius="lg" bg={cardBg} borderWidth="1px" borderColor={cardBorder}>
                  <CardBody p={4}>
                    <Stat>
                      <StatLabel fontSize="sm" color={labelColor}>Puntos Configurados</StatLabel>
                      <StatNumber fontSize="2xl">{stats.total_points_configured.toLocaleString()}</StatNumber>
                      <StatHelpText fontSize="xs" color={descriptionColor}>
                        Suma total posible
                      </StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>

                <Card borderRadius="lg" bg={cardBg} borderWidth="1px" borderColor={cardBorder}>
                  <CardBody p={4}>
                    <Stat>
                      <StatLabel fontSize="sm" color={labelColor}>Más Canjeada</StatLabel>
                      <StatNumber fontSize="lg" noOfLines={1}>
                        {stats.most_redeemed[0]?.title || 'N/A'}
                      </StatNumber>
                      <StatHelpText fontSize="xs" color={descriptionColor}>
                        {stats.most_redeemed[0]?.total_redemptions || 0} veces
                      </StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>
              </SimpleGrid>
            )}

            {/* Action Bar */}
            <Card borderRadius="lg" bg={cardBg} borderWidth="1px" borderColor={cardBorder}>
              <CardBody p={4}>
                <Flex
                  justify="space-between"
                  align="center"
                  direction={{ base: 'column', md: 'row' }}
                  gap={3}
                >
                  <HStack spacing={2}>
                    {hasChanges && (
                      <Badge colorScheme="orange" fontSize="sm" px={3} py={1}>
                        Cambios pendientes
                      </Badge>
                    )}
                  </HStack>

                  <HStack spacing={3}>
                    <Button
                      variant="outline"
                      onClick={handleSync}
                      isLoading={syncing}
                      leftIcon={<RepeatIcon />}
                      size="md"
                    >
                      Sincronizar
                    </Button>
                    <Button
                      colorScheme="green"
                      onClick={onCreateOpen}
                      leftIcon={<AddIcon />}
                      size="md"
                    >
                      Nueva
                    </Button>
                    {hasChanges && (
                      <Button
                        variant="outline"
                        onClick={handleReset}
                        leftIcon={<CloseIcon />}
                        size="md"
                      >
                        Descartar
                      </Button>
                    )}
                    <Button
                      colorScheme="blue"
                      onClick={handleSaveAll}
                      isLoading={saving}
                      isDisabled={!hasChanges}
                      leftIcon={<CheckIcon />}
                      size="md"
                    >
                      Guardar Todo
                    </Button>
                  </HStack>
                </Flex>
              </CardBody>
            </Card>

            {/* Rewards Table */}
            {!loading && rewards.length === 0 ? (
              <Card borderRadius="lg" bg={cardBg} borderWidth="1px" borderColor={cardBorder}>
                <CardBody p={8}>
                  <VStack spacing={6}>
                    <Alert status="info" borderRadius="lg">
                      <AlertIcon />
                      <Box>
                        <Text fontWeight="bold" mb={1}>No hay recompensas</Text>
                        <Text fontSize="sm" color={descriptionColor}>
                          Sincroniza desde Kick o crea una nueva recompensa para comenzar.
                        </Text>
                      </Box>
                    </Alert>
                    <HStack>
                      <Button
                        colorScheme="blue"
                        onClick={handleSync}
                        isLoading={syncing}
                        leftIcon={<RepeatIcon />}
                        size="lg"
                        px={8}
                      >
                        Sincronizar desde Kick
                      </Button>
                      <Button
                        colorScheme="green"
                        onClick={onCreateOpen}
                        leftIcon={<AddIcon />}
                        size="lg"
                        px={8}
                      >
                        Crear Recompensa
                      </Button>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            ) : (
              <Box
                bg={tableBg}
                borderRadius="lg"
                borderWidth="1px"
                borderColor={cardBorder}
                overflow="hidden"
              >
                <TableContainer>
                  <Table variant="simple" size="sm">
                    <Thead bg={statBg}>
                      <Tr>
                        <Th py={3} width="5%">Color</Th>
                        <Th py={3} width="20%">Recompensa</Th>
                        <Th py={3} width="15%">Costo Kick</Th>
                        <Th py={3} width="15%">Puntos App</Th>
                        <Th py={3} width="10%" textAlign="center">Canjeos</Th>
                        <Th py={3} width="10%" textAlign="center">Auto-Aceptar</Th>
                        <Th py={3} width="10%" textAlign="center">Estado</Th>
                        <Th py={3} width="10%" textAlign="center">Activa</Th>
                        <Th py={3} width="5%"></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {rewards.map((reward) => {
                        const formValue = formData[reward.id] || { 
                          value: reward.puntos_a_otorgar, 
                          enabled: reward.is_enabled,
                          auto_accept: reward.auto_accept,
                        }

                        return (
                          <Tr key={reward.id} _hover={{ bg: tableHoverBg }} transition="all 0.2s">
                            <Td py={3}>
                              <Tooltip label={reward.background_color}>
                                <Box
                                  w="30px"
                                  h="30px"
                                  bg={reward.background_color}
                                  borderRadius="md"
                                  borderWidth="1px"
                                  borderColor={cardBorder}
                                />
                              </Tooltip>
                            </Td>
                            <Td py={3}>
                              <VStack align="start" spacing={0}>
                                <Text fontSize="sm" fontWeight="medium" color={textColor}>
                                  {reward.title}
                                </Text>
                                {reward.description && (
                                  <Text fontSize="xs" color={descriptionColor} noOfLines={1}>
                                    {reward.description}
                                  </Text>
                                )}
                                {reward.is_user_input_required && (
                                  <Badge colorScheme="purple" fontSize="xs" mt={1}>
                                    Requiere input
                                  </Badge>
                                )}
                              </VStack>
                            </Td>
                            <Td py={3}>
                              <Text fontSize="sm" fontWeight="bold" color={textColor}>
                                {reward.cost.toLocaleString()}
                              </Text>
                              <Text fontSize="xs" color={descriptionColor}>
                                puntos Kick
                              </Text>
                            </Td>
                            <Td py={3}>
                              <NumberInput
                                value={formValue.value}
                                onChange={(_, value) => handleValueChange(reward.id, value)}
                                min={0}
                                max={100000}
                                isDisabled={!formValue.enabled}
                                size="sm"
                                maxW="120px"
                              >
                                <NumberInputField />
                                <NumberInputStepper>
                                  <NumberIncrementStepper />
                                  <NumberDecrementStepper />
                                </NumberInputStepper>
                              </NumberInput>
                            </Td>
                            <Td py={3} textAlign="center">
                              <Text fontSize="sm" fontWeight="medium" color={textColor}>
                                {reward.total_redemptions}
                              </Text>
                            </Td>
                            <Td py={3} textAlign="center">
                              <Switch
                                isChecked={formValue.auto_accept}
                                onChange={(e) => handleAutoAcceptChange(reward.id, e.target.checked)}
                                isDisabled={!formValue.enabled}
                                colorScheme="blue"
                                size="md"
                              />
                            </Td>
                            <Td py={3} textAlign="center">
                              <Badge
                                colorScheme={
                                  reward.is_paused ? 'orange' : 
                                  formValue.enabled ? 'green' : 'gray'
                                }
                                fontSize="xs"
                              >
                                {reward.is_paused ? 'Pausada' : formValue.enabled ? 'Activa' : 'Inactiva'}
                              </Badge>
                            </Td>
                            <Td py={3} textAlign="center">
                              <Switch
                                isChecked={formValue.enabled}
                                onChange={(e) => handleEnabledChange(reward.id, e.target.checked)}
                                colorScheme="green"
                                size="md"
                              />
                            </Td>
                            <Td py={3}>
                              <Tooltip label="Eliminar">
                                <IconButton
                                  aria-label="Eliminar"
                                  icon={<DeleteIcon />}
                                  size="sm"
                                  variant="ghost"
                                  colorScheme="red"
                                  onClick={() => handleDeleteReward(reward.id, reward.title)}
                                />
                              </Tooltip>
                            </Td>
                          </Tr>
                        )
                      })}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </VStack>
        </Container>

        {/* Create Reward Modal */}
        <Modal isOpen={isCreateOpen} onClose={onCreateClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Crear Nueva Recompensa</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel fontSize="sm">Título</FormLabel>
                  <Input
                    value={newReward.title}
                    onChange={(e) => setNewReward({ ...newReward, title: e.target.value })}
                    placeholder="Ej: 10K Kiosko"
                    maxLength={50}
                    size="sm"
                  />
                  <FormHelperText fontSize="xs">
                    Máximo 50 caracteres
                  </FormHelperText>
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="sm">Descripción</FormLabel>
                  <Textarea
                    value={newReward.description}
                    onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
                    placeholder="Descripción de la recompensa"
                    maxLength={200}
                    size="sm"
                    rows={3}
                  />
                  <FormHelperText fontSize="xs">
                    Máximo 200 caracteres (opcional)
                  </FormHelperText>
                </FormControl>

                <SimpleGrid columns={2} spacing={4} w="100%">
                  <FormControl isRequired>
                    <FormLabel fontSize="sm">Costo en Kick</FormLabel>
                    <NumberInput
                      value={newReward.cost}
                      onChange={(_, value) => setNewReward({ ...newReward, cost: value })}
                      min={1}
                      max={1000000}
                      size="sm"
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <FormHelperText fontSize="xs">
                      Puntos que cuesta en Kick
                    </FormHelperText>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel fontSize="sm">Puntos a Otorgar</FormLabel>
                    <NumberInput
                      value={newReward.puntos_a_otorgar}
                      onChange={(_, value) => setNewReward({ ...newReward, puntos_a_otorgar: value })}
                      min={0}
                      max={1000000}
                      size="sm"
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <FormHelperText fontSize="xs">
                      Puntos en tu aplicación
                    </FormHelperText>
                  </FormControl>
                </SimpleGrid>

                <FormControl>
                  <FormLabel fontSize="sm">Color de Fondo</FormLabel>
                  <HStack>
                    <Input
                      type="color"
                      value={newReward.background_color}
                      onChange={(e) => setNewReward({ ...newReward, background_color: e.target.value })}
                      w="60px"
                      h="40px"
                      p={1}
                      size="sm"
                    />
                    <Input
                      value={newReward.background_color}
                      onChange={(e) => setNewReward({ ...newReward, background_color: e.target.value })}
                      placeholder="#00e701"
                      size="sm"
                    />
                  </HStack>
                </FormControl>

                <SimpleGrid columns={2} spacing={4} w="100%">
                  <FormControl display="flex" alignItems="center">
                    <FormLabel fontSize="sm" mb="0" mr="auto">
                      Requiere input de usuario
                    </FormLabel>
                    <Switch
                      isChecked={newReward.is_user_input_required}
                      onChange={(e) => setNewReward({ ...newReward, is_user_input_required: e.target.checked })}
                      colorScheme="purple"
                    />
                  </FormControl>

                  <FormControl display="flex" alignItems="center">
                    <FormLabel fontSize="sm" mb="0" mr="auto">
                      Auto-aceptar
                    </FormLabel>
                    <Switch
                      isChecked={newReward.auto_accept}
                      onChange={(e) => setNewReward({ ...newReward, auto_accept: e.target.checked })}
                      colorScheme="blue"
                    />
                  </FormControl>
                </SimpleGrid>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onCreateClose} size="sm">
                Cancelar
              </Button>
              <Button
                colorScheme="green"
                onClick={handleCreateReward}
                isLoading={saving}
                isDisabled={!newReward.title || newReward.cost < 1}
                size="sm"
              >
                Crear Recompensa
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Layout>
    </RequireAdmin>
  )
}
