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
    Card,
    CardBody,
    Heading,
    Divider,
    Icon,
    Switch,
    FormControl,
    FormLabel,
    Tooltip,
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    SimpleGrid,
    useBreakpointValue,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { MdStar, MdSwapHoriz, MdChat, MdPerson, MdCrown, MdViewList, MdViewModule, MdViewComfy } from 'react-icons/md'
import Head from "next/head";

type ViewMode = 'list' | 'grid' | 'compact'

export default function HistorialPage() {
    const { user } = useAuth()
    const [includeAll, setIncludeAll] = useState(false)

    // Cargar vista desde localStorage
    const [viewMode, setViewMode] = useState<ViewMode>(() => {
        if (typeof window === 'undefined') return 'list'
        const saved = localStorage.getItem('historial-view-mode')
        return (saved as ViewMode) || 'list'
    })

    const { data: historial, isLoading, error } = useHistorialPuntos(user?.id, includeAll)

    const isMobile = useBreakpointValue({ base: true, md: false })

    // Guardar vista en localStorage cuando cambie
    useEffect(() => {
        localStorage.setItem('historial-view-mode', viewMode)
    }, [viewMode])

    // Función para obtener el icono y color según el tipo de evento
    const getEventIcon = (movimiento: any) => {
        const concept = movimiento.concepto || movimiento.motivo
        const eventData = movimiento.kick_event_data

        if (eventData?.event_type === 'botrix_migration') {
            return { icon: MdSwapHoriz, color: 'cyan.500' }
        }
        if (eventData?.event_type === 'vip_granted') {
            return { icon: MdCrown, color: 'yellow.500' }
        }
        if (concept?.includes('VIP') || eventData?.is_vip) {
            return { icon: MdCrown, color: 'yellow.500' }
        }
        if (concept?.includes('chat') || concept?.includes('mensaje')) {
            return { icon: MdChat, color: 'blue.500' }
        }
        if (concept?.includes('follow') || concept?.includes('seguir')) {
            return { icon: MdPerson, color: 'green.500' }
        }
        if (concept?.includes('suscr') || eventData?.user_type === 'subscriber') {
            return { icon: MdStar, color: 'purple.500' }
        }

        return { icon: MdSwapHoriz, color: 'gray.500' }
    }

    const getEventDescription = (movimiento: any) => {
        const concept = movimiento.concepto || movimiento.motivo
        const eventData = movimiento.kick_event_data

        if (eventData?.event_type === 'botrix_migration') {
            return {
                title: 'Migración desde Botrix',
                subtitle: `${eventData.original_points?.toLocaleString()} puntos migrados automáticamente`,
                badge: { text: '🔄 Migración', color: 'cyan' }
            }
        }

        if (eventData?.event_type === 'vip_granted') {
            const duration = eventData.duration_days
                ? `por ${eventData.duration_days} días`
                : 'permanente'
            return {
                title: `VIP otorgado (${duration})`,
                subtitle: 'Estado VIP activado',
                badge: { text: 'VIP', color: 'yellow' }
            }
        }

        if (concept?.includes('vip') || eventData?.is_vip) {
            return {
                title: concept,
                subtitle: 'Evento con bonificación VIP',
                badge: { text: 'VIP', color: 'yellow' }
            }
        }

        if (eventData?.user_type === 'subscriber') {
            return {
                title: concept,
                subtitle: 'Evento con bonificación de suscriptor',
                badge: { text: 'SUB', color: 'purple' }
            }
        }

        return {
            title: concept,
            subtitle: null,
            badge: null
        }
    }

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
                    <Center mt={10}>Error al cargar el historial de puntos</Center>
                </Layout>
            </RequireAuth>
        )
    }

    const getChangeColor = (cambio: number) => {
        return cambio > 0 ? 'green' : 'red'
    }

    const getChangeText = (cambio: number) => {
        return cambio > 0 ? `+${cambio}` : `${cambio}`
    }

    const renderListView = () => (
        <VStack spacing={4} align="stretch">
            {historial?.map((movimiento) => {
                const eventIcon = getEventIcon(movimiento)
                const eventDesc = getEventDescription(movimiento)

                return (
                    <Card key={movimiento.id} _hover={{ shadow: 'md' }} transition="all 0.2s">
                        <CardBody p={{ base: 3, md: 4 }}>
                            <HStack justify="space-between" align="start" spacing={{ base: 2, md: 4 }} flexDir={{ base: 'column', sm: 'row' }}>
                                <HStack spacing={3} flex="1" w="full">
                                    <Icon
                                        as={eventIcon.icon}
                                        color={eventIcon.color}
                                        boxSize={{ base: 4, md: 5 }}
                                        mt={1}
                                        display={{ base: 'none', sm: 'block' }}
                                    />
                                    <VStack align="start" spacing={1} flex="1">
                                        <HStack flexWrap="wrap">
                                            <Text fontWeight="semibold" fontSize={{ base: 'sm', md: 'md' }}>
                                                {eventDesc.title}
                                            </Text>
                                            {eventDesc.badge && (
                                                <Badge
                                                    colorScheme={eventDesc.badge.color}
                                                    size="sm"
                                                    fontSize="xs"
                                                >
                                                    {eventDesc.badge.text}
                                                </Badge>
                                            )}
                                        </HStack>

                                        {eventDesc.subtitle && (
                                            <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.600">
                                                {eventDesc.subtitle}
                                            </Text>
                                        )}

                                        <Text fontSize="xs" color="gray.500">
                                            {new Date(movimiento.fecha).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: isMobile ? 'short' : 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </Text>
                                    </VStack>
                                </HStack>

                                <Badge
                                    colorScheme={getChangeColor(movimiento.cambio || movimiento.puntos)}
                                    fontSize={{ base: 'sm', md: 'md' }}
                                    px={{ base: 2, md: 3 }}
                                    py={{ base: 1, md: 2 }}
                                    borderRadius="lg"
                                    fontWeight="bold"
                                    alignSelf={{ base: 'flex-start', sm: 'auto' }}
                                >
                                    {getChangeText(movimiento.cambio || movimiento.puntos)} pts
                                </Badge>
                            </HStack>
                        </CardBody>
                    </Card>
                )
            })}
        </VStack>
    )

    const renderGridView = () => (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {historial?.map((movimiento) => {
                const eventIcon = getEventIcon(movimiento)
                const eventDesc = getEventDescription(movimiento)

                return (
                    <Card key={movimiento.id} _hover={{ shadow: 'lg' }} transition="all 0.2s" h="full">
                        <CardBody p={4}>
                            <VStack spacing={3} align="stretch" h="full">
                                <HStack justify="space-between">
                                    <Icon
                                        as={eventIcon.icon}
                                        color={eventIcon.color}
                                        boxSize={6}
                                    />
                                    <Badge
                                        colorScheme={getChangeColor(movimiento.cambio || movimiento.puntos)}
                                        fontSize="md"
                                        px={2}
                                        py={1}
                                        borderRadius="md"
                                        fontWeight="bold"
                                    >
                                        {getChangeText(movimiento.cambio || movimiento.puntos)}
                                    </Badge>
                                </HStack>

                                <VStack align="start" spacing={1} flex="1">
                                    <Text fontWeight="bold" fontSize="md" noOfLines={2}>
                                        {eventDesc.title}
                                    </Text>
                                    {eventDesc.badge && (
                                        <Badge colorScheme={eventDesc.badge.color} size="sm">
                                            {eventDesc.badge.text}
                                        </Badge>
                                    )}
                                    {eventDesc.subtitle && (
                                        <Text fontSize="sm" color="gray.600" noOfLines={2}>
                                            {eventDesc.subtitle}
                                        </Text>
                                    )}
                                </VStack>

                                <Text fontSize="xs" color="gray.500" mt="auto">
                                    {new Date(movimiento.fecha).toLocaleDateString('es-ES', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </Text>
                            </VStack>
                        </CardBody>
                    </Card>
                )
            })}
        </SimpleGrid>
    )

    const renderCompactView = () => (
        <VStack spacing={2} align="stretch">
            {historial?.map((movimiento) => {
                const eventIcon = getEventIcon(movimiento)
                const eventDesc = getEventDescription(movimiento)

                return (
                    <Box
                        key={movimiento.id}
                        borderWidth="1px"
                        borderRadius="md"
                        p={3}
                        _hover={{ bg: 'gray.50', shadow: 'sm' }}
                        transition="all 0.2s"
                    >
                        <HStack justify="space-between" spacing={3}>
                            <HStack spacing={2} flex="1" minW={0}>
                                <Icon
                                    as={eventIcon.icon}
                                    color={eventIcon.color}
                                    boxSize={4}
                                    flexShrink={0}
                                />
                                <VStack align="start" spacing={0} flex="1" minW={0}>
                                    <Text color="gray.500" fontSize="sm" fontWeight="medium" noOfLines={1}>
                                        {eventDesc.title}
                                    </Text>
                                    <Text fontSize="xs" color="gray.500">
                                        {new Date(movimiento.fecha).toLocaleDateString('es-ES', {
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </Text>
                                </VStack>
                            </HStack>
                            <Badge
                                colorScheme={getChangeColor(movimiento.cambio || movimiento.puntos)}
                                fontSize="sm"
                                px={2}
                                py={1}
                                borderRadius="md"
                                flexShrink={0}
                            >
                                {getChangeText(movimiento.cambio || movimiento.puntos)}
                            </Badge>
                        </HStack>
                    </Box>
                )
            })}
        </VStack>
    )

    return (
        <RequireAuth>
            <Head>
                <title>Historial - Luisardito Shop</title>
                <meta name="description" content="Historial de puntos acumulados en Luisardito Shop"/>
            </Head>
            <Layout>
                <Container maxW="container.lg" py={{ base: 4, md: 8 }} px={{ base: 4, md: 6 }}>
                    <VStack spacing={6} align="stretch">
                        {/* Encabezado */}
                        <Box>
                            <Heading size={{ base: 'lg', md: 'xl' }} mb={2}>Historial de Puntos</Heading>
                            <VStack spacing={3} align="stretch">
                                <HStack justify="space-between" align="center" flexWrap="wrap" gap={2}>
                                    <Text color="gray.600" fontSize={{ base: 'sm', md: 'md' }}>
                                        Saldo actual: <Badge colorScheme="purple" fontSize={{ base: 'sm', md: 'md' }}>{user?.puntos?.toLocaleString()} puntos</Badge>
                                    </Text>

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

                                {/* Toggle para admins */}
                                {user?.rol_id && [3, 4].includes(user.rol_id) && (
                                    <FormControl display="flex" alignItems="center" w="auto">
                                        <FormLabel htmlFor="include-all" mb="0" fontSize={{ base: 'xs', md: 'sm' }}>
                                            Ver eventos de chat automático
                                        </FormLabel>
                                        <Tooltip label="Los administradores pueden ver todos los eventos, incluyendo chat automático">
                                            <Switch
                                                id="include-all"
                                                isChecked={includeAll}
                                                onChange={(e) => setIncludeAll(e.target.checked)}
                                                colorScheme="purple"
                                                size="sm"
                                            />
                                        </Tooltip>
                                    </FormControl>
                                )}
                            </VStack>
                        </Box>

                        {/* Lista de movimientos */}
                        {!historial || historial.length === 0 ? (
                            <Center py={10}>
                                <VStack spacing={4}>
                                    <Text fontSize={{ base: 'md', md: 'lg' }} color="gray.500" textAlign="center">
                                        No hay movimientos de puntos
                                    </Text>
                                    <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.400" textAlign="center" px={4}>
                                        Los movimientos de puntos aparecerán aquí cuando realices canjes o recibas puntos
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

                        <VStack spacing={2}>
                            <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.500" textAlign="center" px={4}>
                                Los puntos se obtienen por participar en actividades y se gastan al canjear productos
                            </Text>
                            <HStack spacing={{ base: 2, md: 4 }} fontSize="xs" color="gray.400" flexWrap="wrap" justify="center">
                                <HStack spacing={1}>
                                    <Icon as={MdSwapHoriz} color="cyan.500" />
                                    <Text display={{ base: 'none', sm: 'block' }}>Migración</Text>
                                </HStack>
                                <HStack spacing={1}>
                                    <Icon as={MdCrown} color="yellow.500" />
                                    <Text>VIP</Text>
                                </HStack>
                                <HStack spacing={1}>
                                    <Icon as={MdStar} color="purple.500" />
                                    <Text display={{ base: 'none', sm: 'block' }}>Suscriptor</Text>
                                </HStack>
                                <HStack spacing={1}>
                                    <Icon as={MdChat} color="blue.500" />
                                    <Text>Chat</Text>
                                </HStack>
                            </HStack>
                        </VStack>
                    </VStack>
                </Container>
            </Layout>
        </RequireAuth>
    )
}