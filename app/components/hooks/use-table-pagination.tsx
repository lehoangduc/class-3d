import type { PaginationState } from '@tanstack/react-table'
import { useEffect, useRef, useState } from 'react'

export default function useTablePagination({
  pageSize,
  pageIndex,
  onPageChange,
}: {
  pageSize?: number
  pageIndex?: number
  onPageChange?: (pageIndex: number, pageSize: number) => void
}) {
  const rendered = useRef(false)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: pageIndex || 0,
    pageSize: pageSize || 10,
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    if (rendered.current) {
      onPageChange?.(pagination.pageIndex, pagination.pageSize)
    } else {
      rendered.current = true
    }
  }, [pagination.pageIndex, pagination.pageSize])

  return { pagination, setPagination }
}
