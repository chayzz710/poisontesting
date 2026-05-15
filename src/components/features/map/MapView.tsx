import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { MapPin } from '../../../types'

// Fix Leaflet default icon paths broken by Vite
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Custom emoji marker factory
function emojiIcon(emoji: string) {
  return L.divIcon({
    html: `<div style="font-size:28px;line-height:1;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.25))">${emoji}</div>`,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  })
}

const PIN_ICONS: Record<string, ReturnType<typeof emojiIcon>> = {
  first_date: emojiIcon('💛'),
  favourite:  emojiIcon('🌻'),
  adventure:  emojiIcon('🐸'),
  default:    emojiIcon('📍'),
}

function pinIcon(type: string | null) {
  return PIN_ICONS[type ?? 'default'] ?? PIN_ICONS.default
}

// Click handler component (must be inside MapContainer)
function ClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

interface MapViewProps {
  pins: MapPin[]
  addMode: boolean
  onMapClick: (lat: number, lng: number) => void
  onPinClick: (pin: MapPin) => void
  loading: boolean
}

export default function MapView({ pins, addMode, onMapClick, onPinClick, loading }: MapViewProps) {
  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-cream">
        <p className="font-hand text-orchid text-xl">loading the map… 🗺</p>
      </div>
    )
  }

  return (
    <MapContainer
      center={[17.3850, 78.4867]} // Centre of India — change to your city
      zoom={5}
      style={{ width: '100%', height: '100%' }}
      className={addMode ? 'cursor-crosshair' : ''}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <ClickHandler onMapClick={onMapClick} />

      {pins.map((pin) => (
        <Marker
          key={pin.id}
          position={[pin.lat, pin.lng]}
          icon={pinIcon(pin.pin_type)}
          eventHandlers={{ click: () => onPinClick(pin) }}
        >
          <Popup>
            <div className="font-body text-sm">
              <p className="font-semibold">{pin.title}</p>
              {pin.story && <p className="text-chocolate/60 mt-1">{pin.story}</p>}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
