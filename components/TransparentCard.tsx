import { Box, BoxProps, useColorModeValue } from '@chakra-ui/react'
import { ReactNode } from 'react'

interface TransparentCardProps extends BoxProps {
  children: ReactNode
  blurStrength?: string
  opacity?: number
}

/**
 * Componente de tarjeta transparente con backdrop blur
 * Mantiene el estilo consistente de transparencia con blur en toda la app
 */
export const TransparentCard = ({ 
  children, 
  blurStrength = '20px',
  opacity = 0.80,
  ...props 
}: TransparentCardProps) => {
  const bgColor = useColorModeValue(
    `rgba(255, 255, 255, ${opacity})`,
    `rgba(13, 17, 23, ${opacity})`
  )

  return (
    <Box
      bg={bgColor}
      backdropFilter={`saturate(180%) blur(${blurStrength})`}
      borderRadius="xl"
      boxShadow="lg"
      {...props}
    >
      {children}
    </Box>
  )
}
