import { useEffect, useState } from 'react'
// @ts-ignore
import { createPortal } from 'react-dom'
import { useLoaderData, type LoaderFunctionArgs, type MetaFunction } from 'react-router'
import { Button, IconButton, ListItemIcon, MenuItem } from '@mui/material'
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from 'material-react-table'
import { Icon } from '@iconify/react'
import { toast } from 'sonner'

import { ErrorMessage, ErrorTitle } from '~/enums'
import { MUIBtnStyle } from '~/assets/styles/mui'
import AdminHeader from '~/routes/admin/component.AdminHeader'
import AdminMain from '~/routes/admin/component.AdminMain'
import RoleDeletePermission from './component.DeletePermission'

type Props = {
  id: string
  title: string
  permissions: {
    permissionId: string
    permissionPath: string
  }[]
}

export default function RoleInfoPermissionApi(props: Props) {
  const columns: MRT_ColumnDef<any>[] = [
    {
      accessorKey: 'permissionPath',
      header: 'Permiso',
      enableColumnActions: false,
    },
    {
      accessorKey: 'delete',
      header: '',
      accessorFn: (row: any) => {
        return (
          <div className="h-full flex flex-row items-center">
            <IconButton
              aria-label="delete"
              onClick={() => {
                setPermissionRole({
                  roleId: props.id,
                  roleTitle: props.title,
                  permissionId: row.permissionId,
                  permissionType: 'api',
                  permissionPath: row.permissionPath,
                })
                setIsDeleteRelationOpen(true)
              }}
            >
              <Icon icon="mdi:delete" width="100%" className="w-5 text-red-500" />
            </IconButton>
          </div>
        )
      },
      enableSorting: false,
      enableColumnFilter: false,
      enableColumnActions: false,
      size: 50,
    },
  ]
  const table = useMaterialReactTable({
    columns,
    data: props.permissions,
    enablePagination: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableColumnPinning: true,
    initialState: {
      columnPinning: {
        right: ['delete'],
      },
      density: 'compact',
    },
  })
  const { getRowModel } = table
  const [permissionRole, setPermissionRole] = useState<any>({})
  const [isDeleteRelationOpen, setIsDeleteRelationOpen] = useState(false)

  return (
    <>
      {props.id &&
        createPortal(
          <RoleDeletePermission
            isShow={isDeleteRelationOpen}
            close={() => setIsDeleteRelationOpen(false)}
            data={permissionRole}
          />,
          document.querySelector('body')!,
        )}
      <p className="text-gray-400 text-sm mb-2">
        Estás viendo {getRowModel().rows.length}{' '}
        {getRowModel().rows.length === 1 ? 'permiso' : 'permisos'}.
      </p>
      <MaterialReactTable table={table} />
    </>
  )
}
