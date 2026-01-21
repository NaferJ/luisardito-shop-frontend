import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  IconButton,
  Tooltip,
  useColorModeValue,
  Icon,
  Text,
  Portal
} from '@chakra-ui/react'
import { ReactElement } from 'react'
import { IconType } from 'react-icons'
import { SettingsIcon } from '@chakra-ui/icons'

export interface ActionMenuItem {
  label: string
  icon: IconType | typeof SettingsIcon
  onClick: () => void
  color?: string
  colorScheme?: 'red' | 'yellow' | 'green' | 'blue' | 'cyan' | 'purple' | 'orange'
  isDisabled?: boolean
  isDivider?: boolean
}

interface ActionsMenuProps {
  items: ActionMenuItem[]
  buttonIcon?: ReactElement
  buttonLabel?: string
  buttonSize?: 'xs' | 'sm' | 'md' | 'lg'
  placement?: 'auto' | 'bottom' | 'bottom-start' | 'bottom-end' | 'top' | 'top-start' | 'top-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end'
}

export const ActionsMenu = ({
  items,
  buttonIcon = <SettingsIcon />,
  buttonLabel = 'Acciones',
  buttonSize = 'sm',
  placement = 'bottom-end'
}: ActionsMenuProps) => {
  // Estilo del Navbar - backdrop blur con opacidad
  const menuBg = useColorModeValue('rgba(255, 255, 255, 0.80)', 'rgba(13, 17, 23, 0.80)')
  const menuShadow = useColorModeValue(
    '0 20px 40px rgba(0,0,0,0.15)',
    '0 20px 40px rgba(0,0,0,0.5)'
  )
  const borderColor = useColorModeValue('rgba(208, 215, 222, 0.3)', 'rgba(66, 74, 83, 0.3)')
  const menuItemHoverBg = useColorModeValue('rgba(59, 130, 246, 0.15)', 'rgba(96, 165, 250, 0.20)')
  const menuItemColor = useColorModeValue('gray.700', 'gray.100')

  // Fallback para navegadores que no soportan backdrop-filter
  const fallbackBg = useColorModeValue('rgba(255, 255, 255, 0.70)', 'rgba(13, 17, 23, 0.70)')

  // Colores por esquema - todos los hooks en el nivel superior
  const redColor = useColorModeValue('red.600', 'red.400')
  const yellowColor = useColorModeValue('yellow.600', 'yellow.400')
  const greenColor = useColorModeValue('green.600', 'green.400')
  const blueColor = useColorModeValue('blue.600', 'blue.400')
  const cyanColor = useColorModeValue('cyan.600', 'cyan.400')
  const purpleColor = useColorModeValue('purple.600', 'purple.400')
  const orangeColor = useColorModeValue('orange.600', 'orange.400')

  const getColorByScheme = (colorScheme?: string) => {
    if (!colorScheme) return menuItemColor

    const colorMap = {
      red: redColor,
      yellow: yellowColor,
      green: greenColor,
      blue: blueColor,
      cyan: cyanColor,
      purple: purpleColor,
      orange: orangeColor
    }

    return colorMap[colorScheme as keyof typeof colorMap] || menuItemColor
  }

  return (
    <Menu placement={placement} strategy="absolute">
      <Tooltip label={buttonLabel} placement="top">
        <MenuButton
          as={IconButton}
          aria-label={buttonLabel}
          icon={buttonIcon}
          size={buttonSize}
          variant="ghost"
          borderRadius="full"
          bg={useColorModeValue('rgba(255,255,255,0.6)', 'rgba(0,0,0,0.4)')}
          backdropFilter="blur(10px)"
          _hover={{
            bg: useColorModeValue('rgba(255,255,255,0.8)', 'rgba(0,0,0,0.6)')
          }}
        />
      </Tooltip>
      <Portal>
        <MenuList
          zIndex={2000}
          bg={menuBg}
          sx={{
            backdropFilter: 'saturate(180%) blur(20px)',
            WebkitBackdropFilter: 'saturate(180%) blur(20px)',
            background: fallbackBg
          }}
          borderRadius="xl"
          borderWidth="1px"
          borderColor={borderColor}
          shadow={menuShadow}
          minW="200px"
          py={2}
          overflow="hidden"
        >
          {items.map((item, index) => {
            if (item.isDivider) {
              return (
                <MenuDivider
                  key={`divider-${index}`}
                  my={2}
                  borderColor={borderColor}
                />
              )
            }

            const itemColor = item.color || getColorByScheme(item.colorScheme)

            return (
              <MenuItem
                key={index}
                icon={<Icon as={item.icon} boxSize={4} />}
                onClick={item.onClick}
                isDisabled={item.isDisabled}
                fontSize="sm"
                fontWeight="medium"
                color={itemColor}
                py={2.5}
                px={4}
                bg="transparent"
                _hover={{
                  bg: menuItemHoverBg,
                  transform: 'translateX(2px)',
                  transition: 'all 0.2s ease-in-out'
                }}
                _focus={{
                  bg: 'transparent'
                }}
                _active={{
                  bg: menuItemHoverBg,
                  transform: 'scale(0.98)'
                }}
                transition="all 0.2s ease-in-out"
                cursor="pointer"
              >
                <Text>{item.label}</Text>
              </MenuItem>
            )
          })}
        </MenuList>
      </Portal>
    </Menu>
  )
}
