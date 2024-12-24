import { useEffect } from 'react'
import { useFetcher } from 'react-router'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@nextui-org/react'
import { Icon } from '@iconify/react'

import { Api } from '~/enums'
import { useLoaderOverlayStore, useUserStore } from '~/stores'

export default function OrganizationsMenu() {
  const setLoaderOverlay = useLoaderOverlayStore((state) => state.setLoaderOverlay)
  const organizationsToChange = useUserStore((state) => state.organizationsToChange)
  const fetcher = useFetcher()

  useEffect(() => {
    setLoaderOverlay(fetcher.state !== 'idle')
  }, [fetcher])

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Button
          variant="light"
          className="text-gray-400 text-base hover:text-white uppercase"
          startContent={<Icon icon="mdi:building" width="100%" className="w-5" />}
          endContent={<Icon icon="mdi:chevron-down" width="100%" className="w-5" />}
        >
          {organizationsToChange.filter((item: any) => item.isSelected)[0].title}
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        {organizationsToChange
          .filter((item: any) => !item.isSelected)
          .map((element: any) => (
            <DropdownItem
              textValue={`Organización ${element.title}`}
              key={element.id}
              startContent={<Icon icon="mdi:business" width="100%" className="w-5 text-gray-500" />}
              onPress={() => {
                const formData = new FormData()
                formData.append('organizationId', element.id)
                fetcher.submit(formData, { method: 'post', action: Api.ORGANIZATION_CHANGE })
              }}
            >
              {element.title}
            </DropdownItem>
          ))}
      </DropdownMenu>
    </Dropdown>
  )
}
