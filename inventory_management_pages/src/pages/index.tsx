import ArrowForward from '@mui/icons-material/ArrowForward'
import { Divider, useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { GetServerSideProps } from 'next'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { withServerSideHooks } from '@/helper/serverside-hooks'
import { setContentWidth } from '@/helper/tailwind'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setSignupModal } from '@/store/slice/modal'
import { checkLogin } from '@/store/slice/user'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const router = useRouter()
  const isLoggedIn = useAppSelector(checkLogin)
  const dispatch = useAppDispatch()
  const theme = useTheme()

  // if loggedin send user to items page
  useEffect(() => {
    if (isLoggedIn) router.replace('/items')
  }, [isLoggedIn, router])

  return (
    <Box className={`items-center justify-between ${inter.className}`}>
      <Box
        component='section'
        className='sm:py-32 py-20'
        style={{ backgroundColor: theme.palette.primary.main, color: theme.palette.text.primary }}
      >
        <Box className={'grid sm:grid-cols-2 sm:gap-16 gap-8 sm:items-center ' + setContentWidth}>
          <Box className='sm:block'>
            <Typography variant='h2' component='p' className='!my-[.5em] sm:text-left text-center'>
              Manage Your Belongings
            </Typography>
            <Typography className='!my-[1em]'>
              Keep track of all your consumables so that you&apos;ll never have too much or too
              little stuff. No more accidental purchase of something you already have!
            </Typography>
            <Box className='flex flex-row sm:text-lg !my-[1em] sm:justify-start justify-center'>
              <Button
                variant='contained'
                color='secondary'
                className='!py-[1em] !px-[2em] sm:!text-lg !rounded-full gap-[.5em]'
                onClick={() => dispatch(setSignupModal(() => true))}
              >
                SIGNUP
                <ArrowForward />
              </Button>
            </Box>
          </Box>
          <Image src='/assets/hero.svg' width={1104} height={805} alt='hero image' />
        </Box>
      </Box>

      <Box component='section' className='sm:py-32 py-20'>
        <Box className={'sm:grid sm:grid-cols-2 sm:gap-16 flex flex-col gap-8 ' + setContentWidth}>
          <Box className='bg-gray-300 aspect-[16/9] relative'>
            <Typography className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
              Placeholder
            </Typography>
          </Box>
          <Box>
            <Typography>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo blanditiis officiis
              atque. Nisi aliquid labore dolore, incidunt ea fugiat voluptatibus inventore vel illum
              asperiores, minima recusandae dolor repudiandae voluptatem debitis nesciunt nemo
              maiores laborum sint ab mollitia possimus! Eos ut ullam recusandae dignissimos illum
              molestias, temporibus numquam perspiciatis modi quae?
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider className={'!m-auto ' + setContentWidth} variant='middle' />

      <Box component='section' className='sm:py-32 py-20'>
        <Box
          className={
            'sm:grid sm:grid-cols-2 sm:gap-16 flex flex-col-reverse gap-8 ' + setContentWidth
          }
        >
          <Box>
            <Typography>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo blanditiis officiis
              atque. Nisi aliquid labore dolore, incidunt ea fugiat voluptatibus inventore vel illum
              asperiores, minima recusandae dolor repudiandae voluptatem debitis nesciunt nemo
              maiores laborum sint ab mollitia possimus! Eos ut ullam recusandae dignissimos illum
              molestias, temporibus numquam perspiciatis modi quae?
            </Typography>
          </Box>
          <Box className='bg-gray-300 aspect-[16/9] relative'>
            <Typography className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
              Placeholder2
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export const getServerSideProps: GetServerSideProps = (_context) => {
  return withServerSideHooks(_context, async (context) => {
    // if loggedin send user to items page
    if (context.user) {
      return {
        redirect: {
          destination: '/items',
          permanent: false,
        },
      }
    }

    return {
      props: {},
    }
  })
}
