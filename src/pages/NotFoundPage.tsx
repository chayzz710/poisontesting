import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center text-center p-8">
      {/* Sad frog */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <motion.span
          className="text-8xl block"
          animate={{ rotate: [0, -5, 5, -3, 3, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          🐸
        </motion.span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="font-display text-6xl text-chocolate mb-3">404</h1>
        <p className="font-hand text-2xl text-orchid mb-2">
          the frog got lost
        </p>
        <p className="font-hand text-chocolate/50 text-lg mb-8">
          this page doesn't exist… or maybe it hopped away 🌿
        </p>

        <Button variant="primary" onClick={() => navigate('/')}>
          take me home 🌻
        </Button>
      </motion.div>
    </div>
  )
}
