import LoginIcon from '@mui/icons-material/Login'
import MenuIcon from '@mui/icons-material/Menu'
import { AppBar, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { MouseEvent, useState } from 'react'

import SigninModal from '@/components/modal/signin/signin-modal'
import SignupModal from '@/components/modal/signup/signup-modal'
import { useAuth } from '@/hooks/auth'
import { useAppSelector } from '@/store/hooks'
import { checkLogin, getUsername } from '@/store/slice/user'

export default function Header() {
  const [isLoginOpen, setLoginOpen] = useState(false)
  const [isSignupOpen, setSignupOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const isLoggedIn = useAppSelector(checkLogin)
  const username = useAppSelector(getUsername)
  const { logoutFromBackend } = useAuth({ afterLogoutAction: closeMenu })

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
        <SyledToolbar>
          <Typography variant='h3'>Header</Typography>

          {username && <Typography variant='body1'>{username}</Typography>}

          <IconButton aria-label='hamburger-menu' size='medium' onClick={openMenu}>
            <MenuIcon fontSize='inherit' />
          </IconButton>
          <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={closeMenu}>
            {isLoggedIn ? (
              <StyledMenuItem onClick={logoutFromBackend}>
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

      <SigninModal isOpen={isLoginOpen} close={() => setLoginOpen(false)} openSignup={signup} />
      <SignupModal isOpen={isSignupOpen} close={() => setSignupOpen(false)} openLogin={login} />
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
