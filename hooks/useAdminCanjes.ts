import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import { Canje } from '../types'

// Hook para listar canjes (admin ve todos; usuarios ven los propios según backend)
export function useAdminCanjes() {
  return useQuery<Canje[], Error>({
    queryKey: ['admin-canjes'],
    queryFn: async () => {
      const { data } = await api.get<Canje[]>('/api/canjes')
      return data
    }
  })
}

// Hook para actualizar estado del canje (pendiente|entregado|cancelado)
export function useUpdateCanjeEstado() {
  const queryClient = useQueryClient()

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-canjes'] })
      queryClient.invalidateQueries({ queryKey: ['canjes'] })
    }
  })
}

// Hook para devolver canje (devuelve puntos y aumenta stock)
export function useDevolverCanje() {
  const queryClient = useQueryClient()

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
    onSuccess: () => {
      // Invalida múltiples caches relevantes
      queryClient.invalidateQueries({ queryKey: ['admin-canjes'] })
      queryClient.invalidateQueries({ queryKey: ['canjes'] })
      queryClient.invalidateQueries({ queryKey: ['productos'] })
      queryClient.invalidateQueries({ queryKey: ['user'] })
    }
  })
}
