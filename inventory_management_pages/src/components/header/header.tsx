import MenuIcon from '@mui/icons-material/Menu'
import { IconButton, useTheme } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import clsx from 'clsx'
import Image from 'next/image'
import { MouseEvent, useState } from 'react'

import DropdownMenu from '@/components/header/dropdown-menu'
import LoginModal from '@/components/modal/login/login-modal'
import SignupModal from '@/components/modal/signup/signup-modal'
import { useAuth } from '@/hooks/auth'
import { useAppSelector } from '@/store/hooks'
import { getColorScheme } from '@/store/slice/app'

type HeaderType = {
  className?: string
  contentClassName?: string
}

export default function Header({ className, contentClassName }: HeaderType) {
  const [isLoginOpen, setLoginOpen] = useState(false)
  const [isSignupOpen, setSignupOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const { logoutFromBackend } = useAuth({ afterLogoutAction: closeMenu })
  const theme = useTheme()
  const colorScheme = useAppSelector(getColorScheme)

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
    <AppBar position='static' className={className}>
      <Toolbar className={clsx('flex flex-row justify-between py-4 !px-0', contentClassName)}>
        <Image
          src={colorScheme === 'light' ? '/assets/logo.svg' : '/assets/logo-white.svg'}
          height='36'
          width='222' // 6.19 * height
          alt='logo'
        />

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
