import { Layout } from '../../../components/Layout'
import { RequireAdmin } from '../../../components/RequireAdmin'
import { useAdminCanjes, useUpdateCanjeEstado, useDevolverCanje } from '../../../hooks/useAdminCanjes'
import { Container, Heading, Badge, Spinner, Center, useToast, Text, IconButton, Menu, MenuButton, MenuItem, MenuList, useColorModeValue, Portal } from '@chakra-ui/react'
import { useMemo } from 'react'
import AdminDynamicTable, { ColumnConfig } from '../../../components/AdminDynamicTable'
import { SettingsIcon } from '@chakra-ui/icons'

export default function AdminCanjesPage() {
  const { data: canjes, isLoading, error } = useAdminCanjes()
  const updateEstado = useUpdateCanjeEstado()
  const devolver = useDevolverCanje()
  const toast = useToast()

  const menuBg = useColorModeValue('rgba(255,255,255,0.92)', 'rgba(17,24,39,0.85)')
  const menuBorder = useColorModeValue('blackAlpha.300', 'whiteAlpha.300')
  const menuColor = useColorModeValue('gray.800', 'gray.100')
  const menuHoverBg = useColorModeValue('gray.100', 'gray.700')

  const rows = useMemo(() => {
    return (canjes || []).map((c: any) => ({
      id: c.id,
      usuario: c?.Usuario?.nickname || c?.usuario?.nickname || c.usuario_id,
      producto: c?.Producto?.nombre || c.producto_id,
      precio: c?.Producto?.precio ?? null,
      estado: c.estado as string,
      _raw: c,
    }))
  }, [canjes])

  const columns: ColumnConfig<any>[] = useMemo(() => [
    { key: 'id', label: 'ID', type: 'number', sortable: true },
    { key: 'usuario', label: 'Usuario', type: 'string', sortable: true },
    { key: 'producto', label: 'Producto', type: 'string', sortable: true },
    { key: 'precio', label: 'Precio', type: 'number', sortable: true, format: (v) => v ?? '-' },
    {
      key: 'estado', label: 'Estado', type: 'string', sortable: true,
      render: (row) => (
        <Badge colorScheme={row.estado === 'pendiente' ? 'yellow' : row.estado === 'entregado' ? 'green' : row.estado === 'cancelado' ? 'red' : 'purple'}>
          {row.estado}
        </Badge>
      )
    },
    {
      key: 'acciones', label: 'Acciones', sortable: false, filterable: false,
      render: (row) => (
        <Menu isLazy placement="bottom-end">
          <MenuButton as={IconButton} aria-label="Acciones" icon={<SettingsIcon boxSize={4} />} size="sm" variant="ghost" onClick={(e) => e.stopPropagation()} />
          <Portal>
            <MenuList zIndex={1400} bg={menuBg} color={menuColor} borderColor={menuBorder} boxShadow={useColorModeValue('0 8px 24px rgba(0,0,0,0.18)', '0 12px 32px rgba(0,0,0,0.65)')} sx={{ backdropFilter: 'saturate(160%) blur(8px)' }}>
              <MenuItem bg="transparent" _hover={{ bg: menuHoverBg }} onClick={async () => {
                try { await updateEstado.mutateAsync({ canjeId: row._raw.id, estado: 'pendiente' }); toast({ title: 'Marcado pendiente', status: 'success' }) } catch (e: any) { toast({ title: 'Error', description: e?.response?.data?.error || 'No se pudo actualizar', status: 'error' }) }
              }}>Marcar pendiente</MenuItem>
              <MenuItem bg="transparent" _hover={{ bg: menuHoverBg }} onClick={async () => {
                try { await updateEstado.mutateAsync({ canjeId: row._raw.id, estado: 'entregado' }); toast({ title: 'Marcado entregado', status: 'success' }) } catch (e: any) { toast({ title: 'Error', description: e?.response?.data?.error || 'No se pudo actualizar', status: 'error' }) }
              }}>Marcar entregado</MenuItem>
              <MenuItem bg="transparent" _hover={{ bg: menuHoverBg }} onClick={async () => {
                try { await updateEstado.mutateAsync({ canjeId: row._raw.id, estado: 'cancelado' }); toast({ title: 'Marcado cancelado', status: 'success' }) } catch (e: any) { toast({ title: 'Error', description: e?.response?.data?.error || 'No se pudo actualizar', status: 'error' }) }
              }}>Marcar cancelado</MenuItem>
              <MenuItem bg="transparent" _hover={{ bg: menuHoverBg }} onClick={async () => {
                const motivo = window.prompt('Motivo de la devolución:')
                if (!motivo) return
                try { await devolver.mutateAsync({ canjeId: row._raw.id, motivo }); toast({ title: 'Canje devuelto', status: 'success' }) } catch (e: any) { toast({ title: 'Error', description: e?.response?.data?.error || 'No se pudo devolver', status: 'error' }) }
              }}>Devolver</MenuItem>
            </MenuList>
          </Portal>
        </Menu>
      )
    }
  ], [menuBg, menuBorder, menuColor, menuHoverBg, toast, updateEstado, devolver])

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
          {!rows.length ? (
            <Text color="text.muted">No hay canjes para mostrar</Text>
          ) : (
            <AdminDynamicTable data={rows} columns={columns} defaultPageSize={10} searchable showFilters />
          )}
        </Container>
      </Layout>
    </RequireAdmin>
  )
}
