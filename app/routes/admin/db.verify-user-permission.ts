import { ErrorMessage, ErrorTitle } from '~/enums'
import { getPermissionsFromDB } from './db.permissions'

type Input = {
  roleId: string
  path: string
}

type Output = {
  serverError?: { title: string; message: string }
  hasPermission?: boolean
}

export const verifyUserPermission = async (input: Input): Promise<Output> => {
  let query: any[] = []
  try {
    query = await getPermissionsFromDB(input.roleId)
  } catch (err) {
    if (process.env.NODE_ENV) {
      console.error('Error en DB. Verificación de permisos.')
      console.info(err)
    }
    return {
      serverError: {
        title: ErrorTitle.SERVER_GENERIC,
        message: ErrorMessage.SERVER_GENERIC,
      },
    }
  }
  if (query.length === 0) {
    if (process.env.NODE_ENV) {
      console.error('El usuario no tiene permisos asignados.')
    }
    return {
      serverError: {
        title: ErrorTitle.SERVER_GENERIC,
        message: ErrorMessage.SERVER_GENERIC,
      },
    }
  }
  if (!query.includes(input.path)) {
    return {
      serverError: {
        title: ErrorTitle.SERVER_GENERIC,
        message: ErrorMessage.SERVER_GENERIC,
      },
    }
  }
  return {
    hasPermission: true,
  }
}
