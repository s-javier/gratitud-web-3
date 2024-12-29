import { useEffect, useState } from 'react'
import { useFetcher } from 'react-router'
import { Button, TextField } from '@mui/material'
import { toast } from 'sonner'

import { Api, ErrorTitle } from '~/enums'
import { useLoaderOverlayStore } from '~/stores'
import { cn } from '~/utils/cn'
import Overlay from '~/components/Overlay'
import Dialog from '~/components/Dialog'
import { MUIBtnStyle, MUITextFieldStyle } from '~/assets/styles/mui'
import { roleCreateUpdateValidation } from './validation.create-update'

type Props = {
  type: string
  isShow: boolean
  close: () => void
  /* ↓ Para editar */
  data?: {
    id: string
    path: string
    type: string
  }
}

type FetcherOutput = {
  isSuccess?: boolean
  errors?: {
    /* ▼ Error de validación */
    id?: string
    path?: string
    type?: string
    /* ▲ Error de validación */
    server?: { title: string; message: string }
  }
}

export default function PermissionAddEdit(props: Props) {
  const setLoaderOverlay = useLoaderOverlayStore((state) => state.setLoaderOverlay)
  const fetcher = useFetcher<FetcherOutput>()

  const [title, setTitle] = useState<string>('')
  const [titleErrMsg, setTitleErrMsg] = useState<string>('')
  const [path, setPath] = useState<string>('')
  const [pathErrMsg, setPathErrMsg] = useState<string>('')
  const [type, setType] = useState<string>('')
  const [typeErrMsg, setTypeErrMsg] = useState<string>('')

  useEffect(() => {
    /* ↓ Para editar */
    if (props.data && Object.keys(props.data).length > 0) {
      setPath(props.data.path ?? '')
      setPathErrMsg('')
      setType(props.data.type ?? '')
      setTypeErrMsg('')
    }
  }, [props.data])

  useEffect(() => {
    setLoaderOverlay(fetcher.state !== 'idle')
    if (fetcher.state !== 'idle') {
      return
    }
    /* ↓ Errores de formulario */
    if (fetcher.data?.errors && fetcher.data.errors.server === undefined) {
      setPathErrMsg(fetcher.data.errors.path ?? '')
      setTypeErrMsg(fetcher.data.errors.type ?? '')
      toast.error(ErrorTitle.FORM_GENERIC, {
        description: `Por favor corrige el formulario para ${props.type === 'add' ? 'agregar un nuevo' : 'editar un'} permiso.`,
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
    <Overlay type="dialog" width="max-w-[500px]" isActive={props.isShow}>
      <Dialog
        title={props.type === 'add' ? 'Nuevo permiso' : 'Edición de permiso'}
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
            {props.type === 'add' && (
              <Button
                type="button"
                variant="outlined"
                className={cn(
                  '!text-gray-700 !border-gray-300 hover:!bg-gray-50',
                  'hover:!border-(--o-btn-cancel-border-hover-color)',
                  'uppercase',
                )}
                onClick={() => {
                  setTitle('')
                  setTitleErrMsg('')
                }}
              >
                Limpiar
              </Button>
            )}
            <Button
              type="button"
              variant="contained"
              sx={MUIBtnStyle}
              onClick={() => {
                const validation = roleCreateUpdateValidation({
                  id: props.type === 'edit' ? props.data?.id || '' : undefined,
                  title,
                })
                if (Object.keys(validation.errors).length > 0) {
                  setTitleErrMsg(validation.errors.title ?? '')
                  return
                }
                const formData = new FormData()
                if (props.type === 'edit') {
                  formData.append('id', props.data?.id ?? '')
                }
                formData.append('title', title)
                fetcher.submit(formData, {
                  method: 'post',
                  action: props.type === 'add' ? Api.ROLE_CREATE : Api.ROLE_UPDATE,
                })
              }}
            >
              {props.type === 'add' ? 'Agregar' : 'Editar'}
            </Button>
          </>
        }
      >
        <div className="space-y-4 mb-8">
          <p className="">
            A continuación puedes {props.type === 'add' ? 'agregar' : 'editar'} un permiso.
          </p>
          <p className="text-sm text-gray-400">(*) Campos obligatorios.</p>
        </div>
        <div className="!space-y-4">
          <TextField
            name="path"
            type="text"
            label="Ruta*"
            fullWidth
            sx={MUITextFieldStyle}
            value={path}
            onChange={(e) => setPath(e.target.value)}
            error={pathErrMsg ? true : false}
            helperText={pathErrMsg}
            onFocus={() => setPathErrMsg('')}
          />
        </div>
      </Dialog>
    </Overlay>
  )
}
