import { eq } from 'drizzle-orm'

import { OutputFromDB } from '~/types'
import { CacheData, ErrorTitle } from '~/enums'
import db from '~/db'
import { roleTable } from '~/db/schema'
// import { cache } from '~/utils/cache'

export type Input = {
  id: string
  title: string
}

export const roleUpdateFromDB = async (input: Input): Promise<OutputFromDB> => {
  try {
    await db
      .update(roleTable)
      .set({
        title: input.title,
      })
      .where(eq(roleTable.id, input.id!))
  } catch (err) {
    if (process.env.NODE_ENV) {
      console.error('Error en DB. No se pudo actualizar el rol.')
      console.info(err)
    }
    return {
      errors: {
        server: {
          title: ErrorTitle.SERVER_GENERIC,
          message: 'No se pudo editar el rol.',
        },
      },
    }
  }
  // cache.delete(JSON.stringify({ data: CacheData.PATIENTS, userId }))
  return null
}
