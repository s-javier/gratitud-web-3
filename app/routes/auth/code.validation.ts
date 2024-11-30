import * as v from 'valibot'

export const authCodeValidation = (data: {
  timeLimit: number
  code: string
}): { errors: { code?: string } } => {
  const errors: { code?: string } = {}
  const codeErr = v.safeParse(
    v.pipe(
      v.custom(() => {
        return data.timeLimit > 0
      }, 'Código expirado.'),
      v.string('El valor del código es inválido.'),
      v.trim(),
      v.nonEmpty('Digitar el código es obligatorio'),
      v.regex(/^[0-9]{6}$/, 'El valor del código es inválido.'),
    ),
    data.code,
  )
  if (codeErr.issues) {
    errors.code = codeErr.issues[0].message
  }
  if (Object.keys(errors).length > 0) {
    return { errors }
  }
  return { errors }
}
