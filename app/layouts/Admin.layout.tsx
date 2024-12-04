import { useEffect } from 'react'
import {
  type LoaderFunctionArgs,
  Outlet,
  redirect,
  useLoaderData,
  useNavigation,
} from 'react-router'
import { toast } from 'sonner'

import { Page } from '~/enums'
import { userTokenCookie } from '~/utils/cookie'
import {
  verifyUserToken,
  verifyUserPermission,
  getMenuFromDB,
  getFirstNameFromDB,
  getOrganizationsToChangeFromDB,
} from '~/db/queries'
import { useUserStore, useLoaderOverlayStore } from '~/stores'
import Footer from '~/components/shared/Footer'

export const loader = async ({ context, request }: LoaderFunctionArgs) => {
  let response
  let middlewareResolve!: (value: unknown) => void
  context.middleware = new Promise((resolve) => {
    middlewareResolve = resolve
  })

  /* ▼ Verificar token */
  const userToken = await userTokenCookie.parse(request.headers.get('Cookie'))
  const verifiedUserToken = await verifyUserToken(userToken)
  if (verifiedUserToken.serverError) {
    middlewareResolve('error')
    return redirect(Page.LOGIN)
  }
  /* ▲ Verificar token */

  /* ▼ Verificar permiso de vista */
  const currentUrl = new URL(request.url)
  const pathname = currentUrl.pathname
  if (pathname !== Page.ADMIN_WELCOME) {
    const verifiedUserPermission = await verifyUserPermission(verifiedUserToken.roleId!, pathname)
    if (verifiedUserPermission.serverError) {
      middlewareResolve('error')
      return redirect(Page.ADMIN_WELCOME)
    }
  }
  /* ▲ Verificar permiso de vista */

  response = {
    ...verifiedUserToken,
  }

  /* ▼ Obtener menú del usario según su rol */
  const menuData = await getMenuFromDB(verifiedUserToken.roleId!)
  if (menuData.serverError) {
    middlewareResolve('error')
    return {
      ...response,
      ...menuData.serverError,
    }
  }
  /* ▲ Obtener menú del usario según su rol */

  response = {
    ...response,
    ...menuData,
  }
  middlewareResolve(verifiedUserToken)

  const organizationsToChange = await getOrganizationsToChangeFromDB(verifiedUserToken.userId!)
  response = {
    ...response,
    ...organizationsToChange,
  }

  const firstNameData = await getFirstNameFromDB(verifiedUserToken.userId!)
  response = {
    ...response,
    ...firstNameData,
  }
  return response
}

export default function AdminLayout() {
  const navigation = useNavigation()
  const loader = useLoaderData<{
    serverError?: { title: string; message: string }
    userId?: string
    organizationId?: string
    roleId?: string
    menu?: {
      title: string
      icon: string | null
      path: string
    }[]
    organizationsToChange?: {
      id: string
      title: string
      isSelected: boolean
    }[]
    firstName?: string
  }>()
  const setLoaderOverlay = useLoaderOverlayStore((state) => state.setLoaderOverlay)
  const setUser = useUserStore((state) => state.setUser)

  useEffect(() => {
    console.log(loader)
    if (loader?.serverError) {
      toast.error(loader.serverError.title, {
        description: loader.serverError.message || undefined,
        duration: 5000,
      })
    }
    setUser({
      userId: loader.userId || '',
      organizationId: loader.organizationId || '',
      roleId: loader.roleId || '',
      menu: loader.menu || [],
      organizationsToChange: loader.organizationsToChange || [],
      firstName: loader.firstName || '',
    })
  }, [loader])

  useEffect(() => {
    setLoaderOverlay(navigation.state !== 'idle')
  }, [navigation])

  return (
    <div className="flex flex-col h-full">
      <div className="grow">
        <Outlet />
      </div>
      <div className="flex-none">
        <Footer />
      </div>
    </div>
  )
}
