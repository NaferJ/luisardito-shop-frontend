import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import { Promocion, PromocionEstadisticas } from '../types'

export function usePromocion(id: number) {
  return useQuery({
    queryKey: ['promocion', id],
    queryFn: async () => {
      const response = await api.get<Promocion>(`/api/promociones/${id}`)
      return response.data
    },
    enabled: !!id
  })
}

export function usePromocionEstadisticas(id: number) {
  return useQuery({
    queryKey: ['promocion', id, 'estadisticas'],
    queryFn: async () => {
      const response = await api.get<PromocionEstadisticas>(`/api/promociones/${id}/estadisticas`)
      return response.data
    },
    enabled: !!id
  })
}

export function useCreatePromocion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Partial<Promocion>) => {
      const response = await api.post<Promocion>('/api/promociones', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promociones'] })
    }
  })
}

export function useUpdatePromocion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Promocion> }) => {
      const response = await api.put<Promocion>(`/api/promociones/${id}`, data)
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['promocion', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['promociones'] })
    }
  })
}

export function useDeletePromocion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/promociones/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promociones'] })
    }
  })
}

export function useDeletePromocionPermanente() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/promociones/${id}/permanente`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promociones'] })
    }
  })
}

export function useValidarCodigo() {
  return useMutation({
    mutationFn: async ({ codigo, producto_id }: { codigo: string; producto_id?: number }) => {
      const response = await api.post<{
        valido: boolean
        promocion?: Promocion
        mensaje?: string
      }>('/api/promociones/validar-codigo', { codigo, producto_id })
      return response.data
    }
  })
}

export function useActualizarEstadosPromociones() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      await api.put('/api/promociones/actualizar-estados')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promociones'] })
    }
  })
}
