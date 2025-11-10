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
  useToast,
  Input,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Image,
} from '@chakra-ui/react'
import { DownloadIcon, EditIcon } from '@chakra-ui/icons'
import { MdSwapHoriz, MdShoppingBag, MdHistory } from 'react-icons/md'
import { useRouter } from 'next/router'
import { useState } from 'react'
import api from '../lib/api'
import Head from 'next/head'
import { UserBadge, UserAvatarWithBadge } from '../components/UserBadge'

export default function PerfilPage() {
  const { user, logout, updateUserKickInfo, refreshUser } = useAuth()
  const router = useRouter()
  const toast = useToast()
  const [isUpdatingKickInfo, setIsUpdatingKickInfo] = useState(false)
  const [isUpdatingDiscord, setIsUpdatingDiscord] = useState(false)

  // Modal para editar Discord
  const { isOpen: isDiscordOpen, onOpen: onDiscordOpen, onClose: onDiscordClose } = useDisclosure()
  const [discordUsername, setDiscordUsername] = useState(user?.discord_username || '')

  const bgGradient = useColorModeValue(
    'linear(to-br, blue.50, purple.50)',
    'linear(to-br, blue.900, purple.900)'
  )
  const cardBg = useColorModeValue('white', 'gray.800')
  const discordWarningBg = useColorModeValue('orange.50', 'orange.900')
  const discordWarningBorder = useColorModeValue('orange.300', 'orange.600')

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

  const handleUpdateDiscord = async () => {
    setIsUpdatingDiscord(true)
    try {
      await api.put('/api/usuarios/me', { discord_username: discordUsername })
      await refreshUser()
      toast({
        title: 'Discord actualizado',
        description: 'Tu username de Discord se ha actualizado correctamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      onDiscordClose()
    } catch (error: any) {
      console.error('Error updating Discord:', error)
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Error desconocido'
      toast({
        title: 'Error al actualizar Discord',
        description: `${errorMessage}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsUpdatingDiscord(false)
    }
  }

  const openDiscordModal = () => {
    setDiscordUsername(user?.discord_username || '')
    onDiscordOpen()
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

  // Determinar qué avatar y nombre usar
  let avatarSrc = user.kick_avatar || undefined
  const displayName = user.kick_username || user.nickname || user.nombre || user.email

  // Si el usuario está conectado con Kick pero no tiene avatar, usar un fallback
  if (user.kick_username && !user.kick_avatar) {
    avatarSrc = undefined
  }

  return (
    <RequireAuth>
        <Head>
            <title>Perfil - Luisardito Shop</title>
            <meta name="description" content="Perfil de usuario en Luisardito Shop"/>
        </Head>
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
                  <UserAvatarWithBadge user={user as any}>
                    <Avatar
                      size={{ base: 'xl', md: '2xl' }}
                      name={displayName}
                      src={avatarSrc}
                      border="4px solid"
                      borderColor="white"
                      shadow="xl"
                    />
                  </UserAvatarWithBadge>
                  <VStack align={{ base: 'center', sm: 'start' }} spacing={2} flex="1">
                    <Heading
                      size={{ base: 'md', md: 'lg' }}
                      color="black.900"
                      textShadow="0 2px 4px rgba(0,0,0,0.3)"
                    >
                      {displayName}
                    </Heading>
                    <UserBadge user={user as any} size="md" />
                    <Text
                      color="black.800"
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
                      p={!user.discord_username ? 3 : 0}
                      bg={!user.discord_username ? discordWarningBg : 'transparent'}
                      borderRadius="lg"
                      border={!user.discord_username ? '2px solid' : 'none'}
                      borderColor={!user.discord_username ? discordWarningBorder : 'transparent'}
                    >
                      <Flex align="center" gap={2}>
                        <Image src="/images/discordlogo.png" alt="Discord" boxSize={5} />
                        <Text fontWeight="semibold" fontSize={{ base: 'sm', md: 'md' }}>
                          Discord:
                        </Text>
                      </Flex>
                      <Flex align="center" gap={2}>
                        {user.discord_username ? (
                          <Badge
                            colorScheme="purple"
                            fontSize={{ base: 'sm', md: 'md' }}
                            px={3}
                            py={1}
                            borderRadius="md"
                          >
                            {user.discord_username}
                          </Badge>
                        ) : (
                          <Text fontSize={{ base: 'sm', md: 'md' }} color="orange.600" fontWeight="medium">
                            No configurado - Agrégalo ahora
                          </Text>
                        )}
                        <Button
                          size="xs"
                          variant="ghost"
                          colorScheme={!user.discord_username ? 'orange' : 'purple'}
                          leftIcon={<EditIcon />}
                          onClick={openDiscordModal}
                        >
                          {user.discord_username ? 'Editar' : 'Agregar'}
                        </Button>
                      </Flex>
                    </Flex>

                    {/* Información VIP */}
                    {user.vip_status?.is_active && (
                      <Flex
                        direction={{ base: 'column', sm: 'row' }}
                        justify="space-between"
                        align={{ base: 'start', sm: 'center' }}
                        gap={2}
                      >
                        <Text fontWeight="semibold" fontSize={{ base: 'sm', md: 'md' }}>
                          Estado VIP:
                        </Text>
                        <Badge
                          colorScheme="yellow"
                          fontSize={{ base: 'sm', md: 'md' }}
                          px={3}
                          py={1}
                          borderRadius="md"
                        >
                          VIP {user.vip_status.is_permanent ? 'Permanente' :
                            `hasta ${new Date(user.vip_status.expires_at!).toLocaleDateString('es-ES')}`}
                        </Badge>
                      </Flex>
                    )}

                    {/* Estado de migración Botrix */}
                    {user.migration_status?.migrated && (
                      <Flex
                        direction={{ base: 'column', sm: 'row' }}
                        justify="space-between"
                        align={{ base: 'start', sm: 'center' }}
                        gap={2}
                      >
                        <Text fontWeight="semibold" fontSize={{ base: 'sm', md: 'md' }}>
                          Migración Botrix:
                        </Text>
                        <Badge
                          colorScheme="cyan"
                          fontSize={{ base: 'sm', md: 'md' }}
                          px={3}
                          py={1}
                          borderRadius="md"
                        >
                          ✅ {user.migration_status.points_migrated?.toLocaleString()} puntos migrados
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
                        {(user.creado || user.created_at) && new Date((user.creado || user.created_at)!).toLocaleDateString('es-ES', {
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

        {/* Modal para editar Discord */}
        <Modal isOpen={isDiscordOpen} onClose={onDiscordClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Configurar Discord</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>Username de Discord</FormLabel>
                <Input
                  value={discordUsername}
                  onChange={(e) => setDiscordUsername(e.target.value)}
                  placeholder="usuario#1234"
                />
                <Text fontSize="xs" color="gray.500" mt={1}>
                  Formato: usuario#1234 o simplemente usuario
                </Text>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onDiscordClose}>
                Cancelar
              </Button>
              <Button
                colorScheme="purple"
                onClick={handleUpdateDiscord}
                isLoading={isUpdatingDiscord}
                loadingText="Actualizando..."
              >
                Guardar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Layout>
    </RequireAuth>
  )
}
