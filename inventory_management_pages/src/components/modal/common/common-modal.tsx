import { Dialog, DialogTitle } from '@mui/material'
import { Box } from '@mui/system'
import { ReactNode } from 'react'

type CommonModalProps = {
  isOpen: boolean
  close: () => void | Promise<void>
  title: string
  children: ReactNode
}

export default function CommonModal({ isOpen, close, title, children }: CommonModalProps) {
  return (
    <Dialog open={isOpen} onClose={close}>
      <DialogTitle>{title}</DialogTitle>
      <Box>{children}</Box>
    </Dialog>
  )
}
