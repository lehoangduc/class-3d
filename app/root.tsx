import { type LoaderFunctionArgs, json } from '@remix-run/node'
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useChangeLanguage } from 'remix-i18next/react'
import '@fontsource/inter/index.css'

import '@/styles/globals.css'
import { useNonce } from '@/components/hooks/use-nonce'
import { GenericErrorBoundary } from '@/components/shared/error-boundary'
import { Toaster } from '@/components/ui/sonner'
import i18nServer from '@/modules/i18n/i18n.server'
import { cn } from '@/utils/misc'

const handle = { i18n: ['translation'] }
const queryClient = new QueryClient()

const Document = ({
  children,
  nonce,
  locale = 'en',
}: {
  children: React.ReactNode
  nonce: string
  locale?: string
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <html lang={locale ?? 'en'} dir="ltr">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta />
          <Links />
        </head>
        <body
          className={cn(
            'min-h-screen bg-background font-sans antialiased',
            '--font-sans',
          )}
        >
          {children}
          <Toaster richColors closeButton />
          <ScrollRestoration nonce={nonce} />
          <Scripts nonce={nonce} />
        </body>
      </html>
    </QueryClientProvider>
  )
}

const loader = async ({ request }: LoaderFunctionArgs) => {
  const locale = await i18nServer.getLocale(request)

  return json({ locale })
}

const Layout = () => {
  const nonce = useNonce()
  const data = useLoaderData<typeof loader>()
  const locale = data?.locale || 'vi'

  useChangeLanguage(locale)

  return (
    <Document nonce={nonce} locale={locale}>
      <Outlet />
    </Document>
  )
}

const ErrorBoundary = () => {
  const nonce = useNonce()

  return (
    <Document nonce={nonce}>
      <GenericErrorBoundary />
    </Document>
  )
}

export { handle, loader, ErrorBoundary }
export default Layout
