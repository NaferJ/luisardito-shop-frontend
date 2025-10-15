export interface Usuario {
  id: number
  nombre: string
  email: string
  puntos: number
  rol_id: number
  user_id_ext?: string
  created_at: string
  updated_at: string
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

export interface HistorialPunto {
  id: number
  usuario_id: number
  cambio: number
  motivo: string
  fecha: string
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
  config_key: string
  config_value: number
  enabled: boolean
  description?: string
  updated_at: string
}

export interface KickSubscription {
  id: string
  event_type: string
  broadcaster_user_id: string
  status: string
  created_at: string
}
