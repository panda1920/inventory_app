import LoginIcon from '@mui/icons-material/Login'
import MenuIcon from '@mui/icons-material/Menu'
import { AppBar, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { MouseEvent, useState } from 'react'

import SigninModal from '@/components/signin-modal/signin-modal'
import { InventoryAppClientError } from '@/helper/errors'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { checkLogin, getUsername, logoutAction } from '@/store/slice/user'

export default function Header() {
  const [isLoginOpen, setLoginOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const dispatch = useAppDispatch()
  const isLoggedIn = useAppSelector(checkLogin)
  const username = useAppSelector(getUsername)

  const openMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const closeMenu = () => {
    setAnchorEl(null)
  }
  const login = async () => {
    setLoginOpen(true)
    closeMenu()
  }
  const logout = async () => {
    try {
      await logoutAPI()
    } catch (e) {
      console.error(e)
    }

    dispatch(logoutAction())
    closeMenu()
  }

  async function logoutAPI() {
    const url = '/api/logout'
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const response = await fetch(url, options)
    const responseJson = await response.json()
    if (response.ok) return responseJson

    throw new InventoryAppClientError(responseJson.messasge ?? 'Failed to login')
  }

  return (
    <>
      <AppBar position='static'>
        <SyledToolbar>
          <Typography variant='h3'>Header</Typography>
          {username && <Typography variant='body1'>{username}</Typography>}
          <IconButton aria-label='hamburger-menu' size='medium' onClick={openMenu}>
            <MenuIcon fontSize='inherit' />
          </IconButton>
          <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={closeMenu}>
            {isLoggedIn ? (
              <StyledMenuItem onClick={logout}>
                <LoginIcon fontSize='medium' />
                <Typography>Logout</Typography>
              </StyledMenuItem>
            ) : (
              <StyledMenuItem onClick={login}>
                <LoginIcon fontSize='medium' />
                <Typography>Login</Typography>
              </StyledMenuItem>
            )}
          </Menu>
        </SyledToolbar>
      </AppBar>

      <SigninModal isOpen={isLoginOpen} close={() => setLoginOpen(false)} />
    </>
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
