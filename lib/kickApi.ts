import api from './api'
import type { KickConnectionStatus, KickPointsConfig, KickSubscription } from '../types'

// Kick Broadcaster APIs
export const kickBroadcasterApi = {
  // Obtener estado de conexión del broadcaster
  getConnectionStatus: () => api.get('/api/kick/broadcaster/status'),

  // Desconectar broadcaster
  disconnect: () => api.post('/api/kick/broadcaster/disconnect'),

  // Obtener token activo (admin)
  getActiveToken: () => api.get('/api/kick/broadcaster/token'),
}

// Kick Points Configuration APIs
export const kickPointsConfigApi = {
  // Obtener configuración de puntos
  getConfig: () => api.get('/api/kick/points-config'),

  // Actualizar configuración individual
  updateConfig: (data: { config_key: string; config_value: number; enabled?: boolean }) =>
    api.put('/api/kick/points-config', data),

  // Actualizar múltiples configuraciones
  updateMultipleConfigs: (configs: Array<{ config_key: string; config_value: number; enabled?: boolean }>) =>
    api.put('/api/kick/points-config/bulk', { configs }),

  // Inicializar configuración por defecto
  initializeConfig: () => api.post('/api/kick/points-config/initialize'),
}

// Kick Subscription APIs
export const kickSubscriptionApi = {
  // Obtener suscripciones de Kick API
  getSubscriptions: () => api.get('/api/kick/subscriptions'),

  // Crear suscripciones
  createSubscriptions: (data: {
    broadcaster_user_id: string | number
    events: Array<{ name: string; version: number }>
  }) => api.post('/api/kick/subscriptions', data),

  // Eliminar suscripciones
  deleteSubscriptions: (subscriptionIds: string[]) =>
    api.delete('/api/kick/subscriptions', { data: { subscription_ids: subscriptionIds } }),

  // Obtener suscripciones locales
  getLocalSubscriptions: () => api.get('/api/kick/local-subscriptions'),
}
