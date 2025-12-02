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

  const updateConfig = async (configKey: string, value: number | boolean, skipReload = false) => {
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

      // Solo recargar si no se especifica skipReload
      if (!skipReload) {
        await fetchConfigs() // Recargar configuración
      }

      return true
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar configuración')
      throw err
    }
  }

  const updateMultipleConfigs = async (updates: Array<{ config_key: string; config_value: number; enabled: boolean }>) => {
    try {
      // Actualizar cada configuración sin recargar hasta el final
      for (const update of updates) {
        await kickPointsConfigApi.updateConfig({
          config_key: update.config_key,
          config_value: update.config_value,
          enabled: update.enabled
        })
      }

      // Solo recargar una vez al final
      await fetchConfigs()
      return true
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar configuraciones')
      throw err
    }
  }

  const resetToDefaults = async () => {
    // Valores por defecto específicos que sabemos que queremos (según backend)
    const defaultConfigs = [
      { config_key: 'chat_points_regular', config_value: 10, enabled: true },
      { config_key: 'chat_points_subscriber', config_value: 20, enabled: true },
      { config_key: 'chat_points_vip', config_value: 30, enabled: true },
      { config_key: 'follow_points', config_value: 50, enabled: true },
      { config_key: 'subscription_new_points', config_value: 500, enabled: true },
      { config_key: 'subscription_renewal_points', config_value: 300, enabled: true },
      { config_key: 'gift_given_points', config_value: 100, enabled: true },
      { config_key: 'gift_received_points', config_value: 400, enabled: true }
    ]

    try {
      console.log('🔄 Restableciendo a valores por defecto...')
      console.log('📋 Valores objetivo:', defaultConfigs)

      // Actualizar cada configuración individualmente para asegurar los valores correctos
      for (const config of defaultConfigs) {
        try {
          console.log(`🔧 Actualizando ${config.config_key} a ${config.config_value}...`)

          const response = await kickPointsConfigApi.updateConfig({
            config_key: config.config_key,
            config_value: config.config_value,
            enabled: config.enabled
          })

          console.log(`✅ ${config.config_key} = ${config.config_value} (enabled: ${config.enabled}) - Respuesta:`, response?.data)
        } catch (updateErr: any) {
          console.error(`❌ Error restableciendo ${config.config_key}:`, {
            error: updateErr,
            status: updateErr.response?.status,
            data: updateErr.response?.data,
            message: updateErr.message
          })
          throw updateErr
        }
      }

      console.log('🔄 Recargando configuración...')
      // Solo recargar una vez al final
      await fetchConfigs()

      console.log('🎉 Restablecimiento completado exitosamente')
      return true
    } catch (err: any) {
      console.error('💥 Error durante el restablecimiento:', err)
      setError(err.response?.data?.message || 'Error al restablecer valores por defecto')
      throw err
    }
  }

  const initializeConfig = async () => {
    // Valores por defecto que queremos establecer (según backend)
    const defaultConfigs = [
      { config_key: 'chat_points_regular', config_value: 10, enabled: true },
      { config_key: 'chat_points_subscriber', config_value: 20, enabled: true },
      { config_key: 'chat_points_vip', config_value: 30, enabled: true },
      { config_key: 'follow_points', config_value: 50, enabled: true },
      { config_key: 'subscription_new_points', config_value: 500, enabled: true },
      { config_key: 'subscription_renewal_points', config_value: 300, enabled: true },
      { config_key: 'gift_given_points', config_value: 300, enabled: true },
      { config_key: 'gift_received_points', config_value: 200, enabled: true }
    ]

    try {
      // Intentar usar el endpoint de inicialización del backend
      await kickPointsConfigApi.initializeConfig()
      await fetchConfigs()

      // Verificar si los valores son los esperados
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 Inicialización con endpoint del backend completada')
      }

      return true
    } catch (err: any) {
      console.warn('Endpoint de inicialización falló, usando método manual:', err)

      try {
        // Método manual: actualizar cada configuración individualmente
        console.log('🔄 Estableciendo valores por defecto manualmente...')

        for (const config of defaultConfigs) {
          try {
            await kickPointsConfigApi.updateConfig({
              config_key: config.config_key,
              config_value: config.config_value,
              enabled: config.enabled
            })
            console.log(`✅ Configurado ${config.config_key} = ${config.config_value}`)
          } catch (updateErr) {
            console.warn(`❌ Error configurando ${config.config_key}:`, updateErr)
          }
        }

        await fetchConfigs() // Solo una recarga al final

        if (process.env.NODE_ENV === 'development') {
          console.log('🔍 Inicialización manual completada')
        }

        return true
      } catch (manualErr) {
        setError('Error al establecer valores por defecto')
        throw manualErr
      }
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
    updateMultipleConfigs,
    initializeConfig,
    resetToDefaults
  }
}
