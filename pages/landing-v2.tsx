import Head from 'next/head'
import Header from '../components/v2/Header'

export default function LandingV2() {
  return (
    <>
      <Head>
        <title>Luisardito Shop</title>
      </Head>

      <div className="home-template bg-background min-h-screen">
        <Header />
        <main className="px-4 lg:px-9 flex flex-col gap-10 xs:gap-12 sm:gap-16 lg:gap-20">
          {/* Landing page sections will be added here in subsequent tasks */}
          <div className="max-w-[1130px] mx-auto py-20 text-center">
            <p className="text-brand-400 text-lg">Landing v2 — header is ready. Content sections coming next.</p>
          </div>
        </main>
      </div>
    </>
  )
}
