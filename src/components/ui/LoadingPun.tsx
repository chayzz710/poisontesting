import { useMemo } from 'react'
import { randomMessage } from '../../data/loadingMessages'

export default function LoadingPun() {
  const message = useMemo(() => randomMessage(), [])
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="text-5xl animate-tilt">🌻</div>
      <p className="font-hand text-orchid-deep text-xl text-center max-w-xs">{message}</p>
    </div>
  )
}
