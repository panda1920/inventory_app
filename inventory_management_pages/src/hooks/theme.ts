import { getContrastRatio, useTheme } from '@mui/material'
import { CSSProperties } from 'react'

/**
 * Genearte an object that can be passed to style prop of react elements
 * @returns
 */
export function useBackgroundColorStyle() {
  const theme = useTheme()

  return {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
  } satisfies CSSProperties
}
