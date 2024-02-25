import { Box, useTheme } from '@mui/material'
import Head from 'next/head'
import { ReactNode } from 'react'

import Header from '@/components/header/header'
import { useBackgroundColorStyle } from '@/hooks/theme'

type LayoutProps = {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const theme = useTheme()
  const backgroundColorStyle = useBackgroundColorStyle()

  return (
    <Box className='grid grid-cols-1 grid-rows-[min-content_1fr] min-h-screen'>
      <Head>
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>
      <Header />
      <Box component='main' style={{ ...backgroundColorStyle }}>
        <Box
          className='ms-[auto] me-[auto] py-8'
          style={{
            width: `min(1000px, 100% - ${theme.spacing(8)})`,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  )
}
