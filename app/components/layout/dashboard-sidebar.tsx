import { Link, useLocation } from '@remix-run/react'
import type { TFunction } from 'i18next'
import { ChevronLeft, Menu } from 'lucide-react'
import { Fragment, useEffect, useState } from 'react'
import { withTranslation } from 'react-i18next'

import { cn } from '@/utils/misc'
import useMediaQuery from '../hooks/use-media-query'
import { Icons } from '../shared/icons'
import type { SidebarNavItem } from '../types'
import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'

interface DashboardSidebarProps {
  t: TFunction
  siteName?: string
  links: SidebarNavItem[]
}

const DashboardSidebar = withTranslation()(
  ({ t, siteName, links }: DashboardSidebarProps) => {
    const location = useLocation()
    const { isTablet } = useMediaQuery()
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(!isTablet)

    const toggleSidebar = () => {
      setIsSidebarExpanded(!isSidebarExpanded)
    }

    useEffect(() => {
      setIsSidebarExpanded(!isTablet)
    }, [isTablet])

    return (
      <div className="sticky top-0 h-full">
        <ScrollArea className="h-full overflow-y-auto border-r">
          <aside
            className={cn(
              isSidebarExpanded ? 'w-[220px] xl:w-[260px]' : 'w-[68px]',
              'hidden h-screen md:block',
            )}
          >
            <div className="flex h-full max-h-screen flex-1 flex-col gap-2">
              <div className="flex h-14 items-center p-4 lg:h-[60px]">
                {siteName && isSidebarExpanded && (
                  <Link to="#" className="flex items-center gap-2 text-lg font-semibold">
                    <span className="font-urban text-xl font-bold">{siteName}</span>
                  </Link>
                )}

                <Button
                  variant="ghost"
                  className={cn('p-2 ml-auto size-auto')}
                  rounded="full"
                  icon={
                    isSidebarExpanded ? (
                      <ChevronLeft size={18} className="stroke-muted-foreground" />
                    ) : (
                      <Menu size={18} className="stroke-muted-foreground" />
                    )
                  }
                  onClick={toggleSidebar}
                />
              </div>

              <nav className="flex flex-1 flex-col gap-8 px-4 pt-4">
                {links.map((section) => (
                  <section key={section.title} className="flex flex-col gap-0.5">
                    {isSidebarExpanded ? (
                      <p className="text-xs text-muted-foreground">{section.title}</p>
                    ) : (
                      <div className="h-4" />
                    )}
                    {section.items.map((item) => {
                      const Icon = Icons[item.icon || 'arrowRight']
                      return (
                        item.href && (
                          <Fragment key={`link-fragment-${item.title}`}>
                            {isSidebarExpanded ? (
                              <Link
                                key={`link-${item.title}`}
                                to={item.disabled ? '#' : item.href}
                                className={cn(
                                  'flex items-center gap-3 rounded-md p-2 text-sm font-medium hover:bg-muted',
                                  location.pathname === item.href
                                    ? 'bg-muted'
                                    : 'text-muted-foreground hover:text-accent-foreground',
                                  item.disabled &&
                                    'cursor-not-allowed opacity-80 hover:bg-transparent hover:text-muted-foreground',
                                )}
                              >
                                <Icon className="size-5" />
                                {t(`common.${item.title}`)}
                              </Link>
                            ) : (
                              <Link
                                key={`link-tooltip-${item.title}`}
                                to={item.disabled ? '#' : item.href}
                                className={cn(
                                  'flex items-center gap-3 rounded-md py-2 text-sm font-medium hover:bg-muted',
                                  location.pathname === item.href
                                    ? 'bg-muted'
                                    : 'text-muted-foreground hover:text-accent-foreground',
                                  item.disabled &&
                                    'cursor-not-allowed opacity-80 hover:bg-transparent hover:text-muted-foreground',
                                )}
                              >
                                <span className="flex size-full items-center justify-center">
                                  <Icon className="size-5" />
                                </span>
                              </Link>
                            )}
                          </Fragment>
                        )
                      )
                    })}
                  </section>
                ))}
              </nav>
            </div>
          </aside>
        </ScrollArea>
      </div>
    )
  },
)

const MobileSheetSidebar = withTranslation()(({ t, links }: DashboardSidebarProps) => {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const { isSm, isMobile } = useMediaQuery()

  if (isSm || isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className={cn('p-2 size-auto')}
            rounded="full"
            icon={<Menu className="size-5" />}
          />
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0">
          <ScrollArea className="h-full overflow-y-auto">
            <div className="flex h-screen flex-col">
              <nav className="flex flex-1 flex-col gap-y-8 p-6 text-lg font-medium">
                {links.map((section) => (
                  <section key={section.title} className="flex flex-col gap-0.5">
                    <p className="text-xs text-muted-foreground">{section.title}</p>

                    {section.items.map((item) => {
                      const Icon = Icons[item.icon || 'arrowRight']
                      return (
                        item.href && (
                          <Fragment key={`link-fragment-${item.title}`}>
                            <Link
                              key={`link-${item.title}`}
                              onClick={() => {
                                if (!item.disabled) setOpen(false)
                              }}
                              to={item.disabled ? '#' : item.href}
                              className={cn(
                                'flex items-center gap-3 rounded-md p-2 text-sm font-medium hover:bg-muted',
                                location.pathname === item.href
                                  ? 'bg-muted'
                                  : 'text-muted-foreground hover:text-accent-foreground',
                                item.disabled &&
                                  'cursor-not-allowed opacity-80 hover:bg-transparent hover:text-muted-foreground',
                              )}
                            >
                              <Icon className="size-5" />
                              {t(`common.${item.title}`)}
                            </Link>
                          </Fragment>
                        )
                      )
                    })}
                  </section>
                ))}
              </nav>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    )
  }

  return <div className="flex size-9 animate-pulse rounded-lg bg-muted md:hidden" />
})

export { DashboardSidebar, MobileSheetSidebar }
