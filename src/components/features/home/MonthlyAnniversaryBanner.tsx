import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../../lib/supabase'
import { differenceInMonths } from 'date-fns'
import { RELATIONSHIP_START } from '../../../types'

export default function MonthlyAnniversaryBanner() {
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [photo, setPhoto] = useState<string | null>(null)

  const today = new Date()
  const isAnniversaryDay = today.getDate() === 9
  const monthsCount = differenceInMonths(today, RELATIONSHIP_START)

  useEffect(() => {
    if (!isAnniversaryDay) return
    // Don't show if already dismissed today
    const key = `anniversary-dismissed-${today.getFullYear()}-${today.getMonth()}`
    if (sessionStorage.getItem(key)) return

    setShow(true)

    // Fetch a random old photo
    supabase
      .from('photos')
      .select('storage_path')
      .order('taken_at', { ascending: true })
      .limit(20)
      .then(async ({ data }) => {
        if (!data || data.length === 0) return
        const random = data[Math.floor(Math.random() * data.length)]
        const { data: signed } = await supabase.storage
          .from('photos')
          .createSignedUrl(random.storage_path, 3600)
        if (signed?.signedUrl) setPhoto(signed.signedUrl)
      })
  }, [])

  const handleDismiss = () => {
    const key = `anniversary-dismissed-${today.getFullYear()}-${today.getMonth()}`
    sessionStorage.setItem(key, 'true')
    setDismissed(true)
  }

  if (!isAnniversaryDay) return null

  return (
    <AnimatePresence>
      {show && !dismissed && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="relative bg-gradient-to-r from-sunflower/30 via-orchid/20 to-sunflower/30 border border-sunflower/40 rounded-2xl p-5 mb-8 flex items-center gap-5 overflow-hidden"
        >
          {/* Background shimmer */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse pointer-events-none" />

          {/* Photo */}
          {photo && (
            <img
              src={photo}
              alt="a memory"
              className="w-16 h-16 rounded-xl object-cover shadow-polaroid flex-shrink-0"
            />
          )}

          {/* Text */}
          <div className="flex-1">
            <p className="font-display text-xl text-chocolate">
              happy {monthsCount} {monthsCount === 1 ? 'month' : 'months'} 💛
            </p>
            <p className="font-hand text-orchid text-base mt-0.5">
              today is our monthly anniversary 🌻
            </p>
          </div>

          {/* Dismiss */}
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-chocolate/30 hover:text-chocolate/60 transition text-sm"
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
