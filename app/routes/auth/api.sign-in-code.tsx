import { type ActionFunctionArgs } from 'react-router'
import { and, eq, ne } from 'drizzle-orm'

import { ErrorMessage, ErrorTitle, Page } from '~/enums'
import { dayjs } from '~/utils'
import { userTokenCookie } from '~/utils/cookie'
import db from '~/db'
import { sessionTable } from '~/db/schema'
import { authCodeValidation } from './validation.code'

export const loader = () => {
  return new Response('Not Found', { status: 404 })
}

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== 'POST') {
    return new Response('Not Found', { status: 404 })
  }
  const formData = await request.formData()
  const code = String(formData.get('code'))
  const timeLimit = Number(formData.get('timeLimit'))
  /* ▼ Validación de formulario */
  const validation = authCodeValidation({ timeLimit, code })
  if (Object.keys(validation.errors).length > 0) {
    return validation
  }
  /* ▲ Validación de formulario */
  let session
  try {
    const query = await db
      .select({
        id: sessionTable.id,
        personId: sessionTable.personId,
        codeExpiresAt: sessionTable.codeExpiresAt,
        codeIsActive: sessionTable.codeIsActive,
      })
      .from(sessionTable)
      .where(eq(sessionTable.code, code))
    if (query.length === 0) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Sesión no encontrada.')
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
    session = query[0]
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error en DB. Obtener sesión.')
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
  if (session.codeIsActive === false) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Sesión ya utilizada.')
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
  if (dayjs.utc().isAfter(session.codeExpiresAt)) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Sesión expirada.')
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
  /* ↓ Desactivar código y activar sesión */
  try {
    await db
      .update(sessionTable)
      .set({ isActive: true, codeIsActive: false })
      .where(eq(sessionTable.id, session.id))
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error en DB. Desactivar código y activar sesión.')
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
  /* ▼ Desactivar las sesiones activas del usuario que excedan las MAX_ACTIVE_SESSIONS más nuevas */
  let sessions
  try {
    sessions = await db
      .select({ id: sessionTable.id })
      .from(sessionTable)
      .where(
        and(
          and(ne(sessionTable.id, session.id), eq(sessionTable.isActive, true)),
          eq(sessionTable.personId, session.personId),
        ),
      )
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error en DB. Consulta de sesiones a desactivar.')
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
  if (sessions.length > parseInt(process.env.MAX_ACTIVE_SESSIONS ?? '1')) {
    try {
      await db
        .update(sessionTable)
        .set({ isActive: false })
        .where(eq(sessionTable.id, sessions[parseInt(process.env.MAX_ACTIVE_SESSIONS ?? '1')].id))
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error en DB. Desactivar la sesión activa número MAX_ACTIVE_SESSIONS + 1.')
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
  }
  /* ▲ Desactivar las sesiones activas del usuario que excedan las MAX_ACTIVE_SESSIONS más nuevas */
  const cookieValue = await userTokenCookie.serialize(session.id)
  return new Response(null, {
    status: 302 /* Redirección */,
    headers: {
      'Set-Cookie': cookieValue /* Configurar la cookie */,
      Location: Page.ADMIN_WELCOME /* URL de redirección */,
    },
  })
}
