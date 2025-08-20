import { Flex, Box, Spacer, Button, HStack, Menu, MenuButton, MenuList, MenuItem, Avatar, Text, Badge } from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { useAuth } from '../hooks/useAuth.tsx'
import { useRouter } from 'next/router'
import Link from 'next/link'

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()

  const kickAuthUrl = [
    'https://kick.com/oauth/authorize',
    `?client_id=${process.env.NEXT_PUBLIC_KICK_CLIENT_ID}`,
    `&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_REDIRECT_URI || '')}`,
    '&response_type=code',
    '&scope=read:user'
  ].join('')

  const handleLogout = () => {
    logout()
  }

  return (
    <Flex as="nav" bg="teal.500" color="white" p={4} align="center">
      {/* Logo */}
      <Link href="/" passHref>
        <Box fontWeight="bold" fontSize="xl" cursor="pointer" _hover={{ opacity: 0.8 }}>
          Luisardito Shop
        </Box>
      </Link>

      {/* Enlaces de navegación */}
      {isAuthenticated && (
        <HStack spacing={4} ml={8}>
          <Link href="/" passHref>
            <Button 
              variant="ghost" 
              color="white" 
              _hover={{ bg: 'teal.600' }}
              size="sm"
            >
              Tienda
            </Button>
          </Link>
          <Link href="/canjes" passHref>
            <Button 
              variant="ghost" 
              color="white" 
              _hover={{ bg: 'teal.600' }}
              size="sm"
            >
              Mis Canjes
            </Button>
          </Link>
        </HStack>
      )}

      <Spacer />

      {/* Menú de usuario autenticado */}
      {isAuthenticated && user ? (
        <HStack spacing={4}>
          {/* Badge de puntos */}
          <Badge colorScheme="yellow" fontSize="sm" px={2} py={1}>
            {user.puntos?.toLocaleString()} pts
          </Badge>

          {/* Menú de usuario */}
          <Menu>
            <MenuButton as={Button} variant="ghost" rightIcon={<ChevronDownIcon />} size="sm">
              <HStack spacing={2}>
                <Avatar size="sm" name={user.nombre} />
                <Text fontSize="sm">{user.nombre}</Text>
              </HStack>
            </MenuButton>
            <MenuList bg="white" color="gray.800" border="1px" borderColor="gray.200">
              <MenuItem onClick={() => router.push('/perfil')}>
                Mi Perfil
              </MenuItem>
              <MenuItem onClick={() => router.push('/historial')}>
                Historial de Puntos
              </MenuItem>
              <MenuItem onClick={() => router.push('/canjes')}>
                Mis Canjes
              </MenuItem>
              <MenuItem onClick={() => router.push('/')}>
                Catálogo
              </MenuItem>
              <MenuItem divider />
              <MenuItem 
                onClick={handleLogout}
                color="red.500"
                _hover={{ bg: 'red.50' }}
              >
                Cerrar Sesión
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      ) : (
        /* Botones para usuarios no autenticados */
        <HStack spacing={2}>
          <Link href="/login" passHref>
            <Button
              colorScheme="teal"
              variant="outline"
              size="sm"
              color="white"
              borderColor="white"
              _hover={{ bg: 'white', color: 'teal.500' }}
            >
              Iniciar Sesión
            </Button>
          </Link>
          <Link href="/register" passHref>
            <Button
              bg="white"
              color="teal.500"
              size="sm"
              _hover={{ bg: 'gray.100' }}
            >
              Registro
            </Button>
          </Link>
          {/* Botón OAuth con Kick (temporal hasta que implementes OAuth) */}
          <Button
            as="a"
            href={kickAuthUrl}
            colorScheme="yellow"
            variant="solid"
            size="sm"
            _hover={{ opacity: 0.8 }}
          >
            Conectar con Kick
          </Button>
        </HStack>
      )}
    </Flex>
  )
}
