import {
  IconButton,
  Badge,
  Tooltip,
  useColorModeValue,
  useDisclosure,
  Box,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  VStack,
  HStack,
  Text,
  Button,
  Divider,
  Spinner,
} from '@chakra-ui/react'
import { BellIcon, DeleteIcon, CheckIcon } from '@chakra-ui/icons'
import {
  MdCardGiftcard,
  MdAttachMoney,
  MdShoppingCart,
  MdCheckCircle,
  MdCancel,
  MdHistory,
  MdInfo
} from 'react-icons/md'
import { useNotificaciones, useNoLeidasCount, useMarcarComoLeida, useMarcarTodasLeidas, useEliminarNotificacion } from '../hooks/useNotificaciones'
import { useRouter } from 'next/router'

const iconMap: Record<string, JSX.Element> = {
  sub_regalada: <MdCardGiftcard />,
  puntos_ganados: <MdAttachMoney />,
  canje_creado: <MdShoppingCart />,
  canje_entregado: <MdCheckCircle />,
  canje_cancelado: <MdCancel />,
  canje_devuelto: <BellIcon />,
  historial_evento: <MdHistory />,
  sistema: <MdInfo />,
}

export function NotificationBell() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { data: notificaciones = [], isLoading } = useNotificaciones()
  const { data: noLeidas = 0 } = useNoLeidasCount()
  const marcarLeidaMutation = useMarcarComoLeida()
  const marcarTodasMutation = useMarcarTodasLeidas()
  const eliminarMutation = useEliminarNotificacion()
  const router = useRouter()

  const iconColor = useColorModeValue('gray.700', 'gray.100')
  const notificationIconColor = useColorModeValue('gray.800', 'gray.50')
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const itemHoverBg = useColorModeValue('gray.50', 'gray.700')
  const unreadBg = useColorModeValue('blue.50', 'blue.900')
  const mutedColor = useColorModeValue('gray.600', 'gray.400')

  const handleClickNotificacion = async (notif: any) => {
    try {
      await marcarLeidaMutation.mutateAsync(notif.id)

      // Si es una notificación de canje, ir a /canjes y hacer scroll
      if (notif.tipo.startsWith('canje_')) {
        const canjeId = notif.datos_relacionados?.canje_id
        onClose()

        // Navegar a /canjes
        await router.push('/canjes')

        // Esperar a que la página cargue y luego hacer scroll
        setTimeout(() => {
          const element = document.getElementById(`canje-${canjeId}`)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        }, 500)
      } else if (notif.enlace_detalle) {
        // Para otras notificaciones, usar el enlace_detalle
        onClose()
        router.push(notif.enlace_detalle)
      }
    } catch (err) {
      console.error('Error en handleClickNotificacion:', err)
    }
  }

  const handleEliminar = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    try {
      await eliminarMutation.mutateAsync(id)
    } catch (err) {
      console.error('Error eliminando notificación:', err)
    }
  }

  const handleMarcarTodas = async () => {
    try {
      await marcarTodasMutation.mutateAsync()
    } catch (err) {
      console.error('Error marcando todas como leídas:', err)
    }
  }

  return (
    <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose} placement="bottom-end">
      <PopoverTrigger>
        <Box position="relative" display="inline-flex">
          <Tooltip label="Notificaciones" placement="bottom">
            <IconButton
              icon={<BellIcon boxSize={6} />}
              aria-label="Notificaciones"
              variant="ghost"
              size="md"
              color={iconColor}
              colorScheme="gray"
              _hover={{
                bg: useColorModeValue('gray.100', 'gray.700'),
              }}
              transition="all 0.2s"
            />
          </Tooltip>

          {noLeidas > 0 && (
            <Badge
              position="absolute"
              top="-1"
              right="-1"
              colorScheme="red"
              variant="solid"
              borderRadius="full"
              px="1.5"
              py="0.5"
              fontSize="10px"
              fontWeight="bold"
              minW="20px"
              textAlign="center"
            >
              {noLeidas > 9 ? '9+' : noLeidas}
            </Badge>
          )}
        </Box>
      </PopoverTrigger>

      <PopoverContent
        bg={bgColor}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="lg"
        boxShadow="0 10px 30px rgba(0,0,0,0.15)"
        maxW="350px"
        p={0}
      >
        <Box>
          {/* Header */}
          <HStack justify="space-between" p={3} borderBottom="1px solid" borderBottomColor={borderColor}>
            <HStack spacing={2}>
              <Text fontSize="sm" fontWeight="bold">
                Notificaciones
              </Text>
              {noLeidas > 0 && (
                <Badge colorScheme="red" fontSize="10px" px={1.5}>
                  {noLeidas}
                </Badge>
              )}
            </HStack>
            {noLeidas > 0 && (
              <Tooltip label="Marcar todas como leídas">
                <Button
                  size="xs"
                  variant="ghost"
                  colorScheme="blue"
                  onClick={handleMarcarTodas}
                  isLoading={marcarTodasMutation.isPending}
                  h="auto"
                  py={1}
                  px={2}
                  fontSize="10px"
                >
                  <CheckIcon boxSize={3} />
                </Button>
              </Tooltip>
            )}
          </HStack>

          {/* Body */}
          <Box maxH="400px" overflowY="auto">
            {isLoading ? (
              <HStack justify="center" py={8}>
                <Spinner size="sm" />
              </HStack>
            ) : notificaciones.length === 0 ? (
              <VStack py={8} spacing={2}>
                <Text fontSize="sm" color={mutedColor} textAlign="center">
                  Sin notificaciones
                </Text>
              </VStack>
            ) : (
              <VStack spacing={0} divider={<Divider m={0} />}>
                {notificaciones.slice(0, 5).map((notif) => (
                  <HStack
                    key={notif.id}
                    w="100%"
                    p={2.5}
                    spacing={2}
                    bg={notif.estado === 'no_leida' ? unreadBg : 'transparent'}
                    _hover={{ bg: itemHoverBg }}
                    cursor="pointer"
                    transition="all 0.2s"
                    onClick={() => handleClickNotificacion(notif)}
                    align="flex-start"
                  >
                    <Box fontSize="20px" minW="6" color={notificationIconColor}>
                      {iconMap[notif.tipo] || <BellIcon />}
                    </Box>

                    <VStack align="start" spacing={0.5} flex={1} minW={0}>
                      <HStack spacing={1} w="100%">
                        <Text fontSize="12px" fontWeight="600" noOfLines={1}>
                          {notif.titulo}
                        </Text>
                        {notif.estado === 'no_leida' && (
                          <Box
                            w="2"
                            h="2"
                            borderRadius="full"
                            bg="blue.500"
                            minW="2"
                            mt="1px"
                          />
                        )}
                      </HStack>
                      <Text fontSize="11px" color={mutedColor} noOfLines={1}>
                        {notif.descripcion}
                      </Text>
                      <Text fontSize="10px" color="gray.500">
                        {new Date(notif.fecha_creacion).toLocaleString('es-ES', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                    </VStack>

                    <Tooltip label="Eliminar">
                      <IconButton
                        icon={<DeleteIcon />}
                        aria-label="Eliminar"
                        size="xs"
                        variant="ghost"
                        colorScheme="red"
                        onClick={(e) => handleEliminar(e, notif.id)}
                        isLoading={eliminarMutation.isPending}
                        minW="auto"
                      />
                    </Tooltip>
                  </HStack>
                ))}
              </VStack>
            )}
          </Box>

          {notificaciones.length > 5 && (
            <>
              <Divider m={0} />
              <Button
                w="100%"
                size="sm"
                variant="ghost"
                fontSize="11px"
                borderRadius="0"
                onClick={() => {
                  onClose()
                  router.push('/notificaciones')
                }}
              >
                Ver todas
              </Button>
            </>
          )}
        </Box>
      </PopoverContent>
    </Popover>
  )
}


