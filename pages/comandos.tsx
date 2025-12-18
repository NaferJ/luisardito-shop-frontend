import { Layout } from '../components/Layout'
import {
  Container,
  Heading,
  VStack,
  Spinner,
  Center,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Card,
  CardBody,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Flex,
  Stack,
  Text,
  Badge,
  Tag,
  HStack,
  Box,
  Button,
  IconButton
} from '@chakra-ui/react'
import { useState, useEffect, useMemo } from 'react'
import { SearchIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import api from '../lib/api'
import Head from 'next/head'

interface BotCommand {
  id: number
  command: string
  aliases: string[]
  response_message: string
  description?: string
  command_type: 'simple' | 'dynamic'
  dynamic_handler?: string
  enabled: boolean
  requires_permission: boolean
  permission_level: 'viewer' | 'vip' | 'moderator' | 'broadcaster'
  cooldown_seconds: number
  usage_count: number
  last_used_at?: string
  created_at: string
  updated_at: string
}

interface ApiResponse<T> {
  ok: boolean
  data?: T
  message?: string
  error?: string
  pagination?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export default function ComandosPublicosPage() {
  const [commands, setCommands] = useState<BotCommand[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'simple' | 'dynamic'>('all')
  const [filterEnabled, setFilterEnabled] = useState<'all' | 'true' | 'false'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0
  })

  const hoverBg = useColorModeValue('gray.50', 'gray.700')
  const cardBg = useColorModeValue('white', 'gray.800')
  const cardBorder = useColorModeValue('gray.200', 'gray.600')
  const tableBg = useColorModeValue('white', 'gray.800')
  const statBg = useColorModeValue('gray.50', 'gray.700')
  const textColor = useColorModeValue('gray.800', 'white')
  const mutedColor = useColorModeValue('gray.600', 'gray.400')

  const fetchCommands = async () => {
    setIsLoading(true)
    try {
      const params: any = {
        page: currentPage,
        limit: 20,
        search: searchTerm || undefined,
        command_type: filterType !== 'all' ? filterType : undefined,
        enabled: filterEnabled !== 'all' ? filterEnabled === 'true' : undefined
      }

      const { data } = await api.get<ApiResponse<BotCommand[]>>('/api/kick-admin/bot-commands/public', { params })

      if (data.ok && data.data) {
        setCommands(data.data)
        setPagination(data.pagination || { total: 0, page: 1, limit: 20, totalPages: 0 })
      } else {
        setCommands([])
        setPagination({ total: 0, page: 1, limit: 20, totalPages: 0 })
      }
    } catch (error) {
      console.error('Error fetching commands:', error)
      setCommands([])
      setPagination({ total: 0, page: 1, limit: 20, totalPages: 0 })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCommands()
  }, [currentPage, searchTerm, filterType, filterEnabled])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <Layout>
      <Head>
        <title>Comandos Públicos - Luisardito Shop</title>
        <meta name="description" content="Lista de comandos públicos disponibles en el bot de Kick" />
      </Head>

      <Container maxW="7xl" py={8}>
        <VStack spacing={6} align="stretch">
          <VStack align="start" spacing={1}>
            <Heading size="lg" color={textColor}>
              Comandos Públicos
            </Heading>
            <Text color={mutedColor} fontSize="sm">
              Lista de comandos disponibles en el bot de Kick
            </Text>
          </VStack>

          <Card bg={cardBg} borderRadius="lg" borderWidth="1px" borderColor={cardBorder}>
            <CardBody p={4}>
              <Stack direction={{ base: 'column', md: 'row' }} spacing={3}>
                <InputGroup maxW={{ base: 'full', md: '300px' }}>
                  <InputLeftElement>
                    <SearchIcon color={mutedColor} />
                  </InputLeftElement>
                  <Input
                    placeholder="Buscar comandos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>

                <Select
                  maxW={{ base: 'full', md: '150px' }}
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as 'all' | 'simple' | 'dynamic')}
                >
                  <option value="all">Todos</option>
                  <option value="simple">Simples</option>
                  <option value="dynamic">Dinámicos</option>
                </Select>

                <Select
                  maxW={{ base: 'full', md: '150px' }}
                  value={filterEnabled}
                  onChange={(e) => setFilterEnabled(e.target.value as 'all' | 'true' | 'false')}
                >
                  <option value="all">Todos</option>
                  <option value="true">Activos</option>
                  <option value="false">Inactivos</option>
                </Select>
              </Stack>
            </CardBody>
          </Card>

          <Box
            bg={tableBg}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={cardBorder}
            overflow="hidden"
            overflowX="auto"
          >
            {isLoading ? (
              <Center py={10}>
                <VStack spacing={3}>
                  <Spinner size="xl" />
                  <Text color={mutedColor}>Cargando comandos...</Text>
                </VStack>
              </Center>
            ) : commands.length === 0 ? (
              <Center py={10}>
                <Text color={mutedColor}>No se encontraron comandos</Text>
              </Center>
            ) : (
              <TableContainer>
                <Table variant="simple" size="sm" style={{ tableLayout: 'fixed', width: '100%' }}>
                  <Thead bg={statBg}>
                    <Tr>
                      <Th py={3} width="120px">Comando</Th>
                      <Th py={3} width="280px">Respuesta</Th>
                      <Th py={3} width="200px">Descripción</Th>
                      <Th py={3} width="80px">Tipo</Th>
                      <Th py={3} width="80px" isNumeric>Usos</Th>
                      <Th py={3} width="90px" textAlign="center">Estado</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {commands.map((command) => (
                      <Tr key={command.id} _hover={{ bg: hoverBg }} transition="all 0.2s">
                        <Td py={3}>
                          <VStack align="start" spacing={1}>
                            <Text fontWeight="bold" fontSize="sm">
                              {command.command}
                            </Text>
                            {command.aliases && command.aliases.length > 0 && (
                              <HStack spacing={1} flexWrap="wrap">
                                {command.aliases.map((alias) => (
                                  <Tag key={alias} size="sm" variant="subtle" colorScheme="blue">
                                    {alias}
                                  </Tag>
                                ))}
                              </HStack>
                            )}
                          </VStack>
                        </Td>
                        <Td py={3}>
                          <Text
                            fontSize="xs"
                            noOfLines={2}
                            wordBreak="break-word"
                            overflow="hidden"
                            textOverflow="ellipsis"
                          >
                            {command.response_message}
                          </Text>
                        </Td>
                        <Td py={3}>
                          <Text
                            fontSize="xs"
                            color={mutedColor}
                            noOfLines={2}
                            wordBreak="break-word"
                            overflow="hidden"
                            textOverflow="ellipsis"
                          >
                            {command.description || 'Sin descripción'}
                          </Text>
                        </Td>
                        <Td py={3}>
                          <Badge colorScheme={command.command_type === 'simple' ? 'blue' : 'purple'} fontSize="xs">
                            {command.command_type}
                          </Badge>
                        </Td>
                        <Td py={3} isNumeric>
                          <Badge colorScheme="gray" fontSize="xs">
                            {command.usage_count.toLocaleString()}
                          </Badge>
                        </Td>
                        <Td py={3} textAlign="center">
                          <Badge colorScheme={command.enabled ? 'green' : 'gray'} fontSize="xs">
                            {command.enabled ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            )}
          </Box>

          {pagination.totalPages > 1 && (
            <Flex justify="center" align="center" gap={2}>
              <IconButton
                aria-label="Página anterior"
                icon={<ChevronLeftIcon />}
                isDisabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                size="sm"
              />
              <Text fontSize="sm" color={mutedColor}>
                Página {pagination.page} de {pagination.totalPages}
              </Text>
              <IconButton
                aria-label="Página siguiente"
                icon={<ChevronRightIcon />}
                isDisabled={currentPage === pagination.totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                size="sm"
              />
            </Flex>
          )}
        </VStack>
      </Container>
    </Layout>
  )
}
