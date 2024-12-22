import { redirect, type ActionFunctionArgs } from 'react-router'

import { Page } from '~/enums'
import { userTokenCookie } from '~/utils/cookie'
import { verifyUserToken } from '~/routes/admin/db.verify-user-token'
import { verifyUserPermission } from '~/routes/admin/db.verify-user-permission'
import { receivableCreateUpdateValidation } from './validation.create-update'
import { receivableCreateFromDB } from './db.create'

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
  const spm = formData.has('spm') ? String(formData.get('spm')) : undefined
  const preinvoice = formData.has('preinvoice') ? String(formData.get('preinvoice')) : undefined
  const status = String(formData.get('status'))
  const patientId = String(formData.get('patientId'))
  const period = String(formData.get('period'))
  const paymentDate = formData.has('paymentDate') ? String(formData.get('paymentDate')) : undefined

  /* ▼ Validación de formulario */
  const validation = receivableCreateUpdateValidation({
    spm,
    preinvoice,
    status,
    patientId,
    period,
    paymentDate,
  })
  if (Object.keys(validation.errors).length > 0) {
    return validation
  }
  /* ▲ Validación de formulario */

  const result = await receivableCreateFromDB({
    spm: spm || null,
    preinvoice: preinvoice || null,
    status,
    patientId,
    period,
    paymentDate: paymentDate || null,
  })
  if (result?.errors?.server) {
    return result
  }

  return { isSuccess: true }
}
