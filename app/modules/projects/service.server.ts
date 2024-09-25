import AuthService from '@/modules/auth/service'
import { http } from '@/utils/http'
import { getApiProjectViewerUrl, getApiUrl } from '@/utils/misc'
import type { PaginationOptions } from '@/utils/types'

const ProjectsService = {
  async find(
    filter: Record<string, unknown>,
    pagination: PaginationOptions,
    request: Request,
  ) {
    const search = decodeURIComponent(
      new URLSearchParams({
        ...filter,
        'page[number]': (pagination.page || 1).toString(),
        'page[size]': (pagination.size || 10).toString(),
      }).toString(),
    )

    return http.get(`${getApiUrl()}/projects?${search}`, {
      token: await AuthService.getAccessTokenFromRequest(request),
    })
  },

  async findOne(slug: string) {
    return (await http.get(`${getApiProjectViewerUrl()}/${slug}`)).data
  },

  async create(data: Record<string, unknown>, request: Request) {
    return http.post(`${getApiUrl()}/projects`, data, {
      token: await AuthService.getAccessTokenFromRequest(request),
    })
  },

  async update(id: string, data: Record<string, unknown>, request: Request) {
    return http.patch(`${getApiUrl()}/projects/${id}`, data, {
      token: await AuthService.getAccessTokenFromRequest(request),
    })
  },

  async delete(id: string, request: Request) {
    return http.delete(`${getApiUrl()}/projects/${id}`, {
      token: await AuthService.getAccessTokenFromRequest(request),
    })
  },
}

export default ProjectsService
