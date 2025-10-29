import { Box, Container, Flex, HStack, Link as ChakraLink, Text, useColorModeValue, Icon } from '@chakra-ui/react'
import NextLink from 'next/link'
import React from 'react'

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
  const bg = useColorModeValue('rgba(247, 250, 252, 0.8)', 'rgba(26, 32, 44, 0.6)')
  const borderClr = useColorModeValue('black.200', 'black.700')
  const color = useColorModeValue('black.700', 'black.300')
  const year = new Date().getFullYear()

  return (
    <Box as="footer" role="contentinfo" bg={bg} sx={{ backdropFilter: 'saturate(160%) blur(8px)', WebkitBackdropFilter: 'saturate(160%) blur(8px)' }} borderTop="1px solid" borderColor={borderClr}>
      <Container maxW="6xl" px={4} py={4}>
        <Flex align="center" gap={3} wrap="wrap">
          <Text fontSize="sm" color={color} display="inline-flex" alignItems="center" gap={1}>
            © {year} Luisardito Shop — Creado por{' '}
            <ChakraLink as={NextLink} href="https://github.com/naferj" isExternal color="blue.400" _hover={{ textDecor: 'underline' }}>
              NaferJ
            </ChakraLink>
            <ChakraLink href="https://github.com/naferj" isExternal aria-label="GitHub de NaferJ" color={color} _hover={{ color: 'black.500' }}>
              <GitHubIcon boxSize={5} />
            </ChakraLink>
          </Text>
          <HStack spacing={2} ml={{ base: 0, md: 'auto' }}>
            <Text fontSize="sm" color={color}>En caso de cualquier duda o inconveniente contactar a un moderador</Text>
          </HStack>
        </Flex>
      </Container>
    </Box>
  )
}

export default Footer
