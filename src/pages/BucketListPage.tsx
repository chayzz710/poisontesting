import { useState } from 'react'
import PageWrapper from '../components/layout/PageWrapper'
import BucketItem from '../components/features/bucketlist/BucketItem'
import AddItemModal from '../components/features/bucketlist/AddItemModal'
import { useBucketList } from '../hooks/useBucketList'
import { Button } from '../components/ui/Button'
import { ChessWatermark } from '../components/motifs/ChessWatermark'
import { motion } from 'framer-motion'

export default function BucketListPage() {
  const { items, loading, refetch } = useBucketList()
  const [showAdd, setShowAdd] = useState(false)

  const undone = items.filter((i) => !i.is_done)
  const done = items.filter((i) => i.is_done)

  return (
    <PageWrapper pageName="bucketlist">
      {/* Chess watermark */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center opacity-[0.03]">
        <ChessWatermark />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl text-chocolate">bucket list</h1>
            <p className="font-hand text-orchid text-lg mt-1">
              {undone.length} left to do · {done.length} done ♟️
            </p>
          </div>
          <Button variant="primary" onClick={() => setShowAdd(true)}>
            + add something
          </Button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="text-5xl animate-tilt">🌻</div>
            <p className="font-hand text-orchid text-xl">planning adventures…</p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
            <div className="text-6xl">♟️</div>
            <p className="font-display text-2xl text-chocolate/60">no plans yet</p>
            <p className="font-hand text-orchid text-lg">what do you want to do together? 🌻</p>
            <Button variant="primary" onClick={() => setShowAdd(true)} className="mt-2">
              + add something
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-8">
            {/* Coming up */}
            <div>
              <h2 className="font-hand text-2xl text-orchid mb-5">coming up ✨</h2>
              {undone.length === 0 ? (
                <p className="font-hand text-chocolate/30 text-lg">all done! 🎉</p>
              ) : (
                <motion.div className="space-y-3" layout>
                  {undone.map((item) => (
                    <BucketItem
                      key={item.id}
                      item={item}
                      onUpdate={refetch}
                    />
                  ))}
                </motion.div>
              )}
            </div>

            {/* Done */}
            <div>
              <h2 className="font-hand text-2xl text-chocolate/40 mb-5">done! 🎉</h2>
              {done.length === 0 ? (
                <p className="font-hand text-chocolate/30 text-lg">nothing yet — go do something! 🌻</p>
              ) : (
                <motion.div className="space-y-3" layout>
                  {done.map((item) => (
                    <BucketItem
                      key={item.id}
                      item={item}
                      onUpdate={refetch}
                    />
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>

      {showAdd && (
        <AddItemModal
          onClose={() => setShowAdd(false)}
          onSuccess={() => { setShowAdd(false); refetch() }}
        />
      )}
    </PageWrapper>
  )
}
