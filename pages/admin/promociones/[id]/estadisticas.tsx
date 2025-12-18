import {
  Container,
  Heading,
  VStack,
  HStack,
  Text,
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Image,
  useColorModeValue,
  Spinner,
  Center,
  Button,
  Icon,
  Avatar
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { Layout } from '../../../../components/Layout'
import { TransparentCard } from '../../../../components/TransparentCard'
import { RequireAdmin } from '../../../../components/RequireAdmin'
import { usePromocionEstadisticas } from '../../../../hooks/usePromocion'
import { FiArrowLeft, FiTrendingUp, FiUsers, FiShoppingCart, FiDollarSign } from 'react-icons/fi'

export default function EstadisticasPromocionPage() {
  const router = useRouter()
  const { id } = router.query

  const { data: stats, isLoading } = usePromocionEstadisticas(Number(id))

  const headingColor = useColorModeValue('gray.900', 'white')
  const textColor = useColorModeValue('gray.700', 'gray.300')
  const tableHeadBg = useColorModeValue('gray.50', 'gray.900')
  const tableHoverBg = useColorModeValue('gray.50', 'gray.700')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  if (isLoading) {
    return (
      <Layout>
        <RequireAdmin>
          <Center minH="60vh">
            <Spinner size="xl" color="blue.500" />
          </Center>
        </RequireAdmin>
      </Layout>
    )
  }

  if (!stats) {
    return (
      <Layout>
        <RequireAdmin>
          <Center minH="60vh">
            <Text fontSize="xl" color={textColor}>
              No se encontraron estadísticas
            </Text>
          </Center>
        </RequireAdmin>
      </Layout>
    )
  }

  const { promocion, estadisticas, topUsuarios, topProductos } = stats

  return (
    <Layout>
      <RequireAdmin>
        <Container maxW="container.xl" py={8}>
          <VStack spacing={6} align="stretch">
            <HStack justify="space-between">
              <VStack align="start" spacing={1}>
                <Button
                  leftIcon={<Icon as={FiArrowLeft} />}
                  variant="ghost"
                  onClick={() => router.back()}
                  size="sm"
                >
                  Volver
                </Button>
                <Heading size="xl" color={headingColor}>
                  Estadísticas: {promocion.titulo}
                </Heading>
                <HStack spacing={3}>
                  <Badge colorScheme="blue">{promocion.estado}</Badge>
                  <Badge colorScheme="purple">
                    {promocion.tipo_descuento === 'porcentaje'
                      ? `${promocion.valor_descuento}%`
                      : `${promocion.valor_descuento} pts`}
                  </Badge>
                  <Text fontSize="sm" color={textColor}>
                    {new Date(promocion.fecha_inicio).toLocaleDateString()} -{' '}
                    {new Date(promocion.fecha_fin).toLocaleDateString()}
                  </Text>
                </HStack>
              </VStack>
            </HStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
              <TransparentCard p={6}>
                <Stat>
                  <HStack mb={2}>
                    <Icon as={FiTrendingUp} color="blue.500" boxSize={5} />
                    <StatLabel>Total de Usos</StatLabel>
                  </HStack>
                  <StatNumber fontSize="3xl">{estadisticas.total_usos}</StatNumber>
                  <StatHelpText>
                    {estadisticas.usos_maximos
                      ? `de ${estadisticas.usos_maximos} máximo`
                      : 'ilimitados'}
                  </StatHelpText>
                </Stat>
              </TransparentCard>

              <TransparentCard p={6}>
                <Stat>
                  <HStack mb={2}>
                    <Icon as={FiDollarSign} color="green.500" boxSize={5} />
                    <StatLabel>Puntos Descontados</StatLabel>
                  </HStack>
                  <StatNumber fontSize="3xl">
                    {estadisticas.puntos_descontados_total.toLocaleString()}
                  </StatNumber>
                  <StatHelpText>
                    Promedio: {Math.round(estadisticas.descuento_promedio)} pts
                  </StatHelpText>
                </Stat>
              </TransparentCard>

              <TransparentCard p={6}>
                <Stat>
                  <HStack mb={2}>
                    <Icon as={FiUsers} color="purple.500" boxSize={5} />
                    <StatLabel>Usuarios Únicos</StatLabel>
                  </HStack>
                  <StatNumber fontSize="3xl">{estadisticas.usuarios_unicos}</StatNumber>
                  <StatHelpText>Han usado esta promoción</StatHelpText>
                </Stat>
              </TransparentCard>

              <TransparentCard p={6}>
                <Stat>
                  <HStack mb={2}>
                    <Icon as={FiShoppingCart} color="orange.500" boxSize={5} />
                    <StatLabel>Productos Aplicables</StatLabel>
                  </HStack>
                  <StatNumber fontSize="3xl">{estadisticas.productos_aplicables}</StatNumber>
                  <StatHelpText>Con descuento disponible</StatHelpText>
                </Stat>
              </TransparentCard>
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
              <TransparentCard p={0} overflow="hidden">
                <Box p={6} borderBottom="1px" borderColor={borderColor}>
                  <Heading size="md" color={headingColor}>
                    Top Usuarios
                  </Heading>
                  <Text fontSize="sm" color={textColor} mt={1}>
                    Usuarios que más han aprovechado esta promoción
                  </Text>
                </Box>
                <Box overflowX="auto">
                  {topUsuarios && topUsuarios.length > 0 ? (
                    <Table variant="simple" size="sm">
                      <Thead bg={tableHeadBg}>
                        <Tr>
                          <Th>Usuario</Th>
                          <Th isNumeric>Usos</Th>
                          <Th isNumeric>Ahorro Total</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {topUsuarios.map((user) => (
                          <Tr key={user.usuario_id} _hover={{ bg: tableHoverBg }}>
                            <Td>
                              <HStack spacing={2}>
                                <Avatar size="sm" name={user.Usuario.username} />
                                <VStack align="start" spacing={0}>
                                  <Text fontWeight="semibold" fontSize="sm">
                                    {user.Usuario.username}
                                  </Text>
                                </VStack>
                              </HStack>
                            </Td>
                            <Td isNumeric>
                              <Badge colorScheme="blue">{user.usos}</Badge>
                            </Td>
                            <Td isNumeric>
                              <Text fontWeight="semibold" color="green.500">
                                {user.ahorro_total.toLocaleString()} pts
                              </Text>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  ) : (
                    <Box p={8} textAlign="center">
                      <Text color={textColor}>No hay datos de usuarios aún</Text>
                    </Box>
                  )}
                </Box>
              </TransparentCard>

              <TransparentCard p={0} overflow="hidden">
                <Box p={6} borderBottom="1px" borderColor={borderColor}>
                  <Heading size="md" color={headingColor}>
                    Top Productos
                  </Heading>
                  <Text fontSize="sm" color={textColor} mt={1}>
                    Productos más canjeados con esta promoción
                  </Text>
                </Box>
                <Box overflowX="auto">
                  {topProductos && topProductos.length > 0 ? (
                    <Table variant="simple" size="sm">
                      <Thead bg={tableHeadBg}>
                        <Tr>
                          <Th>Producto</Th>
                          <Th isNumeric>Canjes</Th>
                          <Th isNumeric>Precio</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {topProductos.map((prod) => (
                          <Tr key={prod.producto_id} _hover={{ bg: tableHoverBg }}>
                            <Td>
                              <HStack spacing={3}>
                                <Image
                                  src={prod.Producto.imagen_url}
                                  alt={prod.Producto.nombre}
                                  boxSize="40px"
                                  objectFit="cover"
                                  borderRadius="md"
                                  fallbackSrc="/no-image.png"
                                />
                                <Text fontWeight="semibold" fontSize="sm">
                                  {prod.Producto.nombre}
                                </Text>
                              </HStack>
                            </Td>
                            <Td isNumeric>
                              <Badge colorScheme="purple">{prod.canjes}</Badge>
                            </Td>
                            <Td isNumeric>
                              <Text fontSize="sm">{prod.Producto.precio.toLocaleString()} pts</Text>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  ) : (
                    <Box p={8} textAlign="center">
                      <Text color={textColor}>No hay datos de productos aún</Text>
                    </Box>
                  )}
                </Box>
              </TransparentCard>
            </SimpleGrid>
          </VStack>
        </Container>
      </RequireAdmin>
    </Layout>
  )
}
