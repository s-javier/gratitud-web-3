import { useEffect } from 'react'
import { useFetcher } from 'react-router'
import { Button } from '@mui/material'
import { toast } from 'sonner'

import { Api, ErrorMessage, ErrorTitle } from '~/enums'
import { useLoaderOverlayStore } from '~/stores'
import { cn } from '~/utils/cn'
import Overlay from '~/components/Overlay'
import Dialog from '~/components/Dialog'

type Props = {
  isShow: boolean
  close: () => void
  data: {
    roleId: string
    roleTitle: string
    permissionId: string
    permissionType: string
    permissionPath: string
  }
}

type FetcherOutput = {
  isSuccess?: boolean
  errors?: {
    id?: string
    server?: { title: string; message: string }
  }
}

export default function RoleDeletePermission(props: Props) {
  const setLoaderOverlay = useLoaderOverlayStore((state) => state.setLoaderOverlay)
  const fetcher = useFetcher<FetcherOutput>()

  useEffect(() => {
    setLoaderOverlay(fetcher.state !== 'idle')
    if (fetcher.state !== 'idle') {
      return
    }
    /* ↓ Errores de formulario */
    if (fetcher.data?.errors && fetcher.data.errors.server === undefined) {
      toast.error(ErrorTitle.SERVER_GENERIC, {
        description: ErrorMessage.SERVER_GENERIC,
        duration: 5000,
      })
      return
    }
    /* ↓ Error de servidor */
    if (fetcher.data?.errors?.server) {
      toast.error(fetcher.data.errors.server.title, {
        description: fetcher.data.errors.server.message || undefined,
        duration: 5000,
      })
      return
    }
    if (fetcher.data?.isSuccess) {
      props.close()
    }
  }, [fetcher])

  return (
    <Overlay type="dialog" isActive={props.isShow}>
      <Dialog
        title="Eliminación de relación: Rol - Permiso"
        close={props.close}
        footer={
          <>
            <Button
              type="button"
              variant="outlined"
              className={cn(
                '!text-gray-700 !border-gray-300 hover:!bg-gray-50',
                'hover:!border-(--o-btn-cancel-border-hover-color)',
                'uppercase',
              )}
              onClick={props.close}
            >
              Cerrar
            </Button>
            <Button
              type="button"
              variant="contained"
              className="!text-white !bg-red-500 hover:!bg-red-400 !font-bold"
              onClick={async () => {
                const formData = new FormData()
                formData.append('roleId', props.data.roleId)
                formData.append('permissionId', props.data.permissionId)
                formData.append('type', props.data.permissionType)
                fetcher.submit(formData, {
                  method: 'post',
                  action: Api.ROLE_DELETE_RELATION_PERMISSION,
                })
              }}
            >
              Sí, eliminar
            </Button>
          </>
        }
      >
        <p className="text-center mb-4">
          El rol <strong>{props.data.roleTitle}</strong> está relacionado con el permiso{' '}
          <strong>
            {props.data.permissionPath} ({props.data.permissionType})
          </strong>
          .
        </p>
        <p className="text-center mb-4">¿Estás seguro que deseas eliminar la relación?</p>
        <p className="text-center">
          Se perderán permanentemente los datos eliminados y los que estén asociados.
        </p>
      </Dialog>
    </Overlay>
  )
}
