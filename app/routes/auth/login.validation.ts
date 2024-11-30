import * as v from 'valibot'

export const authLoginValidation = (data: { email: string }): { errors: { email?: string } } => {
  const errors: { email?: string } = {}
  const emailErr = v.safeParse(
    v.pipe(
      v.string('El valor de este campo es inválido.'),
      v.trim(),
      v.nonEmpty('Este campo es requerido.'),
      v.email('El valor de este campo es inválido.'),
    ),
    data.email,
  )
  if (emailErr.issues) {
    errors.email = emailErr.issues[0].message
  }
  if (Object.keys(errors).length > 0) {
    return { errors }
  }
  return { errors }
}
