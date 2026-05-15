import { useState } from 'react'
import PageWrapper from '../components/layout/PageWrapper'
import MapView from '../components/features/map/MapView'
import AddPinModal from '../components/features/map/AddPinModal'
import PinDetailModal from '../components/features/map/PinDetailModal'
import { useMapPins } from '../hooks/useMapPins'
import { Button } from '../components/ui/Button'
import type { MapPin } from '../types'

type FilterType = 'all' | 'first_date' | 'favourite' | 'adventure'

const FILTERS: { value: FilterType; label: string; emoji: string }[] = [
  { value: 'all', label: 'all', emoji: '🗺' },
  { value: 'first_date', label: 'first date', emoji: '💛' },
  { value: 'favourite', label: 'favourites', emoji: '🌻' },
  { value: 'adventure', label: 'adventures', emoji: '🐸' },
]

export default function MapPage() {
  const { pins, loading, refetch } = useMapPins()
  const [addMode, setAddMode] = useState(false)
  const [pendingLatLng, setPendingLatLng] = useState<{ lat: number; lng: number } | null>(null)
  const [selectedPin, setSelectedPin] = useState<MapPin | null>(null)
  const [filter, setFilter] = useState<FilterType>('all')

  const filteredPins = filter === 'all' ? pins : pins.filter((p) => p.pin_type === filter)

  const handleMapClick = (lat: number, lng: number) => {
    if (!addMode) return
    setPendingLatLng({ lat, lng })
  }

  return (
    <PageWrapper pageKey="map">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-display text-4xl text-chocolate">our map</h1>
          <p className="font-hand text-orchid text-lg mt-1">
            {pins.length} {pins.length === 1 ? 'place' : 'places'} we've been 🗺
          </p>
        </div>
        <Button
          variant={addMode ? 'danger' : 'primary'}
          onClick={() => setAddMode(!addMode)}
        >
          {addMode ? '✕ cancel' : '📍 add a place'}
        </Button>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 mb-4">
        {FILTERS.map(({ value, label, emoji }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filter === value
                ? 'bg-sunflower text-chocolate shadow-sm'
                : 'bg-white text-chocolate/60 hover:text-chocolate border border-sunflower/20'
            }`}
          >
            {emoji} {label}
          </button>
        ))}
      </div>

      {/* Add mode hint */}
      {addMode && (
        <div className="mb-3 px-4 py-2 bg-orchid/10 rounded-xl border border-orchid/20 text-sm font-hand text-orchid">
          📍 click anywhere on the map to drop a pin
        </div>
      )}

      {/* Map */}
      <div className="rounded-2xl overflow-hidden shadow-soft" style={{ height: '60vh' }}>
        <MapView
          pins={filteredPins}
          addMode={addMode}
          onMapClick={handleMapClick}
          onPinClick={setSelectedPin}
          loading={loading}
        />
      </div>

      {/* Add pin modal */}
      {pendingLatLng && (
        <AddPinModal
          lat={pendingLatLng.lat}
          lng={pendingLatLng.lng}
          onClose={() => { setPendingLatLng(null); setAddMode(false) }}
          onSuccess={() => { setPendingLatLng(null); setAddMode(false); refetch() }}
        />
      )}

      {/* Pin detail modal */}
      {selectedPin && (
        <PinDetailModal
          pin={selectedPin}
          onClose={() => setSelectedPin(null)}
          onUpdate={() => { setSelectedPin(null); refetch() }}
        />
      )}
    </PageWrapper>
  )
}
