import { useState, useEffect } from 'react'
import { KickPointsConfig } from '../types'
import { getAuthCookie } from '../lib/cookies'
import { kickPointsConfigApi } from '../lib/kickApi'

export const useKickPointsConfig = () => {
  const [configs, setConfigs] = useState<KickPointsConfig[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchConfigs = async () => {
    // Solo hacer la llamada si hay token de autenticación
    const authToken = getAuthCookie()
    if (!authToken) {
      setLoading(false)
      setError(null)
      setConfigs(null)
      return
    }

    try {
      setLoading(true)
      setError(null)
      // Usar la API definida en kickApi.ts
      const response = await kickPointsConfigApi.getConfig()

      // Logging detallado para diagnosticar el problema
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 Respuesta del backend para puntos config:', {
          status: response.status,
          data: response.data,
          dataType: typeof response.data,
          isArray: Array.isArray(response.data),
          hasConfigArray: response.data && Array.isArray(response.data.config),
          configLength: response.data?.config?.length || 'N/A',
          total: response.data?.total,
          initialized: response.data?.initialized
        })
      }

      // El backend devuelve { config: [...], total: X, initialized: boolean }
      // Necesitamos extraer el array de config
      if (response.data && response.data.config && Array.isArray(response.data.config)) {
        setConfigs(response.data.config)
      } else if (Array.isArray(response.data)) {
        // Fallback en caso de que devuelva directamente el array
        setConfigs(response.data)
      } else {
        console.warn('Estructura de respuesta inesperada:', response.data)
        setConfigs([])
      }
    } catch (err: any) {
      console.warn('Error al cargar configuración de puntos:', err)

      // Logging del error completo
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 Error completo:', {
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          message: err.message
        })
      }

      // Si es 401, no mostrar error crítico
      if (err.response?.status === 401) {
        setError('No autenticado para ver configuración de puntos')
      } else if (err.response?.status === 404) {
        setError('Configuración no encontrada')
      } else if (err.response?.data?.message === 'No hay configuración establecida. Inicializa la configuración para empezar a otorgar puntos.') {
        setError('No hay configuración establecida. Inicializa la configuración para empezar a otorgar puntos.')
      } else {
        setError(err.response?.data?.message || 'Error al cargar configuración de puntos')
      }
    } finally {
      setLoading(false)
    }
  }

  const updateConfig = async (configKey: string, value: number | boolean) => {
    try {
      // Preparar el payload según kickApi.ts
      let payload: any = {}

      if (typeof value === 'boolean') {
        // Es un toggle de enabled
        payload.config_key = configKey.replace('_enabled', '')
        payload.enabled = value
      } else {
        // Es un valor numérico
        payload.config_key = configKey
        payload.config_value = value
      }

      // Usar la API definida en kickApi.ts
      await kickPointsConfigApi.updateConfig(payload)
      await fetchConfigs() // Recargar configuración
      return true
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar configuración')
      throw err
    }
  }

  const initializeConfig = async () => {
    try {
      // Usar la API definida en kickApi.ts
      await kickPointsConfigApi.initializeConfig()
      await fetchConfigs() // Recargar configuración
      return true
    } catch (err: any) {
      // Si el endpoint no existe, intentar crear configuraciones manualmente
      if (err.response?.status === 404) {
        console.warn('Endpoint de inicialización no disponible, creando configuraciones manualmente')

        // Crear configuraciones básicas una por una
        const defaultConfigs = [
          { key: 'chat_points_regular', value: 10 },
          { key: 'chat_points_subscriber', value: 20 },
          { key: 'follow_points', value: 50 },
          { key: 'subscription_new_points', value: 500 },
          { key: 'subscription_renewal_points', value: 300 },
          { key: 'gift_given_points', value: 300 },
          { key: 'gift_received_points', value: 200 }
        ]

        for (const config of defaultConfigs) {
          try {
            await kickPointsConfigApi.updateConfig({
              config_key: config.key,
              config_value: config.value,
              enabled: true
            })
          } catch (createErr) {
            console.warn(`Error creando configuración ${config.key}:`, createErr)
          }
        }

        await fetchConfigs()
        return true
      }

      setError(err.response?.data?.message || 'Error al inicializar configuración')
      throw err
    }
  }

  useEffect(() => {
    // Solo hacer la llamada si hay un token de autenticación
    const authToken = getAuthCookie()
    if (authToken) {
      fetchConfigs()
    } else {
      // Si no hay token, simplemente marcar como cargado sin datos
      setLoading(false)
      setConfigs(null)
      setError(null)

      if (process.env.NODE_ENV === 'development') {
        console.warn('🔄 useKickPointsConfig: No hay token de autenticación, saltando llamada API')
      }
    }
  }, [])

  return {
    configs,
    loading,
    error,
    fetchConfigs,
    updateConfig,
    initializeConfig
  }
}
