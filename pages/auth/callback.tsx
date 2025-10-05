import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { Center, Spinner, VStack, Text, Alert, AlertIcon, Button } from '@chakra-ui/react'
import { Layout } from '../../components/Layout'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const hasProcessedRef = useRef(false)

  useEffect(() => {
    const processCallback = async () => {
      if (hasProcessedRef.current) return

      const { code, state, error: oauthError } = router.query

      // Si hay error de OAuth
      if (oauthError) {
        setError(`Error de autorización: ${oauthError}`)
        hasProcessedRef.current = true
        return
      }

      // Si no tenemos parámetros aún, esperar
      if (!code || !state) return

      hasProcessedRef.current = true

      // Delegar el manejo del callback al backend vía GET con code y state intactos
      const apiBase = process.env.NEXT_PUBLIC_API_URL || ''
      const base = apiBase.replace(/\/$/, '')
      const url = `${base}/api/auth/kick-callback?code=${encodeURIComponent(String(code))}&state=${encodeURIComponent(String(state))}`
      window.location.href = url
    }

    if (router.isReady) {
      processCallback()
    }
  }, [router.isReady, router.query])

  if (error) {
    return (
      <Layout>
        <Center minH="50vh">
          <VStack spacing={4} maxW="md" textAlign="center">
            <Alert status="error">
              <AlertIcon />
              {error}
            </Alert>

            <VStack spacing={2}>
              <Text fontSize="sm" color="text.muted">
                Puedes intentar conectar nuevamente o usar el login tradicional.
              </Text>
              <Button 
                colorScheme="blue" 
                onClick={() => router.push('/login')}
              >
                Ir a Login
              </Button>
            </VStack>
          </VStack>
        </Center>
      </Layout>
    )
  }

  return (
    <Layout>
      <Center minH="50vh">
        <VStack spacing={4}>
          <Spinner size="xl" color="accent.fg" />
          <VStack spacing={2} textAlign="center">
            <Text fontSize="lg" fontWeight="semibold">
              Conectando con Kick...
            </Text>
            <Text fontSize="sm" color="text.muted">
              Procesando tu autenticación, por favor espera un momento.
            </Text>
          </VStack>
        </VStack>
      </Center>
    </Layout>
  )
}
