import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { useForm } from 'react-hook-form'

import Input from '@/components/form/input'
import withAuth from '@/components/hoc/with-auth/withAuth'
import { InventoryAppClientError } from '@/helper/errors'
import { withServerSideHooks } from '@/helper/serverside-hooks'
import { RegisterItemSchema, registerItemSchema } from '@/types/form/item'

function RegisterItem() {
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const { reset, control, formState, handleSubmit } = useForm<RegisterItemSchema>({
    resolver: zodResolver(registerItemSchema),
    defaultValues: {
      name: '',
      quantity: 1,
      memo: '',
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
    <section className={`ms-[auto] me-[auto] flex flex-col gap-8`}>
      <Typography variant='h4' component='h1' className='text-center'>
        Register Item
      </Typography>

      <Box component='form' onSubmit={onSubmit} className='flex flex-col items-stretch gap-4'>
        <Input label='name' name='name' type='text' color='primary' control={control} />
        <Input label='quantity' name='quantity' type='number' control={control} />
        <Input
          label='memo'
          name='memo'
          type='text'
          multiline={true}
          minRows={5}
          maxRows={5}
          control={control}
        />
        <Box className='flex flex-row content-start gap-4'>
          <Button
            type='submit'
            color='primary'
            disableElevation={true}
            className='text-center'
            disabled={formState.isSubmitting}
            variant='contained'
          >
            Add
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
      </Box>
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
    throw new InventoryAppClientError('Failed to call POST /api/items')
  }

  return responseJson
}
