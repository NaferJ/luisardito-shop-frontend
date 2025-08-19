import { Flex, Box, Spacer, Button } from '@chakra-ui/react'

export function Navbar() {
  const kickAuthUrl = [
    'https://kick.com/oauth/authorize',
    `?client_id=${process.env.NEXT_PUBLIC_KICK_CLIENT_ID}`,
    `&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_REDIRECT_URI || '')}`,
    '&response_type=code',
    '&scope=read:user'
  ].join('')

  return (
    <Flex bg="purple.600" color="white" p={4} align="center">
      <Box fontSize="xl" fontWeight="bold">
        Luisardito Shop
      </Box>
      <Spacer />
      <Button as="a" href={kickAuthUrl} colorScheme="green">
        Conectar con Kick
      </Button>
    </Flex>
  )
}
