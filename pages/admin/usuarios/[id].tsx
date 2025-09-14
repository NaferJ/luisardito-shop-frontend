import { useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { Layout } from '../../../components/Layout'
import { RequireAdmin } from '../../../components/RequireAdmin'
import { useAdminCanjes, useUpdateCanjeEstado, useDevolverCanje } from '../../../hooks/useAdminCanjes'
import { useAdminUsuarios } from '../../../hooks/useAdminUsuarios'
import {
  Box,
  Container,
  Heading,
  HStack,
  VStack,
  Text,
  Badge,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
  useToast,
  Spinner,
  Center,
} from '@chakra-ui/react'

export default function AdminUsuarioDetallePage() {
  const router = useRouter()
  const { id } = router.query
  const toast = useToast()

  const { data: usuarios } = useAdminUsuarios()
  const usuario = useMemo(() => usuarios?.find(u => String(u.id) === String(id)), [usuarios, id])

  const { data: canjes, isLoading, error } = useAdminCanjes()
  const canjesUsuario = useMemo(() => (canjes || []).filter(c => String(c.usuario_id) === String(id)), [canjes, id])

  const updateEstado = useUpdateCanjeEstado()
  const devolver = useDevolverCanje()

  const [estadoSeleccionado, setEstadoSeleccionado] = useState<'pendiente'|'entregado'|'cancelado'>('pendiente')

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
        <Center mt={10}>Error al cargar canjes</Center>
      </Layout>
    </RequireAdmin>
  )

  return (
    <RequireAdmin>
      <Layout>
        <Container maxW="container.xl" py={8}>
          <VStack align="stretch" spacing={6}>
            <HStack justify="space-between">
              <Heading>Gestión de usuario #{id}</Heading>
              <HStack>
                <Badge colorScheme="teal">Puntos: {usuario?.puntos ?? '-'}</Badge>
                <Badge>{(usuario as any)?.nickname || (usuario as any)?.nombre || '-'}</Badge>
              </HStack>
            </HStack>

            <Box>
              <Heading size="md" mb={4}>Canjes del usuario</Heading>
              {!canjesUsuario.length ? (
                <Text color="text.muted">Sin canjes</Text>
              ) : (
                <Table size="sm">
                  <Thead>
                    <Tr>
                      <Th>ID</Th>
                      <Th>Producto</Th>
                      <Th>Precio</Th>
                      <Th>Estado</Th>
                      <Th>Acciones</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {canjesUsuario.map((c) => (
                      <Tr key={c.id}>
                        <Td>{c.id}</Td>
                        <Td>{(c as any).Producto?.nombre || c.producto_id}</Td>
                        <Td>{(c as any).Producto?.precio ?? '-'}</Td>
                        <Td>
                          <Badge colorScheme={c.estado === 'pendiente' ? 'yellow' : c.estado === 'entregado' ? 'green' : c.estado === 'cancelado' ? 'red' : 'purple'}>{c.estado}</Badge>
                        </Td>
                        <Td>
                          <HStack>
                            <Select size="xs" value={estadoSeleccionado} onChange={(e) => setEstadoSeleccionado(e.target.value as any)} w="40">
                              <option value="pendiente">pendiente</option>
                              <option value="entregado">entregado</option>
                              <option value="cancelado">cancelado</option>
                            </Select>
                            <Button size="xs" onClick={async () => {
                              try {
                                await updateEstado.mutateAsync({ canjeId: c.id, estado: estadoSeleccionado })
                                toast({ title: 'Estado actualizado', status: 'success' })
                              } catch (e: any) {
                                toast({ title: 'Error', description: e?.response?.data?.error || 'No se pudo actualizar', status: 'error' })
                              }
                            }}>Guardar</Button>
                            <Button size="xs" colorScheme="purple" variant="outline" onClick={async () => {
                              const motivo = window.prompt('Motivo de la devolución:')
                              if (!motivo) return
                              try {
                                await devolver.mutateAsync({ canjeId: c.id, motivo })
                                toast({ title: 'Canje devuelto', status: 'success' })
                              } catch (e: any) {
                                toast({ title: 'Error', description: e?.response?.data?.error || 'No se pudo devolver', status: 'error' })
                              }
                            }}>Devolver</Button>
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </Box>
          </VStack>
        </Container>
      </Layout>
    </RequireAdmin>
  )
}
