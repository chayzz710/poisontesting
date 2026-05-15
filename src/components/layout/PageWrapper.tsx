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

      {/* Sunflower top border */}
      <div className="fixed top-14 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-sunflower/60 to-transparent z-30 pointer-events-none" />

      {/* Page content */}
      <motion.main
        key={pageKey}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className={`pt-20 pb-16 px-8 max-w-6xl mx-auto ${className}`}
      >
        {children}
      </motion.main>

      {/* Hidden frog — different corner each page */}
      <FrogEasterEgg pageKey={pageKey} />
    </div>
  )
}
