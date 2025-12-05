import { Layout } from '../components/Layout'
import { RequireAuth } from '../components/RequireAuth'
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Spinner,
  Center,
  Image,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Flex,
  Icon,
  useColorModeValue,
  Container,
  Heading,
  IconButton,
  Tooltip,
  Tag,
  TagLabel,
  TagLeftIcon,
  Wrap,
  WrapItem
} from '@chakra-ui/react'
import { useCanjes } from '../hooks/useCanjes'
import { useState, useMemo } from 'react'
import {
  MdSearch,
  MdFilterList,
  MdSort,
  MdCheckCircle,
  MdPending,
  MdCancel,
  MdRefresh,
  MdCalendarToday,
  MdInventory,
  MdClear,
  MdShoppingBag,
  MdTimeline
} from 'react-icons/md'
import Head from 'next/head'
import NextLink from 'next/link'

type SortOption = 'date-desc' | 'date-asc' | 'price-desc' | 'price-asc'

export default function CanjesPage() {
  const { data: canjes, isLoading, error } = useCanjes()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [sortBy, setSortBy] = useState<SortOption>('date-desc')

  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const mutedColor = useColorModeValue('gray.600', 'gray.400')
  const textColor = useColorModeValue('gray.800', 'gray.100')
  const statBg = useColorModeValue('gray.50', 'gray.750')
  const accentColor = useColorModeValue('blue.600', 'blue.400')

  // Filtrar y ordenar canjes
  const filteredAndSortedCanjes = useMemo(() => {
    if (!canjes) return []

    let result = [...canjes]

    // Filtrar por búsqueda
    if (searchTerm) {
      result = result.filter((canje) =>
        (canje as any).Producto?.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtrar por estado
    if (filterStatus !== 'all') {
      result = result.filter((canje) => canje.estado === filterStatus)
    }

    // Ordenar
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        case 'date-asc':
          return new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
        case 'price-desc':
          return ((b as any).precio_al_canje || (b as any).Producto?.precio || 0) - ((a as any).precio_al_canje || (a as any).Producto?.precio || 0)
        case 'price-asc':
          return ((a as any).precio_al_canje || (a as any).Producto?.precio || 0) - ((b as any).precio_al_canje || (b as any).Producto?.precio || 0)
        default:
          return 0
      }
    })

    return result
  }, [canjes, searchTerm, filterStatus, sortBy])

  // Estadísticas
  const stats = useMemo(() => {
    if (!canjes) return { total: 0, pendientes: 0, entregados: 0, cancelados: 0, totalPuntos: 0 }

    return {
      total: canjes.length,
      pendientes: canjes.filter((c) => c.estado === 'pendiente').length,
      entregados: canjes.filter((c) => c.estado === 'entregado').length,
      cancelados: canjes.filter((c) => c.estado === 'cancelado').length,
      totalPuntos: canjes.reduce((sum, c) => sum + ((c as any).precio_al_canje || (c as any).Producto?.precio || 0), 0)
    }
  }, [canjes])

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return 'yellow'
      case 'entregado':
        return 'green'
      case 'cancelado':
        return 'red'
      case 'devuelto':
        return 'purple'
      default:
        return 'gray'
    }
  }

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return MdPending
      case 'entregado':
        return MdCheckCircle
      case 'cancelado':
        return MdCancel
      case 'devuelto':
        return MdRefresh
      default:
        return MdPending
    }
  }

  const getStatusText = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return 'Pendiente'
      case 'entregado':
        return 'Entregado'
      case 'cancelado':
        return 'Cancelado'
      case 'devuelto':
        return 'Devuelto'
      default:
        return estado
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setFilterStatus('all')
    setSortBy('date-desc')
  }

  const hasActiveFilters = searchTerm !== '' || filterStatus !== 'all' || sortBy !== 'date-desc'

  if (isLoading) {
    return (
      <RequireAuth>
        <Layout>
          <Center minH="60vh">
            <VStack spacing={3}>
              <Spinner size="xl" color={accentColor} thickness="3px" />
              <Text color={mutedColor} fontSize="sm">
                Cargando historial
              </Text>
            </VStack>
          </Center>
        </Layout>
      </RequireAuth>
    )
  }

  if (error) {
    return (
      <RequireAuth>
        <Layout>
          <Center minH="60vh">
            <VStack spacing={4}>
              <Text fontSize="lg" color="red.500">
                Error al cargar el historial
              </Text>
              <Button colorScheme="blue" variant="outline" onClick={() => window.location.reload()}>
                Reintentar
              </Button>
            </VStack>
          </Center>
        </Layout>
      </RequireAuth>
    )
  }

  return (
    <RequireAuth>
      <Head>
        <title>Mis Canjes - Luisardito Shop</title>
        <meta name="description" content="Historial de canjes en Luisardito Shop" />
      </Head>
      <Layout>
        <Container maxW="container.xl" py={{ base: 4, md: 6 }}>
          <VStack spacing={4} align="stretch">
            {/* Header compacto */}
            <Flex justify="space-between" align="center" gap={3}>
              <HStack spacing={2}>
                <Icon as={MdTimeline} boxSize={6} color={accentColor} />
                <Heading size="lg" color={textColor}>
                  Historial de Canjes
                </Heading>
              </HStack>
              <Button as={NextLink} href="/" size="sm" variant="ghost" colorScheme="blue">
                Explorar productos
              </Button>
            </Flex>

            {/* Stats compactas */}
            {canjes && canjes.length > 0 && (
              <Wrap spacing={2}>
                <WrapItem>
                  <Tag size="lg" variant="subtle" colorScheme="blue">
                    <TagLeftIcon as={MdShoppingBag} />
                    <TagLabel>
                      {stats.total} {stats.total === 1 ? 'canje' : 'canjes'}
                    </TagLabel>
                  </Tag>
                </WrapItem>
                {stats.pendientes > 0 && (
                  <WrapItem>
                    <Tag size="lg" variant="subtle" colorScheme="yellow">
                      <TagLeftIcon as={MdPending} />
                      <TagLabel>
                        {stats.pendientes} pendiente{stats.pendientes !== 1 ? 's' : ''}
                      </TagLabel>
                    </Tag>
                  </WrapItem>
                )}
                {stats.entregados > 0 && (
                  <WrapItem>
                    <Tag size="lg" variant="subtle" colorScheme="green">
                      <TagLeftIcon as={MdCheckCircle} />
                      <TagLabel>
                        {stats.entregados} entregado{stats.entregados !== 1 ? 's' : ''}
                      </TagLabel>
                    </Tag>
                  </WrapItem>
                )}
                {stats.cancelados > 0 && (
                  <WrapItem>
                    <Tag size="lg" variant="subtle" colorScheme="red">
                      <TagLeftIcon as={MdCancel} />
                      <TagLabel>
                        {stats.cancelados} cancelado{stats.cancelados !== 1 ? 's' : ''}
                      </TagLabel>
                    </Tag>
                  </WrapItem>
                )}
                <WrapItem>
                  <Tag size="lg" variant="outline" colorScheme="blue">
                    <TagLabel fontWeight="bold">{stats.totalPuntos} pts gastados</TagLabel>
                  </Tag>
                </WrapItem>
              </Wrap>
            )}

            {/* Filtros compactos */}
            {canjes && canjes.length > 0 && (
              <Flex
                gap={2}
                flexWrap="wrap"
                bg={statBg}
                p={3}
                borderRadius="lg"
                border="1px solid"
                borderColor={borderColor}
                align="center"
              >
                {/* Búsqueda */}
                <InputGroup maxW={{ base: 'full', md: '250px' }} size="sm">
                  <InputLeftElement>
                    <Icon as={MdSearch} color={mutedColor} boxSize={4} />
                  </InputLeftElement>
                  <Input
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    bg={cardBg}
                    borderColor={borderColor}
                  />
                </InputGroup>

                {/* Filtro */}
                <Select
                  size="sm"
                  maxW={{ base: 'full', sm: '140px' }}
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  bg={cardBg}
                  borderColor={borderColor}
                  icon={<MdFilterList />}
                >
                  <option value="all">Todos</option>
                  <option value="pendiente">Pendientes</option>
                  <option value="entregado">Entregados</option>
                  <option value="cancelado">Cancelados</option>
                  <option value="devuelto">Devueltos</option>
                </Select>

                {/* Orden */}
                <Select
                  size="sm"
                  maxW={{ base: 'full', sm: '150px' }}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  bg={cardBg}
                  borderColor={borderColor}
                  icon={<MdSort />}
                >
                  <option value="date-desc">Más reciente</option>
                  <option value="date-asc">Más antiguo</option>
                  <option value="price-desc">Mayor precio</option>
                  <option value="price-asc">Menor precio</option>
                </Select>

                <Flex flex={1} justify="flex-end" gap={2} align="center">
                  {hasActiveFilters && (
                    <Tooltip label="Limpiar filtros">
                      <IconButton
                        size="sm"
                        icon={<Icon as={MdClear} />}
                        aria-label="Limpiar filtros"
                        variant="ghost"
                        onClick={clearFilters}
                      />
                    </Tooltip>
                  )}
                  <Text fontSize="xs" color={mutedColor} whiteSpace="nowrap">
                    {filteredAndSortedCanjes.length} de {canjes.length}
                  </Text>
                </Flex>
              </Flex>
            )}

            {/* Lista de canjes */}
            {!canjes || canjes.length === 0 ? (
              <Center py={16}>
                <VStack spacing={3}>
                  <Icon as={MdShoppingBag} boxSize={16} color={mutedColor} />
                  <Text fontSize="lg" color={textColor} fontWeight="medium">
                    Sin canjes realizados
                  </Text>
                  <Text fontSize="sm" color={mutedColor} textAlign="center">
                    Explora el catálogo y canjea productos con tus puntos
                  </Text>
                  <Button as={NextLink} href="/" colorScheme="blue" size="sm" mt={2}>
                    Ver productos
                  </Button>
                </VStack>
              </Center>
            ) : filteredAndSortedCanjes.length === 0 ? (
              <Center py={12}>
                <VStack spacing={3}>
                  <Icon as={MdSearch} boxSize={12} color={mutedColor} />
                  <Text fontSize="md" color={textColor}>
                    Sin resultados
                  </Text>
                  <Button size="sm" variant="ghost" onClick={clearFilters}>
                    Limpiar filtros
                  </Button>
                </VStack>
              </Center>
            ) : (
              <VStack spacing={2} align="stretch">
                {filteredAndSortedCanjes.map((canje) => (
                  <Box
                    key={canje.id}
                    bg={cardBg}
                    border="1px solid"
                    borderColor={borderColor}
                    borderRadius="lg"
                    overflow="hidden"
                    transition="all 0.2s"
                    _hover={{
                      borderColor: accentColor,
                      boxShadow: 'sm'
                    }}
                  >
                    <Flex
                      direction={{ base: 'column', sm: 'row' }}
                      gap={{ base: 3, sm: 4 }}
                      p={{ base: 3, sm: 4 }}
                      align={{ base: 'stretch', sm: 'center' }}
                    >
                      {/* Imagen compacta */}
                      <Box
                        flexShrink={0}
                        w={{ base: 'full', sm: '80px' }}
                        h={{ base: '160px', sm: '80px' }}
                        borderRadius="md"
                        overflow="hidden"
                        bg={statBg}
                      >
                        {(canje as any).Producto?.imagen_url || (canje as any).Producto?.imagen ? (
                          <Image
                            src={
                              (canje as any).Producto.imagen_url || (canje as any).Producto.imagen
                            }
                            alt={(canje as any).Producto.nombre}
                            w="full"
                            h="full"
                            objectFit="cover"
                          />
                        ) : (
                          <Center h="full">
                            <Icon as={MdInventory} boxSize={8} color={mutedColor} />
                          </Center>
                        )}
                      </Box>

                      {/* Info principal */}
                      <VStack align="stretch" spacing={1} flex={1} minW={0}>
                        <Text fontSize="md" fontWeight="semibold" color={textColor} noOfLines={1}>
                          {(canje as any).Producto?.nombre || 'Producto no disponible'}
                        </Text>

                        <HStack spacing={1} fontSize="xs" color={mutedColor}>
                          <Icon as={MdCalendarToday} boxSize={3} />
                          <Text>{formatDate(canje.fecha)}</Text>
                        </HStack>
                      </VStack>

                      {/* Precio y Estado */}
                      <HStack
                        spacing={3}
                        flexShrink={0}
                        alignSelf={{ base: 'flex-start', sm: 'center' }}
                      >
                        <VStack spacing={0} align="end">
                          <HStack spacing={1}>
                            <Text fontSize="xl" fontWeight="bold" color={accentColor} lineHeight="1">
                              {(canje as any).precio_al_canje || (canje as any).Producto?.precio || 0}
                            </Text>
                            {(canje as any).precio_al_canje && (canje as any).Producto?.precio !== (canje as any).precio_al_canje && (
                              <Tooltip
                                label={`Precio actual: ${(canje as any).Producto?.precio} pts`}
                                fontSize="xs"
                              >
                                <Box
                                  as="span"
                                  fontSize="xs"
                                  color="yellow.500"
                                  cursor="help"
                                  display="inline-flex"
                                  alignItems="center"
                                >
                                  ⓘ
                                </Box>
                              </Tooltip>
                            )}
                          </HStack>
                          <Text fontSize="xs" color={mutedColor}>
                            puntos pagados
                          </Text>
                        </VStack>
                        <Badge
                          colorScheme={getStatusColor(canje.estado)}
                          fontSize="xs"
                          display="inline-flex"
                          alignItems="center"
                          gap={1}
                          px={2}
                          py={1}
                          borderRadius="md"
                        >
                          <Icon as={getStatusIcon(canje.estado)} boxSize={3} />
                          {getStatusText(canje.estado)}
                        </Badge>
                      </HStack>
                    </Flex>
                  </Box>
                ))}
              </VStack>
            )}

            {/* Footer */}
            {canjes && canjes.length > 0 && filteredAndSortedCanjes.length > 0 && (
              <Text fontSize="xs" color={mutedColor} textAlign="center" pt={2}>
                Los canjes pendientes se procesan en 24-48 horas
              </Text>
            )}
          </VStack>
        </Container>
      </Layout>
    </RequireAuth>
  )
}
