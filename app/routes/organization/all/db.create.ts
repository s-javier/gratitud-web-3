import { OutputFromDB } from '~/types'
import { CacheData, ErrorTitle } from '~/enums'
import db from '~/db'
import { organizationTable } from '~/db/schema'
// import { cache } from '~/utils/cache'

export type Input = {
  title: string
  isActive: boolean
}

export const organizationCreateFromDB = async (input: Input): Promise<OutputFromDB> => {
  try {
    await db.insert(organizationTable).values({
      title: input.title,
      isActive: input.isActive,
    })
  } catch (err) {
    if (process.env.NODE_ENV) {
      console.error('Error en DB. No se pudo crear una nueva organización.')
      console.info(err)
    }
    return {
      errors: {
        server: {
          title: ErrorTitle.SERVER_GENERIC,
          message: 'No se pudo agregar una nueva organización.',
        },
      },
    }
  }
  // cache.delete(JSON.stringify({ data: CacheData.PATIENTS, userId }))
  return null
}
