import { Layout } from '../../components/Layout'
import { ActionsMenu } from '../../components/ActionsMenu'
import { TransparentCard } from '../../components/TransparentCard'
import { BroadcasterPanel } from '../../components/BroadcasterPanel'
import {
  SimpleGrid,
  Center,
  Box,
  HStack,
  Text,
  useColorModeValue,
  Image,
  IconButton,
  Badge,
  Flex,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
  Icon
} from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import { useState, useEffect, useMemo } from 'react'
import { useProductos } from '../../hooks/useProductos'
import { ProductCard, ProductCardSkeleton } from '../../components/ProductCard'
import { useAuth } from '../../hooks/useAuth'
import { useRouter } from 'next/router'
import { usePublicKickPointsConfig } from '../../hooks/usePublicKickPointsConfig'
import Head from 'next/head'
import {
  SettingsIcon,
  AddIcon,
  ViewIcon,
  EditIcon,
  RepeatIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChatIcon,
  StarIcon,
  TriangleUpIcon,
  TriangleDownIcon,
  WarningTwoIcon
} from '@chakra-ui/icons'
import { FiPackage, FiSearch, FiRefreshCw } from 'react-icons/fi'
import { MdPeople } from 'react-icons/md'
// Animaciones
const fadeInUp = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`
const SKELETON_COUNT = 8
/** Botón de filtro/ordenamiento individual */
function SortButton({ icon, label, isActive, filterActiveBg, filterActiveColor, filterActiveBorder, filterBorder, textColor, hoverBg, onSort }: Readonly<{
  icon: any; label: string; isActive: boolean
  filterActiveBg: string; filterActiveColor: string; filterActiveBorder: string
  filterBorder: string; textColor: string; hoverBg: string
  onSort: () => void
}>) {
  return (
    <Button
      leftIcon={<Icon as={icon} boxSize={3.5} />}
      onClick={onSort}
      size="sm"
      h="36px"
      px={4}
      fontSize="xs"
      fontWeight={isActive ? '700' : '500'}
      bg={isActive ? filterActiveBg : 'transparent'}
      color={isActive ? filterActiveColor : textColor}
      border="1.5px solid"
      borderColor={isActive ? filterActiveBorder : 'transparent'}
      borderRadius="full"
      _hover={{
        bg: isActive ? filterActiveBg : hoverBg,
        borderColor: isActive ? filterActiveBorder : filterBorder,
      }}
      transition="all 0.2s"
    >
      <Text display={{ base: 'none', md: 'block' }}>{label}</Text>
    </Button>
  )
}

export default function Tienda() {
  const { data: productos, isLoading, error, refetch } = useProductos()
  const { user } = useAuth()
  const router = useRouter()
  const { configs } = usePublicKickPointsConfig()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [sortBy, setSortBy] = useState<'precio_asc' | 'precio_desc' | 'stock_desc' | 'canjes_desc'>('precio_desc')
  const [searchTerm, setSearchTerm] = useState('')
  const isAdmin = !!(user?.rol_id && [3, 4, 5].includes(user.rol_id))
  // ── Tokens de color (todos los hooks antes de retornos condicionales) ──
  const textColor = useColorModeValue('gray.600', 'gray.400')
  const textStrong = useColorModeValue('gray.800', 'gray.100')
  const accentColor = useColorModeValue('blue.600', 'blue.300')
  const filterBg = useColorModeValue('white', 'gray.800')
  const filterBorder = useColorModeValue('gray.200', 'gray.700')
  const filterActiveBg = useColorModeValue('blue.50', 'blue.900')
  const filterActiveColor = useColorModeValue('blue.700', 'blue.200')
  const filterActiveBorder = useColorModeValue('blue.200', 'blue.700')
  const inputBg = useColorModeValue('gray.50', 'gray.800')
  const emptyIconColor = useColorModeValue('gray.300', 'gray.600')
  const errorBg = useColorModeValue('red.50', 'rgba(254, 178, 178, 0.06)')
  const errorBorder = useColorModeValue('red.200', 'red.800')
  const sortHoverBg = useColorModeValue('gray.50', 'whiteAlpha.50')
  const bannerItems = [
    {
      title: 'Duplicación de Donaciones',
      description: `Por cada 1,000 KICKS donados al canal, recibirás ${(configs?.find((c) => c.config_key === 'kicks_gifted_multiplier')?.config_value || 2) * 1000} puntos en tu cuenta.`,
      color: 'blue'
    },
    {
      title: 'Tiempo de Envío',
      description: 'Los pedidos pueden tardar hasta 1 mes en procesarse y enviarse.',
      color: 'purple'
    },
    {
      title: 'Migración VIP',
      description: 'Si ya canjeaste VIP anteriormente, contacta a un moderador para migrar tu estatus.',
      color: 'cyan'
    },
    {
      title: 'Gana Puntos',
      description: `Participa en el chat: ${configs?.find((c) => c.config_key === 'chat_points_regular')?.config_value || 0} puntos normales, ${configs?.find((c) => c.config_key === 'chat_points_vip')?.config_value || 0} VIP, ${configs?.find((c) => c.config_key === 'chat_points_subscriber')?.config_value || 0} suscriptores.`,
      color: 'green'
    }
  ]
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerItems.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [bannerItems.length])
  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % bannerItems.length)
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + bannerItems.length) % bannerItems.length)
  const sortedProductos = useMemo(() => {
    if (!productos) return []
    const sorted = [...productos]
    switch (sortBy) {
      case 'precio_asc': sorted.sort((a, b) => a.precio - b.precio); break
      case 'precio_desc': sorted.sort((a, b) => b.precio - a.precio); break
      case 'stock_desc': sorted.sort((a, b) => b.stock - a.stock); break
      case 'canjes_desc': sorted.sort((a, b) => (b.canjes_count || 0) - (a.canjes_count || 0)); break
    }
    return sorted
  }, [productos, sortBy])
  const filteredProductos = useMemo(() => {
    return sortedProductos.filter((producto) =>
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [sortedProductos, searchTerm])
  return (
    <>
      <Head>
        <title>Tienda - Luisardito Shop</title>
        <meta name="description" content="Explora nuestro catálogo de productos y canjea tus puntos por increíbles recompensas" />
      </Head>
      <Layout>
        <Box position="relative" zIndex={1} mt={9}>
          {/* ═══════════════ BANNER ADMIN ═══════════════ */}
          {isAdmin && (
            <TransparentCard mb={6} mt={{ base: 0, md: 4 }} px={6} py={4} position="relative" overflow="hidden">
              <Flex justify="space-between" align="center" direction={{ base: 'column', md: 'row' }} gap={3}>
                <HStack spacing={3}>
                  <Badge colorScheme="blue" fontSize="xs" px={2} py={1} borderRadius="md" fontWeight="600" letterSpacing="wider">
                    ADMIN
                  </Badge>
                  <Text fontSize="sm" color={textColor}>
                    Gestiona productos, usuarios, canjes y promociones
                  </Text>
                </HStack>
                <ActionsMenu
                  buttonIcon={<SettingsIcon />}
                  buttonLabel="Panel"
                  buttonSize="sm"
                  items={[
                    { label: 'Nuevo Producto', icon: AddIcon, onClick: () => router.push('/admin/productos/nuevo'), colorScheme: 'green' as const },
                    { label: 'Productos', icon: ViewIcon, onClick: () => router.push('/admin/productos') },
                    { label: 'Usuarios', icon: EditIcon, onClick: () => router.push('/admin/usuarios') },
                    { label: 'Comandos', icon: ChatIcon, onClick: () => router.push('/admin/comandos') },
                    { label: 'Canjes', icon: RepeatIcon, onClick: () => router.push('/admin/canjes') },
                    { label: 'Promociones', icon: StarIcon, onClick: () => router.push('/admin/promociones') }
                  ]}
                />
              </Flex>
            </TransparentCard>
          )}
          {/* ═══════════════ BANNER INFORMATIVO ═══════════════ */}
          <TransparentCard mb={8} mt={4} position="relative" overflow="hidden" p={0}>
            <Image
              src="/images/banner.png"
              alt="Banner"
              position="absolute"
              top={0} left={0} w="full" h="full"
              objectFit="cover"
              opacity={0.25}
              filter="brightness(1.4)"
            />
            <Flex align="center" justify="space-between" gap={2} px={4} py={3} position="relative">
              <IconButton
                aria-label="Anterior"
                icon={<ChevronLeftIcon />}
                onClick={prevSlide}
                variant="ghost"
                size="sm"
                borderRadius="full"
                bg={useColorModeValue('rgba(255,255,255,0.6)', 'rgba(0,0,0,0.4)')}
                backdropFilter="blur(10px)"
                _hover={{ bg: useColorModeValue('rgba(255,255,255,0.8)', 'rgba(0,0,0,0.6)'), transform: 'translateX(-2px)' }}
                transition="all 0.2s"
              />
              <Box flex={1} position="relative" minH="60px">
                {bannerItems.map((item, index) => (
                  <Flex
                    key={item.title}
                    align="center" justify="center" direction="column" gap={1}
                    position="absolute" w="full"
                    opacity={index === currentIndex ? 1 : 0}
                    transform={index === currentIndex ? 'scale(1)' : 'scale(0.95)'}
                    transition="all 0.5s ease"
                    pointerEvents={index === currentIndex ? 'auto' : 'none'}
                  >
                    <Badge colorScheme={item.color} px={2} py={1} borderRadius="md" fontSize="xs" fontWeight="600" letterSpacing="wide">
                      {item.title.toUpperCase()}
                    </Badge>
                    <Text fontSize="sm" color={textStrong} textAlign="center" noOfLines={2}>
                      {item.description}
                    </Text>
                  </Flex>
                ))}
              </Box>
              <IconButton
                aria-label="Siguiente"
                icon={<ChevronRightIcon />}
                onClick={nextSlide}
                variant="ghost"
                size="sm"
                borderRadius="full"
                bg={useColorModeValue('rgba(255,255,255,0.6)', 'rgba(0,0,0,0.4)')}
                backdropFilter="blur(10px)"
                _hover={{ bg: useColorModeValue('rgba(255,255,255,0.8)', 'rgba(0,0,0,0.6)'), transform: 'translateX(2px)' }}
                transition="all 0.2s"
              />
            </Flex>
            <HStack spacing={1} justify="center" pb={2}>
              {bannerItems.map((item, index) => (
                <Box
                  key={item.title}
                  w={index === currentIndex ? '20px' : '6px'}
                  h="6px"
                  borderRadius="full"
                  bg={index === currentIndex ? accentColor : useColorModeValue('gray.400', 'gray.600')}
                  cursor="pointer"
                  onClick={() => setCurrentIndex(index)}
                  transition="all 0.3s"
                  boxShadow={index === currentIndex ? `0 0 8px ${accentColor}` : 'none'}
                  opacity={index === currentIndex ? 1 : 0.6}
                  _hover={{ opacity: 1, transform: 'scale(1.2)' }}
                />
              ))}
            </HStack>
          </TransparentCard>
          {/* Panel del broadcaster */}
          <BroadcasterPanel />
          {/* ═══════════════ TÍTULO ═══════════════ */}
          <Box mb={2} textAlign="center">
            <Text
              fontSize={{ base: '2xl', md: '3xl' }}
              fontWeight="bold"
              bgGradient="linear(to-r, blue.400, purple.400, pink.400)"
              bgClip="text"
              mb={2}
            >
              Catálogo de Productos
            </Text>
          </Box>
          {/* ═══════════════ BARRA DE FILTROS MEJORADA ═══════════════ */}
          <Box mb={8}>
            <Text fontSize="sm" color={textColor} textAlign="center" mb={4}>
              Descubre increíbles recompensas y canjea tus puntos
            </Text>
            <Flex
              bg={filterBg}
              border="1px solid"
              borderColor={filterBorder}
              borderRadius="2xl"
              p={3}
              direction={{ base: 'column', md: 'row' }}
              align={{ base: 'stretch', md: 'center' }}
              gap={3}
              boxShadow={useColorModeValue(
                '0 1px 3px rgba(0,0,0,0.04)',
                '0 1px 3px rgba(0,0,0,0.3)'
              )}
            >
              {/* Buscador */}
              <InputGroup size="sm" maxW={{ base: 'full', md: '220px' }}>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiSearch} color={textColor} boxSize={3.5} />
                </InputLeftElement>
                <Input
                  placeholder="Buscar productos..."
                  bg={inputBg}
                  border="1.5px solid"
                  borderColor={filterBorder}
                  borderRadius="full"
                  fontSize="xs"
                  h="36px"
                  _focus={{
                    borderColor: accentColor,
                    boxShadow: `0 0 0 1px ${accentColor}`,
                    bg: useColorModeValue('white', 'gray.900'),
                  }}
                  _placeholder={{ color: textColor, fontSize: 'xs' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
              {/* Separador visual */}
              <Box
                display={{ base: 'none', md: 'block' }}
                w="1px"
                h="24px"
                bg={filterBorder}
                flexShrink={0}
              />
              {/* Botones de ordenamiento */}
              <HStack
                spacing={1}
                flex={1}
                justify={{ base: 'center', md: 'flex-start' }}
                overflowX="auto"
                sx={{
                  '&::-webkit-scrollbar': { display: 'none' },
                  scrollbarWidth: 'none',
                }}
              >
                <SortButton icon={TriangleUpIcon} label="Mayor precio" isActive={sortBy === 'precio_desc'} filterActiveBg={filterActiveBg} filterActiveColor={filterActiveColor} filterActiveBorder={filterActiveBorder} filterBorder={filterBorder} textColor={textColor} hoverBg={sortHoverBg} onSort={() => setSortBy('precio_desc')} />
                <SortButton icon={TriangleDownIcon} label="Menor precio" isActive={sortBy === 'precio_asc'} filterActiveBg={filterActiveBg} filterActiveColor={filterActiveColor} filterActiveBorder={filterActiveBorder} filterBorder={filterBorder} textColor={textColor} hoverBg={sortHoverBg} onSort={() => setSortBy('precio_asc')} />
                <SortButton icon={FiPackage} label="Más stock" isActive={sortBy === 'stock_desc'} filterActiveBg={filterActiveBg} filterActiveColor={filterActiveColor} filterActiveBorder={filterActiveBorder} filterBorder={filterBorder} textColor={textColor} hoverBg={sortHoverBg} onSort={() => setSortBy('stock_desc')} />
                <SortButton icon={MdPeople} label="Más canjeados" isActive={sortBy === 'canjes_desc'} filterActiveBg={filterActiveBg} filterActiveColor={filterActiveColor} filterActiveBorder={filterActiveBorder} filterBorder={filterBorder} textColor={textColor} hoverBg={sortHoverBg} onSort={() => setSortBy('canjes_desc')} />
              </HStack>
              {/* Contador de resultados */}
              {!isLoading && productos && (
                <Badge
                  variant="subtle"
                  colorScheme="gray"
                  borderRadius="full"
                  px={3}
                  py={1}
                  fontSize="2xs"
                  fontWeight="600"
                  flexShrink={0}
                  alignSelf="center"
                >
                  {filteredProductos.length} producto{filteredProductos.length === 1 ? '' : 's'}
                </Badge>
              )}
            </Flex>
          </Box>
          {/* ═══════════════ ESTADO: CARGANDO (SKELETONS) ═══════════════ */}
          {isLoading && (
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6} mb={8}>
              {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <Box
                  key={i}
                  opacity={0}
                  animation={`${fadeInUp} 0.4s ease-out forwards`}
                  sx={{ animationDelay: `${i * 0.05}s` }}
                >
                  <ProductCardSkeleton />
                </Box>
              ))}
            </SimpleGrid>
          )}
          {/* ═══════════════ ESTADO: ERROR ═══════════════ */}
          {!isLoading && error && (
            <Center py={16}>
              <VStack
                spacing={4}
                p={8}
                bg={errorBg}
                border="1px solid"
                borderColor={errorBorder}
                borderRadius="2xl"
                maxW="400px"
                textAlign="center"
              >
                <Icon as={WarningTwoIcon} boxSize={10} color="red.400" />
                <VStack spacing={1}>
                  <Text fontWeight="700" fontSize="lg" color={textStrong}>
                    Error al cargar productos
                  </Text>
                  <Text fontSize="sm" color={textColor}>
                    No pudimos conectar con el servidor. Verifica tu conexión e intenta de nuevo.
                  </Text>
                </VStack>
                <Button
                  leftIcon={<Icon as={FiRefreshCw} />}
                  colorScheme="red"
                  variant="outline"
                  size="sm"
                  borderRadius="full"
                  onClick={() => refetch()}
                >
                  Reintentar
                </Button>
              </VStack>
            </Center>
          )}
          {/* ═══════════════ ESTADO: PRODUCTOS CARGADOS ═══════════════ */}
          {!isLoading && !error && (
            <>
              {/* Grid de productos */}
              <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6} mb={8}>
                {filteredProductos.map((producto, index) => (
                  <Box
                    key={producto.id}
                    opacity={0}
                    animation={`${fadeInUp} 0.5s ease-out forwards`}
                    sx={{ animationDelay: `${index * 0.06}s` }}
                  >
                    <ProductCard producto={producto} isAdmin={isAdmin} />
                  </Box>
                ))}
              </SimpleGrid>
              {/* Estado vacío: búsqueda sin resultados */}
              {filteredProductos.length === 0 && searchTerm && (
                <Center py={16}>
                  <VStack spacing={4} maxW="360px" textAlign="center">
                    <Icon as={FiSearch} boxSize={12} color={emptyIconColor} strokeWidth={1.5} />
                    <VStack spacing={1}>
                      <Text fontWeight="700" fontSize="lg" color={textStrong}>
                        Sin resultados
                      </Text>
                      <Text fontSize="sm" color={textColor}>
                        No hay productos que coincidan con &ldquo;<Text as="span" fontWeight="600" color={accentColor}>{searchTerm}</Text>&rdquo;
                      </Text>
                    </VStack>
                    <Button
                      size="sm"
                      variant="outline"
                      borderRadius="full"
                      onClick={() => setSearchTerm('')}
                    >
                      Limpiar búsqueda
                    </Button>
                  </VStack>
                </Center>
              )}
              {/* Estado vacío: no hay productos en absoluto */}
              {filteredProductos.length === 0 && !searchTerm && (
                <Center py={16}>
                  <VStack spacing={4} maxW="360px" textAlign="center">
                    <Icon as={FiPackage} boxSize={12} color={emptyIconColor} strokeWidth={1.5} />
                    <VStack spacing={1}>
                      <Text fontWeight="700" fontSize="lg" color={textStrong}>
                        Aún no hay productos
                      </Text>
                      <Text fontSize="sm" color={textColor}>
                        El catálogo está vacío por ahora. ¡Vuelve pronto!
                      </Text>
                    </VStack>
                  </VStack>
                </Center>
              )}
            </>
          )}
        </Box>
      </Layout>
    </>
  )
}
