import { OutputFromDB } from '~/types'
import { CacheData, ErrorTitle } from '~/enums'
import db from '~/db'
import { receivableTable } from '~/db/schema'
import { cache } from '~/utils/cache'

export type Input = {
  spm: string | null
  preinvoice: string | null
  status: string
  patientId: string
  period: string
  paymentDate: string | null
}

export const receivableCreateFromDB = async (input: Input): Promise<OutputFromDB> => {
  try {
    await db.insert(receivableTable).values({
      spm: input.spm,
      preinvoice: parseInt(input.preinvoice || '0') || null,
      status: input.status,
      patientId: input.patientId,
      period: input.period,
      paymentDate: input.paymentDate,
    })
  } catch (err) {
    if (process.env.NODE_ENV) {
      console.error('Error en DB. No se pudo crear una nueva cuenta.')
      console.info(err)
    }
    return {
      errors: {
        server: {
          title: ErrorTitle.SERVER_GENERIC,
          message: 'No se pudo agregar una nueva cuenta.',
        },
      },
    }
  }
  // cache.delete(JSON.stringify({ data: CacheData.PATIENTS, userId }))
  return null
}
