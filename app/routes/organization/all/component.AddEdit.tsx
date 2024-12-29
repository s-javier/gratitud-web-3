import { useEffect, useState } from 'react'
import { useFetcher } from 'react-router'
import { Button, FormControlLabel, Switch, TextField } from '@mui/material'
import { toast } from 'sonner'

import { Api, ErrorTitle } from '~/enums'
import { useLoaderOverlayStore } from '~/stores'
import { cn } from '~/utils/cn'
import Overlay from '~/components/Overlay'
import Dialog from '~/components/Dialog'
import { MUIBtnStyle, MUISwitchStyle, MUITextFieldStyle } from '~/assets/styles/mui'
import { organizationCreateUpdateValidation } from './validation.create-update'

export type Props = {
  type: string
  isShow: boolean
  close: () => void
  /* ↓ Para editar */
  data?: {
    id: string
    title: string
    isActive: boolean
  }
}

type FetcherOutput = {
  isSuccess?: boolean
  errors?: {
    /* ▼ Error de validación */
    id?: string
    title?: string
    isActive?: string
    /* ▲ Error de validación */
    server?: { title: string; message: string }
  }
}

export default function OrganizationAddEdit(props: Props) {
  const setLoaderOverlay = useLoaderOverlayStore((state) => state.setLoaderOverlay)
  const fetcher = useFetcher<FetcherOutput>()

  const [title, setTitle] = useState<string>('')
  const [titleErrMsg, setTitleErrMsg] = useState<string>('')
  const [isActive, setIsActive] = useState<boolean>(true)
  const [isActiveErrMsg, setIsActiveErrMsg] = useState<string>('')

  useEffect(() => {
    /* ↓ Para editar */
    if (props.data && Object.keys(props.data).length > 0) {
      setTitle(props.data.title ?? '')
      setTitleErrMsg('')
      setIsActive(props.data.isActive ?? true)
      setIsActiveErrMsg('')
    }
  }, [props.data])

  useEffect(() => {
    setLoaderOverlay(fetcher.state !== 'idle')
    if (fetcher.state !== 'idle') {
      return
    }
    /* ↓ Errores de formulario */
    if (fetcher.data?.errors && fetcher.data.errors.server === undefined) {
      setTitleErrMsg(fetcher.data.errors.title ?? '')
      setIsActiveErrMsg(fetcher.data.errors.isActive ?? '')
      toast.error(ErrorTitle.FORM_GENERIC, {
        description: `Por favor corrige el formulario para ${props.type === 'add' ? 'agregar una nueva' : 'editar una'} organización.`,
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
        title={props.type === 'add' ? 'Nueva organización' : 'Edición de organización'}
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
                  setIsActive(true)
                  setIsActiveErrMsg('')
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
                const validation = organizationCreateUpdateValidation({
                  id: props.type === 'edit' ? props.data?.id || '' : undefined,
                  title,
                  isActive,
                })
                if (Object.keys(validation.errors).length > 0) {
                  setTitleErrMsg(validation.errors.title ?? '')
                  setIsActiveErrMsg(validation.errors.isActive ?? '')
                  return
                }
                const formData = new FormData()
                if (props.type === 'edit') {
                  formData.append('id', props.data?.id ?? '')
                }
                formData.append('title', title)
                formData.append('isActive', `${isActive}`)
                fetcher.submit(formData, {
                  method: 'post',
                  action: props.type === 'add' ? Api.ORGANIZATION_CREATE : Api.ORGANIZATION_UPDATE,
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
            A continuación puedes {props.type === 'add' ? 'agregar' : 'editar'} una organización.
          </p>
          <p className="text-sm text-gray-400">(*) Campos obligatorios.</p>
        </div>
        <div className="space-y-4">
          <TextField
            name="title"
            type="text"
            label="Nombre de la organización*"
            fullWidth
            sx={MUITextFieldStyle}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={titleErrMsg ? true : false}
            helperText={titleErrMsg}
            onFocus={() => setTitleErrMsg('')}
          />
          <FormControlLabel
            control={
              <Switch
                sx={MUISwitchStyle}
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
            }
            label={isActive ? 'Activa' : 'Inactiva'}
          />
        </div>
      </Dialog>
    </Overlay>
  )
}
