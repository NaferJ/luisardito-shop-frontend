import { useState } from 'react'
import {
  Input,
  Button,
  HStack,
  VStack,
  Text,
  Box,
  useColorModeValue,
  Icon
} from '@chakra-ui/react'
import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons'
import { useValidarCodigo } from '../hooks/usePromocion'
import { Promocion } from '../types'

interface CuponInputProps {
  productoId?: number
  onCodigoValidado?: (promocion: Promocion) => void
}

export function CuponInput({ productoId, onCodigoValidado }: CuponInputProps) {
  const [codigo, setCodigo] = useState('')
  const [validacion, setValidacion] = useState<{ promocion?: Promocion; mensaje?: string } | null>(null)
  
  const validarMutation = useValidarCodigo()

  const bgColor = useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(13, 17, 23, 0.8)')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const handleValidar = async () => {
    if (!codigo.trim()) return

    try {
      const result = await validarMutation.mutateAsync({
        codigo: codigo.toUpperCase(),
        producto_id: productoId
      })

      setValidacion(result)
      
      if (result.valido && result.promocion && onCodigoValidado) {
        onCodigoValidado(result.promocion)
      }
    } catch {
      setValidacion({
        mensaje: 'Error al validar código'
      })
    }
  }

  return (
    <VStack align="stretch" spacing={3} w="full">
      <HStack>
        <Input
          placeholder="Código de cupón"
          value={codigo}
          onChange={(e) => {
            setCodigo(e.target.value.toUpperCase())
            setValidacion(null)
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleValidar()}
          bg={bgColor}
          backdropFilter="saturate(180%) blur(20px)"
          borderColor={borderColor}
          textTransform="uppercase"
          _focus={{
            borderColor: 'blue.400',
            boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)'
          }}
        />
        <Button
          onClick={handleValidar}
          isLoading={validarMutation.isPending}
          isDisabled={!codigo.trim()}
          colorScheme="blue"
          minW="100px"
        >
          Aplicar
        </Button>
      </HStack>

      {validacion && (
        <Box
          p={3}
          borderRadius="lg"
          bg={validacion.promocion ? 'green.50' : 'red.50'}
          border="1px solid"
          borderColor={validacion.promocion ? 'green.200' : 'red.200'}
        >
          <HStack spacing={2}>
            <Icon
              as={validacion.promocion ? CheckCircleIcon : WarningIcon}
              color={validacion.promocion ? 'green.600' : 'red.600'}
            />
            <VStack align="start" spacing={0}>
              {validacion.promocion ? (
                <>
                  <Text fontSize="sm" fontWeight="bold" color="green.800">
                    {validacion.promocion.titulo}
                  </Text>
                  <Text fontSize="xs" color="green.600">
                    {validacion.promocion.tipo_descuento === 'porcentaje'
                      ? `${validacion.promocion.valor_descuento}% de descuento`
                      : validacion.promocion.tipo_descuento === 'fijo'
                      ? `${validacion.promocion.valor_descuento} pts de descuento`
                      : validacion.promocion.tipo_descuento}
                  </Text>
                </>
              ) : (
                <Text fontSize="sm" color="red.800">
                  {validacion.mensaje || 'Código inválido'}
                </Text>
              )}
            </VStack>
          </HStack>
        </Box>
      )}
    </VStack>
  )
}
