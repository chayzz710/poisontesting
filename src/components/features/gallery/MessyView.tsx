import { motion } from 'framer-motion'
import { seededTilt, seededOffset } from '../../../lib/utils'
import type { Photo } from '../../../types'

interface MessyViewProps {
  photos: Photo[]
  onPhotoClick: (photo: Photo) => void
}

// Seeded size bucket: small | medium | large
function seededSize(id: string): 'sm' | 'md' | 'lg' {
  const hash = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const bucket = hash % 3
  return bucket === 0 ? 'sm' : bucket === 1 ? 'md' : 'lg'
}

const sizeClasses = {
  sm: 'w-36 h-36',
  md: 'w-48 h-48',
  lg: 'w-60 h-60',
}

export default function MessyView({ photos, onPhotoClick }: MessyViewProps) {
  return (
    <div className="relative w-full" style={{ minHeight: Math.ceil(photos.length / 4) * 220 + 100 }}>
      {photos.map((photo, index) => {
        const tilt = seededTilt(photo.id)
        const size = seededSize(photo.id)

        // Arrange in a loose grid with per-item offsets
        const col = index % 4
        const row = Math.floor(index / 4)
        const baseX = col * 260 + 20
        const baseY = row * 240 + 20
        const offsetX = seededOffset(photo.id + 'x', -30, 30)
        const offsetY = seededOffset(photo.id + 'y', -20, 20)

        return (
          <motion.div
            key={photo.id}
            className="absolute polaroid cursor-pointer group"
            style={{
              left: baseX + offsetX,
              top: baseY + offsetY,
              rotate: tilt,
              zIndex: 10,
            }}
            whileHover={{
              scale: 1.08,
              rotate: 0,
              zIndex: 50,
              transition: { type: 'spring', stiffness: 300, damping: 20 },
            }}
            initial={{ opacity: 0, scale: 0.8, rotate: tilt }}
            animate={{ opacity: 1, scale: 1, rotate: tilt }}
            transition={{ delay: index * 0.04, duration: 0.4 }}
            onClick={() => onPhotoClick(photo)}
          >
            {/* Photo */}
            <div className={`${sizeClasses[size]} bg-chocolate/10 overflow-hidden`}>
              {photo.url ? (
                <img
                  src={photo.url}
                  alt={photo.caption || 'memory'}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">📷</div>
              )}
            </div>

            {/* Polaroid label area */}
            <div className="mt-2 px-1">
              {photo.caption && (
                <p className="font-hand text-sm text-chocolate/70 text-center line-clamp-1">
                  {photo.caption}
                </p>
              )}
              {photo.chocolate_rating && (
                <p className="text-center text-xs mt-0.5">
                  {'🍫'.repeat(photo.chocolate_rating)}
                </p>
              )}
            </div>

            {/* Uploader hint on hover */}
            <div className="absolute -bottom-7 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="font-hand text-xs text-orchid">
                {(photo as any).profiles?.nickname || 'someone'}
              </span>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
