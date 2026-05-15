import { useState } from 'react'
import PageWrapper from '../components/layout/PageWrapper'
import MessyView from '../components/features/gallery/MessyView'
import TimeView from '../components/features/gallery/TimeView'
import UploadModal from '../components/features/gallery/UploadModal'
import PhotoModal from '../components/features/gallery/PhotoModal'
import { usePhotos } from '../hooks/usePhotos'
import { Button } from '../components/ui/Button'
import type { Photo } from '../types'

type ViewMode = 'messy' | 'time'

export default function GalleryPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('messy')
  const [showUpload, setShowUpload] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const { photos, loading, refetch } = usePhotos()

  return (
    <PageWrapper pageKey="gallery">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl text-chocolate">our gallery</h1>
          <p className="font-hand text-orchid text-lg mt-1">
            {photos.length} {photos.length === 1 ? 'memory' : 'memories'} and counting 📸
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex items-center bg-white rounded-full p-1 shadow-soft border border-sunflower/30">
            <button
              onClick={() => setViewMode('messy')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                viewMode === 'messy'
                  ? 'bg-sunflower text-chocolate shadow-sm'
                  : 'text-chocolate/60 hover:text-chocolate'
              }`}
            >
               messy
            </button>
            <button
              onClick={() => setViewMode('time')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                viewMode === 'time'
                  ? 'bg-sunflower text-chocolate shadow-sm'
                  : 'text-chocolate/60 hover:text-chocolate'
              }`}
            >
              🗓 by time
            </button>
          </div>

          <Button variant="primary" onClick={() => setShowUpload(true)}>
            + add photo
          </Button>
        </div>
      </div>

      {/* Gallery content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="text-5xl animate-tilt">🌻</div>
          <p className="font-hand text-orchid text-xl">polishing the polaroids…</p>
        </div>
      ) : photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
          <div className="text-6xl">📷</div>
          <p className="font-display text-2xl text-chocolate/60">no photos yet</p>
          <p className="font-hand text-orchid text-lg">be the first to add a memory 🌻</p>
          <Button variant="primary" onClick={() => {console.log('clicked'); setShowUpload(true)}} className="mt-2">
            + add the first photo
          </Button>
        </div>
      ) : viewMode === 'messy' ? (
        <MessyView photos={photos} onPhotoClick={setSelectedPhoto} />
      ) : (
        <TimeView photos={photos} onPhotoClick={setSelectedPhoto} />
      )}

      {/* Upload modal */}
      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onSuccess={() => {
            setShowUpload(false)
            refetch()
          }}
        />
      )}

      {/* Photo detail modal */}
      {selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          onUpdate={refetch}
        />
      )}
    </PageWrapper>
  )
}
