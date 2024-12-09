import { type ActionFunctionArgs } from 'react-router'

import { gratitudeCreateUpdateValidation } from './create-update.validation'
import { gratitudeUpdateFromDB } from './update.db'

export const loader = () => {
  return new Response('Not Found', { status: 404 })
}

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== 'POST') {
    return new Response('Not Found', { status: 404 })
  }

  const formData = await request.formData()
  const id = String(formData.get('id'))
  const title = formData.has('title') ? String(formData.get('title')) : undefined
  const description = String(formData.get('description'))
  const isMaterialized = Boolean(formData.get('isMaterialized'))
  const userId = String(formData.get('userId'))

  /* ▼ Validación de formulario */
  const validation = gratitudeCreateUpdateValidation({ title, description, isMaterialized })
  if (Object.keys(validation.errors).length > 0) {
    return validation
  }
  /* ▲ Validación de formulario */

  const result = await gratitudeUpdateFromDB({ id, title, description, isMaterialized }, userId)
  if (result?.errors?.server) {
    return result
  }

  return { isSuccess: true }
}
