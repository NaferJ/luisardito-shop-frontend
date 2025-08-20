import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import { Producto } from '../types'

export function useProductos() {
  return useQuery<Producto[], Error>({
    queryKey: ['productos'],
    queryFn: async () => {
      const { data } = await api.get<Producto[]>('/api/productos')
      return data
    }
  })
}
