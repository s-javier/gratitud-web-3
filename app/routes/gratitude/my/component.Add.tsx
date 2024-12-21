import { useEffect, useState } from 'react'
// @ts-ignore
import { createPortal } from 'react-dom'
import { Button } from '@mui/material'

import AddEdit from './component.AddEdit'
import { MUIBtnStyle } from '~/assets/styles/mui'

export default function GratitudeMyAdd(props: { userId: string }) {
  const [isClient, setIsClient] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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
        onClick={() => setIsDialogOpen(true)}
      >
        Agregar
      </Button>
      {isClient &&
        createPortal(
          <AddEdit
            type="add"
            isShow={isDialogOpen}
            close={() => setIsDialogOpen(false)}
            userId={props.userId}
          />,
          document.querySelector('body')!,
        )}
    </>
  )
}
