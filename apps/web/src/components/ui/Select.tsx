import { forwardRef } from 'react'

interface Option {
  value: string
  label: string
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: Option[]
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className = '', ...props }, ref) => {
    return (
      <div className={className}>
        {label && (
          <label className="label" htmlFor={props.id}>
            {label}
            {props.required && <span className="text-brand-rose"> *</span>}
          </label>
        )}
        <select
          ref={ref}
          className={`select ${error ? 'border-brand-rose' : ''}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-xs text-brand-rose">{error}</p>}
      </div>
    )
  },
)

Select.displayName = 'Select'
