import { cn } from '../../lib/utils'
import { forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-sm font-medium text-chocolate/70">{label}</label>}
      <input
        ref={ref}
        className={cn('input-base', error && 'ring-2 ring-red-300', className)}
        {...props}
      />
      {error && <p className="text-xs text-red-500 font-hand">{error}</p>}
    </div>
  )
)
Input.displayName = 'Input'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-sm font-medium text-chocolate/70">{label}</label>}
      <textarea
        ref={ref}
        rows={4}
        className={cn('input-base resize-none', error && 'ring-2 ring-red-300', className)}
        {...props}
      />
      {error && <p className="text-xs text-red-500 font-hand">{error}</p>}
    </div>
  )
)
Textarea.displayName = 'Textarea'
