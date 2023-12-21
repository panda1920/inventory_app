import TextField from '@mui/material/TextField'
import { ComponentProps } from 'react'

type InputProps = ComponentProps<typeof TextField>
// {
// id?: string
// name?: string
// type?: string
// label?: string
// value?: any
// autoComplete?: string
// onChange?: (e: ChangeEvent<HTMLInputElement>) => void | Promise<void>
// }

export default function Input(props: InputProps) {
  return <TextField variant='outlined' {...props} />
}
