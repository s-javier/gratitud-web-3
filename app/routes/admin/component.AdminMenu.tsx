import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import { Icon } from '@iconify/react'

// import { $loaderBar } from '~/stores'
import { cn } from '~/utils/cn'
import colors from 'tailwindcss/colors'

export default function AdminMenu(props: {
  menu: any[]
  currentPath: string
  organizations: any[]
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [openItems, setOpenItems] = useState<any>({})
  const [pages, setPages] = useState<any[]>([])

  const getPrefix = (path: string) => {
    const parts = path.split('/')
    return parts.slice(0, 3).join('/')
  }

  useEffect(() => {
    const groupedData: any = []
    const sections: any = {}
    for (const item of props.menu) {
      const prefix = getPrefix(item.path)
      if (sections[prefix]) {
        /* Si el prefijo ya existe, añadimos a los children */
        sections[prefix].children.push({
          path: item.path,
          menuTitle: item.title,
          menuIcon: item.icon,
        })
      } else {
        /* Si no existe, creamos un nuevo grupo o agregamos directamente al resultado */
        if (props.menu.filter((el: any) => getPrefix(el.path) === prefix).length > 1) {
          sections[prefix] = {
            prefix,
            menuTitle: item.title,
            menuIcon: item.icon,
            children: [
              {
                path: item.path,
                menuTitle: 'Ver ' + item.title.toLowerCase(),
                menuIcon: item.icon,
              },
            ],
          }
          groupedData.push(sections[prefix])
        } else {
          groupedData.push(item)
        }
      }
    }
    setPages(groupedData)
  }, [props.menu])

  // @ts-ignore
  const toggleItem = (name, isRelationWithCurrentPath) => {
    setOpenItems((prev: any) => ({
      ...prev,
      /* Si isRelationWithCurrentPath === false, entonce es un toggle (ir variando) de !prev[name]
       * Si isRelationWithCurrentPath === true y prev[name] (=== undefined) es primera vez que se presiona,
       * entonces es false, sino es un toggle (ir variando) de !prev[name].
       */
      [name]: isRelationWithCurrentPath
        ? prev[name] === undefined
          ? false
          : !prev[name]
        : !prev[name],
    }))
  }

  const activeLoaderBar = () => {
    // $loaderBar.set(true)
  }

  return (
    <>
      <IconButton
        sx={{
          color: colors.gray[400],
          '&:hover': {
            color: 'white',
          },
        }}
        aria-label="plus"
        onClick={() => setIsOpen(true)}
      >
        <Icon icon="mdi:menu" width="100%" className="w-6" />
      </IconButton>
      <Drawer open={isOpen} onClose={() => setIsOpen(!isOpen)}>
        <Box
          component="div"
          sx={{ width: 250 }}
          role="presentation"
          onClick={(value) => setIsOpen(!isOpen)}
        >
          <List>
            {pages.map((item, index) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton component={Link} to={item.path}>
                  <ListItemIcon>
                    <Icon icon={item.icon} width="100%" className="w-5 text-gray-400" />
                  </ListItemIcon>
                  <ListItemText primary={item.title} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      {/* panelTitle={props.organizations.filter((item: any) => item.isSelected)[0].title} */}
      {/* props.currentPath === item.path */}
    </>
  )
}
