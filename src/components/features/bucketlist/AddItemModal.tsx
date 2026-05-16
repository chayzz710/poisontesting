import { useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { useUser } from '../../../lib/auth'
import { Modal } from '../../ui/Modal'
import { Button } from '../../ui/Button'
import { Input, Textarea } from '../../ui/Input'
import { toast } from 'sonner'

interface AddItemModalProps {
  onClose: () => void
  onSuccess: () => void
}

export default function AddItemModal({ onClose, onSuccess }: AddItemModalProps) {
  const { user } = useUser()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!title.trim() || !user) return
    setSaving(true)
    try {
      const { error } = await supabase.from('bucket_items').insert({
        added_by: user.id,
        title: title.trim(),
        description: description.trim() || null,
      })
      if (error) throw error
      toast.success('added to the list! ✨')
      onSuccess()
    } catch {
      toast.error('could not save — try again')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={true} onClose={onClose} title="add something">
      <div className="space-y-4">
        <Input
          label="what do you want to do?"
          placeholder="e.g. watch a meteor shower together"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Textarea
          label="any details? (optional)"
          placeholder="where, when, why…"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
        <div className="flex gap-3 justify-end pt-1">
          <Button variant="ghost" onClick={onClose} disabled={saving}>cancel</Button>
          <Button variant="primary" onClick={handleSave} disabled={!title.trim() || saving}>
            {saving ? 'adding…' : 'add it 🦖'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
