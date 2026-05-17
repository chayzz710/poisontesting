import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { seededRandom } from '../../lib/utils'
import { randomDinoFact } from '../../data/dinoFacts'

const PAGES = ['home', 'gallery', 'letters', 'jar', 'puns', 'map', 'playlist', 'bucketlist']

// The actual per-page component used inside PageWrapper
interface DinoProps {
  pageKey: string
}

export function DinoPerPage({ pageKey }: DinoProps) {
  const [activePage] = useState(() => {
    // Read or set on first render
    const stored = sessionStorage.getItem('dino-page')
    if (stored) return stored
    const picked = PAGES[Math.floor(Math.random() * PAGES.length)]
    sessionStorage.setItem('dino-page', picked)
    return picked
  })

  const [found, setFound] = useState(false)
  const [fact, setFact] = useState<string | null>(null)

  if (activePage !== pageKey) return null

  const frogIndex = Math.floor(seededRandom(pageKey) * 4)
  const dinoIndex = (frogIndex + 2) % 4
  const POSITIONS = [
    { top: '80px',    left: '16px'  },
    { top: '80px',    right: '16px' },
    { bottom: '40px', left: '16px'  },
    { bottom: '40px', right: '16px' },
  ]
  const pos = POSITIONS[dinoIndex]

  const playRoar = () => {
  const audio = new Audio('/sounds/roar.mp3')
  audio.volume = 0.5
  audio.play()
  }

  const handleClick = () => {
    playRoar()
    setFound(true)
    setFact(randomDinoFact())
  }

  return (
    <div
      style={{ position: 'fixed', zIndex: 50, ...pos }}
      className="group cursor-pointer select-none"
      onClick={handleClick}
    >
      <motion.span
        className="text-base inline-block"
        animate={found ? { rotate: [0, -20, 20, -10, 0], scale: 1.4 } : {}}
        transition={{ duration: 0.4 }}
      >
        <span
          className="opacity-10 group-hover:opacity-100 transition-opacity duration-300 inline-block"
          style={{ opacity: found ? 1 : undefined }}
        >
          🦖
        </span>
      </motion.span>

      <AnimatePresence>
        {found && fact && (
            <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="absolute bottom-8 left-0 w-56 bg-cream border border-sunflower/40 rounded-2xl shadow-polaroid px-4 py-3"
            style={pos.hasOwnProperty('right') ? { right: 0, left: 'auto' } : {}}
            onClick={(e) => e.stopPropagation()}
            >
            {/* Close button */}
            <button
                onClick={() => setFound(false)}
                className="absolute top-2 right-2 w-5 h-5 rounded-full bg-sunflower/20 hover:bg-sunflower/40 flex items-center justify-center text-xs transition"
            >
                ✕
            </button>
            <p className="font-hand text-xs text-chocolate/40 mb-1">dino fact 🦖</p>
            <p className="font-hand text-sm text-chocolate leading-snug pr-4">{fact}</p>
            <p className="font-hand text-xs text-orchid/50 mt-2">click dino for another 🦖</p>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}