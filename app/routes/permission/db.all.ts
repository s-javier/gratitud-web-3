import { asc } from 'drizzle-orm'

import { ErrorTitle } from '~/enums'
import db from '~/db'
import { permissionTable } from '~/db/schema'
// import { CacheData } from '~/enums'
// import { cache } from '~/utils/cache'

type Output = {
  errors?: { server: { title: string; message: string } }
  permissions?: {
    id: string
    type: string
    path: string
  }[]
}

export const getPermissionAllFromDB = async (): Promise<Output> => {
  let permissions
  // if (cache.has(JSON.stringify({ data: CacheData.ORGANIZATIONS_ALL }))) {
  //   organizations = cache.get(JSON.stringify({ data: CacheData.ORGANIZATIONS_ALL })) as any[]
  //   return
  // }
  try {
    permissions = await await db
      .select({ id: permissionTable.id, type: permissionTable.type, path: permissionTable.path })
      .from(permissionTable)
      .orderBy(asc(permissionTable.type), asc(permissionTable.path))
  } catch (err) {
    if (process.env.NODE_ENV) {
      console.error('Error en DB. Obtención de permisos.')
      console.info(err)
    }
    return {
      errors: {
        server: {
          title: ErrorTitle.SERVER_GENERIC,
          message: 'No se pudo obtener las permisos.',
        },
      },
    }
  }
  // cache.set(JSON.stringify({ data: CacheData.ORGANIZATIONS_ALL }), organizations)
  return { permissions }
}
