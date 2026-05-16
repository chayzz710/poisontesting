import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const GATE_PASSWORD = import.meta.env.VITE_SHARED_GATE_PASSWORD as string

export default function GatePage() {
  const [value, setValue] = useState('')
  const [shake, setShake] = useState(false)
  const [error, setError] = useState(false)
  const navigate = useNavigate()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (value === GATE_PASSWORD) {
      sessionStorage.setItem('gate', 'ok')
      navigate('/')
    } else {
      setError(true)
      setShake(true)
      setTimeout(() => setShake(false), 500)
      setTimeout(() => setError(false), 2000)
      setValue('')
    }
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-8 px-4">
      {/* Sunflower */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-6xl"
      >
        🌻
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <h1 className="font-display text-4xl text-chocolate mb-2">our little corner</h1>
        <p className="font-hand text-orchid-deep text-xl">just for two 💛</p>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        animate={shake ? { x: [-8, 8, -8, 8, 0] } : { x: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-4 w-full max-w-xs"
      >
        <input
          type="password"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="the magic word…"
          className={`input-base text-center font-hand text-lg ${error ? 'ring-2 ring-red-300' : ''}`}
          autoFocus
        />
        {error && (
          <p className="text-red-500 font-hand text-sm">
            hmm, that's not it 🐸
          </p>
        )}
        <button type="submit" className="btn-primary w-full">
          come in 🦖
        </button>
      </motion.form>

      <p className="text-chocolate/30 text-xs font-hand absolute bottom-6">
        🐸 one frog per page
      </p>
    </div>
  )
}
