import {
  Box,
  Container,
  Flex,
  HStack,
  Link as ChakraLink,
  Text,
  useColorModeValue,
  Icon,
  Tooltip
} from '@chakra-ui/react'
import NextLink from 'next/link'
import React from 'react'
import { keyframes } from '@emotion/react'

// Animaciones navideñas sutiles
const twinkle = keyframes`
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
`

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
`

function GitHubIcon(props: React.ComponentProps<typeof Icon>) {
  return (
    <Icon viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M12 .5C5.648.5.5 5.648.5 12c0 5.086 3.292 9.393 7.865 10.915.575.105.785-.25.785-.557 0-.275-.01-1.006-.016-1.975-3.2.695-3.875-1.543-3.875-1.543-.523-1.33-1.277-1.684-1.277-1.684-1.044-.714.08-.699.08-.699 1.154.081 1.762 1.185 1.762 1.185 1.027 1.76 2.694 1.252 3.35.957.105-.744.402-1.252.73-1.54-2.555-.291-5.242-1.277-5.242-5.681 0-1.255.448-2.282 1.183-3.087-.119-.29-.513-1.462.113-3.05 0 0 .964-.309 3.16 1.179.917-.255 1.902-.382 2.88-.386.978.004 1.964.131 2.88.386 2.196-1.488 3.158-1.179 3.158-1.179.628 1.588.234 2.76.115 3.05.735.805 1.182 1.832 1.182 3.087 0 4.414-2.69 5.387-5.254 5.673.413.355.78 1.056.78 2.13 0 1.538-.014 2.777-.014 3.156 0 .309.208.668.793.555C20.215 21.387 23.5 17.083 23.5 12 23.5 5.648 18.352.5 12 .5Z"
      />
    </Icon>
  )
}

function DiscordIcon(props: React.ComponentProps<typeof Icon>) {
  return (
    <Icon viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"
      />
    </Icon>
  )
}

function MailIcon(props: React.ComponentProps<typeof Icon>) {
  return (
    <Icon viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
      />
    </Icon>
  )
}

export function Footer() {
  const bg = useColorModeValue('rgba(247, 250, 252, 0.9)', 'rgba(26, 32, 44, 0.7)')
  const borderClr = useColorModeValue('gray.200', 'gray.700')
  const color = useColorModeValue('gray.700', 'gray.300')
  const year = new Date().getFullYear()

  return (
    <Box
      as="footer"
      role="contentinfo"
      bg={bg}
      sx={{
        backdropFilter: 'saturate(160%) blur(8px)',
        WebkitBackdropFilter: 'saturate(160%) blur(8px)'
      }}
      borderTop="1px solid"
      borderColor={borderClr}
      position="relative"
      overflow="hidden"
    >
      {/* Decoración navideña sutil - luces en la parte superior */}
      <HStack
        position="absolute"
        top={2}
        left="50%"
        transform="translateX(-50%)"
        spacing={2}
        zIndex={1}
        pointerEvents="none"
        display={{ base: 'none', md: 'flex' }}
      >
        {['red.400', 'green.400', 'yellow.400', 'blue.400', 'purple.400', 'pink.400'].map(
          (color, i) => (
            <Box
              key={i}
              w="4px"
              h="4px"
              bg={color}
              borderRadius="full"
              animation={`${twinkle} ${2 + i * 0.15}s ease-in-out infinite`}
              boxShadow={`0 0 4px ${color}`}
            />
          )
        )}
      </HStack>

      {/* Copos de nieve decorativos */}
      <Box
        position="absolute"
        left={4}
        top="50%"
        transform="translateY(-50%)"
        fontSize="lg"
        opacity={0.3}
        animation={`${float} 3s ease-in-out infinite`}
        display={{ base: 'none', lg: 'block' }}
      >
        ❄️
      </Box>
      <Box
        position="absolute"
        right={4}
        top="50%"
        transform="translateY(-50%)"
        fontSize="lg"
        opacity={0.3}
        animation={`${float} 3.5s ease-in-out infinite`}
        display={{ base: 'none', lg: 'block' }}
      >
        ❄️
      </Box>

      <Container maxW="6xl" px={4} py={4} position="relative" zIndex={2}>
        <Flex align="center" gap={3} wrap="wrap" justify={{ base: 'center', md: 'space-between' }}>
          <Text
            fontSize="sm"
            color={color}
            display="inline-flex"
            alignItems="center"
            gap={1}
            flexWrap="wrap"
            justifyContent="center"
          >
            © {year} Luisardito Shop — Creado por{' '}
            <ChakraLink
              as={NextLink}
              href="https://github.com/naferj"
              isExternal
              color="blue.400"
              _hover={{ textDecor: 'underline' }}
            >
              NaferJ
            </ChakraLink>
            <ChakraLink
              href="https://github.com/naferj"
              isExternal
              aria-label="GitHub de NaferJ"
              color={color}
              _hover={{ color: 'gray.500' }}
            >
              <GitHubIcon boxSize={5} />
            </ChakraLink>
          </Text>
          <HStack spacing={2} flexWrap="wrap" justifyContent="center">
            <Text fontSize="sm" color={color}>
              ¿Necesitas ayuda? Contacta con un moderador
            </Text>
            <Tooltip label="Soporte en Discord" hasArrow>
              <ChakraLink
                as={NextLink}
                href="https://discord.gg/4Jbz3B6vp8"
                isExternal
                color={color}
                _hover={{ color: 'blue.400' }}
              >
                <DiscordIcon boxSize={5} />
              </ChakraLink>
            </Tooltip>
            <Tooltip label="Formulario de soporte" hasArrow>
              <ChakraLink
                as={NextLink}
                href="https://forms.gle/RB12tPxQY75gKJ299"
                isExternal
                color={color}
                _hover={{ color: 'blue.400' }}
              >
                <MailIcon boxSize={5} />
              </ChakraLink>
            </Tooltip>
          </HStack>
        </Flex>
      </Container>
    </Box>
  )
}

export default Footer
