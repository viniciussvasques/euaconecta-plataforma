import React from 'react'
import { AlertCircle } from 'lucide-react'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  variant?: 'default' | 'filled' | 'outlined'
}

export function FormInput({ 
  label, 
  error, 
  helperText, 
  leftIcon, 
  rightIcon, 
  variant = 'default',
  className = '',
  ...props 
}: FormInputProps) {
  const baseClasses = "w-full px-3 py-2.5 text-sm border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1"
  
  const variantClasses = {
    default: "border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500",
    filled: "border-transparent bg-gray-50 text-gray-900 placeholder-gray-500 focus:bg-white focus:border-blue-500 focus:ring-blue-500",
    outlined: "border-2 border-gray-300 bg-transparent text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
  }

  const errorClasses = error 
    ? "border-red-300 bg-red-50 text-red-900 placeholder-red-500 focus:border-red-500 focus:ring-red-500"
    : variantClasses[variant]

  const inputClasses = `${baseClasses} ${errorClasses} ${className}`

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-gray-400">
              {leftIcon}
            </div>
          </div>
        )}
        
        <input
          className={`${inputClasses} ${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''}`}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <div className="text-gray-400">
              {rightIcon}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center text-sm text-red-600">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}

      {helperText && !error && (
        <p className="text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  )
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helperText?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export function FormSelect({ 
  label, 
  error, 
  helperText, 
  options, 
  placeholder,
  className = '',
  ...props 
}: FormSelectProps) {
  const baseClasses = "w-full px-3 py-2.5 text-sm border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1"
  
  const defaultClasses = "border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500"
  const errorClasses = error 
    ? "border-red-300 bg-red-50 text-red-900 focus:border-red-500 focus:ring-red-500"
    : defaultClasses

  const selectClasses = `${baseClasses} ${errorClasses} ${className}`

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <select className={selectClasses} {...props}>
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <div className="flex items-center text-sm text-red-600">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}

      {helperText && !error && (
        <p className="text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  )
}

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  variant?: 'default' | 'filled' | 'outlined'
}

export function FormTextarea({ 
  label, 
  error, 
  helperText, 
  variant = 'default',
  className = '',
  ...props 
}: FormTextareaProps) {
  const baseClasses = "w-full px-3 py-2.5 text-sm border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 resize-vertical"
  
  const variantClasses = {
    default: "border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500",
    filled: "border-transparent bg-gray-50 text-gray-900 placeholder-gray-500 focus:bg-white focus:border-blue-500 focus:ring-blue-500",
    outlined: "border-2 border-gray-300 bg-transparent text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
  }

  const errorClasses = error 
    ? "border-red-300 bg-red-50 text-red-900 placeholder-red-500 focus:border-red-500 focus:ring-red-500"
    : variantClasses[variant]

  const textareaClasses = `${baseClasses} ${errorClasses} ${className}`

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        className={textareaClasses}
        {...props}
      />

      {error && (
        <div className="flex items-center text-sm text-red-600">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}

      {helperText && !error && (
        <p className="text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  )
}
