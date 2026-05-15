import { useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { useUser } from '../../../lib/auth'
import { Modal } from '../../ui/Modal'
import { Button } from '../../ui/Button'
import { Input, Textarea } from '../../ui/Input'
import { toast } from 'sonner'

interface WriteLetterModalProps {
  onClose: () => void
  onSuccess: () => void
}

export default function WriteLetterModal({ onClose, onSuccess }: WriteLetterModalProps) {
  const { user } = useUser()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [isOpenWhen, setIsOpenWhen] = useState(false)
  const [unlockCondition, setUnlockCondition] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!title.trim() || !body.trim() || !user) return
    setSaving(true)
    try {
      const { error } = await supabase.from('letters').insert({
        author_id: user.id,
        title: title.trim(),
        body: body.trim(),
        is_open_when: isOpenWhen,
        unlock_condition: isOpenWhen ? unlockCondition.trim() || null : null,
      })
      if (error) throw error
      toast.success('letter sealed 💌')
      onSuccess()
    } catch {
      toast.error('could not save — try again')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={true} onClose={onClose} title="write a letter">
      <div className="space-y-4">
        <Input
          label="title"
          placeholder="e.g. open when you miss me"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Textarea
          label="your letter"
          placeholder="dear you…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={7}
        />

        {/* Open When toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsOpenWhen(!isOpenWhen)}
            className={`
              w-10 h-6 rounded-full transition-colors relative
              ${isOpenWhen ? 'bg-orchid' : 'bg-chocolate/20'}
            `}
          >
            <span
              className={`
                absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all
                ${isOpenWhen ? 'left-5' : 'left-1'}
              `}
            />
          </button>
          <span className="text-sm text-chocolate/70 font-medium">
            🔒 "open when…" letter
          </span>
        </div>

        {isOpenWhen && (
          <Input
            label="when should this be opened?"
            placeholder="e.g. you're having a hard day"
            value={unlockCondition}
            onChange={(e) => setUnlockCondition(e.target.value)}
          />
        )}

        <div className="flex gap-3 justify-end pt-1">
          <Button variant="ghost" onClick={onClose} disabled={saving}>cancel</Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!title.trim() || !body.trim() || saving}
          >
            {saving ? 'sealing…' : 'seal & send 💌'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
