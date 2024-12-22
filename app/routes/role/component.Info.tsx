import { Button } from '@mui/material'

import { type Element } from './component.view.Roles'
import { cn } from '~/utils/cn'
import Overlay from '~/components/Overlay'
import Dialog from '~/components/Dialog'
import RoleInfoPermissionView from './component.InfoPermissionView'
import RoleInfoPermissionApi from './component.InfoPermissionApi'

export type Props = {
  isShow: boolean
  close: () => void
  data: Element
}

export default function RoleInfo(props: Props) {
  return (
    <Overlay type="dialog" isActive={props.isShow} width="max-w-[570px]">
      <Dialog
        title="Rol"
        close={props.close}
        footer={
          <Button
            type="button"
            variant="outlined"
            className={cn(
              'm-auto',
              '!text-gray-700 !border-gray-300 hover:!bg-gray-50',
              'hover:!border-[var(--o-btn-cancel-border-hover-color)]',
              'uppercase',
            )}
            onClick={props.close}
          >
            Cerrar
          </Button>
        }
      >
        <div className="space-y-4 mb-8">
          <div className="">
            <p className="font-bold">ID</p>
            <p>{props.data.id}</p>
          </div>
          <div className="">
            <p className="font-bold">Rol</p>
            <p>{props.data.title}</p>
          </div>
        </div>
        <div className="mb-8">
          <h2 className="mb-3 text-lg font-bold">Vistas</h2>
          {props.isShow && (
            <RoleInfoPermissionView
              id={props.data.id}
              title={props.data.title}
              permissions={props.data.permissions.view}
            />
          )}
        </div>
        <div>
          <h2 className="mb-3 text-lg font-bold">API</h2>
          {props.isShow && (
            <RoleInfoPermissionApi
              id={props.data.id}
              title={props.data.title}
              permissions={props.data.permissions.api}
            />
          )}
        </div>
      </Dialog>
    </Overlay>
  )
}
