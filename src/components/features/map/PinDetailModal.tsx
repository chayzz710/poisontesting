import { motion } from 'framer-motion'
import { format, parseISO } from 'date-fns'
import { supabase } from '../../../lib/supabase'
import { useUser } from '../../../lib/auth'
import { Button } from '../../ui/Button'
import { toast } from 'sonner'
import type { MapPin } from '../../../types'

interface PinDetailModalProps {
  pin: MapPin
  onClose: () => void
  onUpdate: () => void
}

const PIN_LABELS: Record<string, string> = {
  first_date: '💛 first date',
  favourite:  '🌻 favourite',
  adventure:  '🐸 adventure',
  default:    '📍 place',
}

export default function PinDetailModal({ pin, onClose, onUpdate }: PinDetailModalProps) {
  const { user } = useUser()
  const isOwner = user?.id === pin.added_by

  const handleDelete = async () => {
    if (!confirm('remove this pin?')) return
    const { error } = await supabase.from('map_pins').delete().eq('id', pin.id)
    if (error) { toast.error('could not delete'); return }
    toast.success('pin removed')
    onUpdate()
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-chocolate/50 backdrop-blur-sm" />

      <motion.div
        className="relative z-10 bg-cream rounded-3xl shadow-polaroid w-full max-w-md overflow-hidden"
        initial={{ scale: 0.92, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-sunflower/20 px-7 pt-7 pb-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/70 flex items-center justify-center text-sm hover:bg-white transition"
          >
            ✕
          </button>
          <span className="text-xs font-medium text-chocolate/40">
            {PIN_LABELS[pin.pin_type ?? 'default']}
          </span>
          <h2 className="font-display text-2xl text-chocolate mt-1">{pin.title}</h2>
          {pin.visited_on && (
            <p className="font-hand text-xs text-chocolate/40 mt-1">
              {format(parseISO(pin.visited_on), 'MMMM d, yyyy')}
            </p>
          )}
        </div>

        <div className="px-7 py-5">
          {pin.story && (
            <p className="font-hand text-lg text-chocolate leading-relaxed mb-4">
              {pin.story}
            </p>
          )}

          <p className="font-hand text-xs text-chocolate/30">
            {pin.lat.toFixed(4)}, {pin.lng.toFixed(4)}
          </p>

          {isOwner && (
            <div className="mt-5 pt-4 border-t border-sunflower/20">
              <Button variant="danger" size="sm" onClick={handleDelete}>
                🗑 remove pin
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
