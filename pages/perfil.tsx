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
  Heading,
  useColorModeValue,
  Flex,
  Icon,
  useToast,
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
  Input,
  SimpleGrid,
  HStack,
  Spinner
} from '@chakra-ui/react'
import { MdHistory, MdShoppingBag, MdLogout, MdSync } from 'react-icons/md'
import { FaDiscord, FaKickstarter, FaTrophy, FaEdit } from 'react-icons/fa'
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

  const { isOpen: isDiscordOpen, onOpen: onDiscordOpen, onClose: onDiscordClose } = useDisclosure()
  const [discordUsername, setDiscordUsername] = useState(user?.discord_username || '')

  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const textColor = useColorModeValue('gray.800', 'white')
  const mutedColor = useColorModeValue('gray.600', 'gray.400')
  const hoverBg = useColorModeValue('gray.50', 'gray.700')

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const handleUpdateKickInfo = async () => {
    setIsUpdatingKickInfo(true)
    try {
      await updateUserKickInfo()
      toast({
        title: 'Sincronizado',
        description: 'Información de Kick actualizada',
        status: 'success',
        duration: 3000,
        isClosable: true
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo sincronizar',
        status: 'error',
        duration: 3000,
        isClosable: true
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
        title: 'Actualizado',
        description: 'Username de Discord guardado',
        status: 'success',
        duration: 3000,
        isClosable: true
      })
      onDiscordClose()
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.response?.data?.error || 'Error al actualizar'
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true
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
          <Container maxW="container.md" py={8}>
            <Flex justify="center" align="center" minH="400px">
              <Spinner size="xl" />
            </Flex>
          </Container>
        </Layout>
      </RequireAuth>
    )
  }

  const avatarSrc = user.avatar_url || user.kick_data?.avatar_url || user.kick_avatar || undefined
  const displayName = user.kick_username || user.nickname || user.nombre || user.email

  return (
    <RequireAuth>
      <Head>
        <title>Perfil - Luisardito Shop</title>
        <meta name="description" content={`Perfil de ${displayName} en Luisardito Shop`} />
      </Head>
      <Layout>
        <Container maxW="container.md" px={{ base: 4, md: 6 }} py={{ base: 6, md: 10 }}>
          <VStack spacing={6} align="stretch">
            {/* Card Principal */}
            <Box
              bg={cardBg}
              borderRadius="xl"
              borderWidth="1px"
              borderColor={borderColor}
              overflow="hidden"
            >
              {/* Header con Avatar y Puntos */}
              <Flex
                direction={{ base: 'column', md: 'row' }}
                align="center"
                justify="space-between"
                p={{ base: 6, md: 8 }}
                gap={6}
              >
                <Flex align="center" gap={4} flex="1" w={{ base: 'full', md: 'auto' }}>
                  <UserAvatarWithBadge user={user as any}>
                    <Avatar
                      size="xl"
                      name={displayName}
                      src={avatarSrc}
                      borderWidth="2px"
                      borderColor={borderColor}
                    />
                  </UserAvatarWithBadge>
                  <VStack align="start" spacing={1} flex="1">
                    <Heading size="md" color={textColor}>
                      {displayName}
                    </Heading>
                    <Text fontSize="sm" color={mutedColor}>
                      {user.email}
                    </Text>
                    <UserBadge user={user as any} size="sm" />
                  </VStack>
                </Flex>

                <VStack spacing={1} align={{ base: 'center', md: 'end' }}>
                  <Text
                    fontSize="xs"
                    color={mutedColor}
                    textTransform="uppercase"
                    fontWeight="semibold"
                  >
                    Puntos
                  </Text>
                  <Text fontSize="3xl" fontWeight="bold" color="green.500" lineHeight="1">
                    {user.puntos?.toLocaleString()}
                  </Text>
                </VStack>
              </Flex>

              <Divider />

              {/* Información de Cuenta */}
              <Box p={{ base: 6, md: 8 }}>
                <Heading size="sm" mb={4} color={textColor}>
                  Información de Cuenta
                </Heading>
                <VStack spacing={4} align="stretch">
                  {/* Kick */}
                  {user.kick_username && (
                    <Flex justify="space-between" align="center">
                      <HStack spacing={3}>
                        <Icon as={FaKickstarter} color="green.500" boxSize={5} />
                        <Box>
                          <Text fontSize="xs" color={mutedColor} lineHeight="1.2">
                            Kick
                          </Text>
                          <Text fontSize="sm" fontWeight="medium" color={textColor}>
                            {user.kick_username}
                          </Text>
                        </Box>
                      </HStack>
                      <Button
                        size="sm"
                        variant="ghost"
                        colorScheme="green"
                        leftIcon={<Icon as={MdSync} />}
                        onClick={handleUpdateKickInfo}
                        isLoading={isUpdatingKickInfo}
                      >
                        Sincronizar
                      </Button>
                    </Flex>
                  )}

                  {/* Discord */}
                  <Flex justify="space-between" align="center">
                    <HStack spacing={3}>
                      <Icon as={FaDiscord} color="purple.500" boxSize={5} />
                      <Box>
                        <Text fontSize="xs" color={mutedColor} lineHeight="1.2">
                          Discord
                        </Text>
                        <Text fontSize="sm" fontWeight="medium" color={textColor}>
                          {user.discord_username || 'No configurado'}
                        </Text>
                      </Box>
                    </HStack>
                    <Button
                      size="sm"
                      variant="ghost"
                      colorScheme="purple"
                      leftIcon={<Icon as={FaEdit} />}
                      onClick={openDiscordModal}
                    >
                      {user.discord_username ? 'Editar' : 'Agregar'}
                    </Button>
                  </Flex>

                  {/* VIP Status */}
                  {user.vip_status?.is_active && (
                    <Flex justify="space-between" align="center">
                      <HStack spacing={3}>
                        <Icon as={FaTrophy} color="yellow.500" boxSize={5} />
                        <Box>
                          <Text fontSize="xs" color={mutedColor} lineHeight="1.2">
                            Estado VIP
                          </Text>
                          <Text fontSize="sm" fontWeight="medium" color={textColor}>
                            {user.vip_status.is_permanent
                              ? 'Permanente'
                              : new Date(user.vip_status.expires_at!).toLocaleDateString('es-ES')}
                          </Text>
                        </Box>
                      </HStack>
                    </Flex>
                  )}

                  {/* Migración Botrix */}
                  {user.migration_status?.migrated && (
                    <Flex justify="space-between" align="center">
                      <HStack spacing={3}>
                        <Box
                          w={5}
                          h={5}
                          borderRadius="full"
                          bg="cyan.500"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Text fontSize="xs" color="white" fontWeight="bold">
                            ✓
                          </Text>
                        </Box>
                        <Box>
                          <Text fontSize="xs" color={mutedColor} lineHeight="1.2">
                            Puntos Migrados
                          </Text>
                          <Text fontSize="sm" fontWeight="medium" color={textColor}>
                            {user.migration_status.points_migrated?.toLocaleString()} puntos
                          </Text>
                        </Box>
                      </HStack>
                    </Flex>
                  )}

                  {/* Miembro desde */}
                  <Flex justify="space-between" align="center">
                    <Text fontSize="sm" color={mutedColor}>
                      Miembro desde
                    </Text>
                    <Text fontSize="sm" fontWeight="medium" color={textColor}>
                      {(user.creado || user.created_at) &&
                        new Date((user.creado || user.created_at)!).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                    </Text>
                  </Flex>
                </VStack>
              </Box>
            </Box>

            {/* Navegación Rápida */}
            <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4}>
              <Button
                h="80px"
                bg={cardBg}
                borderWidth="1px"
                borderColor={borderColor}
                borderRadius="xl"
                onClick={() => router.push('/historial')}
                _hover={{ bg: hoverBg, transform: 'translateY(-2px)' }}
                transition="all 0.2s"
                flexDirection="column"
                gap={2}
              >
                <Icon as={MdHistory} boxSize={6} color="blue.500" />
                <Text fontSize="sm" fontWeight="medium" color={textColor}>
                  Historial
                </Text>
              </Button>

              <Button
                h="80px"
                bg={cardBg}
                borderWidth="1px"
                borderColor={borderColor}
                borderRadius="xl"
                onClick={() => router.push('/canjes')}
                _hover={{ bg: hoverBg, transform: 'translateY(-2px)' }}
                transition="all 0.2s"
                flexDirection="column"
                gap={2}
              >
                <Icon as={FaTrophy} boxSize={6} color="purple.500" />
                <Text fontSize="sm" fontWeight="medium" color={textColor}>
                  Mis Canjes
                </Text>
              </Button>

              <Button
                h="80px"
                bg={cardBg}
                borderWidth="1px"
                borderColor={borderColor}
                borderRadius="xl"
                onClick={() => router.push('/')}
                _hover={{ bg: hoverBg, transform: 'translateY(-2px)' }}
                transition="all 0.2s"
                flexDirection="column"
                gap={2}
                gridColumn={{ base: 'span 2', md: 'span 1' }}
              >
                <Icon as={MdShoppingBag} boxSize={6} color="teal.500" />
                <Text fontSize="sm" fontWeight="medium" color={textColor}>
                  Tienda
                </Text>
              </Button>
            </SimpleGrid>

            {/* Botón de Cerrar Sesión */}
            <Button
              size="lg"
              colorScheme="red"
              variant="outline"
              leftIcon={<Icon as={MdLogout} />}
              onClick={handleLogout}
              borderRadius="xl"
              h="56px"
              mb={-2}
            >
              Cerrar Sesión
            </Button>
          </VStack>
        </Container>

        {/* Modal Discord */}
        <Modal isOpen={isDiscordOpen} onClose={onDiscordClose} isCentered>
          <ModalOverlay />
          <ModalContent mx={4} borderRadius="xl">
            <ModalHeader>Configurar Discord</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel fontSize="sm" color={mutedColor}>
                  Username de Discord
                </FormLabel>
                <Input
                  value={discordUsername}
                  onChange={(e) => setDiscordUsername(e.target.value)}
                  placeholder="usuario#1234"
                  size="lg"
                  borderRadius="lg"
                />
                <Text fontSize="xs" color={mutedColor} mt={2}>
                  Ejemplo: usuario#1234 o simplemente usuario
                </Text>
              </FormControl>
            </ModalBody>
            <ModalFooter gap={3}>
              <Button variant="ghost" onClick={onDiscordClose}>
                Cancelar
              </Button>
              <Button
                colorScheme="purple"
                onClick={handleUpdateDiscord}
                isLoading={isUpdatingDiscord}
                leftIcon={<Icon as={FaDiscord} />}
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
