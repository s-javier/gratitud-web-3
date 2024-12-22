import { type MetaFunction } from 'react-router'
import { Button } from '@mui/material'

import { MUIBtnStyle } from '~/assets/styles/mui'
import AdminHeader from '~/routes/admin/component.AdminHeader'
import AdminMain from '~/routes/admin/component.AdminMain'

export const loader = async () => {
  return null
}

export const meta: MetaFunction = () => {
  return [{ title: 'Pide y se te dará | Gratitud' }, { name: 'description', content: '' }]
}

export default function GratitudeAskGivenRoute() {
  return (
    <>
      <AdminHeader
        title={
          <h1 className="max-w-[800px] text-3xl font-bold tracking-tight text-white">
            Pide y se te dará
          </h1>
        }
        buttons={
          <Button type="button" variant="contained" size="small" sx={MUIBtnStyle}>
            Agregar
          </Button>
        }
      />
      <AdminMain>
        <p>Gracias</p>
      </AdminMain>
    </>
  )
}
