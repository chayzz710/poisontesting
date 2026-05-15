interface ChocolateRatingProps {
  value: number | null
  onChange?: (v: number) => void
  readonly?: boolean
}

const BARS = ['🍫', '🍫🍫', '🍫🍫🍫', '🍫🍫🍫🍫', '🍫🍫🍫🍫🍫']
const LABELS = ['meh', 'decent', 'good', 'great', 'perfection']

export default function ChocolateRating({ value, onChange, readonly = false }: ChocolateRatingProps) {
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(n)}
          title={LABELS[n - 1]}
          className={`text-lg transition-all duration-150 ${
            readonly ? 'cursor-default' : 'hover:scale-125 cursor-pointer'
          } ${value != null && n <= value ? 'opacity-100' : 'opacity-25'}`}
        >
          🍫
        </button>
      ))}
      {value != null && (
        <span className="font-hand text-sm text-chocolate/50 ml-1">{LABELS[value - 1]}</span>
      )}
    </div>
  )
}

export { BARS, LABELS }

export { ChocolateRating }