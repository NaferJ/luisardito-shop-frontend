import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import { Promocion } from '../types'

interface UsePromocionesParams {
  estado?: 'activo' | 'programado' | 'expirado' | 'inactivo' | 'pausado'
  tipo?: 'producto' | 'categoria' | 'global' | 'por_cantidad'
  activas_solo?: boolean
}

export function usePromociones(params?: UsePromocionesParams) {
  return useQuery({
    queryKey: ['promociones', params],
    queryFn: async () => {
      const response = await api.get<Promocion[]>('/api/promociones', { params })
      return response.data
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  })
}

export function usePromocionesActivas() {
  return useQuery({
    queryKey: ['promociones', 'activas'],
    queryFn: async () => {
      const response = await api.get<Promocion[]>('/api/promociones/activas')
      return response.data
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  })
}
