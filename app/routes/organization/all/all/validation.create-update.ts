import * as v from 'valibot'

export type Input = {
  id?: string
  spm?: string
  preinvoice?: string
  status: string
  patientId: string
  period: string
  paymentDate?: string
}

type Error = {
  id?: string
  spm?: string
  preinvoice?: string
  status?: string
  patientId?: string
  period?: string
  paymentDate?: string
}

type Output = { errors: Error }

export const receivableCreateUpdateValidation = (input: Input): Output => {
  const errors: Error = {}

  const idErr = v.safeParse(
    v.optional(
      v.pipe(
        v.string('El valor de este campo es inválido.'),
        v.trim(),
        v.uuid('El valor de este campo es inválido.'),
      ),
    ),
    input.id,
  )
  if (idErr.issues) {
    errors.id = idErr.issues[0].message
  }

  const spmErr = v.safeParse(
    v.optional(
      v.pipe(
        v.string('El valor de este campo es inválido.'),
        v.trim(),
        v.minLength(4, 'Escribe un poco más.'),
        v.maxLength(30, 'Escribe menos.'),
      ),
    ),
    input.spm,
  )
  if (spmErr.issues) {
    errors.spm = spmErr.issues[0].message
  }

  const preinvoiceErr = v.safeParse(
    v.optional(
      v.pipe(
        v.string('El valor de este campo es inválido.'),
        v.trim(),
        v.digits('El valor de este campo es inválido.'),
      ),
    ),
    input.preinvoice,
  )
  if (preinvoiceErr.issues) {
    errors.preinvoice = preinvoiceErr.issues[0].message
  }

  const statusErr = v.safeParse(
    v.pipe(
      v.string('El valor de este campo es inválido.'),
      v.trim(),
      v.nonEmpty('Este campo es requerido.'),
    ),
    input.status,
  )
  if (statusErr.issues) {
    errors.status = statusErr.issues[0].message
  }

  const patientIdErr = v.safeParse(
    v.pipe(
      v.string('El valor de este campo es inválido.'),
      v.trim(),
      v.nonEmpty('Este campo es requerido.'),
      v.uuid('El valor de este campo es inválido.'),
    ),
    input.patientId,
  )
  if (patientIdErr.issues) {
    errors.patientId = patientIdErr.issues[0].message
  }

  const periodErr = v.safeParse(
    v.pipe(
      v.string('El valor de este campo es inválido.'),
      v.trim(),
      v.nonEmpty('Este campo es requerido.'),
      v.regex(
        /^(?:(?:19|20)\d{2})\/(?:0[1-9]|1[0-2])\/(?:0[1-9]|[12]\d|3[01])$/,
        'El valor de este campo es inválido.',
      ),
    ),
    input.period,
  )
  if (periodErr.issues) {
    errors.period = periodErr.issues[0].message
  }

  const paymentDateErr = v.safeParse(
    v.optional(
      v.pipe(
        v.string('El valor de este campo es inválido.'),
        v.trim(),
        v.regex(
          /^(?:(?:19|20)\d{2})\/(?:0[1-9]|1[0-2])\/(?:0[1-9]|[12]\d|3[01])$/,
          'El valor de este campo es inválido.',
        ),
      ),
    ),
    input.paymentDate,
  )
  if (paymentDateErr.issues) {
    errors.paymentDate = paymentDateErr.issues[0].message
  }

  return { errors }
}
