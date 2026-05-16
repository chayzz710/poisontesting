import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useUser } from '../lib/auth'
import { upsertProfile } from '../lib/db'
import { supabase } from '../lib/supabase'
import { Input, Textarea } from '../components/ui/Input'
import Button from '../components/ui/Button'
import SunflowerDivider from '../components/motifs/SunflowerDivider'

const LOVE_LANGUAGES = [
  'Words of Affirmation',
  'Acts of Service',
  'Receiving Gifts',
  'Quality Time',
  'Physical Touch',
]

const schema = z.object({
  display_name: z.string().min(1, 'What should we call you?'),
  nickname: z.string().optional(),
  bio: z.string().optional(),
  love_language: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function SetupPage() {
  const { user } = useUser()
  const navigate = useNavigate()
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [favThings, setFavThings] = useState(['', '', ''])
  const [selectedLang, setSelectedLang] = useState<string>('')

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  async function onSubmit(data: FormData) {
    if (!user) return
    setUploading(true)

    try {
      let avatar_url: string | undefined

      if (avatarFile) {
        const ext = avatarFile.name.split('.').pop()
        const path = `${user.id}.${ext}`
        const { error } = await supabase.storage
          .from('avatars')
          .upload(path, avatarFile, { upsert: true })
        if (!error) {
          const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path)
          avatar_url = urlData.publicUrl
        }
      }

      await upsertProfile({
        id: user.id,
        display_name: data.display_name,
        nickname: data.nickname || undefined,
        bio: data.bio || undefined,
        love_language: data.love_language || undefined,
        fav_things: favThings.filter(Boolean),
        ...(avatar_url && { avatar_url }),
      })

      toast('profile saved 💛')
      navigate('/')
    } catch (err) {
      toast.error('something went wrong, try again')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center py-16 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🌻</div>
          <h1 className="font-display text-4xl text-chocolate mb-2">hello, you</h1>
          <p className="font-hand text-orchid-deep text-xl">let's set up your little corner</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="card flex flex-col gap-5">

          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-sunflower/20 border-2 border-sunflower/40 flex items-center justify-center text-4xl">
              {avatarPreview
                ? <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                : '🐱'
              }
            </div>
            <label className="btn-ghost text-sm cursor-pointer">
              pick a photo
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </label>
          </div>

          <SunflowerDivider />

          <Input
            label="your name"
            placeholder="what should we call you?"
            error={errors.display_name?.message}
            {...register('display_name')}
          />

          <Input
            label="nickname (optional)"
            placeholder="what does the other person call you?"
            {...register('nickname')}
          />

          <Textarea
            label="a little bio (optional)"
            placeholder="a sentence or two about you…"
            rows={3}
            {...register('bio')}
          />

          {/* Love language */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-chocolate/70">love language (optional)</label>
            <div className="flex flex-wrap gap-2">
              {LOVE_LANGUAGES.map(lang => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => {
                    setSelectedLang(lang)
                    setValue('love_language', lang)
                  }}
                  className={`px-3 py-1.5 rounded-full border text-sm font-hand transition cursor-pointer ${
                    selectedLang === lang
                      ? 'bg-sunflower border-sunflower text-chocolate'
                      : 'border-chocolate/20 text-chocolate/70 hover:border-sunflower hover:text-chocolate'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Fav things */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-chocolate/70">3 favourite things (optional)</label>
            <div className="flex flex-col gap-2">
              {favThings.map((val, i) => (
                <input
                  key={i}
                  value={val}
                  onChange={e => {
                    const next = [...favThings]
                    next[i] = e.target.value
                    setFavThings(next)
                  }}
                  placeholder={['sunflowers 🌻', 'chess ♟️', 'kinder joy 🥚'][i]}
                  className="input-base text-sm"
                />
              ))}
            </div>
          </div>

          <Button type="submit" disabled={uploading} className="w-full mt-2">
            {uploading ? 'saving…' : "i'm ready 💛"}
          </Button>
        </form>
      </motion.div>
    </div>
  )
}
