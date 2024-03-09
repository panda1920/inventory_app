import MenuIcon from '@mui/icons-material/Menu'
import { IconButton, useTheme } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import clsx from 'clsx'
import Image from 'next/image'
import { MouseEvent, useState } from 'react'

import DropdownMenu from '@/components/header/dropdown-menu'
import { useAuth } from '@/hooks/auth'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { getColorScheme } from '@/store/slice/app'
import { setLoginModal, setSignupModal } from '@/store/slice/modal'

type HeaderType = {
  className?: string
  contentClassName?: string
}

export default function Header({ className, contentClassName }: HeaderType) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const { logoutFromBackend } = useAuth({ afterLogout: afterLogoutHandler })
  const theme = useTheme()
  const colorScheme = useAppSelector(getColorScheme)
  const dispatch = useAppDispatch()

  function openMenu(event: MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget)
  }
  function closeMenu() {
    setAnchorEl(null)
  }
  async function loginHandler() {
    dispatch(setLoginModal(() => true))
    dispatch(setSignupModal(() => false))
    closeMenu()
  }
  async function afterLogoutHandler() {
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
          onLogin={loginHandler}
          onLogout={logoutFromBackend}
        />
      </Toolbar>
    </AppBar>
  )
}
