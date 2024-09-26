import type { Icons } from './shared/icons'

export type NavItem = {
  title: string
  href: string
  disabled?: boolean
  external?: boolean
  icon?: keyof typeof Icons
}

export type SidebarNavItem = {
  title: string
  items: NavItem[]
  icon?: keyof typeof Icons
}

export type User = {
  email: string
  name?: string
  role?: string
  image?: string
  project_features?: any
}

export type Project = {
  _id?: string
  name?: string
  slug?: string

  scenes?: any[]

  created_at?: Date
}
