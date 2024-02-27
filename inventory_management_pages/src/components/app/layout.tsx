import { Box } from '@mui/material'
import Head from 'next/head'
import { ReactNode } from 'react'

import Header from '@/components/header/header'
import LoginModal from '@/components/modal/login-modal'
import SignupModal from '@/components/modal/signup-modal'
import { setContentWidth } from '@/helper/tailwind'
import { useBackgroundColorStyle } from '@/hooks/theme'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { getIsLoginOpen, getIsSignupOpen, setLoginModal, setSignupModal } from '@/store/slice/modal'

type LayoutProps = {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const backgroundColorStyle = useBackgroundColorStyle()
  const isLoginOpen = useAppSelector(getIsLoginOpen)
  const isSignupOpen = useAppSelector(getIsSignupOpen)
  const dispatch = useAppDispatch()

  return (
    <Box className='grid grid-cols-1 grid-rows-[min-content_1fr] min-h-screen'>
      <Head>
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>
      <Header contentClassName={setContentWidth} />
      <Box component='main' style={{ ...backgroundColorStyle }}>
        <Box className={'py-8 ' + setContentWidth}>{children}</Box>
      </Box>

      <LoginModal isOpen={isLoginOpen} close={() => dispatch(setLoginModal(() => false))} />
      <SignupModal isOpen={isSignupOpen} close={() => dispatch(setSignupModal(() => false))} />
    </Box>
  )
}
