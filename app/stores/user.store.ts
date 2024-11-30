import { create } from 'zustand'

export const useUserStore = create<{
  id: string
  organizationId: string
  roleId: string
  menu: {
    title: string
    icon: string | null
    path: string
  }[]
  organizationsToChange: {
    id: string
    title: string
    isSelected: boolean
  }[]
  firstName: string
  setUser: (
    value: { userId: string; organizationId: string; roleId: string } & {
      menu: {
        title: string
        icon: string | null
        path: string
      }[]
      organizationsToChange: {
        id: string
        title: string
        isSelected: boolean
      }[]
      firstName: string
    },
  ) => void
}>()((set) => ({
  id: '',
  organizationId: '',
  roleId: '',
  menu: [],
  organizationsToChange: [],
  firstName: '',
  setUser: (
    value: { userId: string; organizationId: string; roleId: string } & {
      menu: {
        title: string
        icon: string | null
        path: string
      }[]
      organizationsToChange: {
        id: string
        title: string
        isSelected: boolean
      }[]
      firstName: string
    },
  ) =>
    set({
      id: value.userId,
      organizationId: value.organizationId,
      roleId: value.roleId,
      menu: value.menu,
      organizationsToChange: value.organizationsToChange,
      firstName: value.firstName,
    }),
}))
