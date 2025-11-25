import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import { UsuarioAdmin } from './useAdminUsuarios'

/**
 * Hook para obtener un usuario individual por ID o slug (username)
 * Útil para páginas de detalle que usan slugs en la URL pero necesitan el ID para el backend
 */
export function useAdminUsuario(idOrSlug?: string | number) {
  return useQuery<UsuarioAdmin, Error>({
    queryKey: ['admin-usuario', idOrSlug],
    enabled: !!idOrSlug,
    queryFn: async () => {
      if (!idOrSlug) throw new Error('ID o slug requerido')

      // Convertir a string para la búsqueda
      const searchTerm = String(idOrSlug)

      // Usar el endpoint de lista con búsqueda
      const { data } = await api.get<{ users: UsuarioAdmin[] }>(
        `/api/kick-admin/users?search=${encodeURIComponent(searchTerm)}&limit=50`
      )

      if (!data.users || data.users.length === 0) {
        throw new Error(`Usuario no encontrado: ${idOrSlug}`)
      }

      // Si idOrSlug es numérico, buscar por ID exacto
      const numericId = typeof idOrSlug === 'number' ? idOrSlug : parseInt(idOrSlug, 10)
      if (!isNaN(numericId)) {
        const byId = data.users.find((u) => u.id === numericId)
        if (byId) return byId
      }

      // Buscar coincidencia exacta con kick_username o nickname
      const exactMatch = data.users.find(
        (u) => u.nickname === searchTerm || (u as any).kick_username === searchTerm
      )

      if (exactMatch) return exactMatch

      // Si no hay coincidencia exacta, devolver el primero
      return data.users[0]
    },
    staleTime: 30000 // 30 segundos
  })
}
