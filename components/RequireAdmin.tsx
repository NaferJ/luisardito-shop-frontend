import { ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Alert, AlertIcon, Container, VStack, Text, Button } from '@chakra-ui/react'
import { useRouter } from 'next/router'

interface RequireAdminProps {
  children: ReactNode
  allowedRoles?: number[] // IDs de roles permitidos
  permissions?: string[] // Permisos específicos requeridos
}

// Solo streamer (rol_id: 3), developer (rol_id: 4) y moderador (rol_id: 5) pueden acceder a admin
const DEFAULT_ADMIN_ROLES = [3, 4, 5]

export function RequireAdmin({
  children,
  allowedRoles = DEFAULT_ADMIN_ROLES,
  permissions = []
}: RequireAdminProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  if (isLoading) {
    return (
      <Container maxW="container.md" py={8}>
        <VStack spacing={4}>
          <Text>Verificando permisos...</Text>
        </VStack>
      </Container>
    )
  }

  if (!user) {
    return (
      <Container maxW="container.md" py={8}>
        <Alert status="error" borderRadius="xl">
          <AlertIcon />
          <VStack align="start" spacing={2}>
            <Text fontWeight="bold">Acceso denegado</Text>
            <Text>Debes iniciar sesión para acceder a esta página.</Text>
            <Button
              colorScheme="blue"
              size="sm"
              onClick={() => router.push('/login')}
            >
              Iniciar sesión
            </Button>
          </VStack>
        </Alert>
      </Container>
    )
  }

  // Verificar si el usuario tiene uno de los roles permitidos
  const hasValidRole = allowedRoles.includes(user.rol_id)

  if (!hasValidRole) {
    return (
      <Container maxW="container.md" py={8}>
        <Alert status="error" borderRadius="xl">
          <AlertIcon />
          <VStack align="start" spacing={2}>
            <Text fontWeight="bold">Acceso denegado</Text>
            <Text>
              No tienes permisos para acceder a esta página. Solo streamers, desarrolladores
              y moderadores pueden acceder al panel de administración.
            </Text>
            <Button
              colorScheme="purple"
              size="sm"
              onClick={() => router.push('/')}
            >
              🏠 Volver al inicio
            </Button>
          </VStack>
        </Alert>
      </Container>
    )
  }

  return <>{children}</>
}
