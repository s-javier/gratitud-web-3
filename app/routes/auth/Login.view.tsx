import { useEffect, useState } from 'react'
import { type MetaFunction, useFetcher, useNavigate } from 'react-router'
import { Button, TextField } from '@mui/material'
import { toast } from 'sonner'

import { Api, General, Page } from '~/enums'
import { useIsCodeSentStore, useLoaderOverlayStore } from '~/stores'
import { authLoginValidation } from './login.validation'
import { MUITextFieldStyle, MUIBtnStyle } from '~/assets/styles/mui'

export const meta: MetaFunction = () => {
  return [
    { title: `Ingreso | ${General.TITLE}` },
    // { name: 'description', content: 'Welcome to React Router!' },
  ]
}

export default function AuthLoginRoute() {
  const fetcher = useFetcher<{
    isCodeSent?: boolean
    errors?: {
      email?: string
      server?: { title: string; message: string }
    }
  }>()
  const setLoaderOverlay = useLoaderOverlayStore((state) => state.setLoaderOverlay)
  const [email, setEmail] = useState('')
  const [emailErrMsg, setEmailErrMsg] = useState('')
  const navigate = useNavigate()
  const setIsCodeSent = useIsCodeSentStore((state) => state.setIsCodeSent)

  useEffect(() => {
    setLoaderOverlay(fetcher.state !== 'idle')
    if (fetcher.state !== 'idle') {
      return
    }
    if (fetcher.data?.errors) {
      if (fetcher.data.errors.email) {
        setEmailErrMsg(fetcher.data.errors.email)
        toast.error('Por favor corrige el error del campo email para continuar', {
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
    if (fetcher.data?.isCodeSent) {
      setIsCodeSent(true)
      navigate(Page.CODE)
    }
  }, [fetcher])

  return (
    <fetcher.Form method="post" action={Api.AUTH_SIGN_IN_EMAIL} className="space-y-8">
      <TextField
        name="email"
        // type="email"
        label="Email"
        fullWidth
        sx={MUITextFieldStyle}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={emailErrMsg ? true : false}
        helperText={emailErrMsg}
        onFocus={() => setEmailErrMsg('')}
      />
      <Button
        type="submit"
        variant="contained"
        size="large"
        fullWidth
        sx={MUIBtnStyle}
        onClick={(e) => {
          const validation = authLoginValidation({ email })
          if (Object.keys(validation.errors).length > 0) {
            setEmailErrMsg(validation.errors.email || '')
            e.preventDefault()
          }
        }}
      >
        Ingresar
      </Button>
    </fetcher.Form>
  )
}
