import { useTheme } from '@mui/material'
import TextField from '@mui/material/TextField'
import React, { ComponentProps } from 'react'
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
  const theme = useTheme()

  // use a special converter when type === 'number'
  const convertStringToNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(event.target.value))
  }
  const changeHandler = type === 'number' ? convertStringToNumber : onChange

  return (
    <TextField
      inputProps={{
        className: '!ps-1',
        style: { borderColor: theme.palette.text.primary },
      }}
      InputLabelProps={{ style: { color: theme.palette.text.primary } }}
      sx={{
        '& .MuiInputBase-root::before': {
          borderColor: theme.palette.text.primary,
        },
        '& fieldset': {
          borderColor: theme.palette.text.primary,
        },
      }}
      onChange={changeHandler}
      type={type}
      {...restProps}
      {...restRhfField}
      inputRef={ref}
      error={invalid}
      // single space string to occupy height, prevent contents shifting downwards
      helperText={errorMessage || ' '}
    />
  )
}
