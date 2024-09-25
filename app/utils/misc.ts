import type { NavigateFunction } from '@remix-run/react'
import { type ClassValue, clsx } from 'clsx'
import type { TFunction } from 'i18next'
import _ from 'lodash'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'

/**
 * Tailwind CSS classnames with support for conditional classes.
 * Widely used for Radix components.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getApiUrl = () => {
  return process.env.API_URL
}

export const getApiProjectViewerUrl = () => {
  return process.env.API_PROJECT_VIEWER_URL
}

export const getSearchParams = (params: Record<string, string>) => {
  return _.omit(params, ['page', 'size'])
}

export const getPaginationFromParams = (params: Record<string, string>) => {
  const defaults = {
    page: 1,
    size: 10,
  }

  if (!params) return defaults

  let page = Number.parseInt(params.page, 10)
  let size = Number.parseInt(params.size, 10)

  page = Number.isNaN(page) || page <= 0 ? defaults.page : page
  size = Number.isNaN(size) || size <= 0 ? defaults.size : size

  if (size > 100) size = 100

  return {
    page,
    size,
  }
}

export const handleApiError = async (
  err: any,
  t: TFunction,
  navigate?: NavigateFunction,
  envs?: any,
) => {
  if (!err) return
  if (!err.response) return toast.error(err.message || t?.('error.UnexpectedError'))

  if (err.response.status === 401) {
    if (navigate && envs?.auth?.loginPath) {
      return navigate(envs.auth.loginPath)
    }

    return toast.error(t?.('error.PleaseLogin'))
  }

  try {
    const body: any = await err.response.json()
    if (body.error?.message) return toast.error(body.error.message)
  } catch (err) {}

  return toast.error(t?.('error.UnexpectedError'))
}
