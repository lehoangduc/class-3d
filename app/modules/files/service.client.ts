import { http } from '@/utils/http'

const FilesService = {
  upload(key: string, formData: any) {
    return http.post(`/files?index&key=${key}`, formData, {
      json: false,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  delete(key: string) {
    return http.delete(`/files?index&key=${key}`)
  },
}

export default FilesService
