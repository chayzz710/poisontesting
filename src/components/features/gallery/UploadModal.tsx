import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import imageCompression from 'browser-image-compression'
import { supabase } from '../../../lib/supabase'
import { useUser } from '../../../lib/auth'
import { Modal } from '../../ui/Modal'
import { Button } from '../../ui/Button'
import { Input, Textarea } from '../../ui/Input'
import { ChocolateRating } from '../../ui/ChocolateRating'
import { toast } from 'sonner'

interface UploadModalProps {
  onClose: () => void
  onSuccess: () => void
}

export default function UploadModal({ onClose, onSuccess }: UploadModalProps) {
  const { user } = useUser()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [caption, setCaption] = useState('')
  const [takenAt, setTakenAt] = useState('')
  const [chocolateRating, setChocolateRating] = useState<number>(0)
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      toast.error('please select an image file')
      return
    }
    setFile(selectedFile)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(selectedFile)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const dropped = e.dataTransfer.files[0]
      if (dropped) handleFile(dropped)
    },
    [handleFile]
  )

  const handleUpload = async () => {
    if (!file || !user) return

    setUploading(true)
    setProgress(10)

    try {
      // Compress client-side
      toast.info('compressing image… 🌻')
      const compressed = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      })
      setProgress(35)

      // Upload to Supabase storage
      const ext = file.name.split('.').pop() ?? 'jpg'
      const path = `${user.id}/${Date.now()}.${ext}`

      const { error: storageError } = await supabase.storage
        .from('photos')
        .upload(path, compressed, { contentType: compressed.type })

      if (storageError) throw storageError
      setProgress(70)

      // Insert DB row
      const { error: dbError } = await supabase.from('photos').insert({
        uploaded_by: user.id,
        storage_path: path,
        caption: caption.trim() || null,
        taken_at: takenAt || null,
        chocolate_rating: chocolateRating || null,
      })

      if (dbError) throw dbError
      setProgress(100)

      toast.success('photo added! 📸')
      onSuccess()
    } catch (err) {
      toast.error('upload failed — try again')
      console.error(err)
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  return (
    <Modal open={true} onClose={onClose} title="add a memory">
      <div className="space-y-5">
        {/* Drop zone */}
        {!preview ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all
              ${isDragging
                ? 'border-sunflower bg-sunflower/10 scale-[1.01]'
                : 'border-sunflower/40 hover:border-sunflower hover:bg-sunflower/5'
              }
            `}
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl">📷</span>
              <p className="font-hand text-orchid text-lg">drop a photo here</p>
              <p className="text-sm text-chocolate/40">or click to browse</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }}
            />
          </div>
        ) : (
          <div className="relative group">
            <img
              src={preview}
              alt="preview"
              className="w-full max-h-64 object-contain rounded-xl bg-chocolate/5"
            />
            <button
              onClick={() => { setFile(null); setPreview(null) }}
              className="absolute top-2 right-2 bg-white/90 rounded-full w-7 h-7 flex items-center justify-center text-sm shadow hover:bg-white transition"
            >
              ✕
            </button>
          </div>
        )}

        {/* Caption */}
        <Textarea
          label="caption"
          placeholder="what's happening here? 🌻"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          rows={2}
        />

        {/* Date */}
        <Input
          label="when was this taken?"
          type="date"
          value={takenAt}
          onChange={(e) => setTakenAt(e.target.value)}
        />

        {/* Chocolate rating */}
        <ChocolateRating value={chocolateRating} onChange={setChocolateRating} />

        {/* Progress bar */}
        <AnimatePresence>
          {uploading && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="w-full h-2 bg-sunflower/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-sunflower rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: 'easeOut' }}
                />
              </div>
              <p className="font-hand text-xs text-orchid text-center mt-1">
                {progress < 40 ? 'shrinking the photo…' : progress < 75 ? 'uploading…' : 'almost there…'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-1">
          <Button variant="ghost" onClick={onClose} disabled={uploading}>
            cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUpload}
            disabled={!file || uploading}
          >
            {uploading ? 'uploading…' : 'save memory ✨'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
