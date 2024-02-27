import DarkMode from '@mui/icons-material/DarkMode'
import LightMode from '@mui/icons-material/LightMode'
import LoginIcon from '@mui/icons-material/Login'
import PersonIcon from '@mui/icons-material/Person'
import { Switch } from '@mui/material'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import clsx from 'clsx'

import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { getColorScheme, toggleColorScheme } from '@/store/slice/app'
import { checkLogin, getUsername } from '@/store/slice/user'

type DropdownMenuProps = {
  anchorElement: HTMLElement | null
  isOpen: boolean
  onClose: () => void
  onLogin: () => void
  onLogout: () => void
}

export default function DropdownMenu({
  anchorElement,
  isOpen,
  onClose,
  onLogin,
  onLogout,
}: DropdownMenuProps) {
  const isLoggedIn = useAppSelector(checkLogin)
  const username = useAppSelector(getUsername)

  if (isLoggedIn)
    return (
      <Menu anchorEl={anchorElement} open={isOpen} onClose={onClose}>
        <MenuItem className='pointer-events-none flex flex-col gap-1 !mb-1'>
          <Box>
            <Typography>You are logged in as</Typography>
          </Box>
          <Box className='flex flex-row gap-[1em] items-center self-stretch'>
            <PersonIcon fontSize='medium' />
            <Typography>{username}</Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={onLogout} className='flex flex-row justify-start gap-[1em]'>
          <LoginIcon fontSize='medium' />
          <Typography>Logout</Typography>
        </MenuItem>
        <Divider variant='middle' />
        <LightDarkMenuItem className='flex flex-row justify-start gap-[1em] pointer-events-none' />
      </Menu>
    )
  else
    return (
      <Menu anchorEl={anchorElement} open={isOpen} onClose={onClose}>
        <MenuItem onClick={onLogin} className='flex flex-row justify-start gap-[1em]'>
          <LoginIcon fontSize='medium' />
          <Typography>Login</Typography>
        </MenuItem>
        <Divider variant='middle' />
        <LightDarkMenuItem className='flex flex-row justify-start gap-[1em] pointer-events-none' />
      </Menu>
    )
}

function LightDarkMenuItem({ className }: { className: string }) {
  const colorScheme = useAppSelector(getColorScheme)
  const dispatch = useAppDispatch()
  const isLight = colorScheme === 'light'

  return (
    <MenuItem className={clsx(className, '!bg-transparent')} disableRipple disableTouchRipple>
      {colorScheme === 'light' ? <LightMode fontSize='medium' /> : <DarkMode fontSize='medium' />}
      <Switch
        className='pointer-events-auto'
        onChange={() => dispatch(toggleColorScheme())}
        checked={isLight}
      />
    </MenuItem>
  )
}
