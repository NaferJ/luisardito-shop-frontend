import { useState, useEffect } from 'react'
import { KickPointsConfig } from '../types'
import { api } from '../lib/api'

export const useKickPointsConfig = () => {
  const [configs, setConfigs] = useState<KickPointsConfig[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchConfigs = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get('/api/kick-admin/points-config')
      setConfigs(response.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar configuración de puntos')
    } finally {
      setLoading(false)
    }
  }

  const updateConfig = async (configKey: string, value: number | boolean) => {
    try {
      let endpoint = '/api/kick-admin/points-config'
      let payload: any = {}

      // Determinar si es valor numérico o boolean (enabled)
      if (typeof value === 'boolean') {
        // Es un toggle de enabled
        payload.config_key = configKey.replace('_enabled', '')
        payload.enabled = value
        endpoint += '/toggle'
      } else {
        // Es un valor numérico
        payload.config_key = configKey
        payload.config_value = value
      }

      await api.put(endpoint, payload)
      await fetchConfigs() // Recargar configuración
      return true
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar configuración')
      throw err
    }
  }

  useEffect(() => {
    fetchConfigs()
  }, [])

  return {
    configs,
    loading,
    error,
    fetchConfigs,
    updateConfig
  }
}
