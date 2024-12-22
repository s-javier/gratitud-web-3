import { eq } from 'drizzle-orm'

import { OutputFromDB } from '~/types'
import { CacheData, ErrorTitle } from '~/enums'
import db from '~/db'
import { roleTable } from '~/db/schema'
// import { cache } from '~/utils/cache'

type Input = {
  id: string
}

export const roleDeleteFromDB = async (input: Input): Promise<OutputFromDB> => {
  try {
    await db.delete(roleTable).where(eq(roleTable.id, input.id))
  } catch (err) {
    if (process.env.NODE_ENV) {
      console.error('Error en DB. No se pudo eliminar el rol.')
      console.info(err)
    }
    return {
      errors: {
        server: {
          title: ErrorTitle.SERVER_GENERIC,
          message: 'No se pudo eliminar el rol.',
        },
      },
    }
  }
  // cache.delete(JSON.stringify({ data: CacheData.RECEIVABLES, userId }))
  return null
}