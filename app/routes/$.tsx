import type { MetaFunction } from '@remix-run/node'

import { GenericErrorBoundary } from '@/components/shared/error-boundary'

export const meta: MetaFunction = () => {
  return [{ title: '404 Not Found!' }]
}

export async function loader() {
  throw new Response('Not found', { status: 404 })
}

export default function NotFound() {
  // Due to the loader, this component will never be rendered,
  // but as a good practice, ErrorBoundary will be returned.
  return <ErrorBoundary />
}

export function ErrorBoundary() {
  return (
    <GenericErrorBoundary
      statusHandlers={{
        404: () => (
          <div className="flex h-screen w-full flex-col items-center justify-center gap-8 rounded-md bg-card px-6">
            <div className="flex flex-col items-center gap-2">
              <p className="text-2xl font-medium text-primary">Whoops!</p>
              <p className="text-center text-lg font-normal text-primary/60">
                Nothing here yet!
              </p>
            </div>
          </div>
        ),
      }}
    />
  )
}
