import { useFetcher } from 'react-router'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@nextui-org/react'
import { Icon } from '@iconify/react'

import { Api } from '~/enums'
import { useUserStore } from '~/stores'

export default function OrganizationsMenu() {
  const organizationsToChange = useUserStore((state) => state.organizationsToChange)

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
            // <DropdownItem
            //   textValue={`Organización ${element.title}`}
            //   key={element.id}
            //   startContent={<Icon icon="mdi:business" width="100%" className="w-5 text-gray-500" />}
            // >
            //   <FetcherItem {...element} />
            // </DropdownItem>
            <FetcherItem key={element.id} {...element} />
          ))}
      </DropdownMenu>
    </Dropdown>
  )
}

function FetcherItem(props: { id: string; title: string }) {
  const fetcher = useFetcher()

  return (
    <DropdownItem
      textValue={`Organización ${props.title}`}
      startContent={<Icon icon="mdi:business" width="100%" className="w-5 text-gray-500" />}
      onClick={() => {
        console.log('H')
        const formData = new FormData()
        formData.append('organizationId', props.id)
        fetcher.submit(formData, { method: 'post', action: Api.ORGANIZATION_CHANGE })
      }}
    >
      {props.title}
    </DropdownItem>
  )
}
