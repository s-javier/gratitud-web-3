import { create } from 'zustand'

type Role = {
  id: string
  title: string
}

type RoleStore = {
  roles: Role[]
  setRoles: (value: Role[]) => void
}

export const useRolesStore = create<RoleStore>()((set) => ({
  roles: [],
  setRoles: (value) =>
    set({
      roles: value,
    }),
}))
