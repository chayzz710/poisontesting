import { useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { motion, AnimatePresence } from 'framer-motion'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { format, parseISO } from 'date-fns'
import { supabase } from '../../../lib/supabase'
import { useUser } from '../../../lib/auth'
import { toast } from 'sonner'
import type { MapPin } from '../../../types'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function emojiIcon(emoji: string) {
  return L.divIcon({
    html: `<div style="font-size:28px;line-height:1;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.25))">${emoji}</div>`,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  })
}

const PIN_ICONS: Record<string, ReturnType<typeof emojiIcon>> = {
  first_date: emojiIcon('💛'),
  favourite:  emojiIcon('🌻'),
  adventure:  emojiIcon('🐸'),
  default:    emojiIcon('📍'),
}

const PIN_LABELS: Record<string, string> = {
  first_date: '💛 first date',
  favourite:  '🌻 favourite',
  adventure:  '🐸 adventure',
  default:    '📍 place',
}

function pinIcon(type: string | null) {
  return PIN_ICONS[type ?? 'default'] ?? PIN_ICONS.default
}

function ClickHandler({
  enabled,
  onMapClick,
  onClose,
}: {
  enabled: boolean
  onMapClick: (lat: number, lng: number) => void
  onClose: () => void
}) {
  useMapEvents({
    click(e) {
      const target = e.originalEvent.target as HTMLElement
      if (target.closest('.pin-popup')) return
      onClose()
      if (enabled) onMapClick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

// ── The two-panel popup ────────────────────────────────────
interface PinPopupProps {
  pin: MapPin
  onClose: () => void
  onDelete: () => void
}

function PinPopup({ pin, onClose, onDelete }: PinPopupProps) {
  const { user } = useUser()
  const [expanded, setExpanded] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const isOwner = user?.id === pin.added_by
  const hasDetails = !!(pin.story || isOwner)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const { error } = await supabase.from('map_pins').delete().eq('id', pin.id)
      if (error) throw error
      toast.success('pin removed')
      onDelete()
      onClose()
    } catch {
      toast.error('could not delete')
    } finally {
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  return (
    // Outer card — grows horizontally when expanded
    <motion.div
      layout
      className="pin-popup relative flex bg-cream rounded-2xl shadow-polaroid overflow-hidden"
      style={{ minWidth: 240 }}
      transition={{ type: 'spring', stiffness: 320, damping: 30 }}
    >
      {/* ── Left: summary panel — shifts left when expanded ── */}
      <motion.div
        layout
        className="flex-shrink-0 w-60 p-5"
        animate={{ x: 0 }} // stays in place; the card grows right
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-6 h-6 rounded-full bg-chocolate/10 hover:bg-chocolate/20 flex items-center justify-center text-xs transition z-10"
        >
          ✕
        </button>

        {/* Pin type */}
        <span className="text-xs font-medium text-chocolate/40">
          {PIN_LABELS[pin.pin_type ?? 'default']}
        </span>

        {/* Title */}
        <h3 className="font-display text-lg text-chocolate mt-1 leading-tight pr-4">
          {pin.title}
        </h3>

        {/* Date */}
        {pin.visited_on && (
          <p className="font-hand text-xs text-chocolate/40 mt-1">
            {format(parseISO(pin.visited_on), 'MMMM d, yyyy')}
          </p>
        )}

        {/* "see more" trigger */}
        {hasDetails && (
          <div
            className="mt-4 flex items-center gap-1 cursor-pointer w-fit"
            onMouseEnter={() => setExpanded(true)}
            onMouseLeave={() => !confirmDelete && setExpanded(false)}
          >
            <span className="font-hand text-sm text-orchid">
              {expanded ? 'less' : 'see more'}
            </span>
            <motion.span
              animate={{ x: expanded ? 4 : 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="text-orchid text-sm"
            >
              →
            </motion.span>
          </div>
        )}
      </motion.div>

      {/* ── Right: details panel — slides in ── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            key="details"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 200, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="overflow-hidden flex-shrink-0"
            onHoverStart={() => setExpanded(true)}
            onHoverEnd={() => !confirmDelete && setExpanded(false)}
          >
            <div className="w-[200px] h-full flex flex-col justify-between p-5 border-l border-sunflower/30">
              {/* Story */}
              <div>
                {pin.story ? (
                  <p className="font-hand text-sm text-chocolate leading-relaxed">
                    {pin.story}
                  </p>
                ) : (
                  <p className="font-hand text-sm text-chocolate/30 italic">
                    no story yet
                  </p>
                )}

                <p className="font-hand text-xs text-chocolate/20 mt-3">
                  {pin.lat.toFixed(3)}, {pin.lng.toFixed(3)}
                </p>
              </div>

              {/* Delete — owner only */}
              {isOwner && (
                <div className="mt-4">
                  <AnimatePresence mode="wait">
                    {!confirmDelete ? (
                      <motion.button
                        key="btn"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setConfirmDelete(true)}
                        className="font-hand text-xs text-chocolate/30 hover:text-red-400 transition"
                      >
                        🗑 remove pin
                      </motion.button>
                    ) : (
                      <motion.div
                        key="confirm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-1"
                      >
                        <p className="font-hand text-xs text-red-400">remove this pin?</p>
                        <div className="flex gap-3">
                          <button
                            onClick={() => setConfirmDelete(false)}
                            disabled={deleting}
                            className="font-hand text-xs text-chocolate/40 hover:text-chocolate transition"
                          >
                            keep
                          </button>
                          <button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="font-hand text-xs text-red-400 hover:text-red-600 font-medium transition"
                          >
                            {deleting ? '…' : 'yes'}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── Main MapView ───────────────────────────────────────────
interface MapViewProps {
  pins: MapPin[]
  addMode: boolean
  onMapClick: (lat: number, lng: number) => void
  onUpdate: () => void
  loading: boolean
}

export default function MapView({ pins, addMode, onMapClick, onUpdate, loading }: MapViewProps) {
  const [activePin, setActivePin] = useState<MapPin | null>(null)
  const [popupPos, setPopupPos] = useState<{ x: number; y: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMarkerClick = (pin: MapPin, e: L.LeafletMouseEvent) => {
    setActivePin(pin)
    setPopupPos({
      x: e.containerPoint.x,
      y: e.containerPoint.y - 44,
    })
  }

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-cream">
        <p className="font-hand text-orchid text-xl">loading the map… 🗺</p>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <MapContainer
        center={[17.3850, 78.4867]}
        zoom={12}
        style={{ width: '100%', height: '100%' }}
        className={addMode ? 'cursor-crosshair' : ''}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ClickHandler
          enabled={addMode}
          onMapClick={onMapClick}
          onClose={() => setActivePin(null)}
        />

        {pins.map((pin) => (
          <Marker
            key={pin.id}
            position={[pin.lat, pin.lng]}
            icon={pinIcon(pin.pin_type)}
            eventHandlers={{
              click: (e) => handleMarkerClick(pin, e as L.LeafletMouseEvent),
            }}
          />
        ))}
      </MapContainer>

      {/* Popup — floats above the map, anchored to pin position */}
      <AnimatePresence>
        {activePin && popupPos && (
          <motion.div
            key={activePin.id}
            initial={{ opacity: 0, scale: 0.92, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 6 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            className="absolute z-[1000] pointer-events-auto"
            style={{
              left: popupPos.x,
              top: popupPos.y,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <PinPopup
              pin={activePin}
              onClose={() => setActivePin(null)}
              onDelete={() => { setActivePin(null); onUpdate() }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}