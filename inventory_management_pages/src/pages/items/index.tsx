import Add from '@mui/icons-material/Add'
import Delete from '@mui/icons-material/Delete'
import Edit from '@mui/icons-material/Edit'
import PostAdd from '@mui/icons-material/PostAdd'
import Remove from '@mui/icons-material/Remove'
import Search from '@mui/icons-material/Search'
import { useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { darken } from '@mui/material/styles'
import clsx from 'clsx'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { ChangeEvent, useState } from 'react'

import withAuth from '@/components/hoc/with-auth/withAuth'
import { InventoryAppClientError } from '@/helper/errors'
import type { Item } from '@/types/entity/item'
import { UpdateItemSchema } from '@/types/form/item'

type ItemsProps = {
  items: Item[]
}

function Items({ items: fetchedItems }: ItemsProps) {
  const [allItems, setAllItems] = useState(fetchedItems)
  const [items, setItems] = useState(fetchedItems)
  const [keyword, setKeyword] = useState<string>('')
  const router = useRouter()
  const theme = useTheme()
  const { enqueueSnackbar } = useSnackbar()

  // useEffect(() => {}, [items])

  const addQuantity = async (toAdd: number, item: Item) => {
    const itemIndex = allItems.findIndex((i) => i.id === item.id)

    try {
      await updateItem(item.id!, { ...item, quantity: item.quantity + toAdd })
      item.quantity += toAdd
      const newAllItems = [...allItems.slice(0, itemIndex), item, ...allItems.slice(itemIndex + 1)]
      setAllItems(newAllItems)
      applyFiltersToItems(newAllItems)
    } catch (e) {
      console.error(e)
    }
  }

  const deleteItemFromList = async (item: Item) => {
    const itemIndex = allItems.findIndex((i) => i.id === item.id)

    try {
      await deleteItem(item.id!)
      const newAllItems = [...allItems.slice(0, itemIndex), ...allItems.slice(itemIndex + 1)]
      setAllItems(newAllItems)
      applyFiltersToItems(newAllItems)
      enqueueSnackbar({
        message: 'You have deleted an item.',
        variant: 'success',
      })
    } catch (e) {
      console.error(e)
    }
  }

  const applyFiltersToItems = (newAllItems: Item[], filters?: { keyword: string }) => {
    let items = newAllItems

    // filter by keyword
    // prioritize incoming value over one already stored
    const kw = filters?.keyword ?? keyword
    if (kw) {
      items = newAllItems.filter((item) => item.name.match(new RegExp(`.*${kw}.*`, 'i')))
    }

    setItems(items)
  }

  const onSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value)
    applyFiltersToItems([...allItems], { keyword: e.target.value })
  }

  return (
    <Box className='flex flex-col gap-8'>
      <Box className='flex sm:flex-row sm:justify-between sm:align-middle sm:gap-0 flex-col gap-2'>
        <Box>
          <Typography variant='h4' component='h1'>
            Your Items
          </Typography>
        </Box>

        <Box className='flex flex-row flex-wrap gap-4'>
          <Button
            variant='contained'
            className='grow-0 self-start gap-1 items-center'
            onClick={() => router.push('/items/register')}
          >
            <PostAdd />
            <span>ADD ITEM</span>
          </Button>
        </Box>
      </Box>

      <Box component='section' className='flex flex-col gap-4'>
        <Box className='flex flex-row justify-between'>
          <Box className='flex flex-row justify-start items-end gap-[1em]'>
            <Box className='relative group'>
              <Search
                className={clsx(
                  'absolute left-2 top-1/2 translate-y-[-50%] group-focus-within:hidden',
                  keyword && '!hidden',
                )}
              />
              <input
                type='search'
                value={keyword}
                onChange={onSearch}
                autoComplete='search'
                className='py-2 px-2 rounded-md'
                style={{ backgroundColor: darken(theme.palette.background.default, 0.1) }}
              />
            </Box>
            <Typography>Displaying: {items.length} items</Typography>
          </Box>
        </Box>

        <Table className='rounded-md overflow-hidden'>
          <TableHead>
            <TableRow
              className=''
              style={{
                backgroundColor: darken(theme.palette.background.default, 0.2),
                color: theme.palette.primary.contrastText,
              }}
            >
              <TableCell className='!px-[.75em] !text-lg sm:!text-xl'>
                <Typography variant='h6' component='span' fontSize='inherit'>
                  ITEM
                </Typography>
              </TableCell>
              <TableCell align='right' className='!px-[.75em] !text-lg sm:!text-xl'>
                <Typography variant='h6' component='span' fontSize='inherit'>
                  QUANTITY
                </Typography>
              </TableCell>
              <TableCell align='right' className='!px-[.75em] !text-lg sm:!text-xl'>
                <Typography variant='h6' component='span' fontSize='inherit'>
                  ACTIONS
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {items.map((item, index) => (
              <ItemRow
                key={item.id}
                index={index}
                item={item}
                addQuantity={addQuantity}
                deleteItem={deleteItemFromList}
              />
            ))}
          </TableBody>
        </Table>

        {allItems.length === 0 && <Typography>No item data.</Typography>}
      </Box>
    </Box>
  )
}

