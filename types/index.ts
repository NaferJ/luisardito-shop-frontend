export interface Usuario {
  id: number
  nombre: string
  email: string
  puntos: number
  rol_id: number
  user_id_ext?: string
  created_at?: string  // Campo legacy, puede existir en algunos lugares
  updated_at?: string  // Campo legacy, puede existir en algunos lugares
  creado: string       // Campo real del backend
  actualizado: string  // Campo real del backend

  // Campos específicos de Kick
  nickname?: string
  kick_user_id?: string
  kick_username?: string
  kick_avatar?: string
  kick_data?: {
    username: string
    avatar_url: string
  }

  // Campo Discord
  discord_username?: string

  // Campos VIP
  is_vip?: boolean
  vip_info?: {
    is_vip: boolean
    is_active: boolean
    granted_at?: string
    expires_at?: string
    granted_by_canje_id?: number
    is_permanent: boolean
  }

  // Campos migración Botrix
  botrix_migrated?: boolean
  botrix_info?: {
    migrated: boolean
    migrated_at?: string
    points_migrated?: number
    can_migrate: boolean
  }

  // Tipo de usuario calculado
  user_type?: 'regular' | 'vip' | 'subscriber'
}

export interface Producto {
  id: number
  nombre: string
  descripcion: string
  precio: number
  stock: number
  imagen?: string
  imagen_url?: string
  estado: 'borrador' | 'publicado' | 'eliminado'
  created_at: string
  updated_at: string
}

export interface Canje {
  id: number
  usuario_id: number
  producto_id: number
  estado: 'pendiente' | 'entregado' | 'cancelado' | 'devuelto'
  fecha: string
  producto?: Producto
  usuario?: Usuario
}

// Tipos para requests/responses de la API
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  nombre: string
  email: string
  password: string
  user_id_ext?: string
}

export interface AuthResponse {
  token?: string
  accessToken?: string
  refreshToken?: string
  usuario?: Usuario
  user?: Usuario
  expiresIn?: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// Tipos para formularios
export interface ProductoForm {
  nombre: string
  descripcion: string
  precio: number
  stock: number
  imagen?: string
  estado: 'borrador' | 'publicado' | 'eliminado'
}

export interface UsuarioUpdateForm {
  nombre: string
  email: string
}

// Tipos para Kick Integration
export interface KickConnectionStatus {
  connected: boolean
  broadcaster?: {
    kick_user_id: string
    kick_username: string
    connected_at: string
  }
  token?: {
    expires_at: string
    is_expired: boolean
  }
  subscriptions?: {
    auto_subscribed: boolean
    total_active: number
    events: Array<{
      event_type: string
      status: string
      created_at: string
    }>
  }
}

export interface KickPointsConfig {
  id: number
  config_key: string
  config_value: number
  enabled: boolean
  description?: string
  created_at: string
  updated_at: string
}

export interface KickSubscription {
  id: string
  event_type: string
  broadcaster_user_id: string
  status: string
  created_at: string
}

// Tipos para configuración VIP y migración
// NOTA: El backend devuelve ciertos nombres en GET pero espera otros en PUT
export interface VipConfig {
  points_enabled: boolean  // GET devuelve points_enabled
  chat_points: number
  follow_points: number
  sub_points: number
  stats: {
    active_vips: number
    expired_vips: number
  }
}

export interface MigrationConfig {
  enabled: boolean  // GET devuelve enabled, pero PUT espera migration_enabled
  stats: {
    migrated_users: number
    total_points_migrated: number
  }
}

// Tipos para las requests PUT (lo que el backend espera)
export interface VipConfigUpdateRequest {
  vip_points_enabled?: boolean
  vip_chat_points?: number
  vip_follow_points?: number
  vip_sub_points?: number
}

export interface MigrationConfigUpdateRequest {
  migration_enabled: boolean
}

export interface KickAdminConfig {
  success: boolean
  migration: MigrationConfig
  vip: VipConfig
}

// Tipos para historial de puntos actualizado
export interface HistorialPunto {
  id: number
  usuario_id: number
  cambio: number
  motivo: string
  concepto?: string
  tipo?: 'ganado' | 'gastado' | 'evento'
  fecha: string
  kick_event_data?: {
    event_type: string
    kick_username?: string
    points_migrated?: number
    migrated_from?: string
    duration_days?: number
    expires_at?: string
    granted_by_canje_id?: number
    is_vip?: boolean
    user_type?: string
  }
}

