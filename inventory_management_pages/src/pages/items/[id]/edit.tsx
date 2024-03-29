import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button, Typography } from '@mui/material'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { useForm } from 'react-hook-form'

import Input from '@/components/form/input'
import withAuth from '@/components/hoc/with-auth/withAuth'
import { InventoryAppBaseError, InventoryAppClientError } from '@/helper/errors'
import { Item } from '@/types/entity/item'
import { UpdateItemSchema, updateItemSchema } from '@/types/form/item'

type EditItemProps = {
  item: Item
}

function EditItem({ item }: EditItemProps) {
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const { reset, control, formState, handleSubmit } = useForm<UpdateItemSchema>({
    resolver: zodResolver(updateItemSchema),
    defaultValues: {
      name: item.name,
      quantity: item.quantity,
      memo: item.memo,
      sortOrder: item.sortOrder,
    },
  })

  const onSubmit = handleSubmit(async (data) => {
    try {
      await updateItem(String(router.query.id), data)
      enqueueSnackbar('You have updated an item', { variant: 'success' })
      navigateBack()
    } catch (e) {
      reset()
      enqueueSnackbar('Update failed.\nPlease try again', { variant: 'error' })
    }
  })

  const navigateBack = () => router.push('/items')

  return (
    <Box component='section' className={`flex flex-col gap-8`}>
      <Typography variant='h4' component='h1'>
        Edit Item
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
            UPDATE
          </Button>
          <Button
            type='button'
            color='secondary'
            disableElevation={true}
            className='text-center'
            variant='text'
            onClick={navigateBack}
          >
            CANCEL
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default withAuth(EditItem)

export const getServerSideProps: GetServerSideProps<EditItemProps> = async (_context) => {
  const { withServerSideHooks } = await import('@/helper/serverside-hooks')
  const { getItem } = await import('@/handlers/item')

  return withServerSideHooks<EditItemProps>(_context, async (context) => {
    // unauthenticated
    if (!context.user) return redirectToTop()

    try {
      const id = String(context.params?.id)
      const item = await getItem({ id, ownerId: context.user.uid })
      return {
        props: { item },
      }
    } catch (e) {
      if (e instanceof InventoryAppBaseError) console.error(e.message)
      return redirectToTop()
    }
  })

  function redirectToTop() {
    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    }
  }
}

async function updateItem(id: string, payload: UpdateItemSchema) {
  const url = `/api/items/${id}`

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  const responseJson = await response.json()

  if (!response.ok) {
    console.error(JSON.stringify(responseJson))
    throw new InventoryAppClientError(`Failed to call PATCH /api/items/${id}`)
  }

  return responseJson
}
