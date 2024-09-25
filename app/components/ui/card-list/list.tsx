import { type VariantProps, cva } from 'class-variance-authority'
import { type ReactNode, createContext } from 'react'

import { cn } from '@/utils/misc'

const listVariants = cva(
  'group/card-list w-full flex flex-col transition-[gap,opacity] min-w-0',
  {
    variants: {
      variant: {
        compact: 'gap-0',
        loose: 'gap-4',
      },
      loading: {
        true: 'opacity-50',
      },
    },
    defaultVariants: {
      variant: 'loose',
      loading: false,
    },
  },
)

interface CardListProps extends VariantProps<typeof listVariants> {
  children: ReactNode
  loading?: boolean
  className?: string
}

const CardListContext = createContext<Pick<CardListProps, 'variant'>>({
  variant: 'loose',
})

const CardList = ({
  children,
  variant = 'loose',
  loading = false,
  className,
}: CardListProps) => {
  return (
    <ul
      className={cn(listVariants({ variant, loading }), className)}
      data-variant={variant}
    >
      <CardListContext.Provider value={{ variant }}>{children}</CardListContext.Provider>
    </ul>
  )
}

export { CardListContext, CardList }
