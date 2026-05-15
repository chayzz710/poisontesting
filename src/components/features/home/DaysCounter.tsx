import { useEffect } from 'react'
//import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useDaysTogether } from '../../../hooks/useDaysTogether'

export default function DaysCounter() {
  const days = useDaysTogether()
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.floor(v).toLocaleString())
  // const hasAnimated = useRef(false)

  useEffect(() => {
    const controls = animate(count, days, {
      duration: 2.2,
      ease: [0.16, 1, 0.3, 1],
    })
    return controls.stop
  }, [count, days])  // re-runs whenever days changes

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      <motion.span
        className="font-display text-[7rem] leading-none text-chocolate tabular-nums"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {rounded}
      </motion.span>
      <motion.p
        className="font-hand text-2xl text-orchid-deep tracking-wide"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        days together 🌻
      </motion.p>
    </div>
  )
}
