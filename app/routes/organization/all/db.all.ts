import { ErrorTitle } from '~/enums'
import db from '~/db'
import { organizationTable } from '~/db/schema'
// import { CacheData } from '~/enums'
// import { cache } from '~/utils/cache'

type Output = {
  errors?: { server: { title: string; message: string } }
  organizations?: {
    id: string
    title: string
    isActive: boolean
  }[]
}

export const getOrganizationAllFromDB = async (): Promise<Output> => {
  let organizations
  // if (cache.has(JSON.stringify({ data: CacheData.ORGANIZATIONS_ALL }))) {
  //   organizations = cache.get(JSON.stringify({ data: CacheData.ORGANIZATIONS_ALL })) as any[]
  //   return
  // }
  try {
    organizations = await db
      .select({
        id: organizationTable.id,
        title: organizationTable.title,
        isActive: organizationTable.isActive,
      })
      .from(organizationTable)
  } catch (err) {
    if (process.env.NODE_ENV) {
      console.error('Error en DB. Obtención de organizaciones.')
      console.info(err)
    }
    return {
      errors: {
        server: {
          title: ErrorTitle.SERVER_GENERIC,
          message: 'No se pudo obtener las organizaciones.',
        },
      },
    }
  }
  // cache.set(JSON.stringify({ data: CacheData.ORGANIZATIONS_ALL }), organizations)
  return { organizations }
}
