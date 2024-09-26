import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import { Suspense } from 'react'

import {
  DashboardSidebar,
  MobileSheetSidebar,
} from '@/components/layout/dashboard-sidebar'
import UserAccountNav from '@/components/layout/user-account-nav'
import { AppProvider } from '@/components/providers/app'
import MaxWidthWrapper from '@/components/shared/max-width-wrapper'
import type { User } from '@/components/types'
import { SIDEBAR_LINKS } from '@/configs/dashboard'
import { getSharedEnvs } from '@/configs/utils'
import { AuthService } from '@/modules/auth'
import { responseError } from '@/utils/domain-error'

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    await AuthService.requireLoggedIn(request)

    const envs = getSharedEnvs()
    const user = (await AuthService.me(request)) as User

    return json({ envs, user } as const)
  } catch (err: unknown) {
    return await responseError(request, err)
  }
}

export default function Layout() {
  const { envs, user } = useLoaderData<typeof loader>()

  return (
    <AppProvider values={{ envs, user }}>
      <div className="relative flex min-h-screen w-full">
        <DashboardSidebar siteName={envs.siteName as string} links={SIDEBAR_LINKS} />

        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-50 flex h-14 bg-background px-4 lg:h-[60px] xl:px-8">
            <MaxWidthWrapper className="flex max-w-7xl items-center gap-x-3 px-0">
              <MobileSheetSidebar links={SIDEBAR_LINKS} />

              <div className="ml-auto">
                <UserAccountNav user={user} logoutPath={envs.auth.logoutPath as string} />
              </div>
            </MaxWidthWrapper>
          </header>

          <main className="flex-1 p-4 xl:px-8">
            <MaxWidthWrapper className="flex h-full max-w-7xl flex-col gap-4 px-0 lg:gap-6">
              <Suspense>
                <Outlet />
              </Suspense>
            </MaxWidthWrapper>
          </main>
        </div>
      </div>
    </AppProvider>
  )
}
