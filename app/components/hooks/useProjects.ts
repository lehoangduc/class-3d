import { useNavigate } from '@remix-run/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import ProjectsService from '@/modules/projects/service.client'
import { handleApiError } from '@/utils/misc'
import type { PaginationOptions } from '@/utils/types'
import { useAppContext } from '../providers/app'

export default function useProjects() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const queryKey = ['projects']
  const settings = useRef({
    filter: {},
    pagination: {},
  })
  const { envs } = useAppContext()

  const refresh = () => queryClient.invalidateQueries({ queryKey })

  const load = ({
    filter,
    pagination,
  }: { filter?: Record<string, unknown>; pagination?: PaginationOptions }) => {
    if (filter !== undefined) {
      settings.current.filter = filter || {}
    }

    if (pagination !== undefined) {
      settings.current.pagination = pagination || {}
    }

    refresh()
  }

  const { isLoading, isFetching, error, data } = useQuery({
    queryKey,
    queryFn: () =>
      ProjectsService.find(settings.current.filter, settings.current.pagination),
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    handleApiError(error, t, navigate, envs)
  }, [error])

  return {
    isLoading: isLoading || isFetching,
    data,
    refresh,
    load,
  }
}
