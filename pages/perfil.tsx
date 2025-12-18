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
  Divider,
  Heading,
  useColorModeValue,
  Flex,
  Icon,
  useToast,
  SimpleGrid,
  HStack,
  Spinner
} from '@chakra-ui/react'
import { MdHistory, MdShoppingBag, MdLogout, MdSync } from 'react-icons/md'
import { FaDiscord, FaKickstarter, FaTrophy } from 'react-icons/fa'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import api from '../lib/api'
import Head from 'next/head'
import { UserBadge, UserAvatarWithBadge } from '../components/UserBadge'

export default function PerfilPage() {
  const { user, logout, updateUserKickInfo, refreshUser } = useAuth()
  const router = useRouter()
  const toast = useToast()
  const [isUpdatingKickInfo, setIsUpdatingKickInfo] = useState(false)
  const [isUnlinkingDiscord, setIsUnlinkingDiscord] = useState(false)
  const [discordToastShown, setDiscordToastShown] = useState(false)

  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const textColor = useColorModeValue('gray.800', 'white')
  const mutedColor = useColorModeValue('gray.600', 'gray.400')
  const hoverBg = useColorModeValue('gray.50', 'gray.700')

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const discordLinked = urlParams.get('discord_linked')
    
    if (discordLinked === 'success' && !discordToastShown) {
      setDiscordToastShown(true)
      toast({
        title: 'Cuenta vinculada',
        description: '✅ Cuenta de Discord vinculada exitosamente',
        status: 'success',
        duration: 5000,
        isClosable: true
      })
      refreshUser()
      window.history.replaceState({}, '', window.location.pathname)
    } else if (discordLinked === 'error' && !discordToastShown) {
      setDiscordToastShown(true)
      toast({
        title: 'Error',
        description: '❌ Error al vincular cuenta de Discord',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [refreshUser, toast, discordToastShown])

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
    } catch {
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

  const handleVincularDiscord = () => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'Debes iniciar sesión primero',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
      return
    }
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/discord`
  }

  const handleDesvincularDiscord = async () => {
    setIsUnlinkingDiscord(true)
    try {
      await api.post('/api/auth/discord/unlink')
      await refreshUser()
      toast({
        title: 'Cuenta desvinculada',
        description: 'Cuenta de Discord desvinculada exitosamente',
        status: 'success',
        duration: 3000,
        isClosable: true
      })
    } catch (error: unknown) {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error al desvincular'
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    } finally {
      setIsUnlinkingDiscord(false)
    }
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

  const avatarSrc = user.kick_data?.avatar_url || user.avatar_url || user.kick_avatar || undefined
  const displayName = user.nickname || user.kick_username || user.display_name || user.nombre

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
                          {user.discord_info?.linked ? user.discord_info.display_name : 'No vinculado'}
                        </Text>
                      </Box>
                    </HStack>
                    {user.discord_info?.linked ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        colorScheme="red"
                        onClick={handleDesvincularDiscord}
                        isLoading={isUnlinkingDiscord}
                      >
                        Desvincular
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="solid"
                        colorScheme="purple"
                        onClick={handleVincularDiscord}
                        leftIcon={<Icon as={FaDiscord} />}
                      >
                        Vincular
                      </Button>
                    )}
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
      </Layout>
    </RequireAuth>
  )
}
