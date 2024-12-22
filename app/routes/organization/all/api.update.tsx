import { redirect, type ActionFunctionArgs } from 'react-router'

import { Page } from '~/enums'
import { userTokenCookie } from '~/utils/cookie'
import { verifyUserToken } from '~/routes/admin/db.verify-user-token'
import { verifyUserPermission } from '~/routes/admin/db.verify-user-permission'
import { organizationCreateUpdateValidation } from './validation.create-update'
import { receivableUpdateFromDB } from './db.update'

export const loader = () => {
  return new Response('Not Found', { status: 404 })
}

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== 'POST') {
    return new Response('Not Found', { status: 404 })
  }

  const userToken = await userTokenCookie.parse(request.headers.get('Cookie'))
  const verifiedUserToken = await verifyUserToken(userToken)
  if (verifiedUserToken.serverError) {
    return redirect(Page.LOGIN)
  }

  const currentUrl = new URL(request.url)
  const pathname = currentUrl.pathname
  const verifiedUserPermission = await verifyUserPermission({
    roleId: verifiedUserToken.roleId!,
    path: pathname,
  })
  if (verifiedUserPermission.serverError) {
    return redirect(Page.ADMIN_WELCOME)
  }

  const formData = await request.formData()
  const id = String(formData.get('id'))
  const title = String(formData.get('title'))
  const isActive = formData.get('isActive') === 'true'

  /* ▼ Validación de formulario */
  const validation = organizationCreateUpdateValidation({
    id,
    title,
    isActive,
  })
  if (Object.keys(validation.errors).length > 0) {
    return validation
  }
  /* ▲ Validación de formulario */

  const result = await receivableUpdateFromDB({
    id,
    title,
    isActive,
  })
  if (result?.errors?.server) {
    return result
  }

  return { isSuccess: true }
}
