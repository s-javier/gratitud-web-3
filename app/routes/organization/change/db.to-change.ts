import { eq } from 'drizzle-orm'

import db from '~/db'
import { organizationPersonRoleTable, organizationTable } from '~/db/schema'
import { CacheData, ErrorTitle } from '~/enums'
import { cache } from '~/utils/cache'

export const getOrganizationsToChangeFromDB = async (
  userId: string,
): Promise<{
  serverError?: { title: string; message: string }
  organizationsToChange?: {
    title: string
    icon: string | null
    path: string
  }[]
}> => {
  let organizationsToChange: any[] = []
  if (cache.has(JSON.stringify({ data: CacheData.ORGANIZATIONS_TO_CHANGE, userId }))) {
    organizationsToChange = cache.get(
      JSON.stringify({ data: CacheData.ORGANIZATIONS_TO_CHANGE, userId }),
    ) as any[]
    return { organizationsToChange }
  }
  try {
    organizationsToChange = await db
      .select({
        id: organizationTable.id,
        title: organizationTable.title,
        isSelected: organizationPersonRoleTable.isSelected,
      })
      .from(organizationTable)
      .innerJoin(
        organizationPersonRoleTable,
        eq(organizationTable.id, organizationPersonRoleTable.organizationId),
      )
      .where(eq(organizationPersonRoleTable.personId, userId))
  } catch (err) {
    if (process.env.NODE_ENV) {
      console.error('Error en DB. Obtención de organizaciones del usuario.')
      console.info(err)
    }
    return {
      serverError: {
        title: ErrorTitle.SERVER_GENERIC,
        message: 'No se pudo obtener las organizaciones del usuairo.',
      },
    }
  }
  if (organizationsToChange.length === 0) {
    if (process.env.NODE_ENV) {
      console.error('El usuario no está asociado a alguna organización.')
    }
    return {
      serverError: {
        title: ErrorTitle.SERVER_GENERIC,
        message: 'El usuario no está asociado a alguna organización.',
      },
    }
  }
  cache.set(
    JSON.stringify({ data: CacheData.ORGANIZATIONS_TO_CHANGE, userId }),
    organizationsToChange,
  )
  return { organizationsToChange }
}
