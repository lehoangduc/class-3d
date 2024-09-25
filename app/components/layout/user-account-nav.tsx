import { Link } from '@remix-run/react'
import type { TFunction } from 'i18next'
import { LogOut } from 'lucide-react'
import { useState } from 'react'
import { withTranslation } from 'react-i18next'
import { Drawer } from 'vaul'

import useMediaQuery from '../hooks/use-media-query'
import UserAvatar from '../shared/user-avatar'
import type { User } from '../types'
import { Button } from '../ui/button'
import { Popover } from '../ui/popover'

interface UserAccountNavProps {
  t: TFunction
  user: User
  logoutPath: string
}

const UserAccountNav = withTranslation()(
  ({ t, user, logoutPath }: UserAccountNavProps) => {
    const { isMobile } = useMediaQuery()
    const [open, setOpen] = useState(false)

    const closeDrawer = () => {
      setOpen(false)
    }

    if (!user)
      return <div className="size-8 animate-pulse rounded-full border bg-muted" />

    if (isMobile) {
      return (
        <Drawer.Root open={open} onClose={closeDrawer}>
          <Drawer.Trigger onClick={() => setOpen(true)}>
            <UserAvatar user={user} className="size-9 border" />
          </Drawer.Trigger>
          <Drawer.Portal>
            <Drawer.Overlay
              className="fixed inset-0 z-40 h-full bg-background/80 backdrop-blur-sm"
              onClick={closeDrawer}
            />
            <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mt-24 overflow-hidden rounded-t-[10px] border bg-background px-3 text-sm">
              <div className="sticky top-0 z-20 flex w-full items-center justify-center bg-inherit">
                <div className="my-3 h-1.5 w-16 rounded-full bg-muted-foreground/20" />
              </div>

              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col">
                  {user.name && <p className="font-medium">{user.name}</p>}
                  {user.email && (
                    <p className="w-[200px] truncate text-muted-foreground">
                      {user?.email}
                    </p>
                  )}
                </div>
              </div>

              <ul className="mb-14 mt-1 w-full text-muted-foreground">
                <li className="rounded-lg text-foreground hover:bg-muted">
                  <Link
                    className="flex w-full items-center gap-3 px-2.5 py-2"
                    to={logoutPath}
                  >
                    <LogOut className="size-4" />
                    <p className="text-sm">{t('common.Logout')}</p>
                  </Link>
                </li>
              </ul>
            </Drawer.Content>
            <Drawer.Overlay />
          </Drawer.Portal>
        </Drawer.Root>
      )
    }

    return (
      <>
        <Popover
          openPopover={open}
          setOpenPopover={setOpen}
          content={
            <div className="flex w-full flex-col space-y-px rounded-md bg-white p-3 sm:w-56 gap-2">
              <div className="flex items-center justify-start gap-2">
                <div className="flex flex-col leading-none">
                  {user.name && <p className="font-medium">{user.name}</p>}
                  {user.email && (
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user?.email}
                    </p>
                  )}
                </div>
              </div>

              <Link className="flex w-full items-center space-x-2.5" to={logoutPath}>
                <LogOut className="size-4" />
                <p className="text-sm">{t('common.Logout')}</p>
              </Link>
            </div>
          }
        >
          <Button
            variant="icon"
            icon={<UserAvatar user={user} className="size-8 border" />}
            className="p-0"
            onClick={() => setOpen(!open)}
          />
        </Popover>
      </>
    )
  },
)

export default UserAccountNav
