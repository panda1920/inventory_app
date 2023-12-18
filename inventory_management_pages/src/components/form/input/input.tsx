import TextField from '@mui/material/TextField'
import { ChangeEvent } from 'react'

type InputProps = {
  id?: string
  name?: string
  type?: string
  label?: string
  value?: any
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void | Promise<void>
}

export default function Input(props: InputProps) {
  return <TextField {...props} variant='outlined' />
}
