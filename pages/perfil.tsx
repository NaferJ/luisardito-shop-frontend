import { Layout } from '../components/Layout'
import { RequireAuth } from '../components/RequireAuth'
import { useAuth } from '../hooks/useAuth'
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Button,
  Avatar,
  Badge,
  Divider,
  Grid,
  GridItem,
  Card,
  CardBody,
  Heading
} from '@chakra-ui/react'
import { useRouter } from 'next/router'

export default function PerfilPage() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
  }

  const goToHistorial = () => {
    router.push('/historial')
  }

  const goToCanjes = () => {
    router.push('/canjes')
  }

  return (
    <RequireAuth>
      <Layout>
        <Container maxW="container.lg" py={8}>
          <VStack spacing={6} align="stretch">
            {/* Encabezado de perfil */}
            <Card>
              <CardBody>
                <HStack spacing={6} align="center">
                  <Avatar size="xl" name={(user as any)?.nickname} />
                  <VStack align="start" spacing={2} flex="1">
                    <Heading size="lg">{(user as any)?.nickname}</Heading>
                    <Text color="gray.600">{user?.email}</Text>
                    <Badge colorScheme="purple" fontSize="md" px={3} py={1}>
                      {user?.puntos?.toLocaleString()} puntos disponibles
                    </Badge>
                  </VStack>
                </HStack>
              </CardBody>
            </Card>

            {/* Acciones rápidas */}
            <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
              <GridItem>
                <Card>
                  <CardBody textAlign="center">
                    <Text fontSize="2xl" fontWeight="bold" color="teal.600">
                      {user?.puntos?.toLocaleString()}
                    </Text>
                    <Text color="gray.600">Puntos totales</Text>
                    <Button
                      mt={3}
                      size="sm"
                      colorScheme="teal"
                      variant="outline"
                      onClick={goToHistorial}
                    >
                      Ver historial
                    </Button>
                  </CardBody>
                </Card>
              </GridItem>

              <GridItem>
                <Card>
                  <CardBody textAlign="center">
                    <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                      Canjes
                    </Text>
                    <Text color="gray.600">Mis canjes realizados</Text>
                    <Button
                      mt={3}
                      size="sm"
                      colorScheme="blue"
                      variant="outline"
                      onClick={goToCanjes}
                    >
                      Ver canjes
                    </Button>
                  </CardBody>
                </Card>
              </GridItem>

              <GridItem>
                <Card>
                  <CardBody textAlign="center">
                    <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                      Tienda
                    </Text>
                    <Text color="gray.600">Catálogo de productos</Text>
                    <Button
                      mt={3}
                      size="sm"
                      colorScheme="purple"
                      variant="outline"
                      onClick={() => router.push('/')}
                    >
                      Ir a la tienda
                    </Button>
                  </CardBody>
                </Card>
              </GridItem>
            </Grid>

            {/* Información de cuenta */}
            <Card>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <Heading size="md" mb={2}>Información de cuenta</Heading>

                  <HStack justify="space-between">
                    <Text fontWeight="semibold">Nickname:</Text>
                    <Text>{(user as any)?.nickname}</Text>
                  </HStack>

                  <HStack justify="space-between">
                    <Text fontWeight="semibold">Email:</Text>
                    <Text>{user?.email}</Text>
                  </HStack>

                  <HStack justify="space-between">
                    <Text fontWeight="semibold">Puntos disponibles:</Text>
                    <Badge colorScheme="green" fontSize="sm">
                      {user?.puntos?.toLocaleString()} puntos
                    </Badge>
                  </HStack>

                  <HStack justify="space-between">
                    <Text fontWeight="semibold">Miembro desde:</Text>
                    <Text>
                      {(user as any)?.creado && new Date((user as any).creado).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Text>
                  </HStack>

                  <Divider />

                  <Button colorScheme="red" variant="outline" onClick={handleLogout}>
                    Cerrar sesión
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        </Container>
      </Layout>
    </RequireAuth>
  )
}
