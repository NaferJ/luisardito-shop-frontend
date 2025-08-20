import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import { Canje } from '../types'

export function useCanjes() {
  return useQuery<Canje[], Error>({
    queryKey: ['canjes'],
    queryFn: async () => {
      const { data } = await api.get<Canje[]>('/api/canjes')
      return data
    }
  })
}

export function useCreateCanje() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (productoId: number) => {
      const { data } = await api.post('/api/canjes', { producto_id: productoId })
      return data
    },
    onSuccess: () => {
      // Actualizar la lista de canjes y refrescar datos del usuario (puntos)
      queryClient.invalidateQueries({ queryKey: ['canjes'] })
      queryClient.invalidateQueries({ queryKey: ['productos'] })
      // Refrescar el usuario para actualizar los puntos
      queryClient.invalidateQueries({ queryKey: ['user'] })
    }
  })
}
