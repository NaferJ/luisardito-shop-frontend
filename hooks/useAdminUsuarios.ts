import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import { useAuth } from './useAuth'

// Tipos para admin de usuarios
export interface UsuarioAdmin {
  id: number
  nombre?: string
  nickname?: string
  email: string
  puntos: number
  rol_id: number
  user_id_ext?: string | null
  created_at?: string
  updated_at?: string
  total_canjes?: number
  canjes_pendientes?: number
}

// Hook para listar usuarios (admin)
export function useAdminUsuarios(params?: { limit?: number; offset?: number }) {
  const { limit, offset } = params || {}
  const qs = new URLSearchParams()
  if (typeof limit === 'number') qs.set('limit', String(limit))
  if (typeof offset === 'number') qs.set('offset', String(offset))

  const url = qs.toString() ? `/api/usuarios?${qs.toString()}` : '/api/usuarios'

  return useQuery<UsuarioAdmin[], Error>({
    queryKey: ['admin-usuarios', limit, offset],
    queryFn: async () => {
      const { data } = await api.get<UsuarioAdmin[]>(url)
      return data
    }
  })
}

// Hook para actualizar puntos de usuario (admin)
export function useUpdateUsuarioPuntos() {
  const queryClient = useQueryClient()
  const { refreshUser } = useAuth()

  return useMutation({
    mutationFn: async ({ 
      usuarioId, 
      puntos, 
      motivo 
    }: { 
      usuarioId: number
      puntos: number
      motivo: string 
    }) => {
      const { data } = await api.put(`/api/usuarios/${usuarioId}/puntos`, {
        puntos,
        motivo
      })
      return data
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['admin-usuarios'] })
      // también refrescar datos del usuario actual por si edita sus propios puntos
      await refreshUser()
    }
  })
}
