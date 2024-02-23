import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button, Typography } from '@mui/material'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import Input from '@/components/form/input'
import InlineButton from '@/components/inline-button/inline-button'
import CommonModal from '@/components/modal/common/common-modal'
import { useAuth } from '@/hooks/auth'
import { LoginSchema, loginSchema } from '@/types/form/login'

type LoginModalProps = {
  isOpen: boolean
  close: () => void
  openSignup: () => void
}

export default function LoginModal({ isOpen, close, openSignup }: LoginModalProps) {
  const { login, loginWithGoogleHandler, loginWithGithubHandler } = useAuth({
    afterLoginAction: close,
  })
  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
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

  async function loginHandler(data: LoginSchema) {
    await login(data)
  }

  return (
    <CommonModal isOpen={isOpen} close={close} title='Login'>
      <Box component='form' onSubmit={handleSubmit(loginHandler)}>
        <Typography>Login with email</Typography>
        <Input label='Email' type='email' name='email' autoComplete='email' control={control} />
        <Input
          label='Password'
          type='password'
          name='password'
          autoComplete='current-password'
          control={control}
        />
        <Button
          type='submit'
          color='primary'
          disableElevation={true}
          sx={{ textAlign: 'center' }}
          disabled={isSubmitting}
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
