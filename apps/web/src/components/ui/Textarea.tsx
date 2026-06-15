import { forwardRef } from 'react'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className={className}>
        {label && (
          <label className="label" htmlFor={props.id}>
            {label}
            {props.required && <span className="text-brand-rose"> *</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={`textarea ${error ? 'border-brand-rose' : ''}`}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-brand-rose">{error}</p>}
      </div>
    )
  },
)

Textarea.displayName = 'Textarea'
