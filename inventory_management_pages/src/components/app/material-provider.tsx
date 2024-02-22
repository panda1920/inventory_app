import { ThemeProvider, createTheme } from '@mui/material'
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
  // https://stackoverflow.com/questions/72077974/what-is-the-purpose-of-the-fontsize-theme-setting-when-all-typography-variants-a
  typography: {
    fontSize: 12,
  },
  components: {
    MuiTypography: {
      variants: [
        // { props: { variant: 'body1' }, style: { fontSize: 11, backgroundColor: 'blue' } },
        // { props: { variant: 'body2' }, style: { fontSize: 32 } },
      ],
    },
  },
}

// https://mui.com/material-ui/customization/theming/
const lightModeTheme = createTheme({
  // https://mui.com/material-ui/guides/typescript/#customization-of-theme
  palette: {
    primary: { main: '#A7CECB' },
    secondary: { main: '#75704E' },
    tertiary: { main: '#FFEDE1' },
    // primary: { main: '#435058' },
    // background: { main: '#FFEDE1' },
    error: { main: '#B7245C' },
  },
  ...commonThemeOptions,
})

const darkModeTheme = createTheme({
  // https://mui.com/material-ui/guides/typescript/#customization-of-theme
  palette: {
    primary: { main: '#435058' },
    secondary: { main: '#A7CECB' },
    // secondary: { main: '#75704E' },
    // secondary: { main: '#FFEDE1' },
    // background: { main: '#FFEDE1' },
    error: { main: '#B7245C' },
  },
  ...commonThemeOptions,
})

type MaterialProviderProps = {
  children: ReactNode
}

export default function MaterialProvider({ children }: MaterialProviderProps) {
  const colorScheme = useAppSelector(getColorScheme)
  const theme = colorScheme === 'light' ? lightModeTheme : darkModeTheme

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
