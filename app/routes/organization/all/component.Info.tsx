import { Button } from '@mui/material'

import { type Element } from './component.view.Organizations'
import { cn } from '~/utils/cn'
import Overlay from '~/components/Overlay'
import Dialog from '~/components/Dialog'

export type Props = {
  isShow: boolean
  close: () => void
  data: Element
}

export default function OrganizationInfo(props: Props) {
  return (
    <Overlay type="dialog" isActive={props.isShow}>
      <Dialog
        title="Organización"
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
        <div className="space-y-4">
          <div className="">
            <p className="font-bold">ID</p>
            <p>{props.data.id}</p>
          </div>
          <div className="">
            <p className="font-bold">Organización</p>
            <p>{props.data.title}</p>
          </div>
          <div className="">
            <p className="font-bold">Activa</p>
            <p>
              {props.data.isActive ? (
                <span className="text-green-500">Sí</span>
              ) : (
                <span className="text-red-500">No</span>
              )}
            </p>
          </div>
        </div>
      </Dialog>
    </Overlay>
  )
}
