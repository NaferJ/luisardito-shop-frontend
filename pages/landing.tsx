import { Box, useColorModeValue } from '@chakra-ui/react'
import Head from 'next/head'
import {
  LandingNavbar,
  HeroSection,
  ContentSection,
  PricingSection,
  FAQSection,
  CTASection,
  LandingFooter,
  loremContent
} from '../components/LandingPage'

export default function Landing() {
  const bgColor = useColorModeValue('white', 'gray.950')
  const textColor = useColorModeValue('gray.800', 'gray.50')

  return (
    <>
      <Head>
        <title>Luisardito Shop - Analytics Platform</title>
        <meta name="description" content="Fast, private, realtime web analytics" />
      </Head>

      <Box bg={bgColor} color={textColor} minH="100vh" suppressHydrationWarning>
        <LandingNavbar />
        <HeroSection />
        <ContentSection
          id="people"
          label="People"
          title="Understand your visitors. They are more than just numbers."
          description={loremContent.medium}
          imagePosition="right"
        />
        <ContentSection
          id="performance"
          label="Performance"
          title="Website performance. See where you shine."
          description={loremContent.medium}
          imagePosition="left"
        />
        <ContentSection
          id="realtime"
          label="Realtime"
          title="Experience your live visitors like never before."
          description={loremContent.medium}
          imagePosition="right"
          showList
        />
        <PricingSection />
        <FAQSection />
        <CTASection />
        <LandingFooter />
      </Box>
    </>
  )
}

