import { type ActionFunctionArgs, json } from '@remix-run/node'

import { AuthService } from '@/modules/auth'
import ProjectsService from '@/modules/projects/service.server'
import { responseError } from '@/utils/domain-error'
import { getPaginationFromParams, getSearchParams } from '@/utils/misc'

export const ROUTE_PATH = '/projects' as const

export async function loader({ request }: ActionFunctionArgs) {
  try {
    await AuthService.requireLoggedIn(request, true)

    const params = Object.fromEntries(new URL(request.url).searchParams)
    const data = await ProjectsService.find(
      getSearchParams(params),
      getPaginationFromParams(params),
      request,
    )

    return json(data)
  } catch (err: unknown) {
    return await responseError(request, err)
  }
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    await AuthService.requireLoggedIn(request, true)

    const payload = await request.json()
    const project = await ProjectsService.create(payload, request)

    return json(project)
  } catch (err: unknown) {
    return await responseError(request, err, true)
  }
}
