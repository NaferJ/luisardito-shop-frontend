import { Box, BoxProps, useColorModeValue } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface TransparentCardProps extends BoxProps {
  children: ReactNode
  blurStrength?: string
  opacity?: number
  animate?: boolean
  hoverEffect?: boolean
}

const MotionBox = motion(Box)

/**
 * TransparentCard: Contenedor de cristal (Glassmorphism) premium.
 * Implementa las mejores prácticas de Chakra UI v3 y Framer Motion.
 */
export const TransparentCard = ({ 
  children, 
  blurStrength = '20px',
  opacity = 0.75,
  animate = false,
  hoverEffect = false,
  ...props 
}: TransparentCardProps) => {
  const bgColor = useColorModeValue(
    `rgba(255, 255, 255, ${opacity})`,
    `rgba(15, 15, 25, ${opacity})`
  )
  const borderColor = useColorModeValue(
    'rgba(0, 0, 0, 0.05)',
    'rgba(255, 255, 255, 0.08)'
  )
  const shadowColor = useColorModeValue(
    'rgba(0, 0, 0, 0.04)',
    'rgba(0, 0, 0, 0.4)'
  )

  const cardStyles = {
    bg: bgColor,
    backdropFilter: `saturate(180%) blur(${blurStrength})`,
    borderRadius: "2xl",
    border: "1px solid",
    borderColor: borderColor,
    boxShadow: `0 10px 30px -10px ${shadowColor}`,
    transition: "all 0.3s ease-in-out",
    overflow: "hidden"
  }

  if (animate) {
    return (
      <MotionBox
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={hoverEffect ? { y: -4, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.15)" } : {}}
        {...cardStyles}
        {...props}
      >
        {children}
      </MotionBox>
    )
  }

  return (
    <Box
      {...cardStyles}
      _hover={hoverEffect ? { 
        transform: "translateY(-4px)", 
        boxShadow: "0 20px 40px -15px rgba(0,0,0,0.15)" 
      } : {}}
      {...props}
    >
      {children}
    </Box>
  )
}
