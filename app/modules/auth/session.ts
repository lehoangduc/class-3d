import { createCookieSessionStorage } from '@remix-run/node'

import { getEnv, isProduction } from '@/configs/utils'

const authSessionStore = createCookieSessionStorage({
  cookie: {
    name: '__session',
    secrets: [getEnv('secretKey') as string],
    sameSite: 'strict',
    path: '/',
    httpOnly: true,
    secure: isProduction(),
    maxAge: 604800, // 7 days
  },
})

export default authSessionStore
