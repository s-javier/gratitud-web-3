import { eq } from 'drizzle-orm'

import { OutputFromDB } from '~/types'
import { CacheData, ErrorTitle } from '~/enums'
import db from '~/db'
import { receivableTable } from '~/db/schema'
import { cache } from '~/utils/cache'

export type Input = {
  id: string
  spm: string | null
  preinvoice: string | null
  status: string
  patientId: string
  period: string
  paymentDate: string | null
}

export const receivableUpdateFromDB = async (input: Input): Promise<OutputFromDB> => {
  try {
    await db
      .update(receivableTable)
      .set({
        spm: input.spm,
        preinvoice: parseInt(input.preinvoice || '0') || null,
        status: input.status,
        patientId: input.patientId,
        period: input.period,
        paymentDate: input.paymentDate,
      })
      .where(eq(receivableTable.id, input.id!))
  } catch (err) {
    if (process.env.NODE_ENV) {
      console.error('Error en DB. No se pudo actualizar la cuenta.')
      console.info(err)
    }
    return {
      errors: {
        server: {
          title: ErrorTitle.SERVER_GENERIC,
          message: 'No se pudo editar la cuenta.',
        },
      },
    }
  }
  // cache.delete(JSON.stringify({ data: CacheData.PATIENTS, userId }))
  return null
}
