import { type ActionFunctionArgs } from 'react-router'
import * as v from 'valibot'

import { gratitudeDeleteFromDB } from './db.delete'

export const loader = () => {
  return new Response('Not Found', { status: 404 })
}

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== 'POST') {
    return new Response('Not Found', { status: 404 })
  }

  const formData = await request.formData()
  const id = String(formData.get('id'))
  const userId = String(formData.get('userId'))

  /* ▼ Validación de formulario */
  const idErr = v.safeParse(
    v.pipe(
      v.string('El valor de este campo es inválido.'),
      v.trim(),
      v.uuid('El valor de este campo es inválido.'),
    ),
    id,
  )
  if (idErr.issues) {
    return {
      errors: {
        id: idErr.issues[0].message,
      },
    }
  }
  /* ▲ Validación de formulario */

  const result = await gratitudeDeleteFromDB({ id }, userId)
  if (result?.errors?.server) {
    return result
  }

  return { isSuccess: true }
}
