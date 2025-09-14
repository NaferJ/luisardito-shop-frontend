import { Layout } from '../../../components/Layout'
import { RequireAdmin } from '../../../components/RequireAdmin'
import { useAdminCanjes, useUpdateCanjeEstado, useDevolverCanje } from '../../../hooks/useAdminCanjes'
import { Container, Heading, Table, Thead, Tbody, Tr, Th, Td, Badge, HStack, Button, Select, Spinner, Center, useToast, Text } from '@chakra-ui/react'
import { useState } from 'react'

export default function AdminCanjesPage() {
  const { data: canjes, isLoading, error } = useAdminCanjes()
  const updateEstado = useUpdateCanjeEstado()
  const devolver = useDevolverCanje()
  const toast = useToast()

  const [estado, setEstado] = useState<'pendiente'|'entregado'|'cancelado'>('pendiente')

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
          <Heading mb={6}>Canjes (global)</Heading>
          {!canjes?.length ? (
            <Text color="text.muted">No hay canjes para mostrar</Text>
          ) : (
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>ID</Th>
                  <Th>Usuario</Th>
                  <Th>Producto</Th>
                  <Th>Precio</Th>
                  <Th>Estado</Th>
                  <Th>Acciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {(canjes || []).map((c) => (
                  <Tr key={c.id}>
                    <Td>{c.id}</Td>
                    <Td>{(c as any).Usuario?.nickname || (c as any).usuario?.nickname || c.usuario_id}</Td>
                    <Td>{(c as any).Producto?.nombre || c.producto_id}</Td>
                    <Td>{(c as any).Producto?.precio ?? '-'}</Td>
                    <Td><Badge colorScheme={c.estado === 'pendiente' ? 'yellow' : c.estado === 'entregado' ? 'green' : c.estado === 'cancelado' ? 'red' : 'purple'}>{c.estado}</Badge></Td>
                    <Td>
                      <HStack>
                        <Select size="xs" value={estado} onChange={(e) => setEstado(e.target.value as any)} w="40">
                          <option value="pendiente">pendiente</option>
                          <option value="entregado">entregado</option>
                          <option value="cancelado">cancelado</option>
                        </Select>
                        <Button size="xs" onClick={async () => {
                          try {
                            await updateEstado.mutateAsync({ canjeId: c.id, estado })
                            toast({ title: 'Estado actualizado', status: 'success' })
                          } catch (e: any) {
                            toast({ title: 'Error', description: e?.response?.data?.error || 'No se pudo actualizar', status: 'error' })
                          }
                        }}>Guardar</Button>
                        <Button size="xs" variant="outline" colorScheme="purple" onClick={async () => {
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
        </Container>
      </Layout>
    </RequireAdmin>
  )
}
