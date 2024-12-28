import { redirect, type ActionFunctionArgs } from 'react-router'

import { Page } from '~/enums'
import { userTokenCookie } from '~/utils/cookie'
import { verifyUserToken } from '~/routes/admin/db.verify-user-token'
import { verifyUserPermission } from '~/routes/admin/db.verify-user-permission'
import { roleCreateUpdateValidation } from './validation.create-update'
import { roleCreateFromDB } from './db.create'

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
  const title = String(formData.get('title'))

  /* ▼ Validación de formulario */
  const validation = roleCreateUpdateValidation({
    title,
  })
  if (Object.keys(validation.errors).length > 0) {
    return validation
  }
  /* ▲ Validación de formulario */

  const result = await roleCreateFromDB({
    title,
  })
  if (result?.errors?.server) {
    return result
  }

  return { isSuccess: true }
}
