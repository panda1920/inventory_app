import TextField from '@mui/material/TextField'
import { ComponentProps } from 'react'
import { Control, FieldValues, Path, useController } from 'react-hook-form'

type InputProps<T extends FieldValues> = ComponentProps<typeof TextField> & {
  name: Path<T>
  control: Control<T>
}

export default function Input<T extends FieldValues>(props: InputProps<T>) {
  const { name, control, ...restProps } = props
  const {
    field: { ref, ...restRhfField },
    fieldState: { invalid },
    formState: { errors },
  } = useController({ name, control })
  const errorMessage = String(errors?.[name]?.message ?? '')

  return (
    <TextField
      variant='outlined'
      {...restProps}
      {...restRhfField}
      inputRef={ref}
      error={invalid}
      helperText={errorMessage}
    />
  )
}
