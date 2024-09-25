import type { TFunction } from 'i18next'
import { Delete, EllipsisVertical, PenLine, QrCode } from 'lucide-react'
import { useState } from 'react'
import { withTranslation } from 'react-i18next'

import { cn } from '@/utils/misc'
import type { Project } from '../types'
import { Button } from '../ui/button'
import { Popover } from '../ui/popover'

interface ProjectControlProps {
  t: TFunction
  project: Project
  onEdit: (project: Project) => void
  onQrCode: (project: Project) => void
  onDelete: (project: Project) => void
}

export default withTranslation()(
  ({ t, project, onEdit, onQrCode, onDelete }: ProjectControlProps) => {
    const [openPopover, setOpenPopover] = useState(false)

    return (
      <>
        <div className="flex justify-end">
          <Popover
            content={
              <div className="w-full sm:w-48">
                <div className="grid gap-px p-2">
                  <Button
                    text={t('common.Edit')}
                    variant="outline"
                    icon={<PenLine className="size-4" />}
                    className="h-9 px-2 font-medium"
                    textWrapperClassName="flex-1 text-left"
                    onClick={() => {
                      setOpenPopover(false)
                      onEdit(project)
                    }}
                  />
                  <Button
                    text="QR Code"
                    variant="outline"
                    icon={<QrCode className="size-4" />}
                    className="h-9 px-2 font-medium"
                    textWrapperClassName="flex-1 text-left"
                    onClick={() => {
                      setOpenPopover(false)
                      onQrCode(project)
                    }}
                  />
                  <Button
                    text={t('common.Delete')}
                    variant="danger-outline"
                    icon={<Delete className="size-4" />}
                    className="h-9 px-2 font-medium"
                    textWrapperClassName="flex-1 text-left"
                    onClick={() => {
                      setOpenPopover(false)
                      onDelete(project)
                    }}
                  />
                </div>
              </div>
            }
            align="end"
            openPopover={openPopover}
            setOpenPopover={setOpenPopover}
          >
            <Button
              variant="secondary"
              className={cn(
                'h-8 px-1.5 outline-none transition-all duration-200',
                'border-transparent data-[state=open]:border-gray-500 sm:group-hover/card:data-[state=closed]:border-gray-200',
              )}
              icon={<EllipsisVertical className="h-5 w-5 shrink-0" />}
              onClick={() => {
                setOpenPopover(!openPopover)
              }}
            />
          </Popover>
        </div>
      </>
    )
  },
)
