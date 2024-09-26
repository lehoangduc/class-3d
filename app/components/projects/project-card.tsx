import { formatDateTime, timeAgo } from '@/utils/datetime'
import { cn } from '@/utils/misc'
import { Link } from '@remix-run/react'
import useMediaQuery from '../hooks/use-media-query'
import { useAppContext } from '../providers/app'
import { Icons } from '../shared/icons'
import type { Project } from '../types'
import { CardList } from '../ui/card-list'
import { Tooltip } from '../ui/tooltip'
import ProjectControls from './project-controls'
import { getProjectViewUrl } from './utils'

interface ProjectCardProps {
  project: Project
  onEdit: (project: Project) => void
  onQrCode: (project: Project) => void
  onDelete: (project: Project) => void
}

export default function ProjectCard({
  project,
  onEdit,
  onQrCode,
  onDelete,
}: ProjectCardProps) {
  const { envs } = useAppContext()
  const { isMobile } = useMediaQuery()

  return (
    <>
      <CardList.Card
        key={project._id}
        innerClassName="flex items-center gap-5 sm:gap-8 md:gap-12 text-sm cursor-pointer"
        onClick={isMobile ? undefined : () => onEdit(project)}
      >
        <div className="min-w-0 grow">
          <div className="h-[24px] min-w-0 overflow-hidden transition-[height] group-data-[variant=loose]/card-list:h-[44px]">
            <div className="flex items-center gap-2">
              <div className="min-w-0 shrink grow-0 text-gray-950">
                <div className="flex items-center gap-2">
                  <span className={cn('truncate font-semibold leading-6 text-gray-800')}>
                    {project.name}
                  </span>
                </div>
              </div>
            </div>

            <div
              className={cn(
                'min-w-0 items-center whitespace-nowrap text-sm transition-[opacity,display] delay-[0s,150ms] duration-[150ms,0s]',
                'hidden gap-1.5 opacity-0 group-data-[variant=loose]/card-list:flex group-data-[variant=loose]/card-list:opacity-100 md:gap-3',
              )}
            >
              <div className="flex min-w-0 items-center gap-1">
                <Icons.cornerDownRight className="h-3 w-3 shrink-0 text-gray-400" />
                <Link
                  target="_blank"
                  to={getProjectViewUrl(
                    project.slug as string,
                    `${envs?.projectDisplayPath}`,
                  )}
                  className="truncate text-gray-500 transition-colors hover:text-gray-700 hover:underline hover:underline-offset-2"
                >
                  {project.slug}
                </Link>
              </div>
              <div className={cn('hidden shrink-0 sm:block')}>
                <Tooltip content={formatDateTime(project.created_at as Date)}>
                  <span className="text-gray-400 cursor-pointer">
                    {timeAgo(project.created_at as Date)}
                  </span>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 sm:gap-5">
          <ProjectControls
            project={project}
            onEdit={onEdit}
            onQrCode={onQrCode}
            onDelete={onDelete}
          />
        </div>
      </CardList.Card>
    </>
  )
}
