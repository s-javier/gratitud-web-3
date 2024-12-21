import AdminHeader from '~/routes/admin/component.AdminHeader'
import AdminMain from '~/routes/admin/component.AdminMain'

export const loader = async () => {
  return null
}

export default function GratitudeRememberRoute() {
  return (
    <>
      <AdminHeader
        title={
          <h1 className="max-w-[800px] text-3xl font-bold tracking-tight text-white">
            Recordar agradecimientos
          </h1>
        }
        buttons={<button>Agregar</button>}
        // buttons={<Add userId={loader.userInfo?.userId || ''} />}
      />
      <AdminMain>
        <p>Gracias</p>
      </AdminMain>
    </>
  )
}
