import { useState } from 'react'

interface RiptidePenProps {
  className?: string
}

export default function RiptidePen({ className = '' }: RiptidePenProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <span
      className={`inline-block cursor-default transition-all duration-300 select-none ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={hovered ? 'Riptide ⚔️' : undefined}
      style={{ transform: hovered ? 'rotate(-20deg) scale(1.3)' : 'none' }}
    >
      {hovered ? '⚔️' : '🖊️'}
    </span>
  )
}
