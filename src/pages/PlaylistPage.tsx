import { useState } from 'react'
import PageWrapper from '../components/layout/PageWrapper'
import AddSongModal from '../components/features/playlist/AddSongModal'
import SongRow from '../components/features/playlist/SongRow'
import { useSongs } from '../hooks/useSongs'
import { Button } from '../components/ui/Button'
import { SunflowerDivider } from '../components/motifs/SunflowerDivider'

// 🎵 Replace this with your actual Spotify track ID
// Get it from a Spotify link: open.spotify.com/track/THIS_PART_HERE
const ANTHEM_TRACK_ID = 'YOUR_TRACK_ID_HERE'

export default function PlaylistPage() {
  const { songs, loading, refetch } = useSongs()
  const [showAdd, setShowAdd] = useState(false)

  const hasAnthem = ANTHEM_TRACK_ID !== 'YOUR_TRACK_ID_HERE'

  return (
    <PageWrapper pageKey="playlist">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl text-chocolate">our playlist</h1>
          <p className="font-hand text-orchid text-lg mt-1">
            songs that mean something 🎵
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowAdd(true)}>
          + add a song
        </Button>
      </div>

      {/* Anthem embed */}
      {hasAnthem && (
        <div className="mb-8">
          <p className="font-hand text-orchid/60 text-sm mb-3">🎵 our song</p>
          <iframe
            src={`https://open.spotify.com/embed/track/${ANTHEM_TRACK_ID}?utm_source=generator`}
            width="100%"
            height="152"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded-2xl"
          />
        </div>
      )}

      {!hasAnthem && (
        <div className="mb-8 p-5 bg-sunflower/10 rounded-2xl border border-sunflower/30">
          <p className="font-hand text-chocolate/50 text-sm">
            🎵 set your anthem — paste your Spotify track ID into <code className="bg-white px-1 rounded">ANTHEM_TRACK_ID</code> in <code className="bg-white px-1 rounded">PlaylistPage.tsx</code>
          </p>
        </div>
      )}

      <SunflowerDivider />

      {/* Song list */}
      <div className="mt-6">
        <p className="font-hand text-orchid/60 text-sm mb-4">everything else 🎶</p>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="text-5xl animate-tilt">🌻</div>
            <p className="font-hand text-orchid text-xl">tuning in…</p>
          </div>
        ) : songs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="text-6xl">🎵</div>
            <p className="font-display text-2xl text-chocolate/60">no songs yet</p>
            <p className="font-hand text-orchid text-lg">add the first one 🌻</p>
            <Button variant="primary" onClick={() => setShowAdd(true)} className="mt-2">
              + add a song
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {songs.map((song, i) => (
              <SongRow key={song.id} song={song} index={i} onDelete={refetch} />
            ))}
          </div>
        )}
      </div>

      {showAdd && (
        <AddSongModal
          onClose={() => setShowAdd(false)}
          onSuccess={() => { setShowAdd(false); refetch() }}
        />
      )}
    </PageWrapper>
  )
}
