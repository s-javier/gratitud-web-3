import { useEffect, useState } from 'react'
import { useFetcher } from 'react-router'
import { Button, ListItemIcon, Menu, MenuItem } from '@mui/material'
import { Icon } from '@iconify/react'
import colors from 'tailwindcss/colors'

import { Api } from '~/enums'
import { useLoaderOverlayStore, useUserStore } from '~/stores'

export default function OrganizationsMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const setLoaderOverlay = useLoaderOverlayStore((state) => state.setLoaderOverlay)
  const organizationsToChange = useUserStore((state) => state.organizationsToChange)
  const fetcher = useFetcher()

  useEffect(() => {
    setLoaderOverlay(fetcher.state !== 'idle')
  }, [fetcher])

  return (
    <>
      <Button
        sx={{
          color: colors.gray[400],
          '&:hover': {
            color: 'white',
          },
        }}
        startIcon={<Icon icon="mdi:building" width="100%" className="w-5" />}
        endIcon={<Icon icon="mdi:chevron-down" width="100%" className="w-5" />}
        onClick={(event: React.MouseEvent<HTMLElement>) => {
          setAnchorEl(event.currentTarget)
        }}
      >
        {organizationsToChange.filter((item: any) => item.isSelected)[0].title}
      </Button>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={anchorEl !== null}
        onClose={() => setAnchorEl(null)}
        onClick={() => setAnchorEl(null)}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {organizationsToChange
          .filter((item: any) => !item.isSelected)
          .map((element: any) => (
            <MenuItem
              key={element.id}
              onClick={() => {
                const formData = new FormData()
                formData.append('organizationId', element.id)
                fetcher.submit(formData, { method: 'post', action: Api.ORGANIZATION_CHANGE })
                setAnchorEl(null)
              }}
            >
              <ListItemIcon>
                <Icon icon="mdi:business" width="100%" className="w-5 text-gray-500" />
              </ListItemIcon>
              {element.title}
            </MenuItem>
          ))}
      </Menu>
    </>
  )
}
