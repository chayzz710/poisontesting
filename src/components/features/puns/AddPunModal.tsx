import { useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { useUser } from '../../../lib/auth'
import { Modal } from '../../ui/Modal'
import { Button } from '../../ui/Button'
import { Textarea } from '../../ui/Input'
import { toast } from 'sonner'

interface AddPunModalProps {
  onClose: () => void
  onSuccess: () => void
}

export default function AddPunModal({ onClose, onSuccess }: AddPunModalProps) {
  const { user } = useUser()
  const [body, setBody] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!body.trim() || !user) return
    setSaving(true)
    try {
      const { error } = await supabase.from('puns').insert({
        author_id: user.id,
        body: body.trim(),
      })
      if (error) throw error
      toast.success('pun deployed 😩')
      onSuccess()
    } catch {
      toast.error('could not save — try again')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={true} onClose={onClose} title="drop a pun">
      <div className="space-y-4">
        <Textarea
          label="your pun"
          placeholder="I'm reading a book about anti-gravity… it's impossible to put down 📚"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
        />
        <p className="font-hand text-xs text-chocolate/40">
          the other person will rate it. brace yourself.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={onClose} disabled={saving}>cancel</Button>
          <Button variant="primary" onClick={handleSave} disabled={!body.trim() || saving}>
            {saving ? 'unleashing…' : 'unleash it 😩'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
