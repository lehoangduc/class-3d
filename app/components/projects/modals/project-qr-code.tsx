import { QRCodeCanvas } from 'qrcode.react'

import { useAppContext } from '@/components/providers/app'
import type { Project } from '../../types'
import { Modal } from '../../ui/modal'
import { getProjectViewUrl } from '../utils'

interface ProjectQrCodeModalProps {
  open: boolean
  project?: Project
  onClose?: () => void
}

export default function ProjectQrCodeModal({
  open,
  project,
  onClose,
}: ProjectQrCodeModalProps) {
  const { envs } = useAppContext()

  return (
    project && (
      <Modal showModal={open} onClose={onClose} className="gap-0">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 px-4 py-4 pt-8 sm:px-16">
          <h3 className="text-lg font-medium">QR Code</h3>
        </div>

        <div className="flex flex-col space-y-6 bg-gray-50 py-6 text-left">
          <div className="mx-auto overflow-hidden rounded-lg border-2 border-gray-200 bg-white p-4">
            <QRCodeCanvas
              size={256}
              value={getProjectViewUrl(
                project.slug as string,
                `${envs.baseUrl}${envs?.projectDisplayPath}`,
              )}
            />
          </div>
        </div>
      </Modal>
    )
  )
}
