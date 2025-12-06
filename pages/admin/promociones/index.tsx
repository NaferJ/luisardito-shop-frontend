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
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
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
  Card,
  CardBody,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Flex,
  Stack,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Checkbox,
  Icon
} from '@chakra-ui/react'
import { useState, useRef, useMemo } from 'react'
import { usePromociones } from '../../../hooks/usePromociones'
import { useDeletePromocion, useActualizarEstadosPromociones } from '../../../hooks/usePromocion'
import { Promocion } from '../../../types'
import {
  AddIcon,
  SearchIcon,
  EditIcon,
  DeleteIcon,
  ChevronDownIcon,
} from '@chakra-ui/icons'
import { FiBarChart2, FiDownload, FiRefreshCw } from 'react-icons/fi'
import Head from 'next/head'
import { useRouter } from 'next/router'
import api from '../../../lib/api'

export default function AdminPromocionesPage() {
  const router = useRouter()
  const toast = useToast()
  const cancelRef = useRef<HTMLButtonElement>(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [filterEstado, setFilterEstado] = useState<'all' | 'activo' | 'programado' | 'expirado' | 'inactivo' | 'pausado'>('all')
  const [selectedPromocion, setSelectedPromocion] = useState<Promocion | null>(null)
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()

  const { data: promocionesData, isLoading } = usePromociones(
    filterEstado !== 'all'
      ? {
          estado: filterEstado as
            | 'activo'
            | 'programado'
            | 'expirado'
            | 'inactivo'
            | 'pausado'
        }
      : undefined
  )

  const deleteMutation = useDeletePromocion()
  const actualizarEstadosMutation = useActualizarEstadosPromociones()

  const hoverBg = useColorModeValue('gray.50', 'gray.700')
  const cardBg = useColorModeValue('white', 'gray.800')
  const cardBorder = useColorModeValue('gray.200', 'gray.600')
  const tableBg = useColorModeValue('white', 'gray.800')
  const statBg = useColorModeValue('gray.50', 'gray.700')
  const textColor = useColorModeValue('gray.800', 'white')
  const mutedColor = useColorModeValue('gray.600', 'gray.400')

  const promociones = useMemo(() => promocionesData || [], [promocionesData])

  const filteredPromociones = useMemo(() => {
    return promociones.filter((promo) => {
      const matchesSearch = promo.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promo.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
      
      return matchesSearch
    })
  }, [promociones, searchTerm])

  const estadoColorMap: Record<string, string> = {
    activo: 'green',
    programado: 'blue',
    expirado: 'gray',
    inactivo: 'orange',
    pausado: 'yellow'
  }

  const handleDelete = async () => {
    if (!selectedPromocion) return
    try {
      await deleteMutation.mutateAsync(selectedPromocion.id)
      toast({
        title: 'Promoción eliminada',
        description: 'La promoción se ha marcado como inactiva',
        status: 'success',
        duration: 3000,
        isClosable: true
      })
      onDeleteClose()
    } catch {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la promoción',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    }
  }

  const handleActualizarEstados = async () => {
    try {
      await actualizarEstadosMutation.mutateAsync()
      toast({
        title: 'Estados actualizados',
        description: 'Los estados de las promociones se han actualizado',
        status: 'success',
        duration: 3000,
        isClosable: true
      })
    } catch {
      toast({
        title: 'Error',
        description: 'No se pudieron actualizar los estados',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    }
  }

  const handleExportarPDF = async () => {
    try {
      const response = await api.get('/api/promociones/exportar-pdf', {
        responseType: 'blob',
        params: filterEstado !== 'all' ? { estado: filterEstado } : {}
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `promociones-${Date.now()}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()

      toast({
        title: 'PDF exportado',
        description: 'El reporte se ha descargado correctamente',
        status: 'success',
        duration: 3000,
        isClosable: true
      })
    } catch {
      toast({
        title: 'Error',
        description: 'No se pudo exportar el PDF',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    }
  }

  const handleBulkDelete = async () => {
    if (!confirm(`¿Estás seguro de eliminar ${selectedIds.length} promoción(es)?`)) return
    
    try {
      for (const id of selectedIds) {
        await deleteMutation.mutateAsync(id)
      }
      toast({
        title: 'Promociones eliminadas',
        description: `Se eliminaron ${selectedIds.length} promoción(es)`,
        status: 'success',
        duration: 3000,
        isClosable: true
      })
      setSelectedIds([])
    } catch {
      toast({
        title: 'Error al eliminar',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    }
  }

  const toggleSelection = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredPromociones.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredPromociones.map(p => p.id))
    }
  }

  return (
    <RequireAdmin>
      <Layout>
        <Head>
          <title>Gestión de Promociones - Admin</title>
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
                  Gestión de Promociones
                </Heading>
                <Text color={mutedColor} fontSize="sm">
                  Administra las promociones y descuentos de la tienda
                </Text>
              </VStack>
              <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={() => router.push('/admin/promociones/crear')}>
                Nueva Promoción
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
                        placeholder="Buscar promociones..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </InputGroup>

                    <Select
                      maxW={{ base: 'full', md: '150px' }}
                      value={filterEstado}
                      onChange={(e) => setFilterEstado(e.target.value as typeof filterEstado)}
                    >
                      <option value="all">Todas</option>
                      <option value="activo">Activas</option>
                      <option value="programado">Programadas</option>
                      <option value="expirado">Expiradas</option>
                      <option value="inactivo">Inactivas</option>
                      <option value="pausado">Pausadas</option>
                    </Select>

                    <Button
                      leftIcon={<Icon as={FiRefreshCw} />}
                      onClick={handleActualizarEstados}
                      isLoading={actualizarEstadosMutation.isPending}
                      colorScheme="purple"
                      size="md"
                    >
                      Actualizar Estados
                    </Button>

                    <Button
                      leftIcon={<Icon as={FiDownload} />}
                      onClick={handleExportarPDF}
                      colorScheme="teal"
                      size="md"
                    >
                      Exportar PDF
                    </Button>
                  </Stack>

                  {selectedIds.length > 0 && (
                    <HStack spacing={2}>
                      <Badge colorScheme="blue" fontSize="sm" px={3} py={1}>
                        {selectedIds.length} seleccionadas
                      </Badge>
                      <Menu>
                        <MenuButton colorScheme="blue" as={Button} rightIcon={<ChevronDownIcon />} size="md">
                          Acciones
                        </MenuButton>
                        <MenuList>
                          <MenuItem onClick={handleBulkDelete} color="red.500">
                            Eliminar seleccionadas
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
                    <Text color={mutedColor}>Cargando promociones...</Text>
                  </VStack>
                </Center>
              ) : filteredPromociones.length === 0 ? (
                <Center py={10}>
                  <VStack>
                    <Text color={mutedColor}>No se encontraron promociones</Text>
                    <Button leftIcon={<AddIcon />} colorScheme="blue" variant="outline" onClick={() => router.push('/admin/promociones/crear')}>
                      Crear primera promoción
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
                            isChecked={selectedIds.length === filteredPromociones.length}
                            isIndeterminate={selectedIds.length > 0 && selectedIds.length < filteredPromociones.length}
                            onChange={toggleSelectAll}
                          />
                        </Th>
                        <Th py={3} width="180px">Título</Th>
                        <Th py={3} width="100px">Estado</Th>
                        <Th py={3} width="100px">Tipo</Th>
                        <Th py={3} width="120px">Descuento</Th>
                        <Th py={3} width="180px">Vigencia</Th>
                        <Th py={3} width="100px" isNumeric>Usos</Th>
                        <Th py={3} width="120px" textAlign="center">Acciones</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredPromociones.map((promo) => (
                        <Tr key={promo.id} _hover={{ bg: hoverBg }} transition="all 0.2s">
                          <Td py={3}>
                            <Checkbox
                              isChecked={selectedIds.includes(promo.id)}
                              onChange={() => toggleSelection(promo.id)}
                            />
                          </Td>
                          <Td py={3}>
                            <VStack align="start" spacing={1}>
                              <Text fontWeight="bold" fontSize="sm">
                                {promo.titulo}
                              </Text>
                              {promo.codigo && (
                                <Badge colorScheme="purple" fontSize="xs">
                                  {promo.codigo}
                                </Badge>
                              )}
                            </VStack>
                          </Td>
                          <Td py={3}>
                            <Badge colorScheme={estadoColorMap[promo.estado] || 'gray'} fontSize="xs">
                              {promo.estado}
                            </Badge>
                          </Td>
                          <Td py={3}>
                            <Badge variant="outline" fontSize="xs">{promo.tipo}</Badge>
                          </Td>
                          <Td py={3}>
                            <Text fontWeight="semibold" fontSize="sm">
                              {promo.tipo_descuento === 'porcentaje'
                                ? `${promo.valor_descuento}%`
                                : promo.tipo_descuento === 'fijo'
                                ? `${promo.valor_descuento} pts`
                                : promo.tipo_descuento}
                            </Text>
                          </Td>
                          <Td py={3}>
                            <VStack align="start" spacing={0} fontSize="xs">
                              <Text>{new Date(promo.fecha_inicio).toLocaleDateString()}</Text>
                              <Text color={mutedColor}>
                                {new Date(promo.fecha_fin).toLocaleDateString()}
                              </Text>
                            </VStack>
                          </Td>
                          <Td py={3} isNumeric>
                            <Badge colorScheme="gray" fontSize="xs">
                              {promo.cantidad_usos_actuales} / {promo.cantidad_usos_maximos || '∞'}
                            </Badge>
                          </Td>
                          <Td py={3} textAlign="center">
                            <ActionsMenu
                              items={[
                                {
                                  label: 'Editar',
                                  icon: EditIcon,
                                  onClick: () => router.push(`/admin/promociones/${promo.id}/editar`)
                                },
                                {
                                  label: 'Estadísticas',
                                  icon: FiBarChart2,
                                  onClick: () => router.push(`/admin/promociones/${promo.id}/estadisticas`),
                                  colorScheme: 'purple' as const
                                },
                                {
                                  label: 'Eliminar',
                                  icon: DeleteIcon,
                                  onClick: () => {
                                    setSelectedPromocion(promo)
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

        <AlertDialog isOpen={isDeleteOpen} leastDestructiveRef={cancelRef} onClose={onDeleteClose}>
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Eliminar Promoción
              </AlertDialogHeader>

              <AlertDialogBody>
                ¿Estás seguro de eliminar <strong>{selectedPromocion?.titulo}</strong>? 
                La promoción se marcará como inactiva.
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
