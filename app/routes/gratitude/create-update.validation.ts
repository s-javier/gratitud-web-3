import * as v from 'valibot'

export const gratitudeCreateUpdateValidation = (input: {
  title?: string
  description: string
  isMaterialized?: boolean
}): { errors: { title?: string; description?: string } } => {
  const errors: { title?: string; description?: string; isMaterialized?: string } = {}
  const titleErr = v.safeParse(
    v.optional(
      v.pipe(
        v.string('El valor de este campo es inválido.'),
        v.trim(),
        v.nonEmpty('Este campo es requerido.'),
        v.minLength(4, 'Escribe un poco más.'),
        v.maxLength(100, 'Escribe menos.'),
      ),
    ),
    input.title,
  )
  if (titleErr.issues) {
    errors.title = titleErr.issues[0].message
  }
  const descriptionErr = v.safeParse(
    v.pipe(
      v.string('El valor de este campo es inválido.'),
      v.trim(),
      v.nonEmpty('Este campo es requerido.'),
      v.minLength(4, 'Escribe un poco más.'),
      v.maxLength(400, 'Escribe menos.'),
    ),
    input.description,
  )
  if (descriptionErr.issues) {
    errors.description = descriptionErr.issues[0].message
  }
  const isMaterializedErr = v.safeParse(
    v.optional(v.pipe(v.boolean('El valor de este campo es inválido.'))),
    input.isMaterialized,
  )
  if (isMaterializedErr.issues) {
    errors.isMaterialized = isMaterializedErr.issues[0].message
  }
  return { errors }
}
