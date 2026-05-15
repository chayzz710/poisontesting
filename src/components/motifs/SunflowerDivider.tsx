interface SunflowerDividerProps {
  className?: string
}

export default function SunflowerDivider({ className = '' }: SunflowerDividerProps) {
  return (
    <div className={`flex items-center gap-3 my-8 ${className}`}>
      <div className="flex-1 h-px bg-sunflower/40" />
      <span className="text-2xl animate-tilt inline-block">🌻</span>
      <div className="flex-1 h-px bg-sunflower/40" />
    </div>
  )
}

export { SunflowerDivider }