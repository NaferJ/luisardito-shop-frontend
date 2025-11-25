import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import { Canje } from '../types'

export function useAdminUsuarioCanjes(usuarioId?: number) {
  return useQuery<Canje[], Error>({
    queryKey: ['admin-canjes-usuario', usuarioId],
    enabled: !!usuarioId,
    queryFn: async () => {
      if (!usuarioId) return []
      try {
        const { data } = await api.get<Canje[]>(`/api/usuarios/${usuarioId}/canjes`)
        return data
      } catch (err) {
        // Fallback a query param si el endpoint dedicado no existe
        const { data } = await api.get<Canje[]>(`/api/canjes`, {
          params: { usuario_id: usuarioId }
        })
        return data
      }
    }
  })
}
