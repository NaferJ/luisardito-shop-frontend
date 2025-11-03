/**
 * Utilidades para diagnosticar problemas de autenticación
 * Útil para debugging en producción
 */

import { getAuthCookie, getRefreshCookie } from './cookies'

interface AuthHealthResult {
  isHealthy: boolean
  issues: string[]
  details: {
    hasAuthToken: boolean
    hasRefreshToken: boolean
    authTokenValid: boolean
    refreshTokenValid: boolean
    authTokenExpired: boolean
    refreshTokenExpired: boolean
    cookiesCount: number
    domain: string
    protocol: string
  }
}

/**
 * Valida si un string es un JWT válido
 */
function isValidJWT(token: string): boolean {
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
 * Valida si un string es un token opaco válido
 * Los tokens opacos son hashes largos (ej: SHA-256) usados como refresh tokens
 */
function isOpaqueToken(token: string): boolean {
  // Un token opaco típicamente:
  // - Es un hash largo (>= 64 caracteres para SHA-256)
  // - No contiene puntos (no es JWT)
  // - Solo contiene caracteres hexadecimales o alfanuméricos
  const isLongEnough = token.length >= 64
  const hasNoDots = !token.includes('.')
  const isHexOrAlphanumeric = /^[a-fA-F0-9]+$/.test(token)
  
  return isLongEnough && hasNoDots && isHexOrAlphanumeric
}

/**
 * Valida si un token es válido (JWT o token opaco)
 */
function isValidToken(token: string): boolean {
  return isValidJWT(token) || isOpaqueToken(token)
}

/**
 * Verifica si un JWT está expirado
 */
function isJWTExpired(token: string): boolean {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return true

    const payload = JSON.parse(atob(parts[1]))
    const exp = payload.exp

    if (!exp) return true

    // exp está en segundos, Date.now() está en milisegundos
    const expirationTime = exp * 1000
    const now = Date.now()

    return now >= expirationTime
  } catch {
    return true
  }
}

/**
 * Obtiene información detallada del payload de un JWT
 */
function getJWTPayload(token: string): any {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    return JSON.parse(atob(parts[1]))
  } catch {
    return null
  }
}

/**
 * Verifica el estado de salud de la autenticación
 * Útil para diagnosticar problemas
 */
export function verifyAuthHealth(): AuthHealthResult {
  const issues: string[] = []

  if (typeof window === 'undefined') {
    return {
      isHealthy: false,
      issues: ['No se puede verificar en el servidor'],
      details: {
        hasAuthToken: false,
        hasRefreshToken: false,
        authTokenValid: false,
        refreshTokenValid: false,
        authTokenExpired: false,
        refreshTokenExpired: false,
        cookiesCount: 0,
        domain: '',
        protocol: ''
      }
    }
  }

  // Verificar que las cookies existen
  const authToken = getAuthCookie()
  const refreshToken = getRefreshCookie()

  const hasAuthToken = !!authToken
  const hasRefreshToken = !!refreshToken

  if (!authToken) {
    issues.push('No se encontró auth_token en cookies')
  }

  if (!refreshToken) {
    issues.push('No se encontró refresh_token en cookies')
  }

  // Verificar que los tokens son válidos (JWT o token opaco)
  const authTokenValid = authToken ? isValidToken(authToken) : false
  const refreshTokenValid = refreshToken ? isValidToken(refreshToken) : false

  if (authToken && !authTokenValid) {
    issues.push('auth_token no es válido')
  }

  if (refreshToken && !refreshTokenValid) {
    issues.push('refresh_token no es válido')
  }

  // Verificar que no están expirados (solo aplicable a JWT)
  // Los tokens opacos no tienen fecha de expiración visible
  const authTokenExpired = authToken && isValidJWT(authToken) ? isJWTExpired(authToken) : false
  const refreshTokenExpired = refreshToken && isValidJWT(refreshToken) ? isJWTExpired(refreshToken) : false

  if (authToken && authTokenExpired) {
    issues.push('auth_token está expirado')
  }

  if (refreshToken && refreshTokenExpired) {
    issues.push('refresh_token está expirado')
  }

  // Contar cookies totales
  const cookiesCount = document.cookie.split(';').filter(c => c.trim()).length

  return {
    isHealthy: issues.length === 0,
    issues,
    details: {
      hasAuthToken,
      hasRefreshToken,
      authTokenValid,
      refreshTokenValid,
      authTokenExpired,
      refreshTokenExpired,
      cookiesCount,
      domain: window.location.hostname,
      protocol: window.location.protocol
    }
  }
}

