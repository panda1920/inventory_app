import TextField from '@mui/material/TextField'
import React, { ComponentProps, SyntheticEvent } from 'react'
import { Control, FieldValues, Path, useController } from 'react-hook-form'

type InputProps<T extends FieldValues> = ComponentProps<typeof TextField> & {
  name: Path<T>
  control: Control<T>
}

export default function Input<T extends FieldValues>(props: InputProps<T>) {
  const { name, control, type, ...restProps } = props
  const {
    field: { ref, onChange, ...restRhfField },
    fieldState: { invalid },
    formState: { errors },
  } = useController({ name, control })
  const errorMessage = String(errors?.[name]?.message ?? '')

  // use a special converter when type === 'number'
  const convertStringToNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(event.target.value))
  }
  const changeHandler = type === 'number' ? convertStringToNumber : onChange

  return (
    <TextField
      variant='outlined'
      onChange={changeHandler}
      type={type}
      {...restProps}
      {...restRhfField}
      inputRef={ref}
      error={invalid}
      helperText={errorMessage}
    />
  )
}
