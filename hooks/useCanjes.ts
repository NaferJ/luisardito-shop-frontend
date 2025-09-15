import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import { Canje } from '../types'
import { useAuth } from './useAuth'

export function useCanjes() {
  const { user } = useAuth()

  return useQuery<Canje[], Error>({
    queryKey: ['canjes', 'me', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data } = await api.get<Canje[]>('/api/canjes/mios')
      return data
    }
  })
}

export function useCreateCanje() {
  const queryClient = useQueryClient()
  const { refreshUser } = useAuth()

  return useMutation({
    mutationFn: async (productoId: number) => {
      const { data } = await api.post('/api/canjes', { producto_id: productoId })
      return data
    },
    onSuccess: async () => {
      // Actualizar la lista de canjes y refrescar datos del usuario (puntos)
      queryClient.invalidateQueries({ queryKey: ['canjes'] }) // también cubre ['canjes','me', id]
      queryClient.invalidateQueries({ queryKey: ['productos'] })
      // Refrescar el usuario para actualizar los puntos en el Navbar sin recargar
      try {
        await refreshUser()
      } catch (_) {
        // fallback: mantener invalidación por si en el futuro se usa React Query para el usuario
        queryClient.invalidateQueries({ queryKey: ['user'] })
      }
    }
  })
}
