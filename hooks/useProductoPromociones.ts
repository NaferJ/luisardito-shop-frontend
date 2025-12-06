import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { Promocion } from '../types'

export function useProductoPromociones(productoId?: number) {
  return useQuery<Promocion[]>({
    queryKey: ['producto-promociones', productoId],
    queryFn: async () => {
      if (!productoId) return []
      const response = await api.get(`/promociones/producto/${productoId}`)
      return response.data
    },
    enabled: !!productoId,
    staleTime: 1000 * 60 * 5 // 5 minutos
  })
}
