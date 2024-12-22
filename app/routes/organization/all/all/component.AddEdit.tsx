import { useEffect, useState } from 'react'
import { useFetcher } from 'react-router'
import { Autocomplete, Button, TextField } from '@mui/material'
import { toast } from 'sonner'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { esES } from '@mui/x-date-pickers/locales'
import { es } from 'date-fns/locale/es'
import { format, parseISO } from 'date-fns'

import { Api, ErrorTitle } from '~/enums'
import { useLoaderOverlayStore, usePatientsStore } from '~/stores'
import { cn } from '~/utils/cn'
import Overlay from '~/components/Overlay'
import Dialog from '~/components/Dialog'
import { MUIBtnStyle, MUITextFieldStyle } from '~/assets/styles/mui'
import { receivableCreateUpdateValidation } from './validation.create-update'

export type Props = {
  type: string
  isShow: boolean
  close: () => void
  /* ↓ Para editar */
  data?: {
    id: string
    spm: string | null
    preinvoice: number | null
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

type FetcherOutput = {
  isSuccess?: boolean
  errors?: {
    /* ▼ Error de validación */
    id?: string
    spm?: string
    preinvoice?: string
    status?: string
    patientId?: string
    period?: string
    paymentDate?: string
    /* ▲ Error de validación */
    server?: { title: string; message: string }
  }
}

export default function ReceivableAddEdit(props: Props) {
  const setLoaderOverlay = useLoaderOverlayStore((state) => state.setLoaderOverlay)
  const patients = usePatientsStore((state) => state.patients)
  const [spm, setSpm] = useState('')
  const [spmErrMsg, setSpmErrMsg] = useState('')
  const [preinvoice, setPreinvoice] = useState('')
  const [preinvoiceErrMsg, setPreinvoiceErrMsg] = useState('')
  const [status, setStatus] = useState('')
  const [statusErrMsg, setStatusErrMsg] = useState('')
  const [patientId, setPatientId] = useState<any>(null)
  const [patientIdErrMsg, setPatientIdErrMsg] = useState('')
  const [period, setPeriod] = useState<any>(null)
  const [periodErrMsg, setPeriodErrMsg] = useState('')
  const [paymentDate, setPaymentDate] = useState<any>(null)
  const [paymentDateErrMsg, setPaymentDateErrMsg] = useState('')
  const fetcher = useFetcher<FetcherOutput>()

  useEffect(() => {
    /* ↓ Para editar */
    if (props.data && Object.keys(props.data).length > 0) {
      setSpm(props.data.spm || '')
      setSpmErrMsg('')
      setPreinvoice(props.data.preinvoice?.toString() || '')
      setPreinvoiceErrMsg('')
      setStatus(props.data.status || '')
      setStatusErrMsg('')
      setPatientId({
        id: props.data.patientId || '',
        rut: props.data.rut || '',
        firstName: props.data.firstName || '',
        paternalSurname: props.data.paternalSurname || '',
        maternalSurname: props.data.maternalSurname || '',
      })
      setPatientIdErrMsg('')
      setPeriod(props.data.period ? parseISO(props.data.period) : null)
      setPeriodErrMsg('')
      setPaymentDate(props.data.paymentDate ? parseISO(props.data.paymentDate) : null)
      setPaymentDateErrMsg('')
    }
  }, [props.data])

  useEffect(() => {
    setLoaderOverlay(fetcher.state !== 'idle')
    if (fetcher.state !== 'idle') {
      return
    }
    /* ↓ Errores de formulario */
    if (fetcher.data?.errors && fetcher.data.errors.server === undefined) {
      setSpmErrMsg(fetcher.data.errors.spm || '')
      setPreinvoiceErrMsg(fetcher.data.errors.preinvoice || '')
      setStatusErrMsg(fetcher.data.errors.status || '')
      setPatientIdErrMsg(fetcher.data.errors.patientId || '')
      setPeriodErrMsg(fetcher.data.errors.period || '')
      setPaymentDateErrMsg(fetcher.data.errors.paymentDate || '')
      toast.error(ErrorTitle.FORM_GENERIC, {
        description: `Por favor corrige el formulario para ${props.type === 'add' ? 'agregar una nueva' : 'editar una'} cuenta.`,
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
        title={props.type === 'add' ? 'Nueva cuenta' : 'Edición de cuenta'}
        close={props.close}
        footer={
          <>
            <Button
              type="button"
              variant="outlined"
              className={cn(
                '!text-gray-700 !border-gray-300 hover:!bg-gray-50',
                'hover:!border-[var(--o-btn-cancel-border-hover-color)]',
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
                  'hover:!border-[var(--o-btn-cancel-border-hover-color)]',
                  'uppercase',
                )}
                onClick={() => {
                  setSpm('')
                  setSpmErrMsg('')
                  setPreinvoice('')
                  setPreinvoiceErrMsg('')
                  setStatus('')
                  setStatusErrMsg('')
                  setPatientId(null)
                  setPatientIdErrMsg('')
                  setPeriod(null)
                  setPeriodErrMsg('')
                  setPaymentDate(null)
                  setPaymentDateErrMsg('')
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
                const inputPeriod = period ? format(period, 'yyyy/MM/dd') : ''
                const inputPaymentDate = paymentDate ? format(paymentDate, 'yyyy/MM/dd') : ''
                const validation = receivableCreateUpdateValidation({
                  id: props.type === 'edit' ? props.data?.id || '' : undefined,
                  spm: spm || undefined,
                  preinvoice: preinvoice || undefined,
                  status,
                  patientId: patientId?.id || '',
                  period: inputPeriod,
                  paymentDate: inputPaymentDate || undefined,
                })
                if (Object.keys(validation.errors).length > 0) {
                  setSpmErrMsg(validation.errors.spm || '')
                  setPreinvoiceErrMsg(validation.errors.preinvoice || '')
                  setStatusErrMsg(validation.errors.status || '')
                  setPatientIdErrMsg(validation.errors.patientId || '')
                  setPeriodErrMsg(validation.errors.period || '')
                  setPaymentDateErrMsg(validation.errors.paymentDate || '')
                  return
                }

                const formData = new FormData()
                if (props.type === 'edit') {
                  formData.append('id', props.data?.id || '')
                }
                if (spm) {
                  formData.append('spm', spm)
                }
                if (preinvoice) {
                  formData.append('preinvoice', preinvoice)
                }
                formData.append('status', status)
                formData.append('patientId', patientId.id)
                formData.append('period', inputPeriod)
                if (inputPaymentDate) {
                  formData.append('paymentDate', inputPaymentDate)
                }
                fetcher.submit(formData, {
                  method: 'post',
                  action: props.type === 'add' ? Api.RECEIVABLE_CREATE : Api.RECEIVABLE_UPDATE,
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
            A continuación puedes {props.type === 'add' ? 'agregar' : 'editar'} una cuenta.
          </p>
          <p className="text-sm text-gray-400">(*) Campos obligatorios.</p>
        </div>
        <div className="space-y-4">
          <TextField
            name="spm"
            type="text"
            label="SPM"
            fullWidth
            sx={MUITextFieldStyle}
            value={spm}
            onChange={(e) => setSpm(e.target.value)}
            error={spmErrMsg ? true : false}
            helperText={spmErrMsg}
            onFocus={() => setSpmErrMsg('')}
          />
          <TextField
            name="preinvoice"
            type="text"
            label={`Monto de prefactura ${preinvoice.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}`}
            fullWidth
            sx={MUITextFieldStyle}
            value={preinvoice}
            onChange={(e) => setPreinvoice(e.target.value)}
            error={preinvoiceErrMsg ? true : false}
            helperText={
              preinvoiceErrMsg
                ? preinvoiceErrMsg
                : 'Por favor, ingrese solo números. Sin espacios ni separadores de miles.'
            }
            onFocus={() => setPreinvoiceErrMsg('')}
          />
          <Autocomplete
            value={status}
            onChange={(event: any, newValue: string | null) => {
              setStatus(newValue || '')
            }}
            // freeSolo
            disablePortal
            // @ts-ignore
            options={[
              'Sin SPM',
              'Devuelta',
              'Pendiente',
              'A pago',
              'Bono(s) liberado(s)',
              'Pagada',
            ]}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Estado*"
                sx={MUITextFieldStyle}
                error={statusErrMsg ? true : false}
                helperText={statusErrMsg}
                onFocus={() => setStatusErrMsg('')}
              />
            )}
          />
          <Autocomplete
            value={patientId}
            // @ts-ignore
            options={patients}
            getOptionLabel={(option) => {
              // @ts-ignore
              return `${option.firstName} ${option.paternalSurname} ${option.maternalSurname}` || ''
            }}
            // @ts-ignore
            renderOption={(props, option) => (
              // @ts-ignore
              <li {...props} key={option.id}>
                {/* @ts-ignore */}
                {option.firstName} {option.paternalSurname} {option.maternalSurname}
              </li>
            )}
            onChange={(event: any, newValue: string | null) => {
              setPatientId(newValue || '')
            }}
            disablePortal
            renderInput={(params) => (
              <TextField
                {...params}
                label="Paciente*"
                sx={MUITextFieldStyle}
                error={patientIdErrMsg ? true : false}
                helperText={patientIdErrMsg}
                onFocus={() => setPatientIdErrMsg('')}
              />
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}
                adapterLocale={es}
              >
                <DatePicker
                  slotProps={{
                    popper: {
                      // disablePortal: true,
                      sx: {
                        zIndex: 2001, // Asegúrate de que sea mayor que el modal
                      },
                    },
                    textField: {
                      error: periodErrMsg ? true : false,
                      helperText: periodErrMsg,
                      onFocus: () => setPeriodErrMsg(''),
                    },
                  }}
                  name="period"
                  label="Periodo*"
                  value={period}
                  onChange={(newValue: any) => setPeriod(newValue)}
                  format="d MMMM yyyy"
                  sx={{
                    width: '100%',
                  }}
                />
              </LocalizationProvider>
            </div>
            <div className="col-span-1">
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}
                adapterLocale={es}
              >
                <DatePicker
                  slotProps={{
                    popper: {
                      // disablePortal: true,
                      sx: {
                        zIndex: 2001, // Asegúrate de que sea mayor que el modal
                      },
                    },
                    textField: {
                      error: paymentDateErrMsg ? true : false,
                      helperText: paymentDateErrMsg,
                      onFocus: () => setPaymentDateErrMsg(''),
                    },
                  }}
                  name="paymentDate"
                  label="Fecha de pago"
                  value={paymentDate}
                  onChange={(newValue: any) => setPaymentDate(newValue)}
                  format="d MMMM yyyy"
                  sx={{
                    width: '100%',
                  }}
                />
              </LocalizationProvider>
            </div>
          </div>
        </div>
      </Dialog>
    </Overlay>
  )
}
