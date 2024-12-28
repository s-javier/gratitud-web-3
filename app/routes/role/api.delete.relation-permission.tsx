import { redirect, type ActionFunctionArgs } from 'react-router'
import * as v from 'valibot'

import { Page } from '~/enums'
import { userTokenCookie } from '~/utils/cookie'
import { verifyUserToken } from '~/routes/admin/db.verify-user-token'
import { verifyUserPermission } from '~/routes/admin/db.verify-user-permission'
import { delteRolePermissionFromDB } from './db.role-permission'

export const loader = () => {
  return new Response('Not Found', { status: 404 })
}

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== 'POST') {
    return new Response('Not Found', { status: 404 })
  }

  /* ▼ Validación de token */
  const userToken = await userTokenCookie.parse(request.headers.get('Cookie'))
  const verifiedUserToken = await verifyUserToken(userToken)
  if (verifiedUserToken.serverError) {
    return redirect(Page.LOGIN)
  }
  /* ▲ Validación de token */

  /* ▼ Validación de permiso */
  const currentUrl = new URL(request.url)
  const pathname = currentUrl.pathname
  const verifiedUserPermission = await verifyUserPermission({
    roleId: verifiedUserToken.roleId!,
    path: pathname,
  })
  if (verifiedUserPermission.serverError) {
    return redirect(Page.ADMIN_WELCOME)
  }
  /* ▲ Validación de permiso */

  const formData = await request.formData()
  const roleId = String(formData.get('roleId'))
  const permissionId = String(formData.get('permissionId'))
  const type = String(formData.get('type'))

  /* ▼ Validación de formulario */
  const roleIdErr = v.safeParse(
    v.pipe(
      v.string('El valor de este campo es inválido.'),
      v.trim(),
      v.uuid('El valor de este campo es inválido.'),
    ),
    roleId,
  )
  if (roleIdErr.issues) {
    return {
      errors: {
        roleId: roleIdErr.issues[0].message,
      },
    }
  }
  const permissionIdErr = v.safeParse(
    v.pipe(
      v.string('El valor de este campo es inválido.'),
      v.trim(),
      v.uuid('El valor de este campo es inválido.'),
    ),
    permissionId,
  )
  if (permissionIdErr.issues) {
    return {
      errors: {
        permissionId: permissionIdErr.issues[0].message,
      },
    }
  }
  /* ▲ Validación de formulario */

  const result = await delteRolePermissionFromDB({ roleId, permissionId, type })
  if (result?.errors?.server) {
    return result
  }

  return { isSuccess: true }
}
