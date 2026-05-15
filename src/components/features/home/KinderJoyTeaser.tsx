import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function KinderJoyTeaser() {
  return (
    <Link to="/jar" className="group flex flex-col items-center gap-2 focus:outline-none">
      <motion.div
        whileHover={{ rotate: [0, -8, 8, -5, 5, 0], scale: 1.08 }}
        transition={{ duration: 0.5 }}
        className="text-6xl cursor-pointer"
        aria-label="Open the memory jar"
      >
        🥚
      </motion.div>
      <p className="font-hand text-orchid-deep text-base group-hover:underline transition">
        peek inside the jar →
      </p>
    </Link>
  )
}
