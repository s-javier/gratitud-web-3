import AdminHeader from '~/components/admin/AdminHeader'
import AdminMain from '~/components/admin/AdminMain'

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
