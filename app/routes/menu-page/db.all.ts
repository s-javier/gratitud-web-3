import { eq } from 'drizzle-orm'

import { ErrorTitle } from '~/enums'
import db from '~/db'
import { menupageTable, permissionTable } from '~/db/schema'
// import { CacheData } from '~/enums'
// import { cache } from '~/utils/cache'

type Output = {
  errors?: { server: { title: string; message: string } }
  menuPages?: {
    id: string
    title: string
    icon: string | null
    permissionId: string
    path: string
  }[]
}

export const getMenuPageAllFromDB = async (): Promise<Output> => {
  let menuPages
  // if (cache.has(JSON.stringify({ data: CacheData.ORGANIZATIONS_ALL }))) {
  //   organizations = cache.get(JSON.stringify({ data: CacheData.ORGANIZATIONS_ALL })) as any[]
  //   return
  // }
  try {
    menuPages = await db
      .select({
        id: menupageTable.id,
        title: menupageTable.title,
        icon: menupageTable.icon,
        permissionId: menupageTable.permissionId,
        path: permissionTable.path,
      })
      .from(menupageTable)
      .innerJoin(permissionTable, eq(menupageTable.permissionId, permissionTable.id))
  } catch (err) {
    if (process.env.NODE_ENV) {
      console.error('Error en DB. Obtención de usuarios.')
      console.info(err)
    }
    return {
      errors: {
        server: {
          title: ErrorTitle.SERVER_GENERIC,
          message: 'No se pudo obtener los usuarios.',
        },
      },
    }
  }
  // cache.set(JSON.stringify({ data: CacheData.ORGANIZATIONS_ALL }), organizations)
  return { menuPages }
}
