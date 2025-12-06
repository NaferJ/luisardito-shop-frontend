import { useState, useEffect } from 'react'
import { Text, useColorModeValue } from '@chakra-ui/react'

interface CountdownProps {
  fecha: string
  fontSize?: string
  color?: string
}

export function Countdown({ fecha, fontSize = 'xs', color }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState('')
  const defaultColor = useColorModeValue('red.600', 'red.400')

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = new Date(fecha).getTime() - Date.now()

      if (diff <= 0) {
        setTimeLeft('Promoción terminada')
        clearInterval(interval)
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m`)
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
      } else {
        setTimeLeft(`${minutes}m ${seconds}s`)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [fecha])

  return (
    <Text fontSize={fontSize} color={color || defaultColor} fontWeight="semibold">
      Termina en: {timeLeft}
    </Text>
  )
}
