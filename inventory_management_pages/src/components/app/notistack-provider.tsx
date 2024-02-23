import { styled, useTheme } from '@mui/material'
import { MaterialDesignContent, SnackbarKey, SnackbarProvider, useSnackbar } from 'notistack'
import { ReactNode } from 'react'

type NotistackProviderType = {
  children: ReactNode
}

export default function NotistackProvider({ children }: NotistackProviderType) {
  const theme = useTheme()

  // customize colors to follow material ui theme
  // https://notistack.com/features/customization#override-styles
  const StyledMaterialDesignContent = styled(MaterialDesignContent)(() => ({
    '&.notistack-MuiContent-success': {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.contrastText,
    },
    '&.notistack-MuiContent-error': {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.contrastText,
    },
  }))

  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={3000}
      anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      preventDuplicate
      action={Dismiss}
      Components={{
        success: StyledMaterialDesignContent,
        error: StyledMaterialDesignContent,
      }}
    >
      {children}
    </SnackbarProvider>
  )
}

function Dismiss(snackbarId: SnackbarKey) {
  const { closeSnackbar } = useSnackbar()

  return (
    <button onClick={() => closeSnackbar(snackbarId)} className='pr-[12px]'>
      Dismiss
    </button>
  )
}
