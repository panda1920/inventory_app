import MenuIcon from '@mui/icons-material/Menu'
import { AppBar, IconButton, Toolbar, Typography, useTheme } from '@mui/material'
import { MouseEvent, useState } from 'react'

import LoginModal from '@/components/modal/login/login-modal'
import SignupModal from '@/components/modal/signup/signup-modal'
import { useAuth } from '@/hooks/auth'
import DropdownMenu from '@/components/header/dropdown-menu'

export default function Header() {
  const [isLoginOpen, setLoginOpen] = useState(false)
  const [isSignupOpen, setSignupOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const { logoutFromBackend } = useAuth({ afterLogoutAction: closeMenu })
  const theme = useTheme()

  function openMenu(event: MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget)
  }
  function closeMenu() {
    setAnchorEl(null)
  }
  async function login() {
    setLoginOpen(true)
    setSignupOpen(false)
    closeMenu()
  }
  async function signup() {
    setSignupOpen(true)
    setLoginOpen(false)
    closeMenu()
  }

  return (
    <>
      <AppBar position='static'>
        <Toolbar
          className='flex flex-row justify-between'
          style={{ paddingInline: theme.spacing(6), paddingBlock: theme.spacing(2) }}
        >
          <Typography variant='h3'>Header</Typography>

          <IconButton aria-label='hamburger-menu' size='medium' onClick={openMenu}>
            <MenuIcon fontSize='inherit' />
          </IconButton>

          <DropdownMenu
            anchorElement={anchorEl}
            isOpen={!!anchorEl}
            onClose={closeMenu}
            onLogin={login}
            onLogout={logoutFromBackend}
          />
        </Toolbar>
      </AppBar>

      <LoginModal isOpen={isLoginOpen} close={() => setLoginOpen(false)} openSignup={signup} />
      <SignupModal isOpen={isSignupOpen} close={() => setSignupOpen(false)} openLogin={login} />
    </>
  )
}
