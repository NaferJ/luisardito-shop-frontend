// Utilidades para manejo de cookies cross-domain

export class CookieManager {
  private static getDomain(): string {
    if (typeof window === 'undefined') return ''

    const hostname = window.location.hostname

    // Si estamos en localhost, NO usar dominio para mejor compatibilidad
    if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
      return '' // No especificar dominio en localhost
    }

    // Para subdominios de luisardito.com, usar el dominio principal
    if (hostname.includes('luisardito.com')) {
      return '.luisardito.com'
    }

    // Para otros dominios, usar el hostname completo
    return hostname
  }

  static setCookie(name: string, value: string, options: {
    expires?: Date
    maxAge?: number
    httpOnly?: boolean
    secure?: boolean
    sameSite?: 'strict' | 'lax' | 'none'
  } = {}): void {
    if (typeof window === 'undefined') return

    const domain = this.getDomain()
    const isLocalhost = window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1')
    const isHttps = window.location.protocol === 'https:'

    let cookieString = `${name}=${encodeURIComponent(value)}`

    // Solo agregar dominio si no es localhost
    if (domain && !isLocalhost) {
      cookieString += `; Domain=${domain}`
    }

    if (options.expires) {
      cookieString += `; Expires=${options.expires.toUTCString()}`
    }

    if (options.maxAge) {
      cookieString += `; Max-Age=${options.maxAge}`
    }

    // Siempre agregar Path
    cookieString += `; Path=/`

    // MEJORADO: Configuración consistente de SameSite para OAuth
    if (isLocalhost) {
      // En localhost, usar Lax (más compatible con desarrollo)
      cookieString += `; SameSite=Lax`
    } else if (isHttps) {
      // En producción HTTPS, SIEMPRE usar None + Secure para OAuth cross-domain
      // Esto asegura que las cookies se envíen en redirects de OAuth
      cookieString += `; SameSite=None; Secure`
    } else {
      // HTTP en producción (no debería pasar, pero fallback seguro)
      cookieString += `; SameSite=Lax`
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('🍪 [CookieManager] Configurando cookie:', {
        name,
        domain,
        isLocalhost,
        isHttps,
        sameSite: isLocalhost ? 'Lax' : (isHttps ? 'None' : 'Lax'),
        secure: isHttps,
        cookieString: cookieString.substring(0, 100) + '...'
      })
    }

    document.cookie = cookieString
  }

  static getCookie(name: string): string | null {
    if (typeof window === 'undefined') return null

    const nameEQ = name + '='
    const ca = document.cookie.split(';')

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) === 0) {
        const value = decodeURIComponent(c.substring(nameEQ.length, c.length))
        return value
      }
    }

    return null
  }

  static removeCookie(name: string): void {
    if (typeof window === 'undefined') return

    const domain = this.getDomain()

    // Eliminar para el dominio actual
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`

    // Eliminar para el dominio compartido si es diferente
    if (domain && domain.startsWith('.')) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Domain=${domain};`
    }
  }

  // Validar formato básico de JWT
  private static isValidJWT(token: string): boolean {
    try {
      const parts = token.split('.')
      if (parts.length !== 3) return false

      // Verificar que el payload sea JSON válido
      const payload = JSON.parse(atob(parts[1]))

      // Verificar que tenga campos básicos de JWT
      return payload.exp !== undefined
    } catch {
      return false
    }
  }

  /**
   * Migra un token individual de localStorage a cookies si es válido
   */
  private static migrateToken(name: string, maxAge: number): void {
    const token = localStorage.getItem(name)
    const existingCookie = this.getCookie(name)

    if (!token || existingCookie) return

    if (this.isValidJWT(token)) {
      this.setCookie(name, token, { maxAge })
      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ [CookieManager] Migrado ${name} desde localStorage`)
      }
    } else if (process.env.NODE_ENV === 'development') {
      console.warn(`⚠️ [CookieManager] ${name} en localStorage no es válido, omitiendo migración`)
    }
  }

  /**
   * Limpia un token de localStorage si ya existe como cookie
   */
  private static cleanupLocalStorage(name: string): void {
    if (this.getCookie(name)) {
      localStorage.removeItem(name)
    }
  }

  // Migrar de localStorage a cookies con validación
  static migrateFromLocalStorage(): void {
    if (typeof window === 'undefined') return

    try {
      this.migrateToken('auth_token', 30 * 24 * 60 * 60)
      this.migrateToken('refresh_token', 90 * 24 * 60 * 60)

      // Limpiar localStorage solo después de verificar migración exitosa
      this.cleanupLocalStorage('auth_token')
      this.cleanupLocalStorage('refresh_token')
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ [CookieManager] Error en migración de localStorage:', error)
      }
      // No propagar el error, no es crítico
    }
  }
}

// Funciones de conveniencia
export const setAuthCookie = (token: string) => {
  CookieManager.setCookie('auth_token', token, {
    maxAge: 30 * 24 * 60 * 60 // 30 días
  })
}

export const getAuthCookie = (): string | null => {
  return CookieManager.getCookie('auth_token')
}

export const setRefreshCookie = (token: string) => {
  CookieManager.setCookie('refresh_token', token, {
    maxAge: 90 * 24 * 60 * 60 // 90 días
  })
}

export const getRefreshCookie = (): string | null => {
  return CookieManager.getCookie('refresh_token')
}

export const clearAuthCookies = () => {
  CookieManager.removeCookie('auth_token')
  CookieManager.removeCookie('refresh_token')
}

// Función de debug para verificar el estado de las cookies
export const debugCookies = () => {
  if (typeof window !== 'undefined') {
    console.log('🔧 DEBUG COOKIES:')
    console.log('- All cookies:', document.cookie)
    console.log('- Auth token:', getAuthCookie())
    console.log('- Refresh token:', getRefreshCookie())
    console.log('- Domain:', window.location.hostname)
    console.log('- Protocol:', window.location.protocol)
  }
}

// Hacer disponible globalmente en desarrollo
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).debugCookies = debugCookies
}

