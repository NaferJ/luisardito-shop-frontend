import { Layout } from '../../../components/Layout'
import { RequireAdmin } from '../../../components/RequireAdmin'
import { useRouter } from 'next/router'
import { useAdminUsuarioCanjes } from '../../../hooks/useAdminUsuarioCanjes'
import { useUpdateCanjeEstado, useDevolverCanje } from '../../../hooks/useAdminCanjes'
import {
  Container,
  Heading,
  Spinner,
  Center,
  Text,
  HStack,
  Button,
  Badge,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useToast,
  useColorModeValue,
  Portal,
  Box,
} from '@chakra-ui/react'
import { SettingsIcon, ArrowBackIcon } from '@chakra-ui/icons'
import { useMemo } from 'react'
import AdminDynamicTable, { ColumnConfig } from '../../../components/AdminDynamicTable'

export default function AdminUsuarioGestionPage() {
  const router = useRouter()
  const { id } = router.query

  const { data: canjes, isLoading, error, refetch } = useAdminUsuarioCanjes(id as string)
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
      producto: c?.Producto?.nombre || c.producto_id,
      precio: c?.Producto?.precio ?? null,
      estado: c.estado as string,
      fecha: c.fecha,
      usuario_nickname: c?.Usuario?.nickname || c?.usuario?.nickname,
      usuario_email: c?.Usuario?.email || c?.usuario?.email,
      _raw: c,
    }))
  }, [canjes])

  const userTitle = useMemo(() => {
    if (!rows.length) return `Gestión de usuario #${id}`
    const r = rows[0]
    const nick = r.usuario_nickname
    const email = r.usuario_email
    if (nick && email) return `Gestión de usuario: ${nick} (${email})`
    if (nick) return `Gestión de usuario: ${nick}`
    if (email) return `Gestión de usuario: ${email}`
    return `Gestión de usuario #${id}`
  }, [rows, id])

  const columns: ColumnConfig<any>[] = useMemo(() => [
    { key: 'id', label: 'ID', type: 'number', sortable: true },
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
    { key: 'fecha', label: 'Fecha', type: 'date', sortable: true, format: (v) => {
      try { const d = new Date(v); return isNaN(d.getTime()) ? String(v) : d.toLocaleString('es-ES') } catch { return String(v) }
    } },
    {
      key: 'acciones', label: 'Acciones', sortable: false, filterable: false,
      render: (row) => (
        <Menu isLazy placement="bottom-end">
          <MenuButton as={IconButton} aria-label="Acciones" icon={<SettingsIcon boxSize={4} />} size="sm" variant="ghost" onClick={(e) => e.stopPropagation()} />
          <Portal>
            <MenuList zIndex={1400} bg={menuBg} color={menuColor} borderColor={menuBorder} boxShadow={useColorModeValue('0 8px 24px rgba(0,0,0,0.18)', '0 12px 32px rgba(0,0,0,0.65)')} sx={{ backdropFilter: 'saturate(160%) blur(8px)' }}>
              <MenuItem bg="transparent" _hover={{ bg: menuHoverBg }} onClick={async () => {
                try { await updateEstado.mutateAsync({ canjeId: row._raw.id, estado: 'pendiente' }); toast({ title: 'Marcado pendiente', status: 'success' }); refetch() } catch (e: any) { toast({ title: 'Error', description: e?.response?.data?.error || 'No se pudo actualizar', status: 'error' }) }
              }}>Marcar pendiente</MenuItem>
              <MenuItem bg="transparent" _hover={{ bg: menuHoverBg }} onClick={async () => {
                try { await updateEstado.mutateAsync({ canjeId: row._raw.id, estado: 'entregado' }); toast({ title: 'Marcado entregado', status: 'success' }); refetch() } catch (e: any) { toast({ title: 'Error', description: e?.response?.data?.error || 'No se pudo actualizar', status: 'error' }) }
              }}>Marcar entregado</MenuItem>
              <MenuItem bg="transparent" _hover={{ bg: menuHoverBg }} onClick={async () => {
                try { await updateEstado.mutateAsync({ canjeId: row._raw.id, estado: 'cancelado' }); toast({ title: 'Marcado cancelado', status: 'success' }); refetch() } catch (e: any) { toast({ title: 'Error', description: e?.response?.data?.error || 'No se pudo actualizar', status: 'error' }) }
              }}>Marcar cancelado</MenuItem>
              <MenuItem bg="transparent" _hover={{ bg: menuHoverBg }} onClick={async () => {
                const motivo = window.prompt('Motivo de la devolución:')
                if (!motivo) return
                try { await devolver.mutateAsync({ canjeId: row._raw.id, motivo }); toast({ title: 'Canje devuelto', status: 'success' }); refetch() } catch (e: any) { toast({ title: 'Error', description: e?.response?.data?.error || 'No se pudo devolver', status: 'error' }) }
              }}>Devolver</MenuItem>
            </MenuList>
          </Portal>
        </Menu>
      )
    }
  ], [menuBg, menuBorder, menuColor, menuHoverBg, toast, updateEstado, devolver, refetch])

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
        <Center mt={10}>Error al cargar canjes del usuario</Center>
      </Layout>
    </RequireAdmin>
  )

  return (
    <RequireAdmin>
      <Layout>
        <Container maxW="container.xl" py={8}>
          <HStack justify="space-between" mb={4}>
            <Heading size="lg">{userTitle}</Heading>
            <HStack>
              <Button leftIcon={<ArrowBackIcon />} variant="outline" onClick={() => router.push('/admin/usuarios')}>Volver</Button>
            </HStack>
          </HStack>

          {!rows.length ? (
            <Box><Text color="text.muted">Este usuario no tiene canjes</Text></Box>
          ) : (
            <AdminDynamicTable data={rows} columns={columns} defaultPageSize={10} searchable showFilters />
          )}
        </Container>
      </Layout>
    </RequireAdmin>
  )
}
