import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import { Producto } from '../types'
import { useAuth } from './useAuth'

export function useProductos() {
  const { user } = useAuth()

  // Determinar si el usuario tiene permisos para ver todos los productos
  // Solo streamer (3), developer (4) y moderador (5)
  const canSeeAllProducts = user && [3, 4, 5].includes(user.rol_id)

  return useQuery<Producto[], Error>({
    queryKey: ['productos', canSeeAllProducts ? 'all' : 'public'],
    queryFn: async () => {
      if (canSeeAllProducts) {
        // Nuevo endpoint único para admins: trae todos los productos con canjes_count
        const { data } = await api.get<Producto[]>('/api/productos/admin')
        return data
      } else {
        // Si es usuario normal o suscriptor, solo productos publicados
        const { data } = await api.get<Producto[]>('/api/productos')
        return data
      }
    },
    enabled: true
  })
}
