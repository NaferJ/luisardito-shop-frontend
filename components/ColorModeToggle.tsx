import { IconButton, useColorMode, useColorModeValue, Tooltip } from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'

export default function ColorModeToggle() {
  const { toggleColorMode } = useColorMode()
  const isDark = useColorModeValue(false, true)
  return (
    <Tooltip label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}>
      <IconButton
        aria-label="Alternar modo de color"
        variant="ghost"
        onClick={toggleColorMode}
        icon={isDark ? <SunIcon /> : <MoonIcon />}
      />
    </Tooltip>
  )
}
