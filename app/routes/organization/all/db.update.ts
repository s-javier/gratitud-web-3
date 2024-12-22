import { eq } from 'drizzle-orm'

import { OutputFromDB } from '~/types'
import { CacheData, ErrorTitle } from '~/enums'
import db from '~/db'
import { organizationTable } from '~/db/schema'
// import { cache } from '~/utils/cache'

export type Input = {
  id: string
  title: string
  isActive: boolean
}

export const receivableUpdateFromDB = async (input: Input): Promise<OutputFromDB> => {
  try {
    await db
      .update(organizationTable)
      .set({
        title: input.title,
        isActive: input.isActive,
      })
      .where(eq(organizationTable.id, input.id!))
  } catch (err) {
    if (process.env.NODE_ENV) {
      console.error('Error en DB. No se pudo actualizar la organización.')
      console.info(err)
    }
    return {
      errors: {
        server: {
          title: ErrorTitle.SERVER_GENERIC,
          message: 'No se pudo editar la organización.',
        },
      },
    }
  }
  // cache.delete(JSON.stringify({ data: CacheData.PATIENTS, userId }))
  return null
}
