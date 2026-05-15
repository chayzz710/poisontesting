import { useEffect, useState } from 'react'

export function useRiptide() {
  const [triggered, setTriggered] = useState(false)
  const target = 'riptide'

  useEffect(() => {
    let typed = ''

    const handler = (e: KeyboardEvent) => {
      // ignore when typing in an input/textarea
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      typed += e.key.toLowerCase()
      if (typed.length > target.length) {
        typed = typed.slice(-target.length)
      }
      if (typed === target) {
        setTriggered(true)
        typed = ''
        setTimeout(() => setTriggered(false), 1500)
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return triggered
}
