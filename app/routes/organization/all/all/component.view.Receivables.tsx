import { useEffect, useState } from 'react'
import { type LoaderFunctionArgs, useLoaderData, type MetaFunction } from 'react-router'
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
  useMaterialReactTable,
} from 'material-react-table'
import { Box, Button, ListItemIcon, MenuItem } from '@mui/material'
import { Icon } from '@iconify/react'
import { toast } from 'sonner'
import { mkConfig, generateCsv, download } from 'export-to-csv'

import { UserInfo } from '~/types'
import { ErrorMessage, ErrorTitle, General } from '~/enums'
import { usePatientsStore } from '~/stores'
import { getReceivablesFromDB } from './db.all'
import { getPatientsFromDB } from '~/routes/patient/all/db.all'
import AdminHeader from '~/routes/admin/component.AdminHeader'
import AdminMain from '~/routes/admin/component.AdminMain'
import Add from './component.Add'
import Info from './component.Info'
import AddEdit from './component.AddEdit'
import Delete from './component.Delete'

type Element = {
  id: string
  spm: string | null
  preinvoice: number | null
  period: string | null
  paymentDate: string | null
  status: string | null
  patientId: string
  rut: string | null
  firstName: string
  paternalSurname: string | null
  maternalSurname: string | null
}

type Loader = {
  errors?: { server: { title: string; message: string } }
  userInfo?: UserInfo
  receivables?: Element[]
  /* ↓ Para input de agregar/editar */
  patients?: {
    id: string
    rut: string | null
    firstName: string
    paternalSurname: string | null
    maternalSurname: string | null
  }[]
}

export const meta: MetaFunction = () => {
  return [{ title: `Cuentas | ${General.TITLE}` }, { name: 'description', content: '' }]
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
  const receivables = await getReceivablesFromDB(userInfo.organizationId)
  const patients = await getPatientsFromDB(userInfo.organizationId)
  return { userInfo, ...receivables, ...patients }
}

const columns: MRT_ColumnDef<any>[] = [
  {
    accessorKey: 'isapre',
    header: 'Isapre',
    size: 100,
  },
  {
    accessorKey: 'financing',
    header: 'Finan.',
    size: 80,
  },
  {
    accessorKey: 'spm',
    header: 'SPM',
    size: 100,
    enableClickToCopy: true,
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    size: 100,
  },
  {
    accessorKey: 'period',
    header: 'Periodo',
    size: 90,
  },
  {
    accessorKey: 'paymentDate',
    header: 'F. pago',
    size: 90,
  },
  {
    accessorFn: (row: any) => row.preinvoice?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' '),
    header: 'Prefactura',
    size: 80,
    muiTableBodyCellProps: {
      align: 'right', // Alinea el contenido a la derecha
    },
    muiTableHeadCellProps: {
      align: 'right', // Alinea el encabezado también a la derecha
    },
  },
  {
    accessorFn: (row: any) => ``,
    header: 'Liquidación',
    size: 80,
  },
  {
    accessorFn: (row: any) => ``,
    header: 'Dif. Pref. y Liq.',
    size: 80,
  },
  {
    accessorFn: (row: any) => ``,
    header: 'Copago',
    size: 80,
  },
  {
    accessorKey: 'rut',
    header: 'RUT',
    size: 110,
    enableClickToCopy: true,
  },
  {
    accessorFn: (row: any) => `${row.firstName} ${row.paternalSurname} ${row.maternalSurname}`,
    header: 'Paciente',
    size: 250,
  },
  {
    accessorFn: (row: any) => ``,
    header: 'Fac. Isapre',
    size: 80,
  },
  {
    accessorFn: (row: any) => ``,
    header: 'Fac. I. Folio',
    size: 80,
  },
  {
    accessorFn: (row: any) => ``,
    header: 'Fac. Paciente',
    size: 80,
  },
  {
    accessorFn: (row: any) => ``,
    header: 'Fac. P. Folio',
    size: 80,
  },
  {
    accessorFn: (row: any) => ``,
    header: 'Dif. Liq. y Fac.',
    size: 80,
  },
]

const csvConfig = mkConfig({
  fieldSeparator: ';',
  decimalSeparator: '.',
  useKeysAsHeaders: true,
})

export default function ReceivableAllRoute() {
  const loader = useLoaderData<Loader>()
  const [elements, setElements] = useState<Element[]>([])
  const setPatients = usePatientsStore((state) => state.setPatients)
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
      <MenuItem
        key={`invoice-${row.original.id}`}
        onClick={() => {
          closeMenu()
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <Icon icon="mdi:edit" width="100%" className="w-6 text-green-500" />
        </ListItemIcon>
        Facturar
      </MenuItem>,
      <MenuItem
        key={`income-${row.original.id}`}
        onClick={() => {
          closeMenu()
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <Icon icon="mdi:edit" width="100%" className="w-6 text-green-500" />
        </ListItemIcon>
        Agregar ingreso
      </MenuItem>,

      // <MenuItem
      //   key={`trxs-${row.original.id}`}
      //   onClick={() => {
      //     // Send email logic...
      //     closeMenu()
      //   }}
      //   sx={{ m: 0 }}
      // >
      //   <ListItemIcon>
      //     <Icon icon="mdi:instant-transfer" width="100%" className="w-6 text-indigo-400" />
      //   </ListItemIcon>
      //   Agregar transacción
      // </MenuItem>,
    ],
    enableRowSelection: true,
    // columnFilterDisplayMode: 'popover',
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      >
        <Button
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          //export all rows, including from the next page, (still respects filtering and sorting)
          onClick={() => handleExportRows(table.getPrePaginationRowModel().rows)}
          startIcon={<Icon icon="mdi:download" width="100%" className="w-6" />}
        >
          Exportart todas las filas
        </Button>
        <Button
          disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
          //only export selected rows
          onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
          startIcon={<Icon icon="mdi:download" width="100%" className="w-6" />}
        >
          Exportar las filas seleccionadas
        </Button>
      </Box>
    ),
  })
  const { getRowModel, getState } = table
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
    setElements(loader.receivables || [])
    setPatients(loader.patients || [])
  }, [loader])

  const handleExportRows = (rows: MRT_Row<any>[]) => {
    const rowData = rows.map((row) => row.original)
    const csv = generateCsv(csvConfig)(rowData)
    download(csvConfig)(csv)
  }

  return (
    <>
      <Info isShow={isInfoOpen} close={() => setIsInfoOpen(false)} data={receivable} />
      <AddEdit
        type="edit"
        isShow={isEditOpen}
        close={() => setIsEditOpen(false)}
        data={receivable}
      />
      <Delete isShow={isDeleteOpen} close={() => setIsDeleteOpen(false)} data={receivable} />
      <AdminHeader
        title={
          <h1 className="max-w-[800px] text-3xl font-bold tracking-tight text-white">Cuentas</h1>
        }
        buttons={<Add />}
      />
      <AdminMain>
        <p className="mb-8">Cuentas de pacientes.</p>
        <p className="text-gray-400 text-sm mb-2">
          Estás viendo {getRowModel().rows.length}{' '}
          {getRowModel().rows.length === 1 ? 'cuenta' : 'cuentas'}.
        </p>
        <MaterialReactTable table={table} />
      </AdminMain>
    </>
  )
}
