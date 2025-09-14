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
  token: string
  usuario: Usuario
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
