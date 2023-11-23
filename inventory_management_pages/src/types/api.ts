import { GetServerSidePropsResult } from 'next'

export type SuccessResponseData = {
  success: true
}

export type FailResponseData = {
  success: false
  message?: string
}

export type LoginResponse = {
  token: string
}

export type GetServerSidePropsResultWithUserInfo<T> = GetServerSidePropsResult<
  T & { user: UserInfo }
>