export default withAuth(Items)

export const getServerSideProps: GetServerSideProps<ItemsProps> = async (_context) => {
  const { withServerSideHooks } = await import('@/helper/serverside-hooks')
  const { listItems } = await import('@/handlers/item')

  return withServerSideHooks<ItemsProps>(_context, async (context) => {
    // unauthenticated
    if (!context.user) {
      return {
        redirect: {
          destination: '/',
          permanent: true,
        },
      }
    }

    let items: Item[] = []
    items = await listItems({ limit: 100, ownerId: context.user.uid })

    return {
      props: {
        items,
      },
    }
  })
}

function ItemRow({
  item,
  index,
  addQuantity,
  deleteItem,
}: {
  item: Item
  index: number
  addQuantity: (toAdd: number, item: Item) => void
  deleteItem: (item: Item) => Promise<void>
}) {
  const theme = useTheme()
  const router = useRouter()
  const backgroundColorsPerParity = [
    darken(theme.palette.background.default, 0.1),
    theme.palette.background.default,
  ]
  const backgroundColor = backgroundColorsPerParity[+(index % 2 === 0)]

  return (
    <TableRow className='group' style={{ backgroundColor }}>
      <TableCell className='!py-3 !px-2 group-last:border-b-0'>
        <Typography className='overflow-x-hidden whitespace-nowrap text-ellipsis max-w- max-w-[80px] sm:overflow-x-auto sm:whitespace-normal sm:max-w-none'>
          {item.name}
        </Typography>
      </TableCell>
      <TableCell align='right' className='!py-3 !px-2 group-last:border-b-0'>
        <Typography>{item.quantity}</Typography>
      </TableCell>
      <TableCell align='right' className='!py-3 !px-2 group-last:border-b-0'>
        <Box className='flex flex-row items-center justify-end text-2xl'>
          <IconButton color='inherit' className='!p-1' onClick={() => addQuantity(1, item)}>
            <Add fontSize='inherit' />
          </IconButton>
          <IconButton color='inherit' className='!p-1' onClick={() => addQuantity(-1, item)}>
            <Remove fontSize='inherit' />
          </IconButton>
          <IconButton
            color='inherit'
            className='!p-1'
            onClick={() => router.push(`/items/${item.id}/edit`)}
          >
            <Edit fontSize='inherit' />
          </IconButton>
          <IconButton color='inherit' className='!p-1' onClick={() => deleteItem(item)}>
            <Delete fontSize='inherit' />
          </IconButton>
        </Box>
      </TableCell>
    </TableRow>
  )
}

async function updateItem(id: string, update: UpdateItemSchema) {
  const url = `/api/items/${id}`
  const options = {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(update),
  } satisfies RequestInit

  const response = await fetch(url, options)
  if (response.ok) return await response.json()

  console.error(response.body)
  console.error(response.status)
  throw new InventoryAppClientError('Item update failed')
}

async function deleteItem(id: string) {
  const url = `/api/items/${id}`
  const options = {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  } satisfies RequestInit

  const response = await fetch(url, options)
  if (response.ok) return await response.json()

  console.error(response.body)
  console.error(response.status)
  throw new InventoryAppClientError('Item delete failed')
}
