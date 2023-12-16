import Link from 'next/link'

import { withServerSideHooks } from '@/helper/serverside-hooks'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchCount, getCurrentCount, incrementAction } from '@/store/slice/counter'

export default function Counter() {
  const count = useAppSelector(getCurrentCount)
  const status = useAppSelector((state) => state.counter.status)
  const dispatch = useAppDispatch()

  const increment = () => dispatch(incrementAction())
  const asyncGet = () => dispatch(fetchCount())

  return (
    <section>
      {status === 'pending' ? <div>Loading</div> : <div>Counter: {count}</div>}
      <button onClick={increment}>increment</button>
      <button onClick={asyncGet}>async get</button>
      <Link href='/sample'>Sample</Link>
    </section>
  )
}

export const getServerSideProps = withServerSideHooks()
