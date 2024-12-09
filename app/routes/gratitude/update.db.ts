import { eq } from 'drizzle-orm'

import { CacheData, ErrorTitle } from '~/enums'
import db from '~/db'
import { gratitudeTable } from '~/db/schema'
import { cache } from '~/utils/cache'

export const gratitudeUpdateFromDB = async (
  input: { id: string; title?: string; description: string; isMaterialized: boolean },
  userId: string,
): Promise<{
  errors?: { server: { title: string; message: string } }
} | null> => {
  try {
    await db
      .update(gratitudeTable)
      .set({
        title: input.title,
        description: input.description,
        isMaterialized: input.isMaterialized,
      })
      .where(eq(gratitudeTable.id, input.id))
  } catch (err) {
    if (process.env.NODE_ENV) {
      console.error('Error en DB. No se pudo actualizar el agradecimiento.')
      console.info(err)
    }
    return {
      errors: {
        server: {
          title: ErrorTitle.SERVER_GENERIC,
          message: 'No se pudo editar el agradecimiento.',
        },
      },
    }
  }
  cache.delete(JSON.stringify({ data: CacheData.MY_GRATITUDES, userId }))
  return null
}
