import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Flex,
  Grid,
  GridItem,
  VStack,
  HStack,
  Link as ChakraLink,
  useColorModeValue,
  Divider,
  Icon,
  SimpleGrid
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { useState } from 'react'
import { FaCheck } from 'react-icons/fa'

// Lorem Ipsum content
export const loremContent = {
  short: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  medium: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  long: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  longList: [
    'Lorem ipsum dolor sit amet consectetur adipiscing elit.',
    'Sed do eiusmod tempor incididunt ut labore et dolore.',
    'Magna aliqua ut enim ad minim veniam quis nostrud.',
  ]
}

export const featuresList = [
  { title: 'GDPR compliant.', description: 'We pseudonymize data by default. Impossible to link to an individual.' },
  { title: 'No cookie banners.', description: 'Our default settings are cookie-free, so ditch the consent banners.' },
  { title: 'Simple setup.', description: 'Add one tiny script tag and you\'re done. No complex configuration needed.' }
]

export const faqItems = [
  { question: 'Is this platform GDPR compliant?', answer: loremContent.short },
  { question: 'How long does data retention last?', answer: loremContent.short },
  { question: 'Can I use this on multiple websites?', answer: loremContent.short },
  { question: 'What payment methods do you accept?', answer: loremContent.short },
  { question: 'Is there a free trial available?', answer: loremContent.short },
]

// ===================== Navbar Component =====================
export function LandingNavbar() {
  const borderColor = useColorModeValue('gray.200', 'gray.800')
  const textColor = useColorModeValue('gray.800', 'gray.50')
  const mutedColor = useColorModeValue('gray.600', 'gray.300')
  const accentColor = useColorModeValue('emerald.400', 'emerald.300')
  const accentDark = useColorModeValue('emerald.600', 'emerald.400')

  return (
    <Box borderBottom={`1px solid ${borderColor}`} suppressHydrationWarning>
      <Container maxW="6xl" py={4} px={4}>
        <Flex justify="space-between" align="center">
          <NextLink href="/landing">
            <Flex align="center" gap={2} cursor="pointer">
              <Box w={6} h={6} borderRadius="md" bg={accentColor} />
              <Text fontSize="sm" fontWeight="semibold" letterSpacing="tight">
                Luisardito
              </Text>
            </Flex>
          </NextLink>

          <HStack spacing={6} display={{ base: 'none', md: 'flex' }} fontSize="sm" color={mutedColor}>
            <ChakraLink href="#features">Features</ChakraLink>
            <ChakraLink href="#people">Why</ChakraLink>
            <ChakraLink href="#blog">Blog</ChakraLink>
            <ChakraLink href="#docs">Docs</ChakraLink>
          </HStack>

          <HStack spacing={3} fontSize="sm">
            <NextLink href="/login">
              <ChakraLink color={mutedColor} _hover={{ color: textColor }}>
                Login
              </ChakraLink>
            </NextLink>
            <NextLink href="/register">
              <Button
                size="sm"
                borderRadius="full"
                bg={accentColor}
                color="gray.900"
                fontWeight="medium"
                _hover={{ bg: accentDark }}
              >
                Start free trial
              </Button>
            </NextLink>
          </HStack>
        </Flex>
      </Container>
    </Box>
  )
}

