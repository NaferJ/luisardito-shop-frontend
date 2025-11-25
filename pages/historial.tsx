import { Layout } from '../components/Layout'
import { RequireAuth } from '../components/RequireAuth'
import { useAuth } from '../hooks/useAuth'
import { useHistorialPuntos } from '../hooks/useHistorialPuntos'
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Badge,
  Spinner,
  Center,
  Heading,
  Icon,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Flex,
  useColorModeValue,
  Tag,
  TagLabel,
  TagLeftIcon,
  Wrap,
  WrapItem,
  Tooltip,
  IconButton
} from '@chakra-ui/react'
import { useState, useMemo } from 'react'
import {
  MdSwapHoriz,
  MdChat,
  MdPerson,
  MdStar,
  MdDiamond,
  MdStarRate,
  MdSearch,
  MdFilterList,
  MdSort,
  MdClear,
  MdTrendingUp,
  MdTrendingDown,
  MdTimeline,
  MdCalendarToday,
  MdAdd,
  MdRemove
} from 'react-icons/md'
import Head from 'next/head'

type SortOption = 'date-desc' | 'date-asc' | 'points-desc' | 'points-asc'
type FilterType = 'all' | 'positive' | 'negative' | 'vip' | 'migration' | 'gifts'

export default function HistorialPage() {
  const { user } = useAuth()
  const [includeAll, setIncludeAll] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [sortBy, setSortBy] = useState<SortOption>('date-desc')

  const { data: historial, isLoading, error } = useHistorialPuntos(user?.id, includeAll)

  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const mutedColor = useColorModeValue('gray.600', 'gray.400')
  const textColor = useColorModeValue('gray.800', 'gray.100')
  const statBg = useColorModeValue('gray.50', 'gray.750')
  const accentColor = useColorModeValue('blue.600', 'blue.400')
  const positiveColor = useColorModeValue('green.500', 'green.400')
  const negativeColor = useColorModeValue('red.500', 'red.400')

  // Filtrar y ordenar historial
  const filteredAndSortedHistorial = useMemo(() => {
    if (!historial) return []

    let result = [...historial]

    // Filtrar por búsqueda
    if (searchTerm) {
      result = result.filter((item) => {
        const concept = item.concepto || item.motivo || ''
        return concept.toLowerCase().includes(searchTerm.toLowerCase())
      })
    }

    // Filtrar por tipo
    if (filterType !== 'all') {
      result = result.filter((item) => {
        const concept = item.concepto || item.motivo || ''
        const eventData = item.kick_event_data

        switch (filterType) {
          case 'positive':
            return item.cambio > 0
          case 'negative':
            return item.cambio < 0
          case 'vip':
            return concept.includes('VIP') || eventData?.is_vip
          case 'migration':
            return eventData?.event_type === 'botrix_migration'
          case 'gifts':
            return eventData?.event_type === 'kicks.gifted'
          default:
            return true
        }
      })
    }

    // Ordenar
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        case 'date-asc':
          return new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
        case 'points-desc':
          return Math.abs(b.cambio) - Math.abs(a.cambio)
        case 'points-asc':
          return Math.abs(a.cambio) - Math.abs(b.cambio)
        default:
          return 0
      }
    })

    return result
  }, [historial, searchTerm, filterType, sortBy])

  // Estadísticas
  const stats = useMemo(() => {
    if (!historial) return { total: 0, ganados: 0, gastados: 0, balance: 0, promedioGanado: 0 }

    const ganados = historial.filter((h) => h.cambio > 0).reduce((sum, h) => sum + h.cambio, 0)
    const gastados = historial
      .filter((h) => h.cambio < 0)
      .reduce((sum, h) => sum + Math.abs(h.cambio), 0)
    const transaccionesPositivas = historial.filter((h) => h.cambio > 0).length

    return {
      total: historial.length,
      ganados,
      gastados,
      balance: ganados - gastados,
      promedioGanado: transaccionesPositivas > 0 ? Math.round(ganados / transaccionesPositivas) : 0
    }
  }, [historial])

  const getEventIcon = (movimiento: any) => {
    const concept = movimiento.concepto || movimiento.motivo
    const eventData = movimiento.kick_event_data

    if (eventData?.event_type === 'botrix_migration') return { icon: MdSwapHoriz, color: 'cyan' }
    if (eventData?.event_type === 'vip_granted') return { icon: MdStarRate, color: 'yellow' }
    if (eventData?.event_type === 'kicks.gifted') return { icon: MdDiamond, color: 'pink' }
    if (concept?.includes('VIP') || eventData?.is_vip) return { icon: MdStarRate, color: 'yellow' }
    if (concept?.includes('chat') || concept?.includes('mensaje'))
      return { icon: MdChat, color: 'blue' }
    if (concept?.includes('follow') || concept?.includes('seguir'))
      return { icon: MdPerson, color: 'green' }
    if (concept?.includes('suscr') || eventData?.user_type === 'subscriber')
      return { icon: MdStar, color: 'purple' }

    return { icon: MdSwapHoriz, color: 'gray' }
  }

  const getEventTitle = (movimiento: any) => {
    const concept = movimiento.concepto || movimiento.motivo
    const eventData = movimiento.kick_event_data

    if (eventData?.event_type === 'botrix_migration') return 'Migración desde Botrix'
    if (eventData?.event_type === 'vip_granted') {
      const duration = eventData.duration_days ? `${eventData.duration_days}d` : 'permanente'
      return `VIP otorgado (${duration})`
    }
    if (eventData?.event_type === 'kicks.gifted') {
      const kickAmount = eventData.kick_amount || 0
      return `Regalo de ${kickAmount} kicks`
    }

    return concept || 'Movimiento de puntos'
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
    setFilterType('all')
    setSortBy('date-desc')
  }

  const hasActiveFilters = searchTerm !== '' || filterType !== 'all' || sortBy !== 'date-desc'

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
        <title>Historial de Puntos - Luisardito Shop</title>
        <meta name="description" content="Historial completo de movimientos de puntos" />
      </Head>
      <Layout>
        <Container maxW="container.xl" py={{ base: 4, md: 6 }}>
          <VStack spacing={4} align="stretch">
            {/* Header */}
            <Flex justify="space-between" align="center" gap={3}>
              <HStack spacing={2}>
                <Icon as={MdTimeline} boxSize={6} color={accentColor} />
                <Heading size="lg" color={textColor}>
                  Historial de Puntos
                </Heading>
              </HStack>
              <HStack spacing={2}>
                <Tooltip
                  label={includeAll ? 'Mostrar solo tus puntos' : 'Incluir eventos de sistema'}
                >
                  <Button
                    size="sm"
                    variant={includeAll ? 'solid' : 'ghost'}
                    colorScheme="blue"
                    onClick={() => setIncludeAll(!includeAll)}
                  >
                    {includeAll ? 'Todos' : 'Solo míos'}
                  </Button>
                </Tooltip>
              </HStack>
            </Flex>

            {/* Stats compactas */}
            {historial && historial.length > 0 && (
              <Wrap spacing={2}>
                <WrapItem>
                  <Tag size="lg" variant="subtle" colorScheme="blue">
                    <TagLeftIcon as={MdTimeline} />
                    <TagLabel>
                      {stats.total} {stats.total === 1 ? 'movimiento' : 'movimientos'}
                    </TagLabel>
                  </Tag>
                </WrapItem>
                <WrapItem>
                  <Tag size="lg" variant="subtle" colorScheme="green">
                    <TagLeftIcon as={MdAdd} />
                    <TagLabel>{stats.ganados} ganados</TagLabel>
                  </Tag>
                </WrapItem>
                {stats.gastados > 0 && (
                  <WrapItem>
                    <Tag size="lg" variant="subtle" colorScheme="red">
                      <TagLeftIcon as={MdRemove} />
                      <TagLabel>{stats.gastados} gastados</TagLabel>
                    </Tag>
                  </WrapItem>
                )}
                <WrapItem>
                  <Tag size="lg" variant="outline" colorScheme="blue">
                    <TagLabel fontWeight="bold">Balance: {stats.balance}</TagLabel>
                  </Tag>
                </WrapItem>
                {stats.promedioGanado > 0 && (
                  <WrapItem>
                    <Tag size="lg" variant="outline" colorScheme="purple">
                      <TagLabel>Promedio: {stats.promedioGanado} pts</TagLabel>
                    </Tag>
                  </WrapItem>
                )}
              </Wrap>
            )}

            {/* Filtros */}
            {historial && historial.length > 0 && (
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

                <Select
                  size="sm"
                  maxW={{ base: 'full', sm: '140px' }}
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as FilterType)}
                  bg={cardBg}
                  borderColor={borderColor}
                  icon={<MdFilterList />}
                >
                  <option value="all">Todos</option>
                  <option value="positive">Ganados</option>
                  <option value="negative">Gastados</option>
                  <option value="vip">VIP</option>
                  <option value="migration">Migración</option>
                  <option value="gifts">Regalos</option>
                </Select>

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
                  <option value="points-desc">Mayor cantidad</option>
                  <option value="points-asc">Menor cantidad</option>
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
                    {filteredAndSortedHistorial.length} de {historial.length}
                  </Text>
                </Flex>
              </Flex>
            )}

            {/* Lista de historial */}
            {!historial || historial.length === 0 ? (
              <Center py={16}>
                <VStack spacing={3}>
                  <Icon as={MdTimeline} boxSize={16} color={mutedColor} />
                  <Text fontSize="lg" color={textColor} fontWeight="medium">
                    Sin movimientos registrados
                  </Text>
                  <Text fontSize="sm" color={mutedColor} textAlign="center">
                    {includeAll
                      ? 'No hay eventos en el sistema'
                      : 'Aún no tienes movimientos de puntos'}
                  </Text>
                </VStack>
              </Center>
            ) : filteredAndSortedHistorial.length === 0 ? (
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
                {filteredAndSortedHistorial.map((movimiento, index) => {
                  const eventIcon = getEventIcon(movimiento)
                  const eventTitle = getEventTitle(movimiento)
                  const isPositive = movimiento.cambio > 0

                  return (
                    <Box
                      key={index}
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
                        {/* Icono */}
                        <Flex
                          flexShrink={0}
                          w={{ base: 'full', sm: 'auto' }}
                          justify={{ base: 'flex-start', sm: 'center' }}
                          align="center"
                          gap={3}
                        >
                          <Box
                            bg={statBg}
                            p={2}
                            borderRadius="md"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <Icon
                              as={eventIcon.icon}
                              boxSize={6}
                              color={`${eventIcon.color}.500`}
                            />
                          </Box>

                          {/* Título en móvil */}
                          <VStack
                            align="start"
                            spacing={0}
                            display={{ base: 'flex', sm: 'none' }}
                            flex={1}
                          >
                            <Text
                              fontSize="sm"
                              fontWeight="semibold"
                              color={textColor}
                              noOfLines={1}
                            >
                              {eventTitle}
                            </Text>
                            <HStack spacing={1} fontSize="xs" color={mutedColor}>
                              <Icon as={MdCalendarToday} boxSize={3} />
                              <Text>{formatDate(movimiento.fecha)}</Text>
                            </HStack>
                          </VStack>
                        </Flex>

                        {/* Info principal - desktop */}
                        <VStack
                          align="stretch"
                          spacing={1}
                          flex={1}
                          minW={0}
                          display={{ base: 'none', sm: 'flex' }}
                        >
                          <Text fontSize="md" fontWeight="semibold" color={textColor} noOfLines={1}>
                            {eventTitle}
                          </Text>
                          <HStack spacing={1} fontSize="xs" color={mutedColor}>
                            <Icon as={MdCalendarToday} boxSize={3} />
                            <Text>{formatDate(movimiento.fecha)}</Text>
                          </HStack>
                        </VStack>

                        {/* Cambio de puntos y saldo */}
                        <HStack
                          spacing={3}
                          flexShrink={0}
                          alignSelf={{ base: 'flex-end', sm: 'center' }}
                          ml={{ base: 0, sm: 'auto' }}
                        >
                          <VStack spacing={0} align="end">
                            <HStack spacing={1}>
                              <Icon
                                as={isPositive ? MdTrendingUp : MdTrendingDown}
                                boxSize={4}
                                color={isPositive ? positiveColor : negativeColor}
                              />
                              <Text
                                fontSize="xl"
                                fontWeight="bold"
                                color={isPositive ? positiveColor : negativeColor}
                                lineHeight="1"
                              >
                                {isPositive ? '+' : ''}
                                {movimiento.cambio}
                              </Text>
                            </HStack>
                            <Text fontSize="xs" color={mutedColor}>
                              Saldo: {movimiento.saldo_actual}
                            </Text>
                          </VStack>

                          {/* Badges */}
                          {movimiento.kick_event_data?.is_vip && (
                            <Badge
                              colorScheme="yellow"
                              fontSize="xs"
                              px={2}
                              py={1}
                              borderRadius="md"
                            >
                              VIP
                            </Badge>
                          )}
                          {movimiento.kick_event_data?.user_type === 'subscriber' && (
                            <Badge
                              colorScheme="purple"
                              fontSize="xs"
                              px={2}
                              py={1}
                              borderRadius="md"
                            >
                              SUB
                            </Badge>
                          )}
                        </HStack>
                      </Flex>
                    </Box>
                  )
                })}
              </VStack>
            )}

            {/* Footer */}
            {historial && historial.length > 0 && filteredAndSortedHistorial.length > 0 && (
              <Text fontSize="xs" color={mutedColor} textAlign="center" pt={2}>
                Mostrando {filteredAndSortedHistorial.length} de {historial.length} movimientos
              </Text>
            )}
          </VStack>
        </Container>
      </Layout>
    </RequireAuth>
  )
}
