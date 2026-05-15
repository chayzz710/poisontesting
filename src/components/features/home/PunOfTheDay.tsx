import { motion } from 'framer-motion'
import { STATIC_PUNS } from '../../../data/puns'
import { dayOfYear } from '../../../lib/utils'

export default function PunOfTheDay() {
  const index = dayOfYear(new Date()) % STATIC_PUNS.length
  const pun = STATIC_PUNS[index]

  return (
    <motion.div
      className="card max-w-md w-full text-center relative overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      {/* decorative corner */}
      <span className="absolute top-3 right-3 text-xl opacity-30 select-none" aria-hidden>
        🤭
      </span>

      <p className="font-hand text-sm text-orchid-deep uppercase tracking-widest mb-2">
        pun of the day
      </p>
      <p className="font-display text-lg text-chocolate leading-snug">
        {pun}
      </p>
      <p className="mt-3 text-xs text-chocolate/40 font-body">
        {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
      </p>
    </motion.div>
  )
}
