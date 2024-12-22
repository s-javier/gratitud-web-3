import { and, eq, ne } from 'drizzle-orm'

import { CacheData, ErrorTitle } from '~/enums'
import db from '~/db'
import { patientTable, receivableTable } from '~/db/schema'
import { cache } from '~/utils/cache'

type Output = {
  errors?: { server: { title: string; message: string } }
  receivables?: {
    id: string
    spm: string | null
    period: string | null
    paymentDate: string | null
    status: string | null
    patientId: string
    rut: string | null
    firstName: string
    paternalSurname: string | null
    maternalSurname: string | null
  }[]
}

export const getReceivablesFromDB = async (organizationId: string): Promise<Output> => {
  let receivables
  // if (cache.has(JSON.stringify({ data: CacheData.PATIENTS, organizationId }))) {
  //   patients = cache.get(JSON.stringify({ data: CacheData.PATIENTS, organizationId })) as any[]
  //   return
  // }
  try {
    receivables = await db
      .select({
        id: receivableTable.id,
        spm: receivableTable.spm,
        preinvoice: receivableTable.preinvoice,
        status: receivableTable.status,
        period: receivableTable.period,
        paymentDate: receivableTable.paymentDate,
        patientId: receivableTable.patientId,
        rut: patientTable.rut,
        firstName: patientTable.firstName,
        paternalSurname: patientTable.paternalSurname,
        maternalSurname: patientTable.maternalSurname,
        isapre: patientTable.isapre,
        financing: patientTable.financing,
      })
      .from(receivableTable)
      .innerJoin(patientTable, eq(receivableTable.patientId, patientTable.id))
      .where(
        and(
          eq(patientTable.organizationId, organizationId),
          ne(receivableTable.status, 'Facturado'),
        ),
      )
  } catch (err) {
    if (process.env.NODE_ENV) {
      console.error('Error en DB. Obtención de cuentas.')
      console.info(err)
    }
    return {
      errors: {
        server: {
          title: ErrorTitle.SERVER_GENERIC,
          message: 'No se pudo obtener las cuentas.',
        },
      },
    }
  }
  // cache.set(JSON.stringify({ data: CacheData.PATIENTS, organizationId }), patients)
  return { receivables }
}
