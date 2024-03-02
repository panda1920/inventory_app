import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button, Typography } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import Input from '@/components/form/input'
import InlineButton from '@/components/inline-button/inline-button'
import CommonModal from '@/components/modal/common-modal'
import { useAuth } from '@/hooks/auth'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { getColorScheme } from '@/store/slice/app'
import { setLoginModal, setSignupModal } from '@/store/slice/modal'
import { LoginSchema, loginSchema } from '@/types/form/login'

type LoginModalProps = {
  isOpen: boolean
  close: () => void
}

export default function LoginModal({ isOpen, close }: LoginModalProps) {
  const { login, loginWithGoogleHandler, loginWithGithubHandler } = useAuth({
    afterLogin: afterLoginHandler,
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
  const colorScheme = useAppSelector(getColorScheme)
  const dispatch = useAppDispatch()
  const router = useRouter()

  // reset form state when modal opens
  useEffect(() => {
    isOpen && reset()
  }, [isOpen, reset])

  async function loginHandler(data: LoginSchema) {
    await login(data)
  }

  async function afterLoginHandler() {
    close()
    router.replace('/items')
  }

  return (
    <CommonModal isOpen={isOpen} close={close} title='Login'>
      <Box className='flex flex-col sm:gap-8 gap-6 '>
        <Box component='form' onSubmit={handleSubmit(loginHandler)} className='flex flex-col gap-1'>
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
            className='self-start !my-2'
            disabled={isSubmitting}
          >
            LOGIN
          </Button>
        </Box>

        <Box className='flex flex-col gap-4'>
          <Typography>Login with the following providers:</Typography>
          <Box className='flex flex-row items-baseline gap-4'>
            <Button
              onClick={loginWithGoogleHandler}
              disableElevation={true}
              className='!p-0 !min-w-0 hover:opacity-80'
            >
              <Image
                src='/assets/google.svg'
                alt='Google'
                width='32'
                height='32'
                className='aspect-[auto_1/1]'
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
                width='32'
                height='32'
                className='aspect-[auto_1/1]'
              />
            </Button>
          </Box>
        </Box>

        <Box>
          <Typography>
            Don&apos;t have an account?{' '}
            <InlineButton
              onClick={() => {
                dispatch(setLoginModal(() => false))
                dispatch(setSignupModal(() => true))
              }}
            >
              Signup
            </InlineButton>{' '}
            to the app!
          </Typography>
        </Box>
      </Box>
    </CommonModal>
  )
}
