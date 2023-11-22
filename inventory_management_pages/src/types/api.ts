import { GetServerSidePropsResult } from 'next'

export type LoginResponse = {
  token: string
}

export type GetServerSidePropsResultWithUserInfo<T> = GetServerSidePropsResult<
  T & { user: UserInfo }
>
