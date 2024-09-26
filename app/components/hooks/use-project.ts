import { useNavigate } from '@remix-run/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'

import FilesService from '@/modules/files/service.client'
import ProjectsService from '@/modules/projects/service.client'
import { handleApiError } from '@/utils/misc'
import { useAppContext } from '../providers/app'
import type { Project } from '../types'

export default function useProject({
  project,
  onSaveSuccess,
  onDeleteSuccess,
}: {
  project?: Project | null
  onSaveSuccess?: (project: Project, isNew: boolean) => void
  onDeleteSuccess?: () => void
}) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const { envs } = useAppContext()

  const uploadsRef = useRef<Record<string, any>[]>([])
  const queryKey = ['projects']

  const assetDisplay = ProjectsService.getContentDisplay(project)
  const [contentDisplay, setContentDisplay] = useState<{
    type: string | null
    file: any
  }>({
    type: assetDisplay?.type,
    file: null,
  })

  const refresh = () => queryClient.invalidateQueries({ queryKey })

  const handleFileChange = ({ file }: { file: any }) => {
    const fileType = ProjectsService.getAssetMediaType(
      file.type || 'application/octet-stream',
    )

    setContentDisplay({
      ...contentDisplay,
      type: fileType,
      file,
    })
  }

  const handleSave = async ({ name }: { name: string | undefined }) => {
    if (!name) return

    const data = {
      name: name,
      type: 'flat_surface',
      scenes: [{ id: project?.scenes?.[0]?.id, assets: [] } as any],
    }
    const oldContentDisplay = ProjectsService.getContentDisplay(project)
    let display: any = {
      id: oldContentDisplay?.id,
      payload: oldContentDisplay?.content?.payload,
    }

    if (contentDisplay?.file) {
      const uuid = uuidv4()

      display = {
        id: oldContentDisplay?.id,
        uuid,
        type: contentDisplay.type,
        file_name: contentDisplay.file.name,
        mime_type: contentDisplay.file.type || 'application/octet-stream',
        payload: oldContentDisplay?.content?.payload,
      }

      uploadsRef.current[uuid as any] = { file: contentDisplay.file }
    }

    data.scenes[0].assets.push(display)

    let res: any

    if (!project?._id) {
      res = (await ProjectsService.create(data)).data
    } else {
      res = (await ProjectsService.update(project._id, data)).data
    }

    await uploadAssets(res)

    return res
  }

  const handleRemove = async (project: Project) => {
    if (!project?._id) return

    await ProjectsService.delete(project._id)

    try {
      const asset = ProjectsService.getContentDisplay(project)
      const fileName = asset?.content?.media?.main?.storage_meta?.key

      if (fileName) {
        await FilesService.delete(fileName)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const uploadAssets = async (res: any) => {
    const promises: any[] = []
    const uploads = res.uploads || []

    // biome-ignore lint/complexity/noForEach:
    uploads.forEach((upload: any) => {
      const data = uploadsRef.current[upload.uuid]
      if (!data) return true

      promises.push(uploadAsset(upload, data.file))
    })

    if (!promises.length) return

    return Promise.all(promises)
  }

  const uploadAsset = (data: Record<string, any>, file: any) => {
    const { fields } = data
    const formData = new FormData()

    if (typeof fields === 'object' && fields !== null) {
      // biome-ignore lint/complexity/noForEach:
      Object.keys(fields).forEach((key) => {
        formData.append(key, fields[key])
      })
    }

    formData.append('file', file)

    return FilesService.upload(fields.key, formData)
  }

  const { mutate: save, isPending: isUpdating } = useMutation({
    mutationFn: handleSave,
    onSuccess: async (data: any) => {
      await refresh()
      toast.success(t('message.Saved successfully'))
      onSaveSuccess?.(data, !!project)
    },
    onError: (err) => handleApiError(err, t, navigate, envs),
  })

  const { mutate: remove, isPending: isDeleting } = useMutation({
    mutationFn: handleRemove,
    onSuccess: async () => {
      await refresh()
      toast.success(t('message.Deleted successfully'))
      onDeleteSuccess?.()
    },
    onError: (err) => handleApiError(err, t, navigate, envs),
  })

  return {
    isUpdating,
    isDeleting,
    onFileChange: handleFileChange,
    save,
    remove,
  }
}
