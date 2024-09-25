import type { PaginationState } from '@tanstack/react-table'
import type { TFunction } from 'i18next'
import type { PropsWithChildren } from 'react'
import { withTranslation } from 'react-i18next'

import { cn } from '@/utils/misc'
import { nFormatter } from '@/utils/nformatter'
import { Button } from '../ui/button'

const buttonClassName = cn(
  'flex h-7 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-gray-200 bg-white px-2 text-sm text-gray-600',
  'outline-none hover:bg-gray-50 focus-visible:border-gray-500',
  'disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400 disabled:bg-gray-100',
)

const PaginationControls = withTranslation()(
  ({
    t,
    pagination,
    setPagination,
    totalCount,
    unit = (p) => `item${p ? 's' : ''}`,
    className,
    children,
    disabled,
  }: PropsWithChildren<{
    t: TFunction
    pagination: PaginationState
    setPagination: (pagination: PaginationState) => void
    totalCount: number
    unit?: string | ((plural: boolean) => string)
    className?: string
    disabled?: boolean
  }>) => {
    return (
      <div
        className={cn(
          'flex items-center justify-between gap-2 text-sm leading-6 text-gray-600',
          className,
        )}
      >
        <div className="flex items-center gap-2">
          <div>
            <span className="hidden sm:inline-block">{t('common.Viewing')}</span>{' '}
            {totalCount > 0 && (
              <>
                <span className="font-medium">
                  {pagination.pageIndex * pagination.pageSize + 1}-
                  {Math.min(
                    pagination.pageIndex * pagination.pageSize + pagination.pageSize,
                    totalCount,
                  )}
                </span>{' '}
                {t('common.of')}{' '}
              </>
            )}
            <span className="font-medium">{nFormatter(totalCount, { full: true })}</span>{' '}
            {typeof unit === 'function' ? unit(totalCount !== 1) : unit}
          </div>
          {children}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className={buttonClassName}
            text={t('common.Previous')}
            onClick={() =>
              setPagination({
                ...pagination,
                pageIndex: pagination.pageIndex - 1,
              })
            }
            disabled={disabled || pagination.pageIndex === 0}
          />
          <Button
            variant="outline"
            className={buttonClassName}
            text={t('common.Next')}
            onClick={() =>
              setPagination({
                ...pagination,
                pageIndex: pagination.pageIndex + 1,
              })
            }
            disabled={
              disabled ||
              pagination.pageIndex * pagination.pageSize + pagination.pageSize >=
                totalCount
            }
          />
        </div>
      </div>
    )
  },
)

export default PaginationControls
