import { eq } from 'drizzle-orm'

import { CacheData, ErrorTitle } from '~/enums'
import db from '~/db'
import { gratitudeTable } from '~/db/schema'
import { cache } from '~/utils/cache'

export const gratitudeDeleteFromDB = async (
  input: {
    id: string
  },
  userId: string,
): Promise<{
  errors?: { server: { title: string; message: string } }
} | null> => {
  try {
    await db.delete(gratitudeTable).where(eq(gratitudeTable.id, input.id))
  } catch (err) {
    if (process.env.NODE_ENV) {
      console.error('Error en DB. No se pudo eliminar el agradecimiento.')
      console.info(err)
    }
    return {
      errors: {
        server: {
          title: ErrorTitle.SERVER_GENERIC,
          message: 'No se pudo eliminar el agradecimiento.',
        },
      },
    }
  }
  cache.delete(JSON.stringify({ data: CacheData.MY_GRATITUDES, userId }))
  return null
}
