import { Switch, useColorMode, useColorModeValue, Tooltip, HStack, Icon } from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'

export default function ColorModeToggle() {
  const { toggleColorMode } = useColorMode()
  const isDark = useColorModeValue(false, true)
  return (
    <Tooltip label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}>
      <HStack spacing={{ base: 1, md: 2 }} align="center" flexShrink={0}>
        <Icon
          as={SunIcon}
          color={!isDark ? 'yellow.400' : 'gray.400'}
          boxSize={{ base: 3, md: 4 }}
        />
        <Switch
          isChecked={isDark}
          onChange={toggleColorMode}
          colorScheme="blue"
          size={{ base: "sm", md: "md" }}
        />
        <Icon
          as={MoonIcon}
          color={isDark ? 'blue.400' : 'gray.400'}
          boxSize={{ base: 3, md: 4 }}
        />
      </HStack>
    </Tooltip>
  )
}
