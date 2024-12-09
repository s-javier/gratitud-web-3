import { CacheData, ErrorTitle } from '~/enums'
import db from '~/db'
import { gratitudeTable } from '~/db/schema'
import { cache } from '~/utils/cache'

export const gratitudeCreateFromDB = async (
  input: { title?: string; description: string; isMaterialized: boolean },
  userId: string,
): Promise<{
  errors?: { server: { title: string; message: string } }
} | null> => {
  try {
    await db.insert(gratitudeTable).values({
      personId: userId,
      title: input.title,
      description: input.description,
      isMaterialized: input.isMaterialized,
    })
  } catch (err) {
    if (process.env.NODE_ENV) {
      console.error('Error en DB. No se pudo crear una nueva gratitud.')
      console.info(err)
    }
    return {
      errors: {
        server: {
          title: ErrorTitle.SERVER_GENERIC,
          message: 'No se pudo agregar una nueva gratitud.',
        },
      },
    }
  }
  cache.delete(JSON.stringify({ data: CacheData.MY_GRATITUDES, userId }))
  return null
}
