import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button, Typography, useTheme } from '@mui/material'
import Image from 'next/image'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import Input from '@/components/form/input'
import InlineButton from '@/components/inline-button/inline-button'
import CommonModal from '@/components/modal/common/common-modal'
import { useAuth } from '@/hooks/auth'
import { useAppSelector } from '@/store/hooks'
import { getColorScheme } from '@/store/slice/app'
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
  const theme = useTheme()
  const colorScheme = useAppSelector(getColorScheme)

  // reset form state when modal opens
  useEffect(() => {
    isOpen && reset()
  }, [isOpen, reset])

  async function loginHandler(data: LoginSchema) {
    await login(data)
  }

  return (
    <CommonModal isOpen={isOpen} close={close} title='Login'>
      <Box className='flex flex-col' sx={{ gap: { xs: theme.spacing(3), sm: theme.spacing(4) } }}>
        <Box
          component='form'
          onSubmit={handleSubmit(loginHandler)}
          className='flex flex-col'
          style={{ gap: theme.spacing(0.5) }}
        >
          <Input
            label='Email'
            type='email'
            name='email'
            autoComplete='email'
            variant='standard'
            required
            control={control}
          />
          <Input
            label='Password'
            type='password'
            name='password'
            autoComplete='current-password'
            variant='standard'
            required
            control={control}
          />
          <Button
            type='submit'
            color='primary'
            variant='contained'
            className='self-start'
            style={{ marginBlock: theme.spacing(1) }}
            disabled={isSubmitting}
          >
            LOGIN
          </Button>
        </Box>

        <Box className='flex flex-col' style={{ gap: theme.spacing(2) }}>
          <Typography>Login with the following providers:</Typography>
          <Box className='flex flex-row items-baseline' style={{ gap: theme.spacing(2) }}>
            <Button
              onClick={loginWithGoogleHandler}
              disableElevation={true}
              className='!p-0 !min-w-0 hover:opacity-80'
            >
              <Image
                src='/assets/google.svg'
                alt='Google'
                width='36'
                height='36'
                className='w-[36px] h-auto'
              />
            </Button>
            <Button
              onClick={loginWithGithubHandler}
              disableElevation={true}
              className='!p-0 !min-w-0 hover:opacity-80'
            >
              <Image
                src={
                  colorScheme === 'light'
                    ? '/assets/github-mark.svg'
                    : '/assets/github-mark-white.svg'
                }
                alt='Github'
                width='36'
                height='36'
                className='w-[36px] h-auto'
              />
            </Button>
          </Box>
        </Box>

        <Box>
          <Typography>
            Don&apos;t have an account? <InlineButton onClick={openSignup}>Signup</InlineButton> to
            the app!
          </Typography>
        </Box>
      </Box>
    </CommonModal>
  )
}
