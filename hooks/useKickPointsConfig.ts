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
      const { data } = await kickPointsConfigApi.getConfig()
      setConfig(data)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al cargar configuración')
    } finally {
      setLoading(false)
    }
  }

  const updateConfig = async (configKey: string, configValue: number, enabled?: boolean) => {
    try {
      setError(null)
      await kickPointsConfigApi.updateConfig({
        config_key: configKey,
        config_value: configValue,
        enabled,
      })
      await fetchConfig()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al actualizar configuración')
      throw err
    }
  }

  const updateMultipleConfigs = async (
    configs: Array<{ config_key: string; config_value: number; enabled?: boolean }>
  ) => {
    try {
      setError(null)
      await kickPointsConfigApi.updateMultipleConfigs(configs)
      await fetchConfig()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al actualizar configuraciones')
      throw err
    }
  }

  const initializeConfig = async () => {
    try {
      setError(null)
      await kickPointsConfigApi.initializeConfig()
      await fetchConfig()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al inicializar configuración')
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
