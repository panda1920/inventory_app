import { ThemeOptions, ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material'
import { ReactNode } from 'react'

import { useAppSelector } from '@/store/hooks'
import { getColorScheme } from '@/store/slice/app'

const commonThemeOptions = {
  // customize breakpoints so it aligns with tailwind values
  // https://tailwindcss.com/docs/responsive-design
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },
  // also make spacing align with tailwind values
  // https://mui.com/material-ui/customization/spacing/
  // https://tailwindcss.com/docs/customizing-spacing#default-spacing-scale
  spacing: 4,
  // https://stackoverflow.com/questions/72077974/what-is-the-purpose-of-the-fontsize-theme-setting-when-all-typography-variants-a
  // https://mui.com/material-ui/customization/typography/#font-size
  typography: {
    fontSize: 14,
    button: {
      textTransform: 'none',
    },
  },
  // https://mui.com/material-ui/customization/theme-components/
  components: {
    MuiTypography: {
      styleOverrides: {
        body2: {
          fontSize: '1.2em',
        },
      },
      // the below syntax seems to define a new variant
      variants: [{ props: { variant: 'body3' }, style: { fontSize: '1.4em' } }],
    },
  },
} satisfies Partial<ThemeOptions>

// https://mui.com/material-ui/customization/theming/
const lightModeTheme = responsiveFontSizes(
  createTheme({
    // https://mui.com/material-ui/guides/typescript/#customization-of-theme
    palette: {
      // primary: { main: '#A7CECB' },
      primary: { main: '#5BC0BE' },
      secondary: { main: '#333F47' },
      background: {
        paper: '#FFF2EA',
        default: '#FFF2EA',
      },
      text: {
        primary: 'rgba(0, 0, 0, 0.87)',
      },
      error: { main: '#BB255F' },
    },
    ...commonThemeOptions,
  }),
)

const darkModeTheme = responsiveFontSizes(
  createTheme({
    // https://mui.com/material-ui/guides/typescript/#customization-of-theme
    palette: {
      primary: { main: '#232A2F' },
      secondary: { main: '#A7CECB' },
      background: {
        paper: '#435058',
        default: '#435058',
      },
      text: {
        primary: '#e8e8e8',
      },
      error: { main: '#DA447D' },
    },
    ...commonThemeOptions,
  }),
)

type MaterialProviderProps = {
  children: ReactNode
}

export default function MaterialProvider({ children }: MaterialProviderProps) {
  const colorScheme = useAppSelector(getColorScheme)
  const theme = colorScheme === 'light' ? lightModeTheme : darkModeTheme

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
