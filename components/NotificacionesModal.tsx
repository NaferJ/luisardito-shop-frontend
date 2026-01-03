import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  Divider,
  useColorModeValue,
  Spinner,
  Icon,
  Tooltip,
  ScrollArea,
  IconButton,
} from '@chakra-ui/react'
import { useState } from 'react'
import { Notificacion, useNotificaciones } from '../hooks/useNotificaciones'
import { CloseIcon, DeleteIcon, CheckIcon } from '@chakra-ui/icons'
import { useRouter } from 'next/router'

const iconMap: Record<string, string> = {
  sub_regalada: '🎁',
  puntos_ganados: '💰',
  canje_creado: '🛍️',
  canje_entregado: '✅',
  canje_cancelado: '❌',
  canje_devuelto: '↩️',
  historial_evento: '📝',
  sistema: '⚡',
}

const colorMap: Record<string, string> = {
  sub_regalada: 'success',
  puntos_ganados: 'info',
  canje_creado: 'primary',
  canje_entregado: 'success',
  canje_cancelado: 'red',
  canje_devuelto: 'orange',
  historial_evento: 'gray',
  sistema: 'blue',
}

interface NotificacionesModalProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificacionesModal({ isOpen, onClose }: NotificacionesModalProps) {
  const {
    notificaciones,
    noLeidas,
    loading,
    marcarComoLeida,
    marcarTodasLeidas,
    eliminarNotificacion,
  } = useNotificaciones()

  const [page, setPage] = useState(1)
  const router = useRouter()

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const headerBg = useColorModeValue('gray.50', 'gray.900')
  const itemHoverBg = useColorModeValue('gray.50', 'gray.700')
  const unreadBg = useColorModeValue('blue.50', 'blue.900')
  const textColor = useColorModeValue('gray.800', 'gray.100')
  const mutedColor = useColorModeValue('gray.600', 'gray.400')
  const badgeColors = useColorModeValue(
    { success: 'green', info: 'blue', primary: 'blue', red: 'red', orange: 'orange', gray: 'gray' },
    { success: 'green', info: 'blue', primary: 'blue', red: 'red', orange: 'orange', gray: 'gray' }
  )

  const handleClickNotificacion = async (notificacion: Notificacion) => {
    await marcarComoLeida(notificacion.id)
    if (notificacion.enlace_detalle) {
      onClose()
      router.push(notificacion.enlace_detalle)
    }
  }

  const handleEliminar = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    await eliminarNotificacion(id)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" scrollBehavior="inside">
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(4px)" />

      <ModalContent
        bg={bgColor}
        borderColor={borderColor}
        borderWidth="1px"
        boxShadow="0 20px 50px rgba(0, 0, 0, 0.15)"
        borderRadius="xl"
        maxH="90vh"
      >
        {/* Header */}
        <ModalHeader
          bg={headerBg}
          borderBottomWidth="1px"
          borderBottomColor={borderColor}
          py={4}
        >
          <HStack justify="space-between" width="100%">
            <HStack spacing={2}>
              <Text fontSize="xl" fontWeight="bold" color={textColor}>
                📬 Notificaciones
              </Text>
              {noLeidas > 0 && (
                <Badge colorScheme="red" borderRadius="full" px={2} py={1}>
                  {noLeidas}
                </Badge>
              )}
            </HStack>

            {noLeidas > 0 && (
              <Tooltip label="Marcar todas como leídas">
                <Button
                  size="sm"
                  variant="ghost"
                  colorScheme="blue"
                  onClick={marcarTodasLeidas}
                  fontSize="sm"
                >
                  ✓ Leer todo
                </Button>
              </Tooltip>
            )}
          </HStack>
        </ModalHeader>

        <ModalCloseButton />

        {/* Body */}
        <ModalBody p={0}>
          {loading ? (
            <VStack justify="center" align="center" minH="300px" spacing={4}>
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="lg"
              />
              <Text color={mutedColor}>Cargando notificaciones...</Text>
            </VStack>
          ) : notificaciones.length === 0 ? (
            <VStack justify="center" align="center" minH="300px" spacing={3}>
              <Text fontSize="3xl">📭</Text>
              <Text color={mutedColor} textAlign="center">
                No tienes notificaciones
              </Text>
            </VStack>
          ) : (
            <VStack spacing={0} divider={<Divider />}>
              {notificaciones.map((notif) => (
                <Box
                  key={notif.id}
                  w="100%"
                  px={4}
                  py={3}
                  _hover={{ bg: itemHoverBg }}
                  cursor="pointer"
                  transition="all 0.2s"
                  bg={notif.estado === 'no_leida' ? unreadBg : 'transparent'}
                  onClick={() => handleClickNotificacion(notif)}
                  position="relative"
                >
                  <HStack align="flex-start" spacing={3}>
                    {/* Icono */}
                    <Text fontSize="2xl" mt={1} minW="2.5rem">
                      {iconMap[notif.tipo] || '📬'}
                    </Text>

                    {/* Contenido */}
                    <VStack align="start" spacing={1} flex={1}>
                      <HStack justify="space-between" w="100%">
                        <Text fontWeight="bold" fontSize="sm" color={textColor}>
                          {notif.titulo}
                        </Text>
                        {notif.estado === 'no_leida' && (
                          <Badge colorScheme="blue" fontSize="xs">
                            Nuevo
                          </Badge>
                        )}
                      </HStack>

                      <Text fontSize="sm" color={mutedColor} noOfLines={2}>
                        {notif.descripcion}
                      </Text>

                      {/* Datos relacionados */}
                      {Object.keys(notif.datos_relacionados).length > 0 && (
                        <Box fontSize="xs" color={mutedColor} mt={1}>
                          {notif.tipo === 'puntos_ganados' && (
                            <Text>
                              <strong>+{notif.datos_relacionados.cantidad}</strong> puntos
                            </Text>
                          )}
                          {notif.tipo === 'sub_regalada' && (
                            <Text>
                              De: <strong>{notif.datos_relacionados.regalador_username}</strong>
                            </Text>
                          )}
                          {notif.tipo.includes('canje') && notif.datos_relacionados.nombre_producto && (
                            <Text>
                              Producto: <strong>{notif.datos_relacionados.nombre_producto}</strong>
                            </Text>
                          )}
                        </Box>
                      )}

                      <Text fontSize="xs" color="gray.500" mt={1}>
                        {new Date(notif.fecha_creacion).toLocaleString('es-ES')}
                      </Text>
                    </VStack>

                    {/* Botón eliminar */}
                    <Tooltip label="Eliminar">
                      <IconButton
                        icon={<DeleteIcon />}
                        aria-label="Eliminar"
                        size="sm"
                        variant="ghost"
                        colorScheme="red"
                        onClick={(e) => handleEliminar(e, notif.id)}
                      />
                    </Tooltip>

                    {/* Indicador de no leída */}
                    {notif.estado === 'no_leida' && (
                      <Box
                        w="2"
                        h="2"
                        borderRadius="full"
                        bg="blue.500"
                        minW="2"
                      />
                    )}
                  </HStack>
                </Box>
              ))}
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

