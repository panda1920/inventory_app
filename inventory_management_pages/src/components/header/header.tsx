import MenuIcon from '@mui/icons-material/Menu'
import { IconButton, useTheme } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import clsx from 'clsx'
import { MouseEvent, useState } from 'react'

import DropdownMenu from '@/components/header/dropdown-menu'
import LoginModal from '@/components/modal/login/login-modal'
import SignupModal from '@/components/modal/signup/signup-modal'
import { useAuth } from '@/hooks/auth'

type HeaderType = {
  className?: string
}

export default function Header({ className }: HeaderType) {
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
    <AppBar position='static' className={clsx(className)}>
      <Toolbar className='flex flex-row justify-between px-12 py-4'>
        <Typography variant='h3'>Header</Typography>

        <IconButton aria-label='hamburger-menu' size='medium' onClick={openMenu}>
          <MenuIcon fontSize='inherit' htmlColor={theme.palette.primary.contrastText} />
        </IconButton>

        <DropdownMenu
          anchorElement={anchorEl}
          isOpen={!!anchorEl}
          onClose={closeMenu}
          onLogin={login}
          onLogout={logoutFromBackend}
        />
      </Toolbar>
      <LoginModal isOpen={isLoginOpen} close={() => setLoginOpen(false)} openSignup={signup} />
      <SignupModal isOpen={isSignupOpen} close={() => setSignupOpen(false)} openLogin={login} />
    </AppBar>
  )
}
