import { Layout } from '../../../components/Layout'
import { RequireAdmin } from '../../../components/RequireAdmin'
import {
  Box,
  Container,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
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
} from '@chakra-ui/react'
import Link from 'next/link'
import { useState } from 'react'
import { useAdminUsuarios, useUpdateUsuarioPuntos, UsuarioAdmin } from '../../../hooks/useAdminUsuarios'

export default function AdminUsuariosPage() {
  const { data: usuarios, isLoading, error } = useAdminUsuarios({ limit: 50, offset: 0 })
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedUser, setSelectedUser] = useState<{ id: number; nickname?: string; puntos: number } | null>(null)
  const [puntos, setPuntos] = useState<number>(0)
  const updatePuntos = useUpdateUsuarioPuntos()
  const toast = useToast()

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
          {!usuarios?.length ? (
            <Center py={10}><Text color="text.muted">No hay usuarios</Text></Center>
          ) : (
            <Box overflowX="auto">
              <Table size="sm">
                <Thead>
                  <Tr>
                    <Th>ID</Th>
                    <Th>Nickname</Th>
                    <Th>Email</Th>
                    <Th>Puntos</Th>
                    <Th>Canjes</Th>
                    <Th>Pendientes</Th>
                    <Th>Acciones</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {usuarios.map((u) => (
                    <Tr key={u.id}>
                      <Td>{u.id}</Td>
                      <Td>{(u as any).nickname || (u as any).nombre || '-'}</Td>
                      <Td>{u.email}</Td>
                      <Td><Badge colorScheme="teal">{u.puntos}</Badge></Td>
                      <Td>{u.total_canjes ?? '-'}</Td>
                      <Td>{u.canjes_pendientes ?? '-'}</Td>
                      <Td>
                        <HStack>
                          <Button size="xs" onClick={() => openModal(u)}>Editar puntos</Button>
                          <Link href={`/admin/usuarios/${u.id}`} passHref>
                            <Button size="xs" colorScheme="blue" variant="outline">Ver canjes</Button>
                          </Link>
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
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
