import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import PageWrapper from '../components/layout/PageWrapper'
import PunCard from '../components/features/puns/PunCard'
import AddPunModal from '../components/features/puns/AddPunModal'
import { usePuns } from '../hooks/usePuns'
import { Button } from '../components/ui/Button'
import { useUser } from '../lib/auth'

type SortMode = 'newest' | 'best' | 'worst'

export default function PunWallPage() {
  const { user } = useUser()
  const { puns, loading, refetch } = usePuns()
  const [showAdd, setShowAdd] = useState(false)
  const [sort, setSort] = useState<SortMode>('newest')

  const sorted = [...puns].sort((a, b) => {
    if (sort === 'best') return (b.rating ?? 0) - (a.rating ?? 0)
    if (sort === 'worst') return (a.rating ?? 5) - (b.rating ?? 5)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  return (
    <PageWrapper pageKey="puns">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-4xl text-chocolate">pun wall</h1>
          <p className="font-hand text-orchid text-lg mt-1">
            {puns.length} {puns.length === 1 ? 'crime' : 'crimes'} against comedy 😩
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowAdd(true)}>
          + add a pun
        </Button>
      </div>

      {/* Sort pills */}
      <div className="flex gap-2 mb-8">
        {(['newest', 'best', 'worst'] as SortMode[]).map((s) => (
          <button
            key={s}
            onClick={() => setSort(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              sort === s
                ? 'bg-sunflower text-chocolate shadow-sm'
                : 'bg-white text-chocolate/60 hover:text-chocolate border border-sunflower/20'
            }`}
          >
            {s === 'newest' ? '🕐 newest' : s === 'best' ? '🤣 best' : '😩 worst'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="text-5xl animate-tilt">🌻</div>
          <p className="font-hand text-orchid text-xl">groaning through the puns…</p>
        </div>
      ) : puns.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
          <div className="text-6xl">😐</div>
          <p className="font-display text-2xl text-chocolate/60">no puns yet</p>
          <p className="font-hand text-orchid text-lg">be the first to make someone groan 🌻</p>
          <Button variant="primary" onClick={() => setShowAdd(true)} className="mt-2">
            + add a pun
          </Button>
        </div>
      ) : (
        /* Masonry using CSS columns */
        <div className="columns-3 gap-5">
          <AnimatePresence>
            {sorted.map((pun, i) => (
              <PunCard
                key={pun.id}
                pun={pun}
                currentUserId={user?.id ?? ''}
                onRate={refetch}
                index={i}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {showAdd && (
        <AddPunModal
          onClose={() => setShowAdd(false)}
          onSuccess={() => { setShowAdd(false); refetch() }}
        />
      )}
    </PageWrapper>
  )
}
