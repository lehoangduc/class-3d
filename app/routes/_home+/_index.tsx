import { type LoaderFunctionArgs, type MetaFunction, json } from '@remix-run/node'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ClientOnly } from 'remix-utils/client-only'

import useTablePagination from '@/components/hooks/use-table-pagination'
import useProjects from '@/components/hooks/useProjects'
import DashboardHeader from '@/components/layout/dashboard-header'
import ProjectDeleteModal from '@/components/projects/modals/project-delete'
import ProjectDetailModal from '@/components/projects/modals/project-detail'
import ProjectQrCodeModal from '@/components/projects/modals/project-qr-code'
import ProjectCard from '@/components/projects/project-card'
import ProjectCardPlaceholder from '@/components/projects/project-card-placeholder'
import ProjectsEmptyPlaceholder from '@/components/projects/projects-empty-placeholder'
import PaginationControls from '@/components/shared/pagination-controls'
import type { Project } from '@/components/types'
import { Button } from '@/components/ui/button'
import { CardList } from '@/components/ui/card-list'
import i18next from '@/modules/i18n/i18n.server'
import { cn } from '@/utils/misc'

export const meta: MetaFunction = ({ data }: { data: any }) => {
  return [{ title: data.pageTitle }]
}

export async function loader({ request }: LoaderFunctionArgs) {
  const t = await i18next.getFixedT(request)

  return json({ pageTitle: t('common.Projects') })
}

export default function Index() {
  const { t } = useTranslation()
  const { isLoading, data, load } = useProjects()
  const [isOpenDetailModal, setIsOpenDetailModal] = useState(false)
  const [isOpenQrCodeModal, setIsOpenQrCodeModal] = useState(false)
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false)
  const [project, setProject] = useState<Project | undefined>()

  const handleCloseDetailModal = () => {
    setProject(undefined)
    setIsOpenDetailModal(false)
  }

  const handleCloseQrCodeModal = () => {
    setProject(undefined)
    setIsOpenQrCodeModal(false)
  }

  const handleCloseDeleteModal = () => {
    setProject(undefined)
    setIsOpenDeleteModal(false)
  }

  const handleEdit = (project?: Project) => {
    setProject(project)
    setIsOpenDetailModal(true)
  }

  const handleQrCode = (project: Project) => {
    setProject(project)
    setIsOpenQrCodeModal(true)
  }

  const handleDelete = (project: Project) => {
    setProject(project)
    setIsOpenDeleteModal(true)
  }

  const handleSaveSuccess = (project: Project) => {
    setIsOpenDetailModal(false)
    handleQrCode(project)
  }

  const handleDeleteSuccess = () => {
    setIsOpenDeleteModal(false)
  }

  const { pagination, setPagination } = useTablePagination({
    onPageChange: (pageIndex, pageSize) =>
      load({ pagination: { page: pageIndex + 1, size: pageSize } }),
  })

  return (
    <>
      <ClientOnly>
        {() => (
          <ProjectDetailModal
            open={isOpenDetailModal}
            project={project}
            onClose={handleCloseDetailModal}
            onSaveSuccess={handleSaveSuccess}
          />
        )}
      </ClientOnly>

      <ClientOnly>
        {() => (
          <ProjectQrCodeModal
            open={isOpenQrCodeModal}
            project={project}
            onClose={handleCloseQrCodeModal}
          />
        )}
      </ClientOnly>

      <ClientOnly>
        {() => (
          <ProjectDeleteModal
            open={isOpenDeleteModal}
            project={project}
            onClose={handleCloseDeleteModal}
            onDeleteSuccess={handleDeleteSuccess}
          />
        )}
      </ClientOnly>

      <DashboardHeader heading={t('common.Projects')}>
        <div className="flex">
          <div className="grow-0">
            <Button
              text={t('common.Create object', { object: t('project') })}
              onClick={() => handleEdit({})}
            />
          </div>
        </div>
      </DashboardHeader>

      <div className="grid gap-8">
        {!data || data?.data?.length > 0 ? (
          <CardList loading={isLoading}>
            {data?.data?.length
              ? data.data.map((project: Project) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    onEdit={handleEdit}
                    onQrCode={handleQrCode}
                    onDelete={handleDelete}
                  />
                ))
              : Array.from({ length: 12 }).map((_, idx) => (
                  <CardList.Card
                    // biome-ignore lint/suspicious/noArrayIndexKey:
                    key={idx}
                    outerClassName="pointer-events-none"
                    innerClassName="flex items-center gap-4"
                  >
                    <ProjectCardPlaceholder />
                  </CardList.Card>
                ))}
          </CardList>
        ) : (
          <ProjectsEmptyPlaceholder />
        )}

        {/* Pagination */}
        {data?.data?.length > 0 && (
          <>
            <div className="h-[90px]" />
            <div
              className={cn(
                'fixed bottom-4 left-1/2 w-full max-w-[768px] -translate-x-1/2 px-2.5',
                'max-[1216px]:left-2 max-[1216px]:translate-x-0 max-[920px]:bottom-5 max-[920px]:pr-20',
              )}
            >
              <div className="rounded-md border border-gray-200 bg-white px-4 py-3.5 [filter:drop-shadow(0_5px_8px_#222A351d)]">
                <PaginationControls
                  pagination={pagination}
                  setPagination={setPagination}
                  totalCount={data?.meta?.total || 0}
                  unit={(plural) =>
                    `${plural ? t('common.projects') : t('common.project')}`
                  }
                  disabled={isLoading}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
