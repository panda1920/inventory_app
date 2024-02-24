import { Box, Dialog, DialogTitle, styled, useTheme } from '@mui/material'
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
  const theme = useTheme()

  return (
    <Dialog
      open={isOpen}
      onClose={close}
      PaperProps={{
        className: clsx('sm:min-w-[600px]', paperClass),
        style: { paddingBlock: theme.spacing(2), ...paperStyle },
      }}
    >
      <DialogTitle variant='h5'>{title}</DialogTitle>
      <DialogContent className='!pt-0'>{children}</DialogContent>
    </Dialog>
  )
}

const DialogContent = styled(Box)(({ theme }) => ({
  paddingBlock: theme.spacing(2),
  paddingInline: theme.spacing(3),
}))
