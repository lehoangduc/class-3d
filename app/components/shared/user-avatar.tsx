import type { AvatarProps } from '@radix-ui/react-avatar'

import { Icons } from '../shared/icons'
import type { User } from '../types'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

interface UserAvatarProps extends AvatarProps {
  user: User
}

export default function UserAvatar({ user, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      {user.image ? (
        <AvatarImage alt="Picture" src={user.image} referrerPolicy="no-referrer" />
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user.name}</span>
          <Icons.user className="size-4" />
        </AvatarFallback>
      )}
    </Avatar>
  )
}
