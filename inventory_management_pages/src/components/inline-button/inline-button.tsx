import { ReactNode } from 'react'

import styles from './inline-button.module.css'

type InlineButtonProps = {
  children?: ReactNode
  onClick?: () => void | Promise<void>
}

export default function InlineButton({ children, onClick }: InlineButtonProps) {
  return (
    <button className={styles.inlineButton} onClick={onClick}>
      {children}
    </button>
  )
}
