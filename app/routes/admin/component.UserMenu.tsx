import { useEffect, useState } from 'react'
import { useFetcher } from 'react-router'
import { Button, ListItemIcon, Menu, MenuItem } from '@mui/material'
import { toast } from 'sonner'
import { Icon } from '@iconify/react'
import colors from 'tailwindcss/colors'

import { Api } from '~/enums'
import { useLoaderOverlayStore, useUserStore } from '~/stores'

type FetcherOutput = {
  errors?: {
    server?: { title: string; message: string }
  }
}

export default function UserMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
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
    <>
      <Button
        sx={{
          color: colors.gray[400],
          '&:hover': {
            color: 'white',
          },
        }}
        startIcon={<Icon icon="mdi:account" width="100%" className="w-5" />}
        endIcon={<Icon icon="mdi:chevron-down" width="100%" className="w-5" />}
        onClick={(event: React.MouseEvent<HTMLElement>) => {
          setAnchorEl(event.currentTarget)
        }}
      >
        {firstNameUser}
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
        <MenuItem
          onClick={() => {
            fetcher.submit(new FormData(), {
              method: 'post',
              action: Api.AUTH_SIGN_OUT,
            })
            setAnchorEl(null)
          }}
        >
          <ListItemIcon>
            <Icon icon="mdi:logout" width="100%" className="w-5 text-gray-500" />
          </ListItemIcon>
          Cerrar sesión
        </MenuItem>
      </Menu>
    </>
  )
}
