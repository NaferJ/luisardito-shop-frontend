import { useState, useEffect } from 'react'
import { kickPointsConfigApi } from '../lib/kickApi'
import type { KickPointsConfig } from '../types'

export function useKickPointsConfig() {
  const [config, setConfig] = useState<KickPointsConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchConfig = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await kickPointsConfigApi.getConfig()

      // Validar que la respuesta tenga el formato esperado
      const data = response.data
      console.log('Datos recibidos de configuración:', data)

      if (Array.isArray(data)) {
        // Validar cada elemento del array
        const validData = data.filter((item: any) =>
          item &&
          typeof item === 'object' &&
          typeof item.config_key === 'string' &&
          typeof item.config_value === 'number' &&
          typeof item.enabled === 'boolean'
        )
        setConfig(validData)
      } else if (data && Array.isArray(data.data)) {
        const validData = data.data.filter((item: any) =>
          item &&
          typeof item === 'object' &&
          typeof item.config_key === 'string' &&
          typeof item.config_value === 'number' &&
          typeof item.enabled === 'boolean'
        )
        setConfig(validData)
      } else {
        console.warn('Formato inesperado de datos:', data)
        setConfig([])
        setError('Formato de datos no válido recibido del servidor')
      }
    } catch (err: any) {
      console.error('Error al cargar configuración:', err)
      setError(err.response?.data?.error || err.message || 'Error al cargar configuración')
      setConfig([])
    } finally {
      setLoading(false)
    }
  }

  const updateConfig = async (configKey: string, configValue: number, enabled?: boolean) => {
    try {
      setError(null)
      console.log('Actualizando configuración:', { configKey, configValue, enabled })
      await kickPointsConfigApi.updateConfig({
        config_key: configKey,
        config_value: configValue,
        enabled,
      })
      await fetchConfig()
    } catch (err: any) {
      console.error('Error al actualizar configuración:', err)
      setError(err.response?.data?.error || err.message || 'Error al actualizar configuración')
      throw err
    }
  }

  const updateMultipleConfigs = async (
    configs: Array<{ config_key: string; config_value: number; enabled?: boolean }>
  ) => {
    try {
      setError(null)
      console.log('Actualizando múltiples configuraciones:', configs)
      await kickPointsConfigApi.updateMultipleConfigs(configs)
      await fetchConfig()
    } catch (err: any) {
      console.error('Error al actualizar configuraciones:', err)
      setError(err.response?.data?.error || err.message || 'Error al actualizar configuraciones')
      throw err
    }
  }

  const initializeConfig = async () => {
    try {
      setError(null)
      console.log('Inicializando configuración...')
      await kickPointsConfigApi.initializeConfig()
      await fetchConfig()
    } catch (err: any) {
      console.error('Error al inicializar configuración:', err)
      setError(err.response?.data?.error || err.message || 'Error al inicializar configuración')
      throw err
    }
  }

  useEffect(() => {
    fetchConfig()
  }, [])

  return {
    config,
    loading,
    error,
    refresh: fetchConfig,
    updateConfig,
    updateMultipleConfigs,
    initializeConfig,
  }
}
