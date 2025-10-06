import { useState } from 'react'

export function useKickAuth() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    // Nuevo método para login con credenciales
    const loginWithCredentials = async (username: any, password: any) => {
        try {
            setIsLoading(true)
            setError(null)

            const apiBase = process.env.NEXT_PUBLIC_API_URL
            if (!apiBase) {
                throw new Error('NEXT_PUBLIC_API_URL no está configurado')
            }

            const response = await fetch(`${apiBase}/api/auth/kick/web`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Error en autenticación')
            }

            // Guardar token en localStorage o cookies
            localStorage.setItem('authToken', data.token)

            return data

        } catch (error) {
            setError(error.message)
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    // Método deprecado - mantener para compatibilidad
    const connectWithKick = async () => {
        throw new Error('OAuth no disponible. Usa loginWithCredentials')
    }

    return {
        loginWithCredentials,
        connectWithKick, // Deprecado
        isLoading,
        error
    }
}
