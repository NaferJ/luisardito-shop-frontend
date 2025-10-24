import { Switch, useColorMode, useColorModeValue, Tooltip, HStack, Icon } from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'

export default function ColorModeToggle() {
  const { toggleColorMode } = useColorMode()
  const isDark = useColorModeValue(false, true)
  return (
    <Tooltip label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}>
      <HStack spacing={2}>
        <Icon as={SunIcon} color={!isDark ? 'yellow.400' : 'gray.400'} />
        <Switch
          isChecked={isDark}
          onChange={toggleColorMode}
          colorScheme="blue"
          size="md"
        />
        <Icon as={MoonIcon} color={isDark ? 'blue.400' : 'gray.400'} />
      </HStack>
    </Tooltip>
  )
}
