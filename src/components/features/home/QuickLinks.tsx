import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const LINKS = [
  { to: '/gallery',    emoji: '📸', label: 'Gallery' },
  { to: '/letters',   emoji: '✉️',  label: 'Letters' },
  { to: '/jar',       emoji: '🥚',  label: 'Memory Jar' },
  { to: '/puns',      emoji: '😭',  label: 'Pun Wall' },
  { to: '/map',       emoji: '🗺️',  label: 'Our Map' },
  { to: '/playlist',  emoji: '🎵',  label: 'Playlist' },
  { to: '/bucketlist',emoji: '🗒️', label: 'Bucket List' },
]

export default function QuickLinks() {
  return (
    <div className="w-full max-w-2xl">
      <p className="font-hand text-orchid-deep text-sm uppercase tracking-widest mb-4 text-center">
        explore
      </p>
      <div className="grid grid-cols-4 gap-3">
        {LINKS.map((link, i) => (
          <motion.div
            key={link.to}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i, duration: 0.4 }}
          >
            <Link
              to={link.to}
              className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-surface shadow-soft hover:bg-sunflower/10 hover:shadow-md transition group focus:outline-none focus-visible:ring-2 focus-visible:ring-sunflower"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform duration-200" aria-hidden>
                {link.emoji}
              </span>
              <span className="font-body text-xs text-chocolate/70 font-medium text-center leading-tight">
                {link.label}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
