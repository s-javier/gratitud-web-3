import { ErrorTitle } from '~/enums'
import db from '~/db'
import { roleTable } from '~/db/schema'
// import { CacheData } from '~/enums'
// import { cache } from '~/utils/cache'

type Output = {
  errors?: { server: { title: string; message: string } }
  roles?: {
    id: string
    title: string
  }[]
}

export const getRoleAllFromDB = async (): Promise<Output> => {
  let roles
  // if (cache.has(JSON.stringify({ data: CacheData.ORGANIZATIONS_ALL }))) {
  //   organizations = cache.get(JSON.stringify({ data: CacheData.ORGANIZATIONS_ALL })) as any[]
  //   return
  // }
  try {
    roles = await db.select({ id: roleTable.id, title: roleTable.title }).from(roleTable)
  } catch (err) {
    if (process.env.NODE_ENV) {
      console.error('Error en DB. Obtención de roles.')
      console.info(err)
    }
    return {
      errors: {
        server: {
          title: ErrorTitle.SERVER_GENERIC,
          message: 'No se pudo obtener los roles.',
        },
      },
    }
  }
  // cache.set(JSON.stringify({ data: CacheData.ORGANIZATIONS_ALL }), organizations)
  return { roles }
}
