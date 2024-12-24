import { useEffect } from 'react'
import { useFetcher } from 'react-router'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@nextui-org/react'
import { toast } from 'sonner'
import { Icon } from '@iconify/react'

import { Api } from '~/enums'
import { useLoaderOverlayStore, useUserStore } from '~/stores'

type FetcherOutput = {
  errors?: {
    server?: { title: string; message: string }
  }
}

export default function UserMenu() {
  const fetcher = useFetcher<FetcherOutput>()
  const setLoaderOverlay = useLoaderOverlayStore((state) => state.setLoaderOverlay)
  const firstNameUser = useUserStore((state) => state.firstName)

  useEffect(() => {
    setLoaderOverlay(fetcher.state !== 'idle')
    if (fetcher.state !== 'idle') {
      return
    }
    /* ↓ Error de servidor */
    if (fetcher.data?.errors?.server) {
      toast.error(fetcher.data.errors.server.title, {
        description: fetcher.data.errors.server.message || undefined,
        duration: 5000,
      })
      return
    }
  }, [fetcher])

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Button
          variant="light"
          className="text-gray-400 text-base hover:text-white uppercase"
          startContent={<Icon icon="mdi:account" width="100%" className="w-5" />}
          endContent={<Icon icon="mdi:chevron-down" width="100%" className="w-5" />}
        >
          {firstNameUser}
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem
          key="logout"
          startContent={<Icon icon="mdi:logout" width="100%" className="w-5 text-gray-500" />}
          onPress={() => {
            fetcher.submit(new FormData(), {
              method: 'post',
              action: Api.AUTH_SIGN_OUT,
            })
          }}
        >
          Cerrar sesión
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
