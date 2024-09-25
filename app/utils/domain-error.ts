import { json } from '@remix-run/node'

import i18nServer from '@/modules/i18n/i18n.server'
import { HTTPError } from 'ky'

export class DomainError extends Error {
  http_status?: number
  headers?: Record<string, string>

  constructor(message: string, httpStatus?: number, headers?: Record<string, string>) {
    super(message)
    this.http_status = httpStatus
    this.headers = headers
  }
}

export async function responseError(
  request: Request,
  err: unknown,
  responseJson = false,
) {
  if (err instanceof Response) {
    return err
  }

  const locale = await i18nServer.getLocale(request)
  let status = 500
  let message = 'Unexpected error'

  if (err instanceof HTTPError) {
    status = err.response.status
    message = err.response.statusText

    try {
      const body: any = await err.response.json()
      if (Array.isArray(body.errors) && body.errors.length) {
        message = body.errors.map((e: any) => e.message).join('\n')
      }
    } catch (err) {}
  }

  if (err instanceof DomainError) {
    status = err.http_status || 500
    message = err.message
  }

  throw responseJson
    ? json({ locale, error: { message } }, { status })
    : new Response(message, { status })
}
