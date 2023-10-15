import LoginIcon from '@mui/icons-material/Login'
import MenuIcon from '@mui/icons-material/Menu'
import { AppBar, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { MouseEvent, useState } from 'react'

import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { checkLogin, login, logout } from '@/store/slice/user'
import type { LoginResponse } from '@/types/api'

export default function Header() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const dispatch = useAppDispatch()
  const isLoggedIn = useAppSelector(checkLogin)

  const openMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const closeMenu = () => {
    setAnchorEl(null)
  }
  const loginHandler = async () => {
    try {
      const response = await fetch('/api/login')
      const responseJson = (await response.json()) as LoginResponse
      dispatch(login(responseJson.token))
    } catch (e) {
      console.error(e)
    }
  }
  const logoutHandler = () => {
    dispatch(logout())
  }

  return (
    <AppBar position='static'>
      <SyledToolbar>
        <Typography variant='h3'>Header</Typography>
        <IconButton aria-label='hamburger-menu' size='medium' onClick={openMenu}>
          <MenuIcon fontSize='inherit' />
        </IconButton>
        <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={closeMenu}>
          {isLoggedIn ? (
            <StyledMenuItem onClick={logoutHandler}>
              <LoginIcon fontSize='medium' />
              <Typography>Logout</Typography>
            </StyledMenuItem>
          ) : (
            <StyledMenuItem onClick={loginHandler}>
              <LoginIcon fontSize='medium' />
              <Typography>Login</Typography>
            </StyledMenuItem>
          )}
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
    // https://github.com/mui/material-ui/issues/28911
    // needs extra specificity to modify certain css properties
    paddingInline: `${theme.spacing(6)} !important`,
  }
})

const StyledMenuItem = styled(MenuItem)(() => {
  return {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'start',
    gap: '1em',
  }
})
