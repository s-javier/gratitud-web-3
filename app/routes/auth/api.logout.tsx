import { redirect, type ActionFunctionArgs } from 'react-router'
import { eq } from 'drizzle-orm'

import { ErrorMessage, ErrorTitle, Page } from '~/enums'
import { verifyUserToken } from '~/routes/admin/db.verify-user-token'
import { deleteUserTokenCookie, userTokenCookie } from '~/utils/cookie'
import db from '~/db'
import { sessionTable } from '~/db/schema'

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

  try {
    await db.update(sessionTable).set({ isActive: false }).where(eq(sessionTable.id, userToken))
  } catch (err) {
    if (process.env.NODE_ENV) {
      console.error('Error en DB. No se pudo desactivar la sesión.')
      console.info(err)
    }
    return {
      errors: {
        server: {
          title: ErrorTitle.SERVER_GENERIC,
          message: ErrorMessage.SERVER_GENERIC,
        },
      },
    }
  }

  const expiredCookie = await deleteUserTokenCookie.serialize('', { expires: new Date(0) })
  return new Response(null, {
    status: 302 /* Redirección */,
    headers: {
      'Set-Cookie': expiredCookie /* Configurar la cookie */,
      Location: Page.LOGIN /* URL de redirección */,
    },
  })
}
