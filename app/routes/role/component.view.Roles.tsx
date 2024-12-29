import { useEffect, useState } from 'react'
import { useLoaderData, type LoaderFunctionArgs, type MetaFunction } from 'react-router'
import { ListItemIcon, MenuItem } from '@mui/material'
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from 'material-react-table'
import { Icon } from '@iconify/react'
import { toast } from 'sonner'

import { UserInfo } from '~/types'
import { ErrorMessage, ErrorTitle } from '~/enums'
import { getRoleAllFromDB } from './db.all'
import {
  getRolePermissionAllFromDB,
  getRolePermissionAllPopulatedFromDB,
} from '~/routes/role/db.role-permission'
import { getPermissionAllFromDB } from '~/routes/permission/db.all'
import { usePermissionsStore, useRolePermissionStore, useRolesStore } from '~/stores'
import AdminHeader from '~/routes/admin/component.AdminHeader'
import AdminMain from '~/routes/admin/component.AdminMain'
import Add from './component.Add'
import Info from './component.Info'
import AddEdit from './component.AddEdit'
import Delete from './component.Delete'

export type Element = {
  id: string
  title: string
  permissions: {
    view: {
      permissionId: string
      permissionPath: string
      sort: number | null
    }[]
    api: {
      permissionId: string
      permissionPath: string
    }[]
  }
}

type Loader = {
  errors?: { server: { title: string; message: string } }
  userInfo?: UserInfo
  roles?: Element[]
  rolePermission?: {
    roleId: string
    permissionId: string
  }[]
  permissions?: {
    id: string
    type: string
    path: string
  }[]
}

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const userInfo = (await context.middleware) as UserInfo | 'error'
  if (userInfo === 'error') {
    return {
      errors: {
        server: {
          title: ErrorTitle.SERVER_GENERIC,
          message: ErrorMessage.SERVER_GENERIC,
        },
      },
    }
  }
  const roles = await getRoleAllFromDB()
  if (roles.errors) {
    return { ...roles }
  }
  const rolePermission = await getRolePermissionAllFromDB()
  if (rolePermission.errors) {
    return { ...rolePermission }
  }
  const permissions = await getPermissionAllFromDB()
  if (permissions.errors) {
    return { ...permissions }
  }
  const rolePermissionPopulated = await getRolePermissionAllPopulatedFromDB()
  if (rolePermissionPopulated.errors) {
    return { ...rolePermissionPopulated }
  }
  const rolePermissionPopulatedData = rolePermissionPopulated.rolePermissionPopulated!
  roles.roles!.forEach((role: any) => {
    role.permissions = {
      view: rolePermissionPopulatedData
        .filter((item: any) => item.roleId === role.id && item.permissionType === 'view')
        .map((item: any) => ({
          permissionId: item.permissionId,
          permissionPath: item.permissionPath,
          sort: item.sort,
        })),
      api: rolePermissionPopulatedData
        .filter((item: any) => item.roleId === role.id && item.permissionType === 'api')
        .map((item: any) => ({
          permissionId: item.permissionId,
          permissionPath: item.permissionPath,
        })),
    }
  })
  return { userInfo, ...roles, ...rolePermission, ...permissions }
}

export const meta: MetaFunction = () => {
  return [{ title: 'Roles | Admin' }, { name: 'description', content: '' }]
}

const columns: MRT_ColumnDef<any>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    enableClickToCopy: true,
  },
  {
    accessorKey: 'title',
    header: 'Rol',
  },
  {
    accessorFn: (row: Element) => row.permissions.view.length + row.permissions.api.length,
    header: 'Permisos',
  },
]

export default function RoleAllRoute() {
  const loader = useLoaderData<Loader>()
  const [elements, setElements] = useState<Element[]>([])
  const setRoles = useRolesStore((state) => state.setRoles)
  const setPermissions = usePermissionsStore((state) => state.setPermissions)
  const setRolePermission = useRolePermissionStore((state) => state.setRolePermission)
  const table = useMaterialReactTable({
    columns,
    data: elements,
    enableRowActions: true,
    enablePagination: false,
    enableDensityToggle: false,
    initialState: {
      columnPinning: {
        left: ['mrt-row-expand', 'mrt-row-select'],
        right: ['mrt-row-actions'],
      },
    },
    renderRowActionMenuItems: ({ row, closeMenu }) => [
      <MenuItem
        key={`view-${row.original.id}`}
        onClick={() => {
          setElement(row.original)
          setIsInfoOpen(true)
          closeMenu()
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <Icon icon="mdi:remove-red-eye" width="100%" className="w-6 text-blue-500" />
        </ListItemIcon>
        Ver
      </MenuItem>,
      <MenuItem
        key={`edit-${row.original.id}`}
        onClick={() => {
          setElement(row.original)
          setIsEditOpen(true)
          closeMenu()
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <Icon icon="mdi:edit" width="100%" className="w-6 text-green-500" />
        </ListItemIcon>
        Editar
      </MenuItem>,
      <MenuItem
        key={`delete-${row.original.id}`}
        onClick={() => {
          setElement(row.original)
          setIsDeleteOpen(true)
          closeMenu()
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <Icon icon="mdi:trash" width="100%" className="w-6 text-red-500" />
        </ListItemIcon>
        Eliminar
      </MenuItem>,
    ],
    enableRowSelection: true,
  })
  const { getRowModel } = table
  const [element, setElement] = useState<any>({})
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  useEffect(() => {
    if (loader?.errors?.server) {
      toast.error(loader.errors.server.title, {
        description: loader.errors.server.message || undefined,
        duration: 5000,
      })
      return
    }
    setElements(loader.roles || [])
    setRoles(loader.roles || [])
    setPermissions(loader.permissions || [])
    setRolePermission(loader.rolePermission || [])
  }, [loader])

  return (
    <>
      <Info isShow={isInfoOpen} close={() => setIsInfoOpen(false)} data={element} />
      <AddEdit type="edit" isShow={isEditOpen} close={() => setIsEditOpen(false)} data={element} />
      <Delete isShow={isDeleteOpen} close={() => setIsDeleteOpen(false)} data={element} />
      <AdminHeader
        title={
          <h1 className="max-w-[800px] text-3xl font-bold tracking-tight text-white">Roles</h1>
        }
        buttons={<Add />}
      />
      <AdminMain>
        <p className="mb-8">Roles del sistema.</p>
        <p className="text-gray-400 text-sm mb-2">
          Estás viendo {getRowModel().rows.length}{' '}
          {getRowModel().rows.length === 1 ? 'rol' : 'roles'}.
        </p>
        <MaterialReactTable table={table} />
      </AdminMain>
    </>
  )
}
