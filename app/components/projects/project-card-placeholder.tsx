import { useContext } from 'react'

import { cn } from '@/utils/misc'
import { CardList } from '../ui/card-list'

export default function ProjectCardPlaceholder() {
  const { variant } = useContext(CardList.Context)

  return (
    <>
      <div className="flex grow items-center gap-3">
        <div
          className={cn(
            'flex h-[60px] gap-x-2 gap-y-1 transition-[height]',
            variant === 'loose'
              ? 'h-[60px] flex-col justify-center'
              : 'h-[32px] flex-row items-center',
          )}
        >
          <div className="h-5 w-32 animate-pulse rounded-md bg-gray-200 sm:w-44" />
          <div
            className={cn(
              'h-4 w-28 animate-pulse rounded-md bg-gray-200',
              variant === 'compact' && 'hidden sm:block',
            )}
          />
        </div>
      </div>
      <div className="flex items-center gap-5">
        <div className="h-6 w-16 animate-pulse rounded-md bg-gray-200" />
        <div className="hidden h-6 w-11 animate-pulse rounded-md bg-gray-200 sm:block" />
        <div className="hidden h-6 w-10 sm:block" />
      </div>
    </>
  )
}
