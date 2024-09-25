import { type LoaderFunctionArgs, redirect } from '@remix-run/node'

import { authSessionStore } from '@/modules/auth'

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await authSessionStore.getSession(request.headers.get('Cookie'))

  return redirect('/', {
    headers: {
      'Set-Cookie': await authSessionStore.destroySession(session),
    },
  })
}
