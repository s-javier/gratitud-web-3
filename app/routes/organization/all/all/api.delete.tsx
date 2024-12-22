import { redirect, type ActionFunctionArgs } from 'react-router'
import * as v from 'valibot'

import { Page } from '~/enums'
import { userTokenCookie } from '~/utils/cookie'
import { verifyUserToken } from '~/routes/admin/db.verify-user-token'
import { verifyUserPermission } from '~/routes/admin/db.verify-user-permission'
import { receivableDeleteFromDB } from './db.delete'

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

  /* ▼ Validación de formulario */
  const idErr = v.safeParse(
    v.pipe(
      v.string('El valor de este campo es inválido.'),
      v.trim(),
      v.uuid('El valor de este campo es inválido.'),
    ),
    id,
  )
  if (idErr.issues) {
    return {
      errors: {
        id: idErr.issues[0].message,
      },
    }
  }
  /* ▲ Validación de formulario */

  const result = await receivableDeleteFromDB({ id })
  if (result?.errors?.server) {
    return result
  }

  return { isSuccess: true }
}
