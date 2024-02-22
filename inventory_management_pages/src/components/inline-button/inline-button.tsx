import { ReactNode } from 'react'

type InlineButtonProps = {
  children?: ReactNode
  onClick?: () => void | Promise<void>
}

export default function InlineButton({ children, onClick }: InlineButtonProps) {
  return (
    <button onClick={onClick} className='appearance-none inline underline cursor-pointer'>
      {children}
    </button>
  )
}
