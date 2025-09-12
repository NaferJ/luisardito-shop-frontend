import { Flex, Box, Spacer, Button, HStack, Menu, MenuButton, MenuList, MenuItem, Avatar, Text, Badge, Container, Divider } from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { useAuth } from '../hooks/useAuth.tsx'
import { useKickAuth } from '../hooks/useKickAuth'
import { useRouter } from 'next/router'
import Link from 'next/link'
import ColorModeToggle from './ColorModeToggle'

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const { connectWithKick } = useKickAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
  }

  return (
    <Box as="header" bg="bg.canvas" borderBottom="1px solid" borderColor="border.default" position="sticky" top={0} zIndex={10}>
      <Container maxW="6xl" px={4}>
        <Flex align="center" minH={14} gap={4}>
          {/* Logo */}
          <Link href="/" passHref>
            <Box fontWeight="bold" fontSize="lg" cursor="pointer" _hover={{ opacity: 0.8 }}>
              Luisardito Shop
            </Box>
          </Link>

          {/* Enlaces de navegación */}
          {isAuthenticated && (
            <HStack spacing={1} ml={4}>
              <Link href="/" passHref>
                <Button variant="ghost" size="sm">Tienda</Button>
              </Link>
              <Link href="/canjes" passHref>
                <Button variant="ghost" size="sm">Mis Canjes</Button>
              </Link>
            </HStack>
          )}

          <Spacer />

          {/* Toggle de modo */}
          <ColorModeToggle />

          {/* Menú de usuario autenticado */}
          {isAuthenticated && user ? (
            <HStack spacing={3}>
              {/* Badge de puntos */}
              <Badge colorScheme="yellow" fontSize="sm" px={2} py={1}>
                {user.puntos?.toLocaleString()} pts
              </Badge>

              {/* Menú de usuario */}
              <Menu>
                <MenuButton as={Button} variant="ghost" rightIcon={<ChevronDownIcon />} size="sm">
                  <HStack spacing={2}>
                    <Avatar size="sm" name={(user as any).nickname} />
                    <Text fontSize="sm">{(user as any).nickname}</Text>
                  </HStack>
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => router.push('/perfil')}>Mi Perfil</MenuItem>
                  <MenuItem onClick={() => router.push('/historial')}>Historial de Puntos</MenuItem>
                  <MenuItem onClick={() => router.push('/canjes')}>Mis Canjes</MenuItem>
                  <MenuItem onClick={() => router.push('/')}>Catálogo</MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout} color="red.500">Cerrar Sesión</MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          ) : (
            /* Botones para usuarios no autenticados */
            <HStack spacing={2}>
              <Link href="/login" passHref>
                <Button variant="outline" size="sm">Iniciar Sesión</Button>
              </Link>
              <Link href="/register" passHref>
                <Button colorScheme="blue" size="sm">Registro</Button>
              </Link>
              {/* Botón OAuth con Kick */}
              <Button onClick={connectWithKick} colorScheme="yellow" variant="solid" size="sm">
                Conectar con Kick
              </Button>
            </HStack>
          )}
        </Flex>
      </Container>
    </Box>
  )
}
