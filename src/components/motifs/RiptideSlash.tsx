import { AnimatePresence, motion } from 'framer-motion'
import { useRiptide } from '../../hooks/useRiptide'

export default function RiptideSlash() {
  const triggered = useRiptide()

  return (
    <AnimatePresence>
      {triggered && (
        <motion.div
          className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Diagonal slash line */}
          <motion.div
            className="absolute "
            style={{
              width: '140vw',
              height: '4px',
              background: 'linear-gradient(90deg, transparent, #3B82C4, #9B7FD4, transparent)',
              transformOrigin: 'center',
              rotate: -35,
              top: '48%',
              left: '-20%',
              borderRadius: 9999,
              filter: 'blur(1px)',
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ scaleX: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          />

          {/* Glow behind slash */}
          <motion.div
            className="absolute"
            style={{
              width: '140vw',
              height: '40px',
              background: 'linear-gradient(90deg, transparent, rgba(59,130,196,0.15), rgba(155,127,212,0.15), transparent)',
              transformOrigin: 'center',
              rotate: -35,
              top: '47%',
              left: '-20%',
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 0.8 }}
            exit={{ scaleX: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />

          {/* ⚔️ icon at slash midpoint */}
          <motion.span
            className="text-5xl"
            style={{ filter: 'drop-shadow(0 0 12px #3B82C4)' }}
            initial={{ scale: 0, rotate: -45, opacity: 0 }}
            animate={{ scale: 1.2, rotate: -35, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            ⚔️
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
