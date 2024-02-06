import Add from '@mui/icons-material/Add'
import Delete from '@mui/icons-material/Delete'
import Edit from '@mui/icons-material/Edit'
import Remove from '@mui/icons-material/Remove'
import { Box, Checkbox, Typography, useTheme } from '@mui/material'
import { useEffect, useState } from 'react'

import withAuth from '@/components/hoc/with-auth/withAuth'
import { listItems } from '@/handlers/item'
import { InventoryAppClientError } from '@/helper/errors'
import { withServerSideHooks } from '@/helper/serverside-hooks'
import type { Item } from '@/types/entity/item'
import { UpdateItemSchema } from '@/types/form/item'

type ItemsProps = {
  items: Item[]
}

function Items({ items: fetchedItems }: ItemsProps) {
  const theme = useTheme()
  const [items, setItems] = useState(fetchedItems)
  const [itemsChecklist, setItemsChecklist] = useState(createNewItemsChecklist(items))

  useEffect(() => {
    setItemsChecklist(createNewItemsChecklist(items))
  }, [items])

  const createAddQuantity = (itemIndex: number) => {
    return async (toAdd: number) => {
      const item = items[itemIndex]

      try {
        await updateItem(item.id!, { quantity: item.quantity + toAdd })
        item.quantity += toAdd
        setItems([...items.slice(0, itemIndex), item, ...items.slice(itemIndex + 1)])
      } catch (e) {
        console.error(e)
      }
    }
  }

  const createDeleteItem = (itemIndex: number) => {
    return async () => {
      const item = items[itemIndex]

      try {
        await deleteItem(item.id!)
        setItems([...items.slice(0, itemIndex), ...items.slice(itemIndex + 1)])
      } catch (e) {
        console.error(e)
      }
    }
  }

  const onItemChecked = (isChecked: boolean, i: number) => {
    setItemsChecklist([...itemsChecklist.slice(0, i), isChecked, ...itemsChecklist.slice(i + 1)])
  }

  return (
    <section>
      <Typography variant='h3' style={{ marginBlock: theme.spacing(2) }} className='text-center'>
        Your Items
      </Typography>
      <ul
        className={`ms-[auto] me-[auto]`}
        style={{ width: `min(1000px, 100% - ${theme.spacing(2)})` }}
      >
        {items.map((item, index) => (
          <li key={item.id}>
            <ItemInList
              item={item}
              isChecked={itemsChecklist[index]}
              onChecked={(isChecked, _) => onItemChecked(isChecked, index)}
              addQuantity={createAddQuantity(index)}
              deleteItem={createDeleteItem(index)}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}

export default withAuth(Items)

export const getServerSideProps = withServerSideHooks<ItemsProps>(async (context) => {
  // unauthenticated
  if (!context.user) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
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

function createNewItemsChecklist(items: Item[]) {
  return Array<boolean>(items.length).fill(false)
}

function ItemInList({
  item,
  isChecked,
  onChecked,
  addQuantity,
  deleteItem,
}: {
  item: Item
  isChecked: boolean
  onChecked: (isChecked: boolean, item: Item) => void
  addQuantity: (toAdd: number) => void
  deleteItem: () => Promise<void>
}) {
  const theme = useTheme()

  return (
    <Box
      className='grid justify-items-start items-center text-white'
      style={{
        gridTemplateColumns: theme.spacing('auto', '1fr', 6, 'auto'),
        gap: theme.spacing(1),
        padding: theme.spacing(0, 2),
      }}
    >
      <Checkbox
        onChange={(_, isChecked) => onChecked(isChecked, item)}
        checked={isChecked}
        color='primary'
      />
      <Typography>{item.name}</Typography>
      <Typography className='justify-self-end'>{item.quantity}</Typography>
      <Box className='flex flex-row items-center text-2xl'>
        <Add
          fontSize='inherit'
          className='!transition-transform hover:scale-125 hover:cursor-pointer'
          onClick={() => addQuantity(1)}
        />
        <Remove
          fontSize='inherit'
          className='!transition-transform hover:scale-125 hover:cursor-pointer'
          onClick={() => addQuantity(-1)}
        />
        <Edit
          fontSize='inherit'
          className='!transition-transform hover:scale-125 hover:cursor-pointer'
        />
        <Delete
          fontSize='inherit'
          className='!transition-transform hover:scale-125 hover:cursor-pointer'
          onClick={deleteItem}
        />
      </Box>
    </Box>
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
