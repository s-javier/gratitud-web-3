import { ErrorTitle } from '~/enums'
import db from '~/db'
import { personTable } from '~/db/schema'
// import { CacheData } from '~/enums'
// import { cache } from '~/utils/cache'

type Output = {
  errors?: { server: { title: string; message: string } }
  users?: {
    firstName: string
    lastName: string | null
    email: string
    isActive: boolean
  }[]
}

export const getUserAllFromDB = async (): Promise<Output> => {
  let users
  // if (cache.has(JSON.stringify({ data: CacheData.ORGANIZATIONS_ALL }))) {
  //   organizations = cache.get(JSON.stringify({ data: CacheData.ORGANIZATIONS_ALL })) as any[]
  //   return
  // }
  try {
    users = await db
      .select({
        id: personTable.id,
        firstName: personTable.firstName,
        lastName: personTable.lastName,
        email: personTable.email,
        isActive: personTable.isActive,
      })
      .from(personTable)
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
  return { users }
}
