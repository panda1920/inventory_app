import LoginIcon from '@mui/icons-material/Login'
import MenuIcon from '@mui/icons-material/Menu'
import { AppBar, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { MouseEvent, useState } from 'react'

export default function Header() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const openMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const closeMenu = () => {
    setAnchorEl(null)
  }
  const login = async () => {
    try {
      const response = await fetch('/api/login')
      console.log(response)
      console.log(await response.json())
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <AppBar>
      <SyledToolbar>
        <Typography variant='h3'>Header</Typography>
        <IconButton aria-label='hamburger-menu' size='medium' onClick={openMenu}>
          <MenuIcon fontSize='inherit' />
        </IconButton>
        <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={closeMenu}>
          <StyledMenuItem onClick={login}>
            <LoginIcon fontSize='medium' />
            <Typography>Login</Typography>
          </StyledMenuItem>
        </Menu>
      </SyledToolbar>
    </AppBar>
  )
}

const SyledToolbar = styled(Toolbar)(({ theme }) => {
  return {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingInline: `${theme.spacing(6)} !important`,
  }
})

const StyledMenuItem = styled(MenuItem)(() => {
  return {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'start',
    gap: '.5em',
  }
})
