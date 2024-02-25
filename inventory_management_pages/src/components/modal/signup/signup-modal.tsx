import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button, Typography } from '@mui/material'
import Image from 'next/image'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import Input from '@/components/form/input'
import InlineButton from '@/components/inline-button/inline-button'
import CommonModal from '@/components/modal/common/common-modal'
import { useAuth } from '@/hooks/auth'
import { useAppSelector } from '@/store/hooks'
import { getColorScheme } from '@/store/slice/app'
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
  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur',
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirm: '',
    },
  })
  const colorScheme = useAppSelector(getColorScheme)

  // reset form state when modal opens
  useEffect(() => {
    isOpen && reset()
  }, [isOpen, reset])

  async function signupHandler(data: SignupSchema) {
    await signup(data)
  }

  return (
    <CommonModal isOpen={isOpen} close={close} title='Signup'>
      <Box className='flex flex-col sm:gap-8 gap-6'>
        <Box
          component='form'
          onSubmit={handleSubmit(signupHandler)}
          className='flex flex-col gap-1'
        >
          <Input
            label='Username'
            name='username'
            type='text'
            autoComplete='username'
            variant='standard'
            required
            control={control}
          />
          <Input
            label='Email'
            name='email'
            type='email'
            autoComplete='email'
            variant='standard'
            required
            control={control}
          />
          <Input
            label='Password'
            name='password'
            type='password'
            autoComplete='new-password'
            variant='standard'
            required
            control={control}
          />
          <Input
            label='Confirm password'
            name='confirm'
            type='password'
            autoComplete='new-password'
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
            SIGNUP
          </Button>
        </Box>

        <Box className='flex flex-col gap-4'>
          <Typography>Signup with the following providers:</Typography>
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
            Already have an account? <InlineButton onClick={openLogin}>Login</InlineButton> to the
            app!
          </Typography>
        </Box>
      </Box>
    </CommonModal>
  )
}
