import { Button } from '@mui/material'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

import { cn } from '~/utils/cn'
import Overlay from '~/components/Overlay'
import Dialog from '~/components/Dialog'

export type Props = {
  isShow: boolean
  close: () => void
  data: {
    id: string
    spm: string | null
    status: string | null
    patientId: string
    period: string | null
    paymentDate: string | null
    rut: string | null
    firstName: string
    paternalSurname: string | null
    maternalSurname: string | null
  }
}

export default function ReceivableInfo(props: Props) {
  return (
    <Overlay type="dialog" isActive={props.isShow}>
      <Dialog
        title="Cuenta"
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
            <p className="font-bold">SPM</p>
            <p>{props.data.spm ?? '-'}</p>
          </div>
          <div className="">
            <p className="font-bold">Estado</p>
            <p>{props.data.status}</p>
          </div>
          <div className="">
            <p className="font-bold">Periodo</p>
            <p>
              {props.data.period
                ? format(parseISO(props.data.period), "d 'de' MMMM 'de' yyyy", { locale: es })
                : '-'}
            </p>
          </div>
          <div className="">
            <p className="font-bold">Fecha de pago</p>
            <p>
              {props.data.paymentDate
                ? format(parseISO(props.data.paymentDate), "d 'de' MMMM 'de' yyyy", { locale: es })
                : '-'}
            </p>
          </div>
          <div className="">
            <p className="font-bold">Nombre(s)</p>
            <p>{props.data.firstName}</p>
          </div>
          <div className="">
            <p className="font-bold">Apellido paterno</p>
            <p>{props.data.paternalSurname}</p>
          </div>
          <div className="">
            <p className="font-bold">Apellido materno</p>
            <p>{props.data.maternalSurname}</p>
          </div>
        </div>
      </Dialog>
    </Overlay>
  )
}
