import { type Session, redirect } from '@remix-run/node'

import { getEnv } from '@/configs/utils'
import { DomainError } from '@/utils/domain-error'
import { http } from '@/utils/http'
import { getApiUrl } from '@/utils/misc'
import authSessionStore from './session'
import type { AuthResponse } from './types'

const AuthService = {
  getCookieName(): string {
    return (getEnv('auth.cookieName') as string) || 'access_token'
  },

  async getAccessTokenFromRequest(request: Request): Promise<string | undefined> {
    const session = await authSessionStore.getSession(request.headers.get('cookie'))

    return session.get(this.getCookieName())
  },

  async getAuthCookie(session: Session, data: Record<string, unknown>): Promise<string> {
    for (const key of Object.keys(data)) {
      session.set(key, data[key])
    }

    return authSessionStore.commitSession(session)
  },

  async auth(data: Record<string, unknown>): Promise<AuthResponse> {
    const res = await http.post(`${getApiUrl()}/auth/login`, data)

    return res.data as AuthResponse
  },

  async me(request: Request) {
    const token = await this.getAccessTokenFromRequest(request)

    try {
      const user = (await http.get(`${getApiUrl()}/auth/me`, { token })).data
      return user
    } catch (err) {
      throw redirect(getEnv('auth.loginPath') as string)
    }
  },

  async isLoggedIn(request: Request) {
    const session = await authSessionStore.getSession(request.headers.get('cookie'))

    return session.has('email')
  },

  async requireLoggedIn(request: Request, throwError?: boolean, redirectPath?: string) {
    const session = await authSessionStore.getSession(request.headers.get('cookie'))
    const redirectTo = redirectPath || (getEnv('auth.loginPath') as string)

    if (!session.has('email')) {
      if (throwError) {
        throw new DomainError('Unauthorized', 401)
      }

      throw redirect(redirectTo)
    }
  },
}

export default AuthService
