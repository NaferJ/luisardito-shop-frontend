import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import api from '../lib/api'
import { Producto } from '../types'

export function useProducto(
  slugOrId: string | undefined,
  options?: Omit<UseQueryOptions<Producto, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<Producto, Error>({
    queryKey: ['producto', slugOrId],
    queryFn: async () => {
      if (!slugOrId) throw new Error('Slug o ID de producto requerido')
      const isId = /^\d+$/.test(slugOrId)
      const endpoint = isId ? `/api/productos/${slugOrId}` : `/api/productos/slug/${slugOrId}`
      const { data } = await api.get<Producto>(endpoint)
      return data
    },
    enabled: !!slugOrId,
    ...options
  })
}
