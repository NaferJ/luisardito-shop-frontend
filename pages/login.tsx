import { useState, FormEvent } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Box, Button, FormControl, FormLabel, Input, VStack, Heading, Card, CardBody } from '@chakra-ui/react'
import { Layout } from '../components/Layout'

export default function LoginPage() {
  const { login } = useAuth()
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await login(nickname, password)
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <Layout>
      <Box maxW="md" mx="auto" mt={10}>
        <Card border="1px solid" borderColor="border.default">
          <CardBody>
            <Heading size="md" mb={6}>Iniciar sesión</Heading>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Nickname</FormLabel>
                  <Input value={nickname} onChange={e => setNickname(e.target.value)} required />
                </FormControl>
                <FormControl>
                  <FormLabel>Contraseña</FormLabel>
                  <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </FormControl>
                {error && <Box color="red.500">{error}</Box>}
                <Button type="submit" colorScheme="blue" w="full">Entrar</Button>
              </VStack>
            </form>
          </CardBody>
        </Card>
      </Box>
    </Layout>
  )
}
