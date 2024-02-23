import { Box } from '@mui/material'
import Head from 'next/head'
import { ReactNode } from 'react'

import Header from '@/components/header/header'
import { useBackgroundColorStyle } from '@/hooks/theme'

type LayoutProps = {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const backgroundColorStyle = useBackgroundColorStyle()

  return (
    <Box className='grid grid-cols-1 grid-rows-[min-content_1fr] min-h-screen'>
      <Head>
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>
      <Header />
      <main style={backgroundColorStyle}>{children}</main>
    </Box>
  )
}
