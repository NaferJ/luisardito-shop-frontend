import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import { useAuth } from './useAuth'

export interface DatosRelacionados {
  [key: string]: any
}

export interface Notificacion {
  id: number
  usuario_id: number
  titulo: string
  descripcion: string
  tipo: 'sub_regalada' | 'puntos_ganados' | 'canje_creado' | 'canje_entregado' | 'canje_cancelado' | 'canje_devuelto' | 'historial_evento' | 'sistema'
  estado: 'leida' | 'no_leida'
  datos_relacionados: DatosRelacionados
  enlace_detalle: string
  fecha_lectura: string | null
  deleted_at: string | null
  fecha_creacion: string
  fecha_actualizacion: string
}

export interface ListNotificacionesResponse {
  total: number
  page: number
  limit: number
  pages: number
  notificaciones: Notificacion[]
}

export interface ContarNoLeidasResponse {
  cantidad: number
}

export function useNotificaciones() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useQuery<Notificacion[], Error>({
    queryKey: ['notificaciones', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data } = await api.get<ListNotificacionesResponse>('/api/notificaciones?page=1&limit=20')
      return data.notificaciones
    }
  })
}

export function useNoLeidasCount() {
  const { user } = useAuth()

  return useQuery<number, Error>({
    queryKey: ['notificaciones', 'noLeidas', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data } = await api.get<ContarNoLeidasResponse>('/api/notificaciones/no-leidas/contar')
      return data.cantidad
    },
    refetchInterval: 30000
  })
}

export function useMarcarComoLeida() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.patch(`/api/notificaciones/${id}/leido`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificaciones', user?.id] })
      queryClient.invalidateQueries({ queryKey: ['notificaciones', 'noLeidas', user?.id] })
    }
  })
}

export function useMarcarTodasLeidas() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.patch('/api/notificaciones/leer-todas')
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificaciones', user?.id] })
      queryClient.invalidateQueries({ queryKey: ['notificaciones', 'noLeidas', user?.id] })
    }
  })
}

export function useEliminarNotificacion() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(`/api/notificaciones/${id}`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificaciones', user?.id] })
      queryClient.invalidateQueries({ queryKey: ['notificaciones', 'noLeidas', user?.id] })
    }
  })
}

