import { useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { useUser } from '../../../lib/auth'
import { Modal } from '../../ui/Modal'
import { Button } from '../../ui/Button'
import { Input, Textarea } from '../../ui/Input'
import { toast } from 'sonner'

interface AddPinModalProps {
  lat: number
  lng: number
  onClose: () => void
  onSuccess: () => void
}

const PIN_TYPES = [
  { value: 'first_date', label: '💛 first date' },
  { value: 'favourite',  label: '🌻 favourite' },
  { value: 'adventure',  label: '🐸 adventure' },
  { value: 'default',    label: '📍 other' },
]

export default function AddPinModal({ lat, lng, onClose, onSuccess }: AddPinModalProps) {
  const { user } = useUser()
  const [title, setTitle] = useState('')
  const [story, setStory] = useState('')
  const [pinType, setPinType] = useState('default')
  const [visitedOn, setVisitedOn] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!title.trim() || !user) return
    setSaving(true)
    try {
      const { error } = await supabase.from('map_pins').insert({
        added_by: user.id,
        lat,
        lng,
        title: title.trim(),
        story: story.trim() || null,
        pin_type: pinType,
        visited_on: visitedOn || null,
      })
      if (error) throw error
      toast.success('pin dropped! 📍')
      onSuccess()
    } catch {
      toast.error('could not save — try again')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={true} onClose={onClose} title="drop a pin">
      <div className="space-y-4">
        <p className="font-hand text-xs text-chocolate/40">
          {lat.toFixed(4)}, {lng.toFixed(4)}
        </p>

        <Input
          label="what's this place?"
          placeholder="e.g. where we had our first coffee"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Textarea
          label="the story (optional)"
          placeholder="what happened here…"
          value={story}
          onChange={(e) => setStory(e.target.value)}
          rows={3}
        />

        {/* Pin type */}
        <div>
          <p className="text-sm font-medium text-chocolate/70 mb-2">type</p>
          <div className="flex flex-wrap gap-2">
            {PIN_TYPES.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setPinType(value)}
                className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                  pinType === value
                    ? 'bg-sunflower text-chocolate font-medium'
                    : 'bg-white border border-sunflower/30 text-chocolate/60 hover:border-sunflower'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <Input
          label="when did you visit?"
          type="date"
          value={visitedOn}
          onChange={(e) => setVisitedOn(e.target.value)}
        />

        <div className="flex gap-3 justify-end pt-1">
          <Button variant="ghost" onClick={onClose} disabled={saving}>cancel</Button>
          <Button variant="primary" onClick={handleSave} disabled={!title.trim() || saving}>
            {saving ? 'saving…' : 'drop it 📍'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
