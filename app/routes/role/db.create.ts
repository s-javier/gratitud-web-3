import { OutputFromDB } from '~/types'
import { CacheData, ErrorTitle } from '~/enums'
import db from '~/db'
import { roleTable } from '~/db/schema'
// import { cache } from '~/utils/cache'

export type Input = {
  title: string
}

export const roleCreateFromDB = async (input: Input): Promise<OutputFromDB> => {
  try {
    await db.insert(roleTable).values({
      title: input.title,
    })
  } catch (err) {
    if (process.env.NODE_ENV) {
      console.error('Error en DB. No se pudo crear un nuevo rol.')
      console.info(err)
    }
    return {
      errors: {
        server: {
          title: ErrorTitle.SERVER_GENERIC,
          message: 'No se pudo agregar un nuevo rol.',
        },
      },
    }
  }
  // cache.delete(JSON.stringify({ data: CacheData.PATIENTS, userId }))
  return null
}
