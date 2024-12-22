import { useEffect, useState } from 'react'
import { useFetcher } from 'react-router'
import { Autocomplete, Button, TextField } from '@mui/material'
import { toast } from 'sonner'
import { differenceBy } from 'es-toolkit'

import { Api, ErrorTitle } from '~/enums'
import {
  useLoaderOverlayStore,
  usePermissionsStore,
  useRolePermissionStore,
  useRolesStore,
} from '~/stores'
import { cn } from '~/utils/cn'
import Overlay from '~/components/Overlay'
import Dialog from '~/components/Dialog'
import { MUIBtnStyle, MUITextFieldStyle } from '~/assets/styles/mui'
import { roleCreateUpdateValidation } from './validation.create-update'

type Props = {
  isShow: boolean
  close: () => void
}

type FetcherOutput = {
  isSuccess?: boolean
  errors?: {
    /* ▼ Error de validación */
    roleId?: string
    permissionId?: string
    /* ▲ Error de validación */
    server?: { title: string; message: string }
  }
}

export default function RoleAddRelationPermission(props: Props) {
  const setLoaderOverlay = useLoaderOverlayStore((state) => state.setLoaderOverlay)
  const roles = useRolesStore((state) => state.roles)
  const originPermissions = usePermissionsStore((state) => state.permissions)
  const rolePermission = useRolePermissionStore((state) => state.rolePermission)
  const fetcher = useFetcher<FetcherOutput>()

  const [roleId, setRoleId] = useState<any>(null)
  const [roleIdErrMsg, setRoleIdErrMsg] = useState('')
  const [permissions, setPermissions] = useState<any>([])
  const [permissionId, setPermissionId] = useState<any>(null)
  const [permissionIdErrMsg, setPermissionIdErrMsg] = useState('')

  useEffect(() => {
    if (Object.keys(roleId ?? {}).length > 0) {
      /* ↓ Permisos que ya están relacionados con el rol seleccionado */
      const permissionIds = rolePermission
        .filter((item: any) => item.roleId === roleId.id)
        .map((item: any) => ({
          id: item.permissionId,
        }))
      /* ↓ Permisos que no están relacionados con el rol seleccionado */
      setPermissions(differenceBy(originPermissions, permissionIds, (item) => item.id))
    } else {
      setPermissionId(null)
      setPermissions([])
    }
  }, [roleId])

  useEffect(() => {
    setLoaderOverlay(fetcher.state !== 'idle')
    if (fetcher.state !== 'idle') {
      return
    }
    /* ↓ Errores de formulario */
    if (fetcher.data?.errors && fetcher.data.errors.server === undefined) {
      setRoleIdErrMsg(fetcher.data.errors.roleId ?? '')
      setPermissionIdErrMsg(fetcher.data.errors.roleId ?? '')
      toast.error(ErrorTitle.FORM_GENERIC, {
        description: `Por favor corrige el formulario para agregar un nueva relación.`,
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
        title="Nueva relación rol - permiso"
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
            <Button
              type="button"
              variant="outlined"
              className={cn(
                '!text-gray-700 !border-gray-300 hover:!bg-gray-50',
                'hover:!border-[var(--o-btn-cancel-border-hover-color)]',
                'uppercase',
              )}
              onClick={() => {
                setRoleId(null)
                setRoleIdErrMsg('')
                setPermissionId(null)
                setPermissionIdErrMsg('')
              }}
            >
              Limpiar
            </Button>
            <Button
              type="button"
              variant="contained"
              sx={MUIBtnStyle}
              onClick={() => {
                // const validation = roleCreateUpdateValidation({
                //   id: props.type === 'edit' ? props.data?.id || '' : undefined,
                //   title,
                // })
                // if (Object.keys(validation.errors).length > 0) {
                //   setTitleErrMsg(validation.errors.title ?? '')
                //   return
                // }
                // const formData = new FormData()
                // if (props.type === 'edit') {
                //   formData.append('id', props.data?.id ?? '')
                // }
                // formData.append('title', title)
                // fetcher.submit(formData, {
                //   method: 'post',
                //   action: props.type === 'add' ? Api.ROLE_CREATE : Api.ROLE_UPDATE,
                // })
              }}
            >
              Agregar
            </Button>
          </>
        }
      >
        <div className="space-y-4 mb-8">
          <p className="">A continuación puedes agregar una relación rol - permiso.</p>
          <p className="text-sm text-gray-400">(*) Campos obligatorios.</p>
        </div>
        <div className="space-y-4">
          <Autocomplete
            value={roleId}
            options={roles}
            getOptionLabel={(option) => {
              return option.title || ''
            }}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                {option.title || ''}
              </li>
            )}
            onChange={(event: any, newValue: any) => {
              setRoleId(newValue || null)
            }}
            disablePortal
            renderInput={(params) => (
              <TextField
                {...params}
                label="Rol*"
                sx={MUITextFieldStyle}
                error={roleIdErrMsg ? true : false}
                helperText={roleIdErrMsg}
                onFocus={() => setRoleIdErrMsg('')}
              />
            )}
          />
          <Autocomplete
            value={permissionId}
            options={permissions}
            getOptionLabel={(option) => {
              if (option.type && option.path) {
                return `${option.type} - ${option.path}`
              }
              return ''
            }}
            renderOption={(props, option) => {
              if (option.type && option.path) {
                return (
                  <li {...props} key={option.id}>
                    {`${option.type} - ${option.path}`}
                  </li>
                )
              }
              return <li {...props} key={option.id}></li>
            }}
            onChange={(event: any, newValue: any) => {
              setPermissionId(newValue || null)
            }}
            disablePortal
            renderInput={(params) => (
              <TextField
                {...params}
                label="Permiso*"
                sx={MUITextFieldStyle}
                error={permissionIdErrMsg ? true : false}
                helperText={permissionIdErrMsg || (!roleId && 'Primero debes elegir un rol.')}
                onFocus={() => setPermissionIdErrMsg('')}
              />
            )}
            disabled={!roleId}
          />
        </div>
      </Dialog>
    </Overlay>
  )
}
