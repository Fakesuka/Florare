// components/ui/button.tsx

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-[rgb(var(--primary-rose))] text-white shadow-md hover:shadow-lg hover:bg-[rgb(var(--primary-rose))]/90 active:scale-95',
        secondary:
          'bg-[rgb(var(--accent-cream))] text-[rgb(var(--text-dark))] shadow-sm hover:shadow-md hover:bg-[rgb(var(--neutral-warm))] active:scale-95',
        outline:
          'border-2 border-[rgb(var(--primary-rose))] bg-transparent text-[rgb(var(--primary-rose))] hover:bg-[rgb(var(--primary-rose))] hover:text-white active:scale-95',
        ghost:
          'hover:bg-[rgb(var(--accent-cream))] hover:text-[rgb(var(--text-dark))] active:scale-95',
        link:
          'text-[rgb(var(--primary-rose))] underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-12 px-6 py-3',
        sm: 'h-10 px-4 py-2 text-sm',
        lg: 'h-14 px-8 py-4 text-base',
        xl: 'h-16 px-10 py-5 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
