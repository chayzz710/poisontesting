import { motion } from 'framer-motion'
import { format, parseISO } from 'date-fns'
import type { Photo } from '../../../types'

interface TimeViewProps {
  photos: Photo[]
  onPhotoClick: (photo: Photo) => void
}

function groupByMonth(photos: Photo[]): Record<string, Photo[]> {
  const groups: Record<string, Photo[]> = {}
  for (const photo of photos) {
    const key = photo.taken_at
      ? format(parseISO(photo.taken_at), 'MMMM yyyy')
      : 'unknown date'
    if (!groups[key]) groups[key] = []
    groups[key].push(photo)
  }
  return groups
}

export default function TimeView({ photos, onPhotoClick }: TimeViewProps) {
  const grouped = groupByMonth(photos)
  const months = Object.keys(grouped)

  return (
    <div className="space-y-12">
      {months.map((month, monthIndex) => (
        <motion.div
          key={month}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: monthIndex * 0.1 }}
        >
          {/* Month header */}
          <div className="flex items-center gap-4 mb-5">
            <h2 className="font-hand text-2xl text-orchid">{month}</h2>
            <div className="flex-1 h-px bg-sunflower/40" />
            <span className="font-hand text-sm text-chocolate/40">
              {grouped[month].length} {grouped[month].length === 1 ? 'photo' : 'photos'}
            </span>
          </div>

          {/* Photo grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {grouped[month].map((photo, photoIndex) => (
              <motion.div
                key={photo.id}
                className="polaroid cursor-pointer group"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: monthIndex * 0.05 + photoIndex * 0.03 }}
                whileHover={{ scale: 1.04, transition: { duration: 0.15 } }}
                onClick={() => onPhotoClick(photo)}
              >
                {/* Photo */}
                <div className="w-full aspect-square bg-chocolate/10 overflow-hidden">
                  {photo.url ? (
                    <img
                      src={photo.url}
                      alt={photo.caption || 'memory'}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">📷</div>
                  )}
                </div>

                {/* Caption */}
                <div className="mt-1.5 px-0.5">
                  {photo.caption && (
                    <p className="font-hand text-xs text-chocolate/70 text-center line-clamp-2">
                      {photo.caption}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="font-hand text-xs text-chocolate/30">
                      {(photo as any).profiles?.nickname || ''}
                    </span>
                    {photo.chocolate_rating && (
                      <span className="text-xs">{'🍫'.repeat(photo.chocolate_rating)}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
