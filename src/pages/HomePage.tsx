import { motion } from 'framer-motion'
import PageWrapper from '../components/layout/PageWrapper'
import SunflowerDivider from '../components/motifs/SunflowerDivider'
import DaysCounter from '../components/features/home/DaysCounter'
import ProfilePair from '../components/features/home/ProfilePair'
import PunOfTheDay from '../components/features/home/PunOfTheDay'
import KinderJoyTeaser from '../components/features/home/KinderJoyTeaser'
import MonthlyAnniversaryBanner from '../components/features/home/MonthlyAnniversaryBanner'
import QuickLinks from '../components/features/home/QuickLinks'

export default function HomePage() {
  return (
    <PageWrapper pageKey="home">
      <div className="flex flex-col items-center gap-12 py-10 px-4">

        {/* Monthly anniversary banner — only shows on the 14th */}
        <MonthlyAnniversaryBanner />

        {/* Header illustration */}
        <motion.div
          className="flex items-center gap-3 select-none"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-4xl">🌻</span>
          <h1 className="font-display text-3xl text-chocolate">our little corner</h1>
          <span className="text-4xl">🌻</span>
        </motion.div>

        {/* Days counter */}
        <DaysCounter />

        <SunflowerDivider />

        {/* Profile pair */}
        <ProfilePair />

        <SunflowerDivider />

        {/* Pun of the day */}
        <PunOfTheDay />

        {/* Kinder Joy teaser */}
        <KinderJoyTeaser />

        <SunflowerDivider />

        {/* Quick links */}
        <QuickLinks />

        {/* Footer */}
        <motion.p
          className="font-hand text-chocolate/30 text-sm pb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          made with 🌻 and 🍫 and approximately one frog per page
        </motion.p>

      </div>
    </PageWrapper>
  )
}
