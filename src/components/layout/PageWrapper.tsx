import { motion } from 'framer-motion'
import Navbar from './Navbar'
import FrogEasterEgg from '../motifs/FrogEasterEgg'

interface PageWrapperProps {
  children: React.ReactNode
  pageKey: string   // unique string per page — drives frog position
  className?: string
}

export default function PageWrapper({ children, pageKey, className = '' }: PageWrapperProps) {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* Page content */}
      <motion.main
        key={pageKey}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className={`pt-20 pb-16 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto w-full ${className}`}
      >
        {children}
      </motion.main>

      {/* Hidden frog — different corner each page */}
      <FrogEasterEgg pageKey={pageKey} />
    </div>
  )
}
