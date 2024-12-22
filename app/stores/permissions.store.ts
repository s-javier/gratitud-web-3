import { create } from 'zustand'

type Permission = {
  id: string
  type: string
  path: string
}

type PermissionStore = {
  permissions: Permission[]
  setPermissions: (value: Permission[]) => void
}

export const usePermissionsStore = create<PermissionStore>()((set) => ({
  permissions: [],
  setPermissions: (value) =>
    set({
      permissions: value,
    }),
}))
