import { motion } from 'framer-motion'
import PageWrapper from '../layout/PageWrapper'

interface PlaceholderPageProps {
  title: string
  emoji: string
  description: string
  pageKey: string
}

export default function PlaceholderPage({ title, emoji, description, pageKey }: PlaceholderPageProps) {
  return (
    <PageWrapper pageKey={pageKey}>
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-7xl"
        >
          {emoji}
        </motion.div>
        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="font-display text-4xl text-chocolate mb-3">{title}</h1>
          <p className="font-hand text-orchid-deep text-lg">{description}</p>
          <p className="text-chocolate/40 text-sm mt-4 font-hand">coming soon 🌻</p>
        </motion.div>
      </div>
    </PageWrapper>
  )
}
