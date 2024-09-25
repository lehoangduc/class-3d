import { type LoaderFunctionArgs, redirect } from '@remix-run/node'
import { Outlet } from '@remix-run/react'

import { AuthService } from '@/modules/auth'
import { responseError } from '@/utils/domain-error'

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const isLoggedIn = await AuthService.isLoggedIn(request)
    if (isLoggedIn) return redirect('/')

    return null
  } catch (err: unknown) {
    return await responseError(request, err)
  }
}

export default function Layout() {
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  )
}
