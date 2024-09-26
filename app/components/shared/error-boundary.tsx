import { isRouteErrorResponse, useParams, useRouteError } from '@remix-run/react'
import type { ErrorResponse } from '@remix-run/router'
import { useTranslation } from 'react-i18next'

type StatusHandler = (info: {
  error: ErrorResponse
  params: Record<string, string | undefined>
}) => JSX.Element | null

type GenericErrorBoundaryProps = {
  defaultStatusHandler?: StatusHandler
  statusHandlers?: Record<number, StatusHandler>
  unexpectedErrorHandler?: (error: unknown) => JSX.Element | null
}

const GenericErrorBoundary = ({
  statusHandlers,
  defaultStatusHandler = ({ error }) => (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-8 rounded-md bg-card px-6">
      <div className="flex flex-col items-center gap-2">
        <p className="text-2xl font-medium text-primary">Whoops!</p>
        <p className="text-center text-lg font-normal text-primary/60">
          {error.status} {error.data}
        </p>
      </div>
    </div>
  ),
  unexpectedErrorHandler = (error) => (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-8 rounded-md bg-card px-6">
      <div className="flex flex-col items-center gap-2">
        <p className="text-2xl font-medium text-primary">Whoops!</p>
        <p className="text-center text-lg font-normal text-primary/60">
          {getErrorMessage(error)}
        </p>
      </div>
    </div>
  ),
}: GenericErrorBoundaryProps) => {
  const params = useParams()
  const error = useRouteError()

  if (typeof document !== 'undefined') {
    console.error(error)
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      {isRouteErrorResponse(error)
        ? (statusHandlers?.[error.status] ?? defaultStatusHandler)({
            error,
            params,
          })
        : unexpectedErrorHandler(error)}
    </div>
  )
}

const getErrorMessage = (err: unknown) => {
  const { t } = useTranslation()

  if (typeof err === 'string') return err
  if (
    err &&
    typeof err === 'object' &&
    'message' in err &&
    typeof err.message === 'string'
  ) {
    return err.message
  }

  console.error('Unable to get error message for error:', err)
  return t('error.Unexpected error')
}

export { GenericErrorBoundary, getErrorMessage }
