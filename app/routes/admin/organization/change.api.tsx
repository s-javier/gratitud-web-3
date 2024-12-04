import { redirect, type ActionFunctionArgs } from 'react-router'
import { and, eq, ne } from 'drizzle-orm'

import { CacheData, ErrorMessage, ErrorTitle, Page } from '~/enums'
import { userTokenCookie } from '~/utils/cookie'
import db from '~/db'
import { organizationPersonRoleTable } from '~/db/schema'
import { verifyUserPermission, verifyUserToken } from '~/db/queries'
import { organizationChangeValidation } from './change.validation'
import { cache } from '~/utils'

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
  const verifiedUserPermission = await verifyUserPermission(verifiedUserToken.roleId!, pathname)
  if (verifiedUserPermission.serverError) {
    return redirect(Page.ADMIN_WELCOME)
  }

  const formData = await request.formData()
  const organizationId = String(formData.get('organizationId'))

  /* ▼ Validación de formulario */
  const validation = organizationChangeValidation({ organizationId })
  if (Object.keys(validation.errors).length > 0) {
    return validation
  }
  /* ▲ Validación de formulario */

  if (verifiedUserToken.organizationId === organizationId) {
    return
  }
  let organizationQuery
  try {
    organizationQuery = await db
      .select({ isSelected: organizationPersonRoleTable.isSelected })
      .from(organizationPersonRoleTable)
      .where(
        and(
          eq(organizationPersonRoleTable.organizationId, organizationId),
          eq(organizationPersonRoleTable.personId, verifiedUserToken.userId!),
        ),
      )
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error en DB. Cambiar de organización.')
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
  if (organizationQuery.length === 0) {
    if (process.env.NODE_ENV === 'development') {
      console.error('El usuario no pertenece a la organización que desea cambiarse.')
    }
    return {
      errors: {
        server: {
          title: ErrorTitle.SERVER_GENERIC,
          message: 'El usuario no pertenece a la organización que desea cambiarse.',
        },
      },
    }
  }
  try {
    // console.log(organizationId)
    await db
      .update(organizationPersonRoleTable)
      .set({ isSelected: true })
      .where(
        and(
          eq(organizationPersonRoleTable.organizationId, organizationId),
          eq(organizationPersonRoleTable.personId, verifiedUserToken.userId!),
        ),
      )
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error en DB. Actualización de nueva selección usuario-organización.')
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
  try {
    await db
      .update(organizationPersonRoleTable)
      .set({ isSelected: false })
      .where(
        and(
          ne(organizationPersonRoleTable.organizationId, organizationId),
          eq(organizationPersonRoleTable.personId, verifiedUserToken.userId!),
        ),
      )
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error en DB. Actualización de vieja selección usuario-organización.')
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
  cache.delete(JSON.stringify({ data: CacheData.PERMISSIONS, roleId: verifiedUserToken.roleId }))
  cache.delete(JSON.stringify({ data: CacheData.MENU, roleId: verifiedUserToken.roleId }))
  cache.delete(
    JSON.stringify({ data: CacheData.ORGANIZATIONS_TO_CHANGE, userId: verifiedUserToken.userId }),
  )
  return redirect(Page.ADMIN_WELCOME)
}