// ===================== Hero Section =====================
export function HeroSection() {
  const borderColor = useColorModeValue('gray.200', 'gray.800')
  const textColor = useColorModeValue('gray.800', 'gray.50')
  const mutedColor = useColorModeValue('gray.600', 'gray.300')
  const accentColor = useColorModeValue('emerald.400', 'emerald.300')
  const accentDark = useColorModeValue('emerald.600', 'emerald.400')
  const sectionBg = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.900')

  return (
    <Box borderBottom={`1px solid ${borderColor}`} suppressHydrationWarning>
      <Container maxW="6xl" py={16} px={4}>
        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={10} mb={10}>
          {/* Left side */}
          <VStack align="start" justify="center" spacing={6}>
            <Text
              fontSize="xs"
              fontWeight="bold"
              letterSpacing="0.25em"
              color={accentColor}
              textTransform="uppercase"
            >
              An alternative to traditional platforms
            </Text>

            <Heading
              as="h1"
              fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
              fontWeight="bold"
              lineHeight="tight"
            >
              Fast, private, realtime web analytics
            </Heading>

            <Text fontSize={{ base: 'sm', md: 'base' }} color={mutedColor} lineHeight="relaxed">
              {loremContent.medium}
            </Text>

            <HStack spacing={3} flexWrap="wrap">
              <NextLink href="/register">
                <Button
                  size="md"
                  borderRadius="full"
                  bg={accentColor}
                  color="gray.900"
                  fontWeight="medium"
                  _hover={{ bg: accentDark }}
                >
                  Start free trial
                </Button>
              </NextLink>
              <ChakraLink
                fontSize="sm"
                color={mutedColor}
                textDecoration="underline"
                textDecorationOffset={4}
                _hover={{ color: textColor }}
              >
                See demo
              </ChakraLink>
              <Text fontSize="xs" color={mutedColor}>
                No credit card required
              </Text>
            </HStack>
          </VStack>

          {/* Right side - Mock dashboard */}
          <Box
            borderRadius="2xl"
            border={`1px solid ${borderColor}`}
            bg={sectionBg}
            p={4}
            display="flex"
            align="center"
            justify="center"
          >
            <Box h="256px" w="full" borderRadius="xl" bg={cardBg} />
          </Box>
        </Grid>

        {/* Quick features grid below hero */}
        <Divider borderColor={borderColor} my={10} />

        <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
          {featuresList.map((feature, idx) => (
            <VStack key={idx} align="start" spacing={1}>
              <Heading as="h3" fontSize="sm" fontWeight="medium">
                {feature.title}
              </Heading>
              <Text fontSize="sm" color={mutedColor}>
                {feature.description}
              </Text>
            </VStack>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  )
}

// ===================== Content Section Component =====================
export function ContentSection({
  id,
  label,
  title,
  description,
  imagePosition = 'right',
  showList = false,
  listItems = loremContent.longList
}: {
  id?: string
  label: string
  title: string
  description: string
  imagePosition?: 'left' | 'right'
  showList?: boolean
  listItems?: string[]
}) {
  const borderColor = useColorModeValue('gray.200', 'gray.800')
  const mutedColor = useColorModeValue('gray.600', 'gray.300')
  const accentColor = useColorModeValue('emerald.400', 'emerald.300')
  const sectionBg = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.900')

  const imageMock = (
    <Box
      borderRadius="2xl"
      border={`1px solid ${borderColor}`}
      bg={sectionBg}
      p={4}
      display="flex"
      align="center"
      justify="center"
    >
      <Box h="224px" w="full" borderRadius="xl" bg={cardBg} />
    </Box>
  )

  const contentArea = (
    <VStack align="start" justify="center" spacing={3}>
      <Text
        fontSize="xs"
        fontWeight="bold"
        letterSpacing="0.25em"
        color={accentColor}
        textTransform="uppercase"
      >
        {label}
      </Text>

      <Heading as="h2" fontSize={{ base: '2xl', md: '3xl' }} fontWeight="semibold">
        {title}
      </Heading>

      <Text fontSize="sm" color={mutedColor}>
        {description}
      </Text>

      {showList && (
        <VStack align="start" spacing={1} pt={2}>
          {listItems.map((item, idx) => (
            <HStack key={idx} spacing={2}>
              <Icon as={FaCheck} color={accentColor} boxSize={4} />
              <Text fontSize="sm" color={mutedColor}>
                {item}
              </Text>
            </HStack>
          ))}
        </VStack>
      )}
    </VStack>
  )

  return (
    <Box borderBottom={`1px solid ${borderColor}`} id={id} suppressHydrationWarning>
      <Container maxW="6xl" py={16} px={4}>
        <Grid
          templateColumns={{ base: '1fr', md: '1fr 1fr' }}
          gap={10}
          direction={imagePosition === 'left' ? 'reverse' : undefined}
        >
          {contentArea}
          {imageMock}
        </Grid>
      </Container>
    </Box>
  )
}

// ===================== Pricing Section =====================
export function PricingSection() {
  const borderColor = useColorModeValue('gray.200', 'gray.800')
  const textColor = useColorModeValue('gray.800', 'gray.50')
  const mutedColor = useColorModeValue('gray.600', 'gray.300')
  const cardBg = useColorModeValue('white', 'gray.900')
  const sectionBg = useColorModeValue('gray.50', 'gray.900')
  const accentColor = useColorModeValue('emerald.400', 'emerald.300')
  const accentDark = useColorModeValue('emerald.600', 'emerald.400')
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')

  return (
    <Box borderBottom={`1px solid ${borderColor}`} id="pricing" suppressHydrationWarning>
      <Container maxW="4xl" py={16} px={4}>
        <VStack spacing={6} textAlign="center" mb={12}>
          <Heading as="h2" fontSize={{ base: '2xl', md: '3xl' }} fontWeight="semibold">
            Simplified pricing
          </Heading>

          <Text fontSize="sm" color={mutedColor}>
            {loremContent.short}
          </Text>

          {/* Toggle */}
          <Flex
            borderRadius="full"
            border={`1px solid ${borderColor}`}
            bg={sectionBg}
            overflow="hidden"
            fontSize="xs"
            gap={0}
          >
            <Button
              variant="ghost"
              size="sm"
              px={4}
              py={1}
              borderRadius="full"
              bg={billingPeriod === 'monthly' ? 'gray.800' : 'transparent'}
              onClick={() => setBillingPeriod('monthly')}
              fontWeight={billingPeriod === 'monthly' ? 'bold' : 'normal'}
            >
              Monthly
            </Button>
            <Button
              variant="ghost"
              size="sm"
              px={4}
              py={1}
              borderRadius="full"
              bg={billingPeriod === 'yearly' ? 'gray.800' : 'transparent'}
              onClick={() => setBillingPeriod('yearly')}
              fontWeight={billingPeriod === 'yearly' ? 'bold' : 'normal'}
              color={billingPeriod === 'yearly' ? accentColor : mutedColor}
            >
              Annually -20%
            </Button>
          </Flex>
        </VStack>

        {/* Pricing card */}
        <Box
          maxW="md"
          mx="auto"
          borderRadius="2xl"
          border={`1px solid ${borderColor}`}
          bg={cardBg}
          p={6}
        >
          <Flex justify="space-between" align="flex-end" mb={6}>
            <VStack align="start" spacing={1}>
              <Text fontSize="xs" color={mutedColor}>
                Per month
              </Text>
              <Heading as="h3" fontSize="2xl" fontWeight="semibold">
                $9
              </Heading>
            </VStack>
            <Text fontSize="xs" color={accentColor} fontWeight="bold">
              10,000 events
            </Text>
          </Flex>

          <VStack align="start" spacing={1} mb={6}>
            <Text fontSize="sm" color={mutedColor}>
              Data retention: Forever
            </Text>
            <Text fontSize="sm" color={mutedColor}>
              Websites: Unlimited
            </Text>
            <Text fontSize="sm" color={mutedColor}>
              Features: Everything
            </Text>
          </VStack>

          <NextLink href="/register">
            <Button
              w="full"
              borderRadius="full"
              bg={accentColor}
              color="gray.900"
              fontWeight="medium"
              mb={3}
              _hover={{ bg: accentDark }}
            >
              Start free trial
            </Button>
          </NextLink>

          <Text fontSize="xs" color={mutedColor} textAlign="center">
            No credit card required
          </Text>
        </Box>
      </Container>
    </Box>
  )
}

// ===================== FAQ Section =====================
export function FAQSection() {
  const borderColor = useColorModeValue('gray.200', 'gray.800')
  const textColor = useColorModeValue('gray.800', 'gray.50')
  const mutedColor = useColorModeValue('gray.600', 'gray.300')
  const cardBg = useColorModeValue('white', 'gray.900')

  return (
    <Box borderBottom={`1px solid ${borderColor}`} id="faq" suppressHydrationWarning>
      <Container maxW="4xl" py={16} px={4}>
        <Heading as="h2" fontSize={{ base: '2xl', md: '3xl' }} fontWeight="semibold" mb={8}>
          Frequently asked questions
        </Heading>

        <VStack spacing={4}>
          {faqItems.map((faq, idx) => (
            <Box
              key={idx}
              borderRadius="xl"
              border={`1px solid ${borderColor}`}
              bg={cardBg}
              p={4}
              w="full"
              as="details"
              css={{
                '&[open] summary': {
                  fontWeight: 'bold'
                }
              }}
            >
              <summary style={{ cursor: 'pointer', fontWeight: 500, fontSize: '0.875rem' }}>
                {faq.question}
              </summary>
              <Text fontSize="sm" color={mutedColor} mt={3}>
                {faq.answer}
              </Text>
            </Box>
          ))}
        </VStack>
      </Container>
    </Box>
  )
}

// ===================== CTA Section =====================
export function CTASection() {
  const borderColor = useColorModeValue('gray.200', 'gray.800')
  const textColor = useColorModeValue('gray.800', 'gray.50')
  const mutedColor = useColorModeValue('gray.600', 'gray.300')
  const accentColor = useColorModeValue('emerald.400', 'emerald.300')
  const accentDark = useColorModeValue('emerald.600', 'emerald.400')

  return (
    <Box borderBottom={`1px solid ${borderColor}`}>
      <Container maxW="4xl" py={16} px={4} textAlign="center">
        <VStack spacing={6}>
          <Heading as="h2" fontSize={{ base: '2xl', md: '3xl' }} fontWeight="semibold">
            A new age of web analytics
          </Heading>

          <Text fontSize="sm" color={mutedColor}>
            {loremContent.short}
          </Text>

          <HStack spacing={3} justify="center" flexWrap="wrap">
            <NextLink href="/register">
              <Button
                borderRadius="full"
                bg={accentColor}
                color="gray.900"
                fontWeight="medium"
                _hover={{ bg: accentDark }}
              >
                Start free trial
              </Button>
            </NextLink>

            <ChakraLink
              fontSize="sm"
              color={mutedColor}
              textDecoration="underline"
              textDecorationOffset={4}
              _hover={{ color: textColor }}
            >
              See demo
            </ChakraLink>
          </HStack>

          <Text fontSize="xs" color={mutedColor}>
            Built with passion. Privacy-first insights for your website.
          </Text>
        </VStack>
      </Container>
    </Box>
  )
}

// ===================== Footer Component =====================
export function LandingFooter() {
  const borderColor = useColorModeValue('gray.200', 'gray.800')
  const textColor = useColorModeValue('gray.800', 'gray.50')
  const mutedColor = useColorModeValue('gray.600', 'gray.300')
  const sectionBg = useColorModeValue('gray.50', 'gray.900')
  const accentColor = useColorModeValue('emerald.400', 'emerald.300')

  return (
    <Box bg={sectionBg} borderTop={`1px solid ${borderColor}`} suppressHydrationWarning>
      <Container maxW="6xl" py={10} px={4}>
        <Grid templateColumns={{ base: '1fr', md: '2fr 1fr 1fr 1fr 1fr' }} gap={8}>
          {/* Brand column */}
          <VStack align="start" spacing={2}>
            <Flex align="center" gap={2}>
              <Box w={5} h={5} borderRadius="md" bg={accentColor} />
              <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                Luisardito
              </Text>
            </Flex>
            <Text fontSize="xs" color={mutedColor}>
              © 2026
            </Text>
            <ChakraLink fontSize="xs" color={mutedColor} textDecoration="underline">
              Operational Status
            </ChakraLink>
          </VStack>

          {/* Product */}
          <VStack align="start" spacing={1}>
            <Text fontSize="xs" fontWeight="bold" color={textColor} textTransform="uppercase">
              Product
            </Text>
            <ChakraLink fontSize="xs" color={mutedColor}>
              Home
            </ChakraLink>
            <ChakraLink fontSize="xs" color={mutedColor}>
              Login
            </ChakraLink>
            <ChakraLink fontSize="xs" color={mutedColor}>
              Register
            </ChakraLink>
            <ChakraLink fontSize="xs" color={mutedColor}>
              Docs
            </ChakraLink>
          </VStack>

          {/* Features */}
          <VStack align="start" spacing={1}>
            <Text fontSize="xs" fontWeight="bold" color={textColor} textTransform="uppercase">
              Features
            </Text>
            <ChakraLink fontSize="xs" color={mutedColor}>
              Analytics
            </ChakraLink>
            <ChakraLink fontSize="xs" color={mutedColor}>
              Realtime
            </ChakraLink>
            <ChakraLink fontSize="xs" color={mutedColor}>
              Performance
            </ChakraLink>
            <ChakraLink fontSize="xs" color={mutedColor}>
              Profiles
            </ChakraLink>
          </VStack>

          {/* Company */}
          <VStack align="start" spacing={1}>
            <Text fontSize="xs" fontWeight="bold" color={textColor} textTransform="uppercase">
              Company
            </Text>
            <ChakraLink fontSize="xs" color={mutedColor}>
              Contact
            </ChakraLink>
            <ChakraLink fontSize="xs" color={mutedColor}>
              Privacy
            </ChakraLink>
            <ChakraLink fontSize="xs" color={mutedColor}>
              Terms
            </ChakraLink>
          </VStack>

          {/* Social */}
          <VStack align="start" spacing={1}>
            <Text fontSize="xs" fontWeight="bold" color={textColor} textTransform="uppercase">
              Social
            </Text>
            <ChakraLink fontSize="xs" color={mutedColor}>
              Twitter
            </ChakraLink>
            <ChakraLink fontSize="xs" color={mutedColor}>
              GitHub
            </ChakraLink>
            <ChakraLink fontSize="xs" color={mutedColor}>
              Discord
            </ChakraLink>
          </VStack>
        </Grid>
      </Container>
    </Box>
  )
}

