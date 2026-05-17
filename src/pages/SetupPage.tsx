import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
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

const EMOJI_AVATARS = [
  '🐱', '🦖', '🧑‍💻', '🧑‍🎓', '👽', '🧙', '🦸', '🐸', '🌻', '♟️', '🧑‍🎨', '☀️', '🌙',
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
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null)
  const [showEmojiGrid, setShowEmojiGrid] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [favThings, setFavThings] = useState(['', '', ''])
  const [selectedLang, setSelectedLang] = useState<string>('')

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  // Preload existing profile on mount
  useEffect(() => {
    if (!user) return
    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          reset({
            display_name: data.display_name ?? '',
            nickname: data.nickname ?? '',
            bio: data.bio ?? '',
            love_language: data.love_language ?? '',
          })
          setSelectedLang(data.love_language ?? '')
          setFavThings(
            data.fav_things?.length
              ? [...data.fav_things, ...['', '', '']].slice(0, 3)
              : ['', '', '']
          )
          // If existing avatar is an emoji, preselect it
          if (data.avatar_url && !data.avatar_url.startsWith('http')) {
            setSelectedEmoji(data.avatar_url)
          }
          // If it's a photo url, show it as preview
          if (data.avatar_url && data.avatar_url.startsWith('http')) {
            setAvatarPreview(data.avatar_url)
          }
        }
        setLoadingProfile(false)
      })
  }, [user, reset])

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
    setSelectedEmoji(null)
    setShowEmojiGrid(false)
  }

  function handleEmojiPick(emoji: string) {
    setSelectedEmoji(emoji)
    setAvatarFile(null)
    setAvatarPreview(null)
    setShowEmojiGrid(false)
  }

  const avatarDisplay = avatarPreview
    ? <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
    : <span className="text-5xl">{selectedEmoji ?? '🐱'}</span>

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
      } else if (selectedEmoji) {
        avatar_url = selectedEmoji
      } else if (avatarPreview) {
        // kept existing photo url — pass it through unchanged
        avatar_url = avatarPreview
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
      navigate(-1)
    } catch {
      toast.error('something went wrong, try again')
    } finally {
      setUploading(false)
    }
  }

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-5xl animate-tilt">🌻</div>
      </div>
    )
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
            <div className="w-24 h-24 rounded-full overflow-hidden bg-sunflower/20 border-2 border-sunflower/40 flex items-center justify-center">
              {avatarDisplay}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowEmojiGrid(v => !v)}
                className="btn-ghost text-sm"
              >
                {selectedEmoji && !avatarPreview ? `${selectedEmoji} change avatar` : 'pick an avatar'}
              </button>
              <label className="btn-ghost text-sm cursor-pointer">
                upload a photo
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>
            </div>

            <AnimatePresence>
              {showEmojiGrid && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-wrap justify-center gap-2 pt-1">
                    {EMOJI_AVATARS.map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => handleEmojiPick(emoji)}
                        className={`w-10 h-10 rounded-full text-xl flex items-center justify-center transition-all border-2 ${
                          selectedEmoji === emoji
                            ? 'border-orchid bg-orchid/10 scale-110'
                            : 'border-transparent hover:border-sunflower hover:scale-105'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {avatarPreview && (
              <button
                type="button"
                className="text-xs text-chocolate/40 hover:text-chocolate/70 transition"
                onClick={() => { setAvatarPreview(null); setAvatarFile(null) }}
              >
                remove photo
              </button>
            )}
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
                  className={`px-3 py-1.5 rounded-full border text-sm font-hand transition cursor-pointer whitespace-nowrap ${
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
            {uploading ? 'saving…' : "save 💛"}
          </Button>
        </form>
      </motion.div>
    </div>
  )
}