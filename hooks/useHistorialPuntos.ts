import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import { HistorialPunto } from '../types'

export function useHistorialPuntos(usuarioId?: number, includeAll: boolean = false) {
  return useQuery<HistorialPunto[], Error>({
    queryKey: ['historial-puntos', usuarioId, includeAll],
    queryFn: async () => {
      if (!usuarioId) throw new Error('ID de usuario requerido')

      const params = new URLSearchParams()
      if (includeAll) params.set('include_all', 'true')

      const url = `/api/historial-puntos/${usuarioId}${params.toString() ? `?${params.toString()}` : ''}`
      const { data } = await api.get<HistorialPunto[]>(url)
      return data
    },
    enabled: !!usuarioId
  })
}
