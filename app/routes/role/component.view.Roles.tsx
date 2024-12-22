import { useEffect, useState } from 'react'
import { useLoaderData, type LoaderFunctionArgs, type MetaFunction } from 'react-router'
import { Button, ListItemIcon, MenuItem } from '@mui/material'
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from 'material-react-table'
import { Icon } from '@iconify/react'
import { toast } from 'sonner'

import { UserInfo } from '~/types'
import { ErrorMessage, ErrorTitle } from '~/enums'
import { getRoleAllFromDB } from './db.all'
import { MUIBtnStyle } from '~/assets/styles/mui'
import AdminHeader from '~/routes/admin/component.AdminHeader'
import AdminMain from '~/routes/admin/component.AdminMain'

type Element = {
  id: string
  title: string
}

type Loader = {
  errors?: { server: { title: string; message: string } }
  userInfo?: UserInfo
  roles?: Element[]
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
  const organizations = await getRoleAllFromDB()
  return { userInfo, ...organizations }
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
    accessorFn: () => '',
    header: 'Permisos',
  },
]

export default function OrganizationAllRoute() {
  const loader = useLoaderData<Loader>()
  const [elements, setElements] = useState<Element[]>([])
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
          setReceivable(row.original)
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
          setReceivable(row.original)
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
          setReceivable(row.original)
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
  const [receivable, setReceivable] = useState<any>({})
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
  }, [loader])

  return (
    <>
      <AdminHeader
        title={
          <h1 className="max-w-[800px] text-3xl font-bold tracking-tight text-white">Roles</h1>
        }
        buttons={
          <Button type="button" variant="contained" size="small" sx={MUIBtnStyle}>
            Agregar
          </Button>
        }
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
