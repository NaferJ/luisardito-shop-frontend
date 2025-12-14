import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import { Canje } from '../types'
import { useAuth } from './useAuth'

// Hook para listar canjes (admin ve todos; usuarios ven los propios según backend)
export function useAdminCanjes(params?: { search?: string; estado?: string }) {
  const { search, estado } = params || {}
  const qs = new URLSearchParams()
  if (search) qs.set('search', search)
  if (estado && estado !== 'todos') qs.set('estado', estado)

  const url = `/api/canjes${qs.toString() ? `?${qs.toString()}` : ''}`

  return useQuery<Canje[], Error>({
    queryKey: ['admin-canjes', search, estado],
    queryFn: async () => {
      const { data } = await api.get<Canje[]>(url)
      return data
    }
  })
}

// Hook para actualizar estado del canje (pendiente|entregado|cancelado)
export function useUpdateCanjeEstado() {
  const queryClient = useQueryClient()
  const { refreshUser } = useAuth()

  return useMutation({
    mutationFn: async ({
      canjeId,
      estado,
      notas
    }: {
      canjeId: number
      estado: 'pendiente' | 'entregado' | 'cancelado'
      notas?: string
    }) => {
      const { data } = await api.put(`/api/canjes/${canjeId}`, { estado, notas })
      return data
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['admin-canjes'] })
      queryClient.invalidateQueries({ queryKey: ['canjes'] })
      // En algunos flujos, cambiar estado puede impactar puntos; refrescar por si acaso
      try { await refreshUser() } catch (_) { /* noop */ }
    }
  })
}

// Hook para devolver canje (devuelve puntos y aumenta stock)
export function useDevolverCanje() {
  const queryClient = useQueryClient()
  const { refreshUser } = useAuth()

  return useMutation({
    mutationFn: async ({
      canjeId,
      motivo
    }: {
      canjeId: number
      motivo: string
    }) => {
      const { data } = await api.put(`/api/canjes/${canjeId}/devolver`, { motivo })
      return data
    },
    onSuccess: async () => {
      // Invalida múltiples caches relevantes
      queryClient.invalidateQueries({ queryKey: ['admin-canjes'] })
      queryClient.invalidateQueries({ queryKey: ['canjes'] })
      queryClient.invalidateQueries({ queryKey: ['productos'] })
      try { await refreshUser() } catch (_) { queryClient.invalidateQueries({ queryKey: ['user'] }) }
    }
  })
}
