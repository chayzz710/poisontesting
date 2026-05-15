interface ChocolateBarProps {
  className?: string
}

export default function ChocolateBar({ className = '' }: ChocolateBarProps) {
  return (
    <div className={`flex items-center gap-2 my-6 ${className}`}>
      <div className="flex-1 h-0.5 bg-chocolate/10 rounded-full" />
      <span className="text-sm">🍫</span>
      <div className="flex-1 h-0.5 bg-chocolate/10 rounded-full" />
    </div>
  )
}
