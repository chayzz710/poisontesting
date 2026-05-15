import { useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { useUser } from '../../../lib/auth'
import { Modal } from '../../ui/Modal'
import { Button } from '../../ui/Button'
import { Textarea } from '../../ui/Input'
import { ChocolateRating } from '../../ui/ChocolateRating'
import { toast } from 'sonner'

interface AddNoteModalProps {
  onClose: () => void
  onSuccess: () => void
}

export default function AddNoteModal({ onClose, onSuccess }: AddNoteModalProps) {
  const { user } = useUser()
  const [body, setBody] = useState('')
  const [chocolateRating, setChocolateRating] = useState(0)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!body.trim() || !user) return
    setSaving(true)
    try {
      const { error } = await supabase.from('memory_jar_notes').insert({
        author_id: user.id,
        body: body.trim(),
        chocolate_rating: chocolateRating || null,
      })
      if (error) throw error
      toast.success('note added to the jar 🥚')
      onSuccess()
    } catch {
      toast.error('could not save — try again')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={true} onClose={onClose} title="add a memory">
      <div className="space-y-4">
        <Textarea
          label="what do you want to remember?"
          placeholder="that time when…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={5}
        />
        <ChocolateRating value={chocolateRating} onChange={setChocolateRating} />
        <div className="flex gap-3 justify-end pt-1">
          <Button variant="ghost" onClick={onClose} disabled={saving}>cancel</Button>
          <Button variant="primary" onClick={handleSave} disabled={!body.trim() || saving}>
            {saving ? 'adding…' : 'drop it in 🥚'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
