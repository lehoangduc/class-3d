import { EyeIcon, EyeOffIcon } from 'lucide-react'
import React, { useCallback, useState } from 'react'

import { cn } from '@/utils/misc'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)

    const toggleIsPasswordVisible = useCallback(
      () => setIsPasswordVisible(!isPasswordVisible),
      [isPasswordVisible],
    )

    return (
      <>
        <div className="relative">
          <input
            type={isPasswordVisible ? 'text' : type}
            className={cn(
              'flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
              className,
            )}
            ref={ref}
            {...props}
          />

          {type === 'password' && (
            <button
              className="absolute inset-y-0 right-0 flex items-center rounded-lg px-2.5"
              type="button"
              onClick={() => toggleIsPasswordVisible()}
              aria-label={isPasswordVisible ? 'Hide password' : 'Show Password'}
            >
              {isPasswordVisible ? (
                <EyeIcon
                  className="size-4 flex-none text-gray-500 transition hover:text-gray-700"
                  aria-hidden
                />
              ) : (
                <EyeOffIcon
                  className="size-4 flex-none text-gray-500 transition hover:text-gray-700"
                  aria-hidden
                />
              )}
            </button>
          )}

          {props.error && type !== 'password' && (
            <span
              className="block mt-1 text-xs text-red-600"
              role="alert"
              aria-live="assertive"
            >
              {props.error}
            </span>
          )}
        </div>

        {props.error && type === 'password' && (
          <span
            className="block mt-1 text-xs text-red-600"
            role="alert"
            aria-live="assertive"
          >
            {props.error}
          </span>
        )}
      </>
    )
  },
)
Input.displayName = 'Input'

export { type InputProps, Input }
