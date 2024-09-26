import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { Form } from '@remix-run/react'
import { QRCodeCanvas } from 'qrcode.react'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

import useProject from '@/components/hooks/use-project'
import { useAppContext } from '@/components/providers/app'
import ProjectsService from '@/modules/projects/service.client'
import { cn } from '@/utils/misc'
import ProjectSchema from '../../schemas/project'
import type { Project } from '../../types'
import { Button } from '../../ui/button'
import { FileUpload } from '../../ui/file-upload'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { Modal } from '../../ui/modal'
import QRCodePlacehodler from '../qr-code-placejoder'
import { getProjectViewUrl } from '../utils'

interface ProjectDetailModalProps {
  open: boolean
  project?: Project
  onClose?: () => void
  onSaveSuccess?: (project: Project, isNew?: boolean) => void
}

export default function ProjectDetailModal({
  open,
  project,
  onClose,
  onSaveSuccess,
}: ProjectDetailModalProps) {
  const { t } = useTranslation()
  const { envs, user } = useAppContext()
  const formRef = useRef(null)

  const projectSchema = ProjectSchema(t)
  const fileMaxSize =
    user?.project_features?.file_upload_size_limit?.value || envs?.storage.fileMaxSize
  const rendererBaseUrl = user?.project_features?.renderer?.base_url || ''

  const [form, { name }] = useForm({
    id: project ? `project-${project?._id}` : undefined,
    shouldValidate: 'onBlur',
    constraint: getZodConstraint(projectSchema),
    defaultValue: project,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: projectSchema })
    },
    onSubmit: (e, { formData }) => {
      e.preventDefault()
      save({ name: formData.get('name') as string })
    },
  })

  const { isUpdating, onFileChange, save } = useProject({
    project,
    onSaveSuccess,
  })

  const asset = ProjectsService.getContentDisplay(project)

  return (
    <Modal showModal={open} onClose={onClose} className="gap-0 max-w-screen-lg">
      <div className="sticky top-0 z-20 flex h-14 items-center justify-center gap-4 space-y-3 border-b border-gray-200 bg-white px-4 transition-all sm:h-24 md:px-16">
        <h3 className="!mt-0 text-lg font-medium">
          {project?._id
            ? // biome-ignore lint/style/useTemplate:
              t('common.Edit object', {
                object: t('common.Project'),
              }) + ` "${project.name}"`
            : t('common.Create object', { object: t('common.project') })}
        </h3>
      </div>

      <Form
        ref={formRef}
        autoComplete="off"
        className="scrollbar-hide grid max-h-[95dvh] w-full divide-x divide-gray-100 overflow-auto md:grid-cols-2 md:overflow-hidden"
        {...getFormProps(form)}
      >
        <div className="scrollbar-hide rounded-l-2xl md:max-h-[95vh] md:overflow-auto bg-gray-50">
          <div className="grid gap-6 pt-8">
            <div className="px-4 md:px-16">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor={name.id}
                    className="block text-sm font-bold text-gray-700"
                  >
                    {t('field.Project name')}
                  </Label>
                </div>
              </div>

              <div className="mt-2 w-full">
                <Input
                  className="w-full bg-white"
                  autoCapitalize="none"
                  autoCorrect="off"
                  {...getInputProps(name, { type: 'text' })}
                  error={name.errors?.join(',')}
                />
              </div>
            </div>

            <div className="px-4 md:px-16">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label className="block text-sm font-bold text-gray-700">
                    {t('field.Content display')}
                  </Label>
                </div>
              </div>

              <div className="mt-2 w-full">
                <FileUpload
                  accept="threed"
                  maxFileSize={fileMaxSize}
                  currentFileName={asset?.content?.media?.main?.storage_meta?.file_name}
                  onChange={onFileChange}
                />
              </div>
            </div>
          </div>

          <div
            className={cn(
              'z-10 px-4 py-8 transition-all md:sticky md:bottom-0 md:px-16 top-[100vh]',
            )}
          >
            <Button
              type="submit"
              text={project?._id ? t('common.Save') : t('common.Create')}
              loading={isUpdating}
            />
          </div>
        </div>

        <div className="scrollbar-hide rounded-r-2xl md:max-h-[95vh] md:overflow-auto">
          <div className="grid gap-5 p-5">
            <div className="relative mb-2">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <div className="flex items-center space-x-2 bg-white px-3">
                  <p className="text-sm font-bold text-gray-400">QR Code</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              {project?._id ? (
                <QRCodeCanvas
                  size={256}
                  value={getProjectViewUrl(
                    project.slug as string,
                    `${rendererBaseUrl}${envs?.projectDisplayPath}`,
                  )}
                />
              ) : (
                <QRCodePlacehodler />
              )}
            </div>
          </div>
        </div>
      </Form>
    </Modal>
  )
}
