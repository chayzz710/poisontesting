import { useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { useUser } from '../../../lib/auth'
import { parseSpotifyTrackId } from '../../../lib/utils'
import { Modal } from '../../ui/Modal'
import { Button } from '../../ui/Button'
import { Input, Textarea } from '../../ui/Input'
import { toast } from 'sonner'

interface AddSongModalProps {
  onClose: () => void
  onSuccess: () => void
}

export default function AddSongModal({ onClose, onSuccess }: AddSongModalProps) {
  const { user } = useUser()
  const [url, setUrl] = useState('')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)

  const trackId = parseSpotifyTrackId(url)
  const isValid = !!trackId

  const handleSave = async () => {
    if (!trackId || !user) return
    setSaving(true)
    try {
      const { error } = await supabase.from('songs').insert({
        added_by: user.id,
        spotify_track_id: trackId,
        note: note.trim() || null,
      })
      if (error) throw error
      toast.success('song added 🎵')
      onSuccess()
    } catch {
      toast.error('could not save — try again')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={true} onClose={onClose} title="add a song">
      <div className="space-y-4">
        <Input
          label="spotify link"
          placeholder="https://open.spotify.com/track/..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        {/* Preview embed once URL is valid */}
        {isValid && (
          <iframe
            src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator`}
            width="100%"
            height="80"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded-xl"
          />
        )}

        <Textarea
          label="why does this song matter? (optional)"
          placeholder="this played when we…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
        />

        <div className="flex gap-3 justify-end pt-1">
          <Button variant="ghost" onClick={onClose} disabled={saving}>cancel</Button>
          <Button variant="primary" onClick={handleSave} disabled={!isValid || saving}>
            {saving ? 'adding…' : 'add it 🎵'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
