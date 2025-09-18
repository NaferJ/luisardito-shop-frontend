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
      queryClient.invalidateQueries({ queryKey: ['canjes'] }) // también cubre ['canjes','me', id]
      queryClient.invalidateQueries({ queryKey: ['productos'] })
      try {
        await refreshUser()
      } catch (_) {
        queryClient.invalidateQueries({ queryKey: ['user'] })
      }
    }
  })
}
