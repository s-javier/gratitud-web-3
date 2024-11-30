import { useEffect, useState } from 'react'
import { Link, MetaFunction, useFetcher, useNavigate } from 'react-router'
import { OTPInput, REGEXP_ONLY_DIGITS, SlotProps } from 'input-otp'
import { Button } from '@mui/material'
import { toast } from 'sonner'

import { Api, General, Page } from '~/enums'
import { useIsCodeSentStore, useLoaderOverlayStore } from '~/stores'
import { cn } from '~/utils/cn'
import { authCodeValidation } from './code.validation'

export const meta: MetaFunction = () => {
  return [
    { title: `Código de ingreso | ${General.TITLE}` },
    // { name: 'description', content: 'Welcome to React Router!' },
  ]
}

export default function AuthCodeRoute() {
  const setLoaderOverlay = useLoaderOverlayStore((state) => state.setLoaderOverlay)
  const fetcher = useFetcher<{
    errors?: {
      code?: string
      server?: { title: string; message: string }
    }
  }>()
  const [timeLimit, setTimeLimit] = useState(300)
  const [code, setCode] = useState('')
  const [codeErrMsg, setCodeErrMsg] = useState('')
  const navigate = useNavigate()
  const isCodeSent = useIsCodeSentStore((state) => state.isCodeSent)

  useEffect(() => {
    if (isCodeSent === false) {
      navigate(Page.LOGIN, { replace: true })
    }
    const interval = setInterval(() => {
      setTimeLimit((prevTimeLimit) => {
        if (prevTimeLimit === 0) {
          clearInterval(interval)
          return prevTimeLimit /* Mantén 0 cuando llegue a 0 */
        }
        return prevTimeLimit - 1 /* Reduce en 1 cada segundo */
      })
    }, 1000)
    /* ↓ Limpia el intervalo al desmontar el componente */
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setLoaderOverlay(fetcher.state !== 'idle')
    if (fetcher.state !== 'idle') {
      return
    }
    if (fetcher.data?.errors) {
      if (fetcher.data.errors.server) {
        toast.error(fetcher.data.errors.server.title, {
          description: fetcher.data.errors.server.message || undefined,
          duration: 5000,
        })
      }
      if (fetcher.data.errors.code) {
        setCodeErrMsg(fetcher.data.errors.code)
        toast.error(fetcher.data.errors.code || 'Por favor corrige el código para ingresar', {
          duration: 5000,
        })
      }
    }
  }, [fetcher])

  return (
    isCodeSent && (
      <>
        <p className="mb-4">¡Gracias por iniciar sesión en Gratitud!</p>
        <p className="mb-4">No cierres ni actulices esta página.</p>
        <p className="mb-4">
          Se te ha enviado un email con un código para que lo ingreses más abajo.
        </p>
        <p className="mb-8">
          Si el email no lo ves en tu bandeja de entrada, por favor, revisa tu carpeta de spam.
        </p>
        <fetcher.Form method="post" action={Api.AUTH_SIGN_IN_CODE} className="mb-8">
          <input name="code" type="hidden" value={code} />
          <input name="timeLimit" type="hidden" value={timeLimit} />
          <div className="flex justify-center mb-8">
            <OTPInput
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS}
              value={code}
              onChange={setCode}
              containerClassName="group flex items-center has-[:disabled]:opacity-30"
              render={({ slots }) => (
                <>
                  <div className="flex">
                    {slots.slice(0, 3).map((slot, idx) => (
                      <Slot key={idx} {...slot} />
                    ))}
                  </div>

                  <FakeDash />

                  <div className="flex">
                    {slots.slice(3).map((slot, idx) => (
                      <Slot key={idx} {...slot} />
                    ))}
                  </div>
                </>
              )}
            />
          </div>
          <div className="mb-10 mt-4">
            {timeLimit > 0 ? (
              <div className="text-center text-sm font-bold text-gray-400">
                Tienes {timeLimit} segundos para ingresar el código.
              </div>
            ) : (
              <div className="text-center text-sm font-bold text-red-500">
                Oh no, se acabó el tiempo. El código expiró y no se puede volver a utilizar. Por
                favor, presiona&nbsp;
                <Link
                  to={Page.LOGIN}
                  className="cursor-pointer text-[var(--o-text-primary-color)] hover:underline"
                >
                  aquí
                </Link>
                &nbsp;para que ingreses nuevamente tu email y recibirás un nuevo código.
              </div>
            )}
          </div>
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            sx={{
              fontWeight: 'bold',
              backgroundColor: 'var(--o-btn-primary-bg-color)',
              color: 'var(--o-btn-primary-text-color)',
              '&:hover': {
                backgroundColor: 'var(--o-btn-primary-bg-hover-color)',
              },
            }}
            onClick={(e) => {
              const validation = authCodeValidation({ timeLimit, code })
              if (Object.keys(validation.errors).length > 0) {
                setCodeErrMsg(validation.errors.code || '')
                toast.error(validation.errors.code || 'Por favor corrige el código para ingresar', {
                  duration: 5000,
                })
                e.preventDefault()
              }
            }}
          >
            Ingresar
          </Button>
        </fetcher.Form>
        <div className="line rounded-md bg-slate-200 p-4 text-sm">
          Si el código no lo recibiste o tienes algún problema, por favor, presiona&nbsp;
          <Link
            to={Page.LOGIN}
            className="cursor-pointer text-[var(--o-text-primary-color)] hover:underline font-bold"
          >
            aquí
          </Link>
          &nbsp;para que ingreses nuevamente tu email y recibirás un nuevo código.
        </div>
      </>
    )
  )
}

function Slot(props: SlotProps) {
  return (
    <div
      className={cn(
        'relative w-10 h-14 text-[2rem]',
        'flex items-center justify-center',
        'transition-all duration-300',
        'border-gray-500 border-y border-r first:border-l first:rounded-l-md last:rounded-r-md',
        'group-hover:border-accent-foreground/20 group-focus-within:border-accent-foreground/20',
        'outline outline-0 outline-accent-foreground/20',
        { 'outline-4 outline-accent-foreground': props.isActive },
      )}
    >
      <div className="group-has-[input[data-input-otp-placeholder-shown]]:opacity-20">
        {props.char ?? props.placeholderChar}
      </div>
      {props.hasFakeCaret && <FakeCaret />}
    </div>
  )
}

function FakeCaret() {
  return (
    <div className="absolute pointer-events-none inset-0 flex items-center justify-center animate-caret-blink">
      <div className="w-px h-8 bg-white" />
    </div>
  )
}

function FakeDash() {
  return (
    <div className="flex w-10 justify-center items-center">
      <div className="w-3 h-1 rounded-full bg-gray-400" />
    </div>
  )
}
