import { useState, useEffect } from 'react'
import { KickAdminConfig, VipConfig } from '../types'
import { getAuthCookie } from '../lib/cookies'
import api from '../lib/api'

export const useKickAdminConfig = () => {
  const [config, setConfig] = useState<KickAdminConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchConfig = async () => {
    // Solo hacer la llamada si hay token de autenticación
    const authToken = getAuthCookie()
    if (!authToken) {
      setLoading(false)
      setError(null)
      setConfig(null)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const response = await api.get('/api/kick-admin/config')
      setConfig(response.data)
    } catch (err: any) {
      console.warn('Error al cargar configuración de Kick admin:', err)

      // Si es 401, no lanzar error, simplemente no cargar configuración
      if (err.response?.status === 401) {
        setError('No autenticado para ver configuración')
      } else if (err.response?.status === 404) {
        setError('Endpoints de administración no disponibles')
      } else {
        setError(err.response?.data?.message || 'Error al cargar configuración')
      }
    } finally {
      setLoading(false)
    }
  }

  const updateMigrationConfig = async (enabled: boolean) => {
    try {
      // Usar la estructura real del backend: { enabled: boolean }
      const payload = { enabled: enabled }

      console.log('🔄 updateMigrationConfig: Enviando payload:', payload)
      console.log('🔄 updateMigrationConfig: Endpoint:', '/api/kick-admin/migration')

      const response = await api.put('/api/kick-admin/migration', payload)

      console.log('✅ updateMigrationConfig: Respuesta exitosa:', response.data)

      await fetchConfig() // Recargar configuración
      return true
    } catch (err: any) {
      console.error('❌ updateMigrationConfig: Error:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message,
        payload: { enabled }
      })

      setError(err.response?.data?.message || 'Error al actualizar migración')
      throw err
    }
  }

  const updateVipConfig = async (vipConfig: Partial<VipConfig>) => {
    try {
      console.log('🔄 updateVipConfig: Enviando payload:', vipConfig)
      console.log('🔄 updateVipConfig: Endpoint:', '/api/kick-admin/vip-config')

      const response = await api.put('/api/kick-admin/vip-config', vipConfig)

      console.log('✅ updateVipConfig: Respuesta exitosa:', response.data)

      await fetchConfig() // Recargar configuración
      return true
    } catch (err: any) {
      console.error('❌ updateVipConfig: Error:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message,
        payload: vipConfig
      })

      setError(err.response?.data?.message || 'Error al actualizar configuración VIP')
      throw err
    }
  }

  const grantVipToCanje = async (canjeId: number, durationDays?: number) => {
    try {
      const payload: any = {}
      if (durationDays) payload.duration_days = durationDays

      await api.post(`/api/kick-admin/canje/${canjeId}/grant-vip`, payload)
      return true
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al otorgar VIP')
      throw err
    }
  }

  const removeVipFromUser = async (usuarioId: number, reason?: string) => {
    try {
      const payload: any = {}
      if (reason) payload.reason = reason

      await api.delete(`/api/kick-admin/usuario/${usuarioId}/vip`, { data: payload })
      return true
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al remover VIP')
      throw err
    }
  }

  const cleanupExpiredVips = async () => {
    try {
      await api.post('/api/kick-admin/cleanup-expired-vips')
      return true
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al limpiar VIPs expirados')
      throw err
    }
  }

  const manualMigration = async (usuarioId: number, pointsAmount: number, kickUsername: string) => {
    try {
      await api.post('/api/kick-admin/manual-migration', {
        usuario_id: usuarioId,
        points_amount: pointsAmount,
        kick_username: kickUsername
      })
      return true
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error en migración manual')
      throw err
    }
  }

  useEffect(() => {
    // Solo hacer la llamada si hay un token de autenticación
    const authToken = getAuthCookie()
    if (authToken) {
      fetchConfig()
    } else {
      // Si no hay token, simplemente marcar como cargado sin datos
      setLoading(false)
      setConfig(null)
      setError(null)

      if (process.env.NODE_ENV === 'development') {
        console.warn('🔄 useKickAdminConfig: No hay token de autenticación, saltando llamada API')
      }
    }
  }, []) // Solo ejecutar una vez al montar

  return {
    config,
    loading,
    error,
    fetchConfig,
    updateMigrationConfig,
    updateVipConfig,
    grantVipToCanje,
    removeVipFromUser,
    cleanupExpiredVips,
    manualMigration
  }
}
