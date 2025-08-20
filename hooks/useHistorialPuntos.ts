import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import { HistorialPunto } from '../types'

export function useHistorialPuntos(usuarioId?: number) {
  return useQuery<HistorialPunto[], Error>({
    queryKey: ['historial-puntos', usuarioId],
    queryFn: async () => {
      if (!usuarioId) throw new Error('ID de usuario requerido')
      const { data } = await api.get<HistorialPunto[]>(`/api/historial-puntos/${usuarioId}`)
      return data
    },
    enabled: !!usuarioId
  })
}
