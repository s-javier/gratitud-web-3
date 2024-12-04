import * as v from 'valibot'

export const organizationChangeValidation = (data: {
  organizationId: string
}): { errors: { organizationId?: string } } => {
  const errors: { organizationId?: string } = {}
  const organizationIdErr = v.safeParse(
    v.pipe(
      v.string('El valor es inválido.'),
      v.trim(),
      v.nonEmpty('Digitar el código es obligatorio'),
      v.uuid('El valor es inválido'),
    ),
    data.organizationId,
  )
  if (organizationIdErr.issues) {
    errors.organizationId = organizationIdErr.issues[0].message
  }
  return { errors }
}
