import { Layout } from '../../../components/Layout'
import { RequireAdmin } from '../../../components/RequireAdmin'
import {
  Box,
  Container,
  Heading,
  Button,
  Badge,
  HStack,
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
} from '@chakra-ui/react'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useAdminUsuarios, useUpdateUsuarioPuntos, UsuarioAdmin } from '../../../hooks/useAdminUsuarios'
import AdminDynamicTable, { ColumnConfig } from '../../../components/AdminDynamicTable'
import { SettingsIcon } from '@chakra-ui/icons'

export default function AdminUsuariosPage() {
  const { data: usuarios, isLoading, error } = useAdminUsuarios({ limit: 50, offset: 0 })
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedUser, setSelectedUser] = useState<{ id: number; nickname?: string; puntos: number } | null>(null)
  const [puntos, setPuntos] = useState<number>(0)
  const updatePuntos = useUpdateUsuarioPuntos()
  const toast = useToast()
  const router = useRouter()

  const openModal = (u: UsuarioAdmin) => {
    setSelectedUser({ id: u.id, nickname: (u as any).nickname || u.nombre, puntos: u.puntos })
    setPuntos(u.puntos)
    onOpen()
  }

  const savePuntos = async () => {
    if (!selectedUser) return
    try {
      await updatePuntos.mutateAsync({ usuarioId: selectedUser.id, puntos, motivo: 'Ajuste manual admin' })
      toast({ title: 'Puntos actualizados', status: 'success' })
      onClose()
    } catch (e: any) {
      toast({ title: 'Error', description: e?.response?.data?.error || 'No se pudo actualizar', status: 'error' })
    }
  }

  const menuBg = useColorModeValue('rgba(255,255,255,0.92)', 'rgba(17,24,39,0.85)')
  const menuBorder = useColorModeValue('blackAlpha.300', 'whiteAlpha.300')
  const menuColor = useColorModeValue('gray.800', 'gray.100')
  const menuHoverBg = useColorModeValue('gray.100', 'gray.700')

  const rows = useMemo(() => {
    return (usuarios || []).map((u: any) => ({
      id: u.id,
      nickname: u?.nickname || u?.nombre || '-',
      email: u.email,
      puntos: u.puntos,
      total_canjes: u.total_canjes ?? null,
      canjes_pendientes: u.canjes_pendientes ?? null,
      _raw: u,
    }))
  }, [usuarios])

  const columns: ColumnConfig<any>[] = useMemo(() => [
    { key: 'id', label: 'ID', type: 'number' },
    { key: 'nickname', label: 'Nickname', type: 'string' },
    { key: 'email', label: 'Email', type: 'string' },
    { key: 'puntos', label: 'Puntos', type: 'number', render: (row) => (<Badge colorScheme="teal">{row.puntos}</Badge>) },
    { key: 'total_canjes', label: 'Canjes', type: 'number' },
    { key: 'canjes_pendientes', label: 'Pendientes', type: 'number' },
    {
      key: 'acciones', label: 'Acciones', sortable: false, filterable: false,
      render: (row) => (
        <Menu isLazy placement="bottom-end">
          <MenuButton as={IconButton} aria-label="Acciones" icon={<SettingsIcon boxSize={4} />} size="sm" variant="ghost" onClick={(e) => e.stopPropagation()} />
          <Portal>
            <MenuList zIndex={1400} bg={menuBg} color={menuColor} borderColor={menuBorder} boxShadow={useColorModeValue('0 8px 24px rgba(0,0,0,0.18)', '0 12px 32px rgba(0,0,0,0.65)')} sx={{ backdropFilter: 'saturate(160%) blur(8px)' }}>
              <MenuItem bg="transparent" _hover={{ bg: menuHoverBg }} onClick={() => openModal(row._raw)}>Editar puntos</MenuItem>
              <MenuItem bg="transparent" _hover={{ bg: menuHoverBg }} onClick={() => router.push(`/admin/usuarios/${row.id}`)}>Ver canjes</MenuItem>
            </MenuList>
          </Portal>
        </Menu>
      )
    }
  ], [menuBg, menuBorder, menuColor, menuHoverBg, router])

  if (isLoading) return (
    <RequireAdmin>
      <Layout>
        <Center mt={10}><Spinner size="xl"/></Center>
      </Layout>
    </RequireAdmin>
  )
  if (error) return (
    <RequireAdmin>
      <Layout>
        <Center mt={10}>Error al cargar usuarios</Center>
      </Layout>
    </RequireAdmin>
  )

  return (
    <RequireAdmin>
      <Layout>
        <Container maxW="container.xl" py={2}>
          <Heading mb={6}>Usuarios</Heading>
          {!rows?.length ? (
            <Center py={10}><Text color="text.muted">No hay usuarios</Text></Center>
          ) : (
            <AdminDynamicTable data={rows} columns={columns} defaultPageSize={20} searchable showFilters />
          )}
        </Container>

        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay/>
          <ModalContent>
            <ModalHeader>Editar puntos {selectedUser?.nickname ? `(${selectedUser.nickname})` : ''}</ModalHeader>
            <ModalCloseButton/>
            <ModalBody>
              <NumberInput value={puntos} min={0} onChange={(vStr, vNum) => setPuntos(vNum || 0)}>
                <NumberInputField/>
              </NumberInput>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>Cancelar</Button>
              <Button colorScheme="teal" onClick={savePuntos} isLoading={updatePuntos.isPending}>Guardar</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Layout>
    </RequireAdmin>
  )
}
