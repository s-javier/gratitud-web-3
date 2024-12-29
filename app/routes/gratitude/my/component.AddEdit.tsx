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
import { gratitudeCreateUpdateValidation } from '../validation.create-update'

export default function GratitudeMyAddEdit(props: {
  type: string
  isShow: boolean
  close: () => void
  data?: { id?: string; title: string; description: string }
  userId: string
}) {
  const setLoaderOverlay = useLoaderOverlayStore((state) => state.setLoaderOverlay)
  const [id, setId] = useState('')
  const [title, setTitle] = useState('')
  const [titleErrMsg, setTitleErrMsg] = useState('')
  const [description, setDescription] = useState('')
  const [descriptionErrMsg, setDescriptionErrMsg] = useState('')
  const fetcher = useFetcher<{
    isSuccess?: boolean
    errors?: {
      title?: string
      description?: string
      server?: { title: string; message: string }
    }
  }>()

  useEffect(() => {
    /* ↓ Para editar */
    if (props.data && Object.keys(props.data).length > 0) {
      setId(props.data.id || '')
      setTitle(props.data.title || '')
      setTitleErrMsg('')
      setDescription(props.data.description)
      setDescriptionErrMsg('')
    }
  }, [props.data])

  useEffect(() => {
    setLoaderOverlay(fetcher.state !== 'idle')
    if (fetcher.state !== 'idle') {
      return
    }
    /* ↓ Errores de formulario */
    if (fetcher.data?.errors && fetcher.data.errors.server === undefined) {
      setTitleErrMsg(fetcher.data.errors.title || '')
      setDescriptionErrMsg(fetcher.data.errors.description || '')
      toast.error(ErrorTitle.FORM_GENERIC, {
        description: 'Por favor corrige el formulario para agregar un agradecimiento.',
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
        title="Nuevo agradecimiento"
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
                variant="contained"
                sx={MUIBtnStyle}
                onClick={() => {
                  const validation = gratitudeCreateUpdateValidation({
                    title: title || undefined,
                    description,
                  })
                  if (Object.keys(validation.errors).length > 0) {
                    setTitleErrMsg(validation.errors.title || '')
                    setDescriptionErrMsg(validation.errors.description || '')
                    return
                  }
                  const formData = new FormData()
                  formData.append('userId', props.userId)
                  if (title.length > 0) {
                    formData.append('title', title)
                  }
                  formData.append('description', description)
                  formData.append('isMaterialized', 'true')
                  fetcher.submit(formData, { method: 'post', action: Api.GRATITUDE_CREATE })
                }}
              >
                Agregar
              </Button>
            )}
            {props.type === 'edit' && (
              <Button
                type="button"
                variant="contained"
                sx={MUIBtnStyle}
                onClick={() => {
                  const validation = gratitudeCreateUpdateValidation({
                    title: title || undefined,
                    description,
                  })
                  if (Object.keys(validation.errors).length > 0) {
                    setTitleErrMsg(validation.errors.title || '')
                    setDescriptionErrMsg(validation.errors.description || '')
                    return
                  }
                  const formData = new FormData()
                  formData.append('id', id)
                  formData.append('userId', props.userId)
                  if (title.length > 0) {
                    formData.append('title', title)
                  }
                  formData.append('description', description)
                  formData.append('isMaterialized', 'true')
                  props.close()
                  fetcher.submit(formData, { method: 'post', action: Api.GRATITUDE_UPDATE })
                }}
              >
                Editar
              </Button>
            )}
          </>
        }
      >
        <div className="space-y-4 mb-8">
          <p className="">A continuación puedese agregar un agradecimiento.</p>
          <p className="text-sm text-gray-400">(*) Campos obligatorios.</p>
        </div>
        <div className="space-y-4">
          <TextField
            name="title"
            type="text"
            label="Título"
            fullWidth
            sx={MUITextFieldStyle}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={titleErrMsg ? true : false}
            helperText={titleErrMsg}
            onFocus={() => setTitleErrMsg('')}
          />
          <TextField
            name="description"
            type="text"
            multiline
            label="Descripción*"
            fullWidth
            sx={MUITextFieldStyle}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={descriptionErrMsg ? true : false}
            helperText={descriptionErrMsg}
            onFocus={() => setDescriptionErrMsg('')}
          />
        </div>
      </Dialog>
    </Overlay>
  )
}
