import { Box, Button, Typography } from '@mui/material'
import { ChangeEvent, SyntheticEvent, useState } from 'react'

import Input from '@/components/form/input/input'
import InlineButton from '@/components/inline-button/inline-button'
import CommonModal from '@/components/modal/common/common-modal'
import { useAuth } from '@/hooks/auth'

type SignupModalProps = {
  isOpen: boolean
  close: () => void
  openLogin: () => void
}

export default function SignupModal({ isOpen, close, openLogin }: SignupModalProps) {
  const { loginWithGoogleHandler, loginWithGithubHandler, signupWithEmailAndPassword } = useAuth({
    afterLoginAction: close,
  })
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function signupHandler(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    await signupWithEmailAndPassword(email, password)
  }

  function onEmailChange(e: ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value)
  }

  function onPasswordChange(e: ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value)
  }

  return (
    <CommonModal isOpen={isOpen} close={close} title='Signup'>
      <Box component='form' onSubmit={signupHandler}>
        <Typography>Signup with email</Typography>
        <Input
          label='email'
          type='email'
          value={email}
          onChange={onEmailChange}
          autoComplete='email'
        />
        <Input
          label='password'
          type='password'
          value={password}
          onChange={onPasswordChange}
          autoComplete='new-password'
        />
        <Button type='submit' color='primary' disableElevation={true} sx={{ textAlign: 'center' }}>
          SIGNUP
        </Button>
      </Box>

      <Box>
        <Button
          onClick={loginWithGoogleHandler}
          disableElevation={true}
          sx={{ textAlign: 'center' }}
        >
          <Typography>Signup with Google</Typography>
        </Button>
        <Button
          onClick={loginWithGithubHandler}
          disableElevation={true}
          sx={{ textAlign: 'center' }}
        >
          <Typography>Signup with Github</Typography>
        </Button>
      </Box>

      <Box>
        <Typography>
          Already have an account? <InlineButton onClick={openLogin}>Login</InlineButton> to the
          app!
        </Typography>
      </Box>
    </CommonModal>
  )
}
