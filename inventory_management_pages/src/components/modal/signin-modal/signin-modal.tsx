import { Box, Button, Typography } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import { ChangeEvent, useState } from 'react'

import InlineButton from '@/components/inline-button/inline-button'
import { useAuth } from '@/hooks/auth'
import Input from '../../form/input/input'

type SigninModalProps = {
  isOpen: boolean
  close: () => void
}

export default function SigninModal({ isOpen, close }: SigninModalProps) {
  const {
    loginWithEmail,
    loginWithGoogleHandler,
    loginWithGithubHandler,
    signupWithEmailAndPassword,
  } = useAuth({
    afterLoginAction: close,
  })
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const title = isLogin ? 'Login' : 'Signup'
  const primaryButtonHandler = isLogin ? loginHandler : signupHandler

  function toggleMode() {
    setIsLogin((value) => !value)
  }

  async function loginHandler() {
    await loginWithEmail(email, password)
  }

  async function signupHandler() {
    await signupWithEmailAndPassword(email, password)
  }

  function onEmailChange(e: ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value)
  }

  function onPasswordChange(e: ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value)
  }

  return (
    <Dialog open={isOpen} onClose={close}>
      <DialogTitle>{title}</DialogTitle>
      <Box>
        <Box>
          <Typography>{title} with email</Typography>
          <Input label='email' type='email' value={email} onChange={onEmailChange} />
          <Input label='password' type='password' value={password} onChange={onPasswordChange} />
          <Button
            onClick={primaryButtonHandler}
            color='primary'
            disableElevation={true}
            sx={{ textAlign: 'center' }}
          >
            {title}
          </Button>
        </Box>

        <Box>
          <Button
            onClick={loginWithGoogleHandler}
            disableElevation={true}
            sx={{ textAlign: 'center' }}
          >
            {title} with Google
          </Button>
          <Button
            onClick={loginWithGithubHandler}
            disableElevation={true}
            sx={{ textAlign: 'center' }}
          >
            {title} with github
          </Button>
        </Box>

        <Box>
          {isLogin && (
            <Typography>
              Don&apos;t have an account? <InlineButton onClick={toggleMode}>Signup</InlineButton>{' '}
              to the app!
            </Typography>
          )}
          {!isLogin && (
            <Typography>
              Already have an account? <InlineButton onClick={toggleMode}>Login</InlineButton> to
              the app!
            </Typography>
          )}
        </Box>
      </Box>
    </Dialog>
  )
}
