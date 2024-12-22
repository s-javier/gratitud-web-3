import * as v from 'valibot'

export type Input = {
  id?: string
  title: string
  isActive: boolean
}

type Error = {
  id?: string
  title?: string
  isActive?: string
}

type Output = { errors: Error }

export const organizationCreateUpdateValidation = (input: Input): Output => {
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

  const titleErr = v.safeParse(
    v.pipe(
      v.string('El valor de este campo es inválido.'),
      v.trim(),
      v.nonEmpty('Este campo es requerido.'),
      v.minLength(2, 'Escribe un poco más'),
      v.maxLength(50, 'Escribe menos'),
    ),
    input.title,
  )
  if (titleErr.issues) {
    errors.title = titleErr.issues[0].message
  }

  const isActiveErr = v.safeParse(
    v.pipe(v.boolean('El valor de este campo es inválido.')),
    input.isActive,
  )
  if (isActiveErr.issues) {
    errors.isActive = isActiveErr.issues[0].message
  }

  return { errors }
}
