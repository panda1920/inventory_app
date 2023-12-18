import { Box, Button, Typography } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import { ChangeEvent, useState } from 'react'

import { useAuth } from '@/hooks/auth'
import Input from '../form/input/input'

type SigninModalProps = {
  isOpen: boolean
  close: () => void
}

export default function SigninModal({ isOpen, close }: SigninModalProps) {
  const { loginWithEmail, loginWithGoogle, loginWithGithub } = useAuth({ afterLoginAction: close })
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function onEmailChange(e: ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value)
  }
  function onPasswordChange(e: ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value)
  }

  return (
    <Dialog open={isOpen} onClose={close}>
      <DialogTitle>Login</DialogTitle>
      <Box>
        <Box>
          <Typography>Sign in with email</Typography>
          <Input label='email' type='email' value={email} onChange={onEmailChange} />
          <Input label='password' type='password' value={password} onChange={onPasswordChange} />
          <Button
            onClick={loginWithEmail(email, password)}
            color='primary'
            disableElevation={true}
            sx={{ textAlign: 'center' }}
          >
            Sign in with email
          </Button>
        </Box>
        <Box>
          <Button onClick={loginWithGoogle} disableElevation={true} sx={{ textAlign: 'center' }}>
            Sign in with Google
          </Button>
          <Button onClick={loginWithGithub} disableElevation={true} sx={{ textAlign: 'center' }}>
            Sign in with github
          </Button>
        </Box>
      </Box>
    </Dialog>
  )
}
