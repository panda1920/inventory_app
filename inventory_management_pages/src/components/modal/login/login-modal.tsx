import { Box, Button, Typography } from '@mui/material'
import { ChangeEvent, useState } from 'react'

import Input from '@/components/form/input/input'
import InlineButton from '@/components/inline-button/inline-button'
import CommonModal from '@/components/modal/common/common-modal'
import { useAuth } from '@/hooks/auth'

type LoginModalProps = {
  isOpen: boolean
  close: () => void
  openSignup: () => void
}

export default function LoginModal({ isOpen, close, openSignup }: LoginModalProps) {
  const { loginWithEmail, loginWithGoogleHandler, loginWithGithubHandler } = useAuth({
    afterLoginAction: close,
  })
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function loginHandler() {
    await loginWithEmail(email, password)
  }

  function onEmailChange(e: ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value)
  }

  function onPasswordChange(e: ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value)
  }

  return (
    <CommonModal isOpen={isOpen} close={close} title='Login'>
      <Box>
        <Typography>Login with email</Typography>
        <Input label='email' type='email' value={email} onChange={onEmailChange} />
        <Input label='password' type='password' value={password} onChange={onPasswordChange} />
        <Button
          onClick={loginHandler}
          color='primary'
          disableElevation={true}
          sx={{ textAlign: 'center' }}
        >
          LOGIN
        </Button>
      </Box>

      <Box>
        <Button
          onClick={loginWithGoogleHandler}
          disableElevation={true}
          sx={{ textAlign: 'center' }}
        >
          <Typography>Login with Google</Typography>
        </Button>
        <Button
          onClick={loginWithGithubHandler}
          disableElevation={true}
          sx={{ textAlign: 'center' }}
        >
          <Typography>Login with Github</Typography>
        </Button>
      </Box>

      <Box>
        <Typography>
          Don&apos;t have an account? <InlineButton onClick={openSignup}>Signup</InlineButton> to
          the app!
        </Typography>
      </Box>
    </CommonModal>
  )
}
