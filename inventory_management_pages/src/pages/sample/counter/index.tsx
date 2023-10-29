import { GetServerSideProps } from 'next'

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
    </section>
  )
}

export const getServerSideProps = (async (context) => {
  context.res.setHeader('Set-Cookie', 'token=123')

  return {
    props: {},
  }
}) satisfies GetServerSideProps
