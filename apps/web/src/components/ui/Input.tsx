import { forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className={className}>
        {label && (
          <label className="label" htmlFor={props.id}>
            {label}
            {props.required && <span className="text-brand-rose"> *</span>}
          </label>
        )}
        <input ref={ref} className={`input ${error ? 'border-brand-rose' : ''}`} {...props} />
        {error && <p className="mt-1 text-xs text-brand-rose">{error}</p>}
      </div>
    )
  },
)

Input.displayName = 'Input'
