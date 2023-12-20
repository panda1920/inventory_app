import { Box, Dialog, DialogTitle, styled } from '@mui/material'
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
      <DialogContent>{children}</DialogContent>
    </Dialog>
  )
}

const DialogContent = styled(Box)(({ theme }) => ({
  paddingBlock: theme.spacing(2),
  paddingInline: theme.spacing(3),
}))
