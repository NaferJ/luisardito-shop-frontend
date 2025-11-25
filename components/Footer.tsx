import {
  Box,
  Container,
  Flex,
  HStack,
  Link as ChakraLink,
  Text,
  useColorModeValue,
  Icon
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
          <HStack spacing={3} flexWrap="wrap" justifyContent="center">
            <Text fontSize="xs" color={color} display="flex" alignItems="center" gap={1}>
              <span role="img" aria-label="regalo">
                🎄
              </span>
              Felices Fiestas
            </Text>
            <Text fontSize="xs" color={color}>
              En caso de dudas contactar a un moderador
            </Text>
          </HStack>
        </Flex>
      </Container>
    </Box>
  )
}

export default Footer
