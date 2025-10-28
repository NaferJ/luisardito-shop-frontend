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
  discord_username?: string

  // Campos VIP
  is_vip?: boolean
  vip_status?: {
    is_active: boolean
    is_permanent: boolean
    expires_soon: boolean // Expira en los próximos 7 días
    expires_at?: string
  }

  // Campos migración Botrix
  migration_status?: {
    can_migrate: boolean
    points_migrated?: number
    migrated_at?: string
  }

  // Tipo de usuario calculado
  user_type?: 'regular' | 'vip' | 'subscriber'
}

export interface AdminUsuariosParams {
  page?: number
  limit?: number
  filter?: 'all' | 'vip' | 'migrated' | 'pending_migration' | 'subscribers'
  search?: string
}

export interface AdminUsuariosResponse {
  users: UsuarioAdmin[]
  pagination: {
    total: number
    page: number
    limit: number
    pages: number
  }
}

// Hook para listar usuarios (admin) con filtros avanzados
export function useAdminUsuarios(params?: AdminUsuariosParams) {
  const { page = 1, limit = 20, filter = 'all', search } = params || {}
  const qs = new URLSearchParams()

  qs.set('page', String(page))
  qs.set('limit', String(limit))
  if (filter !== 'all') qs.set('filter', filter)
  if (search) qs.set('search', search)

  const url = `/api/kick-admin/users?${qs.toString()}`

  return useQuery<AdminUsuariosResponse, Error>({
    queryKey: ['admin-usuarios', page, limit, filter, search],
    queryFn: async () => {
      const { data } = await api.get<AdminUsuariosResponse>(url)
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
      try { await refreshUser() } catch (_) { queryClient.invalidateQueries({ queryKey: ['user'] }) }
    }
  })
}

// Hook para remover VIP de usuario
export function useRemoveVipFromUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      usuarioId,
      reason
    }: {
      usuarioId: number
      reason?: string
    }) => {
      const payload: any = {}
      if (reason) payload.reason = reason

      const { data } = await api.delete(`/api/kick-admin/usuario/${usuarioId}/vip`, { data: payload })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-usuarios'] })
    }
  })
}

// Hook para otorgar VIP manualmente
export function useGrantVipToUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      usuarioId,
      durationDays
    }: {
      usuarioId: number
      durationDays?: number
    }) => {
      const payload: any = {}
      if (durationDays) payload.duration_days = durationDays

      const { data } = await api.post(`/api/kick-admin/usuario/${usuarioId}/vip`, payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-usuarios'] })
    }
  })
}

// Hook para migración manual de Botrix
export function useManualBotrixMigration() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      usuarioId,
      pointsAmount,
      kickUsername
    }: {
      usuarioId: number
      pointsAmount: number
      kickUsername: string
    }) => {
      const { data } = await api.post('/api/kick-admin/manual-migration', {
        usuario_id: usuarioId,
        points_amount: pointsAmount,
        kick_username: kickUsername
      })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-usuarios'] })
    }
  })
}

