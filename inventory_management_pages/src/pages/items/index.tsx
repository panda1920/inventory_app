import { Typography } from '@mui/material'

import { listItems } from '@/handlers/item'
import { withServerSideHooks } from '@/helper/serverside-hooks'
import type { Item } from '@/types/entity/item'

type ItemsProps = {
  items: Item[]
}

export default function Items({ items }: ItemsProps) {
  return (
    <section>
      <h1>User</h1>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <Typography>
              Item: {item.name} * {item.quantity}
            </Typography>
            <Typography>Created at: {item.createdAt}</Typography>
          </li>
        ))}
      </ul>
    </section>
  )
}

export const getServerSideProps = withServerSideHooks<ItemsProps>(async (context) => {
  let items: Item[] = []
  if (context.user) {
    items = await listItems({ limit: 10, ownerId: context.user.uid })
  }

  return {
    props: {
      items,
    },
  }
})