/**
 * Función de debugging completa
 * Muestra toda la información relevante para diagnosticar problemas
 */
export function debugAuth(): void {
  if (typeof window === 'undefined') {
    console.log('❌ debugAuth solo funciona en el cliente')
    return
  }

  console.group('🔧 DEBUG AUTH - Estado Completo')

  const health = verifyAuthHealth()

  console.log('📊 Estado de Salud:', health.isHealthy ? '✅ SALUDABLE' : '⚠️ PROBLEMAS DETECTADOS')

  if (health.issues.length > 0) {
    console.group('⚠️ Problemas Detectados')
    health.issues.forEach(issue => console.log('  -', issue))
    console.groupEnd()
  }

  console.group('📋 Detalles')
  console.log('  Auth Token presente:', health.details.hasAuthToken ? '✅' : '❌')
  console.log('  Refresh Token presente:', health.details.hasRefreshToken ? '✅' : '❌')
  console.log('  Auth Token válido:', health.details.authTokenValid ? '✅' : '❌')
  console.log('  Refresh Token válido:', health.details.refreshTokenValid ? '✅' : '❌')
  console.log('  Auth Token expirado:', health.details.authTokenExpired ? '⚠️ SÍ' : '✅ NO')
  console.log('  Refresh Token expirado:', health.details.refreshTokenExpired ? '⚠️ SÍ' : '✅ NO')
  console.log('  Total de cookies:', health.details.cookiesCount)
  console.log('  Dominio:', health.details.domain)
  console.log('  Protocolo:', health.details.protocol)
  console.groupEnd()

  // Mostrar payloads de los tokens si existen
  const authToken = getAuthCookie()
  const refreshToken = getRefreshCookie()

  if (authToken) {
    const authPayload = getJWTPayload(authToken)
    if (authPayload) {
      console.group('🎫 Auth Token Payload')
      console.log('  User ID:', authPayload.sub || authPayload.userId || 'N/A')
      console.log('  Expira en:', new Date(authPayload.exp * 1000).toLocaleString())
      console.log('  Emitido en:', authPayload.iat ? new Date(authPayload.iat * 1000).toLocaleString() : 'N/A')
      console.groupEnd()
    }
  }

  if (refreshToken) {
    const refreshPayload = getJWTPayload(refreshToken)
    if (refreshPayload) {
      console.group('🔄 Refresh Token Payload')
      console.log('  User ID:', refreshPayload.sub || refreshPayload.userId || 'N/A')
      console.log('  Expira en:', new Date(refreshPayload.exp * 1000).toLocaleString())
      console.log('  Emitido en:', refreshPayload.iat ? new Date(refreshPayload.iat * 1000).toLocaleString() : 'N/A')
      console.groupEnd()
    }
  }

  console.group('🍪 Todas las Cookies')
  const allCookies = document.cookie.split(';').map(c => c.trim())
  allCookies.forEach(cookie => {
    const [name] = cookie.split('=')
    console.log('  -', name)
  })
  console.groupEnd()

  console.groupEnd()
}

// Hacer disponible globalmente en desarrollo y producción (para debugging)
if (typeof window !== 'undefined') {
  (window as any).debugAuth = debugAuth;
  (window as any).verifyAuthHealth = verifyAuthHealth

  // Solo mostrar tip en desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.log('💡 Tip: Usa debugAuth() en la consola para diagnosticar problemas de autenticación')
  }
}

