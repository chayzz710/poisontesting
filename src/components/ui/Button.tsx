import { cn } from '../../lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger'
  size?: 'sm' | 'md'
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        variant === 'primary' && 'btn-primary',
        variant === 'ghost'   && 'btn-ghost',
        variant === 'danger'  && 'btn-danger',
        size === 'sm' && 'text-sm px-3 py-1.5',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
