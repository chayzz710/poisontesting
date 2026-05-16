import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, parseISO } from 'date-fns'
import { supabase } from '../../../lib/supabase'
import { useUser } from '../../../lib/auth'
import { toast } from 'sonner'
import type { BucketItem as BucketItemType } from '../../../types'

interface BucketItemProps {
  item: BucketItemType
  onUpdate: () => void
}

export default function BucketItem({ item, onUpdate }: BucketItemProps) {
  const { user } = useUser()
  const [checking, setChecking] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleToggle = async () => {
    setChecking(true)
    try {
      const { error } = await supabase
        .from('bucket_items')
        .update({
          is_done: !item.is_done,
          done_at: !item.is_done ? new Date().toISOString() : null,
        })
        .eq('id', item.id)
      if (error) throw error
      toast.success(item.is_done ? 'moved back to coming up' : 'marked as done! 🎉')
      onUpdate()
    } catch {
      toast.error('could not update')
    } finally {
      setChecking(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const { error } = await supabase
        .from('bucket_items')
        .delete()
        .eq('id', item.id)
      if (error) throw error
      toast.success('removed from the list')
      onUpdate()
    } catch {
      toast.error('could not delete — check Supabase policies')
    } finally {
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className={`
        rounded-2xl border transition-all group
        ${item.is_done
          ? 'bg-white/50 border-chocolate/10'
          : 'bg-white border-sunflower/20 shadow-soft'
        }
      `}
    >
      <div className="flex items-start gap-3 p-4">
        {/* Checkbox */}
        <motion.button
          onClick={handleToggle}
          disabled={checking}
          whileTap={{ scale: 0.8 }}
          className={`
            flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all mt-0.5
            ${item.is_done
              ? 'bg-sunflower border-sunflower text-chocolate'
              : 'border-sunflower/40 hover:border-sunflower'
            }
          `}
        >
          {item.is_done && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-xs">
              ✓
            </motion.span>
          )}
        </motion.button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={`font-medium text-chocolate leading-snug ${item.is_done ? 'line-through opacity-50' : ''}`}>
            {item.title}
          </p>
          {item.description && (
            <p className={`font-hand text-sm mt-0.5 ${item.is_done ? 'text-chocolate/30' : 'text-chocolate/50'}`}>
              {item.description}
            </p>
          )}
          {item.is_done && item.done_at && (
            <p className="font-hand text-xs text-chocolate/30 mt-1">
              ✓ {format(parseISO(item.done_at), 'MMMM d, yyyy')}
            </p>
          )}
        </div>

        {/* Delete button — owner only, shows on hover */}
        {user?.id === item.added_by && !confirmDelete && (
          <button
            onClick={() => setConfirmDelete(true)}
            className="opacity-0 group-hover:opacity-100 text-chocolate/20 hover:text-red-400 transition flex-shrink-0 text-sm"
          >
            ✕
          </button>
        )}
      </div>

      {/* Inline confirm — slides open below */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3 flex items-center gap-3">
              <p className="font-hand text-sm text-red-500 flex-1">remove this?</p>
              <button
                onClick={() => setConfirmDelete(false)}
                disabled={deleting}
                className="font-hand text-sm text-chocolate/40 hover:text-chocolate transition"
              >
                keep it
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="font-hand text-sm text-red-400 hover:text-red-600 transition font-medium"
              >
                {deleting ? 'removing…' : 'yes, remove'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}