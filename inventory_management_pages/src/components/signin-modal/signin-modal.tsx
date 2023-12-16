import { Box } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'

import { useAuth } from '@/hooks/auth'

type SigninModalProps = {
  isOpen: boolean
  close: () => void
}

export default function SigninModal({ isOpen, close }: SigninModalProps) {
  const { loginWithEmail, loginWithGoogle, loginWithGithub } = useAuth(close)

  return (
    <Dialog open={isOpen} onClose={close}>
      <DialogTitle>Login</DialogTitle>
      <Box>
        <button onClick={loginWithEmail('korean.panda@gmail.com', 'password')}>
          Sign in with email
        </button>
        <button onClick={loginWithGoogle}>Sign in with Google</button>
        <button onClick={loginWithGithub}>Sign in with github</button>
      </Box>
    </Dialog>
  )
}
