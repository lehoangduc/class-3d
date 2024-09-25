import { useTranslation } from 'react-i18next'

import useProject from '@/components/hooks/use-project'
import { Button } from '@/components/ui/button'
import type { Project } from '../../types'
import { Modal } from '../../ui/modal'

interface ProjectDeleteModalProps {
  open: boolean
  project?: Project
  onClose?: () => void
  onDeleteSuccess?: () => void
}

export default function ProjectDeleteModal({
  open,
  project,
  onClose,
  onDeleteSuccess,
}: ProjectDeleteModalProps) {
  const { t } = useTranslation()
  const { isDeleting, remove } = useProject({
    project,
    onDeleteSuccess,
  })

  return (
    project && (
      <Modal showModal={open} onClose={onClose} className="gap-0">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 px-4 py-4 pt-8 text-center sm:px-16">
          <h3 className="text-lg font-medium">
            {`${t('common.Delete')} ${t('common.project')} "${project.name}"`}
          </h3>
        </div>

        <div className="flex flex-col space-y-3 bg-gray-50 px-4 py-8 text-left sm:px-16">
          <Button
            variant="danger"
            text={t('common.ConfirmDelete')}
            loading={isDeleting}
            onClick={() => remove(project)}
          />
        </div>
      </Modal>
    )
  )
}
