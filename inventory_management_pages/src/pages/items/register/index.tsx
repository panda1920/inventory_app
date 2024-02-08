import { Box, Button, Typography, useTheme } from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'

import withAuth from '@/components/hoc/with-auth/withAuth'
import { withServerSideHooks } from '@/helper/serverside-hooks'
import { RegisterItemSchema, registerItemSchema } from '@/types/form/item'
import Input from '@/components/form/input/input'
import { InventoryAppClientError } from '@/helper/errors'

function RegisterItem() {
  const theme = useTheme()
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const { reset, control, formState, handleSubmit } = useForm<RegisterItemSchema>({
    resolver: zodResolver(registerItemSchema),
    defaultValues: {
      name: '',
      quantity: 1,
    },
  })

  const onSubmit = handleSubmit(async (data) => {
    try {
      await registerItem(data)
      enqueueSnackbar('You have registered an item', { variant: 'success' })
      navigateBack()
    } catch (e) {
      reset()
      enqueueSnackbar('Registration failed.\nPlease try again', { variant: 'error' })
    }
  })

  const navigateBack = () => router.push('/items')

  return (
    <section
      className={`ms-[auto] me-[auto] flex flex-col`}
      style={{ width: `min(1000px, 100% - ${theme.spacing(2)})`, gap: theme.spacing(4) }}
    >
      <Typography variant='h3' className='text-center' style={{ marginBlock: theme.spacing(2) }}>
        Register Item
      </Typography>

      <form
        onSubmit={onSubmit}
        className='flex flex-col items-start'
        style={{ gap: theme.spacing(2) }}
      >
        <Input label='name' name='name' type='text' color='primary' control={control} />
        <Input label='quantity' name='quantity' type='number' control={control} />
        <Box className='flex flex-row content-start' style={{ gap: theme.spacing(2) }}>
          <Button
            type='submit'
            color='primary'
            disableElevation={true}
            className='text-center'
            disabled={formState.isSubmitting}
            variant='contained'
          >
            Register
          </Button>
          <Button
            type='button'
            color='secondary'
            disableElevation={true}
            className='text-center'
            variant='text'
            onClick={navigateBack}
          >
            Cancel
          </Button>
        </Box>
      </form>
    </section>
  )
}

export default withAuth(RegisterItem)

export const getServerSideProps = withServerSideHooks(async (context) => {
  // unauthenticated
  if (!context.user) {
    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    }
  }

  return {
    props: {},
  }
})

async function registerItem(payload: RegisterItemSchema) {
  const url = '/api/items'

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  const responseJson = await response.json()

  if (!response.ok) {
    console.error(JSON.stringify(responseJson))
    throw new InventoryAppClientError('Failed to call /api/items')
  }

  return responseJson
}
