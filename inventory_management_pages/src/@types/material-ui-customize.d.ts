export {}

declare module '@mui/material/styles' {
  // augment palette
  interface Palette {
    tertiary: Palette['primary']
  }
  interface PaletteOptions {
    tertiary?: PaletteOptions['primary']
  }
}
