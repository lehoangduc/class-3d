import ky from 'ky'

import type { HttpRequestOptions, HttpResponse } from './types'

const TIMEOUT = 60000
const HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

export const http = {
  getAuthHeader(token: string | undefined) {
    if (!token) return {}

    return { Authorization: `Bearer ${token}` }
  },

  get(url: string, options?: HttpRequestOptions): Promise<HttpResponse> {
    const headers = {
      ...HEADERS,
      ...(options?.headers || {}),
      ...this.getAuthHeader(options?.token),
    }

    return ky
      .get(url, { timeout: options?.timeout || TIMEOUT, headers })
      .json<HttpResponse>()
  },

  post(url: string, data: any, options?: HttpRequestOptions): Promise<HttpResponse> {
    const headers: any = {
      ...HEADERS,
      ...(options?.headers || {}),
      ...this.getAuthHeader(options?.token),
    }

    if (headers['Content-Type'] === 'multipart/form-data') {
      headers['Content-Type'] = undefined
    }

    return ky
      .post(url, {
        timeout: options?.timeout || TIMEOUT,
        headers,
        ...((options?.json || options?.json === undefined) && { json: data }),
        ...(options?.json === false && { body: data }),
      })
      .json<HttpResponse>()
  },

  patch(
    url: string,
    data: Record<string, unknown> | null,
    options?: HttpRequestOptions,
  ): Promise<HttpResponse> {
    const headers = {
      ...HEADERS,
      ...(options?.headers || {}),
      ...this.getAuthHeader(options?.token),
    }

    return ky
      .patch(url, { timeout: options?.timeout || TIMEOUT, headers, json: data })
      .json<HttpResponse>()
  },

  delete(url: string, options?: HttpRequestOptions): Promise<HttpResponse> {
    const headers = {
      ...HEADERS,
      ...(options?.headers || {}),
      ...this.getAuthHeader(options?.token),
    }

    return ky
      .delete(url, { timeout: options?.timeout || TIMEOUT, headers })
      .json<HttpResponse>()
  },
}
