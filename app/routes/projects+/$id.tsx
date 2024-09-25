import { type ActionFunctionArgs, json } from '@remix-run/node'

import { AuthService } from '@/modules/auth'
import ProjectsService from '@/modules/projects/service.server'
import { DomainError, responseError } from '@/utils/domain-error'

export const ROUTE_PATH = '/projects/:id' as const

export async function action({ request, params }: ActionFunctionArgs) {
  try {
    await AuthService.requireLoggedIn(request, true)

    const { id } = params

    switch (request.method) {
      case 'PATCH': {
        const payload = await request.json()
        // biome-ignore lint/style/noNonNullAssertion:
        const project = await ProjectsService.update(id!, payload, request)

        return json(project)
      }

      case 'DELETE': {
        // biome-ignore lint/style/noNonNullAssertion:
        const project = await ProjectsService.delete(id!, request)
        return json(project)
      }
    }

    throw new DomainError('Bad request', 400)
  } catch (err: unknown) {
    return await responseError(request, err, true)
  }
}
