import {
  Container,
  Heading,
  Text,
  SimpleGrid,
  Box,
  VStack,
  HStack,
  Badge,
  Image,
  useColorModeValue,
  Spinner,
  Center,
  Icon
} from '@chakra-ui/react'
import { Layout } from '../components/Layout'
import { TransparentCard } from '../components/TransparentCard'
import { Countdown } from '../components/Countdown'
import { usePromocionesActivas } from '../hooks/usePromociones'
import { useRouter } from 'next/router'
import { generateSlug } from '../utils/slug'
import { FiGift, FiTag } from 'react-icons/fi'

export default function PromocionesPage() {
  const { data: promociones, isLoading } = usePromocionesActivas()
  const router = useRouter()

  const headingColor = useColorModeValue('gray.900', 'white')
  const textColor = useColorModeValue('gray.700', 'gray.300')
  const hoverBg = useColorModeValue('whiteAlpha.200', 'whiteAlpha.100')
  const countdownBg = useColorModeValue('red.50', 'red.900')
  const codigoBg = useColorModeValue('blue.50', 'blue.900')
  const productoHoverBg = useColorModeValue('whiteAlpha.400', 'whiteAlpha.200')

  if (isLoading) {
    return (
      <Layout>
        <Center minH="60vh">
          <Spinner size="xl" color="blue.500" />
        </Center>
      </Layout>
    )
  }

  return (
    <Layout>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <VStack spacing={2} align="center">
            <HStack spacing={3}>
              <Icon as={FiGift} boxSize={8} color="blue.500" />
              <Heading size="2xl" color={headingColor}>
                Promociones Activas
              </Heading>
            </HStack>
            <Text fontSize="lg" color={textColor} textAlign="center">
              Descubre nuestras ofertas especiales y descuentos disponibles
            </Text>
          </VStack>

          {!promociones || promociones.length === 0 ? (
            <TransparentCard p={12}>
              <VStack spacing={4}>
                <Icon as={FiTag} boxSize={16} color="gray.400" />
                <Text fontSize="xl" color={textColor} textAlign="center">
                  No hay promociones activas en este momento
                </Text>
                <Text fontSize="md" color={textColor} opacity={0.7} textAlign="center">
                  Vuelve pronto para descubrir nuevas ofertas
                </Text>
              </VStack>
            </TransparentCard>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {promociones.map((promo) => (
                <TransparentCard
                  key={promo.id}
                  p={0}
                  overflow="hidden"
                  transition="all 0.3s"
                  cursor="pointer"
                  _hover={{
                    transform: 'translateY(-8px)',
                    boxShadow: '2xl'
                  }}
                >
                  <VStack align="stretch" spacing={0}>
                    {/* Header con gradiente */}
                    <Box
                      bgGradient={`linear(135deg, ${promo.metadata_visual.gradiente[0]}, ${promo.metadata_visual.gradiente[1]})`}
                      p={6}
                      position="relative"
                    >
                      <Badge
                        position="absolute"
                        top={3}
                        right={3}
                        bg="whiteAlpha.300"
                        backdropFilter="blur(10px)"
                        color="white"
                        px={3}
                        py={1}
                        borderRadius="full"
                        fontSize="xs"
                      >
                        {promo.tipo_descuento === 'porcentaje'
                          ? `${promo.valor_descuento}% OFF`
                          : promo.tipo_descuento === 'fijo'
                          ? `${promo.valor_descuento} pts`
                          : promo.tipo_descuento.toUpperCase()}
                      </Badge>

                      <VStack align="start" spacing={2}>
                        <Text
                          fontSize="2xl"
                          fontWeight="bold"
                          color="white"
                          textShadow="0 2px 8px rgba(0,0,0,0.3)"
                        >
                          {promo.titulo}
                        </Text>
                        {promo.descripcion && (
                          <Text
                            fontSize="sm"
                            color="whiteAlpha.900"
                            textShadow="0 1px 4px rgba(0,0,0,0.2)"
                          >
                            {promo.descripcion}
                          </Text>
                        )}
                      </VStack>
                    </Box>

                    {/* Contenido */}
                    <Box p={4}>
                      <VStack align="stretch" spacing={4}>
                        {/* Countdown */}
                        {promo.metadata_visual.mostrar_countdown && (
                          <Box
                            p={2}
                            borderRadius="md"
                            bg={countdownBg}
                            textAlign="center"
                          >
                            <Countdown fecha={promo.fecha_fin} fontSize="sm" />
                          </Box>
                        )}

                        {/* Código de cupón si aplica */}
                        {promo.requiere_codigo && promo.codigo && (
                          <HStack
                            p={3}
                            borderRadius="md"
                            bg={codigoBg}
                            justify="space-between"
                          >
                            <Text fontSize="xs" fontWeight="semibold">
                              Código:
                            </Text>
                            <Badge colorScheme="blue" fontSize="md" px={3} py={1}>
                              {promo.codigo}
                            </Badge>
                          </HStack>
                        )}

                        {/* Productos aplicables */}
                        {promo.productos && promo.productos.length > 0 && (
                          <VStack align="stretch" spacing={2}>
                            <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                              Productos aplicables:
                            </Text>
                            <SimpleGrid columns={2} spacing={2}>
                              {promo.productos.slice(0, 4).map((producto) => (
                                <Box
                                  key={producto.id}
                                  p={2}
                                  borderRadius="md"
                                  bg={hoverBg}
                                  cursor="pointer"
                                  transition="all 0.2s"
                                  _hover={{
                                    bg: productoHoverBg
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    router.push(`/productos/${generateSlug(producto.nombre)}`)
                                  }}
                                >
                                  <HStack spacing={2}>
                                    <Image
                                      src={producto.imagen_url || producto.imagen}
                                      alt={producto.nombre}
                                      boxSize="40px"
                                      objectFit="cover"
                                      borderRadius="md"
                                      fallbackSrc="/no-image.png"
                                    />
                                    <Text fontSize="xs" noOfLines={2} flex={1}>
                                      {producto.nombre}
                                    </Text>
                                  </HStack>
                                </Box>
                              ))}
                            </SimpleGrid>
                            {promo.productos.length > 4 && (
                              <Text fontSize="xs" color={textColor} opacity={0.7} textAlign="center">
                                +{promo.productos.length - 4} más
                              </Text>
                            )}
                          </VStack>
                        )}
                      </VStack>
                    </Box>
                  </VStack>
                </TransparentCard>
              ))}
            </SimpleGrid>
          )}
        </VStack>
      </Container>
    </Layout>
  )
}
