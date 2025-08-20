import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import { Producto } from '../types'

export function useProducto(id: string | undefined) {
  return useQuery<Producto, Error>({
    queryKey: ['producto', id],
    queryFn: async () => {
      if (!id) throw new Error('ID de producto requerido')
      const { data } = await api.get<Producto>(`/api/productos/${id}`)
      return data
    },
    enabled: !!id && !isNaN(Number(id))
  })
}
