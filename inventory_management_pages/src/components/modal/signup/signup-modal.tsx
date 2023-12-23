import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button, Typography } from '@mui/material'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import Input from '@/components/form/input/input'
import InlineButton from '@/components/inline-button/inline-button'
import CommonModal from '@/components/modal/common/common-modal'
import { useAuth } from '@/hooks/auth'
import { SignupSchema, signupSchema } from '@/types/form/signup'

type SignupModalProps = {
  isOpen: boolean
  close: () => void
  openLogin: () => void
}

export default function SignupModal({ isOpen, close, openLogin }: SignupModalProps) {
  const { loginWithGoogleHandler, loginWithGithubHandler, signup } = useAuth({
    afterLoginAction: close,
  })
  const { handleSubmit, control, reset } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // reset form state when modal opens
  useEffect(() => {
    isOpen && reset()
  }, [isOpen, reset])

  async function signupHandler(data: SignupSchema) {
    await signup(data)
  }

  return (
    <CommonModal isOpen={isOpen} close={close} title='Signup'>
      <Box component='form' onSubmit={handleSubmit(signupHandler)}>
        <Typography>Signup with email</Typography>
        <Input label='email' name='email' type='email' autoComplete='email' control={control} />
        <Input
          label='password'
          name='password'
          type='password'
          autoComplete='new-password'
          control={control}
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
