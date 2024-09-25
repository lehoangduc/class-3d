import type { Project } from '@/components/types'
import { http } from '@/utils/http'
import type { PaginationOptions } from '@/utils/types'

const THREED_MIME_TYPES = [
  'model/gltf+json',
  'model/gltf-binary',
  'application/octet-stream',
]

const ProjectAssetMediaType = {
  ThreeD: '3d',
}

const ProjectsService = {
  async find(filter: Record<string, unknown>, pagination: PaginationOptions) {
    const search = decodeURIComponent(
      new URLSearchParams({
        ...filter,
        page: (pagination.page || 1).toString(),
        size: (pagination.size || 10).toString(),
      }).toString(),
    )

    return http.get(`/projects?${search}`)
  },

  async create(data: Record<string, unknown>) {
    return http.post('/projects', data)
  },

  async update(id: string, data: Record<string, unknown>) {
    return http.patch(`/projects/${id}`, data)
  },

  async delete(id: string) {
    return http.delete(`/projects/${id}`)
  },

  getAssetMediaType(mimeType: string) {
    if (THREED_MIME_TYPES.includes(mimeType)) return ProjectAssetMediaType.ThreeD

    return null
  },

  getContentDisplay(project?: Project | null) {
    return project?.scenes?.[0]?.assets?.find((a: any) =>
      [ProjectAssetMediaType.ThreeD].includes(a.type),
    )
  },
}

export default ProjectsService
export { THREED_MIME_TYPES, ProjectAssetMediaType }
