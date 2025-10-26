// Utilidades para manejo de cookies cross-domain

export class CookieManager {
  private static getDomain(): string {
    if (typeof window === 'undefined') return ''

    const hostname = window.location.hostname

    // Si estamos en localhost, usar el hostname completo
    if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
      return hostname
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

    let cookieString = `${name}=${encodeURIComponent(value)}`

    if (domain) {
      cookieString += `; Domain=${domain}`
    }

    if (options.expires) {
      cookieString += `; Expires=${options.expires.toUTCString()}`
    }

    if (options.maxAge) {
      cookieString += `; Max-Age=${options.maxAge}`
    }

    // Para subdominios, usar configuración segura
    if (domain.startsWith('.')) {
      cookieString += `; Path=/`
      cookieString += `; SameSite=lax`

      // En producción, usar HTTPS
      if (window.location.protocol === 'https:') {
        cookieString += `; Secure`
      }
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
        return decodeURIComponent(c.substring(nameEQ.length, c.length))
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

  // Migrar de localStorage a cookies
  static migrateFromLocalStorage(): void {
    if (typeof window === 'undefined') return

    // Migrar auth_token
    const authToken = localStorage.getItem('auth_token')
    if (authToken) {
      this.setCookie('auth_token', authToken, {
        maxAge: 30 * 24 * 60 * 60 // 30 días
      })
    }

    // Migrar refresh_token
    const refreshToken = localStorage.getItem('refresh_token')
    if (refreshToken) {
      this.setCookie('refresh_token', refreshToken, {
        maxAge: 90 * 24 * 60 * 60 // 90 días
      })
    }

    // Limpiar localStorage después de migrar
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
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
