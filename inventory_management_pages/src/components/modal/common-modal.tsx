import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import clsx from 'clsx'
import { CSSProperties, ReactNode } from 'react'

type CommonModalProps = {
  isOpen: boolean
  close: () => void | Promise<void>
  title: string
  paperClass?: string
  paperStyle?: CSSProperties
  children: ReactNode
}

export default function CommonModal({
  isOpen,
  close,
  title,
  paperClass,
  paperStyle,
  children,
}: CommonModalProps) {
  return (
    <Dialog
      open={isOpen}
      onClose={close}
      PaperProps={{
        className: clsx('sm:min-w-[600px] py-4', paperClass),
        style: paperStyle,
      }}
    >
      <DialogTitle variant='h5'>{title}</DialogTitle>
      <DialogContent className='!pt-0'>{children}</DialogContent>
    </Dialog>
  )
}
