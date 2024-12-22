import { create } from 'zustand'

type RolePermission = {
  roleId: string
  permissionId: string
}

type RolePermissionStore = {
  rolePermission: RolePermission[]
  setRolePermission: (value: RolePermission[]) => void
}

export const useRolePermissionStore = create<RolePermissionStore>()((set) => ({
  rolePermission: [],
  setRolePermission: (value) =>
    set({
      rolePermission: value,
    }),
}))
