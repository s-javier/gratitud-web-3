import { useEffect, useState } from 'react'
// @ts-ignore
import { createPortal } from 'react-dom'
import { Button, ListItemIcon, Menu, MenuItem } from '@mui/material'
import { Icon } from '@iconify/react'

import { MUIBtnStyle } from '~/assets/styles/mui'
import AddEdit from './component.AddEdit'
import AddRelationPermission from '~/routes/role/component.AddRelationPermission'

export default function PermissionAdd() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const [isClient, setIsClient] = useState(false)
  const [isDialogAddOpen, setIsDialogAddOpen] = useState(false)
  const [isDialogAddRelationPermissionOpen, setIsDialogAddRelationPermissionOpen] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <>
      <Button
        type="button"
        variant="contained"
        size="small"
        sx={MUIBtnStyle}
        onClick={(event: React.MouseEvent<HTMLElement>) => {
          setAnchorEl(event.currentTarget)
        }}
      >
        Agregar
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
            setIsDialogAddOpen(true)
            setAnchorEl(null)
          }}
        >
          <ListItemIcon>
            <Icon icon="mdi:lock" width="100%" className="w-5" />
          </ListItemIcon>
          Permiso
        </MenuItem>
        <MenuItem
          onClick={() => {
            setIsDialogAddRelationPermissionOpen(true)
            setAnchorEl(null)
          }}
        >
          <ListItemIcon>
            <Icon icon="mdi:card-account-details" width="100%" className="w-5" />
          </ListItemIcon>
          Asociación con rol
        </MenuItem>
      </Menu>

      {isClient &&
        createPortal(
          <AddEdit type="add" isShow={isDialogAddOpen} close={() => setIsDialogAddOpen(false)} />,
          document.querySelector('body')!,
        )}

      {isClient &&
        createPortal(
          <AddRelationPermission
            isShow={isDialogAddRelationPermissionOpen}
            close={() => setIsDialogAddRelationPermissionOpen(false)}
          />,
          document.querySelector('body')!,
        )}
    </>
  )
}
