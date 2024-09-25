export type HttpRequestOptions = {
  json?: boolean
  token?: string
  headers?: Record<string, unknown>
  timeout?: number
}

export type HttpResponse = {
  data: Record<string, any> | Record<string, any>[]
  meta?: Record<string, any>
}

export type PaginationOptions = {
  page?: number
  size?: number
}
