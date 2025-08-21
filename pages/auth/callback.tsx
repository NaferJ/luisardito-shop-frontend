import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Center, Spinner, VStack, Text, Alert, AlertIcon, Button } from '@chakra-ui/react'
import { Layout } from '../../components/Layout'
import { useKickAuth } from '../../hooks/useKickAuth'

export default function AuthCallbackPage() {
  const router = useRouter()
  const { handleKickCallback } = useKickAuth()
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(true)

  useEffect(() => {
    const processCallback = async () => {
      const { code, state, error: oauthError } = router.query

      // Si hay error de OAuth
      if (oauthError) {
        setError(`Error de autorización: ${oauthError}`)
        setIsProcessing(false)
        return
      }

      // Si no tenemos código, esperar a que se cargue
      if (!code || !state) {
        return
      }

      try {
        await handleKickCallback(code as string, state as string)
      } catch (err: any) {
        setError(err.message)
        setIsProcessing(false)
      }
    }

    // Solo procesar si tenemos los query params
    if (router.isReady) {
      processCallback()
    }
  }, [router.isReady, router.query, handleKickCallback])

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
              <Text fontSize="sm" color="gray.600">
                Puedes intentar conectar nuevamente o usar el login tradicional.
              </Text>
              <Button 
                colorScheme="teal" 
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
          <Spinner size="xl" color="teal.500" />
          <VStack spacing={2} textAlign="center">
            <Text fontSize="lg" fontWeight="semibold">
              Conectando con Kick...
            </Text>
            <Text fontSize="sm" color="gray.600">
              Procesando tu autenticación, por favor espera un momento.
            </Text>
          </VStack>
        </VStack>
      </Center>
    </Layout>
  )
}
