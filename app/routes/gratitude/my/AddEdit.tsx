import { useEffect, useRef, useState } from 'react'
import { useFetcher } from 'react-router'
import { Button, TextField } from '@mui/material'
import { toast } from 'sonner'

import { Api, ErrorTitle } from '~/enums'
import { useLoaderOverlayStore } from '~/stores'
import { cn } from '~/utils/cn'
// import { gratitudeCreateValidation } from '~/utils/validations'
import Overlay from '~/components/shared/Overlay'
import Dialog from '~/components/shared/Dialog'
import { MUITextFieldStyle } from '~/assets/styles/mui'

export default function GratitudeMyAddEdit(props: {
  type: string
  isShow: boolean
  close: () => void
  userId: string
  data?: { title: string; description: string }
}) {
  const setLoaderOverlay = useLoaderOverlayStore((state) => state.setLoaderOverlay)
  const [title, setTitle] = useState('')
  const [titleErrMsg, setTitleErrMsg] = useState('')
  const [description, setDescription] = useState('')
  const [descriptionErrMsg, setDescriptionErrMsg] = useState('')
  const fetcher = useFetcher<{
    isGratitudeCreated?: boolean
    errors?: {
      title?: string
      description?: string
      server?: { title: string; message: string }
    }
  }>()
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    /* ↓ Para editar */
    if (props.data && Object.keys(props.data).length > 0) {
      setTitle(props.data.title)
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
    if (fetcher.data?.errors) {
      if (fetcher.data.errors.server === undefined) {
        setTitleErrMsg(fetcher.data.errors.title || '')
        setDescriptionErrMsg(fetcher.data.errors.description || '')
        toast.error(ErrorTitle.FORM_GENERIC, {
          description: 'Por favor corrige el formulario para agregar un agradecimiento.',
          duration: 5000,
        })
        return
      }
      if (fetcher.data.errors.server) {
        toast.error(fetcher.data.errors.server.title, {
          description: fetcher.data.errors.server.message || undefined,
          duration: 5000,
        })
        return
      }
    }
    if (fetcher.data?.isGratitudeCreated) {
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
              // variant="faded"
              className={cn(
                '!text-gray-700 !border-gray-300 hover:!bg-gray-50',
                'hover:!border-[var(--o-btn-cancel-border-hover-color)]',
                'uppercase',
              )}
              onClick={props.close}
            >
              Cerrar
            </Button>
            <Button
              className={cn(
                'text-[var(--o-btn-primary-text-color)]',
                'bg-[var(--o-btn-primary-bg-color)]',
                'uppercase',
              )}
              onClick={() => {
                // const validationErrors = gratitudeCreateValidation({
                //   title: title || undefined,
                //   description,
                // })
                // if (Object.keys(validationErrors.errors).length > 0) {
                //   setTitleErrMsg(validationErrors.errors.title || '')
                //   setDescriptionErrMsg(validationErrors.errors.description || '')
                //   return
                // }
                const formData = new FormData(formRef.current || undefined)
                formData.append('userId', props.userId)
                formData.append('isMaterialized', 'true')
                fetcher.submit(formData, { method: 'post', action: Api.GRATITUDE_CREATE })
                // fetcher.submit(formRef.current)
              }}
            >
              Agregar
            </Button>
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
        <fetcher.Form
        // method="post"
        // className="space-y-4"
        // ref={formRef}
        // action={Api.GRATITUDE_CREATE}
        ></fetcher.Form>
      </Dialog>
    </Overlay>
  )
}
