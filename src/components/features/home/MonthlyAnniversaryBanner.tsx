import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../../lib/supabase'
import type { Photo, MemoryJarNote } from '../../../types'

type BannerData = {
  photo: (Photo & { signedUrl: string }) | null
  note: MemoryJarNote | null
}

export default function MonthlyAnniversaryBanner() {
  const today = new Date()
  const isAnniversaryDay = today.getDate() === 9
  const [data, setData] = useState<BannerData | null>(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (!isAnniversaryDay) return
    async function load() {
      // Random old photo
      const { data: photos } = await supabase
        .from('photos')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(20)

      let photoWithUrl: (Photo & { signedUrl: string }) | null = null
      if (photos && photos.length > 0) {
        const pick = photos[Math.floor(Math.random() * photos.length)] as Photo
        const { data: signed } = await supabase.storage
          .from('photos')
          .createSignedUrl(pick.storage_path, 3600)
        if (signed) photoWithUrl = { ...pick, signedUrl: signed.signedUrl }
      }

      // Random memory note
      const { data: notes } = await supabase
        .from('memory_jar_notes')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(20)

      const note =
        notes && notes.length > 0
          ? (notes[Math.floor(Math.random() * notes.length)] as MemoryJarNote)
          : null

      setData({ photo: photoWithUrl, note })
    }
    load()
  }, [isAnniversaryDay])

  if (!isAnniversaryDay) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="anniversary-banner"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl bg-sunflower/20 border border-sunflower rounded-2xl p-6 relative"
        >
          <button
            onClick={() => setVisible(false)}
            className="absolute top-3 right-4 text-chocolate/40 hover:text-chocolate text-lg transition"
            aria-label="Dismiss"
          >
            ×
          </button>

          <p className="font-hand text-orchid-deep text-sm uppercase tracking-widest mb-1">
            happy monthly anniversary 🌻
          </p>
          <p className="font-display text-xl text-chocolate mb-4">
            {today.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })} — another month around the sun together
          </p>

          {data && (
            <div className="flex gap-4 items-start">
              {data.photo && (
                <div className="polaroid w-28 shrink-0 -rotate-2">
                  <img
                    src={data.photo.signedUrl}
                    alt={data.photo.caption ?? 'A memory'}
                    className="w-full aspect-square object-cover"
                  />
                  {data.photo.caption && (
                    <p className="font-hand text-xs text-chocolate/70 mt-1 text-center truncate">
                      {data.photo.caption}
                    </p>
                  )}
                </div>
              )}
              {data.note && (
                <div className="flex-1 bg-white rounded-xl p-4 shadow-soft">
                  <p className="font-hand text-base text-chocolate leading-snug">
                    "{data.note.body}"
                  </p>
                </div>
              )}
              {!data.photo && !data.note && (
                <p className="font-hand text-chocolate/60 text-base">
                  Add some photos and memories to celebrate future months! 🥚
                </p>
              )}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
