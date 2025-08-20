import { Box, Image, Text, Button, VStack } from '@chakra-ui/react'
import { Producto } from '../types'
import Link from 'next/link'

export function ProductCard({ producto }: { producto: Producto }) {
  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
      {producto.imagen && <Image src={producto.imagen} alt={producto.nombre} boxSize="200px" objectFit="cover" />}
      <VStack spacing={2} p={4} align="start">
        <Text fontWeight="bold">{producto.nombre}</Text>
        <Text>{producto.descripcion}</Text>
        <Text color="teal.600">Precio: {producto.precio} pts</Text>
        <Link href={`/productos/${producto.id}`} passHref>
          <Button size="sm" colorScheme="teal">Ver detalle</Button>
        </Link>
      </VStack>
    </Box>
  )
}
