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
    Divider,
    Image,
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Tooltip,
    Icon,
    SimpleGrid,
    useBreakpointValue,
    Container,
    Heading,
} from '@chakra-ui/react'
import { useCanjes } from '../hooks/useCanjes'
import { useState, useEffect } from 'react'
import { MdViewList, MdViewModule, MdViewComfy } from 'react-icons/md'

type ViewMode = 'list' | 'grid' | 'compact'

export default function CanjesPage() {
    const { data: canjes, isLoading, error } = useCanjes()

    // Cargar vista desde localStorage
    const [viewMode, setViewMode] = useState<ViewMode>(() => {
        if (typeof window === 'undefined') return 'list'
        const saved = localStorage.getItem('canjes-view-mode')
        return (saved as ViewMode) || 'list'
    })

    const isMobile = useBreakpointValue({ base: true, md: false })

    // Guardar vista en localStorage cuando cambie
    useEffect(() => {
        localStorage.setItem('canjes-view-mode', viewMode)
    }, [viewMode])

    if (isLoading) {
        return (
            <RequireAuth>
                <Layout>
                    <Center mt={10}><Spinner size="xl" /></Center>
                </Layout>
            </RequireAuth>
        )
    }

    if (error) {
        return (
            <RequireAuth>
                <Layout>
                    <Center mt={10}>Error al cargar tus canjes</Center>
                </Layout>
            </RequireAuth>
        )
    }

    const getStatusColor = (estado: string) => {
        switch (estado) {
            case 'pendiente': return 'yellow'
            case 'entregado': return 'green'
            case 'cancelado': return 'red'
            case 'devuelto': return 'purple'
            default: return 'gray'
        }
    }

    const getStatusText = (estado: string) => {
        switch (estado) {
            case 'pendiente': return 'Pendiente'
            case 'entregado': return 'Entregado'
            case 'cancelado': return 'Cancelado'
            case 'devuelto': return 'Devuelto'
            default: return estado
        }
    }

    const getStatusMessage = (estado: string) => {
        switch (estado) {
            case 'pendiente':
                return { text: 'Tu canje está siendo procesado', color: 'orange.600' }
            case 'entregado':
                return { text: '¡Canje completado con éxito!', color: 'green.600' }
            case 'cancelado':
                return { text: 'Este canje fue cancelado', color: 'red.600' }
            case 'devuelto':
                return { text: 'Puntos devueltos a tu cuenta', color: 'purple.600' }
            default:
                return null
        }
    }

    const renderListView = () => (
        <VStack spacing={4} align="stretch">
            {canjes?.map((canje) => {
                const statusMsg = getStatusMessage(canje.estado)

                return (
                    <Box
                        key={canje.id}
                        borderWidth="1px"
                        borderColor="border.default"
                        borderRadius="lg"
                        p={{ base: 3, md: 4 }}
                        bg="bg.canvas"
                        shadow="sm"
                        _hover={{ shadow: 'md' }}
                        transition="all 0.2s"
                    >
                        <HStack spacing={{ base: 3, md: 4 }} align="start" flexDir={{ base: 'column', sm: 'row' }}>
                            {/* Imagen del producto */}
                            {(canje as any).Producto?.imagen_url && (
                                <Image
                                    src={(canje as any).Producto.imagen_url}
                                    alt={(canje as any).Producto.nombre}
                                    boxSize={{ base: '100%', sm: '80px' }}
                                    maxW={{ base: '200px', sm: '80px' }}
                                    objectFit="cover"
                                    borderRadius="md"
                                    alignSelf={{ base: 'center', sm: 'flex-start' }}
                                />
                            )}

                            {/* Información del canje */}
                            <VStack align="start" spacing={2} flex="1" w="full">
                                <HStack justify="space-between" w="full" flexWrap="wrap" gap={2}>
                                    <Text fontWeight="bold" fontSize={{ base: 'md', md: 'lg' }}>
                                        {(canje as any).Producto?.nombre || 'Producto no encontrado'}
                                    </Text>
                                    <Badge colorScheme={getStatusColor(canje.estado)} fontSize={{ base: 'xs', md: 'sm' }}>
                                        {getStatusText(canje.estado)}
                                    </Badge>
                                </HStack>

                                <Text color="text.muted" fontSize={{ base: 'sm', md: 'md' }} noOfLines={{ base: 2, md: 3 }}>
                                    {(canje as any).Producto?.descripcion}
                                </Text>

                                <VStack spacing={2} align="start" w="full">
                                    <HStack spacing={4} flexWrap="wrap">
                                        <Text fontSize="sm" color="accent.fg" fontWeight="semibold">
                                            {(canje as any).Producto?.precio} puntos
                                        </Text>
                                        <Text fontSize={{ base: 'xs', md: 'sm' }} color="text.muted">
                                            {new Date(canje.fecha).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: isMobile ? 'short' : 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </Text>
                                    </HStack>

                                    {statusMsg && (
                                        <Text fontSize={{ base: 'xs', md: 'sm' }} color={statusMsg.color} fontStyle="italic">
                                            {statusMsg.text}
                                        </Text>
                                    )}
                                </VStack>
                            </VStack>
                        </HStack>
                    </Box>
                )
            })}
        </VStack>
    )

    const renderGridView = () => (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {canjes?.map((canje) => {
                const statusMsg = getStatusMessage(canje.estado)

                return (
                    <Box
                        key={canje.id}
                        borderWidth="1px"
                        borderColor="border.default"
                        borderRadius="lg"
                        overflow="hidden"
                        bg="bg.canvas"
                        shadow="sm"
                        _hover={{ shadow: 'lg' }}
                        transition="all 0.2s"
                        h="full"
                        display="flex"
                        flexDir="column"
                    >
                        {/* Imagen del producto */}
                        {(canje as any).Producto?.imagen_url && (
                            <Image
                                src={(canje as any).Producto.imagen_url}
                                alt={(canje as any).Producto.nombre}
                                w="100%"
                                h="200px"
                                objectFit="cover"
                            />
                        )}

                        <VStack align="start" spacing={3} p={4} flex="1">
                            <VStack align="start" spacing={1} w="full">
                                <HStack justify="space-between" w="full">
                                    <Badge colorScheme={getStatusColor(canje.estado)} fontSize="xs">
                                        {getStatusText(canje.estado)}
                                    </Badge>
                                    <Text fontSize="sm" color="accent.fg" fontWeight="bold">
                                        {(canje as any).Producto?.precio} pts
                                    </Text>
                                </HStack>

                                <Text fontWeight="bold" fontSize="md" noOfLines={2}>
                                    {(canje as any).Producto?.nombre || 'Producto no encontrado'}
                                </Text>
                            </VStack>

                            <Text color="text.muted" fontSize="sm" noOfLines={3} flex="1">
                                {(canje as any).Producto?.descripcion}
                            </Text>

                            <VStack spacing={1} align="start" w="full" mt="auto">
                                <Text fontSize="xs" color="text.muted">
                                    {new Date(canje.fecha).toLocaleDateString('es-ES', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </Text>
                                {statusMsg && (
                                    <Text fontSize="xs" color={statusMsg.color} fontStyle="italic" noOfLines={1}>
                                        {statusMsg.text}
                                    </Text>
                                )}
                            </VStack>
                        </VStack>
                    </Box>
                )
            })}
        </SimpleGrid>
    )

    const renderCompactView = () => (
        <VStack spacing={2} align="stretch">
            {canjes?.map((canje) => (
                <Box
                    key={canje.id}
                    borderWidth="1px"
                    borderColor="border.default"
                    borderRadius="md"
                    p={3}
                    bg="bg.canvas"
                    _hover={{ bg: 'gray.50', shadow: 'sm' }}
                    transition="all 0.2s"
                >
                    <HStack spacing={3} align="center">
                        {/* Imagen pequeña */}
                        {(canje as any).Producto?.imagen_url && (
                            <Image
                                src={(canje as any).Producto.imagen_url}
                                alt={(canje as any).Producto.nombre}
                                boxSize="50px"
                                objectFit="cover"
                                borderRadius="md"
                                flexShrink={0}
                            />
                        )}

                        {/* Info compacta */}
                        <VStack align="start" spacing={0} flex="1" minW={0}>
                            <Text color="gray.500" fontSize="sm" fontWeight="bold" noOfLines={1}>
                                {(canje as any).Producto?.nombre || 'Producto no encontrado'}
                            </Text>
                            <HStack spacing={2} flexWrap="wrap">
                                <Badge colorScheme={getStatusColor(canje.estado)} fontSize="xs">
                                    {getStatusText(canje.estado)}
                                </Badge>
                                <Text fontSize="xs" color="text.muted">
                                    {new Date(canje.fecha).toLocaleDateString('es-ES', {
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </Text>
                            </HStack>
                        </VStack>

                        {/* Puntos */}
                        <Text fontSize="sm" color="accent.fg" fontWeight="bold" flexShrink={0}>
                            {(canje as any).Producto?.precio} pts
                        </Text>
                    </HStack>
                </Box>
            ))}
        </VStack>
    )

    return (
        <RequireAuth>
            <Layout>
                <Container maxW="container.lg" py={{ base: 4, md: 8 }} px={{ base: 4, md: 6 }}>
                    <VStack spacing={6} align="stretch">
                        {/* Encabezado con botón de vista */}
                        <HStack justify="space-between" align="center" flexWrap="wrap" gap={2}>
                            <Heading fontSize={{ base: '2xl', md: '3xl' }}>
                                Mis Canjes
                            </Heading>

                            {/* Botón de vista */}
                            <Menu>
                                <Tooltip label="Cambiar vista">
                                    <MenuButton
                                        as={IconButton}
                                        icon={<Icon as={viewMode === 'list' ? MdViewList : viewMode === 'grid' ? MdViewModule : MdViewComfy} />}
                                        variant="outline"
                                        size="sm"
                                        aria-label="Cambiar vista"
                                    />
                                </Tooltip>
                                <MenuList>
                                    <MenuItem icon={<MdViewList />} onClick={() => setViewMode('list')}>
                                        Vista detallada
                                    </MenuItem>
                                    <MenuItem icon={<MdViewModule />} onClick={() => setViewMode('grid')}>
                                        Vista de cuadrícula
                                    </MenuItem>
                                    <MenuItem icon={<MdViewComfy />} onClick={() => setViewMode('compact')}>
                                        Vista compacta
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        </HStack>

                        {/* Contenido */}
                        {!canjes || canjes.length === 0 ? (
                            <Center py={10}>
                                <VStack spacing={4}>
                                    <Text fontSize={{ base: 'md', md: 'lg' }} color="text.muted" textAlign="center">
                                        No tienes canjes realizados
                                    </Text>
                                    <Text fontSize={{ base: 'xs', md: 'sm' }} color="text.muted" textAlign="center" px={4}>
                                        Ve al catálogo y canjea productos con tus puntos
                                    </Text>
                                </VStack>
                            </Center>
                        ) : (
                            <>
                                {viewMode === 'list' && renderListView()}
                                {viewMode === 'grid' && renderGridView()}
                                {viewMode === 'compact' && renderCompactView()}
                            </>
                        )}

                        <Divider />

                        <Text fontSize={{ base: 'xs', md: 'sm' }} color="text.muted" textAlign="center" px={4}>
                            Los canjes pendientes serán procesados en las próximas 24-48 horas
                        </Text>
                    </VStack>
                </Container>
            </Layout>
        </RequireAuth>
    )
}