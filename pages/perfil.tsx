import { Layout } from '../components/Layout'
import { RequireAuth } from '../components/RequireAuth'
import { useAuth } from '../hooks/useAuth'
import {
  Box,
  Container,
  VStack,
  Text,
  Button,
  Avatar,
  Badge,
  Divider,
  Card,
  CardBody,
  Heading,
  useColorModeValue,
  Flex,
  Icon,
  Stack,
  SimpleGrid,
  useToast
} from '@chakra-ui/react'
import { DownloadIcon } from '@chakra-ui/icons'
import { MdShoppingCart, MdSwapHoriz, MdShoppingBag, MdHistory, MdPerson } from 'react-icons/md'
import { useRouter } from 'next/router'
import { useState } from 'react'

export default function PerfilPage() {
  const { user, logout, updateUserKickInfo } = useAuth()
  const router = useRouter()
  const toast = useToast()
  const [isUpdatingKickInfo, setIsUpdatingKickInfo] = useState(false)

  const bgGradient = useColorModeValue(
    'linear(to-br, blue.50, purple.50)',
    'linear(to-br, blue.900, purple.900)'
  )
  const cardBg = useColorModeValue('white', 'gray.800')

  const handleLogout = () => {
    logout()
  }

  const goToHistorial = () => {
    router.push('/historial')
  }

  const goToCanjes = () => {
    router.push('/canjes')
  }

  const handleUpdateKickInfo = async () => {
    setIsUpdatingKickInfo(true)
    try {
      await updateUserKickInfo()
      toast({
        title: 'Información actualizada',
        description: 'La información de Kick se ha sincronizado correctamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Error al actualizar',
        description: 'No se pudo sincronizar la información de Kick',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsUpdatingKickInfo(false)
    }
  }

  if (!user) {
    return (
      <RequireAuth>
        <Layout>
          <Container maxW="container.lg" py={8}>
            <Text>Cargando...</Text>
          </Container>
        </Layout>
      </RequireAuth>
    )
  }

  // Determinar qué avatar y nombre usar con debugging
  let avatarSrc = user.kick_avatar || undefined
  const displayName = user.kick_username || user.nickname || user.nombre || user.email

  // Si el usuario está conectado con Kick pero no tiene avatar, usar un fallback
  if (user.kick_username && !user.kick_avatar) {
    // Podrías usar la API de Kick para obtener el avatar si es necesario
    // Por ahora, usar undefined para que se muestre la inicial
    avatarSrc = undefined
  }

  // Debugging del avatar en desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.log('Perfil - Usuario completo:', {
      id: user.id,
      kick_avatar: user.kick_avatar,
      kick_username: user.kick_username,
      nickname: user.nickname,
      nombre: user.nombre,
      email: user.email,
      created_at: user.created_at,
      puntos: user.puntos,
      avatarSrc,
      displayName,
      isCloudinaryAvatar: user.kick_avatar?.includes('cloudinary.com'),
      hasKickConnection: !!user.kick_username
    })
  }

  return (
    <RequireAuth>
      <Layout>
        <Container maxW="container.lg" py={{ base: 4, md: 8 }} px={{ base: 4, md: 6 }}>
          <VStack spacing={{ base: 4, md: 6 }} align="stretch">
            {/* Encabezado de perfil con diseño responsive */}
            <Card
              bg={cardBg}
              shadow="lg"
              borderRadius="2xl"
              overflow="hidden"
            >
              <Box bgGradient={bgGradient} p={{ base: 4, md: 6 }}>
                <Stack
                  direction={{ base: 'column', sm: 'row' }}
                  spacing={{ base: 4, sm: 6 }}
                  align="center"
                  textAlign={{ base: 'center', sm: 'left' }}
                >
                  <Avatar
                    size={{ base: 'xl', md: '2xl' }}
                    name={displayName}
                    src={avatarSrc}
                    border="4px solid"
                    borderColor="white"
                    shadow="xl"
                  />
                  <VStack align={{ base: 'center', sm: 'start' }} spacing={2} flex="1">
                    <Heading
                      size={{ base: 'md', md: 'lg' }}
                      color="black.900"
                      textShadow="0 2px 4px rgba(0,0,0,0.3)"
                    >
                      {displayName}
                    </Heading>
                    <Text
                      color="black.900"
                      fontSize={{ base: 'sm', md: 'md' }}
                      textShadow="0 1px 2px rgba(0,0,0,0.3)"
                    >
                      {user.email}
                    </Text>
                    <Badge
                      colorScheme="yellow"
                      fontSize={{ base: 'sm', md: 'md' }}
                      px={4}
                      py={2}
                      borderRadius="full"
                      textTransform="none"
                      fontWeight="bold"
                    >
                      {user.puntos?.toLocaleString()} puntos
                    </Badge>

                    {/* Indicador de usuario de Kick */}
                    {user.kick_username && (
                      <Badge
                        colorScheme="green"
                        fontSize="xs"
                        px={2}
                        py={1}
                        borderRadius="md"
                      >
                        Conectado con Kick
                      </Badge>
                    )}
                  </VStack>
                </Stack>
              </Box>
            </Card>

            {/* Estadísticas rápidas - Responsive */}
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
              <Card
                bg={cardBg}
                shadow="md"
                borderRadius="xl"
                transition="all 0.2s"
                _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                cursor="pointer"
                onClick={goToHistorial}
              >
                <CardBody textAlign="center" py={{ base: 6, md: 8 }}>
                  <Icon as={MdHistory} boxSize={8} color="teal.500" mb={3} />
                  <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" color="teal.600">
                    {user.puntos?.toLocaleString()}
                  </Text>
                  <Text color="gray.600" fontSize={{ base: 'sm', md: 'md' }}>Puntos totales</Text>
                  <Button
                    mt={3}
                    size="sm"
                    colorScheme="teal"
                    variant="ghost"
                    rightIcon={<Icon as={MdHistory} />}
                    fontSize="xs"
                  >
                    Ver historial
                  </Button>
                </CardBody>
              </Card>

              <Card
                bg={cardBg}
                shadow="md"
                borderRadius="xl"
                transition="all 0.2s"
                _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                cursor="pointer"
                onClick={goToCanjes}
              >
                <CardBody textAlign="center" py={{ base: 6, md: 8 }}>
                  <Icon as={MdSwapHoriz} boxSize={8} color="blue.500" mb={3} />
                  <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" color="blue.600">
                    Canjes
                  </Text>
                  <Text color="gray.600" fontSize={{ base: 'sm', md: 'md' }}>Mis canjes realizados</Text>
                  <Button
                    mt={3}
                    size="sm"
                    colorScheme="blue"
                    variant="ghost"
                    rightIcon={<Icon as={MdSwapHoriz} />}
                    fontSize="xs"
                  >
                    Ver canjes
                  </Button>
                </CardBody>
              </Card>

              <Card
                bg={cardBg}
                shadow="md"
                borderRadius="xl"
                transition="all 0.2s"
                _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                cursor="pointer"
                onClick={() => router.push('/')}
                gridColumn={{ base: 'span 1', sm: 'span 2', md: 'span 1' }}
              >
                <CardBody textAlign="center" py={{ base: 6, md: 8 }}>
                  <Icon as={MdShoppingBag} boxSize={8} color="purple.500" mb={3} />
                  <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" color="purple.600">
                    Tienda
                  </Text>
                  <Text color="gray.600" fontSize={{ base: 'sm', md: 'md' }}>Catálogo de productos</Text>
                  <Button
                    mt={3}
                    size="sm"
                    colorScheme="purple"
                    variant="ghost"
                    rightIcon={<Icon as={MdShoppingBag} />}
                    fontSize="xs"
                  >
                    Ir a la tienda
                  </Button>
                </CardBody>
              </Card>
            </SimpleGrid>

            {/* Información de cuenta - Responsive */}
            <Card bg={cardBg} shadow="md" borderRadius="xl">
              <CardBody p={{ base: 4, md: 6 }}>
                <VStack spacing={4} align="stretch">
                  <Heading size={{ base: 'sm', md: 'md' }} mb={2} color="black.700">
                    Información de cuenta
                  </Heading>

                  <VStack spacing={3} align="stretch">
                    <Flex
                      direction={{ base: 'column', sm: 'row' }}
                      justify="space-between"
                      align={{ base: 'start', sm: 'center' }}
                      gap={2}
                    >
                      <Text fontWeight="semibold" fontSize={{ base: 'sm', md: 'md' }}>
                        Nombre de usuario:
                      </Text>
                      <Text fontSize={{ base: 'sm', md: 'md' }} fontFamily="mono">
                        {displayName}
                      </Text>
                    </Flex>

                    <Flex
                      direction={{ base: 'column', sm: 'row' }}
                      justify="space-between"
                      align={{ base: 'start', sm: 'center' }}
                      gap={2}
                    >
                      <Text fontWeight="semibold" fontSize={{ base: 'sm', md: 'md' }}>
                        Email:
                      </Text>
                      <Text fontSize={{ base: 'sm', md: 'md' }} color="blue.600">
                        {user.email}
                      </Text>
                    </Flex>

                    <Flex
                      direction={{ base: 'column', sm: 'row' }}
                      justify="space-between"
                      align={{ base: 'start', sm: 'center' }}
                      gap={2}
                    >
                      <Text fontWeight="semibold" fontSize={{ base: 'sm', md: 'md' }}>
                        Puntos disponibles:
                      </Text>
                      <Badge
                        colorScheme="green"
                        fontSize={{ base: 'sm', md: 'md' }}
                        px={3}
                        py={1}
                        borderRadius="md"
                      >
                        {user.puntos?.toLocaleString()} puntos
                      </Badge>
                    </Flex>

                    {user.kick_username && (
                      <Flex
                        direction={{ base: 'column', sm: 'row' }}
                        justify="space-between"
                        align={{ base: 'start', sm: 'center' }}
                        gap={2}
                      >
                        <Text fontWeight="semibold" fontSize={{ base: 'sm', md: 'md' }}>
                          Kick Username:
                        </Text>
                        <Badge
                          colorScheme="green"
                          fontSize={{ base: 'sm', md: 'md' }}
                          px={3}
                          py={1}
                          borderRadius="md"
                        >
                          {user.kick_username}
                        </Badge>
                      </Flex>
                    )}

                    <Flex
                      direction={{ base: 'column', sm: 'row' }}
                      justify="space-between"
                      align={{ base: 'start', sm: 'center' }}
                      gap={2}
                    >
                      <Text fontWeight="semibold" fontSize={{ base: 'sm', md: 'md' }}>
                        Miembro desde:
                      </Text>
                      <Text fontSize={{ base: 'sm', md: 'md' }} color="gray.600">
                        {user.creado && new Date(user.creado).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Text>
                    </Flex>
                  </VStack>

                  <Divider my={4} />

                  {/* Botón para actualizar información de Kick */}
                  {user.kick_username && (
                    <>
                      <Button
                        leftIcon={<DownloadIcon />}
                        colorScheme="blue"
                        variant="outline"
                        onClick={handleUpdateKickInfo}
                        isLoading={isUpdatingKickInfo}
                        loadingText="Sincronizando..."
                        size={{ base: 'md', md: 'lg' }}
                        borderRadius="xl"
                        fontWeight="bold"
                        _hover={{
                          transform: 'translateY(-1px)',
                          shadow: 'md'
                        }}
                      >
                        Sincronizar información de Kick
                      </Button>
                      <Divider my={4} />
                    </>
                  )}

                  <Button
                    colorScheme="red"
                    variant="outline"
                    onClick={handleLogout}
                    size={{ base: 'md', md: 'lg' }}
                    borderRadius="xl"
                    fontWeight="bold"
                    _hover={{
                      transform: 'translateY(-1px)',
                      shadow: 'md'
                    }}
                  >
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
