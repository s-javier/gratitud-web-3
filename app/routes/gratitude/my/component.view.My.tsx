import { useEffect, useState } from 'react'
import { LoaderFunctionArgs, type MetaFunction, useLoaderData } from 'react-router'
import { toast } from 'sonner'
// import { Input } from '@nextui-org/react'

import { UserInfo } from '~/types'
import { ErrorMessage, ErrorTitle } from '~/enums'
import { getMyGratitudesFromDB } from './db.my-gratitudes'
import AdminHeader from '~/routes/admin/component.AdminHeader'
import AdminMain from '~/routes/admin/component.AdminMain'
import Thank from '~/routes/gratitude/component.Thank'
import TableActions from '~/components/TableActions'
import Add from '~/routes/gratitude/my/component.Add'
import Info from '~/routes/gratitude/my/component.Info'
import AddEdit from '~/routes/gratitude/my/component.AddEdit'
import Delete from '~/routes/gratitude/my/component.Delete'

type Element = {
  id: string
  title: string | null
  description: string
  createdAt: Date
}

type Loader = {
  errors?: { server: { title: string; message: string } }
  userInfo?: UserInfo
  myGratitudes?: Element[]
  /* ↓ Para input de agregar/editar */
  // patients?: {
  //   id: string
  //   rut: string | null
  //   firstName: string
  //   paternalSurname: string | null
  //   maternalSurname: string | null
  // }[]
}

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const userInfo = (await context.middleware) as UserInfo | 'error'
  if (userInfo === 'error') {
    return {
      errors: {
        server: {
          title: ErrorTitle.SERVER_GENERIC,
          message: ErrorMessage.SERVER_GENERIC,
        },
      },
    }
  }
  const myGratitudes = await getMyGratitudesFromDB(userInfo.userId)
  return { userInfo, ...myGratitudes }
}

export const meta: MetaFunction = () => {
  return [{ title: 'Mis agradecimientos | Gratitud' }, { name: 'description', content: '' }]
}

export default function GratitudeMyRoute() {
  const loader = useLoaderData<Loader>()
  const [gratitude, setGratitude] = useState<any>({})
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [filteredItems, setFilteredItems] = useState(loader.myGratitudes || [])

  useEffect(() => {
    if (loader?.errors?.server) {
      toast.error(loader.errors.server.title, {
        description: loader.errors.server.message || undefined,
        duration: 5000,
      })
      return
    }
    setFilteredItems(loader.myGratitudes || [])
  }, [loader])

  useEffect(() => {
    if (loader.myGratitudes) {
      setFilteredItems(
        loader.myGratitudes.filter((item) =>
          item.description.toLowerCase().includes(searchText.toLowerCase()),
        ),
      )
    }
  }, [searchText])

  return (
    <>
      <Info isShow={isInfoOpen} close={() => setIsInfoOpen(false)} data={gratitude} />
      <AddEdit
        type="edit"
        isShow={isEditOpen}
        close={() => setIsEditOpen(false)}
        data={{
          id: gratitude.id,
          title: gratitude.title || '',
          description: gratitude.description || '',
        }}
        userId={loader.userInfo?.userId || ''}
      />
      <Delete
        isShow={isDeleteOpen}
        close={() => setIsDeleteOpen(false)}
        data={gratitude}
        userId={loader.userInfo?.userId || ''}
      />
      <AdminHeader
        title={
          <h1 className="max-w-[800px] text-3xl font-bold tracking-tight text-white">
            Mis agradecimientos
          </h1>
        }
        buttons={<Add userId={loader.userInfo?.userId || ''} />}
      />
      <AdminMain>
        <div className="max-w-[600px] m-auto">
          {/* <Input
            name="q"
            type="text"
            label="Buscar agradecimiento según descripción"
            className="mb-10"
            classNames={{
              inputWrapper: [
                'border-gray-400 border-[1px]',
                'hover:!border-(--o-input-border-hover-color)',
                'group-data-[focus=true]:border-(--o-input-border-hover-color)',
              ],
            }}
            size="lg"
            variant="bordered"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            isClearable
            onClear={() => setSearchText('')}
          /> */}
          {filteredItems.length === 0 ? (
            <p className="text-sm text-gray-500 text-center mb-4">No tienes agradecimientos.</p>
          ) : (
            <p className="text-sm text-gray-500 text-center mb-4">
              Estas viendo {filteredItems.length}{' '}
              {filteredItems.length === 1 ? 'agradecimiento' : 'agradecimientos'} de un total de{' '}
              {loader.myGratitudes!.length}.
            </p>
          )}
          {filteredItems.map((item: any, index: number) => (
            <Thank index={index} item={item} key={index}>
              <TableActions
                infoClick={() => {
                  setGratitude(item)
                  setIsInfoOpen(true)
                }}
                editClick={() => {
                  setGratitude(item)
                  setIsEditOpen(true)
                }}
                deleteClick={() => {
                  setGratitude(item)
                  setIsDeleteOpen(true)
                }}
              />
            </Thank>
          ))}
        </div>
      </AdminMain>
    </>
  )
}
